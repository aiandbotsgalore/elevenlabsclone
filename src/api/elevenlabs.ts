export async function textToSpeech(
  text: string, 
  config = {}
): Promise<ArrayBuffer> {
  try {
    const response = await fetch('/api/elevenlabs/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, config }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch audio response');
    }

    const audioData = await response.arrayBuffer();
    return audioData;
  } catch (error) {
    console.error('Error in textToSpeech:', error);
    throw new Error(`TTS failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function streamTextToSpeech(
  text: string,
  config = {}
): Promise<ReadableStream<Uint8Array>> {
  const response = await fetch('/api/elevenlabs/tts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, config }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch audio stream');
  }

  if (!response.body) {
    throw new Error('Response body is empty');
  }

  return response.body;
}

export async function playAudioBuffer(audioBuffer: ArrayBuffer) {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const audioBufferSource = audioContext.createBufferSource();
    
    const decodedBuffer = await audioContext.decodeAudioData(audioBuffer);
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

export async function getAvailableVoices() {
  const response = await fetch('/api/elevenlabs/voices');
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to fetch available voices');
  }
  const data = await response.json();
  return data.voices;
}