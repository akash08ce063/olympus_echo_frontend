"use client"

import { Beaker, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface EvaluationResultsTableProps {
    testCaseResults: any[]
    testCases: any[]
    onSelectResult: (resultId: string) => void
}

export function EvaluationResultsTable({
    testCaseResults,
    testCases,
    onSelectResult
}: EvaluationResultsTableProps) {
    return (
        <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2 px-1">
                <Beaker className="w-4 h-4 text-primary" />
                Evaluation Results
            </h3>
            <Card className="bg-card border-border/50 overflow-hidden">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-xs">Test Case</TableHead>
                                <TableHead className="text-xs text-center">Status</TableHead>
                                <TableHead className="text-xs text-center">Calls</TableHead>
                                <TableHead className="text-xs text-center">Score</TableHead>
                                <TableHead className="text-xs text-center">Passed Criteria</TableHead>
                                <TableHead className="text-xs text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {testCaseResults.map((result: any) => {
                                const tcName = testCases.find(tc => tc.id === result.test_case_id)?.name || "Test Case";
                                const evalResult = result.evaluation_result || {}
                                const overallScore = evalResult.overall_score || 0
                                const passedCriteria = evalResult.passed_criteria || 0
                                const totalCriteria = evalResult.total_criteria || 0
                                const overallStatus = evalResult.overall_status || result.status
                                
                                return (
                                    <TableRow
                                        key={result.result_id}
                                        className="cursor-pointer hover:bg-accent/30"
                                        onClick={() => onSelectResult(result.result_id)}
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Beaker className="w-3 h-3 text-primary" />
                                                <span className="text-xs font-medium">{tcName}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge 
                                                variant={overallStatus === 'passed' || result.status === 'completed' ? 'default' : overallStatus === 'failed' || result.status === 'failed' ? 'destructive' : 'secondary'}
                                                className="text-[10px] capitalize"
                                            >
                                                {overallStatus || result.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-center text-xs">
                                            {result.concurrent_calls || 1}
                                        </TableCell>
                                        <TableCell className="text-center text-xs font-bold">
                                            {(overallScore * 100).toFixed(1)}%
                                        </TableCell>
                                        <TableCell className="text-center text-xs">
                                            {passedCriteria}/{totalCriteria}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="h-6 w-6">
                                                <Eye className="w-3 h-3" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}

