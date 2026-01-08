"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { useEffect, useState } from "react"

interface ConicGradientButtonProps {
  href: string
  children: React.ReactNode
  className?: string
  size?: "sm" | "md"
}

export function ConicGradientButton({ href, children, className = "", size = "md" }: ConicGradientButtonProps) {
  const [gradientPosition, setGradientPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const interval = setInterval(() => {
      setGradientPosition({
        x: Math.random() * 100,
        y: Math.random() * 100,
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const orangeGradientHero = "linear-gradient(135deg,rgb(255, 145, 0) 0%, #ea580c 33%, #ea580c 66%, #ea580c 100%)"

  // Orange box shadow as a string, mimicking a glow around the button
  const orangeBoxShadow = "0 0 16px 4px rgba(255,145,0,0.05), 0 0 48px 8px rgba(234,88,12,0.15)"

  return (
    <Link href={href} className={`group relative inline-block ${className}`}>
      <motion.div
        className="relative rounded-full overflow-hidden"
        style={{
          boxShadow: orangeBoxShadow,
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      >
        {/* Match Hero Words Gradient for the background */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: orangeGradientHero,
            backgroundSize: "200% 200%",
          }}
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Button content - static white font, refined sizing */}
        <div className={`relative z-10 text-white rounded-full font-black shadow-inner transition-all duration-300 backdrop-blur-[2px] border border-white/20 hover:bg-white/5 ${
          size === "sm" ? "px-7 py-3 text-base tracking-tight" : "px-10 py-5 text-xl tracking-tight"
        }`}>
          {children}
        </div>
      </motion.div>
    </Link>
  )
}
