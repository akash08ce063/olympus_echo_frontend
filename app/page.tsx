
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Mic, Play, Shield, Zap } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { HeroSection } from '@/components/landing/HeroSection'
import { ProblemSection } from '@/components/landing/ProblemSection'
import { SolutionSection } from '@/components/landing/SolutionSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-border/40 backdrop-blur-md fixed w-full z-50 bg-background/80 supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex items-center justify-between">
          <Link className="flex items-center justify-center gap-2 group" href="#">
            <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Mic className="size-5 text-primary" />
            </div>
            <span className="font-bold text-xl font-heading tracking-tight">OlympusEcho</span>
          </Link>
          <nav className="flex gap-4 sm:gap-8 items-center">
            <Link className="text-sm font-medium hover:text-primary transition-colors hidden sm:block" href="#">
              Features
            </Link>
            <Link className="text-sm font-medium hover:text-primary transition-colors hidden sm:block" href="#">
              Pricing
            </Link>
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="/login">
              Login
            </Link>
            <Link
              className="text-sm font-medium px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              href="/signup"
            >
              Get Started
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </header>

      <main className="flex-1 pt-16">
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <HowItWorksSection />
      </main>

      <footer className="py-8 w-full shrink-0 border-t bg-muted/20">
        <div className="container px-4 md:px-6 mx-auto flex flex-col sm:flex-row gap-4 items-center justify-between">
          <p className="text-xs text-muted-foreground">© 2026 OlympusEcho Inc. All rights reserved.</p>
          <nav className="flex gap-4 sm:gap-6">
            <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground hover:text-foreground" href="#">
              Terms of Service
            </Link>
            <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground hover:text-foreground" href="#">
              Privacy
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
