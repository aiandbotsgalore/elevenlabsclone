import { apiConfig } from '../config/api';

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

export async function fetchAIResponse(
  messages: ChatMessage[], 
  config: AgentConfig = {}
) {
  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages, config }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch AI response');
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error("Error in fetchAIResponse:", error);
    
    let errorMessage = "Unknown error occurred";
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return {
      status: "error" as const,
      error: errorMessage
    };
  }
}
