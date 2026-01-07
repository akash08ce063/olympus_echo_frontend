"use client"

import { motion } from "framer-motion"

export function HeroSection() {
    return (
        <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-4 md:px-6 py-20">
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
                <div className="relative mb-24 md:mb-32 w-full">
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
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Fast</span>
                                {/* Anchored Arrow: Fast -> OlympusEcho */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[180px] h-[140px] pointer-events-none hidden md:block">
                                    <svg viewBox="0 0 180 140" className="w-full h-full overflow-visible">
                                        <defs>
                                            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="rgb(var(--primary))" stopOpacity="0" />
                                                <stop offset="100%" stopColor="rgb(var(--primary))" stopOpacity="1" />
                                            </linearGradient>
                                        </defs>

                                        {/* Path: Center Top -> Down -> Left -> Down */}
                                        <motion.path
                                            id="path1"
                                            d="M 90,0 L 90,40 Q 90,55 75,55 L 45,55 Q 30,55 30,70 L 30,95"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            className="text-primary/40"
                                            strokeDasharray="6 6"
                                            strokeLinecap="round"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 1.5, delay: 1.0, ease: "easeInOut" }}
                                        />

                                        {/* Pin Animation */}
                                        <circle r="4" fill="rgb(var(--primary))" className="animate-ping opacity-75">
                                            <animateMotion dur="3s" repeatCount="indefinite" rotate="auto">
                                                <mpath href="#path1" />
                                            </animateMotion>
                                        </circle>
                                        <circle r="3" fill="rgb(var(--primary))">
                                            <animateMotion dur="3s" repeatCount="indefinite" rotate="auto">
                                                <mpath href="#path1" />
                                            </animateMotion>
                                        </circle>

                                        {/* Arrowhead */}
                                        <motion.path
                                            d="M 22,88 L 30,103 L 38,88"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="text-primary"
                                            initial={{ opacity: 0, pathLength: 0 }}
                                            animate={{ opacity: 1, pathLength: 1 }}
                                            transition={{ duration: 0.3, delay: 2.5 }}
                                        />

                                        {/* Label */}
                                        <motion.foreignObject x="-50" y="108" width="160" height="50"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 2.7 }}
                                        >
                                            <div className="text-base font-bold text-primary text-center bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-primary/20 shadow-xl whitespace-nowrap">
                                                OlympusEcho
                                            </div>
                                        </motion.foreignObject>
                                    </svg>
                                </div>
                            </span>
                            {" "}and{" "}
                            {/* Flawless Word Wrapper */}
                            <span className="relative inline-block mx-1">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500">Flawless</span>
                                {/* Anchored Arrow: Flawless -> LLM + Human */}
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[180px] h-[140px] pointer-events-none hidden md:block">
                                    <svg viewBox="0 0 180 140" className="w-full h-full overflow-visible">
                                        {/* Path: Center Top -> Down -> Right -> Down */}
                                        <motion.path
                                            id="path2"
                                            d="M 90,0 L 90,40 Q 90,55 105,55 L 135,55 Q 150,55 150,70 L 150,95"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            className="text-purple-500/40"
                                            strokeDasharray="6 6"
                                            strokeLinecap="round"
                                            initial={{ pathLength: 0 }}
                                            animate={{ pathLength: 1 }}
                                            transition={{ duration: 1.5, delay: 1.0, ease: "easeInOut" }}
                                        />

                                        {/* Pin Animation */}
                                        <circle r="4" fill="#a855f7" className="animate-ping opacity-75">
                                            <animateMotion dur="3s" repeatCount="indefinite" rotate="auto">
                                                <mpath href="#path2" />
                                            </animateMotion>
                                        </circle>
                                        <circle r="3" fill="#a855f7">
                                            <animateMotion dur="3s" repeatCount="indefinite" rotate="auto">
                                                <mpath href="#path2" />
                                            </animateMotion>
                                        </circle>

                                        {/* Arrowhead */}
                                        <motion.path
                                            d="M 142,88 L 150,103 L 158,88"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="text-purple-500"
                                            initial={{ opacity: 0, pathLength: 0 }}
                                            animate={{ opacity: 1, pathLength: 1 }}
                                            transition={{ duration: 0.3, delay: 2.5 }}
                                        />

                                        {/* Label */}
                                        <motion.foreignObject x="70" y="108" width="160" height="50"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 2.7 }}
                                        >
                                            <div className="text-base font-bold text-purple-600 text-center bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-purple-500/20 shadow-xl whitespace-nowrap">
                                                LLM + Human
                                            </div>
                                        </motion.foreignObject>
                                    </svg>
                                </div>
                            </span>
                        </span>
                    </motion.h1>
                </div>

                {/* Description - separated by H1's margin but also has own margin for safety */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 2.8 }}
                    className="max-w-3xl text-lg md:text-xl text-muted-foreground leading-relaxed relative z-20"
                >
                    <span className="font-semibold text-foreground">Olympus Echo</span> is a comprehensive Voice AI testing platform built for production. Define test cases and evaluation criteria, then run thousands of concurrent simulated calls via Twilio or WebSockets. Our AI agents talk to your voice AI like real customers and measure correctness, latency, and business logic adherence. Get clear, explainable results with full transcripts and call recordings.
                </motion.p>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.5, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-muted-foreground/50 animate-bounce"
            >
                <span className="text-xs uppercase tracking-widest">Scroll</span>
                <div className="w-px h-12 bg-gradient-to-b from-transparent via-current to-transparent" />
            </motion.div>
        </section>
    )
}
