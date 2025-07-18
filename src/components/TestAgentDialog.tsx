import { useState, useRef, useEffect } from "react";
import { Mic, MicOff, Volume2, VolumeX, User, Bot } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { fetchAIResponse } from "@/api/chat";
import { streamTextToSpeech } from "@/api/elevenlabs";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
  isAudio?: boolean;
}

interface TestAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedVoice: string;
}

export default function TestAgentDialog({ open, onOpenChange, selectedVoice }: TestAgentDialogProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm ready for voice chat. Click the microphone to start talking.",
      timestamp: new Date(),
    },
  ]);
  
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    if (open && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, [open]);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        processAudio(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      const recordingMessage: Message = {
        id: `recording-${Date.now()}`,
        role: "user",
        content: "🎤 Recording...",
        timestamp: new Date(),
        isAudio: true,
      };
      setMessages(prev => [...prev, recordingMessage]);
    } catch (error) {
      console.error('Failed to start recording:', error);
      setError('Failed to access microphone. Please check permissions.');
    }
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
      setMessages(prev => 
        prev.map(msg => 
          msg.content === "🎤 Recording..." 
            ? { ...msg, content: "Processing audio..." }
            : msg
        )
      );
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = async () => {
        const base64Audio = (reader.result as string).split(',')[1];

        const response = await fetchAIResponse([{ role: 'user', content: `data:audio/webm;base64,${base64Audio}` }]);

        if (response.status === 'success') {
          const aiResponseText = response.data.choices[0].message.content;

          setMessages(prev =>
            prev.map(msg =>
              msg.content === "Processing audio..."
                ? { ...msg, content: "🎤 Audio message sent" }
                : msg
            )
          );

          const aiMessage: Message = {
            id: `ai-${Date.now()}`,
            role: "assistant",
            content: aiResponseText,
            timestamp: new Date(),
          };
          setMessages(prev => [...prev, aiMessage]);

          if (!isMuted) {
            playStreamingAudio(aiResponseText);
          }
        } else {
          throw new Error(response.error);
        }
      };
    } catch (error) {
      console.error('Error processing audio:', error);
      setError('Failed to process audio message');
      setMessages(prev => 
        prev.filter(msg => !msg.content.includes("Recording") && !msg.content.includes("Processing"))
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const playStreamingAudio = async (text: string) => {
    if (!audioContextRef.current) return;

    setIsPlaying(true);
    const audioStream = await streamTextToSpeech(text, { voiceId: selectedVoice });
    const reader = audioStream.getReader();
    const audioContext = audioContextRef.current;

    const playChunk = async (chunk: ArrayBuffer) => {
      try {
        const audioBuffer = await audioContext.decodeAudioData(chunk);
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();
        audioSourceRef.current = source;
        return new Promise<void>(resolve => {
          source.onended = () => resolve();
        });
      } catch (error) {
        console.error("Error playing audio chunk:", error);
      }
    };

    const processStream = async () => {
      while (true) {
        try {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }
          await playChunk(value.buffer);
        } catch (error) {
          console.error("Error reading from stream:", error);
          break;
        }
      }
      setIsPlaying(false);
      audioSourceRef.current = null;
    };

    processStream();
  };

  const stopAudio = () => {
    if (audioSourceRef.current) {
      audioSourceRef.current.stop();
      audioSourceRef.current = null;
    }
    setIsPlaying(false);
  };

  const handleMicPress = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startRecording();
    }
  };

  const handleMicRelease = () => {
    if (isRecording) {
      stopRecording();
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (!isMuted) {
      stopAudio();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full bg-green-500`} />
            Voice Chat with AI Agent
          </DialogTitle>
          <DialogDescription>
            Have a natural voice conversation with the AI agent
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-md p-3 text-red-600 text-sm">
            {error}
          </div>
        )}

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {message.role === "user" ? (
                    <>
                      <span className="text-xs font-medium">You</span>
                      <User className="h-3 w-3" />
                    </>
                  ) : (
                    <>
                      <span className="text-xs font-medium">AI Agent</span>
                      <Bot className="h-3 w-3" />
                    </>
                  )}
                </div>
                <p className={message.isAudio ? "font-medium" : ""}>{message.content}</p>
                <div className="text-right">
                  <span className="text-xs opacity-70">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {(isProcessing || isPlaying) && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg bg-secondary px-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs ml-2">
                    {isProcessing ? "Processing..." : "Playing response..."}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="flex items-center justify-center gap-4 py-4">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleMute}
            className="h-12 w-12"
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </Button>
          
          <Button
            size="lg"
            className={`h-16 w-16 rounded-full ${
              isRecording 
                ? "bg-red-500 hover:bg-red-600 animate-pulse" 
                : "bg-primary hover:bg-primary/90"
            }`}
            onMouseDown={handleMicPress}
            onMouseUp={handleMicRelease}
            onTouchStart={handleMicPress}
            onTouchEnd={handleMicRelease}
            disabled={isProcessing}
          >
            {isRecording || isPlaying ? (
              <MicOff className="h-6 w-6" />
            ) : (
              <Mic className="h-6 w-6" />
            )}
          </Button>
          
          <div className="w-12 h-12 flex items-center justify-center">
            {isPlaying && (
              <div className="flex space-x-1">
                <div className="w-1 h-4 bg-primary animate-bounce" style={{animationDelay: '0ms'}}></div>
                <div className="w-1 h-4 bg-primary animate-bounce" style={{animationDelay: '150ms'}}></div>
                <div className="w-1 h-4 bg-primary animate-bounce" style={{animationDelay: '300ms'}}></div>
              </div>
            )}
          </div>
        </DialogFooter>

        <div className="text-center text-xs text-muted-foreground pb-2">
          {isRecording 
            ? "Release to send your message" 
            : isPlaying
            ? "Click the mic to interrupt"
            : "Hold the microphone button to speak"
          }
        </div>
      </DialogContent>
    </Dialog>
  );
}
