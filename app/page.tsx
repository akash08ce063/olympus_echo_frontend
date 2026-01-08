
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Mic, Play, Shield, Zap, Menu } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { HeroSection } from '@/components/landing/HeroSection'
import { ProblemSection } from '@/components/landing/ProblemSection'
import { SectionConnector } from '@/components/landing/SectionConnector'
import { BestOfBothWorlds } from '@/components/landing/BestOfBothWorlds'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-border/40 backdrop-blur-md fixed w-full z-50 bg-background/80 supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex items-center justify-between">
          <Link className="flex items-center justify-center gap-2 group z-50 relative" href="#">
            <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Mic className="size-5 text-primary" />
            </div>
            <span className="font-bold text-xl font-heading tracking-tight sm:inline hidden">OlympusEcho</span>
            <span className="font-bold text-xl font-heading tracking-tight sm:hidden inline">OE</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-8 items-center">
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="/#features">
              Features
            </Link>

            <Link className="text-sm font-medium hover:text-primary transition-colors" href="/login">
              Login
            </Link>
            <Button asChild className="shadow-lg shadow-primary/20 hover:shadow-primary/40 px-6">
              <Link href="/signup">
                Get Started
              </Link>
            </Button>
            <ModeToggle />
          </nav>

          {/* Mobile Navigation */}
          <div className="flex items-center gap-4 md:hidden">
            <ModeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="shrink-0 text-foreground">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80vw] sm:w-[350px] p-0 border-l border-border/50">
                <SheetHeader className="p-6 border-b border-border/50 text-left">
                  <SheetTitle className="flex items-center gap-2">
                    <div className="size-8 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Mic className="size-5 text-primary" />
                    </div>
                    <span>OlympusEcho</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col p-6 space-y-6">
                  <div className="flex flex-col space-y-4">
                    <SheetClose asChild>
                      <Link
                        href="/#features"
                        className="flex items-center text-base font-medium py-2 hover:text-primary transition-colors"
                      >
                        Features
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/login"
                        className="flex items-center text-base font-medium py-2 hover:text-primary transition-colors"
                      >
                        Login
                      </Link>
                    </SheetClose>
                  </div>

                  <div className="pt-6 border-t border-border/50">
                    <SheetClose asChild>
                      <Link href="/signup" className="w-full">
                        <Button className="w-full h-11 shadow-lg shadow-primary/20">
                          Get Started
                        </Button>
                      </Link>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-16">
        <HeroSection />
        <ProblemSection />
        <SectionConnector />
        <BestOfBothWorlds />
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
