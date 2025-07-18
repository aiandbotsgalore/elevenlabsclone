export const apiConfig = {
  openai: {
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    baseURL: import.meta.env.VITE_OPENAI_BASE_URL || 'https://api.openai.com/v1',
  },
  elevenlabs: {
    apiKey: import.meta.env.VITE_ELEVENLABS_API_KEY,
    baseURL: import.meta.env.VITE_ELEVENLABS_BASE_URL || 'https://api.elevenlabs.io/v1',
  },
};

export const validateApiKeys = () => {
  const missing = [];
  
  if (!apiConfig.openai.apiKey) {
    missing.push('VITE_OPENAI_API_KEY');
  }
  
  if (!apiConfig.elevenlabs.apiKey) {
    missing.push('VITE_ELEVENLABS_API_KEY');
  }
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};