# ElevenLabs AI Clone - Setup Guide

This application now includes real voice chat functionality using OpenAI and ElevenLabs APIs.

## Prerequisites

1. **OpenAI API Key** - Get from [OpenAI Platform](https://platform.openai.com/api-keys)
2. **ElevenLabs API Key** - Get from [ElevenLabs Platform](https://elevenlabs.io/app/account)

## Installation

1. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` file with your API keys:**
   ```env
   VITE_OPENAI_API_KEY=sk-your-openai-key-here
   VITE_ELEVENLABS_API_KEY=your-elevenlabs-key-here
   ```

## Running the Application

```bash
npm run dev
# or
bun dev
```

## Features Implemented

### Voice Chat
- **Real-time voice recording** using Web Audio API
- **Speech-to-speech conversation** with AI agents
- **ElevenLabs voice synthesis** for natural AI responses
- **Push-to-talk interface** for easy voice interaction

### AI Integration
- **OpenAI GPT-4** for intelligent conversation
- **Configurable agent settings** (temperature, system prompts, etc.)
- **ElevenLabs Conversational AI** for seamless voice chat

### Voice Controls
- **Microphone recording** with visual feedback
- **Mute/unmute functionality** for audio playback
- **Audio visualization** during playback
- **Error handling** for microphone permissions

## How to Use

1. **Launch the app** and click "Test AI agent"
2. **Allow microphone access** when prompted
3. **Hold the microphone button** to record your voice message
4. **Release to send** - the AI will process and respond with voice
5. **Use the mute button** to disable audio playback if needed

## API Configuration

### OpenAI Settings
- Model: GPT-4 (configurable)
- Temperature: 0.7 (configurable)
- Max tokens: 500 (configurable)

### ElevenLabs Settings
- Default voice: Rachel (21m00Tcm4TlvDq8ikWAM)
- Model: Flash v2.5 for low latency
- Output format: PCM 16kHz for optimal quality

## Security Considerations

⚠️ **Important:** This implementation uses `dangerouslyAllowBrowser: true` for OpenAI, which exposes your API key in the browser. For production use:

1. **Create a backend proxy** to handle API calls
2. **Store API keys server-side** only
3. **Implement rate limiting** and usage monitoring
4. **Use environment variables** on the server

## Troubleshooting

### Common Issues

1. **"Failed to access microphone"**
   - Check browser permissions for microphone access
   - Ensure you're running on HTTPS or localhost

2. **"Invalid or missing OpenAI API key"**
   - Verify your `.env` file has the correct OpenAI key
   - Check that the key has sufficient credits

3. **"Failed to initialize voice chat"**
   - Verify your ElevenLabs API key is valid
   - Check your ElevenLabs account quota

### Browser Support
- **Chrome/Edge:** Full support
- **Firefox:** Full support
- **Safari:** Requires HTTPS for microphone access

## Development Notes

### File Structure
- `/src/api/chat.ts` - OpenAI integration
- `/src/api/elevenlabs.ts` - ElevenLabs voice chat
- `/src/config/api.ts` - API configuration
- `/src/components/TestAgentDialog.tsx` - Voice chat UI

### Key Components
- `VoiceChat` class for managing voice conversations
- `textToSpeech()` for converting text to audio
- `playAudioBuffer()` for audio playback
- Audio recording using MediaRecorder API

## Next Steps

1. **Implement backend proxy** for secure API key handling
2. **Add conversation history** persistence
3. **Implement voice activity detection** for hands-free use
4. **Add support for multiple languages**
5. **Integrate with agent configuration** from the UI tabs