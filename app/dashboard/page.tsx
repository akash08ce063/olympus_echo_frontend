"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AgentsContent } from "@/components/AgentsContent"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { TestSuitesContent } from "@/components/TestSuitesContent"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import data from "./data.json"

export type DashboardView = "overview" | "test-suites" | "agents" | "history" | "analytics"

export default function Page() {
  const [currentView, setCurrentView] = useState<DashboardView>("overview")

  const renderContent = () => {
    switch (currentView) {
      case "overview":
        return (
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            <div className="px-4 lg:px-6">
              <ChartAreaInteractive />
            </div>
            <DataTable data={data} />
          </div>
        )
      case "test-suites":
        // We'll import and render the test suites component here
        return <TestSuitesContent />
      case "agents":
        return <AgentsContent />
      case "history":
      case "analytics":
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 text-muted-foreground">
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-template">
                <rect width="18" height="7" x="3" y="3" rx="1" />
                <rect width="9" height="7" x="3" y="14" rx="1" />
                <rect width="5" height="7" x="16" y="14" rx="1" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-foreground">Coming Soon</h3>
            <p className="max-w-xs mt-2 text-sm">{currentView.replace("-", " ").toUpperCase()} section is under development.</p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="sidebar" onViewChange={setCurrentView} currentView={currentView} />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {renderContent()}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
