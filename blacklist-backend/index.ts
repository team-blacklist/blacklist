import Fastify from "fastify";
import cors from "@fastify/cors";
import { runCompletePenTest } from "./PenTestingAgent/agent_runner";
import { scrapeWebsite, getWebsiteDir } from "./website-scraper";
import fastifyStatic from '@fastify/static';
import path from 'path';
import fs from 'fs';

const fastify = Fastify({
  logger: true,
});

await fastify.register(fastifyStatic, {
  root: path.join(process.cwd(), 'results'), // your results folder
  prefix: '/results/', // frontend can access files via /results/filename
});

// Optional: endpoint to list available result files
fastify.get('/results/list', async (request, reply) => {
  const files = fs.readdirSync(path.join(process.cwd(), 'results'));
  return { files };
});

// Allow requests from frontend server (running on port 3000)
await fastify.register(cors, {
  origin: ["http://localhost:3000"],
});

// API Routes
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

  const websiteDir = getWebsiteDir(url);

  // Run scraping asynchronously in the background
  scrapeWebsite(url, websiteDir)
    .then(() => console.log(`Scraping completed for ${url}`))
    .catch((err) => console.error("Scraping error:", err));

  // Run complete penetration testing with analysis
  const penTestResult = await runCompletePenTest(url);

  console.log("\n📊 === PENETRATION TEST SUMMARY ===");
  console.log(`Target: ${penTestResult.target_url}`);
  console.log(`Timestamp: ${penTestResult.timestamp}`);
  console.log("Raw findings available in result");
  console.log("Security analysis available in result");

  return {
    message: "Website testing started",
    url: url,
    status: "in_progress",
    outputFolder: websiteDir,
  };
});

// Social Engineering Attack endpoint
fastify.post("/social-engineering", async (request, reply) => {
  const { url } = request.body as { url: string };

  if (!url) {
    return reply.status(400).send({ error: "URL is required" });
  }

  try {
    new URL(url);
  } catch {
    return reply.status(400).send({ error: "Invalid URL format" });
  }

  // TODO: Implement social engineering attack logic
  console.log(`Social engineering attack initiated for: ${url}`);
  
  return {
    message: "Social engineering attack initiated",
    url: url,
    status: "initiated",
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
