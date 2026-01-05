"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Dataset, Experiment, TestCase, TestMessage, CaseResult, RubricResult, TargetAgent } from "@/types/test-suite";
import { useNotifications } from "@/context/NotificationContext";

interface TestContextType {
    datasets: Dataset[];
    targetAgents: TargetAgent[];
    activeExperiment: Experiment | null;
    history: Experiment[];

    // Datasets
    addDataset: (dataset: Dataset) => void;
    updateDataset: (dataset: Dataset) => void;
    getDataset: (id: string) => Dataset | undefined;
    deleteDataset: (id: string) => void;

    // Targets
    addTargetAgent: (agent: TargetAgent) => void;
    updateTargetAgent: (agent: TargetAgent) => void;
    getTargetAgent: (id: string) => TargetAgent | undefined;

    // Execution
    runExperiment: (datasetId: string) => void;
    stopExperiment: () => void;
}

const TestContext = createContext<TestContextType | undefined>(undefined);

const MOCK_TARGETS: TargetAgent[] = [
    {
        id: "target-1",
        name: "Sales Bot v2 (Staging)",
        type: "websocket",
        config: { url: "wss://api.example.com/voice/ws" }
    },
    {
        id: "target-2",
        name: "Customer Support (Vapi)",
        type: "vapi",
        config: { assistantId: "vapi-123-456" }
    }
];

const MOCK_DATASETS: Dataset[] = [
    {
        id: "ds-1",
        name: "Sales Objection Handling",
        description: "Testing how the agent handles pricing pushback and competitor comparisons.",
        targetAgentId: "target-1",
        created_at: new Date().toISOString(),
        cases: [
            {
                id: "case-1",
                test_suite_id: "ds-1",
                name: "Too Expensive",
                steps: [
                    { action: "speak", text: "Ask for the price." },
                    { action: "speak", text: "When they tell you, say it's too expensive and ask for a discount." }
                ],
                conditions: [
                    { type: "llm_eval", expected: "Agent justifies value" },
                    { type: "response_contains", expected: "monthly installments" }
                ],
                expected_outcome: "Agent should offer a payment plan or justify the price.",
                timeout_seconds: 30,
                order_index: 0,
                is_active: true,
                attempts: 1,
                default_concurrent_calls: 1
            }
        ],
    },
];

export function TestProvider({ children }: { children: React.ReactNode }) {
    const [datasets, setDatasets] = useState<Dataset[]>(MOCK_DATASETS);
    const [targetAgents, setTargetAgents] = useState<TargetAgent[]>(MOCK_TARGETS);
    const [activeExperiment, setActiveExperiment] = useState<Experiment | null>(null);
    const [history, setHistory] = useState<Experiment[]>([
        {
            id: "exp-mock-1",
            datasetId: "20ce1a33-68f8-4812-9d99-48ae7e68e3c0",
            status: "completed",
            startedAt: new Date(Date.now() - 3600000).toISOString(),
            completedAt: new Date(Date.now() - 3500000).toISOString(),
            results: {
                "case-1": {
                    caseId: "case-1",
                    status: "passed",
                    duration: 12,
                    transcript: [
                        { id: "m1", role: "user", content: "Hello, how much does the premium plan cost?", timestamp: Date.now() },
                        { id: "m2", role: "assistant", content: "Our premium plan is $99/month, offering full access to all features.", timestamp: Date.now() + 1000 },
                        { id: "m3", role: "user", content: "That's a bit high for us. Can we get a discount?", timestamp: Date.now() + 2000 },
                        { id: "m4", role: "assistant", content: "I understand. We offer a 20% discount on annual billing, which brings the monthly cost down significantly. Would you like to hear more about that?", timestamp: Date.now() + 3000 }
                    ],
                    rubricResults: [
                        { rubricId: "r-1", passed: true, reason: "Agent justified value by explaining plan benefits." },
                        { rubricId: "r-2", passed: true, reason: "Agent mentioned discount options." }
                    ]
                }
            }
        },
        {
            id: "exp-mock-2",
            datasetId: "20ce1a33-68f8-4812-9d99-48ae7e68e3c0",
            status: "failed",
            startedAt: new Date(Date.now() - 7200000).toISOString(),
            completedAt: new Date(Date.now() - 7100000).toISOString(),
            results: {
                "case-1": {
                    caseId: "case-1",
                    status: "failed",
                    duration: 8,
                    transcript: [
                        { id: "m1", role: "user", content: "The price is too high.", timestamp: Date.now() },
                        { id: "m2", role: "assistant", content: "I'm sorry you feel that way. Let me know if you change your mind.", timestamp: Date.now() + 1000 }
                    ],
                    rubricResults: [
                        { rubricId: "r-1", passed: false, reason: "Agent did not justify value or handle objection properly." },
                        { rubricId: "r-2", passed: false, reason: "Agent did not offer any alternatives." }
                    ]
                }
            }
        }
    ]);

    // Use notifications hook - this is safe now that NotificationProvider wraps TestProvider
    const { addNotification } = useNotifications();

    // --- CRUD for Datasets ---
    const addDataset = (dataset: Dataset) => {
        setDatasets((prev) => [...prev, dataset]);
    };

    const updateDataset = (updated: Dataset) => {
        setDatasets((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
    };

    const getDataset = (id: string) => datasets.find((d) => d.id === id);

    const deleteDataset = (id: string) => {
        setDatasets((prev) => prev.filter((d) => d.id !== id));
    };

    // --- CRUD for Target Agents ---
    const addTargetAgent = (agent: TargetAgent) => {
        setTargetAgents((prev) => [...prev, agent]);
    };

    const updateTargetAgent = (updated: TargetAgent) => {
        setTargetAgents((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    };

    const getTargetAgent = (id: string) => targetAgents.find((a) => a.id === id);

    // --- Execution ---
    const runExperiment = useCallback((datasetId: string) => {
        const dataset = datasets.find((d) => d.id === datasetId);
        if (!dataset) return;

        const newExperiment: Experiment = {
            id: `exp-${Date.now()}`,
            datasetId,
            status: "running",
            results: {}, // Initialize empty
            startedAt: new Date().toISOString(),
        };

        setActiveExperiment(newExperiment);

        // MOCK SIMULATION RUNNER
        let currentCaseIndex = 0;

        const runNextCase = async () => {
            if (currentCaseIndex >= dataset.cases.length) {
                // Finished
                const completedExperiment = { ...newExperiment, status: "completed" as const, completedAt: new Date().toISOString(), results: newExperiment.results };
                setActiveExperiment(completedExperiment);
                setHistory((prev) => [completedExperiment, ...prev]);

                // Calculate results
                const totalCases = dataset.cases.length;
                const passedCases = Object.values(completedExperiment.results).filter(result => result.status === 'passed').length;

                // Add notification
                addNotification({
                    title: `Test Suite ${passedCases === totalCases ? 'Completed' : 'Finished'}`,
                    message: `Your test suite "${dataset.name}" has finished with ${passedCases}/${totalCases} tests passing.`,
                    type: passedCases === totalCases ? 'success' : passedCases === 0 ? 'error' : 'warning',
                    testRunId: completedExperiment.id
                });

                return;
            }

            const testCase = dataset.cases[currentCaseIndex];
            const caseId = testCase.id || `temp-${currentCaseIndex}`;

            // Mark case as running
            setActiveExperiment((prev) => {
                if (!prev) return null;
                return {
                    ...prev,
                    results: {
                        ...prev.results,
                        [caseId]: {
                            caseId: caseId,
                            status: "running",
                            transcript: [],
                            rubricResults: [],
                            duration: 0,
                        }
                    }
                };
            });

            // Simulate delay for "Connecting..."
            await new Promise(r => setTimeout(r, 1000));

            // Simulate Conversation (Mock Transcripts)
            const mockTranscript: TestMessage[] = [
                { id: "m1", role: "user", content: "Hello, how much does this cost?", timestamp: Date.now() },
                { id: "m2", role: "assistant", content: "Our enterprise plan starts at $500/month.", timestamp: Date.now() + 1500 },
                { id: "m3", role: "user", content: "That seems really expensive.", timestamp: Date.now() + 3000 },
                { id: "m4", role: "assistant", content: "I understand. We do offer a quarterly payment plan to help with cash flow.", timestamp: Date.now() + 4500 },
            ];

            // Stream transcript updates
            for (const msg of mockTranscript) {
                await new Promise(r => setTimeout(r, 800)); // Simulate typing/speaking
                setActiveExperiment((prev) => {
                    if (!prev) return null;
                    const currentResults = prev.results[caseId];
                    if (!currentResults) return prev;
                    return {
                        ...prev,
                        results: {
                            ...prev.results,
                            [caseId]: {
                                ...currentResults,
                                transcript: [...currentResults.transcript, msg]
                            }
                        }
                    }
                });
            }

            // Evaluate Rubric (Mock Logic)
            const rubricResults: RubricResult[] = testCase.conditions.map((cond, idx) => ({
                rubricId: `cond-${idx}`,
                passed: Math.random() > 0.3, // Random 70% pass rate
                reason: `Simulated evaluation for ${cond.type}: target met expectation.`
            }));

            const isPass = rubricResults.every(r => r.passed);

            // Finish Case
            setActiveExperiment((prev) => {
                if (!prev) return null;
                const currentCaseResults = prev.results[caseId];
                if (!currentCaseResults) return prev;
                return {
                    ...prev,
                    results: {
                        ...prev.results,
                        [caseId]: {
                            ...currentCaseResults,
                            status: isPass ? "passed" : "failed",
                            rubricResults,
                            duration: 5000
                        }
                    }
                };
            });

            currentCaseIndex++;
            runNextCase();
        };

        runNextCase();

    }, [datasets]);

    const stopExperiment = () => {
        setActiveExperiment((prev) => prev ? { ...prev, status: "aborted" } : null);
    };

    return (
        <TestContext.Provider
            value={{
                datasets,
                targetAgents,
                activeExperiment,
                history,
                addDataset,
                updateDataset,
                getDataset,
                deleteDataset,
                addTargetAgent,
                updateTargetAgent,
                getTargetAgent,
                runExperiment,
                stopExperiment,
            }}
        >
            {children}
        </TestContext.Provider>
    );
}

export function useTestContext() {
    const context = useContext(TestContext);
    if (context === undefined) {
        throw new Error("useTestContext must be used within a TestProvider");
    }
    return context;
}
