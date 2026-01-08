"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Play, BarChart3, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
    {
        number: 1,
        title: "Create test suites",
        description: "Define scenarios, success criteria, and edge-case variants (caller tone, accents, background noise).",
        icon: Play,
    },
    {
        number: 2,
        title: "Run AI-to-AI calls at scale",
        description: "Automated test runs where a tester Voice AI simulates real users and conversations end-to-end.",
        icon: BarChart3,
    },
    {
        number: 3,
        title: "Automated LLM evaluation",
        description: "Explainable LLM agents apply your criteria, flag failures and produce structured evaluation logs.",
        icon: Check,
    },
    {
        number: 4,
        title: "Human verification",
        description: "Human reviewers verify critical or ambiguous cases and create actionable tickets for your engineers.",
        icon: ShieldCheck,
    },
];

export function HowItWorksSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    return (
        <section ref={sectionRef} className="relative py-18 bg-background overflow-hidden border-t border-border/50">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6 }}
                    >
                        <h2
                            className="text-4xl md:text-5xl font-black mb-8 tracking-tight text-foreground font-heading"
                        >
                            How it works — in <span className="text-primary">4 simple steps</span>
                        </h2>
                        <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                            From test creation to verified evidence — Olympus Echo puts observability and accountability at the core of Voice AI agent QA.
                        </p>

                        <div className="space-y-10">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={step.number}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="group flex gap-6"
                                >
                                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                        {step.number}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold mb-2 text-foreground font-heading">
                                            {step.title}
                                        </h3>
                                        <p className="text-muted-foreground leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8 }}
                        className="relative"
                    >
                        <div className="relative rounded-[3rem] overflow-hidden border border-border bg-card shadow-2xl p-8 md:p-12">
                            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[100px] rounded-full pointer-events-none" />

                            <div className="relative space-y-8">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-primary font-bold uppercase tracking-widest mb-1">Burst Test Run</p>
                                        <h4 className="text-3xl font-black text-foreground">2,400 Concurrent Calls</h4>
                                    </div>
                                    <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-sm font-bold">
                                        <Check className="w-4 h-4" />
                                        82% SCORE
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="h-4 bg-secondary rounded-full overflow-hidden border border-border shadow-inner">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={isInView ? { width: "82%" } : {}}
                                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                                            className="h-full bg-primary"
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs font-bold tracking-wider">
                                        <span className="text-muted-foreground">1,968 SUCCESSFUL</span>
                                        <span className="text-primary uppercase">432 FLAGGED</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { label: "Logic errors", value: "124" },
                                        { label: "Tone mismatch", value: "86" },
                                        { label: "Intent failures", value: "152" },
                                        { label: "Latencies > 1s", value: "73" },
                                    ].map((stat) => (
                                        <div key={stat.label} className="p-5 bg-muted/30 rounded-[1.5rem] border border-border hover:border-primary/20 transition-all duration-300">
                                            <div className="text-3xl font-black text-foreground mb-1">{stat.value}</div>
                                            <div className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em]">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-6 bg-slate-950 rounded-[1.5rem] text-[11px] space-y-3 font-mono border border-border/50 shadow-2xl">
                                    <div className="flex items-center gap-2 text-primary">
                                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(var(--primary),0.8)]" />
                                        <span className="font-bold">SYSTEM: Running automated LLM eval...</span>
                                    </div>
                                    <div className="text-slate-400">&gt; FLAGGED: Intent &quot;Cancel Subscription&quot; not handled in variant &quot;Angry Customer&quot;</div>
                                    <div className="text-slate-400">&gt; ANALYSIS: Agent provided wrong refund policy. Reference ID: ECHO-942</div>
                                    <div className="text-green-400 font-bold">&gt; RESOLUTION: Human reviewer assigned for verification.</div>
                                </div>
                            </div>
                        </div>

                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-6 -right-6 p-5 bg-card border border-primary/20 rounded-2xl shadow-2xl z-20 hidden md:block"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <ShieldCheck className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Verification</div>
                                    <div className="text-lg font-black text-foreground">Verified</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
