"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
    Zap,
    Link2,
    FileSearch,
    Users,
    PlayCircle,
    CheckCircle,
} from "lucide-react";

const features = [
    {
        icon: Zap,
        title: "AI-to-AI conversation simulation",
        description: "Spawn thousands of AI-to-AI conversations where Olympus Echo's tester agent talks directly to your Voice AI agent to uncover logic, prompt, and flow failures before production.",
    },
    {
        icon: Link2,
        title: "Provider-agnostic adapters",
        description: "Works with Twilio, Vonage, custom SIP/WebSocket stacks and in-house voice platforms — plug & play adapters make integration painless.",
    },
    {
        icon: FileSearch,
        title: "LLM-driven Voice AI evaluation engine",
        description: "Automated evaluation agents analyze full AI-to-AI conversations against intent handling, slot filling, compliance, tone, and task completion criteria.",
    },
    {
        icon: PlayCircle,
        title: "Evidenced transcripts + recordings",
        description: "Full transcripts, call-recordings, and timestamped evaluation logs provide auditable evidence for QA and compliance audits.",
    },
    {
        icon: Users,
        title: "Human-in-the-loop verification",
        description: "Trusted human reviewers augment LLM judgements for high-stakes flows — ensuring production-grade accuracy and compliance.",
        highlight: true,
    },
    {
        icon: CheckCircle,
        title: "Closed-loop fixes",
        description: "Failed tests feed directly into issue trackers or your CI/CD pipeline so engineering teams can reproduce and resolve problems fast.",
    },
];

export function FeaturesSection() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    return (
        <section ref={sectionRef} className="relative py-18 bg-background overflow-hidden" id="features">
            {/* Background decorative elements */}
            <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] opacity-40" />
            </div>

            <div className="container mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-20"
                >
                    <h2
                        className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-foreground font-heading"
                    >
                        Why teams choose <span className="text-primary font-bold">Olympus Echo?</span>
                    </h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        Fewer missed edge-cases, faster release cycles, and QA you can trust —
                        whether you&apos;re a platform vendor or enterprise contact center.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{
                                y: -8,
                                transition: { duration: 0.3 }
                            }}
                            className={`group relative p-8 rounded-[2.5rem] border transition-all duration-300 backdrop-blur-sm ${feature.highlight
                                ? "bg-primary/[0.03] border-primary/30 ring-1 ring-primary/10 shadow-2xl shadow-primary/5 dark:bg-primary/[0.05]"
                                : "bg-card/40 border-border/50 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5"
                                }`}
                        >
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all duration-300 group-hover:scale-110 ${feature.highlight ? "bg-primary/20" : "bg-primary/10 group-hover:bg-primary/20"
                                }`}>
                                <feature.icon className={`w-7 h-7 ${feature.highlight ? "text-primary fill-primary/20" : "text-primary"}`} />
                            </div>
                            <h3
                                className="text-xl font-bold text-foreground mb-4 font-heading"
                            >
                                {feature.title}
                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
