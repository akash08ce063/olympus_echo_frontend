"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import {
    ArrowRight,
    Beaker,
    Bot,
    MoreHorizontal,
    Play,
    Plus,
    Settings,
    User,
    Trash2,
    Loader2,
    CheckCircle,
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
    SelectSeparator,
} from "@/components/ui/select"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { RunHistoryTable } from "@/components/test-suite/RunHistoryTable"
import { RunDetailDashboard } from "@/components/test-suite/RunDetailDashboard"
import {
    ApiTestRun,
    ApiTestCaseResult,
    ApiEvaluationResult,
    Persona,
    TestCase,
    TargetAgent
} from "@/types/test-suite"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,

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
    TooltipProvider,
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"


import { AddAssistantDialog, type Assistant } from "@/components/AddAssistantDialog"
import { TestCasesSection } from "@/components/TestCasesSection"
import { TestSuitesService } from "@/services/testSuites"
import { TargetAgentsService } from "@/services/targetAgents"
import { UserAgentsService } from "@/services/userAgents"
import { TestCaseService } from "@/services/testCases"
import { useAuth } from "@/hooks/useAuth"
import { useTestContext } from "@/context/TestContext"
import { TestRunner } from "@/components/test-suite/TestRunner"
import { EvaluationAnalysis } from "@/components/test-suite/EvaluationAnalysis"
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

    // Target agents for dropdown
    const [targetAgents, setTargetAgents] = useState<{ id: string, name: string }[]>([])
    // User/Tester agents for dropdown
    const [userAgents, setUserAgents] = useState<{ id: string, name: string }[]>([])
    const [assistants, setAssistants] = useState<Assistant[]>([])
    const [selectedHistoryRun, setSelectedHistoryRun] = useState<Experiment | null>(null)
    const [isDeleteSuiteOpen, setIsDeleteSuiteOpen] = useState(false)
    const [isDeletingSuite, setIsDeletingSuite] = useState(false)
    const [isCreatingSuite, setIsCreatingSuite] = useState(false)
    const [isRunningTests, setIsRunningTests] = useState(false)
    const [agentTypeForDialog, setAgentTypeForDialog] = useState<"target" | "tester">("target")
    const [executionMode, setExecutionMode] = useState<"sequential" | "parallel">("sequential")
    const [currentTestCaseIndex, setCurrentTestCaseIndex] = useState(0)
    const [currentCallIndex, setCurrentCallIndex] = useState<Record<number, number>>({})
    const [selectedTestCaseResultId, setSelectedTestCaseResultId] = useState<string | null>(null)

    const {
        runExperiment,
        activeExperiment,
        history,
    } = useTestContext()


    const suiteHistory = history.filter(h => h.datasetId === selectedSuiteId)



    const [selectedRunDetail, setSelectedRunDetail] = useState<any | null>(null)
    const [apiRuns, setApiRuns] = useState<any[]>([])
    const [isRunsLoading, setIsRunsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState<string>("configure")
    const runsInitialFetchDone = useRef<boolean>(false)

    const fetchAllRuns = useCallback(async () => {
        if (!user?.id) return

        setIsRunsLoading(true)
        setApiRuns([]) // Clear previous data

        try {
            const response = await TestSuitesService.getAllRuns(user.id)

            // Handle different response structures
            // Axios interceptor returns response.data directly, so response is already the data
            let runsData: any[] = []
            const data = response as any

            if (Array.isArray(data)) {
                runsData = data
            } else if (data?.runs) {
                runsData = data.runs
            } else if (data?.data?.runs) {
                runsData = data.data.runs
            } else if (Array.isArray(data?.data)) {
                runsData = data.data
            }

            setApiRuns(runsData)
        } catch (error: any) {
            console.error("Failed to fetch runs:", error)
            const errorMessage = error?.response?.data?.detail || error?.message || "Failed to fetch test runs"
            toast.error(errorMessage)
            setApiRuns([])
        } finally {
            setIsRunsLoading(false)
        }
    }, [user?.id])



    const handleRunTests = async () => {
        if (!selectedSuiteId || !user?.id) return

        const targetAgentId = selectedSuiteDetails?.target_agent?.id || selectedSuite?.target_agent_id;
        const userAgentId = selectedSuiteDetails?.user_agent?.id || selectedSuite?.user_agent_id;

        if (!targetAgentId || !userAgentId) {
            toast.error("Please select both Target Agent and Tester Assistant before running tests");
            return;
        }

        setIsRunningTests(true)
        try {
            await TestSuitesService.runTestSuite(selectedSuiteId, user.id, 1, executionMode)
            runExperiment(selectedSuiteId)
            toast.success(`Test run started in ${executionMode} mode`)

            // Silently refresh details to update status
            fetchSuiteDetails(selectedSuiteId, true);
        } catch (error) {
            console.error("Failed to start test run:", error)
            toast.error("Failed to start test run")
        } finally {
            setIsRunningTests(false)
        }
    }
    const [newSuite, setNewSuite] = useState({
        name: "",
        description: "",
        uuid: "",
    })

    const fetchSuiteDetails = useCallback(async (id: string, isSilent = false) => {
        const shouldShowLoading = !isSilent;
        if (shouldShowLoading) setIsDetailsLoading(true)
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
            if (shouldShowLoading) setIsDetailsLoading(false)
        }
    }, [])

    const fetchSuites = useCallback(async (isSilent = false) => {
        if (!user?.id) return
        const shouldShowLoading = !isSilent;
        if (shouldShowLoading) setIsLoading(true)
        try {
            // Note: axios interceptor already returns response.data, so use response directly
            const response = await TestSuitesService.getTestSuites(user.id) as any
            const apiData = response || {}
            const fetchedSuites = apiData.test_suites || []

            const transformedSuites: TestSuite[] = fetchedSuites.map((suite: any) => ({
                id: suite.id,
                name: suite.name,
                description: suite.description,
                target_agent_id: suite.target_agent_id,
                user_agent_id: suite.user_agent_id,
                created_at: suite.created_at,
                updated_at: suite.updated_at,
                user_id: suite.user_id,
                testCount: 0,
                createdAt: new Date(suite.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric'
                }),
            }))

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
            if (shouldShowLoading) setIsLoading(false)
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

    // Specific polling logic for running test suites
    useEffect(() => {
        let intervalId: NodeJS.Timeout | null = null;

        if (selectedSuiteId && selectedSuiteDetails?.suite_status === 'running') {
            console.log(`[Status Polling] Starting for suite: ${selectedSuiteId}`);
            intervalId = setInterval(() => {
                console.log(`[Status Polling] Refreshing details for suite: ${selectedSuiteId}`);
                fetchSuiteDetails(selectedSuiteId, true);
            }, 10000); // 10 seconds
        }

        return () => {
            if (intervalId) {
                console.log(`Clearing polling for suite: ${selectedSuiteId}`);
                clearInterval(intervalId);
            }
        };
    }, [selectedSuiteId, selectedSuiteDetails?.suite_status, fetchSuiteDetails]);

    useEffect(() => {
        if (activeTab === "runs" && user?.id) {
            // Always refresh runs data when switching to runs tab
            console.log("[Runs Tab] Refreshing runs data silently");
            fetchAllRuns();
        }
    }, [activeTab, user?.id, fetchAllRuns]);

    // Reset runs data when suite changes
    useEffect(() => {
        if (selectedSuiteId) {
            // Clear selected run detail when suite changes
            setSelectedRunDetail(null);
            setSelectedTestCaseResultId(null);
            setCurrentCallIndex({});
            runsInitialFetchDone.current = false;
        }
    }, [selectedSuiteId]);

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

    const handleUpdateSuiteAgent = useCallback(async (field: 'target_agent_id' | 'user_agent_id', agentId: string, optimisticName?: string) => {
        if (!selectedSuite) return;

        const isTarget = field === 'target_agent_id';
        const agentName = optimisticName || (isTarget
            ? targetAgents.find((a: any) => a.id === agentId)?.name
            : userAgents.find((a: any) => a.id === agentId)?.name);

        // Optimistic update for current suite details
        setSelectedSuiteDetails((prev: any) => {
            if (!prev) return prev;
            return {
                ...prev,
                [isTarget ? 'target_agent' : 'user_agent']: { id: agentId, name: agentName || 'Loading...' }
            };
        });

        // Optimistic update for suites list (sidebar)
        setSuites(prev => prev.map(s =>
            s.id === selectedSuite.id
                ? { ...s, [field]: agentId }
                : s
        ));

        try {
            await TestSuitesService.updateTestSuite(selectedSuite.id, {
                [field]: agentId
            });

            // Sync with server in background
            fetchSuites(true);
            if (selectedSuite.id) {
                fetchSuiteDetails(selectedSuite.id, true);
            }

            toast.success(`${isTarget ? 'Target' : 'Tester'} agent updated`)
        } catch (error) {
            console.error(`Failed to update ${field}:`, error);
            toast.error(`Failed to update ${isTarget ? 'target' : 'tester'} agent`)
            // Revert/Sync state on failure
            fetchSuites(true);
            if (selectedSuite.id) {
                fetchSuiteDetails(selectedSuite.id, true);
            }
        }
    }, [selectedSuite, fetchSuites, fetchSuiteDetails, targetAgents, userAgents])

    const handleAddAssistant = useCallback((newAssistant: Assistant) => {
        // Update local agent lists instantly
        if (agentTypeForDialog === 'target') {
            setTargetAgents(prev => {
                const filtered = prev.filter(a => a.id !== newAssistant.id);
                return [...filtered, { id: newAssistant.id, name: newAssistant.name }];
            });
            handleUpdateSuiteAgent('target_agent_id', newAssistant.id, newAssistant.name)
        } else {
            setUserAgents(prev => {
                const filtered = prev.filter(a => a.id !== newAssistant.id);
                return [...filtered, { id: newAssistant.id, name: newAssistant.name }];
            });
            handleUpdateSuiteAgent('user_agent_id', newAssistant.id, newAssistant.name)
        }

        // Keep assistants list in sync
        setAssistants(prev => [...prev, newAssistant])

        // Background sync to ensure everything is perfect
        fetchAgents()
    }, [agentTypeForDialog, handleUpdateSuiteAgent, fetchAgents])


    const handleDeleteSuite = useCallback(async () => {
        if (!selectedSuiteId) return;

        setIsDeletingSuite(true);
        try {
            await TestSuitesService.deleteTestSuite(selectedSuiteId);
            toast.success("Test suite deleted successfully");

            // 1. Calculate the next suite BEFORE state update
            const currentIndex = suites.findIndex(s => s.id === selectedSuiteId);
            const nextSuites = suites.filter(s => s.id !== selectedSuiteId);

            if (nextSuites.length > 0) {
                // Select previous one, or if it was the first, select the new first one
                const nextSuite = nextSuites[Math.max(0, currentIndex - 1)];
                setSelectedSuiteId(nextSuite.id);
                fetchSuiteDetails(nextSuite.id);
            } else {
                setSelectedSuiteId(null);
                setSelectedSuiteDetails(null);
                setTestCases([]);
            }

            // 2. Update local state immediately for snappy UI
            setSuites(nextSuites);
            setIsDeleteSuiteOpen(false);

            // 3. Re-fetch in background to ensure sync and refresh agent names etc.
            fetchSuites();
        } catch (error) {
            console.error("Failed to delete test suite:", error);
            toast.error("Failed to delete test suite");
        } finally {
            setIsDeletingSuite(false);
        }
    }, [selectedSuiteId, suites, fetchSuiteDetails, fetchSuites]);

    const handleRunSingleTest = useCallback(async (testCaseId: string, concurrentCalls: number) => {
        if (!user?.id) return;
        try {
            const response: any = await TestSuitesService.runSingleTest(testCaseId, user.id, concurrentCalls);
            toast.success("Test run initiated");

            // Optimistically update the status if available in response
            if (response?.status?.status && response?.status?.case_id) {
                setTestCases(prev => prev.map(tc =>
                    tc.id === response.status.case_id
                        ? { ...tc, status: response.status.status }
                        : tc
                ));
            }

            // Silently refresh details to update status
            if (selectedSuiteId) {
                console.log("Refreshing suite details");
                fetchSuiteDetails(selectedSuiteId, true);
            }
        } catch (error) {
            console.error("Failed to run single test:", error);
            toast.error("Failed to initiate test run");
        }
    }, [user?.id, selectedSuiteId, fetchSuiteDetails]);


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
                                            className="bg-background/50 border-border/50 focus:border-primary/50 min-h-20"
                                        />
                                    </div>

                                </div>
                                <DialogFooter className="gap-2 sm:gap-0">
                                    <Button variant="outline" onClick={() => setIsCreateSuiteOpen(false)} className="border-border/50">
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleCreateSuite}
                                        disabled={isCreatingSuite || !newSuite.name.trim()}
                                        className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/25 min-w-30"
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
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-150 h-150 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                    {/* Header */}
                    {(isLoading || isDetailsLoading) ? (
                        <div className="h-16 border-b border-border/50 flex items-center justify-between px-6 bg-card/30 backdrop-blur-sm z-10">
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-48" />
                                <Skeleton className="h-3 w-64" />
                            </div>
                            <div className="flex items-center gap-2">
                                <Skeleton className="h-10 w-28 rounded-md" />
                                <Skeleton className="h-10 w-10 rounded-md" />
                            </div>
                        </div>
                    ) : (suites.length > 0 && (
                        <div className="h-16 border-b border-border/50 flex items-center justify-between px-6 bg-card/30 backdrop-blur-sm z-10">
                            <div className="space-y-0.5">
                                <div className="flex items-center gap-3">
                                    <h1 className="text-xl font-semibold tracking-tight">{selectedSuiteDetails?.name || selectedSuite?.name || "Select a Suite"}</h1>
                                    {selectedSuiteDetails?.suite_status && (
                                        <Badge
                                            variant={selectedSuiteDetails.suite_status === 'completed' ? 'default' : selectedSuiteDetails.suite_status === 'running' ? 'secondary' : 'destructive'}
                                            className={cn(
                                                "text-xs font-medium",
                                                selectedSuiteDetails.suite_status === 'completed' && "bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20",
                                                selectedSuiteDetails.suite_status === 'running' && "bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20 animate-pulse",
                                                selectedSuiteDetails.suite_status === 'failed' && "bg-red-500/10 text-white border-red-500/20 hover:bg-red-500/20"
                                            )}
                                        >
                                            {selectedSuiteDetails.suite_status === 'running' && <Loader2 className="w-3 h-3 mr-1 animate-spin" />}
                                            {selectedSuiteDetails.suite_status.charAt(0).toUpperCase() + selectedSuiteDetails.suite_status.slice(1)}
                                        </Badge>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground font-mono">Test Suite ID: {selectedSuiteDetails?.id || selectedSuite?.id || "---"}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Select
                                    value={executionMode}
                                    onValueChange={(value: "sequential" | "parallel") => setExecutionMode(value)}
                                    disabled={isRunningTests || selectedSuiteDetails?.suite_status === 'running' || (activeExperiment?.status === 'running' && activeExperiment.datasetId === selectedSuiteId)}
                                >
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue placeholder="Execution Mode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sequential">Sequential</SelectItem>
                                        <SelectItem value="parallel">Parallel</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    onClick={handleRunTests}
                                    disabled={
                                        isRunningTests ||
                                        selectedSuiteDetails?.suite_status === 'running' ||
                                        (activeExperiment?.status === 'running' && activeExperiment.datasetId === selectedSuiteId) ||
                                        !(selectedSuiteDetails?.target_agent?.id || selectedSuite?.target_agent_id) ||
                                        !(selectedSuiteDetails?.user_agent?.id || selectedSuite?.user_agent_id)
                                    }
                                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25 transition-all duration-300 hover:shadow-primary/40 min-w-32"
                                >
                                    {(isRunningTests || (activeExperiment?.status === 'running' && activeExperiment.datasetId === selectedSuiteId)) ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {isRunningTests ? 'Starting...' : 'Running...'}
                                        </>
                                    ) : (
                                        <>
                                            <Play className="mr-2 h-4 w-4 fill-current" />
                                            Run Tests
                                        </>
                                    )}
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
                    ))}

                    {/* Content */}
                    <ScrollArea className="flex-1">
                        {(isLoading || isDetailsLoading) ? (
                            <div className="p-6 lg:p-8 space-y-8 animate-in fade-in duration-500">
                                <div className="space-y-6">
                                    <div className="bg-muted/30 p-1 border border-border/50 inline-flex rounded-md">
                                        <Skeleton className="h-8 w-32 mr-1" />
                                        <Skeleton className="h-8 w-24" />
                                    </div>

                                    <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-8">
                                        {/* Tester Assistant Skeleton */}
                                        <div className="bg-card/30 border border-border/50 rounded-lg p-6 space-y-4 flex-1 w-full">
                                            <div className="flex items-start gap-3">
                                                <Skeleton className="w-10 h-10 rounded-lg" />
                                                <div className="space-y-2">
                                                    <Skeleton className="h-5 w-32" />
                                                    <Skeleton className="h-4 w-48" />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <Skeleton className="h-4 w-24" />
                                                <Skeleton className="h-10 w-full" />
                                                <Skeleton className="h-4 w-32" />
                                            </div>
                                        </div>

                                        {/* Arrow Skeleton */}
                                        <div className="hidden lg:block">
                                            <Skeleton className="w-6 h-6 rounded-full" />
                                        </div>

                                        {/* Target Assistant Skeleton */}
                                        <div className="bg-card/30 border border-border/50 rounded-lg p-6 space-y-4 flex-1 w-full">
                                            <div className="flex items-start gap-3">
                                                <Skeleton className="w-10 h-10 rounded-lg" />
                                                <div className="space-y-2">
                                                    <Skeleton className="h-5 w-32" />
                                                    <Skeleton className="h-4 w-48" />
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <Skeleton className="h-4 w-24" />
                                                <Skeleton className="h-10 w-full" />
                                                <Skeleton className="h-4 w-32 border-primary/30" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Test Cases Skeleton */}
                                    <div className="bg-card/30 border border-border/50 rounded-lg p-6 space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-1">
                                                <Skeleton className="h-6 w-32" />
                                                <Skeleton className="h-4 w-48" />
                                            </div>
                                            <Skeleton className="h-8 w-24 rounded-md" />
                                        </div>
                                        <div className="space-y-3">
                                            {[1, 2, 3].map((i) => (
                                                <div key={i} className="flex items-center justify-between p-4 rounded-lg border border-border/50">
                                                    <div className="space-y-2 flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <Skeleton className="h-5 w-40" />
                                                            <Skeleton className="h-5 w-16" />
                                                        </div>
                                                        <Skeleton className="h-4 w-3/4" />
                                                    </div>
                                                    <Skeleton className="h-8 w-8 rounded-md ml-4" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : suites.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
                                <div className="relative mb-6">
                                    <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                                    <div className="relative p-4 rounded-2xl bg-card border border-border/50 shadow-2xl">
                                        <Beaker className="w-8 h-8 text-primary" />
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight mb-2">Create your first test suite</h2>
                                <p className="text-muted-foreground max-w-105 mb-8">
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
                                <Tabs
                                    value={activeTab}
                                    className="space-y-6"
                                    onValueChange={(value) => {
                                        setActiveTab(value);
                                        // Reset detail views when switching tabs
                                        if (value === "configure") {
                                            setSelectedRunDetail(null);
                                            setSelectedTestCaseResultId(null);
                                        }
                                    }}
                                >
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
                                        <div className="flex flex-col lg:flex-row lg:items-stretch items-center gap-6 lg:gap-8">
                                            {/* Tester Assistant */}
                                            <Card className="bg-card/30 border-border/50 hover:border-primary/30 transition-all duration-300 group flex-1 w-full lg:w-auto flex flex-col">
                                                <CardHeader className="pb-4 shrink-0">
                                                    <div className="flex items-start gap-3">
                                                        <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                                                            <User className="w-5 h-5" />
                                                        </div>
                                                        <div className="flex-1 space-y-1">
                                                            <CardTitle className="text-base font-semibold">Tester Assistant</CardTitle>
                                                            <CardDescription className="text-xs">This is the assistant that will call with your assistant to test them.</CardDescription>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardContent className="space-y-4 flex-1 flex flex-col">
                                                    <div className="space-y-2 flex-1">
                                                        <Label className="text-xs text-muted-foreground">Select tester assistant configuration</Label>
                                                        <Select
                                                            value={selectedSuiteDetails?.user_agent?.id || selectedSuite?.user_agent_id || ""}
                                                            onValueChange={(value) => {
                                                                if (value === "__add_new__") {
                                                                    setAgentTypeForDialog("tester");
                                                                    setIsAddAssistantOpen(true);
                                                                } else {
                                                                    handleUpdateSuiteAgent('user_agent_id', value);
                                                                }
                                                            }}
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
                                                                    <>
                                                                        {userAgents.map((agent) => (
                                                                            <SelectItem key={agent.id} value={agent.id}>
                                                                                {agent.name}
                                                                            </SelectItem>
                                                                        ))}
                                                                        <SelectSeparator />
                                                                        <SelectItem value="__add_new__" className="text-primary focus:text-primary focus:bg-primary/10 cursor-pointer">
                                                                            <Plus className="w-4 h-4 mr-2" />
                                                                            Add New Assistant
                                                                        </SelectItem>
                                                                    </>
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground leading-relaxed mt-auto pt-4">
                                                        This is the assistant that will call with your assistant to test them.
                                                    </p>
                                                </CardContent>
                                            </Card>

                                            {/* Arrow */}
                                            <div className="flex items-center justify-center lg:shrink-0 self-center">
                                                <ArrowRight className="w-6 h-6 text-muted-foreground/50 lg:rotate-0 rotate-90" />
                                            </div>

                                            {/* Target Assistant */}
                                            <Card className="bg-card/30 border-border/50 hover:border-primary/30 transition-all duration-300 group flex-1 w-full lg:w-auto flex flex-col">
                                                <CardHeader className="pb-4 shrink-0">
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
                                                <CardContent className="space-y-4 flex-1 flex flex-col">
                                                    <div className="space-y-2 flex-1">
                                                        <Label className="text-xs text-muted-foreground">Select target agent</Label>
                                                        <Select
                                                            value={selectedSuiteDetails?.target_agent?.id || selectedSuite?.target_agent_id || ""}
                                                            onValueChange={(value) => {
                                                                if (value === "__add_new__") {
                                                                    setAgentTypeForDialog("target");
                                                                    setIsAddAssistantOpen(true);
                                                                } else {
                                                                    handleUpdateSuiteAgent('target_agent_id', value);
                                                                }
                                                            }}
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
                                                                    <>
                                                                        {targetAgents.map((agent) => (
                                                                            <SelectItem key={agent.id} value={agent.id}>
                                                                                {agent.name}
                                                                            </SelectItem>
                                                                        ))}
                                                                        <SelectSeparator />
                                                                        <SelectItem value="__add_new__" className="text-primary focus:text-primary focus:bg-primary/10 cursor-pointer">
                                                                            <Plus className="w-4 h-4 mr-2" />
                                                                            Add New Assistant
                                                                        </SelectItem>
                                                                    </>
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground leading-relaxed mt-auto pt-4">
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
                                        <div className="space-y-4">
                                            {selectedRunDetail ? (
                                                <RunDetailDashboard
                                                    run={selectedRunDetail as any}
                                                    testCases={testCases}
                                                    onBack={() => {
                                                        setSelectedRunDetail(null)
                                                        setSelectedTestCaseResultId(null)
                                                        setCurrentCallIndex({})
                                                    }}
                                                />
                                            ) : (
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div>
                                                            <h3 className="text-lg font-semibold tracking-tight">Run History</h3>
                                                            <p className="text-sm text-muted-foreground">Historical records of all automated tests run for this suite.</p>
                                                        </div>
                                                    </div>

                                                    <Card className="bg-card/30 border-border/50 overflow-hidden min-w-0 w-full">
                                                        <CardContent className="p-0">
                                                            <RunHistoryTable
                                                                runs={apiRuns.filter(run => run.test_suite_id === selectedSuiteId)}
                                                                isLoading={isRunsLoading}
                                                                onSelectRun={(run) => {
                                                                    setSelectedRunDetail(run as any)
                                                                    // Reset pagination when selecting a new run
                                                                    setCurrentTestCaseIndex(0)
                                                                    setCurrentCallIndex({})
                                                                }}
                                                            />
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            )}
                                        </div>
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
                agentType={agentTypeForDialog}
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
                        <AlertDialogCancel disabled={isDeletingSuite} onClick={() => setIsDeleteSuiteOpen(false)}>Cancel</AlertDialogCancel>
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
