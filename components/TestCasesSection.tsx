"use client"

import { useState } from "react"
import { MoreHorizontal, Play, Plus, Sparkles, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "./data-table"
import { TestCaseSheet } from "./test-suite/TestCaseSheet"
import { TestCase } from "@/types/test-suite"

interface TestCasesSectionProps {
    testCases: TestCase[]
    onAddTestCase: (testCase: TestCase) => void
    onUpdateTestCase: (id: string, testCase: TestCase) => void
    onDeleteTestCase: (id: string) => void
    onRunTestCase: (id: string, concurrentCalls: number) => void
    testSuiteId: string
}

export function TestCasesSection({
    testCases,
    onAddTestCase,
    onUpdateTestCase,
    onDeleteTestCase,
    onRunTestCase,
    testSuiteId
}: TestCasesSectionProps) {
    const [isAddTestOpen, setIsAddTestOpen] = useState(false)
    const [editingTest, setEditingTest] = useState<TestCase | null>(null)

    const handleEdit = (testCase: TestCase) => {
        setEditingTest(testCase)
        setIsAddTestOpen(true)
    }

    const handleDelete = (id: string) => {
        onDeleteTestCase(id)
    }

    const handleCloseDialog = () => {
        setIsAddTestOpen(false)
        setEditingTest(null)
    }

    const columns: ColumnDef<TestCase>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => <div className="font-medium text-foreground">{row.getValue("name")}</div>
        },
        {
            accessorKey: "goals",
            header: "Goal",
            cell: ({ row }) => {
                const goals = row.original.goals || []
                const goalText = goals[0]?.text || (typeof goals[0] === 'string' ? goals[0] : "---")
                return (
                    <div className="text-sm text-foreground truncate max-w-[300px]" title={goalText}>
                        {goalText}
                    </div>
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
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                            onClick={() => onRunTestCase(test.id!, test.default_concurrent_calls || 1)}
                            title="Run single test"
                        >
                            <Play className="h-4 w-4 fill-current" />
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEdit(test)}>
                                    Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => handleDelete(test.id!)}
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
                    <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10 hover:text-primary transition-colors">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate tests
                    </Button>
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
            />

            {/* Test Cases Table */}
            <div className="w-full">
                <DataTable
                    columns={columns}
                    data={testCases}
                    searchKey="name"
                />
            </div>
        </div>
    )
}
