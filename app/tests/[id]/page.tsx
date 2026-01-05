"use client";

import React, { useState } from "react";
import { useTestContext } from "@/context/TestContext";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { TestCaseSheet } from "@/components/test-suite/TestCaseSheet";
import { TestRunner } from "@/components/test-suite/TestRunner";
import { TestCase, TargetAgent } from "@/types/test-suite";
import { Play, Plus, Trash2, Settings, MessageSquare, Mic, ArrowRight, Eye, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SuiteDetailPage() {
    const { id } = useParams();
    const {
        getDataset,
        updateDataset,
        runExperiment,
        activeExperiment,
        targetAgents,
        addTargetAgent
    } = useTestContext();

    const dataset = getDataset(id as string);

    // State
    const [activeTab, setActiveTab] = useState("config");
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingCase, setEditingCase] = useState<TestCase | undefined>(undefined);

    // Quick Target Creation Dialog
    const [isTargetDialogOpen, setIsTargetDialogOpen] = useState(false);
    const [newTargetName, setNewTargetName] = useState("");
    const [newTargetUrl, setNewTargetUrl] = useState("");

    if (!dataset) return <div className="p-8">Dataset not found</div>;
    const targetAgent = targetAgents.find(a => a.id === dataset.targetAgentId);

    // --- Handlers ---
    const handleSaveCase = (newCase: TestCase) => {
        const caseExists = dataset.cases.find(c => c.id === newCase.id);
        let updatedCases = caseExists
            ? dataset.cases.map(c => c.id === newCase.id ? newCase : c)
            : [...dataset.cases, { ...newCase, id: `tc-${Date.now()}` }];
        updateDataset({ ...dataset, cases: updatedCases });
        setIsSheetOpen(false);
        setEditingCase(undefined);
    };

    const handleDeleteCase = (caseId: string) => {
        updateDataset({ ...dataset, cases: dataset.cases.filter(c => c.id !== caseId) });
    };

    const handleCreateTarget = () => {
        const newAgent: TargetAgent = {
            id: `target-${Date.now()}`,
            name: newTargetName,
            type: "websocket",
            config: { url: newTargetUrl }
        };
        addTargetAgent(newAgent);
        updateDataset({ ...dataset, targetAgentId: newAgent.id });
        setIsTargetDialogOpen(false);
        setNewTargetName("");
        setNewTargetUrl("");
    };

    // Handle Dropdown Change for Target
    const handleTargetChange = (val: string) => {
        if (val === 'new') {
            setIsTargetDialogOpen(true);
        } else {
            updateDataset({ ...dataset, targetAgentId: val });
        }
    };

    const handleRun = () => {
        runExperiment(dataset.id);
        setActiveTab("runs");
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-background sticky top-0 z-10">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-bold tracking-tight">{dataset.name}</h1>
                        <Badge variant="outline" className="font-mono text-[10px] text-muted-foreground uppercase">
                            {dataset.cases.length} Cases
                        </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 font-mono">ID: {dataset.id}</p>
                </div>
                <Button
                    className="text-primary-foreground"
                    onClick={handleRun}
                    disabled={activeExperiment?.status === 'running'}
                >
                    <Play className={cn("h-4 w-4 mr-2", activeExperiment?.status === 'running' && "animate-spin")} />
                    {activeExperiment?.status === 'running' ? 'Running Tests...' : 'Run Tests'}
                </Button>
            </div>

            <div className="flex-1 overflow-auto p-6 space-y-6 bg-muted/5">

                {/* Main Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="flex items-center justify-between mb-4">
                        <TabsList className="bg-muted">
                            <TabsTrigger value="config" className="gap-2"><Settings className="h-4 w-4" /> Configure Tests</TabsTrigger>
                            <TabsTrigger value="runs" className="gap-2"><Play className="h-4 w-4" /> Runs</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="config" className="space-y-8 animate-in fade-in-50">
                        {/* 2. Visual Config Flow (Cards) */}
                        <div className="flex items-center gap-4">
                            {/* Tester Card */}
                            <Card className="flex-1 border-dashed border-2 hover:border-primary/50 transition-colors">
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <Bot className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">Tester Assistant</h3>
                                            <p className="text-sm text-muted-foreground">This is the assistant that will call or chat with your assistant to test them.</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className="text-xs">Select tester assistant configuration</Label>
                                        <div className="flex gap-2">
                                            <Select defaultValue="default">
                                                <SelectTrigger className="bg-background"><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="default">Basic</SelectItem>
                                                    <SelectItem value="angry">Angry Customer</SelectItem>
                                                    <SelectItem value="frugal">Frugal Exec</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Button variant="outline"><Eye className="h-4 w-4 mr-2" /> View Config</Button>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground">This is the assistant that will call or chat with your assistant to test them.</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <ArrowRight className="h-6 w-6 text-muted-foreground opacity-50" />

                            {/* Target Card */}
                            <Card className="flex-1 bg-background border-2 border-primary/10 shadow-sm">
                                <CardContent className="p-6 space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                            <Bot className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">Target Assistant</h3>
                                            <p className="text-sm text-muted-foreground">This is the agent that will be tested.</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className="text-xs">Select target agent</Label>
                                        <Select value={dataset.targetAgentId} onValueChange={handleTargetChange}>
                                            <SelectTrigger className="bg-background"><SelectValue placeholder="Select Agent..." /></SelectTrigger>
                                            <SelectContent>
                                                {targetAgents.map(agent => (
                                                    <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                                                ))}
                                                <div className="border-t my-1" />
                                                <SelectItem value="new" className="text-primary font-medium">+ Add New Agent</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <p className="text-[10px] text-muted-foreground">This is the agent that will call or chat with your agent to test them.</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* 3. Test Cases Table */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-lg">Test cases</h3>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">Generate Tests (AI)</Button>
                                    <Button size="sm" onClick={() => { setEditingCase(undefined); setIsSheetOpen(true); }}>
                                        <Plus className="h-4 w-4 mr-2" /> Add Test
                                    </Button>
                                </div>
                            </div>
                            <p className="text-sm text-muted-foreground -mt-3">Create tests that the assistant will be tested on</p>

                            <Card>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Name</TableHead>
                                            <TableHead>Steps</TableHead>
                                            <TableHead>Rules</TableHead>
                                            <TableHead>Expected Outcome</TableHead>
                                            <TableHead>Attempts</TableHead>
                                            <TableHead>Concurrency</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {dataset.cases.map(tCase => (
                                            <TableRow key={tCase.id}>
                                                <TableCell className="font-medium">{tCase.name}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="text-[10px]">{tCase.goals?.length || 0} Steps</Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary">{tCase.evaluation_criteria?.length || 0} Rules</Badge>
                                                </TableCell>
                                                <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">{tCase.evaluation_criteria?.[0]?.expected || "-"}</TableCell>
                                                <TableCell className="text-center font-mono">{tCase.attempts}</TableCell>
                                                <TableCell className="text-center font-mono">{tCase.default_concurrent_calls}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-1">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { setEditingCase(tCase); setIsSheetOpen(true); }}>
                                                            <Settings className="h-3 w-3" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/70 hover:text-destructive" onClick={() => tCase.id && handleDeleteCase(tCase.id)}>
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {dataset.cases.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                                                    No test cases found. Add one manually or generate with AI.
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="runs">
                        <TestRunner datasetId={dataset.id} />
                        <div className="flex justify-center mt-4">
                            <Button variant="link" onClick={() => setActiveTab("config")}>← Back to Configuration</Button>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>

            {/* Sheet & Dialogs */}
            <TestCaseSheet
                isOpen={isSheetOpen}
                onClose={() => setIsSheetOpen(false)}
                onSave={handleSaveCase}
                initialData={editingCase}
                testSuiteId={id as string}
            />

            <Dialog open={isTargetDialogOpen} onOpenChange={setIsTargetDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Connect New Target Agent</DialogTitle>
                        <DialogDescription>
                            Enter the connection details for the agent you want to test.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="t-name">Agent Name</Label>
                            <Input id="t-name" value={newTargetName} onChange={(e) => setNewTargetName(e.target.value)} placeholder="e.g. Sales Bot Staging" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="t-url">WebSocket URL</Label>
                            <Input id="t-url" value={newTargetUrl} onChange={(e) => setNewTargetUrl(e.target.value)} placeholder="wss://..." />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleCreateTarget} disabled={!newTargetName || !newTargetUrl}>Create Agent</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
