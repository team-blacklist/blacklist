import Fastify from "fastify";
import cors from "@fastify/cors";
import { chromium, type Response } from "playwright";
import fs from "fs";
import path from "path";

const fastify = Fastify({
  logger: true,
});

// allow requests from frontend server (thats running on port 3000)
await fastify.register(cors, {
  origin: ["http://localhost:3000"],
});

const OUTDIR_BASE = "scraped_websites";

function safeFilename(url: string) {
  const s = url.replace(/[:/?#&=]+/g, "_");
  return s.length > 0 ? s.slice(0, 200) : "resource";
}

async function scrapeWebsite(url: string, outDir: string, maxDepth = 2, visited = new Set<string>()) {
  if (visited.has(url) || visited.size >= 50) return; // avoid loops and too many pages
  visited.add(url);

  console.log(`Scraping: ${url}`);

  // Delete only once, before the first page scrape
  if (visited.size === 1) {
    if (fs.existsSync(outDir)) fs.rmSync(outDir, { recursive: true, force: true });
    fs.mkdirSync(outDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const resources = new Map<string, Buffer>();

  page.on("response", (r: Response) => {
    r.body().then((buf) => {
      if (buf && !r.url().startsWith("data:")) {
        resources.set(r.url(), Buffer.from(buf));
      }
    }).catch(() => {});
  });

  await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });

  // Collect DOM content and links
  const domData = await page.evaluate(() => {
    const urls: string[] = [];
    document.querySelectorAll(
      "img, script, link[rel='stylesheet'], source, video, audio, iframe, embed"
    ).forEach((el) => {
      const src = el.getAttribute("src") || el.getAttribute("href") || el.getAttribute("data-src");
      if (src) urls.push(src);
    });

    const inlineScripts = Array.from(document.querySelectorAll("script:not([src])")).map(
      (s) => s.textContent || ""
    );
    const inlineStyles = Array.from(document.querySelectorAll("style")).map((s) => s.textContent || "");

    const internalLinks = Array.from(document.querySelectorAll("a[href]"))
      .map((a) => (a as HTMLAnchorElement).href)
      .filter((href) => href.startsWith(window.location.origin));

    return { urls, inlineScripts, inlineStyles, internalLinks };
  });

  const pageFolder = path.join(outDir, safeFilename(url));
  fs.mkdirSync(pageFolder, { recursive: true });

  // Save DOM lists
  fs.writeFileSync(path.join(pageFolder, "dom_urls.json"), JSON.stringify(domData.urls, null, 2));
  fs.writeFileSync(path.join(pageFolder, "inline_scripts.js"), domData.inlineScripts.join("\n\n/* --- */\n\n"));
  fs.writeFileSync(path.join(pageFolder, "inline_styles.css"), domData.inlineStyles.join("\n\n/* --- */\n\n"));

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


fastify.post("/test-website", async (request, reply) => {
  const { url } = request.body as { url: string };
  
  if (!url) {
    return reply.status(400).send({ error: "URL is required" });
  }

  try {
    new URL(url);
  } catch {
    return reply.status(400).send({ error: "Invalid URL format" });
  }
  const websiteDir = path.join(OUTDIR_BASE, safeFilename(url));

  // Run scraping asynchronously in the background
  scrapeWebsite(url, websiteDir)
    .then(() => console.log(`Scraping completed for ${url}`))
    .catch((err) => console.error(err));

  return {
    message: "Website testing started",
    url: url,
    status: "in_progress",
    outputFolder: websiteDir
  };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: "0.0.0.0" });
    console.log("Server running on http://localhost:3001");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
