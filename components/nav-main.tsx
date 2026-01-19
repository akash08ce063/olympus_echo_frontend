import Link from "next/link"
import { usePathname } from "next/navigation"
import type { Icon } from "@tabler/icons-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

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
  const pathname = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = item.view
              ? currentView === item.view
              : item.url === pathname || (item.url !== "/dashboard" && pathname.startsWith(item.url!))

            return (
              <SidebarMenuItem key={item.title}>
                {item.view ? (
                  <SidebarMenuButton
                    tooltip={item.title}
                    onClick={() => onViewChange?.(item.view!)}
                    isActive={isActive}
                    className={cn(
                      "transition-all duration-200 ease-in-out hover:bg-accent hover:text-accent-foreground",
                      isActive && "bg-accent text-accent-foreground shadow-sm font-semibold"
                    )}
                  >
                    {item.icon && <item.icon className={cn(
                      "transition-transform duration-200 group-hover:scale-105",
                      isActive && "text-primary"
                    )} />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                ) : (
                  <SidebarMenuButton
                    tooltip={item.title}
                    asChild
                    isActive={isActive}
                    className={cn(
                      "transition-all duration-200 ease-in-out hover:bg-accent hover:text-accent-foreground",
                      isActive && "bg-accent text-accent-foreground shadow-sm font-semibold"
                    )}
                  >
                    <Link href={item.url!}>
                      {item.icon && <item.icon className={cn(
                        "transition-transform duration-200 group-hover:scale-105",
                        isActive && "text-primary"
                      )} />}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
