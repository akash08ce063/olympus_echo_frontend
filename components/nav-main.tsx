"use client"

import { type Icon } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
  onViewChange,
  currentView,
}: {
  items: {
    title: string
    url?: string
    view?: string
    icon?: Icon
  }[]
  onViewChange?: (view: string) => void
  currentView?: string
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              {item.view ? (
                <SidebarMenuButton
                  tooltip={item.title}
                  onClick={() => onViewChange?.(item.view!)}
                  isActive={currentView === item.view}
                  className={cn(
                    "transition-all duration-200 ease-in-out hover:bg-accent hover:text-accent-foreground",
                    currentView === item.view && "bg-accent text-accent-foreground shadow-sm"
                  )}
                >
                  {item.icon && <item.icon className={cn(
                    "transition-transform duration-200 group-hover:scale-105",
                    currentView === item.view && "text-accent-foreground"
                  )} />}
                  <span className="font-medium">{item.title}</span>
                </SidebarMenuButton>
              ) : (
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  className="transition-all duration-200 ease-in-out hover:bg-accent hover:text-accent-foreground"
                >
                  <a href={item.url}>
                    {item.icon && <item.icon className="transition-transform duration-200 group-hover:scale-105" />}
                    <span className="font-medium">{item.title}</span>
                  </a>
                </SidebarMenuButton>
              )}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
