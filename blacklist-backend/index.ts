import Fastify from "fastify";
import cors from "@fastify/cors";

const fastify = Fastify({
  logger: true,
});

// allow requests from frontend server (thats running on port 3000)
await fastify.register(cors, {
  origin: ["http://localhost:3000"],
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

  return {
    message: "Website testing started",
    url: url,
    status: "in_progress"
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
