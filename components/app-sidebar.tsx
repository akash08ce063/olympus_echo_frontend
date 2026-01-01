"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"

import { NavDocuments } from "@/components/nav-documents"
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

const data = {
  user: {
    name: "Admin User",
    email: "admin@olympusecho.ai",
    avatar: "",
  },
  navMain: [
    {
      title: "Overview",
      view: "overview",
      icon: IconDashboard,
    },
    {
      title: "Testing Suites",
      view: "test-suites",
      icon: IconCamera,
    },
    {
      title: "Agents",
      view: "agents",
      icon: IconFileAi,
    },
    {
      title: "Test Run History",
      view: "history",
      icon: IconListDetails,
    },
    {
      title: "Analytics",
      view: "analytics",
      icon: IconChartBar,
    },
  ],
  navClouds: [], // Removed as requested to focus on these tabs
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Documentation",
      url: "#",
      icon: IconFileDescription,
    },
  ],
  documents: [], // Removed unused documents section for now or can repurpose
}

export function AppSidebar({ onViewChange, currentView, ...props }: React.ComponentProps<typeof Sidebar> & { onViewChange?: (view: string) => void; currentView?: string }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">OlympusEcho</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} onViewChange={onViewChange} currentView={currentView} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar >
  )
}
