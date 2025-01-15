import { 
  AlertCircle, 
  BarChart2, 
  FileText, 
  Home, 
  MessageSquare, 
  Settings, 
  SplitSquareVertical 
} from "lucide-react"
import { useLocation, Link } from "react-router-dom"
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

  return (
    <Sidebar>
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
                  >
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
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