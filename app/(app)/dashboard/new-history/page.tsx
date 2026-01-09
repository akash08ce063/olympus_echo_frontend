"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"
import { TestSuitesService } from "@/services/testSuites"
import {
    Activity,
    Calendar,
    CheckCircle2,
    ChevronDown,
    ChevronRight,
    Search,
    Play,
    Download,
    FileText,
    Filter,
    Clock,
    XCircle,
    AlertTriangle,
    MoreHorizontal
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { format } from "date-fns"

// --- Types ---
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

interface TestCaseResult {
    result_id: string
    test_case_id: string
    status: string
    started_at: string
    completed_at: string | null
    call_recordings: CallRecording[]
    call_transcripts: CallTranscript[]
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
}

// --- Icons Helper ---
const StatusIcon = ({ status }: { status: string }) => {
    switch (status.toLowerCase()) {
        case 'completed':
        case 'passed':
            return <CheckCircle2 className="w-4 h-4 text-green-500" />
        case 'failed':
            return <XCircle className="w-4 h-4 text-red-500" />
        case 'running':
            return <Activity className="w-4 h-4 text-blue-500 animate-pulse" />
        default:
            return <AlertTriangle className="w-4 h-4 text-yellow-500" />
    }
}

const StatusBadge = ({ status }: { status: string }) => {
    const variants: Record<string, "default" | "destructive" | "secondary" | "outline"> = {
        completed: "default",
        passed: "default",
        failed: "destructive",
        running: "secondary"
    }
    // Fallback for unknown statuses
    const variant = variants[status.toLowerCase()] || "outline"

    return (
        <Badge variant={variant} className="capitalize">
            {status}
        </Badge>
    )
}

export default function TestHistoryPage() {
    const { user } = useAuth()
    const [runs, setRuns] = useState<TestRun[]>(
        [
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
                "test_case_results": [
                    {
                        "result_id": "56b34bb4-8780-4dbb-94f5-b7216853b072",
                        "test_case_id": "2e980f4a-6c31-48a7-ae76-efbe1eefb8da",
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
                                        {
                                            "role": "user",
                                            "content": "Welcome."
                                        },
                                        {
                                            "role": "user",
                                            "content": "I'm your bar assistant."
                                        },
                                        {
                                            "role": "assistant",
                                            "content": "Hi, price of beer? Recommend something?"
                                        },
                                        {
                                            "role": "user",
                                            "content": "Beer is five dollars. Try our house lager. It's smooth and refreshing."
                                        },
                                        {
                                            "role": "user",
                                            "content": "Like it?"
                                        },
                                        {
                                            "role": "assistant",
                                            "content": "Thanks, how much for a whiskey?Yes, great! Any drink suggestions?"
                                        },
                                        {
                                            "role": "user",
                                            "content": "How about a whiskey"
                                        },
                                        {
                                            "role": "user",
                                            "content": "hour."
                                        }
                                    ],
                                    "call_duration": 29,

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
                "test_case_results": [
                    {
                        "result_id": "16b09364-c603-4aca-8da8-e9aa50eca138",
                        "test_case_id": "df8b69dd-c223-45ae-b9be-8f0a55f7b09f",

                        "call_recordings": [
                            {
                                "call_number": 1,
                                "recording_url": "https://hwlhkoseuixsnbsxhvtv.supabase.co/storage/v1/object/sign/recording_files/8df6beb1-1e85-4ae8-a4c5-ac8f7f91a2b0_test_case_df8b69dd-c223-45ae-b9be-8f0a55f7b09f_call_1_recording.wav?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iZjRjZjFkMC01ZWNjLTQxZWUtYTdiYy04MWYzMjMzODRjODMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJyZWNvcmRpbmdfZmlsZXMvOGRmNmJlYjEtMWU4NS00YWU4LWE0YzUtYWM4ZjdmOTFhMmIwX3Rlc3RfY2FzZV9kZjhiNjlkZC1jMjIzLTQ1YWUtYjliZS04ZjBhNTVmN2IwOWZfY2FsbF8xX3JlY29yZGluZy53YXYiLCJpYXQiOjE3Njc5Mzc3ODAsImV4cCI6MTc2Nzk0MTM4MH0.yQAoLFKb9IrjKPHzEDorjc3v2bT-Tdgpg0AI7JB4i78",
                                "file_id": "8df6beb1-1e85-4ae8-a4c5-ac8f7f91a2b0"
                            }
                        ],
                        "call_transcripts": [
                            {
                                "call_number": 1,
                                "transcript": {

                                    "id": "7320b9db-9677-473c-bef0-7294c93ab171",

                                    "call_transcript": [
                                        {
                                            "role": "user",
                                            "content": "Welcome. I'm your bar assistant."
                                        },
                                        {
                                            "role": "assistant",
                                            "content": "Hi, Alex. Beer price? Any recommendations?"
                                        }
                                    ],
                                    "call_duration": 29,
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
                "test_case_results": [
                    {
                        "result_id": "bb03432b-1e30-47ce-9c0d-d3db1692e632",
                        "test_case_id": "5e306859-5f7e-446c-9439-be62dbbe4d0b",

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
                                        {
                                            "role": "user",
                                            "content": "Welcome. I'm your bar assistant."
                                        },
                                        {
                                            "role": "assistant",
                                            "content": "Hi, Alex here. What's the beer price?"
                                        },
                                        {
                                            "role": "user",
                                            "content": "Most beers are five dollars and fifty cents."
                                        },
                                        {
                                            "role": "user",
                                            "content": "Want a cold one?"
                                        },
                                        {
                                            "role": "assistant",
                                            "content": "Any good lager recommendations?Which cold brew is best?"
                                        },
                                        {
                                            "role": "user",
                                            "content": "Our cold brew is smooth and rich."
                                        },
                                        {
                                            "role": "user",
                                            "content": "Try it."
                                        },
                                        {
                                            "role": "assistant",
                                            "content": "How much for the cold brew?How much does it cost?"
                                        },
                                        {
                                            "role": "user",
                                            "content": "Cold brew is six dollars and fifty cents. Wanna try?"
                                        },
                                        {
                                            "role": "assistant",
                                            "content": "Sure, what's the total?"
                                        },
                                        {
                                            "role": "user",
                                            "content": "That's six dollars and fifty cents."
                                        },
                                        {
                                            "role": "user",
                                            "content": "Anything else?"
                                        },
                                        {
                                            "role": "assistant",
                                            "content": "Any cocktail suggestions?"
                                        }
                                    ],
                                    "call_duration": 44,

                                }
                            },
                            {
                                "call_number": 2,
                                "transcript": {
                                    "id": "e22dc4bb-b4e8-4c53-ae9f-b82da6b3ecb6",
                                    "call_transcript": [
                                        {
                                            "role": "user",
                                            "content": "Welcome. I'm your bar assistant."
                                        },
                                        {
                                            "role": "assistant",
                                            "content": "Hi, Alex here. What's the beer price?"
                                        },
                                        {
                                            "role": "user",
                                            "content": "Most beers are five dollars and fifty cents."
                                        },
                                        {
                                            "role": "user",
                                            "content": "Want a cold one?"
                                        },
                                        {
                                            "role": "assistant",
                                            "content": "Any good lager recommendations?Which cold brew is best?"
                                        },
                                        {
                                            "role": "user",
                                            "content": "Our cold brew is smooth and rich."
                                        },
                                        {
                                            "role": "user",
                                            "content": "Try it."
                                        },
                                        {
                                            "role": "assistant",
                                            "content": "How much for the cold brew?How much does it cost?"
                                        },
                                        {
                                            "role": "user",
                                            "content": "Cold brew is six dollars and fifty cents. Wanna try?"
                                        },
                                        {
                                            "role": "assistant",
                                            "content": "Sure, what's the total?"
                                        },
                                        {
                                            "role": "user",
                                            "content": "That's six dollars and fifty cents."
                                        },
                                        {
                                            "role": "user",
                                            "content": "Anything else?"
                                        },
                                        {
                                            "role": "assistant",
                                            "content": "Any cocktail suggestions?"
                                        }
                                    ],
                                    "call_duration": 44,

                                }
                            }
                        ],
                        "status": "completed",
                        "started_at": "2026-01-09T05:37:55.189011",
                        "completed_at": null
                    }
                ]
            }

        ])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")

    // Stats
    const totalRuns = runs.length
    const completedRuns = runs.filter(r => ['completed', 'passed'].includes(r.status)).length
    const failedRuns = runs.filter(r => r.status === 'failed').length
    const successRate = totalRuns > 0 ? Math.round((completedRuns / totalRuns) * 100) : 0

    useEffect(() => {
        if (!user?.id) return

        const fetchHistory = async () => {
            setLoading(true)
            try {
                const response: any = await TestSuitesService.getAllRuns(user.id)
                console.log("History Data:", response)
                setRuns(
                    [
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
                            "test_case_results": [
                                {
                                    "result_id": "56b34bb4-8780-4dbb-94f5-b7216853b072",
                                    "test_case_id": "2e980f4a-6c31-48a7-ae76-efbe1eefb8da",
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
                                                    {
                                                        "role": "user",
                                                        "content": "Welcome."
                                                    },
                                                    {
                                                        "role": "user",
                                                        "content": "I'm your bar assistant."
                                                    },
                                                    {
                                                        "role": "assistant",
                                                        "content": "Hi, price of beer? Recommend something?"
                                                    },
                                                    {
                                                        "role": "user",
                                                        "content": "Beer is five dollars. Try our house lager. It's smooth and refreshing."
                                                    },
                                                    {
                                                        "role": "user",
                                                        "content": "Like it?"
                                                    },
                                                    {
                                                        "role": "assistant",
                                                        "content": "Thanks, how much for a whiskey?Yes, great! Any drink suggestions?"
                                                    },
                                                    {
                                                        "role": "user",
                                                        "content": "How about a whiskey"
                                                    },
                                                    {
                                                        "role": "user",
                                                        "content": "hour."
                                                    }
                                                ],
                                                "call_duration": 29,

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
                            "test_case_results": [
                                {
                                    "result_id": "16b09364-c603-4aca-8da8-e9aa50eca138",
                                    "test_case_id": "df8b69dd-c223-45ae-b9be-8f0a55f7b09f",

                                    "call_recordings": [
                                        {
                                            "call_number": 1,
                                            "recording_url": "https://hwlhkoseuixsnbsxhvtv.supabase.co/storage/v1/object/sign/recording_files/8df6beb1-1e85-4ae8-a4c5-ac8f7f91a2b0_test_case_df8b69dd-c223-45ae-b9be-8f0a55f7b09f_call_1_recording.wav?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9iZjRjZjFkMC01ZWNjLTQxZWUtYTdiYy04MWYzMjMzODRjODMiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJyZWNvcmRpbmdfZmlsZXMvOGRmNmJlYjEtMWU4NS00YWU4LWE0YzUtYWM4ZjdmOTFhMmIwX3Rlc3RfY2FzZV9kZjhiNjlkZC1jMjIzLTQ1YWUtYjliZS04ZjBhNTVmN2IwOWZfY2FsbF8xX3JlY29yZGluZy53YXYiLCJpYXQiOjE3Njc5Mzc3ODAsImV4cCI6MTc2Nzk0MTM4MH0.yQAoLFKb9IrjKPHzEDorjc3v2bT-Tdgpg0AI7JB4i78",
                                            "file_id": "8df6beb1-1e85-4ae8-a4c5-ac8f7f91a2b0"
                                        }
                                    ],
                                    "call_transcripts": [
                                        {
                                            "call_number": 1,
                                            "transcript": {

                                                "id": "7320b9db-9677-473c-bef0-7294c93ab171",

                                                "call_transcript": [
                                                    {
                                                        "role": "user",
                                                        "content": "Welcome. I'm your bar assistant."
                                                    },
                                                    {
                                                        "role": "assistant",
                                                        "content": "Hi, Alex. Beer price? Any recommendations?"
                                                    }
                                                ],
                                                "call_duration": 29,
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
                            "test_case_results": [
                                {
                                    "result_id": "bb03432b-1e30-47ce-9c0d-d3db1692e632",
                                    "test_case_id": "5e306859-5f7e-446c-9439-be62dbbe4d0b",

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
                                                    {
                                                        "role": "user",
                                                        "content": "Welcome. I'm your bar assistant."
                                                    },
                                                    {
                                                        "role": "assistant",
                                                        "content": "Hi, Alex here. What's the beer price?"
                                                    },
                                                    {
                                                        "role": "user",
                                                        "content": "Most beers are five dollars and fifty cents."
                                                    },
                                                    {
                                                        "role": "user",
                                                        "content": "Want a cold one?"
                                                    },
                                                    {
                                                        "role": "assistant",
                                                        "content": "Any good lager recommendations?Which cold brew is best?"
                                                    },
                                                    {
                                                        "role": "user",
                                                        "content": "Our cold brew is smooth and rich."
                                                    },
                                                    {
                                                        "role": "user",
                                                        "content": "Try it."
                                                    },
                                                    {
                                                        "role": "assistant",
                                                        "content": "How much for the cold brew?How much does it cost?"
                                                    },
                                                    {
                                                        "role": "user",
                                                        "content": "Cold brew is six dollars and fifty cents. Wanna try?"
                                                    },
                                                    {
                                                        "role": "assistant",
                                                        "content": "Sure, what's the total?"
                                                    },
                                                    {
                                                        "role": "user",
                                                        "content": "That's six dollars and fifty cents."
                                                    },
                                                    {
                                                        "role": "user",
                                                        "content": "Anything else?"
                                                    },
                                                    {
                                                        "role": "assistant",
                                                        "content": "Any cocktail suggestions?"
                                                    }
                                                ],
                                                "call_duration": 44,

                                            }
                                        },
                                        {
                                            "call_number": 2,
                                            "transcript": {
                                                "id": "e22dc4bb-b4e8-4c53-ae9f-b82da6b3ecb6",
                                                "call_transcript": [
                                                    {
                                                        "role": "user",
                                                        "content": "Welcome. I'm your bar assistant."
                                                    },
                                                    {
                                                        "role": "assistant",
                                                        "content": "Hi, Alex here. What's the beer price?"
                                                    },
                                                    {
                                                        "role": "user",
                                                        "content": "Most beers are five dollars and fifty cents."
                                                    },
                                                    {
                                                        "role": "user",
                                                        "content": "Want a cold one?"
                                                    },
                                                    {
                                                        "role": "assistant",
                                                        "content": "Any good lager recommendations?Which cold brew is best?"
                                                    },
                                                    {
                                                        "role": "user",
                                                        "content": "Our cold brew is smooth and rich."
                                                    },
                                                    {
                                                        "role": "user",
                                                        "content": "Try it."
                                                    },
                                                    {
                                                        "role": "assistant",
                                                        "content": "How much for the cold brew?How much does it cost?"
                                                    },
                                                    {
                                                        "role": "user",
                                                        "content": "Cold brew is six dollars and fifty cents. Wanna try?"
                                                    },
                                                    {
                                                        "role": "assistant",
                                                        "content": "Sure, what's the total?"
                                                    },
                                                    {
                                                        "role": "user",
                                                        "content": "That's six dollars and fifty cents."
                                                    },
                                                    {
                                                        "role": "user",
                                                        "content": "Anything else?"
                                                    },
                                                    {
                                                        "role": "assistant",
                                                        "content": "Any cocktail suggestions?"
                                                    }
                                                ],
                                                "call_duration": 44,

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
                )
                // if (response?.data?.runs) {
                //     setRuns(response.data.runs)

                // }
            } catch (error) {
                console.error("Failed to fetch history:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchHistory()
    }, [user])

    const filteredRuns = runs.filter(run => {
        const matchesSearch = run.test_suite_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            run.id.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "all" || run.status.toLowerCase() === statusFilter.toLowerCase()
        return matchesSearch && matchesStatus
    })

    return (
        <div className="container mx-auto py-8 px-4 max-w-7xl animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Test History</h1>
                    <p className="text-muted-foreground mt-1">
                        Review detailed logs, recordings, and transcripts from your AI test runs.
                    </p>
                </div>
                {/* <Button variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                </Button> */}
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{loading ? <Skeleton className="h-8 w-16" /> : totalRuns}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600 dark:text-green-500">
                            {loading ? <Skeleton className="h-8 w-16" /> : `${successRate}%`}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Failed Runs</CardTitle>
                        <XCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-red-600 dark:text-red-500">
                            {loading ? <Skeleton className="h-8 w-16" /> : failedRuns}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {/* Placeholder logic for avg duration */}
                        <div className="text-2xl font-bold">
                            {loading ? <Skeleton className="h-8 w-16" /> : "~32s"}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by Suite ID or Run ID..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <Filter className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="Filter Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="passed">Passed</SelectItem>
                            <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Run List */}
            <div className="space-y-4">
                {loading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <Card key={i} className="mb-4">
                            <CardContent className="p-6">
                                <div className="space-y-3">
                                    <Skeleton className="h-4 w-1/3" />
                                    <Skeleton className="h-4 w-1/4" />
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : filteredRuns.length === 0 ? (
                    <div className="text-center py-12 bg-muted/30 rounded-lg border border-dashed">
                        <Activity className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                        <h3 className="text-lg font-medium">No test runs found</h3>
                        <p className="text-muted-foreground">Try adjusting your filters or run a new test suite.</p>
                    </div>
                ) : (
                    filteredRuns.map((run) => (
                        <RunCard key={run.id} run={run} />
                    ))
                )}
            </div>
        </div>
    )
}

// --- Sub-components for better organization ---

function RunCard({ run }: { run: TestRun }) {
    const [isOpen, setIsOpen] = useState(false)

    // Duration calculation helper
    const getDuration = (start: string, end: string | null) => {
        if (!end) return "Running..."
        const s = new Date(start).getTime()
        const e = new Date(end).getTime()
        const diff = Math.floor((e - s) / 1000)
        return `${diff}s`
    }

    return (
        <Card className={`overflow-hidden transition-all duration-200 border-l-4 ${run.status === 'failed' ? 'border-l-red-500' : 'border-l-green-500'
            }`}>
            <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <div className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

                    {/* Left: Info */}
                    <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2 mb-1">
                            <StatusBadge status={run.status} />
                            <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded">
                                ID: {run.id.slice(0, 8)}...
                            </span>
                        </div>
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                            Test Suite Run
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5" />
                                {format(new Date(run.started_at), 'MMM d, yyyy h:mm a')}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {getDuration(run.started_at, run.completed_at)}
                            </span>
                            <span className="flex items-center gap-1">
                                <FileText className="w-3.5 h-3.5" />
                                {run.total_test_cases} Test Cases
                            </span>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col items-end mr-4">
                            <span className="text-sm font-medium text-green-600">{run.passed_count} Passed</span>
                            {run.failed_count > 0 && (
                                <span className="text-sm font-medium text-red-600">{run.failed_count} Failed</span>
                            )}
                        </div>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm" className="w-9 h-9 p-0 rounded-full">
                                {isOpen ? (
                                    <ChevronDown className="h-5 w-5" />
                                ) : (
                                    <ChevronRight className="h-5 w-5" />
                                )}
                                <span className="sr-only">Toggle details</span>
                            </Button>
                        </CollapsibleTrigger>
                    </div>
                </div>

                {/* Expanded Content */}
                <CollapsibleContent>
                    <div className="px-6 pb-6 pt-0 border-t bg-muted/20">
                        <div className="mt-4 space-y-4">
                            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Test Cases</h4>
                            {run.test_case_results.map((result) => (
                                <TestCaseItem key={result.result_id} result={result} />
                            ))}
                        </div>
                    </div>
                </CollapsibleContent>
            </Collapsible>
        </Card>
    )
}

function TestCaseItem({ result }: { result: TestCaseResult }) {
    return (
        <Card className="bg-background shadow-sm border border-muted-foreground/10">
            <CardHeader className="py-3 px-4 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-3">
                    <StatusIcon status={result.status} />
                    <span className="font-medium text-sm">Test Case: {result.test_case_id}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                    {/* Placeholder for duration if needed per test case */}
                    {/* {result.completed_at && format(new Date(result.completed_at), 'mm:ss')} */}
                </div>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
                <div className="pl-7 space-y-4 mt-2">
                    {/* Recordings Section */}
                    {result.call_recordings && result.call_recordings.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground">Recordings</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {result.call_recordings.map((rec) => (
                                    <div key={rec.file_id} className="bg-muted/40 rounded-md p-2 flex items-center gap-3 border">
                                        <div className="bg-primary/10 p-2 rounded-full">
                                            <Play className="w-4 h-4 text-primary" />
                                        </div>
                                        <div className="flex-1 overflow-hidden">
                                            <audio controls src={rec.recording_url} className="w-full h-8" />
                                        </div>
                                        <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
                                            <a href={rec.recording_url} download target="_blank" rel="noopener noreferrer">
                                                <Download className="w-4 h-4" />
                                            </a>
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Transcripts Section with Accordion/Toggle */}
                    {result.call_transcripts && result.call_transcripts.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground">Transcripts</p>
                            {result.call_transcripts.map((t, idx) => (
                                <TranscriptViewer key={idx} transcriptData={t} />
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

function TranscriptViewer({ transcriptData }: { transcriptData: CallTranscript }) {
    const [expanded, setExpanded] = useState(false)
    const messages = transcriptData.transcript?.call_transcript || []

    return (
        <div className="border rounded-md bg-background overflow-hidden">
            <div
                className="flex items-center justify-between p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Call #{transcriptData.call_number} Log</span>
                    <Badge variant="outline" className="text-[10px] h-5">
                        {messages.length} msgs
                    </Badge>
                </div>
                {expanded ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronRight className="w-4 h-4 text-muted-foreground" />}
            </div>

            {expanded && (
                <div className="bg-muted/10 p-4 border-t max-h-[400px] overflow-y-auto space-y-3">
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] rounded-lg p-3 text-sm ${msg.role === 'user'
                                ? 'bg-primary text-primary-foreground ml-8'
                                : 'bg-muted border mr-8'
                                }`}>
                                <p className="text-xs opacity-70 mb-1 font-semibold uppercase tracking-wider">
                                    {msg.role}
                                </p>
                                <p>{msg.content}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
