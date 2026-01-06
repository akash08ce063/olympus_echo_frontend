"use client"

import { useState, useEffect } from "react"
import {
    Activity,
    BarChart3,
    Beaker,
    Bot,
    CheckCircle2,
    Clock,
    Play,
    TrendingUp,
    Users,
    Zap
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useTestContext } from "@/context/TestContext"
import { useNotifications } from "@/context/NotificationContext"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
    const { history, activeExperiment } = useTestContext()
    const { unreadCount } = useNotifications()
    const [stats, setStats] = useState({
        totalTests: 0,
        completedTests: 0,
        activeTests: 0,
        successRate: 0
    })

    const naviagate = useRouter();

    useEffect(() => {
        // Calculate stats from test history
        const completed = history.filter(test => test.status === 'completed')
        const totalTests = history.length
        const successfulTests = completed.filter(test => {
            const results = Object.values(test.results || {})
            const totalCases = results.length
            const passedCases = results.filter(r => r.status === 'passed').length
            return totalCases > 0 && passedCases === totalCases
        }).length

        setStats({
            totalTests,
            completedTests: completed.length,
            activeTests: activeExperiment ? 1 : 0,
            successRate: totalTests > 0 ? Math.round((successfulTests / totalTests) * 100) : 0
        })
    }, [history, activeExperiment])

    const recentTests = history.slice(0, 5);
   

    return (
        <div className="container mx-auto py-8 px-6 lg:px-8 max-w-7xl">
            <div className="space-y-8">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Overview of your AI testing activities and performance
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
                            <Beaker className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalTests}</div>
                            <p className="text-xs text-muted-foreground">
                                All time test runs
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.successRate}%</div>
                            <Progress value={stats.successRate} className="mt-2" />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Tests</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.activeTests}</div>
                            <p className="text-xs text-muted-foreground">
                                Currently running
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{unreadCount}</div>
                            <p className="text-xs text-muted-foreground">
                                Unread alerts
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                        <CardDescription>
                            Jump into common testing tasks
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Button className="h-20 flex flex-col items-center justify-center gap-2 bg-primary hover:bg-primary/90">
                                <Beaker className="w-6 h-6" />
                                <span className="font-medium">Run Test Suite</span>
                            </Button>
                            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2">
                                <Bot className="w-6 h-6" />
                                <span className="font-medium">Create Agent</span>
                            </Button>
                            <Button variant="outline" className="h-20 flex flex-col items-center justify-center gap-2" onClick={()=> naviagate.push('/dashboard/agents')}>
                                <BarChart3 className="w-6 h-6" />
                                <span className="font-medium">View Analytics</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Tests */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="w-5 h-5" />
                                Recent Test Runs
                            </CardTitle>
                            <CardDescription>
                                Your latest test execution results
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recentTests.length === 0 ? (
                                <div className="text-center py-8">
                                    <Beaker className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">No test runs yet</p>
                                    <p className="text-sm text-muted-foreground/70">Start your first test suite to see results here</p>
                                </div>
                            ) : (
                                recentTests.map((test) => (
                                    <div key={test.id} className="flex items-center justify-between p-3 rounded-lg border">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-lg bg-primary/10">
                                                {test.status === 'completed' ? (
                                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                                ) : test.status === 'failed' ? (
                                                    <Zap className="w-4 h-4 text-red-500" />
                                                ) : (
                                                    <Play className="w-4 h-4 text-blue-500" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">Test Suite {test.id.slice(-4)}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {new Date(test.startedAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge
                                            variant={
                                                test.status === 'completed' ? 'default' :
                                                test.status === 'failed' ? 'destructive' : 'secondary'
                                            }
                                        >
                                            {test.status}
                                        </Badge>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    {/* Active Test */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="w-5 h-5" />
                                Active Test
                            </CardTitle>
                            <CardDescription>
                                Currently running test execution
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {activeExperiment ? (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">Test Suite {activeExperiment.id.slice(-4)}</p>
                                            <p className="text-sm text-muted-foreground">
                                                Started {new Date(activeExperiment.startedAt).toLocaleTimeString()}
                                            </p>
                                        </div>
                                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
                                            Running
                                        </Badge>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Progress</span>
                                            <span>
                                                {Object.keys(activeExperiment.results || {}).length} tests completed
                                            </span>
                                        </div>
                                        <Progress value={50} className="h-2" />
                                    </div>

                                    <Button variant="outline" size="sm" className="w-full">
                                        <Activity className="w-4 h-4 mr-2" />
                                        Monitor Test
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                                    <p className="text-muted-foreground">No active tests</p>
                                    <p className="text-sm text-muted-foreground/70">Start a test suite to see progress here</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
