"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Dataset, Experiment, TestCase, TestMessage, CaseResult, RubricResult, TargetAgent } from "@/types/test-suite";

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
                title: "Too Expensive",
                scenario: "Customer thinks the price is high",
                testerPersona: {
                    id: "p-cfo",
                    name: "Frugal CFO",
                    role: "CFO",
                    systemPrompt: "You are a skeptical CFO. You care only about ROI. Reject the first price.",
                },
                script: "Ask for the price. When they tell you, say it's too expensive and ask for a discount.",
                rubric: [
                    { id: "r-1", criteria: "Agent justifies value", type: "llm_eval" },
                    { id: "r-2", criteria: "Agent offers payment plan", type: "contains_keywords", keywords: ["monthly", "installments", "plan"] },
                ],
            },
            {
                id: "case-2",
                title: "Competitor Comparison",
                scenario: "Customer asks about Competitor X",
                testerPersona: {
                    id: "p-tech",
                    name: "Tech Lead",
                    role: "Tech Lead",
                    systemPrompt: "You are comparing this product to Competitor X.",
                },
                script: "Ask how this compares to 'Competitor X'. Press on feature parity.",
                rubric: [
                    { id: "r-3", criteria: "Agent mentions unique selling point", type: "llm_eval" },
                    { id: "r-4", criteria: "No negative trash talking", type: "llm_eval" },
                ],
            },
        ],
    },
];

export function TestProvider({ children }: { children: React.ReactNode }) {
    const [datasets, setDatasets] = useState<Dataset[]>(MOCK_DATASETS);
    const [targetAgents, setTargetAgents] = useState<TargetAgent[]>(MOCK_TARGETS);
    const [activeExperiment, setActiveExperiment] = useState<Experiment | null>(null);
    const [history, setHistory] = useState<Experiment[]>([]);

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
                setActiveExperiment((prev) =>
                    prev ? { ...prev, status: "completed", completedAt: new Date().toISOString() } : null
                );
                setHistory((prev) => [
                    { ...newExperiment, status: "completed", completedAt: new Date().toISOString(), results: newExperiment.results },
                    ...prev
                ]);
                return;
            }

            const testCase = dataset.cases[currentCaseIndex];

            // Mark case as running
            setActiveExperiment((prev) => {
                if (!prev) return null;
                return {
                    ...prev,
                    results: {
                        ...prev.results,
                        [testCase.id]: {
                            caseId: testCase.id,
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
                { id: "m3", role: "user", content: testCase.script.includes("expensive") ? "That seems really expensive." : "Okay, tell me more.", timestamp: Date.now() + 3000 },
                { id: "m4", role: "assistant", content: "I understand. We do offer a quarterly payment plan to help with cash flow.", timestamp: Date.now() + 4500 },
            ];

            // Stream transcript updates
            for (const msg of mockTranscript) {
                await new Promise(r => setTimeout(r, 800)); // Simulate typing/speaking
                setActiveExperiment((prev) => {
                    if (!prev) return null;
                    const currentResults = prev.results[testCase.id];
                    return {
                        ...prev,
                        results: {
                            ...prev.results,
                            [testCase.id]: {
                                ...currentResults,
                                transcript: [...currentResults.transcript, msg]
                            }
                        }
                    }
                });
            }

            // Evaluate Rubric (Mock Logic)
            const rubricResults: RubricResult[] = testCase.rubric.map(r => ({
                rubricId: r.id,
                passed: Math.random() > 0.3, // Random 70% pass rate
                reason: "Simulated evaluation result"
            }));

            const isPass = rubricResults.every(r => r.passed);

            // Finish Case
            setActiveExperiment((prev) => {
                if (!prev) return null;
                return {
                    ...prev,
                    results: {
                        ...prev.results,
                        [testCase.id]: {
                            ...prev.results[testCase.id],
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
