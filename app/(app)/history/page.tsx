"use client"

import { useState, useCallback, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { TestSuitesService } from "@/services/testSuites"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import {
    CheckCircle2,
    XCircle,
    Clock,
    AlertCircle,
    ChevronRight,
    Search,
    Calendar,
    Eye,
    History
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"

export default function TestHistoryPage() {
    const { user } = useAuth()
    const [isLoading, setIsLoading] = useState(true)
    const [runs, setRuns] = useState<any[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedRun, setSelectedRun] = useState<any | null>(null)
    const [isDetailsOpen, setIsDetailsOpen] = useState(false)
    const [callLogs, setCallLogs] = useState<any[]>([])
    const [isCallLogsLoading, setIsCallLogsLoading] = useState(false)

    const fetchAllRuns = useCallback(async () => {
        if (!user?.id) return
        setIsLoading(true)
        try {
            const response = await TestSuitesService.getAllRuns(user.id) as any
            const runsData = Array.isArray(response) ? response : (response?.data || response?.runs || [])
            setRuns(runsData)
        } catch (error) {
            console.error("Failed to fetch runs:", error)
            toast.error("Failed to load test history")
        } finally {
            setIsLoading(false)
        }
    }, [user?.id])

    useEffect(() => {
        fetchAllRuns()
    }, [fetchAllRuns])

    const fetchCallLogs = useCallback(async (requestId: string) => {
        if (!user?.id) return
        setIsCallLogsLoading(true)
        setCallLogs([])
        try {
            const response = await TestSuitesService.getCallLogsByRequestId(requestId, user.id) as any
            // Ensure we handle both structure types if they differ
            const logs = Array.isArray(response) ? response : (response?.call_logs || response?.data || [])
            setCallLogs(logs)
        } catch (error) {
            console.error("Failed to fetch call logs:", error)
            toast.error("Failed to load conversation transcript")
        } finally {
            setIsCallLogsLoading(false)
        }
    }, [user?.id])

    const handleViewDetails = (run: any) => {
        setSelectedRun(run)
        setIsDetailsOpen(true)
        if (run.id) {
            fetchCallLogs(run.id)
        }
    }

    const filteredRuns = runs.filter(run =>
        run.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (run.test_suite_id && run.test_suite_id.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    const getStatusBadge = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'completed':
            case 'passed':
            case 'pass':
                return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 gap-1.5 font-medium"><CheckCircle2 className="w-3.5 h-3.5" /> Completed</Badge>;
            case 'running':
                return <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20 gap-1.5 font-medium animate-pulse"><Clock className="w-3.5 h-3.5" /> Running</Badge>;
            case 'failed':
            case 'fail':
                return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20 gap-1.5 font-medium"><XCircle className="w-3.5 h-3.5" /> Failed</Badge>;
            default:
                return <Badge variant="secondary">{status || 'Unknown'}</Badge>;
        }
    };

    const formatDuration = (start: string, end: string | null) => {
        if (!end) return "---";
        const startTime = new Date(start).getTime();
        const endTime = new Date(end).getTime();
        const diff = Math.floor((endTime - startTime) / 1000);

        if (diff < 60) return `${diff}s`;
        const minutes = Math.floor(diff / 60);
        const seconds = diff % 60;
        return `${minutes}m ${seconds}s`;
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-background">
            <div className="flex-none px-8 py-6 border-b border-border/40 bg-card/30 backdrop-blur-sm z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <History className="w-6 h-6 text-primary" />
                            Test History
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            View and analyze past test executions across all suites.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by Run ID or Suite ID..."
                            className="pl-9 h-9 bg-background/50 border-border/40 focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all font-sans"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <ScrollArea className="flex-1 px-8 py-6">
                <div className="space-y-4">
                    {isLoading ? (
                        <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
                            <div className="p-4 space-y-4">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <Skeleton className="h-10 w-full" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : filteredRuns.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-border/50 rounded-xl bg-card/20">
                            <History className="w-12 h-12 text-muted-foreground/30 mb-4" />
                            <h3 className="text-lg font-medium text-foreground">No test history found</h3>
                            <p className="text-sm text-muted-foreground mt-1 max-w-sm text-center">
                                {searchQuery ? "No runs match your search criteria." : "Start running tests to build up your execution history."}
                            </p>
                        </div>
                    ) : (
                        <div className="rounded-xl border border-border/50 bg-card overflow-hidden shadow-sm">
                            <Table>
                                <TableHeader className="bg-muted/30">
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="w-[300px]">Run ID / Suite ID</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Duration</TableHead>
                                        <TableHead className="text-right">Pass/Total</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredRuns.map((run) => (
                                        <TableRow key={run.id} className="group transition-colors hover:bg-muted/30">
                                            <TableCell className="font-mono text-xs">
                                                <div className="flex flex-col gap-1">
                                                    <span className="font-medium text-foreground truncate" title={run.id}>
                                                        {run.id}
                                                    </span>
                                                    <span className="text-muted-foreground truncate" title={run.test_suite_id}>
                                                        Suite: {run.test_suite_id?.substring(0, 8)}...
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{getStatusBadge(run.status)}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-0.5">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                                                        {new Date(run.started_at).toLocaleDateString()}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {new Date(run.started_at).toLocaleTimeString()}
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm font-mono text-muted-foreground">
                                                {formatDuration(run.started_at, run.completed_at)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="inline-flex items-center gap-2">
                                                    <span className="font-semibold">{run.passed_count}</span>
                                                    <span className="text-muted-foreground">/</span>
                                                    <span className="text-muted-foreground">{run.total_test_cases}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0"
                                                    onClick={() => handleViewDetails(run)}
                                                >
                                                    <Eye className="h-4 w-4" />
                                                    <span className="sr-only">View Details</span>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </ScrollArea>

            <Sheet open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <SheetContent className="sm:max-w-xl md:max-w-2xl overflow-y-auto p-6 flex flex-col gap-6">
                    <SheetHeader className="mb-6">
                        <SheetTitle className="text-xl">Run Details</SheetTitle>
                        <SheetDescription>
                            Review the execution details and conversation transcript.
                        </SheetDescription>
                    </SheetHeader>

                    {selectedRun && (
                        <div className="space-y-8">
                            {/* Stats Grid */}
                            <div className="grid grid-cols-2 gap-4">
                                <Card className="bg-muted/20 border-border/50">
                                    <div className="p-4 space-y-1">
                                        <p className="text-xs text-muted-foreground font-medium uppercase">Status</p>
                                        <div className="mt-1">{getStatusBadge(selectedRun.status)}</div>
                                    </div>
                                </Card>
                                <Card className="bg-muted/20 border-border/50">
                                    <div className="p-4 space-y-1">
                                        <p className="text-xs text-muted-foreground font-medium uppercase">Success Rate</p>
                                        <p className="text-2xl font-bold">
                                            {selectedRun.total_test_cases > 0
                                                ? Math.round((selectedRun.passed_count / selectedRun.total_test_cases) * 100)
                                                : 0}%
                                        </p>
                                    </div>
                                </Card>
                            </div>

                            <div className="space-y-2">
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Conversation Transcript</h3>
                                <div className="rounded-lg border border-border/50 bg-card overflow-hidden">
                                    {isCallLogsLoading ? (
                                        <div className="p-8 space-y-4">
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-4 w-1/2" />
                                            <Skeleton className="h-4 w-2/3" />
                                        </div>
                                    ) : callLogs && callLogs.length > 0 ? (
                                        <div className="divide-y divide-border/50">
                                            {callLogs.map((log: any, index: number) => (
                                                <div key={index} className={cn(
                                                    "p-5 flex gap-4 text-sm transition-colors",
                                                    log.role === 'assistant' ? "bg-primary/5/50" : "bg-transparent"
                                                )}>
                                                    <div className={cn(
                                                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 border text-xs font-semibold",
                                                        log.role === 'assistant'
                                                            ? "bg-primary text-primary-foreground border-primary"
                                                            : "bg-muted text-muted-foreground border-border"
                                                    )}>
                                                        {log.role === 'assistant' ? 'AI' : 'U'}
                                                    </div>
                                                    <div className="space-y-1 flex-1">
                                                        <div className="flex items-center justify-between">
                                                            <span className="font-medium text-foreground capitalize">{log.role}</span>
                                                            {log.timestamp && (
                                                                <span className="text-[10px] text-muted-foreground font-mono">
                                                                    {new Date(log.timestamp).toLocaleTimeString()}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">{log.content}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-8 text-center text-muted-foreground text-sm italic">
                                            No transcript available for this run.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}
