import { Check, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Slider } from "./ui/slider";
import FormSection from "./FormSection";

export default function VoiceTab() {
  return (
    <div className="flex flex-col gap-6">
      {/* Voice */}
      <FormSection
        title="Voice"
        description="Select the ElevenLabs voice you want to use for the agent."
      >
        <div className="flex w-full">
          <div className="w-[200px]">
            <Select defaultValue="eric">
              <SelectTrigger className="bg-secondary">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white">
                    <span className="text-xs">E</span>
                  </div>
                  <SelectValue placeholder="Eric" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="eric">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white">
                      <span className="text-xs">E</span>
                    </div>
                    Eric
                  </div>
                </SelectItem>
                <SelectItem value="rachel">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-500 text-white">
                      <span className="text-xs">R</span>
                    </div>
                    Rachel
                  </div>
                </SelectItem>
                <SelectItem value="adam">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white">
                      <span className="text-xs">A</span>
                    </div>
                    Adam
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormSection>

      {/* Use Flash */}
      <FormSection
        title="Use Flash"
        description="Flash is our new recommended model for low latency use cases. For more comparison between Turbo and Flash, refer here."
      >
        <div className="w-full">
          <div className="flex justify-between">
            <div className="flex items-center gap-4">
              <Switch defaultChecked />
              <span className="text-sm text-muted-foreground">Enabled</span>
            </div>
            <Button variant="link" size="sm" className="h-auto p-0 text-xs text-primary">
              refer here
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Your agent will use Flash v2.
          </p>
        </div>
      </FormSection>

      {/* TTS output format */}
      <FormSection
        title="TTS output format"
        description="Select the output format you want to use for ElevenLabs text to speech."
      >
        <div className="w-[200px]">
          <Select defaultValue="pcm">
            <SelectTrigger className="bg-secondary">
              <SelectValue placeholder="PCM 16000 Hz" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pcm">PCM 16000 Hz</SelectItem>
              <SelectItem value="mp3">MP3 44100 Hz</SelectItem>
              <SelectItem value="wav">WAV 44100 Hz</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </FormSection>

      {/* Pronunciation Dictionaries */}
      <FormSection
        title="Pronunciation Dictionaries"
        description="Lexicon dictionary files will apply pronunciation replacements to agent responses. Currently, the phonemes function of the pronunciation dictionaries only works with the Turbo V2 model, while the alias function works with all models."
        rightElement={(
          <Button variant="outline" size="sm" className="h-8 text-xs font-normal">
            Add dictionary
          </Button>
        )}
      >
        <div className="w-full">
          <div className="flex flex-col border border-dashed rounded-md py-8">
            <div className="text-center text-sm text-muted-foreground">
              .zst, .txt, .xml Max 1.6 MB
            </div>
          </div>
        </div>
      </FormSection>

      {/* Optimize streaming latency */}
      <FormSection
        title="Optimize streaming latency"
        description="Configure latency optimizations for the speech generation. Latency can be optimized at the cost of quality."
      >
        <div className="w-full py-4">
          <Slider defaultValue={[50]} max={100} step={1} />
        </div>
      </FormSection>

      {/* Stability */}
      <FormSection
        title="Stability"
        description="Higher values will make speech more consistent, but it can also make it sound monotone. Lower values will make speech sound more expressive, but may lead to instabilities."
      >
        <div className="w-full py-4">
          <Slider defaultValue={[50]} max={100} step={1} />
        </div>
      </FormSection>

      {/* Speed */}
      <FormSection
        title="Speed"
        description="Controls the speed of the generated speech. Values below 1.0 will slow down the speech, while values above 1.0 will speed it up. Extreme values may affect the quality of the generated speech."
      >
        <div className="w-full py-4">
          <Slider defaultValue={[50]} max={100} step={1} />
        </div>
      </FormSection>

      {/* Similarity */}
      <FormSection
        title="Similarity"
        description="Higher values will boost the overall clarity and consistency of the voice. Very high values may lead to artifacts. Adjusting this value to find the right balance is recommended."
      >
        <div className="w-full py-4">
          <Slider defaultValue={[50]} max={100} step={1} />
        </div>
      </FormSection>
    </div>
  );
}
