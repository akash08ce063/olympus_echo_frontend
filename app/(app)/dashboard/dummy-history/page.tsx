"use client"

import { useState } from "react"
import {
    Activity,
    Calendar,
    CheckCircle2,
    Clock,
    Download,
    LayoutList,
    MessageSquare,
    Play,
    PlayCircle,
    Search,
    XCircle,
    BarChart3,
    AlertCircle,
    Check
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// --- Types ---
/* eslint-disable @typescript-eslint/no-explicit-any */
interface TranscriptMessage {
    role: string
    content: string
}

interface CallTranscript {
    call_number: number
    transcript: {
        id: string
        call_transcript: TranscriptMessage[]
        call_duration: number
    }
}

interface CallRecording {
    call_number: number
    recording_url: string
    file_id: string
}

interface EvaluationCriterion {
    name: string
    score: number // 0-10
    status: 'pass' | 'fail' | 'neutral'
    reasoning: string
}

interface TestCaseResult {
    result_id: string
    test_case_id: string
    status: string
    started_at: string
    completed_at: string | null
    call_recordings: CallRecording[]
    call_transcripts: CallTranscript[]
    evaluation?: {
        overall_score: number
        criteria: EvaluationCriterion[]
    }
}

interface TestRun {
    id: string
    test_suite_id: string
    status: string
    started_at: string
    completed_at: string | null
    total_test_cases: number
    passed_count: number
    failed_count: number
    alert_count: number
    test_case_results: TestCaseResult[]
    summary_evaluation?: {
        avg_accuracy: number
        avg_latency_ms: number
        sentiment_score: number // 0-100
        successful_upsells: number
    }
}

// --- Dummy Data ---
const DUMMY_DATA: TestRun[] = [
    {
        "id": "e03ccd8f-3374-41f9-8b81-0295d36c93d0",
        "test_suite_id": "6743437f-3676-430e-a56d-c26b5be4c5c9",
        "status": "completed",
        "started_at": "2026-01-09T05:48:48.036542",
        "completed_at": "2026-01-09T05:49:20.213830",
        "total_test_cases": 1,
        "passed_count": 1,
        "failed_count": 0,
        "alert_count": 0,
        "summary_evaluation": {
            avg_accuracy: 98,
            avg_latency_ms: 450,
            sentiment_score: 92,
            successful_upsells: 1
        },
        "test_case_results": [
            {
                "result_id": "56b34bb4-8780-4dbb-94f5-b7216853b072",
                "test_case_id": "2e980f4a-6c31-48a7-ae76-efbe1eefb8da",
                "evaluation": {
                    overall_score: 95,
                    criteria: [
                        { name: "Greeting Accuracy", score: 10, status: "pass", reasoning: "Assistant greeted with standard welcome phrase: 'Hi, Alex here.'" },
                        { name: "Price Knowledge", score: 10, status: "pass", reasoning: "Correctly quoted beer price as $5 without hesitation." },
                        { name: "Upsell Attempt", score: 10, status: "pass", reasoning: "Successfully suggested house lager when asked for recommendation." },
                        { name: "Tone Check", score: 9, status: "pass", reasoning: "Maintained a professional and helpful tone throughout the interaction." }
                    ]
                },
                "call_recordings": [
                    {
                        "call_number": 1,
                        "recording_url": "https://hwlhkoseuixsnbsxhvtv.supabase.co/storage/v1/object/sign/recording_files/1acf3b0c-19b8-4f06-afe4-d567573cc079_test_case_2e980f4a-6c31-48a7-ae76-efbe1eefb8da_call_1_recording.wav?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iZjRjZjFkMC01ZWNjLTQxZWUtYTdiYy04MWYzMjMzODRjODMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJyZWNvcmRpbmdfZmlsZXMvMWFjZjNiMGMtMTliOC00ZjA2LWFmZTQtZDU2NzU3M2NjMDc5X3Rlc3RfY2FzZV8yZTk4MGY0YS02YzMxLTQ4YTctYWU3Ni1lZmJlMWVlZmI4ZGFfY2FsbF8xX3JlY29yZGluZy53YXYiLCJpYXQiOjE3Njc5Mzc3NzksImV4cCI6MTc2Nzk0MTM3OX0.VSrK_wmHySTcI1minHsCnmRRZ81FsB4kbMLuM0oQPXE",
                        "file_id": "1acf3b0c-19b8-4f06-afe4-d567573cc079"
                    }
                ],
                "call_transcripts": [
                    {
                        "call_number": 1,
                        "transcript": {
                            "id": "964b5b0f-42dd-4315-a1c7-6f51308f8a65",
                            "call_transcript": [
                                { "role": "user", "content": "Welcome." },
                                { "role": "user", "content": "I'm your bar assistant." },
                                { "role": "assistant", "content": "Hi, price of beer? Recommend something?" },
                                { "role": "user", "content": "Beer is five dollars. Try our house lager. It's smooth and refreshing." },
                                { "role": "user", "content": "Like it?" },
                                { "role": "assistant", "content": "Thanks, how much for a whiskey?Yes, great! Any drink suggestions?" },
                                { "role": "user", "content": "How about a whiskey" },
                                { "role": "user", "content": "hour." }
                            ],
                            "call_duration": 29
                        }
                    }
                ],
                "status": "completed",
                "started_at": "2026-01-09T05:48:48.951381",
                "completed_at": null
            }
        ]
    },
    {
        "id": "e812f0ce-904a-4a95-b926-883264ab0c5b",
        "test_suite_id": "b5ae0cea-15dc-4490-9297-fd41bb312be8",
        "status": "completed",
        "started_at": "2026-01-09T05:47:53.010945",
        "completed_at": "2026-01-09T05:48:24.971385",
        "total_test_cases": 1,
        "passed_count": 1,
        "failed_count": 0,
        "alert_count": 0,
        "summary_evaluation": {
            avg_accuracy: 85,
            avg_latency_ms: 620,
            sentiment_score: 78,
            successful_upsells: 0
        },
        "test_case_results": [
            {
                "result_id": "16b09364-c603-4aca-8da8-e9aa50eca138",
                "test_case_id": "df8b69dd-c223-45ae-b9be-8f0a55f7b09f",
                "evaluation": {
                    overall_score: 75,
                    criteria: [
                        { name: "Greeting Accuracy", score: 10, status: "pass", reasoning: "Assistant greeted correctly." },
                        { name: "Price Knowledge", score: 8, status: "neutral", reasoning: "Hesitated on price explanation, took 2 attempts." },
                        { name: "Upsell Attempt", score: 0, status: "fail", reasoning: "Did not offer upsell when user asked for recommendations." },
                    ]
                },
                "call_recordings": [
                    {
                        "call_number": 1,
                        "recording_url": "https://hwlhkoseuixsnbsxhvtv.supabase.co/storage/v1/object/sign/recording_files/8df6beb1-1e85-4ae8-a4c5-ac8f7f91a2b0_test_case_df8b69dd-c223-45ae-b9be-8f0a55f7b09f_call_1_recording.wav?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iZjRjZjFkMC01ZWNjLTQxZWUtYTdiYy04MWYzMjMzODRjODMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJyZWNvcmRpbmdfZmlsZXMvOGRmNmJlYjEtMWU4NS00YWU4LWE0YzUtYWM4ZjdmOTFhMmIwX3Rlc3RfY2FzZV8yZTk4MGY0YS02YzMxLTQ4YTctYWU3Ni1lZmJlMWVlZmI4ZGFfY2FsbF8xX3JlY29yZGluZy53YXYiLCJpYXQiOjE3Njc5Mzc3ODEsImV4cCI6MTc2Nzk0MTM4MX0.yQAoLFKb9IrjKPHzEDorjc3v2bT-Tdgpg0AI7JB4i78",
                        "file_id": "8df6beb1-1e85-4ae8-a4c5-ac8f7f91a2b0"
                    }
                ],
                "call_transcripts": [
                    {
                        "call_number": 1,
                        "transcript": {
                            "id": "7320b9db-9677-473c-bef0-7294c93ab171",
                            "call_transcript": [
                                { "role": "user", "content": "Welcome. I'm your bar assistant." },
                                { "role": "assistant", "content": "Hi, Alex. Beer price? Any recommendations?" }
                            ],
                            "call_duration": 29
                        }
                    },
                    {
                        "call_number": 2,
                        "transcript": {
                            "id": "7320b9db-9677-473c-bef0-7294c93ab172",
                            "call_transcript": [
                                { "role": "user", "content": "Welcome. I'm your bar assistant." },
                                { "role": "assistant", "content": "Hi, Alex. Beer price? Any recommendations?" },
                                { "role": "user", "content": "Another round?" },
                                { "role": "assistant", "content": "Yes, please." }
                            ],
                            "call_duration": 15
                        }
                    }
                ],
                "status": "completed",
                "started_at": "2026-01-09T05:47:53.820983",
                "completed_at": null
            }
        ]
    },
    {
        "id": "056d1bcb-184b-4424-bea7-9f9ac6775313",
        "test_suite_id": "b5ae0cea-15dc-4490-9297-fd41bb312be8",
        "status": "completed",
        "started_at": "2026-01-09T05:37:54.293339",
        "completed_at": "2026-01-09T05:38:42.364039",
        "total_test_cases": 1,
        "passed_count": 1,
        "failed_count": 0,
        "alert_count": 0,
        "summary_evaluation": {
            avg_accuracy: 99,
            avg_latency_ms: 380,
            sentiment_score: 95,
            successful_upsells: 2
        },
        "test_case_results": [
            {
                "result_id": "bb03432b-1e30-47ce-9c0d-d3db1692e632",
                "test_case_id": "5e306859-5f7e-446c-9439-be62dbbe4d0b",
                "evaluation": {
                    overall_score: 98,
                    criteria: [
                        { name: "Greeting Accuracy", score: 10, status: "pass", reasoning: "Perfect greeting execution." },
                        { name: "Price Knowledge", score: 10, status: "pass", reasoning: "Correct price for Cold Brew ($6.50)." },
                        { name: "Conversation Flow", score: 10, status: "pass", reasoning: "Natural flow, handled user prompts effectively." },
                    ]
                },
                "call_recordings": [
                    {
                        "call_number": 1,
                        "recording_url": "https://hwlhkoseuixsnbsxhvtv.supabase.co/storage/v1/object/sign/recording_files/5475710c-fb5b-4b6f-80e9-d2c31d7f63c5_test_case_5e306859-5f7e-446c-9439-be62dbbe4d0b_call_1_recording.wav?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iZjRjZjFkMC01ZWNjLTQxZWUtYTdiYy04MWYzMjMzODRjODMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJyZWNvcmRpbmdfZmlsZXMvNTQ3NTcxMGMtZmI1Yi00YjZmLTgwZTktZDJjMzFkN2Y2M2M1X3Rlc3RfY2FzZV81ZTMwNjg1OS01ZjdlLTQ0NmMtOTQzOS1iZTYyZGJiZTRkMGJfY2FsbF8xX3JlY29yZGluZy53YXYiLCJpYXQiOjE3Njc5Mzc3ODEsImV4cCI6MTc2Nzk0MTM4MX0.GjjyGuSvc_KOqnbFMXK0aTnq_LKyWRuwamBbzJIZbe0",
                        "file_id": "5475710c-fb5b-4b6f-80e9-d2c31d7f63c5"
                    },
                    {
                        "call_number": 2,
                        "recording_url": "https://hwlhkoseuixsnbsxhvtv.supabase.co/storage/v1/object/sign/recording_files/2cd5bfa8-f45d-4668-a40e-2a91b328abde_test_case_5e306859-5f7e-446c-9439-be62dbbe4d0b_call_2_recording.wav?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iZjRjZjFkMC01ZWNjLTQxZWUtYTdiYy04MWYzMjMzODRjODMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJyZWNvcmRpbmdfZmlsZXMvMmNkNWJmYTgtZjQ1ZC00NjY4LWE0MGUtMmE5MWIzMjhhYmRlX3Rlc3RfY2FzZV81ZTMwNjg1OS01ZjdlLTQ0NmMtOTQzOS1iZTYyZGJiZTRkMGJfY2FsbF8yX3JlY29yZGluZy53YXYiLCJpYXQiOjE3Njc5Mzc3ODEsImV4cCI6MTc2Nzk0MTM4MX0.XuOYV4HU8iV4K0W7y4kYh-bR6gqGZ9O7jeVKQyi2ckc",
                        "file_id": "2cd5bfa8-f45d-4668-a40e-2a91b328abde"
                    }
                ],
                "call_transcripts": [
                    {
                        "call_number": 1,
                        "transcript": {
                            "id": "e22dc4bb-b4e8-4c53-ae9f-b82da6b3ecb6",
                            "call_transcript": [
                                { "role": "user", "content": "Welcome. I'm your bar assistant." },
                                { "role": "assistant", "content": "Hi, Alex here. What's the beer price?" },
                                { "role": "user", "content": "Most beers are five dollars and fifty cents." },
                                { "role": "user", "content": "Want a cold one?" },
                                { "role": "assistant", "content": "Any good lager recommendations?Which cold brew is best?" },
                                { "role": "user", "content": "Our cold brew is smooth and rich." },
                                { "role": "user", "content": "Try it." },
                                { "role": "assistant", "content": "How much for the cold brew?How much does it cost?" },
                                { "role": "user", "content": "Cold brew is six dollars and fifty cents. Wanna try?" },
                                { "role": "assistant", "content": "Sure, what's the total?" },
                                { "role": "user", "content": "That's six dollars and fifty cents." },
                                { "role": "user", "content": "Anything else?" },
                                { "role": "assistant", "content": "Any cocktail suggestions?" }
                            ],
                            "call_duration": 44
                        }
                    },
                    {
                        "call_number": 2,
                        "transcript": {
                            "id": "e22dc4bb-b4e8-4c53-ae9f-b82da6b3ecb6",
                            "call_transcript": [
                                { "role": "user", "content": "Welcome. I'm your bar assistant." },
                                { "role": "assistant", "content": "Hi, Alex here. What's the beer price?" },
                                { "role": "user", "content": "Most beers are five dollars and fifty cents." },
                                { "role": "user", "content": "Want a cold one?" },
                                { "role": "assistant", "content": "Any good lager recommendations?Which cold brew is best?" },
                                { "role": "user", "content": "Our cold brew is smooth and rich." },
                                { "role": "user", "content": "Try it." },
                                { "role": "assistant", "content": "How much for the cold brew?How much does it cost?" },
                                { "role": "user", "content": "Cold brew is six dollars and fifty cents. Wanna try?" },
                                { "role": "assistant", "content": "Sure, what's the total?" },
                                { "role": "user", "content": "That's six dollars and fifty cents." },
                                { "role": "user", "content": "Anything else?" },
                                { "role": "assistant", "content": "Any cocktail suggestions?" }
                            ],
                            "call_duration": 44
                        }
                    }
                ],
                "status": "completed",
                "started_at": "2026-01-09T05:37:55.189011",
                "completed_at": null
            }
        ]
    }
]

// --- Components ---

export default function DummyHistoryPage() {
    const [selectedRunId, setSelectedRunId] = useState<string | null>(DUMMY_DATA[0].id)
    const [searchTerm, setSearchTerm] = useState("")

    const selectedRun = DUMMY_DATA.find(r => r.id === selectedRunId)

    const filteredRuns = DUMMY_DATA.filter(run =>
        run.test_suite_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        run.id.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-background">

            {/* Sidebar List */}
            <div className="w-80 border-r flex flex-col bg-muted/10">
                <div className="p-4 border-b space-y-3">
                    <h2 className="font-semibold text-lg flex items-center gap-2">
                        <LayoutList className="w-5 h-5" />
                        Runs
                    </h2>
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Filter runs..."
                            className="pl-9 bg-background"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <ScrollArea className="flex-1">
                    <div className="flex flex-col p-2 gap-1">
                        {filteredRuns.map((run) => (
                            <button
                                key={run.id}
                                onClick={() => setSelectedRunId(run.id)}
                                className={cn(
                                    "flex flex-col items-start gap-1 p-3 rounded-lg text-left transition-colors hover:bg-muted",
                                    selectedRunId === run.id ? "bg-muted shadow-sm ring-1 ring-border" : "transparent"
                                )}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <span className="font-medium text-sm truncate w-24">
                                        Suite {run.test_suite_id.slice(0, 6)}...
                                    </span>
                                    {run.status === 'completed' ? (
                                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                                    ) : (
                                        <XCircle className="w-3 h-3 text-red-500" />
                                    )}
                                </div>
                                <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
                                    <span>{format(new Date(run.started_at), 'MMM d, p')}</span>
                                    <span>{run.passed_count}/{run.total_test_cases}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                {selectedRun ? (
                    <>
                        <div className="p-6 border-b bg-card">
                            <div className="flex items-start justify-between mb-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <Badge variant={selectedRun.status === 'completed' ? 'default' : 'destructive'}
                                            className="uppercase tracking-wide text-[10px] px-2 py-0.5">
                                            {selectedRun.status}
                                        </Badge>
                                        <span className="text-muted-foreground text-xs font-mono">
                                            ID: {selectedRun.id}
                                        </span>
                                    </div>
                                    <h1 className="text-2xl font-bold tracking-tight mb-1">
                                        Test Run Execution
                                    </h1>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4" />
                                            {format(new Date(selectedRun.started_at), 'MMMM d, yyyy')}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4" />
                                            {format(new Date(selectedRun.started_at), 'p')}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                        <Download className="w-4 h-4 mr-2" />
                                        Export Logs
                                    </Button>
                                </div>
                            </div>

                            {/* Evaluation Summary Cards */}
                            {selectedRun.summary_evaluation && (
                                <div className="grid grid-cols-4 gap-4 mb-2">
                                    <Card className="bg-muted/10 border-0 shadow-none">
                                        <CardContent className="p-4 flex items-center gap-4">
                                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                                                <Target className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground font-medium uppercase">Avg. Accuracy</p>
                                                <p className="text-xl font-bold">{selectedRun.summary_evaluation.avg_accuracy}%</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-muted/10 border-0 shadow-none">
                                        <CardContent className="p-4 flex items-center gap-4">
                                            <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                                                <Zap className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground font-medium uppercase">Avg. Latency</p>
                                                <p className="text-xl font-bold">{selectedRun.summary_evaluation.avg_latency_ms}ms</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-muted/10 border-0 shadow-none">
                                        <CardContent className="p-4 flex items-center gap-4">
                                            <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                                                <Smile className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground font-medium uppercase">Sentiment</p>
                                                <p className="text-xl font-bold">{selectedRun.summary_evaluation.sentiment_score}/100</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-muted/10 border-0 shadow-none">
                                        <CardContent className="p-4 flex items-center gap-4">
                                            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                                                <TrendingUp className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-muted-foreground font-medium uppercase">Upsells</p>
                                                <p className="text-xl font-bold">{selectedRun.summary_evaluation.successful_upsells}</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </div>

                        <ScrollArea className="flex-1 bg-muted/5 p-6">
                            <div className="max-w-5xl mx-auto space-y-8">
                                <div className="grid gap-6">
                                    {selectedRun.test_case_results.map((result, idx) => (
                                        <TestCaseDetails key={result.result_id} result={result} index={idx} />
                                    ))}
                                </div>
                            </div>
                        </ScrollArea>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground">
                        <div className="text-center">
                            <Activity className="w-12 h-12 mx-auto mb-4 opacity-20" />
                            <p>Select a run to view details</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function TestCaseDetails({ result, index }: { result: TestCaseResult, index: number }) {
    const [activeTranscriptCall, setActiveTranscriptCall] = useState<number>(
        result.call_transcripts[0]?.call_number || 1
    )

    const activeTranscript = result.call_transcripts.find(
        ct => ct.call_number === activeTranscriptCall
    ) || result.call_transcripts[0]

    return (
        <Card className="shadow-sm border-muted-foreground/10 overflow-hidden">
            <CardHeader className="bg-muted/30 border-b pb-4">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-base font-medium flex items-center gap-2">
                            <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center text-xs">
                                {index + 1}
                            </span>
                            Test Case Analysis
                        </CardTitle>
                        <CardDescription>
                            Case ID: {result.test_case_id}
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                        {result.evaluation && (
                            <Badge variant="outline" className="bg-background">
                                Score: <span className="font-bold ml-1">{result.evaluation.overall_score}</span>
                            </Badge>
                        )}
                        <Badge variant={result.status === 'completed' ? 'secondary' : 'destructive'}>
                            {result.status}
                        </Badge>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Tabs defaultValue="evaluation" className="w-full">
                    <div className="px-6 pt-4 border-b flex items-center justify-between">
                        <TabsList className="grid w-auto grid-cols-3">
                            <TabsTrigger value="evaluation">
                                <BarChart3 className="w-4 h-4 mr-2" />
                                Evaluation
                            </TabsTrigger>
                            <TabsTrigger value="transcript">
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Transcript
                            </TabsTrigger>
                            <TabsTrigger value="recordings">
                                <PlayCircle className="w-4 h-4 mr-2" />
                                Recordings
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="evaluation" className="p-6">
                        {result.evaluation ? (
                            <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    {result.evaluation.criteria.map((criterion, i) => (
                                        <div key={i} className="flex items-start gap-4 p-4 border rounded-lg bg-card/50">
                                            <div className={cn(
                                                "mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                                                criterion.status === 'pass' ? "bg-green-100 text-green-600" :
                                                    criterion.status === 'fail' ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-500"
                                            )}>
                                                {criterion.status === 'pass' && <Check className="w-3.5 h-3.5" />}
                                                {criterion.status === 'fail' && <XCircle className="w-3.5 h-3.5" />}
                                                {criterion.status === 'neutral' && <AlertCircle className="w-3.5 h-3.5" />}
                                            </div>
                                            <div>
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="font-medium text-sm">{criterion.name}</h4>
                                                    <Badge variant="secondary" className="text-[10px] h-5">
                                                        {criterion.score}/10
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground leading-relaxed">
                                                    {criterion.reasoning}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                No evaluation data available.
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="transcript" className="p-0 m-0">
                        {result.call_transcripts.length > 1 && (
                            <div className="px-6 py-2 border-b bg-muted/10 flex gap-2 overflow-x-auto">
                                {result.call_transcripts.map((ct) => (
                                    <button
                                        key={ct.call_number}
                                        onClick={() => setActiveTranscriptCall(ct.call_number)}
                                        className={cn(
                                            "text-xs font-medium px-3 py-1.5 rounded-full transition-colors",
                                            activeTranscriptCall === ct.call_number
                                                ? "bg-primary text-primary-foreground shadow-sm"
                                                : "bg-background border hover:bg-muted text-muted-foreground"
                                        )}
                                    >
                                        Call #{ct.call_number} ({ct.transcript.call_duration}s)
                                    </button>
                                ))}
                            </div>
                        )}

                        <div className="p-6 bg-slate-50 dark:bg-slate-950/30 max-h-[500px] overflow-y-auto min-h-[300px]">
                            {activeTranscript ? (
                                activeTranscript.transcript.call_transcript.map((msg, i) => (
                                    <div key={i} className={cn(
                                        "flex mb-4 last:mb-0",
                                        msg.role === 'user' ? "justify-end" : "justify-start"
                                    )}>
                                        <div className={cn(
                                            "max-w-[75%] rounded-2xl px-5 py-3 text-sm shadow-sm",
                                            msg.role === 'user'
                                                ? "bg-blue-600 text-white rounded-br-none"
                                                : "bg-white dark:bg-zinc-800 border rounded-bl-none text-zinc-800 dark:text-zinc-200"
                                        )}>
                                            <p>{msg.content}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 text-muted-foreground text-sm">
                                    No transcript available for this call.
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="recordings" className="p-6">
                        <div className="grid gap-4">
                            {result.call_recordings.map((rec, i) => (
                                <div key={i} className="flex items-center gap-4 p-4 border rounded-lg bg-card hover:bg-muted/50 transition-colors">
                                    <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Play className="w-5 h-5 ml-0.5" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-sm">Call Recording #{rec.call_number}</h4>
                                        <audio controls src={rec.recording_url} className="w-full h-8 mt-2" />
                                    </div>
                                </div>
                            ))}
                            {result.call_recordings.length === 0 && (
                                <div className="text-center py-8 text-muted-foreground">
                                    No recordings available.
                                </div>
                            )}
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    )
}

function Target(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
        </svg>
    )
}

function Zap(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
    )
}

function Smile(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 14s1.5 2 4 2 4-2 4-2" />
            <line x1="9" x2="9.01" y1="9" y2="9" />
            <line x1="15" x2="15.01" y1="9" y2="9" />
        </svg>
    )
}

function TrendingUp(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
        </svg>
    )
}
