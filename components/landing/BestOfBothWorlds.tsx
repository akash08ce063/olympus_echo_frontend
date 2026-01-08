"use client";

import { motion, useInView } from "framer-motion";
import { Zap, CheckCircle2, Plus } from "lucide-react";
import { useRef } from "react";

export function BestOfBothWorlds() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    return (
        <section ref={sectionRef} className="pt-12 pb-12 bg-background relative overflow-hidden" id="solution">
            {/* Background decoration to match the rest of the landing page */}
            <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] opacity-40" />
                <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] opacity-40" />
            </div>

            <div className="container mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                <div className="flex flex-col items-center text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-6xl font-bold mb-4 tracking-tight text-foreground flex items-center justify-center flex-wrap gap-x-4 font-heading"
                    >
                        Olympus Echo
                        <span className="flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 rotate-3 hover:rotate-0 transition-transform duration-300">
                            <Plus className="w-6 h-6 md:w-8 md:h-8 stroke-[4px]" />
                        </span>
                        Human-in-the-loop
                    </motion.h2>

                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-4xl font-bold mb-4 tracking-tight text-primary font-heading"
                    >
                        The Best of Both Worlds.
                    </motion.h3>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-xl text-muted-foreground max-w-3xl leading-relaxed"
                    >
                        We&apos;re the only platform that combines automated testing at scale with
                        expert human verification. Stop choosing between fast and correct.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-stretch">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8 }}
                        className="group relative p-8 md:p-12 bg-card/40 backdrop-blur-xl border border-border/50 rounded-[2.5rem] hover:border-primary/30 transition-all duration-500 shadow-sm"
                    >
                        <div className="mb-6 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                            <Zap className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 font-heading">Automated Scale</h3>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                            Run thousands of concurrent simulated calls via Twilio or WebSockets to stress-test every edge case.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8 }}
                        className="group relative p-8 md:p-12 bg-card/40 backdrop-blur-xl border border-border/50 rounded-[2.5rem] hover:border-primary/30 transition-all duration-500 shadow-sm"
                    >
                        <div className="mb-6 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                            <CheckCircle2 className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 font-heading">Expert Human Verification</h3>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                            Catch the nuances that AI might miss with optional human-in-the-loop verification for critical flows.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
