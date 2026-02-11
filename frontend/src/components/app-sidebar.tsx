import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const items = [
  { title: "Home", url: "#", icon: Home },
  { title: "Inbox", url: "#", icon: Inbox },
  { title: "Calendar", url: "#", icon: Calendar },
  { title: "Search", url: "#", icon: Search },
  { title: "Settings", url: "#", icon: Settings },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent className="px-2 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-xs font-semibold tracking-wide text-muted-foreground">
            Application
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className="
                      group relative flex items-center gap-3
                      rounded-lg px-3 py-2
                      transition-all duration-200 ease-out
                      hover:bg-sidebar-accent/60
                      data-[active=true]:bg-sidebar-accent
                    "
                  >
                    <a href={item.url} className="flex items-center gap-3">
                      {/* ICON */}
                      <item.icon
                        className="
                          h-5 w-5 shrink-0
                          transition-transform duration-200
                          group-hover:scale-110
                        "
                      />

                      {/* TEXT */}
                      <span
                        className="
                          text-sm font-medium
                          transition-all duration-200
                          group-data-[collapsible=icon]:opacity-0
                          group-data-[collapsible=icon]:-translate-x-2
                        "
                      >
                        {item.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
