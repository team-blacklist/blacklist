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

  console.log(`Social engineering attack initiated for: ${url}`);

  try {
    // ElevenLabs Batch Calling API
    const response = await fetch("https://api.elevenlabs.io/v1/convai/batch-calling/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": process.env.ELEVENLABS_API_KEY || "",
      },
      body: JSON.stringify({
        call_name: `Social Engineering - ${new Date().toISOString()}`,
        agent_id: "agent_5701k7wd56ggfentc4sh6byprmga",
        agent_phone_number_id: process.env.ELEVENLABS_AGENT_PHONE_NUMBER_ID || "",
        recipients: [
          {
            phone_number: "+65 91069046"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs API error:", errorText);
      return reply.status(500).send({ 
        error: "Failed to initiate call",
        details: errorText
      });
    }

    const batchCallResult = await response.json();
    console.log("Batch call submitted:", batchCallResult);

    return {
      message: "Social engineering call initiated",
      url: url,
      status: "call_submitted",
      batch_id: batchCallResult.batch_id || batchCallResult.id,
      elevenlabs_response: batchCallResult
    };

  } catch (error) {
    console.error("Error making ElevenLabs call:", error);
    return reply.status(500).send({ 
      error: "Failed to initiate call",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// Check batch call status and analyze transcript
fastify.get("/social-engineering/status/:batchId", async (request, reply) => {
  const { batchId } = request.params as { batchId: string };

  if (!batchId) {
    return reply.status(400).send({ error: "Batch ID is required" });
  }

  try {
    // Get batch call details from ElevenLabs
    const response = await fetch(`https://api.elevenlabs.io/v1/convai/batch-calling/${batchId}`, {
      method: "GET",
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY || "",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs API error:", errorText);
      return reply.status(500).send({ 
        error: "Failed to get call status",
        details: errorText
      });
    }

    const batchData = await response.json();
    console.log("Batch call status:", batchData);

    // Check if call is completed and analyze transcript
    let socialEngineeringSuccess = false;
    let transcript = "";
    let callStatus = batchData.status || "unknown";
    let recipientStatus = "unknown";

    // Look for transcript in the response
    if (batchData.recipients && batchData.recipients.length > 0) {
      const recipient = batchData.recipients[0];
      recipientStatus = recipient.status || "unknown";
      
      // If call is completed and we have a conversation ID, fetch the conversation details
      if (recipientStatus === "completed" && recipient.conversation_id) {
        try {
          console.log("Fetching conversation details for:", recipient.conversation_id);
          
          const conversationResponse = await fetch(`https://api.elevenlabs.io/v1/convai/conversations/${recipient.conversation_id}`, {
            method: "GET",
            headers: {
              "xi-api-key": process.env.ELEVENLABS_API_KEY || "",
            },
          });

          if (conversationResponse.ok) {
            const conversationData = await conversationResponse.json();
            console.log("Conversation data:", JSON.stringify(conversationData, null, 2));
            
            // Extract transcript from conversation data
            if (conversationData.transcript) {
              // If transcript is an array of messages
              if (Array.isArray(conversationData.transcript)) {
                transcript = conversationData.transcript
                  .map((msg: any) => msg.content || msg.text || msg.message || "")
                  .join(" ");
              } else if (typeof conversationData.transcript === "string") {
                transcript = conversationData.transcript;
              }
            } else if (conversationData.messages) {
              // Alternative structure - extract from messages
              transcript = conversationData.messages
                .map((msg: any) => msg.content || msg.text || msg.message || "")
                .join(" ");
            }
          } else {
            console.error("Failed to fetch conversation:", await conversationResponse.text());
          }
        } catch (convError) {
          console.error("Error fetching conversation:", convError);
        }
      } else {
        // Fallback: check for transcript directly in recipient data
        if (recipient.transcript) {
          transcript = recipient.transcript;
        } else if (recipient.conversation_transcript) {
          transcript = recipient.conversation_transcript;
        } else if (recipient.conversation_data) {
          transcript = JSON.stringify(recipient.conversation_data);
        }
      }
      
      if (transcript) {
        // Check for "gracias" keyword (case-insensitive)
        socialEngineeringSuccess = transcript.toLowerCase().includes("gracias");
        console.log("Transcript analysis - Found gracias:", socialEngineeringSuccess);
        console.log("Full transcript:", transcript.substring(0, 200) + "...");
      }
    }

    return {
      batch_id: batchId,
      call_status: callStatus,
      recipient_status: recipientStatus,
      social_engineering_success: socialEngineeringSuccess,
      transcript: transcript,
      raw_response: batchData
    };

  } catch (error) {
    console.error("Error checking call status:", error);
    return reply.status(500).send({ 
      error: "Failed to check call status",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
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
