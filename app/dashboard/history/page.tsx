"use client"

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

export default function HistoryPage() {
    return (
        <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg font-semibold md:text-2xl">Global Test Run History</h1>
            </div>
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Run ID</TableHead>
                            <TableHead>Suite Name</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-medium">#RUN-8921</TableCell>
                            <TableCell>Core Conversation Flow</TableCell>
                            <TableCell>Oct 24, 2024</TableCell>
                            <TableCell><Badge variant="outline" className="text-green-500 border-green-500/20 bg-green-500/10">Passed</Badge></TableCell>
                            <TableCell>4m 12s</TableCell>
                            <TableCell className="text-right"><Button variant="ghost" size="sm">View</Button></TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-medium">#RUN-8920</TableCell>
                            <TableCell>Error Handling & Fallback</TableCell>
                            <TableCell>Oct 23, 2024</TableCell>
                            <TableCell><Badge variant="outline" className="text-red-500 border-red-500/20 bg-red-500/10">Failed</Badge></TableCell>
                            <TableCell>3m 45s</TableCell>
                            <TableCell className="text-right"><Button variant="ghost" size="sm">View</Button></TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
