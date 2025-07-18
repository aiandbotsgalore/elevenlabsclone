import OpenAI from 'openai';
import { apiConfig, validateApiKeys } from '../config/api';

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface AgentConfig {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

let openaiClient: OpenAI | null = null;

const initializeOpenAI = () => {
  if (!openaiClient) {
    try {
      validateApiKeys();
      openaiClient = new OpenAI({
        apiKey: apiConfig.openai.apiKey,
        baseURL: apiConfig.openai.baseURL,
        dangerouslyAllowBrowser: true, // Note: In production, use a backend proxy
      });
    } catch (error) {
      console.error('Failed to initialize OpenAI client:', error);
      throw error;
    }
  }
  return openaiClient;
};

export async function fetchAIResponse(
  messages: ChatMessage[], 
  config: AgentConfig = {}
) {
  try {
    const client = initializeOpenAI();
    
    const {
      model = 'gpt-4',
      temperature = 0.7,
      maxTokens = 500,
      systemPrompt = "You are a helpful AI assistant created by ElevenLabs. You provide concise, accurate information about voice technology, conversational AI, and related topics."
    } = config;

    // Prepare messages with system prompt
    const apiMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }))
    ];

    const completion = await client.chat.completions.create({
      model,
      messages: apiMessages,
      temperature,
      max_tokens: maxTokens,
      stream: false,
    });

    return {
      status: "success" as const,
      data: completion
    };

  } catch (error) {
    console.error("Error in fetchAIResponse:", error);
    
    let errorMessage = "Unknown error occurred";
    
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        errorMessage = "Invalid or missing OpenAI API key. Please check your environment variables.";
      } else if (error.message.includes('quota')) {
        errorMessage = "OpenAI API quota exceeded. Please check your billing settings.";
      } else if (error.message.includes('rate limit')) {
        errorMessage = "Rate limit exceeded. Please try again in a moment.";
      } else {
        errorMessage = error.message;
      }
    }
    
    return {
      status: "error" as const,
      error: errorMessage
    };
  }
}
