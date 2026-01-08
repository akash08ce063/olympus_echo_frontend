"use client"

import { AlertTriangle, XCircle, Zap } from "lucide-react"
import { motion } from "framer-motion"

const problems = [
    {
        icon: <XCircle className="w-6 h-6" />,
        title: "Manual Testing Hell",
        description: "Your team wastes hours making test calls, taking notes, and trying to reproduce edge cases. It's slow, expensive, and doesn't scale.",
    },
    {
        icon: <Zap className="w-6 h-6" />,
        title: "Blind Automation",
        description: "LLM evaluations miss nuances, hallucinate results, and give you false confidence. You can't trust them for production releases.",

    },
    {
        icon: <XCircle className="w-6 h-6" />,
        title: "Production Failures",
        description: "Bugs in production destroy customer trust and cost real money. One bad conversation can mean lost revenue and damaged reputation.",
    }
]

export function ProblemSection() {
    return (
        <section className="w-full pt-18 pb-12 bg-background relative overflow-hidden">
            {/* Background elements to match HeroSection style */}
            <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] right-[-5%] w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[100px] opacity-50" />
                <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[80px] opacity-40" />
                {/* Grid Pattern overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.1)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.1)_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_20%,transparent_100%)]" />
            </div>

            <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                <div className="flex flex-col items-center text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 text-red-500 text-xs font-bold tracking-[0.2em] mb-8 border border-red-500/20 shadow-sm"
                    >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        THE PROBLEM
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-4xl md:text-6xl font-medium font-heading mb-8 tracking-tight text-foreground"
                    >
                        Why Voice AI Testing Is <span className="relative inline-block">
                            <span className="relative z-10 font-bold text-red-500 italic">Broken?</span>
                            <motion.span
                                initial={{ width: 0 }}
                                whileInView={{ width: "100%" }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="absolute bottom-2 left-0 h-3 bg-red-500/10 -z-1"
                            />
                        </span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-xl text-muted-foreground max-w-3xl font-medium leading-relaxed"
                    >
                        Scaling voice agents to production without rigorous testing is a recipe for disaster.
                        Traditional methods just don&apos;t cut it anymore.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 items-stretch">
                    {problems.map((problem, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, delay: index * 0.15 }}
                            whileHover={{ y: -5 }}
                            className="group relative p-8 bg-card/50 backdrop-blur-sm border border-border/50 rounded-[2.5rem] hover:border-red-500/30 transition-all duration-500 shadow-sm hover:shadow-[0_20px_60px_-20px_rgba(239,68,68,0.15)] flex flex-col"
                        >
                            <div className="mb-8 w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 group-hover:bg-red-500 group-hover:text-white transition-all duration-500 shadow-inner">
                                {problem.icon}
                            </div>
                            <h3 className="text-2xl font-bold font-heading mb-4 text-foreground tracking-tight">{problem.title}</h3>
                            <p className="text-muted-foreground leading-relaxed font-medium mb-8">
                                {problem.description}
                            </p>

                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
