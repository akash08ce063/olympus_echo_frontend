"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import { ConicGradientButton } from "./ConicGradientButton"

// Custom Trident Icon
const TridentIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 2v20" />
    <path d="M5 2c0 4 2 6 7 6s7-2 7-6" />
    <path d="M12 8V2" />
  </svg>
)

export function HeroSection() {
    const { scrollYProgress } = useScroll()
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
    const y = useTransform(scrollYProgress, [0, 0.5], [0, -50])

    const orangeGradient = "linear-gradient(135deg, #ffedd5 0%, #fb923c 33%, #ea580c 66%, #7c2d12 100%)"

    return (
        <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center overflow-hidden px-4 md:px-6 py-20 md:py-32">
            <div className="absolute inset-0 w-full h-full bg-background z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] opacity-40 animate-blob" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] opacity-40 animate-blob animation-delay-2000" />
                <div className="absolute top-[40%] left-[20%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[80px] opacity-30 animate-blob animation-delay-4000" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:32px_32px]" />
            </div>

            <motion.div 
                style={{ opacity, y }}
                className="relative z-10 container max-w-6xl mx-auto flex flex-col items-center text-center"
            >
                <div className="relative mb-32 md:mb-48 w-full">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight font-heading leading-[1.1]"
                    >
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                    >
                            Voice AI Testing That&apos;s
                        </motion.span>
                        <span className="block mt-4">
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                            >
                            Both{" "}
                            </motion.span>
                            <span className="relative inline-block mx-2">
                                <motion.span 
                                    className="relative inline-block font-semibold"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6, delay: 0.6 }}
                                >
                                    <span 
                                        className="metallic-gradient"
                                        style={{
                                            backgroundImage: orangeGradient,
                                            backgroundSize: "200% 200%",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                            filter: "blur(0.2px)",
                                            animation: "shimmer 3s ease-in-out infinite",
                                        }}
                                    >
                                        Fast
                                    </span>
                                </motion.span>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[240px] md:w-[280px] h-[220px] md:h-[260px] pointer-events-none hidden md:block">
                                    <svg viewBox="0 0 280 260" className="w-full h-full overflow-visible">
                                        <defs>
                                            <linearGradient id="shimmerGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
                                                <stop offset="0%" stopColor="white" stopOpacity="0.9">
                                                    <animate 
                                                        attributeName="offset" 
                                                        values="0; 1; 0" 
                                                        dur="3s" 
                                                        repeatCount="indefinite" 
                                                        keyTimes="0; 0.5; 1"
                                                        calcMode="spline"
                                                        keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
                                                    />
                                                </stop>
                                                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
                                            </linearGradient>
                                        </defs>

                                        <motion.path
                                            // Path: goes down then further left, then down (increase leftward bend)
                                            d="M 140,0 L 140,50 Q 140,80 70,80 L 30,80 Q 0,80 0,110 L 0,185"
                                            fill="none"
                                            stroke="url(#shimmerGrad1)"
                                            strokeWidth="6"
                                            strokeLinecap="round"
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{ pathLength: 1, opacity: 1 }}
                                            transition={{ duration: 2, delay: 1.2, ease: "easeInOut" }}
                                        />
                                        <path
                                            d="M 140,0 L 140,50 Q 140,80 70,80 L 30,80 Q 0,80 0,110 L 0,185"
                                            fill="none"
                                            stroke="hsl(var(--primary))"
                                            strokeWidth="2"
                                            strokeOpacity="0.15"
                                            strokeDasharray="6 6"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </div>
                            </span>
                            {" "}
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                            >
                                and{" "}
                            </motion.span>
                            <span className="relative inline-block mx-2">
                                <motion.span 
                                    className="relative inline-block font-semibold"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.6, delay: 0.8 }}
                                >
                                    <span 
                                        className="metallic-gradient"
                                        style={{
                                            backgroundImage: orangeGradient,
                                            backgroundSize: "200% 200%",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                            filter: "blur(0.2px)",
                                            animation: "shimmer 3s ease-in-out infinite",
                                        }}
                                    >
                                        Flawless
                                    </span>
                                </motion.span>
                                <div className="absolute top-full left-1/2 -translate-x-1/2 w-[240px] md:w-[280px] h-[220px] md:h-[260px] pointer-events-none hidden md:block">
                                    <svg viewBox="0 0 280 260" className="w-full h-full overflow-visible">
                                        <defs>
                                            <linearGradient id="shimmerGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
                                                <stop offset="0%" stopColor="white" stopOpacity="0.9">
                                                    <animate 
                                                        attributeName="offset" 
                                                        values="0; 1; 0" 
                                                        dur="3s" 
                                                        repeatCount="indefinite" 
                                                        keyTimes="0; 0.5; 1"
                                                        calcMode="spline"
                                                        keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
                                                    />
                                                </stop>
                                                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
                                            </linearGradient>
                                        </defs>

                                        <motion.path
                                            d="M 140,0 L 140,50 Q 140,70 170,70 L 220,70 Q 250,70 250,95 L 250,185"
                                            fill="none"
                                            stroke="url(#shimmerGrad2)"
                                            strokeWidth="6"
                                            strokeLinecap="round"
                                            initial={{ pathLength: 0, opacity: 0 }}
                                            animate={{ pathLength: 1, opacity: 1 }}
                                            transition={{ duration: 2, delay: 1.4, ease: "easeInOut" }}
                                        />
                                        <path
                                            d="M 140,0 L 140,50 Q 140,70 170,70 L 220,70 Q 250,70 250,95 L 250,185"
                                            fill="none"
                                            stroke="hsl(var(--primary))"
                                            strokeWidth="2"
                                            strokeOpacity="0.15"
                                            strokeDasharray="6 6"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </div>
                            </span>
                        </span>
                    </motion.h1>
                </div>

                    <motion.div
                    initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1.0, ease: "easeOut" }}
                    className="w-full max-w-6xl mx-auto"
                >
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-14 lg:gap-20">
                        {/* Olympus Echo Box - smaller */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 3.2 }}
                            className="flex flex-col items-center justify-center bg-background/95 backdrop-blur-xl px-8 py-6 rounded-3xl border border-primary/50 shadow-[0_24px_48px_-12px_rgba(var(--primary),0.18)] min-w-[200px] md:min-w-[220px] lg:min-w-[240px]"
                        >
                            <span className="text-xl md:text-2xl lg:text-3xl font-extrabold text-primary leading-none tracking-tighter">
                                Olympus Echo
                            </span>
                            <span className="text-xs md:text-sm lg:text-base font-semibold text-muted-foreground/80 uppercase tracking-[0.33em] mt-4">
                                Testing Framework
                            </span>
                        </motion.div>

                        {/* Button in the middle - smaller and text one line */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.93 }}
                            animate={{ opacity: 1, scale: 1.06 }}
                            transition={{ duration: 0.8, delay: 3.4 }}
                        >
                            <ConicGradientButton href="/login" size="sm" className="text-base lg:text-lg px-7 py-3 whitespace-nowrap">
                                Get Started
                            </ConicGradientButton>
                        </motion.div>

                        {/* Human-in-the-loop Box - smaller */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 3.6 }}
                            className="flex flex-col items-center justify-center bg-background/95 backdrop-blur-xl px-8 py-6 rounded-3xl border border-primary/50 shadow-[0_24px_48px_-12px_rgba(var(--primary),0.18)] min-w-[200px] md:min-w-[220px] lg:min-w-[240px]"
                        >
                            <span className="text-xl md:text-2xl lg:text-3xl font-extrabold text-primary leading-none tracking-tighter">
                                Human-in-the-loop
                            </span>
                            <span className="text-xs md:text-sm lg:text-base font-semibold text-muted-foreground/80 uppercase tracking-[0.33em] mt-4">
                                Nuanced Verification
                            </span>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    )
}
