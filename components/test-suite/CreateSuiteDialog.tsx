"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useTestContext } from "@/context/TestContext";
import { Dataset, TargetAgent } from "@/types/test-suite";
import { Bot, Plus, ArrowRight } from "lucide-react";

interface CreateSuiteDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CreateSuiteDialog({ isOpen, onClose }: CreateSuiteDialogProps) {
    const { addDataset, targetAgents, addTargetAgent } = useTestContext();
    const [step, setStep] = useState<1 | 2>(1);

    // Form State
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [selectedTargetId, setSelectedTargetId] = useState<string>("");

    // New Target Form State (if creating one on the fly)
    const [isCreatingTarget, setIsCreatingTarget] = useState(false);
    const [newTargetName, setNewTargetName] = useState("");
    const [newTargetType, setNewTargetType] = useState<"vapi" | "websocket">("vapi");
    const [newTargetUrl, setNewTargetUrl] = useState(""); // URL or Assistant ID

    const reset = () => {
        setName("");
        setDescription("");
        setSelectedTargetId("");
        setIsCreatingTarget(false);
        setNewTargetName("");
        setNewTargetUrl("");
        setStep(1);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    const handleCreateTarget = () => {
        const newAgent: TargetAgent = {
            id: `target-${Date.now()}`,
            name: newTargetName,
            type: newTargetType,
            config: newTargetType === 'vapi' ? { assistantId: newTargetUrl } : { url: newTargetUrl }
        };

        addTargetAgent(newAgent);
        setSelectedTargetId(newAgent.id);
        setIsCreatingTarget(false);
    };

    const handleSubmit = () => {
        const newSuite: Dataset = {
            id: `suite-${Date.now()}`,
            name,
            description,
            targetAgentId: selectedTargetId,
            created_at: new Date().toISOString(),
            cases: []
        };

        addDataset(newSuite);
        handleClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-125">
                <DialogHeader>
                    <DialogTitle>{step === 1 ? "Create New Test Suite" : "Select Target Agent"}</DialogTitle>
                    <DialogDescription>
                        {step === 1
                            ? "Name your test suite to get started."
                            : "Which agent do you want to test against?"}
                    </DialogDescription>
                </DialogHeader>

                {step === 1 && (
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Suite Name</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Q4 Sales Validation" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="desc">Description</Label>
                            <Textarea id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What is this suite testing?" />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="grid gap-4 py-4">
                        {!isCreatingTarget ? (
                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label>Existing Agents</Label>
                                    <Select value={selectedTargetId} onValueChange={setSelectedTargetId}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select an agent..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {targetAgents.map(agent => (
                                                <SelectItem key={agent.id} value={agent.id}>
                                                    <div className="flex items-center gap-2">
                                                        <Bot className="h-4 w-4 opacity-50" />
                                                        <span>{agent.name}</span>
                                                        <span className="text-xs text-muted-foreground ml-auto uppercase">{agent.type}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or</span></div>
                                </div>

                                <Button variant="outline" className="w-full" onClick={() => setIsCreatingTarget(true)}>
                                    <Plus className="mr-2 h-4 w-4" /> Register New Agent
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4 border rounded-md p-4 bg-muted/20">
                                <div className="grid gap-2">
                                    <Label>Agent Name</Label>
                                    <Input value={newTargetName} onChange={(e) => setNewTargetName(e.target.value)} placeholder="e.g. Staging Bot" />
                                </div>
                                <div className="grid gap-2">
                                    <Label>Type</Label>
                                    <Select value={newTargetType} onValueChange={(v: any) => setNewTargetType(v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="vapi">Vapi.ai</SelectItem>
                                            <SelectItem value="websocket">Custom WebSocket</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label>{newTargetType === 'vapi' ? 'Assistant ID' : 'WebSocket URL'}</Label>
                                    <Input value={newTargetUrl} onChange={(e) => setNewTargetUrl(e.target.value)} placeholder={newTargetType === 'vapi' ? 'uuid' : 'wss://...'} />
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" onClick={handleCreateTarget} disabled={!newTargetName || !newTargetUrl}>Save Agent</Button>
                                    <Button size="sm" variant="ghost" onClick={() => setIsCreatingTarget(false)}>Cancel</Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <DialogFooter>
                    {step === 2 && (
                        <Button variant="ghost" onClick={() => setStep(1)} className="mr-auto">Back</Button>
                    )}

                    {step === 1 ? (
                        <Button onClick={() => setStep(2)} disabled={!name}>
                            Next <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={!selectedTargetId}>Create Creating Suite</Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
