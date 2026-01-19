"use client";

import React from "react";
import { Experiment } from "@/types/test-suite";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ChevronRight, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RunsHistoryProps {
    history: Experiment[];
    onViewDetails: (experiment: Experiment) => void;
}

export function RunsHistory({ history, onViewDetails }: RunsHistoryProps) {
    if (history.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed rounded-xl bg-muted/5">
                <Clock className="w-10 h-10 text-muted-foreground/30 mb-4" />
                <h3 className="text-sm font-medium text-foreground">No run history</h3>
                <p className="text-xs text-muted-foreground mt-1">Previous test runs will appear here.</p>
            </div>
        );
    }

    const getStatusBadge = (status: Experiment['status']) => {
        switch (status) {
            case 'completed':
                return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 gap-1.5 font-medium"><CheckCircle2 className="w-3.5 h-3.5" /> Completed</Badge>;
            case 'running':
                return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 gap-1.5 font-medium animate-pulse"><Clock className="w-3.5 h-3.5" /> Running</Badge>;
            case 'failed':
                return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20 gap-1.5 font-medium"><XCircle className="w-3.5 h-3.5" /> Failed</Badge>;
            case 'aborted':
                return <Badge variant="outline" className="bg-muted text-muted-foreground border-border gap-1.5 font-medium"><AlertCircle className="w-3.5 h-3.5" /> Aborted</Badge>;
            default:
                return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const calculatePassRate = (results: Experiment['results']) => {
        const total = Object.keys(results).length;
        if (total === 0) return "0/0";
        const passed = Object.values(results).filter(r => r.status === 'passed').length;
        return `${passed}/${total}`;
    };

    const formatDuration = (experiment: Experiment) => {
        if (!experiment.completedAt) return "---";
        const start = new Date(experiment.startedAt).getTime();
        const end = new Date(experiment.completedAt).getTime();
        const seconds = Math.floor((end - start) / 1000);
        return `${seconds}s`;
    };

    return (
        <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm">
            <Table>
                <TableHeader className="bg-muted/30">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="w-45">Run Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Results</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {history.map((run) => (
                        <TableRow key={run.id} className="group transition-colors">
                            <TableCell>
                                <div className="flex flex-col gap-0.5">
                                    <div className="flex items-center gap-2 text-sm font-medium">
                                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                        {new Date(run.startedAt).toLocaleDateString()}
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
                                        <Clock className="w-3.5 h-3.5" />
                                        {new Date(run.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{getStatusBadge(run.status)}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-foreground">
                                        {calculatePassRate(run.results)}
                                    </span>
                                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-tighter">Passed</span>
                                </div>
                            </TableCell>
                            <TableCell className="text-sm font-mono text-muted-foreground">
                                {formatDuration(run)}
                            </TableCell>
                            <TableCell className="text-right">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 rounded-lg h-8 px-3"
                                    onClick={() => onViewDetails(run)}
                                >
                                    Details
                                    <ChevronRight className="w-4 h-4 ml-1 opacity-50 group-hover:opacity-100" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
