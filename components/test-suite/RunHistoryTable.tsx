"use client"

import React from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, CheckCircle2, XCircle, Clock, Calendar } from "lucide-react"
import { ApiTestRun } from "@/types/test-suite"
import { cn } from "@/lib/utils"

interface RunHistoryTableProps {
    runs: ApiTestRun[]
    isLoading: boolean
    onSelectRun: (run: ApiTestRun) => void
    emptyMessage?: string
}

export function RunHistoryTable({
    runs,
    isLoading,
    onSelectRun,
    emptyMessage = "No run history available."
}: RunHistoryTableProps) {

    // Duration calculation helper
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

    if (isLoading) {
        return (
            <div className="w-full">
                <Table>
                    <TableHeader className="bg-muted/10">
                        <TableRow className="hover:bg-transparent border-border/50">
                            <TableHead className="w-[100px]"><Skeleton className="h-3 w-12" /></TableHead>
                            <TableHead className="w-[180px]"><Skeleton className="h-3 w-24" /></TableHead>
                            <TableHead className="w-[120px] text-center"><Skeleton className="h-3 w-16 mx-auto" /></TableHead>
                            <TableHead className="w-[140px] text-center"><Skeleton className="h-3 w-20 mx-auto" /></TableHead>
                            <TableHead className="w-[120px] text-center"><Skeleton className="h-3 w-14 mx-auto" /></TableHead>
                            <TableHead className="text-right pr-6"><Skeleton className="h-3 w-12 ml-auto" /></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <TableRow key={i} className="border-border/40">
                                <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                <TableCell className="text-center"><Skeleton className="h-6 w-20 rounded-full mx-auto" /></TableCell>
                                <TableCell className="text-center"><Skeleton className="h-4 w-16 mx-auto" /></TableCell>
                                <TableCell className="text-center"><Skeleton className="h-4 w-12 mx-auto" /></TableCell>
                                <TableCell className="text-right pr-6"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        )
    }

    if (runs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed rounded-xl bg-muted/5">
                <Clock className="w-10 h-10 text-muted-foreground/30 mb-4" />
                <h3 className="text-sm font-medium text-foreground">No run history</h3>
                <p className="text-xs text-muted-foreground mt-1">{emptyMessage}</p>
            </div>
        );
    }

    return (
        <TooltipProvider>
            <div className="w-full overflow-x-auto">
                <Table>
                    <TableHeader className="bg-muted/10">
                        <TableRow className="hover:bg-transparent border-border/50">
                            <TableHead className="text-xs font-bold uppercase tracking-wider w-[100px]">Run ID</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider w-[180px]">Date & Time</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider text-center w-[120px]">Status</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider text-center w-[140px]">Success Rate</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider text-center w-[120px]">Duration</TableHead>
                            <TableHead className="text-xs font-bold uppercase tracking-wider text-right pr-6">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {runs.map((run) => {
                            const successRate = run.total_test_cases > 0
                                ? Math.round((run.passed_count / run.total_test_cases) * 100)
                                : 0;
                            const duration = formatDuration(run.started_at, run.completed_at);
                            const dateObj = new Date(run.started_at);
                            const dateStr = dateObj.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' });
                            const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

                            return (
                                <TableRow
                                    key={run.id}
                                    className="border-border/50 hover:bg-accent/30 cursor-pointer transition-colors group"
                                    onClick={() => onSelectRun(run)}
                                >
                                    <TableCell className="font-mono text-xs">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span className="cursor-help underline decoration-dotted underline-offset-2">
                                                    {run.id.substring(0, 8)}...
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p className="font-mono text-xs">{run.id}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-foreground">{dateStr}</span>
                                            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">{timeStr}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge
                                            variant={run.status === 'completed' ? 'default' : run.status === 'failed' ? 'destructive' : 'secondary'}
                                            className={cn(
                                                "text-[10px] uppercase font-bold px-2 py-0.5 rounded-full",
                                                run.status === 'completed' && "bg-green-500/10 text-green-600 border-green-500/20",
                                                run.status === 'running' && "animate-pulse"
                                            )}
                                        >
                                            {run.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex flex-col items-center gap-1">
                                            <div className="text-xs font-bold text-foreground">{successRate}%</div>
                                            <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                                                <div
                                                    className={cn(
                                                        "h-full transition-all duration-500",
                                                        successRate >= 90 ? "bg-green-500" : successRate >= 70 ? "bg-yellow-500" : "bg-red-500"
                                                    )}
                                                    style={{ width: `${successRate}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] text-muted-foreground font-medium">({run.passed_count}/{run.total_test_cases})</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground">
                                            <Clock className="w-3 h-3" />
                                            {duration}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right pr-6">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 px-3 rounded-lg group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300"
                                        >
                                            <span className="text-xs font-bold mr-1.5">Details</span>
                                            <Eye className="w-3.5 h-3.5" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </div>
        </TooltipProvider>
    )
}
