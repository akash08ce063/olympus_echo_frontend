"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { TestCase, RubricItem } from "@/types/test-suite";
import { Info } from "lucide-react";

interface TestCaseSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (testCase: TestCase) => void;
    initialData?: TestCase;
}

const EMPTY_CASE: TestCase = {
    id: "",
    title: "New Test",
    scenario: "",
    testerPersona: {
        id: "default",
        name: "Standard User",
        role: "User",
        systemPrompt: "You are a helpful user.",
    },
    script: "1: Greet the caller.\n2: Ask...",
    rubric: [],
};

export function TestCaseSheet({ isOpen, onClose, onSave, initialData }: TestCaseSheetProps) {
    const [formData, setFormData] = useState<TestCase>(initialData || EMPTY_CASE);
    const [rubricText, setRubricText] = useState("");
    const [attempts, setAttempts] = useState("1");

    useEffect(() => {
        if (isOpen) {
            const data = initialData ? { ...initialData } : { ...EMPTY_CASE, id: `case-${Date.now()}` };
            setFormData(data);
            // Convert rubric array back to text for display if editing
            setRubricText(data.rubric.map(r => r.criteria).join("\n"));
        }
    }, [isOpen, initialData]);

    const handleSave = () => {
        // Parse rubric text into items
        const rubricItems: RubricItem[] = rubricText.split("\n").filter(t => t.trim()).map((text, i) => ({
            id: `r-${Date.now()}-${i}`,
            criteria: text,
            type: "llm_eval"
        }));

        onSave({
            ...formData,
            rubric: rubricItems
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl bg-card border-border">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <div className="rounded-full bg-muted w-4 h-4 flex items-center justify-center text-[10px] font-bold text-muted-foreground">+</div>
                        Add Test
                    </DialogTitle>
                    <DialogDescription>
                        Describe how the assistant will be tested.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label className="flex items-center gap-1">Type <Info className="h-3 w-3 text-muted-foreground" /></Label>
                        <Select defaultValue="voice">
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="voice">Voice</SelectItem>
                                <SelectItem value="chat">Chat</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid gap-2">
                        <Label className="flex items-center gap-1">Script <Info className="h-3 w-3 text-muted-foreground" /></Label>
                        <Textarea
                            rows={6}
                            value={formData.script}
                            onChange={(e) => setFormData({ ...formData, script: e.target.value })}
                            className="font-mono text-sm"
                            placeholder={`1: Greet the caller.\n2: Ask "How much..."`}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label className="flex items-center gap-1">Rubric <Info className="h-3 w-3 text-muted-foreground" /></Label>
                        <Textarea
                            rows={4}
                            value={rubricText}
                            onChange={(e) => setRubricText(e.target.value)}
                            placeholder="The assistant should refuse to answer the question since it's not related to the caller's business."
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label className="flex items-center gap-1">Attempts <Info className="h-3 w-3 text-muted-foreground" /></Label>
                        <Input
                            value={attempts}
                            onChange={(e) => setAttempts(e.target.value)}
                            type="number"
                            min={1}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={onClose} className="mr-auto">Cancel</Button>
                    <Button onClick={handleSave} className="bg-primary text-primary-foreground hover:bg-primary/90">Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
