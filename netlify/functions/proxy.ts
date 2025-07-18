import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import OpenAI from 'openai';
import { ElevenLabsClient } from 'elevenlabs';
import { Readable } from "stream";

const openaiClient = new OpenAI({
  apiKey: process.env.VITE_OPENAI_API_KEY,
});

const elevenlabsClient = new ElevenLabsClient({
  apiKey: process.env.VITE_ELEVENLABS_API_KEY,
});

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  const { path } = event;

  if (path.includes("/api/chat")) {
    const { messages, config } = JSON.parse(event.body || "{}");
    try {
      const completion = await openaiClient.chat.completions.create({
        model: config.model || 'gpt-4',
        messages: messages,
        temperature: config.temperature || 0.7,
        max_tokens: config.maxTokens || 500,
        stream: false,
      });
      return {
        statusCode: 200,
        body: JSON.stringify({ status: "success", data: completion }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ status: "error", error: error.message }),
      };
    }
  }

  if (path.includes("/api/elevenlabs/voices")) {
    try {
      const voices = await elevenlabsClient.voices.getAll();
      return {
        statusCode: 200,
        body: JSON.stringify(voices),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ status: "error", error: error.message }),
      };
    }
  }

  if (path.includes("/api/elevenlabs/tts")) {
    const { text, config } = JSON.parse(event.body || "{}");
    try {
      const audioStream = await elevenlabsClient.generate({
        stream: true,
        voice: config.voiceId || "21m00Tcm4TlvDq8ikWAM",
        text,
        model_id: config.modelId || "eleven_turbo_v2",
      });

      const readable = new Readable({
        async read() {
          for await (const chunk of audioStream) {
            this.push(chunk);
          }
          this.push(null);
        }
      });

      const chunks = [];
      for await (const chunk of readable) {
        chunks.push(chunk);
      }
      const content = Buffer.concat(chunks);

      return {
        statusCode: 200,
        body: content.toString('base64'),
        isBase64Encoded: true,
        headers: {
            "Content-Type": "audio/mpeg"
        }
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ status: "error", error: error.message }),
      };
    }
  }

  return {
    statusCode: 404,
    body: "Not Found",
  };
};

export { handler };
