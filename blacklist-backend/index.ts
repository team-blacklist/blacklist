import Fastify from "fastify";
import cors from "@fastify/cors";

const fastify = Fastify({
  logger: true,
});

// allow requests from frontend server (thats running on port 3000)
await fastify.register(cors, {
  origin: ["http://localhost:3000"],
});

fastify.get("/greeting", async (request, reply) => {
  return { message: "hello" };
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
