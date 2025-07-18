import { ElevenLabsApi, ElevenLabsApiOptions } from 'elevenlabs';
import { apiConfig, validateApiKeys } from '../config/api';

interface VoiceConfig {
  voiceId?: string;
  modelId?: string;
  stability?: number;
  similarityBoost?: number;
  style?: number;
  useSpeakerBoost?: boolean;
  optimizeStreamingLatency?: number;
  outputFormat?: string;
}

interface ConversationConfig {
  agentId?: string;
  voiceSettings?: VoiceConfig;
  conversationConfig?: {
    agentPrompt?: string;
    language?: string;
    llm?: {
      model?: string;
      temperature?: number;
    };
  };
}

let elevenlabsClient: ElevenLabsApi | null = null;

const initializeElevenLabs = () => {
  if (!elevenlabsClient) {
    try {
      validateApiKeys();
      const options: ElevenLabsApiOptions = {
        apiKey: apiConfig.elevenlabs.apiKey,
      };
      elevenlabsClient = new ElevenLabsApi(options);
    } catch (error) {
      console.error('Failed to initialize ElevenLabs client:', error);
      throw error;
    }
  }
  return elevenlabsClient;
};

export async function textToSpeech(
  text: string, 
  config: VoiceConfig = {}
): Promise<ArrayBuffer> {
  try {
    const client = initializeElevenLabs();
    
    const {
      voiceId = "21m00Tcm4TlvDq8ikWAM", // Default Rachel voice
      modelId = "eleven_flash_v2_5",
      stability = 0.5,
      similarityBoost = 0.8,
      style = 0.0,
      useSpeakerBoost = true,
      optimizeStreamingLatency = 2,
      outputFormat = "mp3_44100_128"
    } = config;

    const audioBuffer = await client.textToSpeech.textToSpeech(voiceId, {
      text,
      model_id: modelId,
      voice_settings: {
        stability,
        similarity_boost: similarityBoost,
        style,
        use_speaker_boost: useSpeakerBoost,
      },
      output_format: outputFormat as any,
      optimize_streaming_latency: optimizeStreamingLatency,
    });

    return audioBuffer;
  } catch (error) {
    console.error('Error in textToSpeech:', error);
    throw new Error(`TTS failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function getAvailableVoices() {
  try {
    const client = initializeElevenLabs();
    const response = await client.voices.getVoices();
    return response.voices || [];
  } catch (error) {
    console.error('Error fetching voices:', error);
    throw new Error(`Failed to fetch voices: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function createConversationalAgent(config: ConversationConfig = {}) {
  try {
    const client = initializeElevenLabs();
    
    const agentConfig = {
      name: "Custom Agent",
      agent_defaults: {
        llm: {
          model: config.conversationConfig?.llm?.model || "gpt-4",
          temperature: config.conversationConfig?.llm?.temperature || 0.7,
        },
        tts: {
          voice_id: config.voiceSettings?.voiceId || "21m00Tcm4TlvDq8ikWAM",
          model_id: config.voiceSettings?.modelId || "eleven_flash_v2_5",
          voice_settings: {
            stability: config.voiceSettings?.stability || 0.5,
            similarity_boost: config.voiceSettings?.similarityBoost || 0.8,
            style: config.voiceSettings?.style || 0.0,
            use_speaker_boost: config.voiceSettings?.useSpeakerBoost || true,
          },
          optimize_streaming_latency: config.voiceSettings?.optimizeStreamingLatency || 2,
          output_format: config.voiceSettings?.outputFormat || "pcm_16000",
        },
        first_message: "Hello! How can I help you today?",
        system_prompt: config.conversationConfig?.agentPrompt || "You are a helpful AI assistant created by ElevenLabs.",
        language: config.conversationConfig?.language || "en",
      },
    };

    const response = await client.conversationalAi.createAgent(agentConfig);
    return response;
  } catch (error) {
    console.error('Error creating conversational agent:', error);
    throw new Error(`Failed to create agent: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function startConversation(agentId: string) {
  try {
    const client = initializeElevenLabs();
    const response = await client.conversationalAi.createConversation(agentId);
    return response;
  } catch (error) {
    console.error('Error starting conversation:', error);
    throw new Error(`Failed to start conversation: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export class VoiceChat {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording = false;
  private conversationId: string | null = null;
  private agentId: string | null = null;

  constructor(agentId: string) {
    this.agentId = agentId;
  }

  async initialize() {
    if (!this.agentId) throw new Error('Agent ID required');
    
    try {
      const conversation = await startConversation(this.agentId);
      this.conversationId = conversation.conversation_id;
      return conversation;
    } catch (error) {
      throw new Error(`Failed to initialize voice chat: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  async startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      this.audioChunks = [];
      
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };
      
      this.mediaRecorder.start();
      this.isRecording = true;
      
      return true;
    } catch (error) {
      console.error('Error starting recording:', error);
      throw new Error('Failed to access microphone');
    }
  }

  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || !this.isRecording) {
        reject(new Error('No active recording'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        this.isRecording = false;
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
      this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
    });
  }

  async sendAudioMessage(audioBlob: Blob): Promise<ArrayBuffer> {
    if (!this.conversationId) {
      throw new Error('No active conversation');
    }

    try {
      const client = initializeElevenLabs();
      
      // Convert blob to buffer for API
      const arrayBuffer = await audioBlob.arrayBuffer();
      
      const response = await client.conversationalAi.addUserAudioToConversation(
        this.conversationId,
        Buffer.from(arrayBuffer)
      );
      
      return response;
    } catch (error) {
      console.error('Error sending audio message:', error);
      throw new Error(`Failed to send audio: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  getRecordingState() {
    return this.isRecording;
  }
}

export async function playAudioBuffer(audioBuffer: ArrayBuffer) {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const audioBufferSource = audioContext.createBufferSource();
    
    const decodedBuffer = await audioContext.decodeAudioData(audioBuffer.slice(0));
    audioBufferSource.buffer = decodedBuffer;
    audioBufferSource.connect(audioContext.destination);
    audioBufferSource.start(0);
    
    return new Promise<void>((resolve) => {
      audioBufferSource.onended = () => resolve();
    });
  } catch (error) {
    console.error('Error playing audio:', error);
    throw new Error('Failed to play audio response');
  }
}