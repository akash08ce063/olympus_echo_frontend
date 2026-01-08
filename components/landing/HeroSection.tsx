"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export function HeroSection() {
    return (
        <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-4 md:px-6 py-16">
            {/* Rich Animated Background */}
            <div className="absolute inset-0 w-full h-full bg-background z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] opacity-40 animate-blob" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] opacity-40 animate-blob animation-delay-2000" />
                <div className="absolute top-[40%] left-[20%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[80px] opacity-30 animate-blob animation-delay-4000" />
                {/* Grid Pattern overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            </div>

            <div className="relative z-10 container max-w-6xl mx-auto flex flex-col items-center text-center">

                {/* Main Heading Group */}
                <div className="relative mb-2 w-full">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-5xl md:text-6xl font-bold tracking-tight font-heading leading-[1.1]"
                    >
                        Voice AI Testing That's
                        <span className="block mt-2">
                            Both{" "}
                            {/* Fast Word Wrapper */}
                            <span className="relative inline-block mx-1">
                                <span className="text-primary bg-clip-text ">Fast</span>
                                {/* Anchored Arrow: Fast -> OlympusEcho */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[220px] h-[220px] pointer-events-none hidden md:block">
                                    <svg viewBox="0 0 220 220" className="w-full h-full overflow-visible">
                                        <defs>
                                            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="rgb(var(--primary))" stopOpacity="0" />
                                                <stop offset="100%" stopColor="rgb(var(--primary))" stopOpacity="1" />
                                            </linearGradient>
                                        </defs>

                                        {/* Path: Center Top -> Down -> Left -> Down */}
                                        <motion.path
                                            id="path1"
                                            d="M 110,0 L 110,60 Q 110,80 90,80 L 40,80 Q 20,80 20,105 L 20,150"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            className="text-primary/30"
                                            strokeDasharray="8 8"
                                            strokeLinecap="round"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 1.5, delay: 1.0, ease: "easeInOut" }}
                                        />

                                        {/* Pin Animation */}
                                        <circle r="5" fill="rgb(var(--primary))" className="animate-ping opacity-75">
                                            <animateMotion dur="3s" repeatCount="indefinite" rotate="auto">
                                                <mpath href="#path1" />
                                            </animateMotion>
                                        </circle>
                                        <circle r="4" fill="rgb(var(--primary))">
                                            <animateMotion dur="3s" repeatCount="indefinite" rotate="auto">
                                                <mpath href="#path1" />
                                            </animateMotion>
                                        </circle>

                                        {/* Arrowhead */}
                                        <motion.path
                                            d="M 12,142 L 20,158 L 28,142"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="text-primary"
                                            initial={{ opacity: 0, pathLength: 0 }}
                                            animate={{ opacity: 1, pathLength: 1 }}
                                            transition={{ duration: 0.3, delay: 2.5 }}
                                        />
                                    </svg>

                                    {/* Label positioned relative to the SVG container */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ delay: 2.7, duration: 0.5 }}
                                        className="absolute top-[165px] left-[20px] -translate-x-1/2 w-max"
                                    >
                                        <div className="flex flex-col items-center justify-center bg-background/95 backdrop-blur-xl px-6 py-4 rounded-3xl border-2 border-primary/20 shadow-[0_20px_40px_-15px_rgba(var(--primary),0.25)] whitespace-nowrap">
                                            <span className="text-2xl font-black text-primary leading-none tracking-tight">Olympus Echo</span>
                                            <span className="text-xs font-bold text-muted-foreground/70 uppercase tracking-[0.2em] mt-2 underline decoration-primary/30 underline-offset-4">Testing Framework</span>
                                        </div>
                                    </motion.div>
                                </div>
                            </span>
                            {" "}and{" "}
                            {/* Flawless Word Wrapper */}
                            <span className="relative inline-block mx-1">
                                <span className="text-primary bg-clip-text ">Flawless</span>
                                {/* Anchored Arrow: Flawless -> LLM + Human */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[220px] h-[220px] pointer-events-none hidden md:block">
                                    <svg viewBox="0 0 220 220" className="w-full h-full overflow-visible">
                                        {/* Path: Center Top -> Down -> Right -> Down */}
                                        <motion.path
                                            id="path2"
                                            d="M 110,0 L 110,60 Q 110,80 130,80 L 180,80 Q 200,80 200,105 L 200,150"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            className="text-primary/30"
                                            strokeDasharray="8 8"
                                            strokeLinecap="round"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 1.5, delay: 1.0, ease: "easeInOut" }}
                                        />

                                        {/* Pin Animation */}
                                        <circle r="5" fill="#a855f7" className="animate-ping opacity-75">
                                            <animateMotion dur="3s" repeatCount="indefinite" rotate="auto">
                                                <mpath href="#path2" />
                                            </animateMotion>
                                        </circle>
                                        <circle r="4" fill="#a855f7">
                                            <animateMotion dur="3s" repeatCount="indefinite" rotate="auto">
                                                <mpath href="#path2" />
                                            </animateMotion>
                                        </circle>

                                        {/* Arrowhead */}
                                        <motion.path
                                            d="M 192,142 L 200,158 L 208,142"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="3"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="text-primary"
                                            initial={{ opacity: 0, pathLength: 0 }}
                                            animate={{ opacity: 1, pathLength: 1 }}
                                            transition={{ duration: 0.3, delay: 2.5 }}
                                        />
                                    </svg>

                                    {/* Label positioned relative to the SVG container */}

                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        transition={{ delay: 2.7, duration: 0.5 }}
                                        className="absolute top-[165px] left-[200px] -translate-x-1/2 w-max"
                                    >
                                        <div className="flex flex-col items-center justify-center bg-background/95 backdrop-blur-xl px-6 py-4 rounded-3xl border-2 border-primary/20 shadow-[0_20px_40px_-15px_rgba(var(--primary),0.25)] whitespace-nowrap">
                                            <span className="text-2xl font-black text-primary leading-none tracking-tight">Human-in-the-loop</span>
                                            <span className="text-xs font-bold text-muted-foreground/70 uppercase tracking-[0.2em] mt-2 underline decoration-purple-500/30 underline-offset-4">Nuanced Verification</span>
                                        </div>
                                    </motion.div>
                                </div>
                            </span>
                        </span>
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 3.2 }}
                        className="mt-64 md:mt-80"
                    >
                        <Link href="/login" className="group relative bg-primary text-primary-foreground px-10 py-5 rounded-full font-bold text-xl hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-xl hover:shadow-primary/25">
                            Start Testing free
                        </Link>
                    </motion.div>
                </div>


            </div>


        </section>
    )
}
