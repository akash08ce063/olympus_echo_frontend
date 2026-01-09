"use client"

import { ChevronLeft, ChevronRight, Beaker } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, MessageSquare } from "lucide-react"
import { AudioPlayer } from "@/components/test-suite/AudioPlayer"
import { EvaluationAnalysis } from "@/components/test-suite/EvaluationAnalysis"
import { TranscriptView } from "@/components/test-suite/TranscriptView"

interface TestCaseDetailViewProps {
    selectedResult: any
    testCaseName: string
    currentCallIdx: number
    totalCalls: number
    currentCall: any
    currentTranscript: any
    evaluationResult: any
    selectedRunDetailId?: string
    onBack: () => void
    onPreviousCall: () => void
    onNextCall: () => void
}

export function TestCaseDetailView({
    selectedResult,
    testCaseName,
    currentCallIdx,
    totalCalls,
    currentCall,
    currentTranscript,
    evaluationResult,
    selectedRunDetailId,
    onBack,
    onPreviousCall,
    onNextCall,

}: TestCaseDetailViewProps) {
    return (
        <div className="space-y-4">
            <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="hover:bg-accent/50 -ml-2"
            >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Evaluation Results
            </Button>

            <div className="bg-card/50 border border-border/50 rounded-lg p-4 space-y-4">
                <div className="flex items-center gap-2">
                    <Beaker className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{testCaseName}</span>
                    <Badge
                        variant={selectedResult.status === 'completed' ? 'default' : selectedResult.status === 'failed' ? 'destructive' : 'secondary'}
                        className="text-[10px] capitalize"
                    >
                        {selectedResult.status}
                    </Badge>
                </div>

                {/* Call Pagination Controls */}
                {totalCalls > 1 && (
                    <div className="flex items-center justify-center gap-2 pb-2 border-b border-border/30">
                        <Button
                            size="sm"
                            onClick={onPreviousCall}
                            className="h-7 text-xs bg-orange-600/50 hover:bg-orange-700/50 text-white"
                        >
                            <ChevronLeft className="w-3 h-3 mr-1" />
                            Previous Call
                        </Button>
                        <span className="text-xs text-muted-foreground min-w-[60px] text-center">
                            Call {currentCallIdx + 1} / {totalCalls}
                        </span>
                        <Button
                            size="sm"
                            onClick={onNextCall}
                            className="h-7 text-xs bg-orange-600/50 hover:bg-orange-700/50 text-white"
                        >
                            Next Call
                            <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                    </div>
                )}

                {/* Recording */}
                {currentCall && (
                    <div className="space-y-2">
                        <div className="text-xs text-muted-foreground font-medium">
                            Recording:
                        </div>
                        <div className="bg-background/50 border border-border/30 rounded p-3">
                            <AudioPlayer url={currentCall.recording_url} className="bg-background/50" />
                        </div>
                    </div>
                )}

                {/* Tabs for Analysis and Transcripts */}
                {(evaluationResult || currentTranscript) && (
                    <Tabs defaultValue="analysis" className="w-full">
                        <TabsList className="w-full grid grid-cols-2">
                            <TabsTrigger value="analysis" className="text-xs">
                                <Activity className="w-3.5 h-3.5 mr-1.5" />
                                Analysis
                            </TabsTrigger>
                            <TabsTrigger value="transcript" className="text-xs">
                                <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                                Transcript
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="analysis" className="mt-4">
                            {evaluationResult && (
                                <EvaluationAnalysis evaluationResult={evaluationResult} />
                            )}
                        </TabsContent>
                        <TabsContent value="transcript" className="mt-4">
                            <TranscriptView
                                transcript={currentTranscript}
                                selectedRunDetailId={selectedRunDetailId}

                            />
                        </TabsContent>
                    </Tabs>
                )}

                {/* Fallback if no evaluation or transcript */}
                {!evaluationResult && !currentTranscript && (
                    <div className="text-center text-muted-foreground p-8">
                        <p className="text-xs">No evaluation results or transcript available</p>
                    </div>
                )}
            </div>
        </div>
    )
}

