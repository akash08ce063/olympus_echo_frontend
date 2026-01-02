"use client"

import Link from "next/link"
import * as React from "react"
import { type Icon } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { useNotifications } from "@/context/NotificationContext"
import { cn } from "@/lib/utils"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: Icon
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { unreadCount } = useNotifications()

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                asChild
                className={cn(
                  "transition-all duration-200 ease-in-out hover:bg-accent hover:text-accent-foreground",
                  item.title === "Notifications" && unreadCount > 0 && "relative"
                )}
              >
                <Link href={item.url} className="relative">
                  <item.icon className="transition-transform duration-200 group-hover:scale-105" />
                  <span className="font-medium">{item.title}</span>
                  {item.title === "Notifications" && unreadCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Badge>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
