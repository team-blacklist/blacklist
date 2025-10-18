import Fastify from "fastify";
import cors from "@fastify/cors";
import { chromium, type Response } from "playwright";
import fs from "fs";
import path from "path";

// Load environment variables explicitly for Bun
if (!process.env.BROWSERBASE_API_KEY) {
  console.error("❌ BROWSERBASE_API_KEY is not set!");
  console.log("Please create a .env file with:");
  console.log("BROWSERBASE_API_KEY=your_key_here");
  console.log("BROWSERBASE_PROJECT_ID=your_project_id_here");
  process.exit(1);
}

import { ensureSessionAndBrowser, getPlaywrightTools, cleanupBrowser } from "./PenTestingAgent/playwright-tools";

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

fastify.post("/browser/init", {
  schema: {
    body: {
      type: 'object',
      properties: {},
      additionalProperties: true
    }
  }
}, async (request, reply) => {
  try {
    console.log("🚀 Initializing Browserbase session...");
    const liveViewLink = await ensureSessionAndBrowser();
    
    if (!liveViewLink) {
      throw new Error("Failed to get live view link");
    }

    return {
      success: true,
      liveViewLink,
      message: "Browser session initialized successfully"
    };
  } catch (error: any) {
    console.error("❌ Browser initialization failed:", error);
    return reply.status(500).send({
      success: false,
      error: error.message || "Failed to initialize browser session"
    });
  }
});

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

  try {
    // Initialize Browserbase session and get live view link
    console.log("🎬 Initializing browser session for testing...");
    const liveViewLink = await ensureSessionAndBrowser();
    
    // Get Playwright tools (browser is now ready)
    const tools = await getPlaywrightTools();
    
    console.log("🔴 Live View Link:", liveViewLink);
    
    const websiteDir = path.join(OUTDIR_BASE, safeFilename(url));

    // Run scraping asynchronously in the background
    scrapeWebsite(url, websiteDir)
      .then(() => console.log(`✅ Scraping completed for ${url}`))
      .catch((err) => console.error("❌ Scraping error:", err));

    return {
      message: "Website testing started",
      url: url,
      status: "in_progress",
      outputFolder: websiteDir,
      liveViewLink: liveViewLink, // Send live view link to frontend
      browserReady: true
    };
  } catch (error: any) {
    console.error("❌ Error initializing browser:", error);
    return reply.status(500).send({
      error: "Failed to initialize browser session",
      details: error.message
    });
  }
});

fastify.addHook('onClose', async () => {
  console.log("🧹 Cleaning up browser sessions...");
  await cleanupBrowser();
});

process.on('SIGINT', async () => {
  console.log("\n🛑 Shutting down gracefully...");
  await cleanupBrowser();
  await fastify.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log("\n🛑 Shutting down gracefully...");
  await cleanupBrowser();
  await fastify.close();
  process.exit(0);
});

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: "0.0.0.0" });
    console.log("✅ Server running on http://localhost:3001");
    console.log("\n📋 Available endpoints:");
    console.log("  POST /browser/init    - Initialize Browserbase session");
    console.log("  POST /test-website   - Test website with live browser view\n");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();