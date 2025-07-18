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
import { VoiceChat, textToSpeech, playAudioBuffer, createConversationalAgent } from "@/api/elevenlabs";

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
}

export default function TestAgentDialog({ open, onOpenChange }: TestAgentDialogProps) {
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
  const [agentId, setAgentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  
  const voiceChatRef = useRef<VoiceChat | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize the voice chat agent when dialog opens
  useEffect(() => {
    if (open && !agentId) {
      initializeAgent();
    }
  }, [open]);

  const initializeAgent = async () => {
    try {
      setError(null);
      
      // Create a conversational agent
      const agent = await createConversationalAgent({
        conversationConfig: {
          agentPrompt: "You are a helpful AI assistant created by ElevenLabs. You provide concise, natural responses in voice conversations about technology, voice synthesis, and general topics. Keep responses conversational and under 100 words.",
          language: "en",
          llm: {
            model: "gpt-4",
            temperature: 0.7,
          }
        },
        voiceSettings: {
          voiceId: "21m00Tcm4TlvDq8ikWAM", // Rachel
          stability: 0.5,
          similarityBoost: 0.8,
        }
      });
      
      setAgentId(agent.agent_id);
      
      // Initialize voice chat
      voiceChatRef.current = new VoiceChat(agent.agent_id);
      await voiceChatRef.current.initialize();
      
    } catch (error) {
      console.error('Failed to initialize agent:', error);
      setError(error instanceof Error ? error.message : 'Failed to initialize voice chat');
    }
  };

  const startRecording = async () => {
    if (!voiceChatRef.current) {
      setError('Voice chat not initialized');
      return;
    }

    try {
      setError(null);
      await voiceChatRef.current.startRecording();
      setIsRecording(true);
      
      // Add recording indicator message
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
    if (!voiceChatRef.current || !isRecording) return;

    try {
      setIsRecording(false);
      setIsProcessing(true);
      
      // Update recording message
      setMessages(prev => 
        prev.map(msg => 
          msg.content === "🎤 Recording..." 
            ? { ...msg, content: "Processing audio..." }
            : msg
        )
      );

      const audioBlob = await voiceChatRef.current.stopRecording();
      
      // Convert audio to text and get AI response
      const responseAudio = await voiceChatRef.current.sendAudioMessage(audioBlob);
      
      // Update message to show audio was processed
      setMessages(prev => 
        prev.map(msg => 
          msg.content === "Processing audio..." 
            ? { ...msg, content: "🎤 Audio message sent" }
            : msg
        )
      );

      // Add AI response message
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: "🔊 AI Voice Response",
        timestamp: new Date(),
        isAudio: true,
      };
      setMessages(prev => [...prev, aiMessage]);

      // Play the AI response
      if (!isMuted) {
        setIsPlaying(true);
        await playAudioBuffer(responseAudio);
        setIsPlaying(false);
      }

    } catch (error) {
      console.error('Error processing audio:', error);
      setError('Failed to process audio message');
      
      // Remove recording message on error
      setMessages(prev => 
        prev.filter(msg => !msg.content.includes("Recording") && !msg.content.includes("Processing"))
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${agentId ? 'bg-green-500' : 'bg-yellow-500'}`} />
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
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            disabled={isProcessing || !agentId}
          >
            {isRecording ? (
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
            : "Hold the microphone button to speak"
          }
        </div>
      </DialogContent>
    </Dialog>
  );
}
