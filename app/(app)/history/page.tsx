"use client"
import { useState, useEffect, useMemo, useCallback, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"
import { TestSuitesService } from "@/services/testSuites"
import { TestCaseService } from "@/services/testCases"
import {
    Activity,
    CheckCircle2,
    Search,
    Clock,
    XCircle,
    Filter
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationFirst,
    PaginationLast,
    PaginationEllipsis,
} from "@/components/ui/pagination"
import { RunHistoryTable } from "@/components/test-suite/RunHistoryTable"
import { RunDetailDashboard } from "@/components/test-suite/RunDetailDashboard"
import { ApiTestRun, TestCase } from "@/types/test-suite"
import { toast } from "sonner"

const PAGE_SIZE_OPTIONS = [10, 15, 25, 50] as const

function TestHistoryContent() {
    const { user } = useAuth()
    const searchParams = useSearchParams()
    const router = useRouter()
    const runIdFromUrl = searchParams.get('run')

    const [runs, setRuns] = useState<ApiTestRun[]>([])
    const [totalRunsCount, setTotalRunsCount] = useState(0)
    const [testCases, setTestCases] = useState<TestCase[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [selectedRun, setSelectedRun] = useState<ApiTestRun | null>(null)
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(25)

    // Handle initial run selection from URL
    useEffect(() => {
        if (runIdFromUrl && runs.length > 0 && !selectedRun) {
            const foundRun = runs.find(r => r.id === runIdFromUrl)
            if (foundRun) {
                setSelectedRun(foundRun)
            }
        }
    }, [runIdFromUrl, runs, selectedRun])

    // Update URL when selectedRun changes (to keep it in sync)
    const handleSelectRun = (run: ApiTestRun | null) => {
        setSelectedRun(run)
        if (run) {
            router.push(`/history?run=${run.id}`, { scroll: false })
        } else {
            router.push('/history', { scroll: false })
        }
    }

    const totalPages = Math.max(1, Math.ceil(totalRunsCount / pageSize))

    // Stats (for current page only when paginated; total from server)
    const completedRuns = runs.filter(r => ['completed', 'passed'].includes(r.status)).length
    const failedRuns = runs.filter(r => r.status === 'failed').length
    const successRate = runs.length > 0 ? Math.round((completedRuns / runs.length) * 100) : 0

    const fetchRuns = useCallback(async () => {
        if (!user?.id) return
        setLoading(true)
        try {
            const offset = (page - 1) * pageSize
            const [runsResponse, suitesResponse] = await Promise.all([
                TestSuitesService.getAllRuns(user.id, pageSize, offset),
                TestSuitesService.getTestSuites(user.id)
            ])

            const suitesData = (suitesResponse as any)?.test_suites || []
            const suiteMap = new Map(suitesData.map((s: any) => [s.id, s.name]))

            const data = runsResponse as any
            let runsData: ApiTestRun[] = []
            let total = 0
            if (Array.isArray(data)) {
                runsData = data
                total = data.length
            } else if (data?.runs) {
                runsData = data.runs
                total = typeof data.total === "number" ? data.total : data.runs.length
            } else if (data?.data?.runs) {
                runsData = data.data.runs
                total = data.data.total ?? data.data.runs.length
            }

            const enrichedRuns = runsData.map((run: ApiTestRun) => ({
                ...run,
                suiteName: suiteMap.get(run.test_suite_id) || "Unknown Suite"
            }))

            setRuns(enrichedRuns)
            setTotalRunsCount(total)
        } catch (error) {
            console.error("Failed to fetch history data:", error)
            toast.error("Failed to load test history")
        } finally {
            setLoading(false)
        }
    }, [user?.id, page, pageSize])

    useEffect(() => {
        fetchRuns()
    }, [fetchRuns])

    const filteredRuns = useMemo(() => {
        return runs.filter(run => {
            const matchesSearch = run?.test_suite_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                run?.id?.toLowerCase().includes(searchTerm.toLowerCase())
            const matchesStatus = statusFilter === "all" || run.status.toLowerCase() === statusFilter.toLowerCase()
            return matchesSearch && matchesStatus
        })
    }, [runs, searchTerm, statusFilter])

    if (selectedRun) {
        return (
            <div className="container mx-auto py-8 px-4 max-w-7xl animate-in fade-in duration-500">
                <RunDetailDashboard
                    run={selectedRun}
                    testCases={testCases}
                    onBack={() => handleSelectRun(null)}
                />
            </div>
        )
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Test History</h1>
                    <p className="text-muted-foreground mt-1">
                        Review detailed logs, recordings, and transcripts from all your AI test runs.
                    </p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? <Skeleton className="h-8 w-16" /> : totalRunsCount}</div>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-500">
                            {loading ? <Skeleton className="h-8 w-16" /> : `${successRate}%`}
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Failed Runs</CardTitle>
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-rose-500">
                            {loading ? <Skeleton className="h-8 w-16" /> : failedRuns}
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {loading ? <Skeleton className="h-8 w-16" /> : "~32s"}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by Suite ID or Run ID..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Filter Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="running">Running</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Run List/Table */}
            <Card className="bg-card border-border/50 overflow-hidden">
                <CardContent className="p-0">
                    <RunHistoryTable
                        runs={filteredRuns}
                        isLoading={loading}
                        onSelectRun={(run) => handleSelectRun(run as ApiTestRun)}
                    />
                </CardContent>
            </Card>

            {/* Pagination: rows per page + Page X of Y + First/Prev/Next/Last (shadcn) */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-6 px-1 pb-4">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-muted-foreground w-full md:w-auto">
                    <div className="flex items-center gap-2">
                        <span>Rows per page</span>
                        <Select
                            value={String(pageSize)}
                            onValueChange={(v) => {
                                setPageSize(Number(v))
                                setPage(1)
                            }}
                        >
                            <SelectTrigger className="w-[70px] h-8">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {PAGE_SIZE_OPTIONS.map((n) => (
                                    <SelectItem key={n} value={String(n)}>
                                        {n}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <span>
                        {totalRunsCount === 0
                            ? "0 runs"
                            : `${(page - 1) * pageSize + 1}-${Math.min(page * pageSize, totalRunsCount)} of ${totalRunsCount}`}
                    </span>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                        Page {page} of {totalPages}
                    </span>
                    <Pagination className="w-auto mx-0">
                        <PaginationContent className="flex-wrap justify-center gap-2">
                            <PaginationItem>
                                <PaginationFirst
                                    onClick={() => setPage(1)}
                                    className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    className={page <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                            {totalPages <= 5 ? (
                                Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <PaginationItem key={p}>
                                        <PaginationLink
                                            isActive={p === page}
                                            onClick={() => setPage(p)}
                                            className="cursor-pointer"
                                        >
                                            {p}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))
                            ) : (
                                <>
                                    <PaginationItem>
                                        <PaginationLink
                                            isActive={page === 1}
                                            onClick={() => setPage(1)}
                                            className="cursor-pointer"
                                        >
                                            1
                                        </PaginationLink>
                                    </PaginationItem>
                                    {page > 3 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                                    {page > 2 && page < totalPages && (
                                        <PaginationItem>
                                            <PaginationLink isActive onClick={() => {}} className="cursor-default">
                                                {page}
                                            </PaginationLink>
                                        </PaginationItem>
                                    )}
                                    {page < totalPages - 2 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                                    {totalPages > 1 && (
                                        <PaginationItem>
                                            <PaginationLink
                                                isActive={page === totalPages}
                                                onClick={() => setPage(totalPages)}
                                                className="cursor-pointer"
                                            >
                                                {totalPages}
                                            </PaginationLink>
                                        </PaginationItem>
                                    )}
                                </>
                            )}
                            <PaginationItem>
                                <PaginationNext
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLast
                                    onClick={() => setPage(totalPages)}
                                    className={page >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    )
}

export default function TestHistoryPage() {
    return (
        <Suspense fallback={<div className="container mx-auto py-8 px-4 text-center">Loading history...</div>}>
            <TestHistoryContent />
        </Suspense>
    )
}
