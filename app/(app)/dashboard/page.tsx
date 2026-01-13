"use client"

import { useState, useEffect } from "react"
import {
    Activity,
    BarChart3,
    Beaker,
    Bot,
    CheckCircle2,
    Play,
    Zap,
    XCircle,
    ArrowRight,
    MoreHorizontal,
    Calendar as CalendarIcon,
    ChevronRight
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { TestSuitesService } from "@/services/testSuites"
import { ApiTestRun } from "@/types/test-suite"
import { format, formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"


interface DashboardStats {
    totalTestRuns: number
    totalTestSuites: number
    totalTestCases: number
    successRate: number
    activeTests: number
}

export default function DashboardPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState<DashboardStats>({
        totalTestRuns: 0,
        totalTestSuites: 0,
        totalTestCases: 0,
        successRate: 0,
        activeTests: 0
    })
    const [recentRuns, setRecentRuns] = useState<ApiTestRun[]>([])

    useEffect(() => {
        if (!user?.id) return

        const fetchDashboardData = async () => {
            try {
                setLoading(true)

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const [runsResponse, suitesResponse]: any = await Promise.all([
                    TestSuitesService.getAllRuns(user.id),
                    TestSuitesService.getTestSuites(user.id)
                ])

                console.log("runsResponse", runsResponse)

                // Robust runs parsing
                let runs: ApiTestRun[] = []
                if (Array.isArray(runsResponse)) {
                    runs = runsResponse
                } else if (runsResponse?.runs) {
                    runs = runsResponse.runs
                } else if (runsResponse?.data?.runs) {
                    runs = runsResponse.data.runs
                }

                // Handle suites response
                const suitesData = (suitesResponse as any)?.test_suites || []
                const suiteMap = new Map(suitesData.map((s: any) => [s.id, s.name]))

                // Calculate Stats
                const completedRuns = runs.filter((run: ApiTestRun) =>
                    ['completed', 'passed', 'failed', 'pass'].includes(run.status.toLowerCase())
                )
                const successfulRuns = runs.filter((run: ApiTestRun) =>
                    ['passed', 'completed', 'pass'].includes(run.status.toLowerCase()) && run.failed_count === 0
                )
                const activeRuns = runs.filter((run: ApiTestRun) =>
                    ['running', 'in_progress', 'scheduled'].includes(run.status.toLowerCase())
                )

                const totalTestCases = runs.reduce((acc, run) => acc + (run.total_test_cases || 0), 0)

                const successRate = completedRuns.length > 0
                    ? Math.round((successfulRuns.length / completedRuns.length) * 100)
                    : 0

                setStats({
                    totalTestRuns: runs.length,
                    totalTestSuites: suitesData.length || suitesResponse?.total || 0,
                    totalTestCases,
                    successRate,
                    activeTests: activeRuns.length
                })

                // Enrich recent runs with suite names
                const enrichedRuns = runs.slice(0, 7).map(run => ({
                    ...run,
                    suiteName: suiteMap.get(run.test_suite_id) || `Suite ${run.test_suite_id.slice(0, 6)}...`
                }))
                setRecentRuns(enrichedRuns as any)

            } catch (error) {
                console.error("Error fetching dashboard data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [user])

    // Utility to calculate duration
    const getDuration = (start: string, end: string | null = null) => {
        if (!end) return "-"
        const startDate = new Date(start)
        const endDate = new Date(end)
        const diffMs = endDate.getTime() - startDate.getTime()
        const seconds = Math.floor(diffMs / 1000)
        return `${seconds}s`
    }

    return (
        <div className="container mx-auto py-8 px-6 lg:px-8 max-w-7xl space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back! Here's an overview of your AI testing performance.
                    </p>
                </div>

            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Total Runs */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
                        <Beaker className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {loading ? <Skeleton className="h-8 w-16" /> : (
                            <>
                                <div className="text-2xl font-bold">{stats.totalTestRuns}</div>
                                <p className="text-xs text-muted-foreground">Lifetime executions</p>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Success Rate with Circular Indicator */}
                <Card className="relative overflow-hidden">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {loading ? <Skeleton className="h-8 w-16" /> : (
                            <div className="flex items-center gap-4">
                                <div>
                                    <div className="text-2xl font-bold">{stats.successRate}%</div>
                                    <p className="text-xs text-muted-foreground">Pass rate</p>
                                </div>
                                <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-muted border-t-primary" style={{
                                    transform: `rotate(${stats.successRate * 3.6}deg)`
                                }} />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Active Sessions */}
                <Card className={cn(stats.activeTests > 0 && "border-blue-500/50 bg-blue-50/10")}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
                        <Zap className={cn("h-4 w-4", stats.activeTests > 0 ? "text-blue-500 fill-blue-500 animate-pulse" : "text-muted-foreground")} />
                    </CardHeader>
                    <CardContent>
                        {loading ? <Skeleton className="h-8 w-16" /> : (
                            <>
                                <div className="text-2xl font-bold">{stats.activeTests}</div>
                                <p className="text-xs text-muted-foreground">Currently running</p>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Total Test Cases */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Test Cases</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {loading ? <Skeleton className="h-8 w-16" /> : (
                            <>
                                <div className="text-2xl font-bold">{stats.totalTestCases}</div>
                                <p className="text-xs text-muted-foreground">Across all runs</p>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Main Content Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Recent Activity Table */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold tracking-tight">Recent Activity</h2>
                        <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => router.push('/history')}>
                            View All <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>

                    <Card>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[100px]">Status</TableHead>
                                    <TableHead>Test Suite</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Duration</TableHead>
                                    <TableHead className="text-right">Results</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    [1, 2, 3, 4, 5].map((i) => (
                                        <TableRow key={i}>
                                            <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                                            <TableCell><Skeleton className="h-4 w-12 ml-auto" /></TableCell>
                                        </TableRow>
                                    ))
                                ) : recentRuns.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                            No recent test runs found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    recentRuns.map((run) => (
                                        <TableRow key={run.id} className="group">
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {run.status === 'completed' || run.status === 'passed' ? (
                                                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                    ) : run.status === 'failed' ? (
                                                        <XCircle className="h-4 w-4 text-red-500" />
                                                    ) : (
                                                        <Activity className="h-4 w-4 text-blue-500 animate-pulse" />
                                                    )}
                                                    <span className={cn(
                                                        "text-xs font-medium capitalize",
                                                        run.status === 'failed' ? "text-red-600" :
                                                            run.status === 'passed' ? "text-green-600" : "text-muted-foreground"
                                                    )}>
                                                        {run.status}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-sm">{(run as any).suiteName}</span>
                                                    <span className="text-[10px] text-muted-foreground font-mono">{run.id.slice(0, 8)}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(run.started_at), { addSuffix: true })}
                                            </TableCell>
                                            <TableCell className="text-xs font-mono">
                                                {getDuration(run.started_at, run.completed_at)}
                                            </TableCell>
                                            <TableCell className="text-right text-xs">
                                                <Badge variant="secondary" className="font-mono">
                                                    {run.passed_count}/{run.total_test_cases}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">

                                                        <DropdownMenuItem onClick={() => router.push(`/history?run=${run.id}`)}>
                                                            View Details
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(run.id)}>
                                                            Copy ID
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </Card>
                </div>

                {/* Right Column: Quick Actions & Agent Overview */}
                <div className="space-y-6">

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="grid gap-2">
                            <Button className="w-full justify-start" onClick={() => router.push('/test_suites')}>
                                <Play className="mr-2 h-4 w-4" />
                                Run New Test
                            </Button>
                            <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/target_agents')}>
                                <Bot className="mr-2 h-4 w-4" />
                                Create Agent
                            </Button>
                            <Button variant="outline" className="w-full justify-start" onClick={() => router.push('/history')}>
                                <BarChart3 className="mr-2 h-4 w-4" />
                                View Analytics
                            </Button>
                        </CardContent>
                    </Card>

                </div>

            </div>
        </div>
    )
}
