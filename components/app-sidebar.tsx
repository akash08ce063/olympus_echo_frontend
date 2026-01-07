"use client"

import Link from "next/link"

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
  // {
  //   title: "Notifications",
  //   url: "/notifications",
  //   icon: IconNotification,
  // },
  {
    title: "Settings",
    url: "/settings",
    icon: IconSettings,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()

  return (
    <Sidebar collapsible="icon" className="w-64" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/dashboard">
                <IconInnerShadowTop className="size-5!" />
                <span className="text-base font-semibold">OlympusEcho</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
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
