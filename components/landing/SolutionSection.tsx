"use client"

import { motion } from "framer-motion"
import { Zap } from "lucide-react"

export function SolutionSection() {
    return (
        <section className="w-full py-24 relative overflow-hidden flex items-center justify-center">
            {/* Dark background with central glow */}
            <div className="absolute inset-0 bg-[#0A0A0A] z-0">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-30" />
            </div>

            <div className="container relative z-10 px-4 md:px-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto rounded-3xl border border-primary/20 bg-card/10 backdrop-blur-xl p-8 md:p-12 lg:p-16 text-center space-y-8 shadow-2xl shadow-primary/10"
                >
                    <div className="inline-flex p-4 rounded-2xl bg-primary/20 mb-4 shadow-lg shadow-primary/20">
                        <Zap className="w-8 h-8 md:w-12 md:h-12 text-primary fill-current" />
                    </div>

                    <h2 className="text-3xl md:text-5xl font-bold font-heading bg-gradient-to-r from-white via-primary/50 to-white bg-clip-text text-transparent">
                        The Best of Both Worlds
                    </h2>

                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                        We're the only platform that combines <strong className="text-foreground">automated testing at scale</strong> with <strong className="text-foreground">expert human verification</strong>.
                        Get the speed and coverage of automation with the accuracy and reliability of human intelligence. Stop choosing between fast and correct—get both.
                    </p>
                </motion.div>
            </div>
        </section>
    )
}
