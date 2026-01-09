"use client"

import { Activity, CheckCircle2, XCircle, Eye, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { useMemo } from "react"

interface EvaluationAnalysisProps {
    evaluationResult: any
}

export function EvaluationAnalysis({ evaluationResult }: EvaluationAnalysisProps) {
    if (!evaluationResult) return null

    // Determine the first available accordion item to open by default
    const defaultAccordionValue = useMemo(() => {
        if (evaluationResult.summary) return "summary"
        if (evaluationResult.goals_analysis && evaluationResult.goals_analysis.length > 0) return "goals"
        if (evaluationResult.criteria_evaluated && evaluationResult.criteria_evaluated.length > 0) return "criteria"
        if (evaluationResult.strengths && evaluationResult.strengths.length > 0) return "strengths"
        if (evaluationResult.weaknesses && evaluationResult.weaknesses.length > 0) return "weaknesses"
        if (evaluationResult.recommendations && evaluationResult.recommendations.length > 0) return "recommendations"
        if (evaluationResult.error) return "error"
        return undefined
    }, [evaluationResult])

    return (
        <div className="space-y-4">
            {/* Header with Status */}
            <div className="flex items-center justify-between pb-3 border-b border-border/30">
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "p-1.5 rounded-full",
                        evaluationResult.overall_status === 'passed' ? "bg-green-500/20" : 
                        evaluationResult.overall_status === 'partial' ? "bg-yellow-500/20" : "bg-red-500/20"
                    )}>
                        <CheckCircle className={cn(
                            "w-4 h-4",
                            evaluationResult.overall_status === 'passed' ? "text-green-500" : 
                            evaluationResult.overall_status === 'partial' ? "text-yellow-500" : "text-red-500"
                        )} />
                    </div>
                    <h4 className="text-sm font-semibold">Evaluation Results</h4>
                </div>
                <Badge 
                    variant={evaluationResult.overall_status === 'passed' ? 'default' : evaluationResult.overall_status === 'partial' ? 'secondary' : 'destructive'} 
                    className={cn(
                        "text-xs uppercase tracking-wider",
                        evaluationResult.overall_status === 'passed' && "bg-green-500/20 text-green-600 border-green-500/30",
                        evaluationResult.overall_status === 'partial' && "bg-yellow-500/20 text-yellow-600 border-yellow-500/30",
                        evaluationResult.overall_status === 'failed' && "bg-red-500/20 text-red-600 border-red-500/30"
                    )}
                >
                    {evaluationResult.overall_status || 'N/A'}
                </Badge>
            </div>
            
            {/* Score Progress Bar */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Overall Score</span>
                    <span className="text-lg font-bold text-foreground">{((evaluationResult.overall_score || 0) * 100).toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                    <div 
                        className={cn(
                            "h-full rounded-full transition-all duration-500",
                            evaluationResult.overall_score >= 0.8 ? "bg-green-500" :
                            evaluationResult.overall_score >= 0.5 ? "bg-yellow-500" : "bg-red-500"
                        )}
                        style={{ width: `${(evaluationResult.overall_score || 0) * 100}%` }}
                    />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2">
                <div className="bg-muted/20 rounded-lg p-2 text-center border border-border/20">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Goals</div>
                    <div className="text-sm font-semibold">{evaluationResult.goals_analysis?.length || 0}</div>
                </div>
                <div className="bg-muted/20 rounded-lg p-2 text-center border border-border/20">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Criteria</div>
                    <div className="text-sm font-semibold">
                        <span className="text-green-500">{evaluationResult.passed_criteria || 0}</span>
                        <span className="text-muted-foreground">/</span>
                        <span>{evaluationResult.total_criteria || 0}</span>
                    </div>
                </div>
                <div className="bg-muted/20 rounded-lg p-2 text-center border border-border/20">
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Issues</div>
                    <div className="text-sm font-semibold text-red-500">{evaluationResult.weaknesses?.length || 0}</div>
                </div>
            </div>

            {/* Accordion for all sections */}
            <Accordion type="single" collapsible defaultValue={defaultAccordionValue} className="w-full space-y-2">
                {/* Summary */}
                {evaluationResult.summary && (
                    <AccordionItem value="summary" className="border border-border/30 rounded-lg">
                        <AccordionTrigger className="text-xs font-semibold hover:no-underline px-3 py-3">
                            <div className="flex items-center gap-2">
                                <Eye className="w-3.5 h-3.5 text-primary" />
                                <span>Summary</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-3 pb-3">
                            <div className="text-xs text-foreground/80 leading-relaxed">
                                {evaluationResult.summary}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* Goals Analysis */}
                {evaluationResult.goals_analysis && evaluationResult.goals_analysis.length > 0 && (
                    <AccordionItem value="goals" className="border border-border/30 rounded-lg">
                        <AccordionTrigger className="text-xs font-semibold hover:no-underline px-3 py-3">
                            <div className="flex items-center gap-2">
                                <Activity className="w-3.5 h-3.5 text-primary" />
                                <span>Goals Analysis ({evaluationResult.goals_analysis.length})</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-3 pb-3">
                            <div className="space-y-2">
                                {evaluationResult.goals_analysis.map((goal: any, idx: number) => (
                                    <div key={idx} className={cn(
                                        "text-xs p-2.5 rounded-lg border transition-colors",
                                        goal.status === 'passed' ? "bg-green-500/5 border-green-500/20" : 
                                        goal.status === 'partial' ? "bg-yellow-500/5 border-yellow-500/20" : "bg-red-500/5 border-red-500/20"
                                    )}>
                                        <div className="flex items-start justify-between mb-1.5">
                                            <span className="font-semibold text-foreground">{goal.goal_description || `Goal ${idx + 1}`}</span>
                                            <div className="flex items-center gap-1.5 shrink-0 ml-2">
                                                <Badge variant="outline" className="text-[9px] h-5 px-1.5">
                                                    {((goal.score || 0) * 100).toFixed(0)}%
                                                </Badge>
                                                {goal.status && (
                                                    <Badge 
                                                        variant={goal.status === 'passed' ? 'default' : goal.status === 'partial' ? 'secondary' : 'destructive'} 
                                                        className="text-[9px] h-5 px-1.5"
                                                    >
                                                        {goal.status === 'passed' ? '✓' : goal.status === 'partial' ? '~' : '✗'}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-muted-foreground text-[11px] leading-relaxed">{goal.analysis || goal.details}</div>
                                        {goal.evidence && (
                                            <div className="mt-1.5 p-1.5 bg-background/50 rounded text-[10px] text-muted-foreground italic border border-border/20">
                                                "{goal.evidence}"
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* Criteria Evaluation */}
                {evaluationResult.criteria_evaluated && evaluationResult.criteria_evaluated.length > 0 && (
                    <AccordionItem value="criteria" className="border border-border/30 rounded-lg">
                        <AccordionTrigger className="text-xs font-semibold hover:no-underline px-3 py-3">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                                <span>
                                    Criteria ({evaluationResult.passed_criteria || evaluationResult.criteria_evaluated.filter((c: any) => c.passed).length}/{evaluationResult.criteria_evaluated.length} passed)
                                </span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-3 pb-3">
                            <div className="space-y-2">
                                {evaluationResult.criteria_evaluated.map((criterion: any, idx: number) => (
                                    <div key={idx} className={cn(
                                        "text-xs p-2.5 rounded-lg border transition-colors",
                                        criterion.passed ? "bg-green-500/5 border-green-500/20" : "bg-red-500/5 border-red-500/20"
                                    )}>
                                        <div className="flex items-start justify-between mb-1.5">
                                            <div className="flex-1">
                                                <span className="font-semibold text-foreground">{criterion.type || `Criterion ${idx + 1}`}</span>
                                                {criterion.expected && (
                                                    <div className="text-[10px] text-muted-foreground mt-0.5">Expected: {criterion.expected}</div>
                                                )}
                                            </div>
                                            <Badge 
                                                variant={criterion.passed ? 'default' : 'destructive'} 
                                                className={cn(
                                                    "text-[9px] h-5 shrink-0",
                                                    criterion.passed && "bg-green-500/20 text-green-600 border-green-500/30"
                                                )}
                                            >
                                                {criterion.passed ? '✓ Pass' : '✗ Fail'}
                                            </Badge>
                                        </div>
                                        {criterion.details && (
                                            <div className="text-muted-foreground text-[11px] leading-relaxed mt-1">{criterion.details}</div>
                                        )}
                                        {criterion.evidence && (
                                            <div className="mt-1.5 p-1.5 bg-background/50 rounded text-[10px] text-muted-foreground italic border border-border/20">
                                                "{criterion.evidence}"
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* Strengths & Weaknesses */}
                {((evaluationResult.strengths && evaluationResult.strengths.length > 0) || (evaluationResult.weaknesses && evaluationResult.weaknesses.length > 0)) && (
                    <>
                        {evaluationResult.strengths && evaluationResult.strengths.length > 0 && (
                            <AccordionItem value="strengths" className="border border-border/30 rounded-lg">
                                <AccordionTrigger className="text-xs font-semibold hover:no-underline px-3 py-3">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                                        <span className="text-green-600">Strengths ({evaluationResult.strengths.length})</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-3 pb-3">
                                    <div className="space-y-2">
                                        {evaluationResult.strengths.map((strength: string, idx: number) => (
                                            <div key={idx} className="text-xs text-foreground/80 p-2.5 bg-green-500/5 rounded border border-green-500/20 leading-relaxed">
                                                {strength}
                                            </div>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        )}
                        {evaluationResult.weaknesses && evaluationResult.weaknesses.length > 0 && (
                            <AccordionItem value="weaknesses" className="border border-border/30 rounded-lg">
                                <AccordionTrigger className="text-xs font-semibold hover:no-underline px-3 py-3">
                                    <div className="flex items-center gap-2">
                                        <XCircle className="w-3.5 h-3.5 text-red-500" />
                                        <span className="text-red-600">Weaknesses ({evaluationResult.weaknesses.length})</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-3 pb-3">
                                    <div className="space-y-2">
                                        {evaluationResult.weaknesses.map((weakness: string, idx: number) => (
                                            <div key={idx} className="text-xs text-foreground/80 p-2.5 bg-red-500/5 rounded border border-red-500/20 leading-relaxed">
                                                {weakness}
                                            </div>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        )}
                    </>
                )}

                {/* Recommendations */}
                {evaluationResult.recommendations && evaluationResult.recommendations.length > 0 && (
                    <AccordionItem value="recommendations" className="border border-border/30 rounded-lg">
                        <AccordionTrigger className="text-xs font-semibold hover:no-underline px-3 py-3">
                            <div className="flex items-center gap-2">
                                <Eye className="w-3.5 h-3.5 text-primary" />
                                <span>Recommendations ({evaluationResult.recommendations.length})</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-3 pb-3">
                            <div className="space-y-2">
                                {evaluationResult.recommendations.map((rec: string, idx: number) => (
                                    <div key={idx} className="text-xs text-foreground/80 p-2.5 bg-primary/5 rounded border border-primary/20 leading-relaxed flex gap-2">
                                        <span className="text-primary font-medium shrink-0">{idx + 1}.</span>
                                        <span>{rec}</span>
                                    </div>
                                ))}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* Error Display */}
                {evaluationResult.error && (
                    <AccordionItem value="error" className="border border-red-500/30 rounded-lg">
                        <AccordionTrigger className="text-xs font-semibold hover:no-underline px-3 py-3 text-red-500">
                            <span>Evaluation Error</span>
                        </AccordionTrigger>
                        <AccordionContent className="px-3 pb-3">
                            <div className="text-xs text-red-400 leading-relaxed">{evaluationResult.error}</div>
                        </AccordionContent>
                    </AccordionItem>
                )}
            </Accordion>
        </div>
    )
}

