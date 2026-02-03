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
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Slider } from "./ui/slider";
import { Alert, AlertDescription } from "./ui/alert";
import { Info } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { TargetAgentsService, type CreateTargetAgentPayload, type TargetAgentType } from "@/services/targetAgents";
import { UserAgentsService } from "@/services/userAgents";
import { toast } from "sonner";

export interface ConnectionMetadata {
  method?: "GET" | "POST" | "PUT" | "PATCH";
  headers?: Record<string, string>;
  payload?: Record<string, unknown>;
  response_websocket_url_path?: string;
}

export type TargetProvider = "custom" | "vapi" | "retell";

export interface Assistant {
  id: string;
  name: string;
  websocketUrl: string;
  sampleRate: string;
  encoding: string;
  createdAt: string;
  systemPrompt?: string;
  temperature?: number;
  /** Target agent type: custom (ws/http), vapi, retell. */
  agentType?: TargetProvider;
  /** For custom HTTP(S): how to get WebSocket URL from the endpoint. */
  connectionMetadata?: ConnectionMetadata | null;
  /** For vapi/retell: assistant_id, api_key. */
  providerConfig?: { assistant_id?: string; api_key?: string } | null;
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
    targetProvider: "custom" as TargetProvider,
    websocketUrl: "",
    connectionType: "websocket" as "websocket" | "http",
    connectionMetadata: {
      method: "POST",
      headersJson: "{}",
      payloadJson: "{}",
      responseWebsocketUrlPath: "websocket_url",
    },
    vapiAssistantId: "",
    vapiApiKey: "",
    sampleRate: "8000",
    encoding: "mulaw",
    systemPrompt: "",
    temperature: 0.7,
  });

  useEffect(() => {
    if (open) {
      if (initialData) {
        const provider = (initialData.agentType as TargetProvider) || "custom";
        const isHttp = (initialData.websocketUrl || "").startsWith("http://") || (initialData.websocketUrl || "").startsWith("https://");
        const meta = initialData.connectionMetadata;
        const pc = initialData.providerConfig;
        setFormData({
          name: initialData.name,
          targetProvider: provider,
          websocketUrl: initialData.websocketUrl || "",
          connectionType: isHttp ? "http" : "websocket",
          connectionMetadata: {
            method: meta?.method || "POST",
            headersJson: meta?.headers ? JSON.stringify(meta.headers, null, 2) : "{}",
            payloadJson: meta?.payload ? JSON.stringify(meta.payload, null, 2) : "{}",
            responseWebsocketUrlPath: meta?.response_websocket_url_path || "websocket_url",
          },
          vapiAssistantId: pc?.assistant_id || "",
          vapiApiKey: pc?.api_key || "",
          sampleRate: initialData.sampleRate,
          encoding: initialData.encoding,
          systemPrompt: initialData.systemPrompt || "",
          temperature: initialData.temperature ?? 0.7,
        });
      } else {
        setFormData({
          name: "",
          targetProvider: "custom",
          websocketUrl: "",
          connectionType: "websocket",
          connectionMetadata: {
            method: "POST",
            headersJson: "{}",
            payloadJson: "{}",
            responseWebsocketUrlPath: "websocket_url",
          },
          vapiAssistantId: "",
          vapiApiKey: "",
          sampleRate: "8000",
          encoding: "mulaw",
          systemPrompt: "",
          temperature: 0.7,
        });
      }
    }
  }, [open, initialData]);

  const buildTargetAgentPayload = useCallback((connectionMeta: ConnectionMetadata | null): CreateTargetAgentPayload => {
    const base = {
      name: formData.name,
      sample_rate: parseInt(formData.sampleRate, 10),
      encoding: formData.encoding,
      user_id: user!.id,
    };
    if (formData.targetProvider === "vapi") {
      return {
        ...base,
        agent_type: "vapi" as TargetAgentType,
        websocket_url: "",
        provider_config: {
          assistant_id: formData.vapiAssistantId.trim(),
          api_key: formData.vapiApiKey.trim(),
        },
      };
    }
    if (formData.targetProvider === "retell") {
      return { ...base, agent_type: "retell" as TargetAgentType, websocket_url: "", provider_config: {} };
    }
    return {
      ...base,
      agent_type: "custom" as TargetAgentType,
      websocket_url: formData.websocketUrl.trim(),
      connection_metadata: connectionMeta ?? undefined,
    };
  }, [formData, user]);

  const parseConnectionMetadata = useCallback((): ConnectionMetadata | null => {
    if (formData.connectionType !== "http") return null;
    try {
      const headers = formData.connectionMetadata.headersJson?.trim()
        ? (JSON.parse(formData.connectionMetadata.headersJson) as Record<string, string>)
        : undefined;
      const payload = formData.connectionMetadata.payloadJson?.trim()
        ? (JSON.parse(formData.connectionMetadata.payloadJson) as Record<string, unknown>)
        : undefined;
      const path = formData.connectionMetadata.responseWebsocketUrlPath?.trim() || "websocket_url";
      return {
        method: (formData.connectionMetadata.method || "POST") as "GET" | "POST" | "PUT" | "PATCH",
        headers,
        payload,
        response_websocket_url_path: path,
      };
    } catch {
      toast.error("Invalid JSON in Headers or Payload");
      return null;
    }
  }, [formData.connectionType, formData.connectionMetadata]);

  const handleSubmit = useCallback(async () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (agentType === "tester" && !formData.systemPrompt) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (agentType === "target") {
      if (formData.targetProvider === "custom" && !formData.websocketUrl.trim()) {
        toast.error("URL is required for Custom agent");
        return;
      }
      if (formData.targetProvider === "vapi") {
        if (!formData.vapiAssistantId.trim() || !formData.vapiApiKey.trim()) {
          toast.error("Vapi Assistant ID and API Key are required");
          return;
        }
      }
      if (formData.targetProvider === "retell") {
        toast.error("Retell is not available yet");
        return;
      }
    }

    let connectionMetadata: ConnectionMetadata | null = null;
    if (agentType === "target" && formData.targetProvider === "custom" && formData.connectionType === "http") {
      if (!formData.connectionMetadata.responseWebsocketUrlPath?.trim()) {
        toast.error("Response path is required for HTTP endpoint");
        return;
      }
      connectionMetadata = parseConnectionMetadata();
      if (!connectionMetadata) return;
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
          const payload = buildTargetAgentPayload(connectionMetadata);
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
          const payload = buildTargetAgentPayload(connectionMetadata);
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
        id: (response as any)?.id || response?.data?.id || initialData?.id || Date.now().toString(),
        createdAt: initialData?.createdAt || new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: '2-digit',
          year: 'numeric'
        }),
        agentType: formData.targetProvider,
        connectionMetadata: connectionMetadata ?? undefined,
        providerConfig: formData.targetProvider === "vapi"
          ? { assistant_id: formData.vapiAssistantId.trim(), api_key: formData.vapiApiKey.trim() }
          : undefined,
      };

      onAddAssistant(updatedAssistant);
      setFormData({
        name: "",
        targetProvider: "custom",
        websocketUrl: "",
        connectionType: "websocket",
        connectionMetadata: { method: "POST", headersJson: "{}", payloadJson: "{}", responseWebsocketUrlPath: "websocket_url" },
        vapiAssistantId: "",
        vapiApiKey: "",
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

  const setConnectionMetadataField = (key: keyof typeof formData.connectionMetadata) => (value: string) => {
    setFormData((prev) => ({
      ...prev,
      connectionMetadata: { ...prev.connectionMetadata, [key]: value },
    }));
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
          {agentType === "target" && (
            <Alert className="mt-4 border-blue-500/20 bg-blue-500/10">
              <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <AlertDescription className="text-blue-700 dark:text-blue-300 text-sm">
                <strong>Twilio Support:</strong> This agent supports Twilio voice configuration calls only.
              </AlertDescription>
            </Alert>
          )}
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
                <Label>Provider</Label>
                <Select
                  value={formData.targetProvider}
                  onValueChange={(v: TargetProvider) => setFormData((prev) => ({ ...prev, targetProvider: v }))}
                >
                  <SelectTrigger className="w-full bg-background/50 border-border/50 focus:ring-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Custom Agent</SelectItem>
                    <SelectItem value="vapi">Vapi Agent</SelectItem>
                    <SelectItem value="retell">Retell Agent (coming soon)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.targetProvider === "retell" && (
                <Alert className="border-amber-500/20 bg-amber-500/10">
                  <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <AlertDescription className="text-amber-700 dark:text-amber-300 text-sm">
                    Retell integration is not available yet.
                  </AlertDescription>
                </Alert>
              )}

              {formData.targetProvider === "vapi" && (
                <div className="space-y-3 rounded-md border border-border/50 bg-muted/30 p-3">
                  <div className="space-y-2">
                    <Label className="text-sm">Assistant ID</Label>
                    <Input
                      placeholder="Vapi assistant ID"
                      value={formData.vapiAssistantId}
                      onChange={(e) => setFormData((prev) => ({ ...prev, vapiAssistantId: e.target.value }))}
                      className="bg-background/50 border-border/50 font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">API Key</Label>
                    <Input
                      type="password"
                      placeholder="Vapi API key"
                      value={formData.vapiApiKey}
                      onChange={(e) => setFormData((prev) => ({ ...prev, vapiApiKey: e.target.value }))}
                      className="bg-background/50 border-border/50 font-mono text-sm"
                    />
                  </div>
                </div>
              )}

              {formData.targetProvider === "custom" && (
                <>
                  <div className="space-y-2">
                    <Label>Connection type</Label>
                    <Select
                      value={formData.connectionType}
                      onValueChange={(v: "websocket" | "http") => setFormData((prev) => ({ ...prev, connectionType: v }))}
                    >
                      <SelectTrigger className="w-full bg-background/50 border-border/50 focus:ring-primary/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="websocket">WebSocket URL (ws:// or wss://)</SelectItem>
                        <SelectItem value="http">HTTP URL (returns WebSocket URL)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{formData.connectionType === "http" ? "HTTP endpoint URL" : "WebSocket URL"}</Label>
                    <Input
                      placeholder={formData.connectionType === "http" ? "https://api.example.com/agent/session" : "ws://localhost:6068"}
                      value={formData.websocketUrl}
                      onChange={handleInputChange("websocketUrl")}
                      className="bg-background/50 border-border/50 focus:border-primary/50 font-mono text-sm"
                    />
                  </div>
                  {formData.connectionType === "http" && (
                <div className="space-y-3 rounded-md border border-border/50 bg-muted/30 p-3">
                  <p className="text-sm font-medium text-muted-foreground">HTTP request (to get WebSocket URL)</p>
                  <div className="space-y-2">
                    <Label className="text-xs">Method</Label>
                    <Select
                      value={formData.connectionMetadata.method}
                      onValueChange={setConnectionMetadataField("method")}
                    >
                      <SelectTrigger className="w-full bg-background/50 border-border/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GET">GET</SelectItem>
                        <SelectItem value="POST">POST</SelectItem>
                        <SelectItem value="PUT">PUT</SelectItem>
                        <SelectItem value="PATCH">PATCH</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Headers (JSON)</Label>
                    <Textarea
                      placeholder='{"Authorization": "Bearer ...", "Content-Type": "application/json"}'
                      value={formData.connectionMetadata.headersJson}
                      onChange={(e) => setConnectionMetadataField("headersJson")(e.target.value)}
                      className="min-h-[60px] font-mono text-xs bg-background/50 border-border/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Payload / Body (JSON)</Label>
                    <Textarea
                      placeholder='{"agent_id": "...", "session_id": "..."}'
                      value={formData.connectionMetadata.payloadJson}
                      onChange={(e) => setConnectionMetadataField("payloadJson")(e.target.value)}
                      className="min-h-[60px] font-mono text-xs bg-background/50 border-border/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Response path to WebSocket URL (dot-notation)</Label>
                    <Input
                      placeholder="data.websocket_url or websocket_url"
                      value={formData.connectionMetadata.responseWebsocketUrlPath}
                      onChange={(e) => setConnectionMetadataField("responseWebsocketUrlPath")(e.target.value)}
                      className="bg-background/50 border-border/50 font-mono text-sm"
                    />
                  </div>
                </div>
                  )}
                </>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Sample Rate</Label>
                  <Select
                    value={formData.sampleRate}
                    onValueChange={handleSelectChange("sampleRate")}
                  >
                    <SelectTrigger className="w-full bg-background/50 border-border/50 focus:ring-primary/20">
                      <SelectValue placeholder="Select Sample Rate" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60">
                      <SelectItem value="8000">8 kHz</SelectItem>
                      <SelectItem value="16000">16 kHz</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Encoding</Label>
                  <Select
                    value={formData.encoding}
                    onValueChange={handleSelectChange("encoding")}
                  >
                    <SelectTrigger className="w-full bg-background/50 border-border/50 focus:ring-primary/20">
                      <SelectValue placeholder="Select Encoding" />
                    </SelectTrigger>
                    <SelectContent className="">
                      <SelectItem value="pcm_s16le">PCM 16-bit</SelectItem>
                      <SelectItem value="mulaw">μ-law</SelectItem>
                      <SelectItem value="alaw">A-law</SelectItem>

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
            disabled={
              isSubmitting ||
              !formData.name.trim() ||
              (agentType === "tester" ? !formData.systemPrompt.trim() : false) ||
              (agentType === "target" && formData.targetProvider === "custom" && !formData.websocketUrl.trim()) ||
              (agentType === "target" && formData.targetProvider === "vapi" && (!formData.vapiAssistantId.trim() || !formData.vapiApiKey.trim())) ||
              (agentType === "target" && formData.targetProvider === "retell")
            }
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
