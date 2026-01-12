"use client"

import Link from "next/link"
import Image from "next/image"

import * as React from "react"
import {
  IconFlask,
  IconChartBar,
  IconDashboard,
  IconHistory,
  IconInnerShadowTop,
  IconNotification,
  IconRobot,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAuth } from "@/hooks/useAuth"

const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Test Suites",
    url: "/test_suites",
    icon: IconFlask,
  },
  {
    title: "Target Agents",
    url: "/target_agents", // Keeping URL for now to avoid breaking existing logic, or I should rename folder later
    icon: IconRobot,
  },
  {
    title: "Tester Agents",
    url: "/user_agents",
    icon: IconUsers,
  },
  {
    title: "Test History",
    url: "/history",
    icon: IconHistory,
  },
  // {
  //   title: "Analytics",
  //   url: "/dashboard/agents",
  //   icon: IconChartBar,
  // },
]

const navSecondary = [
  {
    title: "Notifications",
    url: "/notifications",
    icon: IconNotification,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: IconSettings,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const { state } = useSidebar()
  const isExpanded = state === "expanded"

  return (
    <Sidebar collapsible="icon" className="w-64" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/dashboard" className="flex items-center gap-2.5">
                <div className="size-5 rounded-lg bg-primary/10 flex items-center justify-center overflow-hidden">
                  <Image 
                    src="/olympus.png" 
                    alt="Olympus Echo Logo" 
                    width={20} 
                    height={20} 
                    className="object-contain"
                  />
                </div>
                {isExpanded && (
                  <div className="relative h-5 w-auto">
                    <Image 
                      src="/text.png" 
                      alt="Olympus Echo" 
                      width={100} 
                      height={20} 
                      className="object-contain h-full w-auto"
                    />
                  </div>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        {/* <NavSecondary items={navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user ? {
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          avatar: user.user_metadata?.avatar_url || '',
        } : {
          name: 'Loading...',
          email: '',
          avatar: '',
        }} />
      </SidebarFooter>
    </Sidebar >
  )
}
