"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Check, Play, BarChart3, ShieldCheck } from "lucide-react";

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
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    })
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
    const y = useTransform(scrollYProgress, [0, 0.2], [100, 0])

    return (
        <section ref={sectionRef} className="relative py-20 md:py-28 bg-background overflow-hidden border-t border-border/50">
            {/* Background grid for How It Works */}
            <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:48px_48px]" />
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-background via-transparent to-background" />
            </div>

            <motion.div 
                style={{ opacity, y }}
                className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10"
            >
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.3fr] gap-12 lg:gap-16 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 1, ease: "easeOut" }}
                    >
                        <motion.h2
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 md:mb-8 tracking-tight text-foreground font-heading leading-tight"
                        >
                            How it works — in <br/><span 
                                className="font-semibold"
                                style={{
                                    backgroundImage: "linear-gradient(135deg, #ffedd5 0%, #fb923c 33%, #ea580c 66%, #7c2d12 100%)",
                                    backgroundSize: "200% 200%",
                                    WebkitBackgroundClip: "text",
                                    WebkitTextFillColor: "transparent",
                                    animation: "shimmer 3s ease-in-out infinite",
                                }}
                            >4 simple steps</span>
                        </motion.h2>
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={isInView ? { opacity: 1 } : {}}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-base md:text-lg text-muted-foreground mb-10 md:mb-12 leading-relaxed max-w-xl font-medium"
                        >
                            From test creation to verified evidence — Olympus Echo puts observability and accountability at the core of Voice AI agent QA.
                        </motion.p>

                        <div className="space-y-8 md:space-y-10">
                            {steps.map((step, index) => (
                                <motion.div
                                    key={step.number}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.7, delay: index * 0.2, ease: "easeOut" }}
                                    className="group flex gap-5 md:gap-6"
                                >
                                    <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary text-xl md:text-2xl font-black group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500 shadow-sm border border-primary/20">
                                        {step.number}
                                    </div>
                                    <div className="pt-1">
                                        <h3 className="text-xl md:text-2xl font-bold mb-2 text-foreground font-heading tracking-tight">
                                            {step.title}
                                        </h3>
                                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-md">
                                            {step.description}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="relative"
                    >
                        <div className="relative rounded-3xl overflow-hidden border border-border bg-card shadow-[0_80px_150px_-20px_rgba(0,0,0,0.4)] p-6 md:p-8 lg:p-10">
                            <div className="absolute top-0 right-0 w-full h-full bg-primary/[0.03] pointer-events-none" />

                            <div className="relative space-y-8 md:space-y-10">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                    <div>
                                        <p className="text-xs text-primary font-bold uppercase tracking-[0.4em] mb-2">Burst Test Run</p>
                                        <h4 className="text-2xl md:text-3xl lg:text-4xl font-black text-foreground tracking-tighter leading-none">2,400 Concurrent Calls</h4>
                                    </div>
                                    <div className="flex items-center gap-3 px-5 py-2 bg-green-500/10 text-green-500 border border-green-500/20 rounded-full text-sm md:text-base font-black shadow-inner">
                                        <Check className="w-4 h-4 md:w-5 md:h-5 stroke-[4px]" />
                                        82% SCORE
                                    </div>
                                </div>

                                <div className="space-y-4 md:space-y-5">
                                    <div className="h-4 md:h-5 bg-secondary rounded-full overflow-hidden border border-border/50 shadow-inner">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={isInView ? { width: "82%" } : {}}
                                            transition={{ duration: 2, ease: "easeOut", delay: 0.8 }}
                                            className="h-full bg-primary shadow-[0_0_30px_rgba(var(--primary),0.5)]"
                                        />
                                    </div>
                                    <div className="flex justify-between text-[11px] md:text-xs font-black tracking-[0.3em]">
                                        <span className="text-muted-foreground/50">1,968 SUCCESSFUL</span>
                                        <span className="text-primary">432 FLAGGED</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 md:gap-5">
                                    {[
                                        { label: "Logic errors", value: "124" },
                                        { label: "Tone mismatch", value: "86" },
                                        { label: "Intent failures", value: "152" },
                                        { label: "Latencies > 1s", value: "73" },
                                    ].map((stat) => (
                                        <div key={stat.label} className="p-5 md:p-6 bg-muted/20 rounded-2xl border border-border/50 hover:border-primary/40 transition-all duration-500 group shadow-sm hover:shadow-xl">
                                            <div className="text-3xl md:text-4xl font-black text-foreground mb-2 group-hover:text-primary transition-colors tracking-tighter">{stat.value}</div>
                                            <div className="text-[10px] md:text-[11px] text-muted-foreground uppercase font-black tracking-[0.2em]">{stat.label}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-5 md:p-6 bg-slate-950 rounded-2xl text-[11px] md:text-xs space-y-3 md:space-y-4 font-mono border border-white/5 shadow-2xl overflow-hidden relative group">
                                    <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/60 group-hover:bg-primary transition-colors" />
                                    <div className="flex items-center gap-3 text-primary">
                                        <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_15px_rgba(var(--primary),1)]" />
                                        <span className="font-black tracking-[0.2em]">SYSTEM: Running automated LLM eval...</span>
                                    </div>
                                    <div className="text-slate-400 pl-5 border-l border-white/10">&gt; FLAGGED: Intent &quot;Cancel Subscription&quot; not handled in variant &quot;Angry Customer&quot;</div>
                                    <div className="text-slate-400 pl-5 border-l border-white/10">&gt; ANALYSIS: Agent provided wrong refund policy. Reference ID: ECHO-942</div>
                                    <div className="text-green-400 font-bold pl-5 border-l border-white/10">&gt; RESOLUTION: Human reviewer assigned for verification.</div>
                                </div>
                            </div>
                        </div>

                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-8 -right-8 md:-top-10 md:-right-10 p-5 md:p-6 bg-card border border-primary/20 rounded-2xl shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] z-20 hidden md:block backdrop-blur-2xl"
                        >
                            <div className="flex items-center gap-4 md:gap-5">
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-primary/10 flex items-center justify-center shadow-inner border border-primary/20">
                                    <ShieldCheck className="w-6 h-6 md:w-7 md:h-7 text-primary" />
                                </div>
                                <div>
                                    <div className="text-[10px] md:text-xs text-muted-foreground font-black uppercase tracking-[0.3em] mb-1">Verification</div>
                                    <div className="text-xl md:text-2xl font-black text-foreground tracking-tight">Verified</div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
