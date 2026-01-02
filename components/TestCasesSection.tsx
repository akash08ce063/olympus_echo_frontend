"use client"

import { useState } from "react"
import { MoreHorizontal, Plus, Sparkles, Trash2 } from "lucide-react"

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
    testSuiteId: string
}

export function TestCasesSection({
    testCases,
    onAddTestCase,
    onUpdateTestCase,
    onDeleteTestCase,
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
            accessorKey: "steps",
            header: "Steps",
            cell: ({ row }) => {
                const steps = row.original.steps || []
                return (
                    <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="text-[10px] font-mono py-0 h-5">
                            {steps.length} {steps.length === 1 ? 'Step' : 'Steps'}
                        </Badge>
                    </div>
                )
            }
        },
        {
            accessorKey: "conditions",
            header: "Rules",
            cell: ({ row }) => {
                const conditions = row.original.conditions || []
                return (
                    <div className="flex items-center gap-1.5">
                        <Badge variant="outline" className="text-[10px] font-mono py-0 h-5 bg-primary/5 text-primary border-primary/20">
                            {conditions.length} {conditions.length === 1 ? 'Rule' : 'Rules'}
                        </Badge>
                    </div>
                )
            }
        },
        {
            accessorKey: "expected_outcome",
            header: "Expected Outcome",
            cell: ({ row }) => (
                <div className="text-sm text-muted-foreground truncate max-w-[200px]" title={row.getValue("expected_outcome")}>
                    {row.getValue("expected_outcome") || "---"}
                </div>
            )
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
