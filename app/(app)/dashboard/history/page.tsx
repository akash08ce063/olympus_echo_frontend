"use client"

import { History, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useTestContext } from "@/context/TestContext"

export default function HistoryPage() {
    const { history } = useTestContext()

    return (
        <div className="container mx-auto py-8 px-6 lg:px-8 max-w-7xl">
            <div className="space-y-8">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <History className="w-8 h-8" />
                        Test History
                    </h1>
                    <p className="text-muted-foreground">
                        Complete history of all your test executions and results
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{history.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {history.filter(test => test.status === 'completed').length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {history.length > 0
                                    ? Math.round((history.filter(test => test.status === 'completed').length / history.length) * 100)
                                    : 0
                                }%
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {history.length > 0
                                    ? `${Math.round(history.reduce((acc, test) => {
                                        const duration = test.completedAt
                                            ? (new Date(test.completedAt).getTime() - new Date(test.startedAt).getTime()) / 1000 / 60
                                            : 0
                                        return acc + duration
                                      }, 0) / history.length)}m`
                                    : '0m'
                                }
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* History Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Test Run History</CardTitle>
                        <CardDescription>
                            Detailed view of all your test executions
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0">
                        {history.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <History className="w-12 h-12 text-muted-foreground/50 mb-4" />
                                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                                    No test history yet
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Your completed test runs will appear here
                                </p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Test ID</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Started</TableHead>
                                        <TableHead>Duration</TableHead>
                                        <TableHead>Results</TableHead>
                                        <TableHead></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {history.map((test) => {
                                        const results = Object.values(test.results || {})
                                        const totalCases = results.length
                                        const passedCases = results.filter(r => r.status === 'passed').length
                                        const duration = test.completedAt
                                            ? Math.round((new Date(test.completedAt).getTime() - new Date(test.startedAt).getTime()) / 1000 / 60)
                                            : 0

                                        return (
                                            <TableRow key={test.id}>
                                                <TableCell className="font-medium">
                                                    {test.id.slice(-8)}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={
                                                            test.status === 'completed' ? 'default' :
                                                            test.status === 'failed' ? 'destructive' : 'secondary'
                                                        }
                                                    >
                                                        {test.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground">
                                                    {new Date(test.startedAt).toLocaleString()}
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {duration}m
                                                </TableCell>
                                                <TableCell className="text-sm">
                                                    {totalCases > 0 ? `${passedCases}/${totalCases} passed` : 'No results'}
                                                </TableCell>
                                                <TableCell>
                                                    <Button variant="ghost" size="sm">
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        View
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
