"use client"

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TestProvider } from "@/context/TestContext"
import { NotificationProvider } from "@/context/NotificationContext"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect, Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

// Skeleton layout matching the app structure
function AppSkeleton() {
  return (
    <div className="flex h-screen w-full">
      {/* Sidebar skeleton */}
      <div className="w-64 border-r border-border/50 bg-card/20 p-4 space-y-4">
        <Skeleton className="h-8 w-32" />
        <div className="space-y-2 mt-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </div>

      </div>
      {/* Main content skeleton */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="h-16 border-b border-border/50 flex items-center px-4 bg-background/95">
          <Skeleton className="h-8 w-8" />
        </div>
        <div className="flex-1 p-6 space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
          <div className="grid grid-cols-3 gap-4 mt-8">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-64 w-full mt-4" />
        </div>
      </main>
    </div>
  )
}

function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return <AppSkeleton />
  }

  if (!user) {
    return null
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="h-14 border-b border-border/50 flex items-center px-4 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <SidebarTrigger className="-ml-1" />
          </div>
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <NotificationProvider>
      <TestProvider>
        <Suspense fallback={<AppSkeleton />}>
          <AppLayoutContent>{children}</AppLayoutContent>
        </Suspense>
      </TestProvider>
    </NotificationProvider>
  )
}
