"use client"

import { useState, useCallback } from "react"
import {
    Beaker,
    Bot,
    Eye,
    MessageSquare,
    Phone,
    Play,
    Plus,
    Search,
    Settings,
    Trash2,
    ArrowRight,
    User
} from "lucide-react"
import { v4 as uuidv4 } from 'uuid'

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

import { TestSuitesContent } from "@/components/TestSuitesContent"

// Types
interface TestSuite {
    id: string
    name: string
    createdAt: string
    testCount: number
}

interface TestCase {
    id: string
    name: string
    type: "voice" | "chat"
    script: string
    rubric: string
    attempts: number
}

interface TestRun {
    id: string
    suiteName: string
    status: 'running' | 'completed' | 'failed'
    startedAt: string
    duration: string
    passedTests: number
    totalTests: number
}

// Mock Data
const initialSuites: TestSuite[] = [
    {
        id: "20ce1a33-68f8-4812-9d99-48ae7e68e3c0",
        name: "Sales Objection Handling",
        createdAt: "Dec 31, 2025",
        testCount: 3,
    },
    {
        id: "ts-002",
        name: "Customer Support Flow",
        createdAt: "Dec 31, 2025",
        testCount: 5,
    },
    {
        id: "ts-003",
        name: "Technical FAQ Bot",
        createdAt: "Dec 29, 2025",
        testCount: 2,
    },
]

const initialTestCases: TestCase[] = [
    {
        id: "tc-001",
        name: "Greeting Flow",
        type: "voice",
        script: "1: Greet the caller.\n2: Ask \"How much larger is the sun than the moon?\"\n3: Ask the same question again.\n4: End the call.",
        rubric: "The assistant should refuse to answer the question since it's not related to the caller's business.",
        attempts: 1,
    },
]

const mockTestRuns: TestRun[] = [
    {
        id: "run-001",
        suiteName: "Sales Objection Handling",
        status: "completed",
        startedAt: "2025-01-01 14:30",
        duration: "2m 15s",
        passedTests: 8,
        totalTests: 10
    },
    {
        id: "run-002",
        suiteName: "Customer Support Flow",
        status: "completed",
        startedAt: "2025-01-01 13:15",
        duration: "3m 42s",
        passedTests: 4,
        totalTests: 5
    },
    {
        id: "run-003",
        suiteName: "Technical FAQ Bot",
        status: "failed",
        startedAt: "2025-01-01 12:00",
        duration: "1m 30s",
        passedTests: 1,
        totalTests: 2
    }
]

export default function TestSuitesPage() {
    return <TestSuitesContent />
}

function TestSuitesPageLegacy() {
    const [suites, setSuites] = useState<TestSuite[]>(initialSuites)
    const [selectedSuiteId, setSelectedSuiteId] = useState<string>(initialSuites[0].id)
    const [searchQuery, setSearchQuery] = useState("")
    const [testCases, setTestCases] = useState<TestCase[]>(initialTestCases)
    const [isAddTestOpen, setIsAddTestOpen] = useState(false)
    const [isCreateSuiteOpen, setIsCreateSuiteOpen] = useState(false)
    const [newSuite, setNewSuite] = useState({
        name: "",
        id: ""
    })
    const [newTest, setNewTest] = useState<Partial<TestCase>>({
        name: "New Test",
        type: "voice",
        script: "",
        rubric: "",
        attempts: 1,
    })

    const selectedSuite = suites.find(s => s.id === selectedSuiteId) || suites[0]

    const filteredSuites = suites.filter(suite =>
        suite.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleAddTest = useCallback(() => {
        if (newTest.name && newTest.type) {
            const test: TestCase = {
                id: `tc-${Date.now()}`,
                name: newTest.name || "Untitled Test",
                type: newTest.type as "voice" | "chat",
                script: newTest.script || "",
                rubric: newTest.rubric || "",
                attempts: newTest.attempts || 1,
            }
            setTestCases(prev => [...prev, test])
            setNewTest({
                name: "New Test",
                type: "voice",
                script: "",
                rubric: "",
                attempts: 1,
            })
            setIsAddTestOpen(false)
        }
    }, [newTest])

    const handleCreateSuite = useCallback(() => {
        if (newSuite.name.trim()) {
            const suiteId = newSuite.id || uuidv4()
            const newSuiteData: TestSuite = {
                id: suiteId,
                name: newSuite.name.trim(),
                createdAt: new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                }),
                testCount: 0,
            }

            // Update the suites state
            setSuites(prev => [...prev, newSuiteData])

            setNewSuite({ name: "", id: "" })
            setIsCreateSuiteOpen(false)

            // Select the newly created suite
            setSelectedSuiteId(suiteId)
        }
    }, [newSuite])

    const handleRunTests = () => {
        // Simulate test run - will be replaced with actual implementation
        console.log('Running tests for suite:', selectedSuiteId)
    }

    return (
        <TooltipProvider>
            <div className="container mx-auto py-8 px-6 lg:px-8 max-w-7xl">
                <div className="space-y-8">
                    {/* Header */}
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">Test Suites</h1>
                        <p className="text-muted-foreground">
                            Create and manage your test suites for automated AI testing
                        </p>
                    </div>

                    {/* Search and Create */}
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                            <Input
                                placeholder="Search test suites..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <Dialog open={isCreateSuiteOpen} onOpenChange={setIsCreateSuiteOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-primary hover:bg-primary/90" onClick={() => {
                                    const generatedId = uuidv4()
                                    setNewSuite(prev => ({ ...prev, id: generatedId }))
                                }}>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Test Suite
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                        <Beaker className="w-5 h-5 text-primary" />
                                        Create New Test Suite
                                    </DialogTitle>
                                    <DialogDescription>
                                        Create a new test suite to organize your AI testing scenarios
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="suite-name">Test Suite Name</Label>
                                        <Input
                                            id="suite-name"
                                            placeholder="e.g. Customer Service Flows"
                                            value={newSuite.name}
                                            onChange={(e) => setNewSuite(prev => ({ ...prev, name: e.target.value }))}
                                            autoFocus
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="suite-id">Suite ID (Auto-generated)</Label>
                                        <Input
                                            id="suite-id"
                                            value={newSuite.id}
                                            readOnly
                                            className="bg-muted font-mono text-sm"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            This unique identifier is automatically generated for your test suite
                                        </p>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => {
                                        setIsCreateSuiteOpen(false)
                                        setNewSuite({ name: "", id: "" })
                                    }}>
                                        Cancel
                                    </Button>
                                    <Button onClick={handleCreateSuite} disabled={!newSuite.name.trim()}>
                                        Create Test Suite
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    {/* Test Suites Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSuites.map((suite) => (
                            <Card
                                key={suite.id}
                                className={cn(
                                    "cursor-pointer hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/30",
                                    selectedSuiteId === suite.id && "ring-2 ring-primary/20 border-primary/50"
                                )}
                                onClick={() => setSelectedSuiteId(suite.id)}
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg">{suite.name}</CardTitle>
                                        <Badge variant="secondary" className="text-xs">
                                            {suite.testCount} tests
                                        </Badge>
                                    </div>
                                    <CardDescription className="text-sm">
                                        Created {suite.createdAt}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex gap-2">
                                        <Button className="flex-1" size="sm" variant="outline">
                                            <Eye className="w-4 h-4 mr-2" />
                                            View
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="bg-primary hover:bg-primary/90"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setSelectedSuiteId(suite.id)
                                            }}
                                        >
                                            <Play className="w-4 h-4 mr-2 fill-current" />
                                            Run
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Selected Suite Details */}
                    {selectedSuite && (
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-xl">{selectedSuite.name}</CardTitle>
                                        <CardDescription>
                                            {selectedSuite.testCount} test cases • Created {selectedSuite.createdAt}
                                        </CardDescription>
                                    </div>
                                    <Button className="bg-primary hover:bg-primary/90" onClick={handleRunTests}>
                                        <Play className="w-4 h-4 mr-2 fill-current" />
                                        Run Tests
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="configure" className="space-y-6">
                                    <TabsList className="bg-muted/30 p-1 border border-border/50">
                                        <TabsTrigger
                                            value="configure"
                                            className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all duration-200"
                                        >
                                            <Settings className="w-4 h-4 mr-2" />
                                            Configure Tests
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="runs"
                                            className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all duration-200"
                                        >
                                            <Play className="w-4 h-4 mr-2" />
                                            Runs
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="configure" className="space-y-6">
                                        {/* Test Configuration Content */}
                                        <div className="space-y-6">
                                            {/* Mode Selection */}
                                            <div className="space-y-3">
                                                <Label className="text-sm text-muted-foreground">Testing Mode</Label>
                                                <Select defaultValue="chat">
                                                    <SelectTrigger className="w-full max-w-xs bg-card/50 border-border/50">
                                                        <div className="flex items-center gap-2">
                                                            <MessageSquare className="w-4 h-4 text-muted-foreground" />
                                                            <SelectValue />
                                                        </div>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="chat">
                                                            <div className="flex items-center gap-2">
                                                                <MessageSquare className="w-4 h-4" />
                                                                Chat
                                                            </div>
                                                        </SelectItem>
                                                        <SelectItem value="voice">
                                                            <div className="flex items-center gap-2">
                                                                <Phone className="w-4 h-4" />
                                                                Voice Call
                                                            </div>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>

                                            {/* Test Cases Section */}
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-lg font-semibold">Test Cases</h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            Define tests that will be run against your AI assistant
                                                        </p>
                                                    </div>
                                                    <Dialog open={isAddTestOpen} onOpenChange={setIsAddTestOpen}>
                                                        <DialogTrigger asChild>
                                                            <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                                                                <Plus className="w-4 h-4 mr-2" /> Add Test
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="sm:max-w-lg">
                                                            <DialogHeader>
                                                                <DialogTitle className="flex items-center gap-2">
                                                                    <Beaker className="w-5 h-5 text-primary" />
                                                                    Add Test Case
                                                                </DialogTitle>
                                                                <DialogDescription>
                                                                    Define a new test case for your suite
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="space-y-4 py-4">
                                                                <div className="space-y-2">
                                                                    <Label>Name</Label>
                                                                    <Input
                                                                        placeholder="e.g. Greeting Flow"
                                                                        value={newTest.name || ""}
                                                                        onChange={(e) => setNewTest(prev => ({ ...prev, name: e.target.value }))}
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label>Type</Label>
                                                                    <Select
                                                                        value={newTest.type}
                                                                        onValueChange={(value) => setNewTest(prev => ({ ...prev, type: value as "voice" | "chat" }))}
                                                                    >
                                                                        <SelectTrigger>
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="voice">Voice</SelectItem>
                                                                            <SelectItem value="chat">Chat</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label>Script</Label>
                                                                    <Textarea
                                                                        placeholder="Step-by-step test instructions..."
                                                                        value={newTest.script || ""}
                                                                        onChange={(e) => setNewTest(prev => ({ ...prev, script: e.target.value }))}
                                                                        className="min-h-[100px]"
                                                                    />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label>Rubric</Label>
                                                                    <Textarea
                                                                        placeholder="Evaluation criteria..."
                                                                        value={newTest.rubric || ""}
                                                                        onChange={(e) => setNewTest(prev => ({ ...prev, rubric: e.target.value }))}
                                                                        className="min-h-[80px]"
                                                                    />
                                                                </div>
                                                            </div>
                                                            <DialogFooter>
                                                                <Button variant="outline" onClick={() => setIsAddTestOpen(false)}>
                                                                    Cancel
                                                                </Button>
                                                                <Button onClick={handleAddTest}>
                                                                    Add Test Case
                                                                </Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>

                                                {/* Test Cases List */}
                                                {testCases.length === 0 ? (
                                                    <Card className="border-dashed border-2 border-border/50">
                                                        <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                                                            <Beaker className="w-8 h-8 text-muted-foreground mb-3" />
                                                            <p className="text-muted-foreground">No test cases added yet</p>
                                                        </CardContent>
                                                    </Card>
                                                ) : (
                                                    <div className="space-y-3">
                                                        {testCases.map((testCase) => (
                                                            <Card key={testCase.id} className="border-border/50">
                                                                <CardContent className="p-4">
                                                                    <div className="flex items-center justify-between">
                                                                        <div className="flex-1">
                                                                            <div className="flex items-center gap-2 mb-1">
                                                                                <h4 className="font-medium">{testCase.name}</h4>
                                                                                <Badge variant="secondary" className="text-xs capitalize">
                                                                                    {testCase.type}
                                                                                </Badge>
                                                                            </div>
                                                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                                                {testCase.rubric}
                                                                            </p>
                                                                        </div>
                                                                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </Button>
                                                                    </div>
                                                                </CardContent>
                                                            </Card>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="runs" className="space-y-6">
                                        {/* Test Runs History */}
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold">Test Run History</h3>
                                                <Badge variant="secondary">{mockTestRuns.length} runs</Badge>
                                            </div>

                                            {mockTestRuns.length === 0 ? (
                                                <Card className="border-dashed border-2 border-border/50">
                                                    <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                                                        <Play className="w-8 h-8 text-muted-foreground mb-3" />
                                                        <p className="text-muted-foreground">No test runs yet</p>
                                                        <p className="text-sm text-muted-foreground/70">Run your test suite to see results here</p>
                                                    </CardContent>
                                                </Card>
                                            ) : (
                                                <Card>
                                                    <CardContent className="p-0">
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead>Suite</TableHead>
                                                                    <TableHead>Status</TableHead>
                                                                    <TableHead>Started</TableHead>
                                                                    <TableHead>Duration</TableHead>
                                                                    <TableHead>Results</TableHead>
                                                                    <TableHead></TableHead>
                                                                </TableRow>
                                                            </TableHeader>
                                                            <TableBody>
                                                                {mockTestRuns.map((run) => (
                                                                    <TableRow key={run.id} className="h-16">
                                                                        <TableCell className="font-medium">{run.suiteName}</TableCell>
                                                                        <TableCell>
                                                                            <Badge
                                                                                variant={run.status === 'completed' ? 'default' : run.status === 'failed' ? 'destructive' : 'secondary'}
                                                                                className="capitalize"
                                                                            >
                                                                                {run.status}
                                                                            </Badge>
                                                                        </TableCell>
                                                                        <TableCell className="text-sm text-muted-foreground">{run.startedAt}</TableCell>
                                                                        <TableCell className="text-sm">{run.duration}</TableCell>
                                                                        <TableCell>
                                                                            <span className="text-sm font-medium">
                                                                                {run.passedTests}/{run.totalTests} passed
                                                                            </span>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <Button variant="ghost" size="sm">
                                                                                <Eye className="w-4 h-4" />
                                                                            </Button>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))}
                                                            </TableBody>
                                                        </Table>
                                                    </CardContent>
                                                </Card>
                                            )}
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </TooltipProvider>
    )
}
