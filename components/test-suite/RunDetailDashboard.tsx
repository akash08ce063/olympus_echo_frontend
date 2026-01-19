"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, CheckCircle2, Clock, Activity, Calendar } from "lucide-react"
import { ApiTestRun, ApiTestCaseResult, TestCase } from "@/types/test-suite"
import { EvaluationResultsTable } from "./EvaluationResultsTable"
import { TestCaseDetailView } from "./TestCaseDetailView"

interface RunDetailDashboardProps {
    run: ApiTestRun
    testCases: TestCase[]
    onBack: () => void
}

export function RunDetailDashboard({
    run,
    testCases,
    onBack
}: RunDetailDashboardProps) {
    const [selectedTestCaseResultId, setSelectedTestCaseResultId] = useState<string | null>(null)
    const [currentCallIndex, setCurrentCallIndex] = useState<Record<number, number>>({})

    const successRate = run.total_test_cases > 0
        ? Math.round((run.passed_count / run.total_test_cases) * 100)
        : 0;

    const formatDuration = (start: string, end: string | null) => {
        if (!end) return "---";
        const startDate = new Date(start);
        const endDate = new Date(end);
        const diffMs = endDate.getTime() - startDate.getTime();
        const diffSecs = Math.floor(diffMs / 1000);

        if (diffSecs < 60) return `${diffSecs}s`;
        const mins = Math.floor(diffSecs / 60);
        const secs = diffSecs % 60;
        return `${mins}m ${secs}s`;
    };

    const dateObj = new Date(run.started_at);
    const startedAt = `${dateObj.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}, ${dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;

    // If a specific test case result is selected, show detail view
    if (selectedTestCaseResultId) {
        const selectedResult = run.test_case_results.find((r: ApiTestCaseResult) => r.result_id === selectedTestCaseResultId)
        if (!selectedResult) {
            setSelectedTestCaseResultId(null)
            return null
        }

        const currentCallIdx = currentCallIndex[0] || 0
        const totalCalls = selectedResult?.call_recordings?.length || 0
        const currentCall = selectedResult?.call_recordings?.[currentCallIdx]
        const currentTranscript = selectedResult?.call_transcripts?.[currentCallIdx]
        const evaluationResult = selectedResult?.evaluation_result
        const tcName = testCases.find(tc => tc.id === selectedResult.test_case_id)?.name || "Test Case";

        return (
            <TestCaseDetailView
                selectedResult={selectedResult}
                testCaseName={tcName}
                currentCallIdx={currentCallIdx}
                totalCalls={totalCalls}
                currentCall={currentCall}
                currentTranscript={currentTranscript}
                evaluationResult={evaluationResult}
                selectedRunDetailId={run.id}
                onBack={() => {
                    setSelectedTestCaseResultId(null)
                    setCurrentCallIndex({})
                }}
                onPreviousCall={() => {
                    const prev = currentCallIdx > 0 ? currentCallIdx - 1 : totalCalls - 1
                    setCurrentCallIndex({ 0: prev })
                }}
                onNextCall={() => {
                    const next = currentCallIdx < totalCalls - 1 ? currentCallIdx + 1 : 0
                    setCurrentCallIndex({ 0: next })
                }}
            />
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {/* Header / Back */}
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onBack}
                    className="rounded-full hover:bg-accent/50"
                >
                    <ChevronLeft className="w-5 h-5" />
                </Button>
                <div>
                    <h3 className="text-xl font-bold tracking-tight">Run Details</h3>
                    <p className="text-sm text-muted-foreground font-mono">ID: {run.id}</p>
                </div>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-card border-border/50">
                    <CardHeader className="p-3 pb-1 flex flex-row items-center justify-between space-y-0">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Activity className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Success Rate</span>
                        </div>
                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                        <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-primary">{successRate}%</span>
                            <span className="text-xs text-muted-foreground font-medium">({run.passed_count}/{run.total_test_cases})</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border/50">
                    <CardHeader className="p-3 pb-1 flex flex-row items-center justify-between space-y-0">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Duration</span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                        <span className="text-2xl font-bold">{formatDuration(run.started_at, run.completed_at)}</span>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border/50">
                    <CardHeader className="p-3 pb-1 flex flex-row items-center justify-between space-y-0">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Started At</span>
                        </div>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                        <span className="text-sm font-bold block mt-1.5">{startedAt}</span>
                    </CardContent>
                </Card>
            </div>

            {/* Results Table */}
            <EvaluationResultsTable
                testCaseResults={run.test_case_results}
                testCases={testCases}
                onSelectResult={(resultId) => {
                    setSelectedTestCaseResultId(resultId)
                    setCurrentCallIndex({ 0: 0 })
                }}
            />
        </div>
    )
}
