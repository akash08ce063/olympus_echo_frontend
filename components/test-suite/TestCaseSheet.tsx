import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TestCase } from "@/types/test-suite";
import { Plus, Trash2, MessageSquare, ClipboardCheck, Timer, RefreshCw } from "lucide-react";
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

const EMPTY_CASE: Partial<TestCase> = {
    name: "",
    goals: [{ text: "" }],
    evaluation_criteria: [{ expected: "" }],
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
            if (initialData) {
                // Normalize goals and evaluation_criteria to objects
                const goals = Array.isArray(initialData.goals)
                    ? initialData.goals.map(g => typeof g === 'string' ? { text: g } : g)
                    : [{ text: initialData.goals || "" }];

                const criteria = initialData.evaluation_criteria?.map(c =>
                    typeof c === 'string' ? { expected: c } : (c as any)
                ) || [];
                setFormData({ ...initialData, goals, evaluation_criteria: criteria });
            } else {
                setFormData({ ...EMPTY_CASE });
            }
        }
    }, [isOpen, initialData]);

    const handleGoalChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            goals: [{ text: value }]
        }));
    };

    const handleAddCriteria = () => {
        setFormData(prev => ({
            ...prev,
            evaluation_criteria: [...(prev.evaluation_criteria || []), { expected: "" }]
        }));
    };

    const handleRemoveCriteria = (index: number) => {
        setFormData(prev => ({
            ...prev,
            evaluation_criteria: prev.evaluation_criteria?.filter((_, i) => i !== index)
        }));
    };

    const handleCriteriaChange = (index: number, value: string) => {
        const newCriteria = [...(formData.evaluation_criteria || [])];
        newCriteria[index] = { expected: value };
        setFormData(prev => ({ ...prev, evaluation_criteria: newCriteria }));
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


            let response;
            if (initialData?.id) {
                response = await TestCaseService.updateTestCase(initialData.id, payload as any);
            } else {
                response = await TestCaseService.createTestCase(payload as any);
            }

            onSave(response.data);
            toast.success(initialData ? "Test case updated successfully" : "Test case created successfully");
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
            <DialogContent className="max-w-5xl h-[85vh] flex flex-col p-0 overflow-hidden bg-card border-border shadow-2xl rounded-xl">
                <DialogHeader className="p-8 pb-4 bg-muted/20">
                    <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-foreground">
                        <div className="rounded-xl bg-primary p-2.5 shadow-lg shadow-primary/20">
                            <Plus className="w-6 h-6 text-white" />
                        </div>
                        {initialData ? "Edit Test Case" : "Add New Test Case"}
                    </DialogTitle>
                    <DialogDescription className="text-muted-foreground mt-1">
                        Configure your test scenario's goals and evaluation criteria for reliable agent assessment.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1 px-8 py-6">
                    <div className="space-y-10">
                        {/* Basic Info Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2.5">
                                <Label className="text-sm font-bold text-foreground uppercase tracking-wider">Test Case Name</Label>
                                <Input
                                    placeholder="e.g., Refund Request Flow"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="bg-background/50 border-input focus:border-primary focus:ring-primary/20 h-11"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-6">
                                <div className="space-y-2.5">
                                    <Label className="flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wider">
                                        <RefreshCw className="w-3.5 h-3.5 text-primary" /> Attempts
                                    </Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        value={formData.attempts}
                                        onChange={(e) => setFormData({ ...formData, attempts: parseInt(e.target.value) || 1 })}
                                        className="bg-background/50 border-input focus:border-primary focus:ring-primary/20 h-11"
                                    />
                                </div>
                                <div className="space-y-2.5">
                                    <Label className="flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wider">
                                        <Timer className="w-3.5 h-3.5 text-primary" /> Timeout (s)
                                    </Label>
                                    <Input
                                        type="number"
                                        min={5}
                                        value={formData.timeout_seconds}
                                        onChange={(e) => setFormData({ ...formData, timeout_seconds: parseInt(e.target.value) || 30 })}
                                        className="bg-background/50 border-input focus:border-primary focus:ring-primary/20 h-11"
                                    />
                                </div>
                                <div className="space-y-2.5">
                                    <Label className="flex items-center gap-2 text-sm font-bold text-foreground uppercase tracking-wider">
                                        <MessageSquare className="w-3.5 h-3.5 text-primary" /> Concurrency
                                    </Label>
                                    <Input
                                        type="number"
                                        min={1}
                                        value={formData.default_concurrent_calls}
                                        onChange={(e) => setFormData({ ...formData, default_concurrent_calls: parseInt(e.target.value) || 1 })}
                                        className="bg-background/50 border-input focus:border-primary focus:ring-primary/20 h-11"
                                    />
                                </div>
                            </div>
                        </div>

                        <Separator className="opacity-80" />

                        {/* Goals and Evaluation Layout */}
                        <div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
                            {/* Goals Section */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="bg-primary/10 p-1.5 rounded-lg">
                                            <MessageSquare className="w-4 h-4 text-primary" />
                                        </div>
                                        <h3 className="font-bold text-sm tracking-widest uppercase text-muted-foreground">Test Goals</h3>
                                    </div>
                                </div>
                                <div className="p-4 rounded-xl border border-border bg-background/50 transition-all hover:bg-muted/30 hover:border-primary/30 hover:shadow-md">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Main Scenario</span>
                                    </div>
                                    <Textarea
                                        placeholder="Describe the agent's goal and the conversation flow..."
                                        value={formData.goals?.[0]?.text || ""}
                                        onChange={(e) => handleGoalChange(e.target.value)}
                                        className="min-h-50 text-sm resize-none bg-background border-input focus:border-primary ring-0 shadow-sm rounded-lg"
                                    />
                                </div>
                            </div>

                            {/* Evaluation Section */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className="bg-primary/10 p-1.5 rounded-lg">
                                            <ClipboardCheck className="w-4 h-4 text-primary" />
                                        </div>
                                        <h3 className="font-bold text-sm tracking-widest uppercase text-muted-foreground">Evaluation Criteria</h3>
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleAddCriteria}
                                        className="h-8 px-3 text-[11px] uppercase font-bold border-primary/20 text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
                                    >
                                        <Plus className="w-3.5 h-3.5 mr-1" /> Add Rule
                                    </Button>
                                </div>
                                <div className="space-y-4">
                                    {formData.evaluation_criteria?.map((criteria, index) => (
                                        <div key={index} className="group relative flex gap-3 items-center p-4 rounded-xl border border-border bg-background/50 transition-all hover:bg-muted/30 hover:border-primary/30 hover:shadow-md">
                                            <div className="flex-1 flex items-center gap-3">
                                                <div className="bg-primary/10 text-primary text-[10px] font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                                                    {index + 1}
                                                </div>
                                                <Input
                                                    placeholder="e.g., Agent apologized for the delay"
                                                    value={criteria.expected || ""}
                                                    onChange={(e) => handleCriteriaChange(index, e.target.value)}
                                                    className="h-10 text-sm bg-background border-input focus:border-primary ring-0 shadow-sm rounded-lg"
                                                />
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5 opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => handleRemoveCriteria(index)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <DialogFooter className="p-8 border-t bg-muted/10 flex justify-end gap-3 rounded-b-xl">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="text-muted-foreground hover:bg-muted font-bold uppercase tracking-wider text-xs"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSubmitting}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground min-w-35 h-11 font-bold uppercase tracking-widest text-xs shadow-xl shadow-primary/30 transition-all active:scale-[0.98]"
                    >
                        {isSubmitting ? (
                            <>
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            initialData ? "Save Changes" : "Create Test Case"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
