import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { SidebarMenuList } from "./sidebar/SidebarMenuList"
import { SidebarFooterButtons } from "./sidebar/SidebarFooterButtons"
import { useIsMobile } from "@/hooks/use-mobile"

export function AppSidebar() {
  const isMobile = useIsMobile()

  return (
    <>
      {isMobile && (
        <div className="md:hidden pl-2">
          <SidebarTrigger />
        </div>
      )}
      <Sidebar variant="sidebar" collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="pt-2">
              <SidebarMenuList />
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border p-4 flex flex-col gap-2 mt-auto">
          <SidebarFooterButtons />
        </SidebarFooter>
      </Sidebar>
    </>
  )
}