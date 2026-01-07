"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const problems = [
    {
        emoji: "😤",
        title: "Manual Testing Hell",
        description: "Your team wastes hours making test calls, taking notes, and trying to reproduce edge cases. It's slow, expensive, and doesn't scale.",
        gradient: "from-red-500/10 to-orange-500/10",
        border: "hover:border-red-500/50"
    },
    {
        emoji: "🤖",
        title: "Blind Automation",
        description: "LLM evaluations miss nuances, hallucinate results, and give you false confidence. You can't trust them for production releases.",
        gradient: "from-blue-500/10 to-purple-500/10",
        border: "hover:border-blue-500/50"
    },
    {
        emoji: "💸",
        title: "Production Failures",
        description: "Bugs in production destroy customer trust and cost real money. One bad conversation can mean lost revenue and damaged reputation.",
        gradient: "from-yellow-500/10 to-red-500/10",
        border: "hover:border-yellow-500/50"
    }
]

export function ProblemSection() {
    return (
        <section className="w-full py-20 bg-muted/40 relative overflow-hidden">
            <div className="container px-4 md:px-6 mx-auto relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-heading">
                        Voice AI Testing Is Broken
                    </h2>
                    <p className="text-muted-foreground md:text-lg max-w-[600px] mx-auto">
                        Manual testing doesn't scale. Pure automation misses critical issues. Your production voice agents deserve better.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {problems.map((problem, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.2 }}
                            whileHover={{ y: -5 }}
                        >
                            <Card className={`h-full bg-card/50 backdrop-blur-sm border-border/50 transition-all duration-300 ${problem.border} overflow-hidden group`}>
                                <div className={`absolute inset-0 bg-gradient-to-br ${problem.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                <CardHeader className="relative z-10 flex flex-col items-center text-center pb-2">
                                    <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                        {problem.emoji}
                                    </div>
                                    <CardTitle className="text-xl font-bold">{problem.title}</CardTitle>
                                </CardHeader>
                                <CardContent className="relative z-10 text-center text-muted-foreground leading-relaxed">
                                    {problem.description}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
