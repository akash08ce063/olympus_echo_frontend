"use client"

import { useState } from "react"
import { MoreHorizontal, Plus, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Beaker } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ColumnDef } from "@tanstack/react-table"
import { DataTable } from "./data-table"

interface TestCase {
    id: string
    name: string
    type: "voice" | "chat"
    script: string
    rubric: string
    attempts: number
}

interface TestCasesSectionProps {
    testCases: TestCase[]
    onAddTestCase: (testCase: Omit<TestCase, 'id'>) => void
    onUpdateTestCase: (id: string, testCase: Omit<TestCase, 'id'>) => void
    onDeleteTestCase: (id: string) => void
}

export function TestCasesSection({
    testCases,
    onAddTestCase,
    onUpdateTestCase,
    onDeleteTestCase
}: TestCasesSectionProps) {
    const [isAddTestOpen, setIsAddTestOpen] = useState(false)
    const [editingTest, setEditingTest] = useState<TestCase | null>(null)
    const [formData, setFormData] = useState({
        name: "",
        type: "voice" as "voice" | "chat",
        script: "",
        rubric: "",
        attempts: 1,
    })

    const resetForm = () => {
        setFormData({
            name: "",
            type: "voice",
            script: "",
            rubric: "",
            attempts: 1,
        })
    }

    const handleSubmit = () => {
        if (formData.name && formData.script && formData.rubric) {
            if (editingTest) {
                onUpdateTestCase(editingTest.id, formData)
                setEditingTest(null)
            } else {
                onAddTestCase(formData)
            }
            resetForm()
            setIsAddTestOpen(false)
        }
    }

    const handleEdit = (testCase: TestCase) => {
        setEditingTest(testCase)
        setFormData({
            name: testCase.name,
            type: testCase.type,
            script: testCase.script,
            rubric: testCase.rubric,
            attempts: testCase.attempts,
        })
        setIsAddTestOpen(true)
    }

    const handleDelete = (id: string) => {
        onDeleteTestCase(id)
    }

    const handleCloseDialog = () => {
        setIsAddTestOpen(false)
        setEditingTest(null)
        resetForm()
    }

    const columns: ColumnDef<TestCase>[] = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => <div className="font-medium text-foreground">{row.getValue("name")}</div>
        },
        {
            accessorKey: "type",
            header: "Type",
            cell: ({ row }) => (
                <Badge variant="secondary" className="text-xs capitalize bg-primary/10 text-primary border-0">
                    {row.getValue("type")}
                </Badge>
            )
        },
        {
            accessorKey: "script",
            header: "Script",
            cell: ({ row }) => (
                <div className="max-w-[200px] truncate text-sm text-muted-foreground" title={row.getValue("script")}>
                    {row.getValue("script")}
                </div>
            )
        },
        {
            accessorKey: "rubric",
            header: "Rubric",
            cell: ({ row }) => (
                <div className="max-w-[200px] truncate text-sm text-muted-foreground" title={row.getValue("rubric")}>
                    {row.getValue("rubric")}
                </div>
            )
        },
        {
            accessorKey: "attempts",
            header: () => <div className="text-center">Attempts</div>,
            cell: ({ row }) => <div className="text-center">{row.getValue("attempts")}</div>
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
                                onClick={() => handleDelete(test.id)}
                                className="text-destructive"
                            >
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
                    <Dialog open={isAddTestOpen} onOpenChange={handleCloseDialog}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all duration-300">
                                <Plus className="w-4 h-4 mr-2" /> {editingTest ? 'Edit Test' : 'Add Test'}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-lg bg-card border-border/50">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    <div className="p-1.5 rounded-md bg-primary/10">
                                        <Beaker className="w-4 h-4 text-primary" />
                                    </div>
                                    {editingTest ? 'Edit Test' : 'Add Test'}
                                </DialogTitle>
                                <DialogDescription>
                                    {editingTest ? 'Update the test case details.' : 'Describe how the assistant will be tested.'}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-5 py-4">
                                <div className="space-y-2">
                                    <Label>Name</Label>
                                    <Input
                                        placeholder="e.g. Greeting Flow"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        className="bg-background/50 border-border/50 focus:border-primary/50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Label>Type</Label>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="text-xs text-muted-foreground cursor-help">ℹ️</span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Voice tests simulate phone calls, Chat tests simulate text conversations</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                    <Select
                                        value={formData.type}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as "voice" | "chat" }))}
                                    >
                                        <SelectTrigger className="bg-background/50 border-border/50">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="voice">Voice</SelectItem>
                                            <SelectItem value="chat">Chat</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Label>Script</Label>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="text-xs text-muted-foreground cursor-help">ℹ️</span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Step-by-step instructions for the tester to follow</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                    <Textarea
                                        className="min-h-[120px] resize-none bg-background/50 border-border/50 focus:border-primary/50"
                                        placeholder={"1: Greet the caller.\n2: Ask \"How much larger is the sun than the moon?\"\n3: Ask the same question again.\n4: End the call."}
                                        value={formData.script}
                                        onChange={(e) => setFormData(prev => ({ ...prev, script: e.target.value }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Label>Rubric</Label>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="text-xs text-muted-foreground cursor-help">ℹ️</span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Criteria used to evaluate if the test passed</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                    <Textarea
                                        className="min-h-[100px] resize-none bg-background/50 border-border/50 focus:border-primary/50"
                                        placeholder="The assistant should refuse to answer the question since it's not related to the caller's business."
                                        value={formData.rubric}
                                        onChange={(e) => setFormData(prev => ({ ...prev, rubric: e.target.value }))}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Label>Attempts</Label>
                                        <TooltipProvider>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <span className="text-xs text-muted-foreground cursor-help">ℹ️</span>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Number of times to run this test</p>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                    <Input
                                        type="number"
                                        min={1}
                                        value={formData.attempts}
                                        onChange={(e) => setFormData(prev => ({ ...prev, attempts: parseInt(e.target.value) || 1 }))}
                                        className="bg-background/50 border-border/50 focus:border-primary/50"
                                    />
                                </div>
                            </div>
                            <DialogFooter className="gap-2 sm:gap-0">
                                <Button variant="outline" onClick={handleCloseDialog} className="border-border/50">
                                    Cancel
                                </Button>
                                <Button onClick={handleSubmit} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25">
                                    {editingTest ? 'Update Test' : 'Save Changes'}
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

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
