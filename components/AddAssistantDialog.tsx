"use client";

import { useState, useCallback } from "react";
import { Bot, Plus } from "lucide-react";

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

export interface Assistant {
  id: string;
  name: string;
  websocketUrl: string;
  sampleRate: string;
  encoding: string;
  createdAt: string;
}

interface AddAssistantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddAssistant: (assistant: Omit<Assistant, "id" | "createdAt">) => void;
}

export function AddAssistantDialog({
  open,
  onOpenChange,
  onAddAssistant,
}: AddAssistantDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    websocketUrl: "",
    sampleRate: "8000",
    encoding: "mulaw",
  });

  const handleSubmit = useCallback(() => {
    if (formData.name && formData.websocketUrl) {
      onAddAssistant(formData);
      setFormData({
        name: "",
        websocketUrl: "",
        sampleRate: "",
        encoding: "",
      });
      onOpenChange(false);
    }
  }, [formData, onAddAssistant, onOpenChange]);

  const handleInputChange =
    (field: keyof typeof formData) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      };

  const handleSelectChange = (field: keyof typeof formData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-primary/10">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            Add Assistant
          </DialogTitle>
          <DialogDescription>
            Configure a new assistant for testing.
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
                <SelectTrigger >
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
                <SelectTrigger >
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
            className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25"
          >
            Add Assistant
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
