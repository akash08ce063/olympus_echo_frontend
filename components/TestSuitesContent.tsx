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
    Info,
    Check,
    ChevronsUpDown
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import { cn } from "@/lib/utils"
import { AddAssistantDialog, type Assistant } from "@/components/AddAssistantDialog"
import { TestCasesSection } from "@/components/TestCasesSection"
import { TestSuitesService } from "@/services/testSuites"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"

// Types
interface TestSuite {
    id: string
    name: string
    description?: string
    target_agent_id?: string
    user_agent_id?: string
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
    const { user } = useAuth()
    const [suites, setSuites] = useState<TestSuite[]>(initialSuites)
    const [selectedSuiteId, setSelectedSuiteId] = useState<string>(initialSuites[0].id)
    const [searchQuery, setSearchQuery] = useState("")
    const [testCases, setTestCases] = useState<TestCase[]>(initialTestCases)
    const [isCreateSuiteOpen, setIsCreateSuiteOpen] = useState(false)
    const [isAddAssistantOpen, setIsAddAssistantOpen] = useState(false)
    const [openCombobox, setOpenCombobox] = useState(false)
    const [selectedAssistant, setSelectedAssistant] = useState<string>("")
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
        description: "",
        uuid: "",
    })

    const selectedSuite = initialSuites.find(s => s.id === selectedSuiteId) || initialSuites[0]

    const filteredSuites = initialSuites.filter(suite =>
        suite.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleCreateSuite = useCallback(async () => {
        if (!newSuite.name.trim() || !user?.id) return

        try {
            await TestSuitesService.createTestSuite(user.id, {
                name: newSuite.name,
                description: newSuite.description
            })

            const suite: TestSuite = {
                id: newSuite.uuid || crypto.randomUUID(),
                name: newSuite.name,
                description: newSuite.description,
                createdAt: new Date().toLocaleDateString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric'
                }),
                testCount: 0,
            }

            setSuites(prev => [suite, ...prev])
            setSelectedSuiteId(suite.id)

            setNewSuite({
                name: "",
                description: "",
                uuid: "",
            })
            setIsCreateSuiteOpen(false)
            toast.success("Test suite created successfully")
        } catch (error) {
            console.error("Failed to create test suite:", error)
            toast.error("Failed to create test suite")
        }
    }, [newSuite])

    const handleUpdateSuiteAgent = useCallback(async (field: 'target_agent_id' | 'user_agent_id', agentId: string) => {
        if (!selectedSuite) return;

        try {
            await TestSuitesService.updateTestSuite(selectedSuite.id, {
                [field]: agentId
            });

            setSuites(prev => prev.map(s =>
                s.id === selectedSuite.id
                    ? { ...s, [field]: agentId }
                    : s
            ));

            toast.success(`${field === 'target_agent_id' ? 'Target' : 'Tester'} agent updated`)
        } catch (error) {
            console.error(`Failed to update ${field}:`, error);
            toast.error(`Failed to update ${field === 'target_agent_id' ? 'target' : 'tester'} agent`)
        }
    }, [selectedSuite])

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
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Textarea
                                            placeholder="Describe the purpose of this test suite..."
                                            value={newSuite.description}
                                            onChange={(e) => setNewSuite(prev => ({ ...prev, description: e.target.value }))}
                                            className="bg-background/50 border-border/50 focus:border-primary/50 min-h-[80px]"
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
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive">
                                                Delete Test Suite
                                            </DropdownMenuItem>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete the test suite and all its test cases.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                                    Delete
                                                </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </DropdownMenuContent>
                            </DropdownMenu>
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
                                                    <Select
                                                        value={selectedSuite?.user_agent_id || ""}
                                                        onValueChange={(value) => handleUpdateSuiteAgent('user_agent_id', value)}
                                                    >
                                                        <SelectTrigger className="w-full bg-background/50 border-border/50">
                                                            <SelectValue placeholder="Select Tester Agent" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {assistants.map((assistant) => (
                                                                <SelectItem key={assistant.id} value={assistant.id}>
                                                                    {assistant.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <p className="text-xs text-muted-foreground leading-relaxed">
                                                    This is the assistant that will call or chat with your assistant to test them.
                                                </p>
                                            </CardContent>
                                        </Card>

                                        {/* Arrow */}
                                        <div className="flex items-center justify-center lg:shrink-0">
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
                                                    <Select
                                                        value={selectedSuite?.target_agent_id || ""}
                                                        onValueChange={(value) => handleUpdateSuiteAgent('target_agent_id', value)}
                                                    >
                                                        <SelectTrigger className="w-full bg-background/50 border-border/50">
                                                            <SelectValue placeholder="Select Target Agent" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {assistants.map((assistant) => (
                                                                <SelectItem key={assistant.id} value={assistant.id}>
                                                                    {assistant.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="w-full border-primary/30 text-primary hover:bg-primary/10 hover:text-primary transition-colors mt-2"
                                                        onClick={() => setIsAddAssistantOpen(true)}
                                                    >
                                                        <Plus className="w-4 h-4 mr-2" />
                                                        Add Assistant
                                                    </Button>
                                                </div>
                                                <p className="text-xs text-muted-foreground leading-relaxed">
                                                    This is the agent that will call or chat with your agent to test them.
                                                </p>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Test Cases Section */}
                                    <TestCasesSection
                                        testCases={testCases}
                                        onAddTestCase={(testCase) => {
                                            const newTest: TestCase = {
                                                ...testCase,
                                                id: `tc-${Date.now()}`,
                                            }
                                            setTestCases(prev => [...prev, newTest])
                                        }}
                                        onUpdateTestCase={(id, updatedTestCase) => {
                                            setTestCases(prev => prev.map(test =>
                                                test.id === id ? { ...test, ...updatedTestCase } : test
                                            ))
                                        }}
                                        onDeleteTestCase={(id) => {
                                            setTestCases(prev => prev.filter(test => test.id !== id))
                                        }}
                                    />

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
