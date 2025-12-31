
import Link from "next/link"
import { ArrowRight, CheckCircle2, Mic, Play, Shield, Zap } from 'lucide-react'

import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-border/40 backdrop-blur-sm fixed w-full z-50 bg-background/80">
        <Link className="flex items-center justify-center gap-2" href="#">
          <div className="size-8 rounded-full bg-primary flex items-center justify-center">
            <Mic className="size-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl font-heading tracking-tight">OlympusEcho</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#">
            Pricing
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#">
            About
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="/login">
            Login
          </Link>
        </nav>
      </header>
      <main className="flex-1 pt-16">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 px-4 md:px-6">
          <div className="container mx-auto flex flex-col items-center text-center space-y-4">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20">
              New Feature: Multi-Agent Testing
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none font-heading max-w-3xl mx-auto">
              Test Voice AI Agents at <span className="text-primary">Superhuman Speed</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Automated testing, evaluation, and monitoring for voice agents. Ensure reliability and performance before deploying to production.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 min-[400px]:gap-6 mt-8">
              <Button size="lg" className="h-12 px-8 text-base" asChild>
                <Link href="/signup">
                  Get Started <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-12 px-8 text-base">
                <Play className="mr-2 size-4" /> Watch Demo
              </Button>
            </div>

            {/* Visual Element / Hero Image Placeholder */}
            <div className="mt-16 w-full max-w-5xl rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden aspect-video relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-muted-foreground animate-pulse">Dashboard Preview Integration</div>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/40">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm text-primary font-medium">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-heading">
                  Everything you need to scale Voice AI
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Comprehensive tools to validate conversation quality, latency, and correctness.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
              <div className="flex flex-col items-start space-y-4 rounded-lg border p-6 bg-card">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Zap className="size-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Latency Testing</h3>
                <p className="text-muted-foreground">
                  Measure time-to-first-byte and end-of-turn latency with millisecond precision.
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4 rounded-lg border p-6 bg-card">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shield className="size-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Robustness Check</h3>
                <p className="text-muted-foreground">
                  Simulate background noise, interruptions, and network jitter to ensure stability.
                </p>
              </div>
              <div className="flex flex-col items-start space-y-4 rounded-lg border p-6 bg-card">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CheckCircle2 className="size-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Accuracy Evaluation</h3>
                <p className="text-muted-foreground">
                  Compare transcripts against ground truth using LLM-based evaluation metrics.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t font-medium">
        <p className="text-xs text-muted-foreground">© 2024 OlympusEcho Inc. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground hover:text-foreground" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-muted-foreground hover:text-foreground" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
