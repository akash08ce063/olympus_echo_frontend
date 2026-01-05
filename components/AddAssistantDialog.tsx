"use client";

import { useState, useCallback, useEffect } from "react";
import { Bot, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Slider } from "./ui/slider";
import { useAuth } from "@/hooks/useAuth";
import { TargetAgentsService } from "@/services/targetAgents";
import { UserAgentsService } from "@/services/userAgents";
import { toast } from "sonner";

export interface Assistant {
  id: string;
  name: string;
  websocketUrl: string;
  sampleRate: string;
  encoding: string;
  createdAt: string;
  systemPrompt?: string;
  temperature?: number;
}

interface AddAssistantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddAssistant: (assistant: Assistant) => void;
  initialData?: Assistant | null;
  agentType?: "target" | "tester";
}

export function AddAssistantDialog({
  open,
  onOpenChange,
  onAddAssistant,
  initialData,
  agentType = "target",
}: AddAssistantDialogProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    websocketUrl: "",
    sampleRate: "8000",
    encoding: "mulaw",
    systemPrompt: "",
    temperature: 0.7,
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          name: initialData.name,
          websocketUrl: initialData.websocketUrl,
          sampleRate: initialData.sampleRate,
          encoding: initialData.encoding,
          systemPrompt: initialData.systemPrompt || "",
          temperature: initialData.temperature ?? 0.7,
        });
      } else {
        setFormData({
          name: "",
          websocketUrl: "",
          sampleRate: "8000",
          encoding: "mulaw",
          systemPrompt: "",
          temperature: 0.7,
        });
      }
    }
  }, [open, initialData]);

  const handleSubmit = useCallback(async () => {
    if (!formData.name || (agentType === "target" && !formData.websocketUrl) || (agentType === "tester" && !formData.systemPrompt)) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!user?.id) {
      toast.error("You must be logged in to add an assistant");
      return;
    }

    setIsSubmitting(true);
    try {
      let response;
      if (initialData?.id) {
        // Update existing agent
        if (agentType === "target") {
          const payload = {
            name: formData.name,
            websocket_url: formData.websocketUrl,
            sample_rate: parseInt(formData.sampleRate, 10),
            encoding: formData.encoding,
            user_id: user.id,
          };
          response = await TargetAgentsService.updateTargetAgent(initialData.id, payload);
          toast.success("Target agent updated successfully");
        } else {
          // Update tester agent
          const payload = {
            name: formData.name,
            system_prompt: formData.systemPrompt,
            temperature: formData.temperature,
            user_id: user.id,
          };
          response = await UserAgentsService.updateUserAgent(initialData.id, payload);
          toast.success("Tester agent updated successfully");
        }
      } else {
        // Create new agent
        if (agentType === "target") {
          const payload = {
            name: formData.name,
            websocket_url: formData.websocketUrl,
            sample_rate: parseInt(formData.sampleRate, 10),
            encoding: formData.encoding,
            user_id: user.id,
          };
          response = await TargetAgentsService.createTargetAgent(payload);
          toast.success("Target agent created successfully");
        } else {
          const payload = {
            name: formData.name,
            system_prompt: formData.systemPrompt,
            temperature: formData.temperature,
            user_id: user.id,
          };
          response = await UserAgentsService.createUserAgent(payload);
          toast.success("Tester agent created successfully");
        }
      }

      const updatedAssistant: Assistant = {
        ...formData,
        id: response?.data?.id || initialData?.id || Date.now().toString(),
        createdAt: initialData?.createdAt || new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric'
        }),
      };

      onAddAssistant(updatedAssistant);
      setFormData({
        name: "",
        websocketUrl: "",
        sampleRate: "8000",
        encoding: "mulaw",
        systemPrompt: "",
        temperature: 0.7,
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to add assistant:", error);
      toast.error("Failed to add assistant");
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, user, onAddAssistant, onOpenChange]);

  const handleInputChange =
    (field: keyof typeof formData) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      };

  const handleSelectChange = (field: keyof typeof formData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSliderChange = (value: number[]) => {
    setFormData((prev) => ({ ...prev, temperature: value[0] }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-primary/10">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            {agentType === "target" ? "Add Target Agent" : "Add Tester Agent"}
          </DialogTitle>
          <DialogDescription>
            Configure a new {agentType === "target" ? "target agent" : "tester agent"} for testing.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input
              placeholder="e.g. Customer Support Bot"
              value={formData.name}
              onChange={handleInputChange("name")}
              className="bg-background/50 border-border/50 focus:border-primary/50"
            />
          </div>

          {agentType === "target" ? (
            <>
              <div className="space-y-2">
                <Label>Websocket URL</Label>
                <Input
                  placeholder="ws://localhost:8080"
                  value={formData.websocketUrl}
                  onChange={handleInputChange("websocketUrl")}
                  className="bg-background/50 border-border/50 focus:border-primary/50 font-mono text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sample Rate</Label>
                  <Select
                    value={formData.sampleRate}
                    onValueChange={handleSelectChange("sampleRate")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sample Rate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8000">8 kHz</SelectItem>
                      <SelectItem value="16000">16 kHz</SelectItem>
                      <SelectItem value="22050">22.05 kHz</SelectItem>
                      <SelectItem value="24000">24 kHz</SelectItem>
                      <SelectItem value="44100">44.1 kHz</SelectItem>
                      <SelectItem value="48000">48 kHz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Encoding</Label>
                  <Select
                    value={formData.encoding}
                    onValueChange={handleSelectChange("encoding")}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Encoding" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pcm_s16le">PCM 16-bit</SelectItem>
                      <SelectItem value="pcm_s24le">PCM 24-bit</SelectItem>
                      <SelectItem value="pcm_s32le">PCM 32-bit</SelectItem>
                      <SelectItem value="pcm_f32le">PCM 32-bit Float</SelectItem>
                      <SelectItem value="mulaw">μ-law</SelectItem>
                      <SelectItem value="alaw">A-law</SelectItem>
                      <SelectItem value="opus">Opus</SelectItem>
                      <SelectItem value="aac">AAC</SelectItem>
                      <SelectItem value="mp3">MP3</SelectItem>
                      <SelectItem value="ogg_vorbis">OGG Vorbis</SelectItem>
                      <SelectItem value="flac">FLAC</SelectItem>
                      <SelectItem value="wav">WAV</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label>System Prompt</Label>
                <Textarea
                  placeholder="Define the behavior and persona of this agent..."
                  value={formData.systemPrompt}
                  onChange={(e) => setFormData(prev => ({ ...prev, systemPrompt: e.target.value }))}
                  className="bg-background/50 border-border/50 focus:border-primary/50 min-h-30 resize-none"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Temperature</Label>
                  <span className="text-sm font-mono text-primary font-medium">{formData.temperature.toFixed(1)}</span>
                </div>
                <Slider
                  value={[formData.temperature]}
                  onValueChange={handleSliderChange}
                  max={1}
                  step={0.1}
                  className="py-4"
                />
                <p className="text-[11px] text-muted-foreground">
                  Lower values (0.2) are more focused and deterministic, while higher values (0.8) are more creative and diverse.
                </p>
              </div>
            </>
          )}
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-border/50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              agentType === "target" ? "Add Target Agent" : "Add Tester Agent"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
