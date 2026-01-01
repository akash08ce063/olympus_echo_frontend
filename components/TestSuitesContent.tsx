"use client"

import { useState, useCallback } from "react"
import {
    ArrowRight,
    Beaker,
    Bot,
    Eye,
    MessageSquare,
    MoreHorizontal,
    Phone,
    Play,
    Plus,
    Search,
    Settings,
    Sparkles,
    User,
    X,
    Info
} from "lucide-react"

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
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { AddAssistantDialog, type Assistant } from "@/components/AddAssistantDialog"

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


// Mock Data
const initialSuites: TestSuite[] = [
    {
        id: "20ce1a33-68f8-4812-9d99-48ae7e68e3c0",
        name: "New Test Suite",
        createdAt: "Dec 31, 2025",
        testCount: 3,
    },
    {
        id: "ts-002",
        name: "New Test Suite",
        createdAt: "Dec 31, 2025",
        testCount: 0,
    },
    {
        id: "ts-003",
        name: "New Test Suite",
        createdAt: "Dec 29, 2025",
        testCount: 0,
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

export function TestSuitesContent() {
    const [selectedSuiteId, setSelectedSuiteId] = useState<string>(initialSuites[0].id)
    const [searchQuery, setSearchQuery] = useState("")
    const [testCases, setTestCases] = useState<TestCase[]>(initialTestCases)
    const [isAddTestOpen, setIsAddTestOpen] = useState(false)
    const [isCreateSuiteOpen, setIsCreateSuiteOpen] = useState(false)
    const [isAddAssistantOpen, setIsAddAssistantOpen] = useState(false)
    const [assistants, setAssistants] = useState<Assistant[]>([
        {
            id: "1",
            name: "Main Support Bot",
            websocketUrl: "ws://localhost:8080",
            sampleRate: "16000",
            encoding: "pcm_16",
            createdAt: "Dec 31, 2025",
        },
        {
            id: "2",
            name: "Sales Assistant",
            websocketUrl: "ws://localhost:8081",
            sampleRate: "22050",
            encoding: "pcm_16",
            createdAt: "Dec 30, 2025",
        },
    ])
    const [newSuite, setNewSuite] = useState({
        name: "",
        uuid: "",
    })
    const [newTest, setNewTest] = useState<Partial<TestCase>>({
        name: "New Test",
        type: "voice",
        script: "",
        rubric: "",
        attempts: 1,
    })

    const selectedSuite = initialSuites.find(s => s.id === selectedSuiteId) || initialSuites[0]

    const filteredSuites = initialSuites.filter(suite =>
        suite.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleCreateSuite = useCallback(() => {
        if (newSuite.name) {
            const suite: TestSuite = {
                id: newSuite.uuid || crypto.randomUUID(),
                name: newSuite.name,
                createdAt: new Date().toLocaleDateString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric'
                }),
                testCount: 0,
            }
            // Note: In a real app, you'd update the suites state here
            setNewSuite({
                name: "",
                uuid: "",
            })
            setIsCreateSuiteOpen(false)
        }
    }, [newSuite])

    const handleAddAssistant = useCallback((assistantData: Omit<Assistant, 'id' | 'createdAt'>) => {
        const newAssistant: Assistant = {
            ...assistantData,
            id: Date.now().toString(),
            createdAt: new Date().toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric'
            }),
        }
        setAssistants(prev => [...prev, newAssistant])
    }, [])

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

    return (
        <TooltipProvider>
            <div className="flex h-[calc(100vh-4rem)] overflow-hidden bg-background text-foreground">
                {/* Sidebar List */}
                <div className="w-72 border-r border-border/50 flex flex-col bg-card/20 backdrop-blur-sm">
                    <div className="p-4 space-y-4 border-b border-border/50">
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold text-base flex items-center gap-2">
                                <Beaker className="w-4 h-4 text-primary" />
                                Test Suites
                            </h2>
                            <span className="text-xs text-muted-foreground">Docs</span>
                        </div>
                        <Dialog open={isCreateSuiteOpen} onOpenChange={setIsCreateSuiteOpen}>
                            <DialogTrigger asChild>
                                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-primary/40">
                                    <Plus className="mr-2 h-4 w-4" /> Create Test Suite
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md bg-card border-border/50">
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                        <div className="p-1.5 rounded-md bg-primary/10">
                                            <Beaker className="w-4 h-4 text-primary" />
                                        </div>
                                        Create Test Suite
                                    </DialogTitle>
                                    <DialogDescription>
                                        Create a new test suite to organize your tests.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label>Name</Label>
                                        <Input
                                            placeholder="e.g. Customer Support Tests"
                                            value={newSuite.name}
                                            onChange={(e) => setNewSuite(prev => ({ ...prev, name: e.target.value }))}
                                            className="bg-background/50 border-border/50 focus:border-primary/50"
                                        />
                                    </div>
                                    
                                </div>
                                <DialogFooter className="gap-2 sm:gap-0">
                                    <Button variant="outline" onClick={() => setIsCreateSuiteOpen(false)} className="border-border/50">
                                        Cancel
                                    </Button>
                                    <Button onClick={handleCreateSuite} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25">
                                        Create Suite
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <ScrollArea className="flex-1 p-3">
                        <div className="space-y-1">
                            {filteredSuites.map((suite) => (
                                <button
                                    key={suite.id}
                                    type="button"
                                    onClick={() => setSelectedSuiteId(suite.id)}
                                    className={cn(
                                        "w-full text-left p-3 rounded-lg transition-all duration-200 border border-transparent space-y-1 group",
                                        selectedSuiteId === suite.id
                                            ? "bg-primary/10 border-primary/30"
                                            : "hover:bg-accent/50 hover:border-border/50"
                                    )}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className={cn(
                                            "font-medium truncate text-sm transition-colors",
                                            selectedSuiteId === suite.id ? "text-primary" : "text-foreground group-hover:text-primary"
                                        )}>
                                            {suite.name}
                                        </span>
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        {suite.createdAt}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col bg-background relative overflow-hidden">
                    {/* Decorative background glow */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                    {/* Header */}
                    <div className="h-16 border-b border-border/50 flex items-center justify-between px-6 bg-card/30 backdrop-blur-sm z-10">
                        <div className="space-y-0.5">
                            <h1 className="text-xl font-semibold tracking-tight">{selectedSuite.name}</h1>
                            <p className="text-xs text-muted-foreground font-mono">Test Suite ID: {selectedSuite.id}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-primary/40">
                                <Play className="mr-2 h-4 w-4 fill-current" /> Run Tests
                            </Button>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Content */}
                    <ScrollArea className="flex-1">
                        <div className="p-6 lg:p-8 space-y-8">
                            <Tabs defaultValue="configure" className="space-y-6">
                                <TabsList className="bg-muted/30 p-1 border border-border/50 inline-flex">
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

                                <TabsContent value="configure" className="space-y-8 outline-none">

                                    {/* Assistants Config Flow */}
                                    <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
                                        {/* Tester Assistant */}
                                        <Card className="bg-card/30 border-border/50 hover:border-primary/30 transition-all duration-300 group flex-1 w-full lg:w-auto">
                                            <CardHeader className="pb-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                                        <User className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <CardTitle className="text-base font-semibold">Tester Assistant</CardTitle>
                                                        <CardDescription className="text-xs">This is the assistant that will call or chat with your assistant to test them.</CardDescription>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label className="text-xs text-muted-foreground">Select tester assistant configuration</Label>
                                                    <div className="flex gap-2">
                                                        <Select defaultValue="basic">
                                                            <SelectTrigger className="bg-background/50 border-border/50 flex-1">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="basic">Basic</SelectItem>
                                                                <SelectItem value="angry">Angry Customer</SelectItem>
                                                                <SelectItem value="confused">Confused User</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <Button variant="outline" size="sm" className="shrink-0 border-border/50 hover:border-primary/30 hover:text-primary transition-colors">
                                                            <Eye className="w-4 h-4 mr-2" />
                                                            View Config
                                                        </Button>
                                                    </div>
                                                </div>
                                                <p className="text-xs text-muted-foreground leading-relaxed">
                                                    This is the assistant that will call or chat with your assistant to test them.
                                                </p>
                                            </CardContent>
                                        </Card>

                                        {/* Arrow */}
                                        <div className="flex items-center justify-center lg:flex-shrink-0">
                                            <ArrowRight className="w-6 h-6 text-muted-foreground/50 lg:rotate-0 rotate-90" />
                                        </div>

                                        {/* Target Assistant */}
                                        <Card className="bg-card/30 border-border/50 hover:border-primary/30 transition-all duration-300 group flex-1 w-full lg:w-auto">
                                            <CardHeader className="pb-4">
                                                <div className="flex items-start gap-3">
                                                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                                        <Bot className="w-5 h-5" />
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <CardTitle className="text-base font-semibold">Target Assistant</CardTitle>
                                                        <CardDescription className="text-xs">This is the agent that will be tested</CardDescription>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label className="text-xs text-muted-foreground">Select target agent</Label>
                                                    <Select onValueChange={(value) => {
                                                        if (value === "add-assistant") {
                                                            setIsAddAssistantOpen(true)
                                                        }
                                                    }}>
                                                        <SelectTrigger className="bg-background/50 border-border/50">
                                                            <SelectValue placeholder="Select assistant" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {assistants.map((assistant) => (
                                                                <SelectItem key={assistant.id} value={assistant.id}>
                                                                    {assistant.name}
                                                                </SelectItem>
                                                            ))}
                                                            <SelectItem value="add-assistant" className="text-primary font-medium">
                                                                <div className="flex items-center gap-2">
                                                                    <Plus className="w-4 h-4" />
                                                                    Add Assistant
                                                                </div>
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <p className="text-xs text-muted-foreground leading-relaxed">
                                                    This is the agent that will call or chat with your agent to test them.
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Test Cases Section */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold">Test cases</h3>
                                                <p className="text-sm text-muted-foreground">Create tests that the assistant will be tested on</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" className="border-primary/30 text-primary hover:bg-primary/10 hover:text-primary transition-colors">
                                                    <Sparkles className="w-4 h-4 mr-2" />
                                                    Generate tests
                                                </Button>
                                                <Dialog open={isAddTestOpen} onOpenChange={setIsAddTestOpen}>
                                                    <DialogTrigger asChild>
                                                        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all duration-300">
                                                            <Plus className="w-4 h-4 mr-2" /> Add Test
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-lg bg-card border-border/50">
                                                        <DialogHeader>
                                                            <DialogTitle className="flex items-center gap-2">
                                                                <div className="p-1.5 rounded-md bg-primary/10">
                                                                    <Beaker className="w-4 h-4 text-primary" />
                                                                </div>
                                                                Add Test
                                                            </DialogTitle>
                                                            <DialogDescription>
                                                                Describe how the assistant will be tested.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="space-y-5 py-4">
                                                            <div className="space-y-2">
                                                                <Label>Name</Label>
                                                                <Input
                                                                    placeholder="e.g. Greeting Flow"
                                                                    value={newTest.name || ""}
                                                                    onChange={(e) => setNewTest(prev => ({ ...prev, name: e.target.value }))}
                                                                    className="bg-background/50 border-border/50 focus:border-primary/50"
                                                                />
                                                            </div>

                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <Label>Type</Label>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>Voice tests simulate phone calls, Chat tests simulate text conversations</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </div>
                                                                <Select
                                                                    value={newTest.type}
                                                                    onValueChange={(value) => setNewTest(prev => ({ ...prev, type: value as "voice" | "chat" }))}
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
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>Step-by-step instructions for the tester to follow</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </div>
                                                                <Textarea
                                                                    className="min-h-[120px] resize-none bg-background/50 border-border/50 focus:border-primary/50"
                                                                    placeholder={"1: Greet the caller.\n2: Ask \"How much larger is the sun than the moon?\"\n3: Ask the same question again.\n4: End the call."}
                                                                    value={newTest.script || ""}
                                                                    onChange={(e) => setNewTest(prev => ({ ...prev, script: e.target.value }))}
                                                                />
                                                            </div>

                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <Label>Rubric</Label>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>Criteria used to evaluate if the test passed</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </div>
                                                                <Textarea
                                                                    className="min-h-[100px] resize-none bg-background/50 border-border/50 focus:border-primary/50"
                                                                    placeholder="The assistant should refuse to answer the question since it's not related to the caller's business."
                                                                    value={newTest.rubric || ""}
                                                                    onChange={(e) => setNewTest(prev => ({ ...prev, rubric: e.target.value }))}
                                                                />
                                                            </div>

                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <Label>Attempts</Label>
                                                                    <Tooltip>
                                                                        <TooltipTrigger asChild>
                                                                            <Info className="w-3.5 h-3.5 text-muted-foreground cursor-help" />
                                                                        </TooltipTrigger>
                                                                        <TooltipContent>
                                                                            <p>Number of times to run this test</p>
                                                                        </TooltipContent>
                                                                    </Tooltip>
                                                                </div>
                                                                <Input
                                                                    type="number"
                                                                    min={1}
                                                                    value={newTest.attempts || 1}
                                                                    onChange={(e) => setNewTest(prev => ({ ...prev, attempts: parseInt(e.target.value) || 1 }))}
                                                                    className="bg-background/50 border-border/50 focus:border-primary/50"
                                                                />
                                                            </div>
                                                        </div>
                                                        <DialogFooter className="gap-2 sm:gap-0">
                                                            <Button variant="outline" onClick={() => setIsAddTestOpen(false)} className="border-border/50">
                                                                Cancel
                                                            </Button>
                                                            <Button onClick={handleAddTest} className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25">
                                                                Save Changes
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                            </div>
                                        </div>

                                        {/* Add Assistant Modal */}
                                        <AddAssistantDialog
                                            open={isAddAssistantOpen}
                                            onOpenChange={setIsAddAssistantOpen}
                                            onAddAssistant={handleAddAssistant}
                                        />

                                        {/* Test Cases Table */}
                                        {/* <div className="rounded-md border border-border/50">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="border-border/50">
                                                        <TableHead className="font-semibold">Name</TableHead>
                                                        <TableHead className="font-semibold">Type</TableHead>
                                                        <TableHead className="font-semibold">Script</TableHead>
                                                        <TableHead className="font-semibold">Rubric</TableHead>
                                                        <TableHead className="font-semibold">Attempts</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {testCases.length === 0 ? (
                                                        <TableRow>
                                                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                                                <Beaker className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                                                No test cases added yet.
                                                                <br />
                                                                <span className="text-sm">Click "Generate tests" or "Add Test" to start.</span>
                                                            </TableCell>
                                                        </TableRow>
                                                    ) : (
                                                        testCases.map((test) => (
                                                            <TableRow key={test.id} className="border-border/50">
                                                                <TableCell className="font-medium">{test.name}</TableCell>
                                                                <TableCell>
                                                                    <Badge variant="secondary" className="text-xs capitalize bg-primary/10 text-primary border-0">
                                                                        {test.type}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                                                                    {test.script}
                                                                </TableCell>
                                                                <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                                                                    {test.rubric}
                                                                </TableCell>
                                                                <TableCell className="text-center">{test.attempts}</TableCell>
                                                            </TableRow>
                                                        ))
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div> */}
                                    </div>

                                </TabsContent>

                                <TabsContent value="runs" className="space-y-6 outline-none">
                                    <div className="border border-dashed border-border/50 rounded-lg p-12 text-center bg-muted/5">
                                        <Play className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                                        <p className="text-muted-foreground">No test runs yet.</p>
                                        <p className="text-sm text-muted-foreground/70 mt-1">Click &quot;Run Tests&quot; to execute your test suite.</p>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </ScrollArea>
                </div>
            </div>
        </TooltipProvider>
    )
}
