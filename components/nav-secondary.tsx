import Link from "next/link"
import { usePathname } from "next/navigation"
import type { Icon } from "@tabler/icons-react"

import { Badge } from "@/components/ui/badge"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useNotifications } from "@/context/NotificationContext"
import { cn } from "@/lib/utils"

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
  const pathname = usePathname()

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = item.url === pathname || pathname.startsWith(item.url)

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  asChild
                  isActive={isActive}
                  className={cn(
                    "transition-all duration-200 ease-in-out hover:bg-accent hover:text-accent-foreground",
                    isActive && "bg-accent text-accent-foreground shadow-sm font-semibold"
                  )}
                >
                  <Link href={item.url} className="flex items-center gap-2">
                    <item.icon className={cn(
                      "transition-transform duration-200 group-hover:scale-105 shrink-0",
                      isActive && "text-primary"
                    )} />
                    <span>{item.title}</span>
                    {item.title === "Notifications" && unreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="ml-auto h-5 min-w-5 flex items-center justify-center px-1.5 text-xs font-medium rounded-full"
                      >
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </Badge>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
