import { 
  AlertCircle, 
  BarChart2, 
  FileText, 
  Home, 
  MessageSquare, 
  Settings, 
  SplitSquareVertical,
  Moon,
  Sun,
  PanelLeftClose,
  PanelLeft
} from "lucide-react"
import { useLocation, Link } from "react-router-dom"
import { useTheme } from "next-themes"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

const items = [
  {
    title: "UX Copy Improver",
    url: "/",
    icon: Home,
  },
  {
    title: "UX Copy Analysis",
    url: "/analysis",
    icon: BarChart2,
  },
  {
    title: "A/B Testing Generator",
    url: "/generator",
    icon: SplitSquareVertical,
  },
  {
    title: "Accessibility Checker",
    url: "/accessibility",
    icon: FileText,
  },
  {
    title: "Tone Adjuster",
    url: "/tone",
    icon: MessageSquare,
  },
  {
    title: "Error Enhancer",
    url: "/error",
    icon: AlertCircle,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const location = useLocation()
  const { theme, setTheme } = useTheme()
  const { state, toggleSidebar } = useSidebar()
  const isCollapsed = state === "collapsed"

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.url}
                    className="transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent/90"
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4 flex flex-col gap-2 mt-auto">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="w-full flex items-center justify-center hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          {isCollapsed ? (
            <PanelLeft className="h-5 w-5" />
          ) : (
            <PanelLeftClose className="h-5 w-5" />
          )}
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}