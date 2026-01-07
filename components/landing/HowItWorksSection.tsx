"use client"

import { motion } from "framer-motion"

const steps = [
    {
        number: "1",
        title: "Create test suites",
        description: "Define scenarios, success criteria, and edge-case variants (caller tone, accents, background noise).",
        color: "bg-emerald-500"
    },
    {
        number: "2",
        title: "Run AI-to-AI calls at scale",
        description: "Automated or scheduled AI-to-AI test runs where a tester Voice AI simulates real users and conversations end-to-end.",
        color: "bg-teal-500"
    },
    {
        number: "3",
        title: "Automated LLM evaluation",
        description: "Explainable LLM agents apply your criteria, flag failures and produce structured evaluation logs.",
        color: "bg-cyan-500"
    },
    {
        number: "4",
        title: "Human verification & remediation",
        description: "Human reviewers verify critical or ambiguous cases and create actionable tickets for your engineers.",
        color: "bg-blue-500"
    }
]

export function HowItWorksSection() {
    return (
        <section className="w-full py-24 bg-muted/20">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-heading">
                        How it works — in 4 steps
                    </h2>
                    <p className="text-muted-foreground md:text-lg max-w-[700px] mx-auto">
                        From test creation to verified evidence — Olympus Echo puts observability and accountability at the core of Voice AI agent QA.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Steps List */}
                    <div className="space-y-8">
                        {steps.map((step, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className="flex gap-6 group"
                            >
                                <div className={`flex-shrink-0 w-12 h-12 rounded-full ${step.color} flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform`}>
                                    {step.number}
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold font-heading">{step.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Visual Placeholder (Right Side) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative rounded-3xl border border-border bg-card/50 backdrop-blur-sm p-4 shadow-2xl aspect-square md:aspect-video lg:aspect-square flex items-center justify-center overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent" />

                        {/* Abstract/Graph Animation Placeholder */}
                        <div className="relative w-full h-full border border-dashed border-border/50 rounded-2xl flex items-center justify-center bg-background/50">
                            <div className="text-center space-y-4 p-8">
                                <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto animate-pulse flex items-center justify-center">
                                    <svg className="w-10 h-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-mono text-muted-foreground">Interactive Call Graph Visualization</p>
                            </div>

                            {/* Animated particles or dots could go here to simulate 'Fast' testing */}
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
