"use client"

import { Activity, CheckCircle2, XCircle, Eye, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { useMemo } from "react"

interface EvaluationAnalysisProps {
    evaluationResult: any
}

export function EvaluationAnalysis({ evaluationResult }: EvaluationAnalysisProps) {
    if (!evaluationResult) return null

    // Determine the first available accordion item to open by default
    const defaultAccordionValue = useMemo(() => {
        if (evaluationResult.summary) return "summary"
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
                    <h4 className="text-base font-semibold">Evaluation Results</h4>
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
                <div className="h-2 bg-accent rounded-full overflow-hidden">
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
            <div className="grid grid-cols-2 gap-3">
                <div className="bg-card rounded-xl p-3 text-center border border-border/20 shadow-sm">
                    <div className="text-xs text-card-foreground uppercase tracking-wider font-semibold mb-1">Criteria</div>
                    <div className="text-base font-bold">
                        <span className="text-green-500">{evaluationResult.passed_criteria || 0}</span>
                        <span className="text-card-foreground mx-0.5">/</span>
                        <span>{evaluationResult.total_criteria || 0}</span>
                    </div>
                </div>
                <div className="bg-card rounded-xl p-3 text-center border border-border/20 shadow-sm">
                    <div className="text-xs text-card-foreground uppercase tracking-wider font-semibold mb-1">Issues</div>
                    <div className="text-base font-bold text-red-500">{evaluationResult.weaknesses?.length || 0}</div>
                </div>
            </div>

            {/* Accordion for all sections */}
            <Accordion type="single" collapsible defaultValue={defaultAccordionValue} className="w-full space-y-2">
                {/* Summary */}
                {evaluationResult.summary && (
                    <AccordionItem value="summary" className="border border-border/30 rounded-xl overflow-hidden shadow-sm">
                        <AccordionTrigger className="text-sm font-bold hover:no-underline px-4 py-4 bg-card">
                            <div className="flex items-center gap-2.5">
                                <Eye className="w-4 h-4 text-primary" />
                                <span>Summary</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 pt-2">
                            <div className="text-sm text-foreground/90 leading-relaxed font-medium">
                                {typeof evaluationResult.summary === 'string' ? evaluationResult.summary : JSON.stringify(evaluationResult.summary)}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}

                {/* Criteria Evaluation */}
                {evaluationResult.criteria_evaluated && evaluationResult.criteria_evaluated.length > 0 && (
                    <AccordionItem value="criteria" className="border border-border/30 rounded-xl overflow-hidden shadow-sm">
                        <AccordionTrigger className="text-sm font-bold hover:no-underline px-4 py-4 bg-card">
                            <div className="flex items-center gap-2.5">
                                <CheckCircle2 className="w-4 h-4 text-primary" />
                                <span>
                                    Criteria ({evaluationResult.passed_criteria || evaluationResult.criteria_evaluated.filter((c: any) => c.passed).length}/{evaluationResult.criteria_evaluated.length} passed)
                                </span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 pt-2">
                            <div className="space-y-3">
                                {evaluationResult.criteria_evaluated.map((criterion: any, idx: number) => (
                                    <div key={idx} className={cn(
                                        "text-sm p-4 rounded-xl border transition-all duration-200",
                                        criterion.passed ? "bg-green-500/5 border-green-500/20 shadow-sm" : "bg-red-500/5 border-red-500/20 shadow-sm"
                                    )}>
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1">
                                                <span className="font-bold text-foreground/90">
                                                    {typeof criterion.type === 'string' ? criterion.type : `Criterion ${idx + 1}`}
                                                </span>
                                                {criterion.expected && (
                                                    <div className="text-xs text-muted-foreground mt-1 font-medium">
                                                        Expected: {typeof criterion.expected === 'string' ? criterion.expected : JSON.stringify(criterion.expected)}
                                                    </div>
                                                )}
                                            </div>
                                            <Badge
                                                variant={criterion.passed ? 'default' : 'destructive'}
                                                className={cn(
                                                    "text-[10px] h-6 px-2 font-bold shrink-0",
                                                    criterion.passed && "bg-green-500/20 text-green-600 border-green-500/30"
                                                )}
                                            >
                                                {criterion.passed ? '✓ Pass' : '✗ Fail'}
                                            </Badge>
                                        </div>
                                        {criterion.details && (
                                            <div className="text-muted-foreground text-sm leading-relaxed mt-2 mb-2">
                                                {typeof criterion.details === 'string' ? criterion.details : JSON.stringify(criterion.details)}
                                            </div>
                                        )}
                                        {criterion.evidence && (
                                            <div className="mt-2 p-3 bg-card rounded-lg text-xs text-muted-foreground italic border border-border/40 shadow-inner">
                                                "{typeof criterion.evidence === 'string' ? criterion.evidence : JSON.stringify(criterion.evidence)}"
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
                            <AccordionItem value="strengths" className="border border-border/30 rounded-xl overflow-hidden shadow-sm">
                                <AccordionTrigger className="text-sm font-bold hover:no-underline px-4 py-4 bg-card">
                                    <div className="flex items-center gap-2.5">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        <span className="text-green-600">Strengths ({evaluationResult.strengths.length})</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-4 pb-4 pt-2">
                                    <div className="space-y-3">
                                        {evaluationResult.strengths.map((strength: any, idx: number) => (
                                            <div key={idx} className="text-sm p-4 bg-card border border-border/40 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                                {typeof strength === 'string' ? (
                                                    <div className="font-medium text-foreground/90">{strength}</div>
                                                ) : strength && typeof strength === 'object' && strength.trait ? (
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-2">
                                                            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                                                            <div className="font-semibold text-foreground/90 text-base">{strength.trait}</div>
                                                        </div>
                                                        {strength.analysis && (
                                                            <div className="text-sm text-foreground/80 ml-6 leading-relaxed">{strength.analysis}</div>
                                                        )}
                                                        {strength.evidence && (
                                                            <div className="mt-3 p-3 bg-card border border-green-200/50 rounded-lg ml-6 shadow-sm">
                                                                <div className="text-xs font-medium text-green-700 mb-1 flex items-center gap-1">
                                                                    <span className="w-1 h-1 bg-green-500 rounded-full"></span>
                                                                    Evidence
                                                                </div>
                                                                <div className="text-sm text-foreground/90 italic leading-relaxed">"{strength.evidence}"</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="font-medium text-foreground/90">{JSON.stringify(strength)}</div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        )}
                        {evaluationResult.weaknesses && evaluationResult.weaknesses.length > 0 && (
                            <AccordionItem value="weaknesses" className="border border-border/30 rounded-xl overflow-hidden shadow-sm">
                                <AccordionTrigger className="text-sm font-bold hover:no-underline px-4 py-4 bg-card">
                                    <div className="flex items-center gap-2.5">
                                        <XCircle className="w-4 h-4 text-red-500" />
                                        <span className="text-red-600">Weaknesses ({evaluationResult.weaknesses.length})</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="px-4 pb-4 pt-2">
                                    <div className="space-y-3">
                                        {evaluationResult.weaknesses.map((weakness: any, idx: number) => (
                                            <div key={idx} className="text-sm p-4 bg-card border border-border/40 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                                {typeof weakness === 'string' ? (
                                                    <div className="font-medium text-foreground/90">{weakness}</div>
                                                ) : weakness && typeof weakness === 'object' && weakness.trait ? (
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-2">
                                                            <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                                                            <div className="font-semibold text-foreground/90 text-base">{weakness.trait}</div>
                                                        </div>
                                                        {weakness.analysis && (
                                                            <div className="text-sm text-foreground/80 ml-6 leading-relaxed">{weakness.analysis}</div>
                                                        )}
                                                        {weakness.evidence && (
                                                            <div className="mt-3 p-3 bg-card border border-red-200/50 rounded-lg ml-6 shadow-sm">
                                                                <div className="text-xs font-medium text-red-700 mb-1 flex items-center gap-1">
                                                                    <span className="w-1 h-1 bg-red-500 rounded-full"></span>
                                                                    Evidence
                                                                </div>
                                                                <div className="text-sm text-foreground/90 italic leading-relaxed">"{weakness.evidence}"</div>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <div className="font-medium text-foreground/90">{JSON.stringify(weakness)}</div>
                                                )}
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
                    <AccordionItem value="recommendations" className="border border-border/30 rounded-xl overflow-hidden shadow-sm">
                        <AccordionTrigger className="text-sm font-bold hover:no-underline px-4 py-4 bg-card">
                            <div className="flex items-center gap-2.5">
                                <Eye className="w-4 h-4 text-primary" />
                                <span>Recommendations ({evaluationResult.recommendations.length})</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4 pb-4 pt-2">
                            <div className="space-y-3">
                                {evaluationResult.recommendations.map((rec: any, idx: number) => (
                                    <div key={idx} className="text-sm text-foreground/90 p-4 bg-primary/5 rounded-xl border border-primary/20 leading-relaxed flex gap-3 font-medium shadow-sm">
                                        <span className="text-primary font-bold shrink-0">{idx + 1}.</span>
                                        <span>{typeof rec === 'string' ? rec : JSON.stringify(rec)}</span>
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
                            <div className="text-xs text-red-400 leading-relaxed">
                                {typeof evaluationResult.error === 'string' ? evaluationResult.error : JSON.stringify(evaluationResult.error)}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                )}
            </Accordion>
        </div>
    )
}

