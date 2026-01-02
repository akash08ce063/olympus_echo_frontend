import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { TestCase, TestStep, TestCondition } from "@/types/test-suite";
import { Info, Plus, Trash2, MessageSquare, ClipboardCheck, Timer, RefreshCw } from "lucide-react";
import { TestCaseService } from "@/services/testCases";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface TestCaseSheetProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (testCase: TestCase) => void;
    initialData?: TestCase;
    testSuiteId: string;
}

const DEFAULT_STEP: TestStep = { action: 'speak', text: "" };
const DEFAULT_CONDITION: TestCondition = { type: 'response_contains', expected: "" };

const EMPTY_CASE: Partial<TestCase> = {
    name: "",
    steps: [{ ...DEFAULT_STEP }],
    conditions: [{ ...DEFAULT_CONDITION }],
    expected_outcome: "",
    timeout_seconds: 30,
    attempts: 3,
    is_active: true,
    order_index: 0,
    default_concurrent_calls: 1
};

export function TestCaseSheet({ isOpen, onClose, onSave, initialData, testSuiteId }: TestCaseSheetProps) {
    const [formData, setFormData] = useState<Partial<TestCase>>(EMPTY_CASE);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setFormData(initialData ? { ...initialData } : { ...EMPTY_CASE });
        }
    }, [isOpen, initialData]);

    const handleAddStep = () => {
        setFormData(prev => ({
            ...prev,
            steps: [...(prev.steps || []), { ...DEFAULT_STEP }]
        }));
    };

    const handleRemoveStep = (index: number) => {
        setFormData(prev => ({
            ...prev,
            steps: prev.steps?.filter((_, i) => i !== index)
        }));
    };

    const handleStepChange = (index: number, field: keyof TestStep, value: string) => {
        const newSteps = [...(formData.steps || [])];
        newSteps[index] = { ...newSteps[index], [field]: value };
        setFormData(prev => ({ ...prev, steps: newSteps }));
    };

    const handleAddCondition = () => {
        setFormData(prev => ({
            ...prev,
            conditions: [...(prev.conditions || []), { ...DEFAULT_CONDITION }]
        }));
    };

    const handleRemoveCondition = (index: number) => {
        setFormData(prev => ({
            ...prev,
            conditions: prev.conditions?.filter((_, i) => i !== index)
        }));
    };

    const handleConditionChange = (index: number, field: keyof TestCondition, value: string) => {
        const newConditions = [...(formData.conditions || [])];
        newConditions[index] = { ...newConditions[index], [field]: value };
        setFormData(prev => ({ ...prev, conditions: newConditions }));
    };

    const handleSave = async () => {
        if (!formData.name?.trim()) {
            toast.error("Test name is required");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                ...formData,
                test_suite_id: testSuiteId,
            };
            const response = await TestCaseService.createTestCase(payload as any);
            onSave(response.data);
            toast.success("Test case created successfully");
            onClose();
        } catch (error: any) {
            console.error("Failed to save test case:", error);
            toast.error(error.response?.data?.message || "Failed to save test case");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl h-[90vh] flex flex-col p-0 overflow-hidden bg-card border-border">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="flex items-center gap-2 text-2xl">
                        <div className="rounded-lg bg-primary/10 p-2">
                            <Plus className="w-5 h-5 text-primary" />
                        </div>
                        {initialData ? "Edit Test Case" : "Add New Test Case"}
                    </DialogTitle>
                    <DialogDescription>
                        Define steps and validation rules for this test scenario.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1 p-6 pt-2">
                    <div className="space-y-8">
                        {/* Basic Info Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold">Test Case Name</Label>
                                <Input
                                    placeholder="e.g., Refund Request Flow"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="bg-background/50"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-sm font-semibold">
                                        <RefreshCw className="w-3 h-3 text-muted-foreground" /> Attempts
                                    </Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        value={formData.attempts}
                                        onChange={(e) => setFormData({ ...formData, attempts: parseInt(e.target.value) || 1 })}
                                        className="bg-background/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-sm font-semibold">
                                        <Timer className="w-3 h-3 text-muted-foreground" /> Timeout (s)
                                    </Label>
                                    <Input
                                        type="number"
                                        min={5}
                                        value={formData.timeout_seconds}
                                        onChange={(e) => setFormData({ ...formData, timeout_seconds: parseInt(e.target.value) || 30 })}
                                        className="bg-background/50"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2 text-sm font-semibold">
                                        <MessageSquare className="w-3 h-3 text-muted-foreground" /> Concurrency
                                    </Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        value={formData.default_concurrent_calls}
                                        onChange={(e) => setFormData({ ...formData, default_concurrent_calls: parseInt(e.target.value) || 1 })}
                                        className="bg-background/50"
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator className="opacity-50" />

                        {/* Steps and Conditions Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Steps Section */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="w-4 h-4 text-primary" />
                                        <h3 className="font-bold text-sm tracking-tight uppercase text-muted-foreground">Steps</h3>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={handleAddStep} className="h-7 px-2 text-[10px] uppercase font-bold">
                                        <Plus className="w-3 h-3 mr-1" /> Add Step
                                    </Button>
                                </div>
                                <div className="space-y-3">
                                    {formData.steps?.map((step, index) => (
                                        <div key={index} className="group relative flex gap-2 items-start p-3 rounded-lg border border-border/50 bg-muted/30 transition-all hover:bg-muted/50">
                                            <div className="flex-1 space-y-2">
                                                <Select
                                                    value={step.action}
                                                    onValueChange={(val) => handleStepChange(index, "action", val as any)}
                                                >
                                                    <SelectTrigger className="h-8 w-fit min-w-[100px] border-none bg-transparent shadow-none p-0 focus:ring-0 font-semibold text-xs text-primary">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="speak">Speak</SelectItem>
                                                        <SelectItem value="wait">Wait</SelectItem>
                                                        <SelectItem value="press_key">Press Key</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Textarea
                                                    placeholder="What should the tester agent do/say?"
                                                    value={step.text}
                                                    onChange={(e) => handleStepChange(index, "text", e.target.value)}
                                                    className="min-h-[60px] text-sm resize-none bg-background shadow-sm"
                                                />
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => handleRemoveStep(index)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Conditions Section */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <ClipboardCheck className="w-4 h-4 text-primary" />
                                        <h3 className="font-bold text-sm tracking-tight uppercase text-muted-foreground">Validation Rules</h3>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={handleAddCondition} className="h-7 px-2 text-[10px] uppercase font-bold">
                                        <Plus className="w-3 h-3 mr-1" /> Add Rule
                                    </Button>
                                </div>
                                <div className="space-y-3">
                                    {formData.conditions?.map((condition, index) => (
                                        <div key={index} className="group relative flex gap-2 items-start p-3 rounded-lg border border-border/50 bg-muted/30 transition-all hover:bg-muted/50">
                                            <div className="flex-1 space-y-2">
                                                <Select
                                                    value={condition.type}
                                                    onValueChange={(val) => handleConditionChange(index, "type", val as any)}
                                                >
                                                    <SelectTrigger className="h-8 w-fit min-w-[150px] border-none bg-transparent shadow-none p-0 focus:ring-0 font-semibold text-xs text-primary">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="response_contains">Response Contains</SelectItem>
                                                        <SelectItem value="exact_match">Exact Match</SelectItem>
                                                        <SelectItem value="llm_eval">AI Evaluation (LLM)</SelectItem>
                                                        <SelectItem value="latency_under">Latency Under (ms)</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Input
                                                    placeholder="Expected value/criteria..."
                                                    value={condition.expected}
                                                    onChange={(e) => handleConditionChange(index, "expected", e.target.value)}
                                                    className="h-9 text-sm bg-background shadow-sm"
                                                />
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => handleRemoveCondition(index)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Separator className="opacity-50" />

                        <div className="space-y-2 pb-4">
                            <Label className="text-sm font-semibold">Overall Expected Outcome</Label>
                            <Textarea
                                placeholder="Succinctly describe what a successful test look like..."
                                value={formData.expected_outcome}
                                onChange={(e) => setFormData({ ...formData, expected_outcome: e.target.value })}
                                className="min-h-[80px] bg-background/50 resize-none shadow-sm"
                            />
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter className="p-6 pt-2 border-t bg-muted/20">
                    <Button variant="ghost" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSubmitting}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-[120px] shadow-lg shadow-primary/20"
                    >
                        {isSubmitting && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
                        {initialData ? "Update Test" : "Create Test"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
