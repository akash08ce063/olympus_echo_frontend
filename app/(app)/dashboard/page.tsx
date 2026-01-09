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
import { TargetAgentsService } from "@/services/targetAgents"
import { UserAgentsService } from "@/services/userAgents"
import { format, formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

// --- Types ---
interface TestRun {
    id: string
    test_suite_id: string
    status: string
    started_at: string
    completed_at?: string
    total_test_cases: number
    passed_count: number
    failed_count: number
}

interface Agent {
    id: string
    name: string
    type: string
}

interface DashboardStats {
    totalTestRuns: number
    totalTestSuites: number
    targetAgents: number
    userAgents: number
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
        targetAgents: 0,
        userAgents: 0,
        successRate: 0,
        activeTests: 0
    })
    const [recentRuns, setRecentRuns] = useState<TestRun[]>([])
    const [agents, setAgents] = useState<{ targets: Agent[], users: Agent[] }>({ targets: [], users: [] })

    useEffect(() => {
        if (!user?.id) return

        const fetchDashboardData = async () => {
            try {
                setLoading(true)

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const [runsResponse, suitesResponse, targetAgentsResponse, userAgentsResponse]: any = await Promise.all([
                    TestSuitesService.getAllRuns(user.id),
                    TestSuitesService.getTestSuites(user.id),
                    TargetAgentsService.getTargetAgents(user.id),
                    UserAgentsService.getUserAgents(user.id)
                ])

                const runs = runsResponse.data?.runs || []
                const targetAgents = targetAgentsResponse.data?.target_agents || []
                const userAgents = userAgentsResponse.data?.user_agents || []

                // Calculate Stats
                const completedRuns = runs.filter((run: TestRun) =>
                    ['completed', 'passed', 'failed'].includes(run.status)
                )
                const successfulRuns = runs.filter((run: TestRun) =>
                    ['passed', 'completed'].includes(run.status) && run.failed_count === 0
                )
                const activeRuns = runs.filter((run: TestRun) =>
                    ['running', 'in_progress'].includes(run.status)
                )

                const successRate = completedRuns.length > 0
                    ? Math.round((successfulRuns.length / completedRuns.length) * 100)
                    : 0

                setStats({
                    totalTestRuns: runsResponse.total,
                    totalTestSuites: suitesResponse?.total || 0,
                    targetAgents: targetAgentsResponse.total,
                    userAgents: userAgentsResponse.total,
                    successRate,
                    activeTests: activeRuns.length
                })

                setRecentRuns(runs.slice(0, 7)) // Show top 7 recent runs
                setAgents({ targets: targetAgents.slice(0, 3), users: userAgents.slice(0, 3) })

            } catch (error) {
                console.error("Error fetching dashboard data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchDashboardData()
    }, [user])

    // Utility to calculate duration
    const getDuration = (start: string, end?: string) => {
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
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="h-9 px-3 text-sm font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4 opacity-50" />
                        Today: {format(new Date(), "MMM d, yyyy")}
                    </Badge>
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

                {/* Total Agents */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Agent Ecosystem</CardTitle>
                        <Bot className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {loading ? <Skeleton className="h-8 w-16" /> : (
                            <>
                                <div className="text-2xl font-bold">{stats.targetAgents + stats.userAgents}</div>
                                <p className="text-xs text-muted-foreground">
                                    {stats.targetAgents} Target / {stats.userAgents} User
                                </p>
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
                        <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => router.push('/dashboard/new-history')}>
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
                                                    <span className="font-medium text-sm">Suite {run.test_suite_id.slice(0, 6)}...</span>
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
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onClick={() => router.push(`/dashboard/new-history?run=${run.id}`)}>
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
                            <Button variant="secondary" className="w-full justify-start" onClick={() => router.push('/history')}>
                                <BarChart3 className="mr-2 h-4 w-4" />
                                View Analytics
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Agent Overview */}
                    {/* <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base flex justify-between items-center">
                                Active Agents
                                <Button variant="link" className="h-auto p-0 text-xs" onClick={() => router.push('/dashboard/user_agents')}>
                                    Manage
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {!loading && agents.users.length > 0 ? (
                                agents.users.map(agent => (
                                    <div key={agent.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                                                {agent.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="space-y-0.5">
                                                <p className="text-sm font-medium">{agent.name}</p>
                                                <p className="text-[10px] text-muted-foreground uppercase">{agent.type || 'User Agent'}</p>
                                            </div>
                                        </div>
                                        <div className="h-2 w-2 rounded-full bg-green-500" title="Active" />
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-muted-foreground">No active user agents.</p>
                            )}
                        </CardContent>
                        <CardFooter className="pt-0 pb-4">
                            <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground" onClick={() => router.push('/dashboard/user_agents')}>
                                View all {stats.userAgents} agents <ChevronRight className="ml-1 h-3 w-3" />
                            </Button>
                        </CardFooter>
                    </Card> */}
                </div>

            </div>
        </div>
    )
}
