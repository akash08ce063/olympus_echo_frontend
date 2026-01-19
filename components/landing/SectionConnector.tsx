"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

export function SectionConnector() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });

    const pathLength = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <div ref={ref} className="relative h-40 w-full flex flex-col items-center justify-center overflow-hidden pointer-events-none">
            {/* dynamic Label: THE PROBLEM */}
            <motion.div
                style={{
                    opacity: useTransform(pathLength, [0, 0.4], [1, 0]),
                    y: useTransform(pathLength, [0, 0.4], [0, -20]),
                    x: -140
                }}
                className="absolute top-1/4 left-1/2 text-[10px] font-bold tracking-[0.3em] text-red-500/60 uppercase"
            >
                THE PROBLEM
            </motion.div>

            <div className="relative h-32 w-full flex justify-center">
                <svg
                    width="100"
                    height="120"
                    viewBox="0 0 100 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="opacity-20 dark:opacity-10"
                >
                    <path
                        d="M50 0V120"
                        stroke="url(#gradient-line)"
                        strokeWidth="2"
                        strokeDasharray="8 8"
                    />
                    <defs>
                        <linearGradient id="gradient-line" x1="50" y1="0" x2="50" y2="120" gradientUnits="userSpaceOnUse">
                            <stop stopColor="hsl(var(--destructive))" />
                            <stop offset="1" stopColor="hsl(var(--primary))" />
                        </linearGradient>
                    </defs>
                </svg>

                <div className="absolute inset-0 flex justify-center">
                    <svg
                        width="100"
                        height="120"
                        viewBox="0 0 100 120"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <motion.path
                            d="M50 0V120"
                            stroke="hsl(var(--primary))"
                            strokeWidth="3"
                            strokeLinecap="round"
                            style={{ pathLength }}
                        />
                        <motion.circle
                            cx="50"
                            cy="0"
                            r="5"
                            fill="hsl(var(--primary))"
                            style={{
                                y: useTransform(pathLength, [0, 1], [0, 120]),
                                opacity: useTransform(pathLength, [0, 0.05], [0, 1])
                            }}
                        />
                        <motion.circle
                            cx="50"
                            cy="0"
                            r="12"
                            stroke="hsl(var(--primary))"
                            strokeWidth="1"
                            fill="transparent"
                            style={{
                                y: useTransform(pathLength, [0, 1], [0, 120]),
                                opacity: useTransform(pathLength, [0, 0.05], [0, 0.5]),
                            }}
                            animate={{ scale: [1, 1.5, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </svg>
                </div>
            </div>

            {/* dynamic Label: THE SOLUTION */}
            <motion.div
                style={{
                    opacity: useTransform(pathLength, [0.6, 1], [0, 1]),
                    y: useTransform(pathLength, [0.6, 1], [20, 0]),
                    x: 140
                }}
                className="absolute bottom-1/4 left-1/2 text-[10px] font-bold tracking-[0.3em] text-primary/60 uppercase"
            >
                THE SOLUTION
            </motion.div>
        </div>
    );
}
