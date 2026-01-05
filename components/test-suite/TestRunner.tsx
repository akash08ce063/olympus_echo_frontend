"use client";

import React, { useEffect, useRef } from "react";
import { useTestContext } from "@/context/TestContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Experiment, TestMessage, RubricResult } from "@/types/test-suite";
import { Mic, User, Server, StopCircle, CheckCircle, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function TestRunner({ datasetId, experiment }: { datasetId: string, experiment?: Experiment | null }) {
    const { activeExperiment: contextActive, stopExperiment } = useTestContext();
    const scrollRef = useRef<HTMLDivElement>(null);

    const activeExperiment = experiment || contextActive;

    // Only show if relevant to this dataset
    if (!activeExperiment || activeExperiment.datasetId !== datasetId) {
        return null;
    }

    // Auto-scroll to bottom of transcript
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [activeExperiment.results]);

    // Flatten all transcripts from all cases for a "live stream" feel, 
    // or just show the currently running case.
    // Let's find the active or last updated case
    const activeCaseId = Object.keys(activeExperiment.results).find(
        id => activeExperiment.results[id].status === 'running'
    ) || Object.keys(activeExperiment.results).pop();

    const currentResult = activeCaseId ? activeExperiment.results[activeCaseId] : null;

    if (!currentResult) return null;

    return (
        <Card className="border-primary/50 shadow-lg mb-8 animate-in fade-in slide-in-from-top-4">
            <CardHeader className="bg-muted/30 pb-4">
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle className="flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                {activeExperiment.status === 'running' && (
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                )}
                                <span className={cn(
                                    "relative inline-flex rounded-full h-3 w-3",
                                    activeExperiment.status === 'running' ? "bg-green-500" : "bg-muted-foreground/30"
                                )}></span>
                            </span>
                            {activeExperiment.status === 'running' ? 'Live Simulation' : 'Run Result'}
                        </CardTitle>
                        <CardDescription>
                            {activeExperiment.status === 'running' ? 'Running Case: ' : 'Showing Case: '}
                            <span className="font-semibold text-foreground">{activeCaseId}</span>
                        </CardDescription>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <div className="text-sm text-muted-foreground">Status</div>
                            <Badge variant={activeExperiment.status === 'completed' ? 'default' : 'outline'} className="uppercase">
                                {activeExperiment.status}
                            </Badge>
                        </div>
                        {activeExperiment.status === 'running' && (
                            <Button variant="destructive" size="sm" onClick={stopExperiment}>
                                <StopCircle className="h-4 w-4 mr-2" /> Stop
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                <div className="grid grid-cols-1 lg:grid-cols-3 h-125">
                    {/* Left: Transcript */}
                    <div className="lg:col-span-2 border-r flex flex-col">
                        <div className="p-4 bg-background/50 backdrop-blur-sm sticky top-0 z-10 border-b flex justify-between text-xs text-muted-foreground font-mono uppercase">
                            <span>Tester Agent (User)</span>
                            <span>Target Agent (System)</span>
                        </div>

                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4">
                                {currentResult.transcript.map((msg: TestMessage) => (
                                    <div key={msg.id} className={cn(
                                        "flex gap-3 max-w-[80%]",
                                        msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                    )}>
                                        <div className={cn(
                                            "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                            msg.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                        )}>
                                            {msg.role === 'user' ? <User className="h-4 w-4" /> : <Server className="h-4 w-4" />}
                                        </div>
                                        <div className={cn(
                                            "p-3 rounded-2xl text-sm",
                                            msg.role === 'user'
                                                ? "bg-primary text-primary-foreground rounded-tr-none"
                                                : "bg-muted text-foreground rounded-tl-none"
                                        )}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                <div ref={scrollRef} />
                            </div>
                        </ScrollArea>

                        {/* Visualizer Footer */}
                        <div className="p-4 border-t bg-muted/10 flex justify-center items-center gap-8">
                            <div className={cn("transition-all duration-300",
                                currentResult.transcript.at(-1)?.role === 'user' ? "opacity-100 scale-110" : "opacity-30 scale-90"
                            )}>
                                <div className="h-16 w-16 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                    <Mic className="h-8 w-8 text-white" />
                                </div>
                                <p className="text-xs text-center mt-2 font-medium">Tester</p>
                            </div>

                            <div className="h-px w-24 bg-border relative">
                                <div className="absolute inset-0 bg-linear-to-r from-transparent via-primary to-transparent animate-shimmer" />
                            </div>

                            <div className={cn("transition-all duration-300",
                                currentResult.transcript.at(-1)?.role === 'assistant' ? "opacity-100 scale-110" : "opacity-30 scale-90"
                            )}>
                                <div className="h-16 w-16 rounded-full bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                    <Server className="h-8 w-8 text-white" />
                                </div>
                                <p className="text-xs text-center mt-2 font-medium">Target</p>
                            </div>
                        </div>
                    </div>

                    {/* Right: Rubric & Stats */}
                    <div className="bg-muted/5 flex flex-col h-full overflow-hidden">
                        <div className="p-4 border-b font-medium text-sm flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-primary" />
                            Live Rubric Check
                        </div>
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4">
                                {currentResult.rubricResults.length === 0 ? (
                                    <div className="text-sm text-muted-foreground text-center py-8">
                                        Waiting for results...
                                    </div>
                                ) : (
                                    currentResult.rubricResults.map((r: RubricResult, i: number) => (
                                        <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-background border shadow-sm">
                                            {r.passed ? (
                                                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                            ) : (
                                                <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                                            )}
                                            <div>
                                                <p className="text-sm font-medium">{r.rubricId}</p>
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {r.passed ? "Criteria Met" : r.reason || "Criteria failed"}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </ScrollArea>

                        <div className="p-4 border-t bg-background mt-auto">
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="space-y-1">
                                    <div className="text-2xl font-bold tracking-tighter">
                                        {(currentResult.duration / 1000).toFixed(1)}s
                                    </div>
                                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Duration</div>
                                </div>
                                <div className="space-y-1">
                                    <div className="text-2xl font-bold tracking-tighter">
                                        {currentResult.transcript.length}
                                    </div>
                                    <div className="text-[10px] text-muted-foreground uppercase tracking-widest">Turns</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
