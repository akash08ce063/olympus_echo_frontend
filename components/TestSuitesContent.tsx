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
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationFirst,
    PaginationLast,
    PaginationEllipsis,
} from "@/components/ui/pagination"
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
    const [executionMode, setExecutionMode] = useState<"sequential" | "parallel">("parallel")
    const [currentTestCaseIndex, setCurrentTestCaseIndex] = useState(0)
    const [currentCallIndex, setCurrentCallIndex] = useState<Record<number, number>>({})
    const [selectedTestCaseResultId, setSelectedTestCaseResultId] = useState<string | null>(null)

    const {
        runExperiment,
        activeExperiment,
        history,
    } = useTestContext()


    const suiteHistory = history.filter(h => h.datasetId === selectedSuiteId)

    // When target agent is phone, only sequential mode is allowed
    const isPhoneTargetAgent = (selectedSuiteDetails?.target_agent?.agent_type || "").toLowerCase() === "phone"
    const effectiveExecutionMode = isPhoneTargetAgent ? "sequential" : executionMode
    useEffect(() => {
        if (isPhoneTargetAgent) setExecutionMode("sequential")
    }, [isPhoneTargetAgent])


    const [selectedRunDetail, setSelectedRunDetail] = useState<any | null>(null)
    const [apiRuns, setApiRuns] = useState<any[]>([])
    const [suiteRunsTotal, setSuiteRunsTotal] = useState(0)
    const [suiteRunsPage, setSuiteRunsPage] = useState(1)
    const [suiteRunsPageSize, setSuiteRunsPageSize] = useState(10)
    const [isRunsLoading, setIsRunsLoading] = useState(false)
    const [activeTab, setActiveTab] = useState<string>("configure")
    const runsInitialFetchDone = useRef<boolean>(false)

    const RUNS_PAGE_SIZE_OPTIONS = [10, 15, 25, 50] as const
    const suiteRunsTotalPages = Math.max(1, Math.ceil(suiteRunsTotal / suiteRunsPageSize))

    const fetchSuiteRuns = useCallback(async () => {
        if (!user?.id || !selectedSuiteId) return

        setIsRunsLoading(true)
        setApiRuns([])

        try {
            const offset = (suiteRunsPage - 1) * suiteRunsPageSize
            const response = await TestSuitesService.getAllRuns(
                user.id,
                suiteRunsPageSize,
                offset,
                selectedSuiteId
            )

            let runsData: any[] = []
            let total = 0
            const data = response as any

            if (Array.isArray(data)) {
                runsData = data
                total = data.length
            } else if (data?.runs) {
                runsData = data.runs
                total = typeof data.total === "number" ? data.total : data.runs.length
            } else if (data?.data?.runs) {
                runsData = data.data.runs
                total = data.data.total ?? data.data.runs.length
            } else if (Array.isArray(data?.data)) {
                runsData = data.data
                total = data.data.length
            }

            setApiRuns(runsData)
            setSuiteRunsTotal(total)
        } catch (error: any) {
            console.error("Failed to fetch runs:", error)
            const errorMessage = error?.response?.data?.detail || error?.message || "Failed to fetch test runs"
            toast.error(errorMessage)
            setApiRuns([])
            setSuiteRunsTotal(0)
        } finally {
            setIsRunsLoading(false)
        }
    }, [user?.id, selectedSuiteId, suiteRunsPage, suiteRunsPageSize])



    const handleRunTests = async () => {
        if (!selectedSuiteId || !user?.id) return

        const targetAgent = selectedSuiteDetails?.target_agent
        const userAgent = selectedSuiteDetails?.user_agent
        const targetAgentId = targetAgent?.id || selectedSuite?.target_agent_id
        const userAgentId = userAgent?.id || selectedSuite?.user_agent_id

        if (!targetAgentId || !userAgentId) {
            toast.error("Please select both Target Agent and Tester Assistant before running tests");
            return;
        }

        const targetAgentType = (targetAgent?.agent_type || "").toLowerCase();

        if (targetAgentType === "vapi") {
            const pc = (targetAgent as any)?.provider_config || {};
            const assistantId = (pc?.assistant_id || "").toString().trim();
            const apiKey = (pc?.api_key || "").toString().trim();
            if (!assistantId || !apiKey) {
                toast.error("Vapi target agent is missing assistant_id or api_key.");
                return;
            }
        }

        // If target agent is phone-type, enforce that user agent has phone_numbers configured
        if (targetAgentType === "phone") {
            const phoneCfg = (userAgent as any)?.phone_numbers || {};
            const phoneList: string[] = Array.isArray(phoneCfg?.phone_numbers)
                ? phoneCfg.phone_numbers.filter((p: any) => typeof p === "string" && p.trim().length > 0)
                : [];

            if (phoneList.length === 0) {
                toast.error("Selected tester assistant has no phone_numbers configured for phone target agent.");
                return;
            }

            if (!(userAgent as any)?.pranthora_agent_id) {
                toast.error("Selected tester assistant is missing pranthora_agent_id (required for phone tests).");
                return;
            }

            const targetPhone = (targetAgent as any)?.connection_metadata?.phone_number;
            if (!targetPhone) {
                toast.error("Phone target agent is missing connection_metadata.phone_number.");
                return;
            }

            // For phone tests:
            // - Each individual test case's concurrency must not exceed phone count (both modes)
            // - Total concurrency across active cases is only restricted in PARALLEL mode
            const activeCases = testCases.filter(tc => tc.is_active);

            // Per–test case guard
            const offendingCase = activeCases.find(
                tc => (tc.default_concurrent_calls || 1) > phoneList.length
            );
            if (offendingCase) {
                toast.error(
                    `Test case "${offendingCase.name}" has concurrency ${offendingCase.default_concurrent_calls || 1}, but tester agent has only ${phoneList.length} phone number(s). Reduce this test's concurrency.`
                );
                return;
            }

            // Suite-level guard only when running in parallel mode
            if (effectiveExecutionMode === "parallel") {
                const totalConcurrency = activeCases.length > 0
                    ? activeCases.reduce((sum, tc) => sum + (tc.default_concurrent_calls || 1), 0)
                    : 0;
                if (totalConcurrency > phoneList.length) {
                    toast.error(
                        `In parallel mode, total concurrency across test cases (${totalConcurrency}) cannot exceed tester phone numbers (${phoneList.length}). Either switch to Sequential mode or reduce per-test concurrency.`
                    );
                    return;
                }
            }
        }

        // Calculate maximum concurrent calls needed across all active test cases
        // Each test case will use its own default_concurrent_calls, but we need to send enough request IDs
        const maxConcurrentCalls = testCases.length > 0
            ? Math.max(...testCases.filter(tc => tc.is_active).map(tc => tc.default_concurrent_calls || 1), 1)
            : 1;

        setIsRunningTests(true)
        try {
            // Pass maxConcurrentCalls to ensure we send enough request IDs
            // The backend will use each test case's own default_concurrent_calls, but having enough IDs ensures all calls work
            await TestSuitesService.runTestSuite(selectedSuiteId, user.id, maxConcurrentCalls, effectiveExecutionMode)
            runExperiment(selectedSuiteId)
            toast.success(`Test run started in ${effectiveExecutionMode} mode`)

            // Silently refresh details to update status
            fetchSuiteDetails(selectedSuiteId, true);
        } catch (error: any) {
            console.error("Failed to start test run:", error)
            const errorMessage = error?.response?.data?.detail || error?.message || "Failed to start test run"
            toast.error(errorMessage)
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
        if (activeTab === "runs" && user?.id && selectedSuiteId) {
            fetchSuiteRuns();
        }
    }, [activeTab, user?.id, selectedSuiteId, fetchSuiteRuns]);

    // Reset run history pagination and clear runs when suite changes
    useEffect(() => {
        if (selectedSuiteId) {
            setSelectedRunDetail(null);
            setSelectedTestCaseResultId(null);
            setCurrentCallIndex({});
            setSuiteRunsPage(1);
            setApiRuns([]);
            setSuiteRunsTotal(0);
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
            // Phone-type gating for single test runs as well
            const targetAgent = selectedSuiteDetails?.target_agent;
            const userAgent = selectedSuiteDetails?.user_agent;
            const targetAgentType = (targetAgent?.agent_type || "").toLowerCase();

            if (targetAgentType === "vapi") {
                const pc = (targetAgent as any)?.provider_config || {};
                const assistantId = (pc?.assistant_id || "").toString().trim();
                const apiKey = (pc?.api_key || "").toString().trim();
                if (!assistantId || !apiKey) {
                    toast.error("Vapi target agent is missing assistant_id or api_key.");
                    return;
                }
            }

            if (targetAgentType === "phone") {
                const phoneCfg = (userAgent as any)?.phone_numbers || {};
                const phoneList: string[] = Array.isArray(phoneCfg?.phone_numbers)
                    ? phoneCfg.phone_numbers.filter((p: any) => typeof p === "string" && p.trim().length > 0)
                    : [];

                if (phoneList.length === 0) {
                    toast.error("Selected tester assistant has no phone_numbers configured for phone target agent.");
                    return;
                }

                if (!(userAgent as any)?.pranthora_agent_id) {
                    toast.error("Selected tester assistant is missing pranthora_agent_id (required for phone tests).");
                    return;
                }

                const targetPhone = (targetAgent as any)?.connection_metadata?.phone_number;
                if (!targetPhone) {
                    toast.error("Phone target agent is missing connection_metadata.phone_number.");
                    return;
                }
                if (concurrentCalls > phoneList.length) {
                    toast.error(
                        `Reduce concurrency to ${phoneList.length} or fewer. Tester agent has ${phoneList.length} phone number(s).`
                    );
                    return;
                }
            }

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
        } catch (error: any) {
            console.error("Failed to run single test:", error);
            const errorMessage = error?.response?.data?.detail || error?.message || "Failed to initiate test run";
            toast.error(errorMessage);
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
                        <div className="h-16 border-b border-border/50 flex items-center justify-between px-6 bg-card backdrop-blur-sm z-10">
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
                        <div className="h-16 border-b border-border/50 flex items-center justify-between px-6 bg-card backdrop-blur-sm z-10">
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
                                    value={effectiveExecutionMode}
                                    onValueChange={(value: "sequential" | "parallel") => !isPhoneTargetAgent && setExecutionMode(value)}
                                    disabled={isPhoneTargetAgent || isRunningTests || selectedSuiteDetails?.suite_status === 'running' || (activeExperiment?.status === 'running' && activeExperiment.datasetId === selectedSuiteId)}
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
                                        <div className="bg-card border border-border/50 rounded-lg p-6 space-y-4 flex-1 w-full">
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
                                        <div className="bg-card border border-border/50 rounded-lg p-6 space-y-4 flex-1 w-full">
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
                                    <div className="bg-card border border-border/50 rounded-lg p-6 space-y-6">
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
                                    onValueChange={(value) => {
                                        setActiveTab(value);
                                        // Reset detail views when switching tabs
                                        if (value === "configure") {
                                            setSelectedRunDetail(null);
                                            setSelectedTestCaseResultId(null);
                                        }
                                    }}
                                >
                                    <TabsList className="bg-muted p-1.5 inline-flex border rounded-full inset-shadow-sm">
                                        <TabsTrigger
                                            value="configure"
                                            className="p-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm border-0 transition-all duration-200"
                                        >
                                            <Settings className="w-4 h-4" />
                                            Configure Tests
                                        </TabsTrigger>
                                        <TabsTrigger
                                            value="runs"
                                            className="p-3 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:bg-primary dark:data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm border-0 transition-all duration-200"
                                        >
                                            <Play className="w-4 h-4" />
                                            Runs
                                        </TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="configure" className="space-y-8 outline-none">

                                        {/* Assistants Config Flow */}
                                        <div className="flex flex-col lg:flex-row lg:items-stretch items-center gap-6 lg:gap-8">
                                            {/* Tester Assistant */}
                                            <Card className="bg-card border-border/50 hover:border-primary/30 transition-all duration-300 group flex-1 w-full lg:w-auto flex flex-col">
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
                                            <Card className="bg-card border-border/50 hover:border-primary/30 transition-all duration-300 group flex-1 w-full lg:w-auto flex flex-col">
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

                                                    <Card className="bg-card border-border/50 overflow-hidden min-w-0 w-full">
                                                        <CardContent className="p-0">
                                                            <RunHistoryTable
                                                                runs={apiRuns}
                                                                isLoading={isRunsLoading}
                                                                onSelectRun={(run) => {
                                                                    setSelectedRunDetail(run as any)
                                                                    setCurrentTestCaseIndex(0)
                                                                    setCurrentCallIndex({})
                                                                }}
                                                            />
                                                        </CardContent>
                                                    </Card>

                                                    {/* Pagination: rows per page + Page X of Y + First/Prev/Next/Last */}
                                                    <div className="flex flex-col gap-4 mt-4 w-full min-w-0">
                                                        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-3">
                                                            <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
                                                                <span className="whitespace-nowrap">Rows per page</span>
                                                                <Select
                                                                    value={String(suiteRunsPageSize)}
                                                                    onValueChange={(v) => {
                                                                        setSuiteRunsPageSize(Number(v))
                                                                        setSuiteRunsPage(1)
                                                                    }}
                                                                >
                                                                    <SelectTrigger className="w-[70px] h-8">
                                                                        <SelectValue />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {RUNS_PAGE_SIZE_OPTIONS.map((n) => (
                                                                            <SelectItem key={n} value={String(n)}>
                                                                                {n}
                                                                            </SelectItem>
                                                                        ))}
                                                                    </SelectContent>
                                                                </Select>
                                                                <span className="whitespace-nowrap">
                                                                    {suiteRunsTotal === 0
                                                                        ? "0 runs"
                                                                        : `${(suiteRunsPage - 1) * suiteRunsPageSize + 1}-${Math.min(suiteRunsPage * suiteRunsPageSize, suiteRunsTotal)} of ${suiteRunsTotal}`}
                                                                </span>
                                                            </div>
                                                            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 min-w-0">
                                                                <span className="text-sm text-muted-foreground whitespace-nowrap order-2 sm:order-1">
                                                                    Page {suiteRunsPage} of {suiteRunsTotalPages}
                                                                </span>
                                                                <Pagination className="order-1 sm:order-2">
                                                                    <PaginationContent className="flex-wrap gap-1 sm:gap-2 justify-center">
                                                                        <PaginationItem>
                                                                            <PaginationFirst
                                                                                onClick={() => setSuiteRunsPage(1)}
                                                                                className={suiteRunsPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                                                            />
                                                                        </PaginationItem>
                                                                        <PaginationItem>
                                                                            <PaginationPrevious
                                                                                onClick={() => setSuiteRunsPage((p) => Math.max(1, p - 1))}
                                                                                className={suiteRunsPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                                                            />
                                                                        </PaginationItem>
                                                                        {suiteRunsTotalPages <= 5 ? (
                                                                            Array.from({ length: suiteRunsTotalPages }, (_, i) => i + 1).map((p) => (
                                                                                <PaginationItem key={p}>
                                                                                    <PaginationLink
                                                                                        isActive={p === suiteRunsPage}
                                                                                        onClick={() => setSuiteRunsPage(p)}
                                                                                        className="cursor-pointer"
                                                                                    >
                                                                                        {p}
                                                                                    </PaginationLink>
                                                                                </PaginationItem>
                                                                            ))
                                                                        ) : (
                                                                            <>
                                                                                <PaginationItem>
                                                                                    <PaginationLink
                                                                                        isActive={suiteRunsPage === 1}
                                                                                        onClick={() => setSuiteRunsPage(1)}
                                                                                        className="cursor-pointer"
                                                                                    >
                                                                                        1
                                                                                    </PaginationLink>
                                                                                </PaginationItem>
                                                                                {suiteRunsPage > 3 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                                                                                {suiteRunsPage > 2 && suiteRunsPage < suiteRunsTotalPages && (
                                                                                    <PaginationItem>
                                                                                    <PaginationLink isActive className="pointer-events-none">
                                                                                        {suiteRunsPage}
                                                                                    </PaginationLink>
                                                                                </PaginationItem>
                                                                                )}
                                                                                {suiteRunsPage < suiteRunsTotalPages - 1 && <PaginationItem><PaginationEllipsis /></PaginationItem>}
                                                                                {suiteRunsTotalPages > 1 && (
                                                                                    <PaginationItem>
                                                                                        <PaginationLink
                                                                                            isActive={suiteRunsPage === suiteRunsTotalPages}
                                                                                            onClick={() => setSuiteRunsPage(suiteRunsTotalPages)}
                                                                                            className="cursor-pointer"
                                                                                        >
                                                                                            {suiteRunsTotalPages}
                                                                                        </PaginationLink>
                                                                                    </PaginationItem>
                                                                                )}
                                                                            </>
                                                                        )}
                                                                        <PaginationItem>
                                                                            <PaginationNext
                                                                                onClick={() => setSuiteRunsPage((p) => Math.min(suiteRunsTotalPages, p + 1))}
                                                                                className={suiteRunsPage >= suiteRunsTotalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                                                            />
                                                                        </PaginationItem>
                                                                        <PaginationItem>
                                                                            <PaginationLast
                                                                                onClick={() => setSuiteRunsPage(suiteRunsTotalPages)}
                                                                                className={suiteRunsPage >= suiteRunsTotalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                                                                            />
                                                                        </PaginationItem>
                                                                    </PaginationContent>
                                                                </Pagination>
                                                            </div>
                                                        </div>
                                                    </div>
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
