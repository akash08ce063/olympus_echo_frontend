"use client"

import { useState, useCallback, useEffect } from "react"
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
    ChevronsUpDown,
    Trash2,
    Loader2
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
import { Skeleton } from "@/components/ui/skeleton"
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
import { TargetAgentsService } from "@/services/targetAgents"
import { UserAgentsService } from "@/services/userAgents"
import { TestCaseService } from "@/services/testCases"
import { useAuth } from "@/hooks/useAuth"
import { useTestContext } from "@/context/TestContext"
import { RunsHistory } from "@/components/test-suite/RunsHistory"
import { TestRunner } from "@/components/test-suite/TestRunner"
import { Experiment } from "@/types/test-suite"
import { toast } from "sonner"

// Types
interface TestSuite {
    id: string
    name: string
    description?: string
    target_agent_id?: string
    user_agent_id?: string
    created_at: string
    updated_at: string
    user_id: string
    targetAgentName?: string
    userAgentName?: string
    testCount: number
    createdAt?: string // For backward compatibility with mock data
}

import { TestCase } from "@/types/test-suite"


// Mock Data
const initialSuites: TestSuite[] = [
    {
        id: "20ce1a33-68f8-4812-9d99-48ae7e68e3c0",
        name: "New Test Suite",
        created_at: "2025-12-31T00:00:00Z",
        updated_at: "2025-12-31T00:00:00Z",
        user_id: "mock-user-id",
        testCount: 3,
    },
    {
        id: "ts-002",
        name: "New Test Suite",
        created_at: "2025-12-31T00:00:00Z",
        updated_at: "2025-12-31T00:00:00Z",
        user_id: "mock-user-id",
        testCount: 0,
    },
    {
        id: "ts-003",
        name: "New Test Suite",
        created_at: "2025-12-29T00:00:00Z",
        updated_at: "2025-12-29T00:00:00Z",
        user_id: "mock-user-id",
        testCount: 0,
    },
]

const initialTestCases: TestCase[] = [
    {
        id: "tc-001",
        test_suite_id: "20ce1a33-68f8-4812-9d99-48ae7e68e3c0",
        name: "Greeting Flow",
        goals: [{ text: "Hello, can you help me?" }],
        evaluation_criteria: [{ expected: "Response contains Hello" }],
        timeout_seconds: 30,
        order_index: 0,
        is_active: true,
        attempts: 3,
        default_concurrent_calls: 1
    },
]

export function TestSuitesContent() {
    const { user } = useAuth()
    const [suites, setSuites] = useState<TestSuite[]>([])
    const [selectedSuiteId, setSelectedSuiteId] = useState<string | null>(null)
    const [selectedSuiteDetails, setSelectedSuiteDetails] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isDetailsLoading, setIsDetailsLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [testCases, setTestCases] = useState<TestCase[]>([])
    const [isCreateSuiteOpen, setIsCreateSuiteOpen] = useState(false)
    const [isAddAssistantOpen, setIsAddAssistantOpen] = useState(false)
    const [openCombobox, setOpenCombobox] = useState(false)
    const [selectedAssistant, setSelectedAssistant] = useState<string>("")
    // Target agents for dropdown
    const [targetAgents, setTargetAgents] = useState<{ id: string, name: string }[]>([])
    // User/Tester agents for dropdown
    const [userAgents, setUserAgents] = useState<{ id: string, name: string }[]>([])
    const [assistants, setAssistants] = useState<Assistant[]>([])
    const [selectedHistoryRun, setSelectedHistoryRun] = useState<Experiment | null>(null)
    const [isDeleteSuiteOpen, setIsDeleteSuiteOpen] = useState(false)
    const [isDeletingSuite, setIsDeletingSuite] = useState(false)
    const [isCreatingSuite, setIsCreatingSuite] = useState(false)

    const {
        runExperiment,
        activeExperiment,
        history,
    } = useTestContext()

    const suiteHistory = history.filter(h => h.datasetId === selectedSuiteId)

    const handleRunTests = async () => {
        if (!selectedSuiteId || !user?.id) return

        try {
            await TestSuitesService.runTestSuite(selectedSuiteId, user.id)
            runExperiment(selectedSuiteId)
            toast.success("Test run started")
        } catch (error) {
            console.error("Failed to start test run:", error)
            toast.error("Failed to start test run")
        }
    }
    const [newSuite, setNewSuite] = useState({
        name: "",
        description: "",
        uuid: "",
    })

    const fetchSuiteDetails = useCallback(async (id: string) => {
        setIsDetailsLoading(true)
        try {
            const response: any = await TestSuitesService.getTestSuiteDetails(id)
            console.log("Fetched suite details:", response)
            setSelectedSuiteDetails(response)
            if (response?.test_cases) {
                setTestCases(response.test_cases)
            } else {
                setTestCases([])
            }
        } catch (error) {
            console.error("Failed to fetch suite details:", error)
            // toast.error("Failed to load suite details")
        } finally {
            setIsDetailsLoading(false)
        }
    }, [])

    const fetchSuites = useCallback(async () => {
        if (!user?.id) return
        setIsLoading(true)
        try {
            // Note: axios interceptor already returns response.data, so use response directly
            const response = await TestSuitesService.getTestSuites(user.id) as any
            const apiData = response || {}
            const fetchedSuites = apiData.test_suites || []

            // Transform the data and fetch agent names
            const transformedSuites = await Promise.all(
                fetchedSuites.map(async (suite: any) => {
                    const transformedSuite: TestSuite = {
                        id: suite.id,
                        name: suite.name,
                        description: suite.description,
                        target_agent_id: suite.target_agent_id,
                        user_agent_id: suite.user_agent_id,
                        created_at: suite.created_at,
                        updated_at: suite.updated_at,
                        user_id: suite.user_id,
                        testCount: 0, // We'll need to implement this later
                        createdAt: new Date(suite.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: '2-digit',
                            year: 'numeric'
                        }),
                    }

                    // Fetch agent names if IDs are present (response is already unwrapped by axios)
                    if (suite.target_agent_id) {
                        try {
                            const targetAgentResponse = await TargetAgentsService.getTargetAgent(suite.target_agent_id) as any
                            transformedSuite.targetAgentName = targetAgentResponse?.name || 'Unknown Agent'
                        } catch (error) {
                            console.warn(`Failed to fetch target agent ${suite.target_agent_id}:`, error)
                            transformedSuite.targetAgentName = 'Unknown Agent'
                        }
                    }

                    if (suite.user_agent_id) {
                        try {
                            const userAgentResponse = await UserAgentsService.getUserAgent(suite.user_agent_id) as any
                            transformedSuite.userAgentName = userAgentResponse?.name || 'Unknown Agent'
                        } catch (error) {
                            console.warn(`Failed to fetch user agent ${suite.user_agent_id}:`, error)
                            transformedSuite.userAgentName = 'Unknown Agent'
                        }
                    }

                    return transformedSuite
                })
            )

            setSuites(transformedSuites)
            if (transformedSuites.length > 0 && !selectedSuiteId) {
                const firstSuiteId = transformedSuites[0].id
                setSelectedSuiteId(firstSuiteId)
                fetchSuiteDetails(firstSuiteId) // Fetch details for the first suite on load
            }
        } catch (error) {
            console.error("Failed to fetch test suites:", error)
            toast.error("Failed to load test suites")
        } finally {
            setIsLoading(false)
        }
    }, [user, fetchSuiteDetails])

    const handleSuiteSelect = useCallback((id: string) => {
        setSelectedSuiteId(id)
        fetchSuiteDetails(id)
    }, [fetchSuiteDetails])

    // Fetch agents for dropdown menus
    const fetchAgents = useCallback(async () => {
        if (!user?.id) return
        try {
            // Fetch target agents (response already unwrapped by axios)
            const targetResponse = await TargetAgentsService.getTargetAgents(user.id) as any
            const targetList = targetResponse?.target_agents || []
            setTargetAgents(targetList.map((a: any) => ({ id: a.id, name: a.name })))

            // Fetch user agents
            const userResponse = await UserAgentsService.getUserAgents(user.id) as any
            const userList = userResponse?.user_agents || []
            setUserAgents(userList.map((a: any) => ({ id: a.id, name: a.name })))
        } catch (error) {
            console.warn("Failed to fetch agents for dropdowns:", error)
        }
    }, [user])

    useEffect(() => {
        fetchSuites()
        fetchAgents()
    }, [fetchSuites, fetchAgents])

    const selectedSuite = suites.find(s => s.id === selectedSuiteId) || suites[0]

    const filteredSuites = suites.filter(suite =>
        suite.name.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleCreateSuite = useCallback(async () => {
        if (!newSuite.name.trim() || !user?.id) return

        setIsCreatingSuite(true)
        try {
            const response: any = await TestSuitesService.createTestSuite(user.id, {
                name: newSuite.name,
                description: newSuite.description
            })

            toast.success("Test suite created successfully")
            await fetchSuites()

            // If the response contains the new suite, select it
            if (response?.data?.id) {
                setSelectedSuiteId(response.data.id)
                fetchSuiteDetails(response.data.id)
            } else if (response?.id) {
                // some APIs return data directly
                setSelectedSuiteId(response.id)
                fetchSuiteDetails(response.id)
            }

            setNewSuite({
                name: "",
                description: "",
                uuid: "",
            })
            setIsCreateSuiteOpen(false)
        } catch (error) {
            console.error("Failed to create test suite:", error)
            toast.error("Failed to create test suite")
        } finally {
            setIsCreatingSuite(false)
        }
    }, [newSuite, user?.id, fetchSuites, fetchSuiteDetails])

    const handleUpdateSuiteAgent = useCallback(async (field: 'target_agent_id' | 'user_agent_id', agentId: string) => {
        if (!selectedSuite) return;

        try {
            await TestSuitesService.updateTestSuite(selectedSuite.id, {
                [field]: agentId
            });

            // Refresh systems from API
            await fetchSuites();
            if (selectedSuite.id) {
                fetchSuiteDetails(selectedSuite.id);
            }

            // Re-fetch details to get updated names and nested objects
            fetchSuiteDetails(selectedSuite.id);

            toast.success(`${field === 'target_agent_id' ? 'Target' : 'Tester'} agent updated`)
        } catch (error) {
            console.error(`Failed to update ${field}:`, error);
            toast.error(`Failed to update ${field === 'target_agent_id' ? 'target' : 'tester'} agent`)
        }
    }, [selectedSuite, fetchSuites, fetchSuiteDetails])

    const handleAddAssistant = useCallback((newAssistant: Assistant) => {
        setAssistants(prev => [...prev, newAssistant])
    }, [])


    const handleDeleteSuite = useCallback(async () => {
        if (!selectedSuiteId) return;

        setIsDeletingSuite(true);
        try {
            await TestSuitesService.deleteTestSuite(selectedSuiteId);
            toast.success("Test suite deleted successfully");

            const deletedSuiteIndex = suites.findIndex(s => s.id === selectedSuiteId);

            // Re-fetch suites to get the latest list
            const response: any = await TestSuitesService.getTestSuites(user?.id || "");
            const updatedSuites = response.data || [];
            setSuites(updatedSuites);

            if (updatedSuites.length > 0) {
                // Select another suite (either the previous one or the new first one)
                const nextSuite = updatedSuites[Math.max(0, deletedSuiteIndex - 1)];
                setSelectedSuiteId(nextSuite.id);
                fetchSuiteDetails(nextSuite.id);
            } else {
                setSelectedSuiteId(null);
                setSelectedSuiteDetails(null);
                setTestCases([]);
            }
            setIsDeleteSuiteOpen(false);
        } catch (error) {
            console.error("Failed to delete test suite:", error);
            toast.error("Failed to delete test suite");
        } finally {
            setIsDeletingSuite(false);
        }
    }, [selectedSuiteId, suites, fetchSuiteDetails, user?.id]);

    const handleRunSingleTest = useCallback(async (testCaseId: string, concurrentCalls: number) => {
        if (!user?.id) return;
        try {
            await TestSuitesService.runSingleTest(testCaseId, user.id, concurrentCalls);
            toast.success("Test run initiated");
        } catch (error) {
            console.error("Failed to run single test:", error);
            toast.error("Failed to initiate test run");
        }
    }, [user?.id]);


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
                                    <Button
                                        onClick={handleCreateSuite}
                                        disabled={isCreatingSuite}
                                        className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 min-w-[120px]"
                                    >
                                        {isCreatingSuite ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Creating...
                                            </>
                                        ) : (
                                            "Create Suite"
                                        )}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>

                    <ScrollArea className="flex-1 p-3">
                        <div className="space-y-1">
                            {isLoading ? (
                                <div className="space-y-2">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="p-3 rounded-lg border border-border/50 space-y-2">
                                            <Skeleton className="h-4 w-3/4" />
                                            <Skeleton className="h-3 w-1/2" />
                                        </div>
                                    ))}
                                </div>
                            ) : filteredSuites.length === 0 ? (
                                <div className="p-4 text-center">
                                    <p className="text-xs text-muted-foreground">No test suites found</p>
                                </div>
                            ) : (
                                filteredSuites.map((suite) => (
                                    <button
                                        key={suite.id}
                                        type="button"
                                        onClick={() => handleSuiteSelect(suite.id)}
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
                                            {suite.created_at || suite.createdAt ? new Date(suite.created_at || suite.createdAt!).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: '2-digit',
                                                year: 'numeric'
                                            }) : 'Unknown'}
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </div>

                {/* Main Content */}
                <div className="flex-1 flex flex-col bg-background relative overflow-hidden">
                    {/* Decorative background glow */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                    {/* Header */}
                    {!isLoading && suites.length > 0 && (
                        <div className="h-16 border-b border-border/50 flex items-center justify-between px-6 bg-card/30 backdrop-blur-sm z-10">
                            <div className="space-y-0.5">
                                <h1 className="text-xl font-semibold tracking-tight">{selectedSuiteDetails?.name || selectedSuite?.name || "Select a Suite"}</h1>
                                <p className="text-xs text-muted-foreground font-mono">Test Suite ID: {selectedSuiteDetails?.id || selectedSuite?.id || "---"}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={handleRunTests}
                                    disabled={activeExperiment?.status === 'running' && activeExperiment.datasetId === selectedSuiteId}
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-primary/40"
                                >
                                    <Play className={cn("mr-2 h-4 w-4 fill-current", activeExperiment?.status === 'running' && "animate-spin")} />
                                    {activeExperiment?.status === 'running' && activeExperiment.datasetId === selectedSuiteId ? 'Running...' : 'Run Tests'}
                                </Button>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onSelect={() => setIsDeleteSuiteOpen(true)}
                                            className="text-destructive focus:text-destructive"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Delete Test Suite
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    )}

                    {/* Content */}
                    <ScrollArea className="flex-1">
                        {!isLoading && suites.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                                    <div className="relative p-4 rounded-2xl bg-card border border-border/50 shadow-2xl">
                                        <Beaker className="w-8 h-8 text-primary" />
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight mb-2">Create your first test suite</h2>
                                <p className="text-muted-foreground max-w-[420px] mb-8">
                                    Test suites help you organize and run automated tests for your AI assistants.
                                    Start by creating a suite to define your test cases.
                                </p>
                                <Button
                                    onClick={() => setIsCreateSuiteOpen(true)}
                                    size="lg"
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-xl shadow-primary/20 h-11 px-8 font-medium transition-all duration-300 hover:scale-105 active:scale-95"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Test Suite
                                </Button>
                            </div>
                        ) : (
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
                                                            value={selectedSuiteDetails?.user_agent?.id || selectedSuite?.user_agent_id || ""}
                                                            onValueChange={(value) => handleUpdateSuiteAgent('user_agent_id', value)}
                                                        >
                                                            <SelectTrigger className="w-full bg-background/50 border-border/50">
                                                                <SelectValue placeholder="Select Tester Agent">
                                                                    {selectedSuiteDetails?.user_agent?.name || selectedSuite?.userAgentName || userAgents.find(a => a.id === (selectedSuiteDetails?.user_agent?.id || selectedSuite?.user_agent_id))?.name || 'Select Agent'}
                                                                </SelectValue>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {userAgents.length === 0 ? (
                                                                    <div className="p-2 text-sm text-muted-foreground">No tester agents available</div>
                                                                ) : (
                                                                    userAgents.map((agent) => (
                                                                        <SelectItem key={agent.id} value={agent.id}>
                                                                            {agent.name}
                                                                        </SelectItem>
                                                                    ))
                                                                )}
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
                                                            value={selectedSuiteDetails?.target_agent?.id || selectedSuite?.target_agent_id || ""}
                                                            onValueChange={(value) => handleUpdateSuiteAgent('target_agent_id', value)}
                                                        >
                                                            <SelectTrigger className="w-full bg-background/50 border-border/50">
                                                                <SelectValue placeholder="Select Target Agent">
                                                                    {selectedSuiteDetails?.target_agent?.name || selectedSuite?.targetAgentName || targetAgents.find(a => a.id === (selectedSuiteDetails?.target_agent?.id || selectedSuite?.target_agent_id))?.name || 'Select Agent'}
                                                                </SelectValue>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {targetAgents.length === 0 ? (
                                                                    <div className="p-2 text-sm text-muted-foreground">No target agents available</div>
                                                                ) : (
                                                                    targetAgents.map((agent) => (
                                                                        <SelectItem key={agent.id} value={agent.id}>
                                                                            {agent.name}
                                                                        </SelectItem>
                                                                    ))
                                                                )}
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
                                            testSuiteId={selectedSuiteId || ""}
                                            onAddTestCase={() => {
                                                if (selectedSuiteId) fetchSuiteDetails(selectedSuiteId)
                                            }}
                                            onUpdateTestCase={() => {
                                                if (selectedSuiteId) fetchSuiteDetails(selectedSuiteId)
                                            }}
                                            onRunTestCase={handleRunSingleTest}
                                            onDeleteTestCase={async (id) => {
                                                try {
                                                    await TestCaseService.deleteTestCase(id);
                                                    toast.success("Test case deleted successfully");
                                                    if (selectedSuiteId) fetchSuiteDetails(selectedSuiteId);
                                                } catch (error) {
                                                    console.error("Failed to delete test case:", error);
                                                    toast.error("Failed to delete test case");
                                                }
                                            }}
                                        />

                                    </TabsContent>

                                    <TabsContent value="runs" className="space-y-6 outline-none">
                                        {activeExperiment && activeExperiment.datasetId === selectedSuiteId && (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="text-lg font-semibold">Active Run</h3>
                                                    <Button variant="outline" size="sm" onClick={() => setSelectedHistoryRun(null)}>
                                                        View All History
                                                    </Button>
                                                </div>
                                                <TestRunner datasetId={selectedSuiteId || ""} />
                                            </div>
                                        )}

                                        {selectedHistoryRun ? (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <Button variant="ghost" size="sm" onClick={() => setSelectedHistoryRun(null)}>
                                                        ← Back to History
                                                    </Button>
                                                    <h3 className="text-sm font-medium text-muted-foreground">
                                                        Run ID: {selectedHistoryRun.id}
                                                    </h3>
                                                </div>
                                                <TestRunner
                                                    datasetId={selectedSuiteId || ""}
                                                    experiment={selectedHistoryRun}
                                                />
                                            </div>
                                        ) : (
                                            (!activeExperiment || activeExperiment.datasetId !== selectedSuiteId) && (
                                                <div className="space-y-4">
                                                    <h3 className="text-lg font-semibold tracking-tight">Run History</h3>
                                                    <RunsHistory
                                                        history={suiteHistory}
                                                        onViewDetails={(run) => setSelectedHistoryRun(run)}
                                                    />
                                                </div>
                                            )
                                        )}
                                    </TabsContent>
                                </Tabs>
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </div>

            <AddAssistantDialog
                open={isAddAssistantOpen}
                onOpenChange={setIsAddAssistantOpen}
                onAddAssistant={handleAddAssistant}
            />
            <AlertDialog open={isDeleteSuiteOpen} onOpenChange={setIsDeleteSuiteOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the test suite "{selectedSuiteDetails?.name || selectedSuite?.name}" and all its test cases.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeletingSuite}>Cancel</AlertDialogCancel>
                        <Button
                            onClick={handleDeleteSuite}
                            disabled={isDeletingSuite}
                            variant="destructive"
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeletingSuite ? (
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
        </TooltipProvider>
    )
}
