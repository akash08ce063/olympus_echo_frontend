"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { Zap, CheckCircle2, Plus } from "lucide-react";
import { useRef } from "react";

export function BestOfBothWorlds() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    })
    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
    const y = useTransform(scrollYProgress, [0, 0.3], [50, 0])

    return (
        <section ref={sectionRef} className="pt-24 md:pt-32 pb-20 md:pb-24 bg-background relative overflow-hidden" id="solution">
            {/* Background decoration to match the rest of the landing page */}
            <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] opacity-40 animate-blob" />
                <div className="absolute bottom-[20%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] opacity-40 animate-blob animation-delay-2000" />
                {/* More visible Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:32px_32px]" />
            </div>

            <motion.div 
                style={{ opacity, y }}
                className="container mx-auto max-w-7xl px-6 lg:px-8 relative z-10"
            >
                <div className="flex flex-col items-center text-center mb-16 md:mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight text-foreground flex items-center justify-center flex-wrap gap-x-3 md:gap-x-4 font-heading"
                    >
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Olympus Echo
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 3 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.4, type: "spring" }}
                            whileHover={{ rotate: 0, scale: 1.1 }}
                            className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 md:w-14 md:h-14 rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform duration-300"
                        >
                            <Plus className="w-4 h-4 sm:w-6 sm:h-6 md:w-8 md:h-8 stroke-[4px]" />
                        </motion.span>
                        <motion.span
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                        Human-in-the-loop
                        </motion.span>
                    </motion.h2>

                    <motion.h3
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 tracking-tight text-primary font-heading"
                    >
                        The Best of Both Worlds.
                    </motion.h3>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
                        className="text-lg sm:text-xl text-muted-foreground max-w-3xl leading-relaxed"
                    >
                        We&apos;re the only platform that combines automated testing at scale with
                        expert human verification. Stop choosing between fast and correct.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-stretch max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        whileHover={{ y: -8, transition: { duration: 0.3 } }}
                        className="group relative p-5 md:p-6 bg-card/40 backdrop-blur-xl border border-border/50 rounded-[2rem] hover:border-primary/30 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-primary/5"
                    >
                        <div className="mb-5 md:mb-6 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-transform duration-300">
                            <Zap className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <h3 className="text-lg md:text-xl font-bold mb-3 font-heading">Automated Scale</h3>
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                            Run thousands of concurrent simulated calls via Twilio or WebSockets to stress-test every edge case.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                        whileHover={{ y: -8, transition: { duration: 0.3 } }}
                        className="group relative p-5 md:p-6 bg-card/40 backdrop-blur-xl border border-border/50 rounded-[2rem] hover:border-primary/30 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-primary/5"
                    >
                        <div className="mb-5 md:mb-6 w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-transform duration-300">
                            <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <h3 className="text-lg md:text-xl font-bold mb-3 font-heading">Expert Human Verification</h3>
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                            Catch the nuances that AI might miss with optional human-in-the-loop verification for critical flows.
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
