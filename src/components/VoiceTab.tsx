import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAvailableVoices } from "@/api/elevenlabs";

interface Voice {
  voice_id: string;
  name: string;
}

interface VoiceTabProps {
  selectedVoice: string;
  setSelectedVoice: (voiceId: string) => void;
}

export default function VoiceTab({ selectedVoice, setSelectedVoice }: VoiceTabProps) {
  const [voices, setVoices] = useState<Voice[]>([]);

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const availableVoices = await getAvailableVoices();
        setVoices(availableVoices);
        if (availableVoices.length > 0 && !selectedVoice) {
          setSelectedVoice(availableVoices[0].voice_id);
        }
      } catch (error) {
        console.error("Failed to fetch voices:", error);
      }
    };
    fetchVoices();
  }, [selectedVoice, setSelectedVoice]);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Voice Settings</h3>
      <div className="space-y-2">
        <label htmlFor="voice-select" className="text-sm font-medium">
          Voice
        </label>
        <Select value={selectedVoice} onValueChange={setSelectedVoice}>
          <SelectTrigger id="voice-select" className="w-[280px]">
            <SelectValue placeholder="Select a voice" />
          </SelectTrigger>
          <SelectContent>
            {voices.map((voice) => (
              <SelectItem key={voice.voice_id} value={voice.voice_id}>
                {voice.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
