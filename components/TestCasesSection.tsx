"use client"

import { useState } from "react"
import { Edit, Loader2, MoreHorizontal, Play, Plus, Trash2, CheckCircle2, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "./data-table"
import { TestCaseSheet } from "./test-suite/TestCaseSheet"
import { TestCase } from "@/types/test-suite"

interface TestCasesSectionProps {
    testCases: TestCase[]
    onAddTestCase: (testCase: TestCase) => void
    onUpdateTestCase: (id: string, testCase: TestCase) => void
    onDeleteTestCase: (id: string) => void
    onRunTestCase: (id: string, concurrentCalls: number) => Promise<void>
    testSuiteId: string
}

export function TestCasesSection({
    testCases,
    onAddTestCase,
    onUpdateTestCase,
    onDeleteTestCase,
    onRunTestCase,
    testSuiteId,
}: TestCasesSectionProps) {
    const [isAddTestOpen, setIsAddTestOpen] = useState(false)
    const [editingTest, setEditingTest] = useState<TestCase | null>(null)
    const [isDeleteOpen, setIsDeleteOpen] = useState(false)
    const [testToDelete, setTestToDelete] = useState<TestCase | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [runningTestId, setRunningTestId] = useState<string | null>(null)

    // Calculate max order index
    const maxOrderIndex = testCases.reduce((max, tc) => Math.max(max, tc.order_index || 0), 0)
    const nextOrderIndex = maxOrderIndex + 1

    const handleEdit = (testCase: TestCase) => {
        setEditingTest(testCase)
        setIsAddTestOpen(true)
    }

    const handleDelete = (testCase: TestCase) => {
        setTestToDelete(testCase)
        setIsDeleteOpen(true)
    }

    const confirmDelete = async () => {
        if (!testToDelete?.id) return

        setIsDeleting(true)
        try {
            await onDeleteTestCase(testToDelete.id)
            setIsDeleteOpen(false)
            setTestToDelete(null)
        } finally {
            setIsDeleting(false)
        }
    }

    const handleCloseDialog = () => {
        setIsAddTestOpen(false)
        setEditingTest(null)
    }

    const columns: ColumnDef<TestCase>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => (
                <div className="font-medium text-foreground truncate max-w-[150px]" title={row.getValue("name")}>
                    {row.getValue("name")}
                </div>
            )
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const status = (row.original.status || '').toLowerCase()

                if (status === 'pass' || status === 'passed') {
                    return (
                        <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20 transition-colors shadow-none">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Pass
                        </Badge>
                    )
                }

                if (status === 'failed') {
                    return (
                        <Badge variant="destructive" className="bg-rose-500/10 text-white border-rose-500/20 hover:bg-rose-500/20 transition-colors shadow-none">
                            <XCircle className="w-3 h-3 mr-1" /> Failed
                        </Badge>
                    )
                }

                if (status === 'running') {
                    return (
                        <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20 transition-colors shadow-none">
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" /> Running
                        </Badge>
                    )
                }

                if (!status) return <span className="text-muted-foreground text-xs">-</span>

                return <Badge variant="outline" className="text-xs font-normal text-muted-foreground">{status}</Badge>
            }
        },
        {
            accessorKey: "goals",
            header: "Goal",
            cell: ({ row }) => {
                const goals = row.original.goals || []
                const goalText = goals[0]?.text || (typeof goals[0] === 'string' ? goals[0] : "---")
                return (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className="text-sm text-foreground truncate max-w-[200px] md:max-w-[300px] cursor-default">
                                {goalText}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom" className="max-w-[400px] break-words">
                            <p>{goalText}</p>
                        </TooltipContent>
                    </Tooltip>
                )
            }
        },
        {
            accessorKey: "evaluation_criteria",
            header: "Evaluation",
            cell: ({ row }) => {
                const criteria = row.original.evaluation_criteria || []
                return (
                    <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="text-[10px] font-mono py-0 h-5 bg-primary/5 text-primary border-primary/20">
                            {criteria.length} {criteria.length === 1 ? 'Rule' : 'Rules'}
                        </Badge>
                    </div>
                )
            }
        },
        {
            accessorKey: "attempts",
            header: "Attempts",
            cell: ({ row }) => <div className="text-center font-mono text-sm">{row.getValue("attempts")}</div>
        },
        {
            accessorKey: "default_concurrent_calls",
            header: "Concurrency",
            cell: ({ row }) => <div className="text-center font-mono text-sm">{row.getValue("default_concurrent_calls")}</div>
        },
        {
            id: "actions",
            cell: ({ row }) => {
                const test = row.original
                return (
                    <div className="flex items-center gap-2">
                        {test.status === 'running' ? (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-amber-500 bg-amber-500/10 cursor-not-allowed"
                                disabled
                                title="Running..."
                            >
                                <Loader2 className="h-4 w-4 animate-spin" />
                            </Button>
                        ) : (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                                onClick={async () => {
                                    setRunningTestId(test.id!)
                                    try {
                                        await onRunTestCase(test.id!, test.default_concurrent_calls || 1)
                                    } finally {
                                        setRunningTestId(null)
                                    }
                                }}
                                disabled={runningTestId === test.id}
                                title="Run single test"
                            >
                                {runningTestId === test.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Play className="h-4 w-4 fill-current" />
                                )}
                            </Button>
                        )}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(test)}>
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleDelete(test)}
                                    className="text-destructive font-medium"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )
            }
        }
    ]

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-foreground">Test cases</h3>
                    <p className="text-sm text-muted-foreground">Create tests that the assistant will be tested on</p>
                </div>
                <div className="flex gap-2">
                    {/* <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10 hover:text-primary transition-colors">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate tests
                    </Button> */}
                    <Button
                        size="sm"
                        onClick={() => setIsAddTestOpen(true)}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all duration-300"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Add Test
                    </Button>
                </div>
            </div>

            <TestCaseSheet
                isOpen={isAddTestOpen}
                onClose={handleCloseDialog}
                onSave={(newTest) => {
                    if (editingTest) {
                        onUpdateTestCase(editingTest.id!, newTest)
                    } else {
                        onAddTestCase(newTest)
                    }
                }}
                initialData={editingTest || undefined}
                testSuiteId={testSuiteId}
                defaultOrderIndex={nextOrderIndex}
            />

            {/* Test Cases Table */}
            <div className="grid grid-cols-1">
                <DataTable
                    columns={columns}
                    data={testCases}
                    searchKey="name"
                    stickyLastColumn={true}
                />
            </div>

            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the test case "{testToDelete?.name}" and all associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting} onClick={() => setIsDeleteOpen(false)}>Cancel</AlertDialogCancel>
                        <Button
                            onClick={confirmDelete}
                            disabled={isDeleting}
                            variant="destructive"
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
