import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { SidebarMenuList } from "./sidebar/SidebarMenuList"
import { SidebarFooterButtons } from "./sidebar/SidebarFooterButtons"

export function AppSidebar() {
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenuList />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4 flex flex-col gap-2 mt-auto">
        <SidebarFooterButtons />
      </SidebarFooter>
    </Sidebar>
  )
}