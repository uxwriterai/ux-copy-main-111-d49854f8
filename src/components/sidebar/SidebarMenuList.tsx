import { Link, useLocation } from "react-router-dom"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { 
  AlertCircle, 
  BarChart2, 
  FileText, 
  Home, 
  MessageSquare, 
  Settings, 
  SplitSquareVertical,
} from "lucide-react"

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

export function SidebarMenuList() {
  const location = useLocation()

  return (
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
  )
}