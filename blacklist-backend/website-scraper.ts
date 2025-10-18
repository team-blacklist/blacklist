import { chromium, type Response } from "playwright";
import fs from "fs";
import path from "path";

const OUTDIR_BASE = "scraped_websites";

function safeFilename(url: string) {
  const s = url.replace(/[:/?#&=]+/g, "_");
  return s.length > 0 ? s.slice(0, 200) : "resource";
}

export async function scrapeWebsite(
  url: string,
  outDir: string,
  maxDepth = 2,
  visited = new Set<string>()
) {
  if (visited.has(url) || visited.size >= 50) return; // avoid loops and too many pages
  visited.add(url);

  console.log(`Scraping: ${url}`);

  // Delete only once, before the first page scrape
  if (visited.size === 1) {
    if (fs.existsSync(outDir))
      fs.rmSync(outDir, { recursive: true, force: true });
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const resources = new Map<string, Buffer>();

  page.on("response", (r: Response) => {
    r.body()
      .then((buf) => {
        if (buf && !r.url().startsWith("data:")) {
          resources.set(r.url(), Buffer.from(buf));
        }
      })
      .catch(() => {});
  });

  await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });

  // Collect DOM content and links
  const domData = await page.evaluate(() => {
    const urls: string[] = [];
    document
      .querySelectorAll(
        "img, script, link[rel='stylesheet'], source, video, audio, iframe, embed"
      )
      .forEach((el) => {
        const src =
          el.getAttribute("src") ||
          el.getAttribute("href") ||
          el.getAttribute("data-src");
        if (src) urls.push(src);
      });

    const inlineScripts = Array.from(
      document.querySelectorAll("script:not([src])")
    ).map((s) => s.textContent || "");
    const inlineStyles = Array.from(document.querySelectorAll("style")).map(
      (s) => s.textContent || ""
    );

    const internalLinks = Array.from(document.querySelectorAll("a[href]"))
      .map((a) => (a as HTMLAnchorElement).href)
      .filter((href) => href.startsWith(window.location.origin));

    return { urls, inlineScripts, inlineStyles, internalLinks };
  });

  const pageFolder = path.join(outDir, safeFilename(url));
  fs.mkdirSync(pageFolder, { recursive: true });

  // Save DOM lists
  fs.writeFileSync(
    path.join(pageFolder, "dom_urls.json"),
    JSON.stringify(domData.urls, null, 2)
  );
  fs.writeFileSync(
    path.join(pageFolder, "inline_scripts.js"),
    domData.inlineScripts.join("\n\n/* --- */\n\n")
  );
  fs.writeFileSync(
    path.join(pageFolder, "inline_styles.css"),
    domData.inlineStyles.join("\n\n/* --- */\n\n")
  );

  // Save network resources
  for (const [urlKey, buf] of resources) {
    const filename = path.join(pageFolder, safeFilename(urlKey));
    try {
      fs.writeFileSync(filename, buf);
    } catch {
      fs.writeFileSync(filename + ".meta.txt", `${urlKey}`);
    }
  }

  await browser.close();

  // Recursively scrape internal links (up to maxDepth)
  if (maxDepth > 1) {
    for (const link of domData.internalLinks) {
      await scrapeWebsite(link, outDir, maxDepth - 1, visited);
    }
  }
}

// Helper function to get the output directory for a URL
export function getWebsiteDir(url: string): string {
  return path.join(OUTDIR_BASE, safeFilename(url));
}

// Export the safe filename function for reuse
export { safeFilename };