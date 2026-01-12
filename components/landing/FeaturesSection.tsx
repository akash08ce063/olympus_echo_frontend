"use client";

import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import {
    Zap,
    Link2,
    FileSearch,
    PlayCircle,
    Users,
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
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    })
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
    const y = useTransform(scrollYProgress, [0, 0.3], [50, 0])

    return (
        <section ref={sectionRef} className="relative py-24 md:py-32 bg-background overflow-hidden" id="features">
            <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] opacity-40 animate-blob" />
                <div className="absolute bottom-[10%] left-[-5%] w-[300px] h-[300px] bg-blue-500/5 rounded-full blur-[80px] opacity-30 animate-blob animation-delay-2000" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:32px_32px]" />
            </div>

            <motion.div 
                style={{ opacity, y }}
                className="container mx-auto max-w-7xl px-6 lg:px-8 relative z-10"
            >
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-20 md:mb-24"
                >
                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight text-foreground font-heading"
                    >
                        Why teams choose <span 
                            className="font-semibold"
                            style={{
                                backgroundImage: "linear-gradient(135deg, #ffedd5 0%, #fb923c 33%, #ea580c 66%, #7c2d12 100%)",
                                backgroundSize: "200% 200%",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                animation: "shimmer 3s ease-in-out infinite",
                            }}
                        >Olympus Echo?</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : {}}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
                    >
                        Fewer missed edge-cases, faster release cycles, and QA you can trust —
                        whether you&apos;re a platform vendor or enterprise contact center.
                    </motion.p>
                </motion.div>

                {/* Grid with 2 rows Y-direction (desktop), 3 columns X-direction */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                    {features.map((feature, index) => (
                        <motion.div
                            key={feature.title}
                            initial={{ opacity: 0, y: 30 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                            whileHover={{
                                y: -8,
                                transition: { duration: 0.3 }
                            }}
                            className="group relative p-6 md:p-8 rounded-[2.5rem] border transition-all duration-300 backdrop-blur-sm bg-card/40 border-border/50 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
                        >
                            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center mb-6 md:mb-8 transition-all duration-300 group-hover:scale-110 ${
                                feature.highlight 
                                    ? "bg-primary/20 text-primary group-hover:bg-primary group-hover:text-white" 
                                    : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                                }`}>
                                <feature.icon className={`w-6 h-6 md:w-7 md:h-7 ${feature.highlight ? "fill-primary/20 group-hover:fill-white" : ""}`} />
                            </div>
                            <h3 className="text-lg md:text-xl font-bold text-foreground mb-3 md:mb-4 font-heading leading-tight">
                                {feature.title}
                            </h3>
                            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
