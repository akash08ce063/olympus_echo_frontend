"use client"

import { motion } from "framer-motion"
import { Bot, Cloud, FileText, UserCheck, Play, CheckCircle2 } from "lucide-react"

const features = [
    {
        icon: Bot,
        title: "AI-to-AI conversation simulation",
        description: "Spawn thousands of AI-to-AI conversations where Olympus Echo's tester agent talks directly to your Voice AI agent to uncover logic, prompt, and flow failures before production."
    },
    {
        icon: Cloud,
        title: "Provider-agnostic adapters",
        description: "Works with Twilio, Vonage, custom SIP/WebSocket stacks and in-house voice platforms — plug & play adapters make integration painless."
    },
    {
        icon: FileText,
        title: "LLM-driven Voice AI evaluation engine",
        description: "Automated evaluation agents analyze full AI-to-AI conversations against intent handling, slot filling, compliance, tone, and task completion criteria."
    },
    {
        icon: UserCheck,
        title: "Human-in-the-loop verification",
        description: "Trusted human reviewers augment LLM judgements for high-stakes flows — ensuring production-grade accuracy and compliance."
    },
    {
        icon: Play,
        title: "Evidenced transcripts + recordings",
        description: "Full transcripts, call-recordings, and timestamped evaluation logs provide auditable evidence for QA and compliance audits."
    },
    {
        icon: CheckCircle2,
        title: "Closed-loop fixes",
        description: "Failed tests feed directly into issue trackers or your CI/CD pipeline so engineering teams can reproduce and resolve problems fast."
    }
]

export function FeaturesSection() {
    return (
        <section className="w-full py-24 bg-background">
            <div className="container px-4 md:px-6 mx-auto">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-heading max-w-4xl mx-auto">
                        Why modern Voice AI agent teams choose Olympus Echo
                    </h2>
                    <p className="text-muted-foreground md:text-lg max-w-[800px] mx-auto">
                        Fewer missed edge-cases, faster release cycles, and QA you can trust — whether you're a platform vendor or enterprise contact center.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="group h-full"
                        >
                            <div className="flex flex-col h-full items-start space-y-4 rounded-2xl border border-border/50 p-8 hover:border-primary/30 hover:bg-muted/30 transition-all duration-300">
                                <div className="p-3 bg-primary/5 rounded-xl group-hover:bg-primary/10 transition-colors">
                                    <feature.icon className="w-6 h-6 text-primary" />
                                </div>
                                <h3 className="text-lg font-bold font-heading">{feature.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
