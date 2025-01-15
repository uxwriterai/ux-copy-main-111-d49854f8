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
  Wand2
} from "lucide-react"

const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Copy Improver",
    url: "/copy-improver",
    icon: Wand2,
  },
  {
    title: "Copy Analysis",
    url: "/analysis",
    icon: BarChart2,
  },
  {
    title: "A/B Testing",
    url: "/generator",
    icon: SplitSquareVertical,
  },
  {
    title: "Accessibility",
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
              <span className="font-medium">{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )
}