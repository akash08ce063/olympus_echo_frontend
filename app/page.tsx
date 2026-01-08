"use client"

import { useEffect } from 'react'
import Link from 'next/link'
import { Menu, Shield, Globe, Github, Twitter, Linkedin, ExternalLink } from 'lucide-react'
import { motion, useScroll, useSpring } from 'framer-motion'

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { HeroSection } from '@/components/landing/HeroSection'
import { ProblemSection } from '@/components/landing/ProblemSection'
import { SectionConnector } from '@/components/landing/SectionConnector'
import { BestOfBothWorlds } from '@/components/landing/BestOfBothWorlds'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { HowItWorksSection } from '@/components/landing/HowItWorksSection'

// Custom Trident Icon for the logo
const TridentIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 2v20" />
    <path d="M5 2c0 4 2 6 7 6s7-2 7-6" />
    <path d="M12 8V2" />
  </svg>
)

export default function LandingPage() {
  const { scrollYProgress } = useScroll()
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth'
    return () => {
      document.documentElement.style.scrollBehavior = 'auto'
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* More Transparent Navbar with Trident Logo */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="px-4 lg:px-6 h-16 flex items-center border-b border-border/10 backdrop-blur-md fixed w-full z-50 bg-background/20 supports-[backdrop-filter]:bg-background/10"
      >
        <div className="container mx-auto flex items-center justify-between">
          <Link className="flex items-center justify-center gap-2.5 group z-50 relative" href="#">
            <motion.div 
              className="size-9 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shadow-inner"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <TridentIcon className="size-5 text-primary" />
            </motion.div>
            <div className="flex flex-col">
              <motion.span 
                className="font-bold text-xl font-heading tracking-tighter leading-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Olympus Echo
              </motion.span>
              <span className="text-[8px] font-black uppercase tracking-[0.3em] text-primary/60 leading-none mt-1">Testing Framework</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-10 items-center">
            <Link className="text-sm font-semibold hover:text-primary transition-colors tracking-tight" href="/#features">
              Features
            </Link>
            <Link className="text-sm font-semibold hover:text-primary transition-colors tracking-tight" href="/login">
              Login
            </Link>
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
                  <SheetTitle className="flex items-center gap-3">
                    <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center">
                      <TridentIcon className="size-5 text-primary" />
                    </div>
                    <span className="font-heading font-bold">OlympusEcho</span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col p-6 space-y-6">
                  <div className="flex flex-col space-y-4">
                    <SheetClose asChild>
                      <Link
                        href="/#features"
                        className="flex items-center text-lg font-bold py-2 hover:text-primary transition-colors"
                      >
                        Features
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/login"
                        className="flex items-center text-lg font-bold py-2 hover:text-primary transition-colors"
                      >
                        Login
                      </Link>
                    </SheetClose>
                  </div>

                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </motion.header>

      <main className="flex-1 pt-16">
        <HeroSection />
        <ProblemSection />
        <SectionConnector />
        <BestOfBothWorlds />
        <FeaturesSection />
        <HowItWorksSection />
      </main>

      {/* Brandable Footer for Olympus Echo */}
      <footer className="bg-background border-t border-border/50 pt-24 pb-12 overflow-hidden relative">
        <div className="absolute inset-0 w-full h-full pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] rounded-full opacity-50" />
        </div>
        
        <div className="container px-6 mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2">
              <Link className="flex items-center gap-3 group mb-6" href="#">
                <div className="size-10 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shadow-inner">
                  <TridentIcon className="size-6 text-primary" />
                </div>
                <span className="font-bold text-2xl font-heading tracking-tighter">Olympus Echo</span>
              </Link>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-sm mb-8">
                The definitive testing framework for high-stakes Voice AI applications. 
                Move fast without breaking customer trust.
              </p>
              <div className="flex gap-5">
                <Link href="#" className="p-2.5 rounded-xl bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all">
                  <Twitter className="size-5" />
                </Link>
                <Link href="#" className="p-2.5 rounded-xl bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all">
                  <Linkedin className="size-5" />
            </Link>
                <Link href="#" className="p-2.5 rounded-xl bg-muted/50 hover:bg-primary/10 hover:text-primary transition-all">
                  <Github className="size-5" />
            </Link>
              </div>
            </div>

            <div>
              <h4 className="font-black text-xs uppercase tracking-[0.3em] text-foreground mb-8">Platform</h4>
              <ul className="space-y-4">
                <li><Link href="#features" className="text-muted-foreground hover:text-primary transition-colors font-medium">Features</Link></li>
                <li><Link href="#solution" className="text-muted-foreground hover:text-primary transition-colors font-medium">Solutions</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">Integrations</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium flex items-center gap-2">Documentation <ExternalLink className="size-3" /></Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-black text-xs uppercase tracking-[0.3em] text-foreground mb-8">Legal</h4>
              <ul className="space-y-4">
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">Privacy Policy</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">Terms of Service</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">Security</Link></li>
                <li><Link href="#" className="text-muted-foreground hover:text-primary transition-colors font-medium">Status</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-sm text-muted-foreground font-medium">
              © 2026 OlympusEcho Inc. Built for the future of voice.
            </p>
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/5 border border-green-500/10 text-[10px] font-black uppercase tracking-widest text-green-500/80">
              <span className="size-1.5 rounded-full bg-green-500 animate-pulse" />
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
