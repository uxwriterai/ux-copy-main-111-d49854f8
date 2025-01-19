import { Link, useLocation } from "react-router-dom"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { 
  Home, 
  SplitSquareVertical,
  Type,
  Wand2,
  FileX,
  Layout,
  LayoutTemplate
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
    title: "A/B Testing",
    url: "/generator",
    icon: SplitSquareVertical,
  },
  {
    title: "Microcopy Generator",
    url: "/microcopy",
    icon: Type,
  },
  {
    title: "Empty State Generator",
    url: "/empty-state",
    icon: FileX,
  },
  {
    title: "Hero Copy Generator",
    url: "/hero-copy",
    icon: Layout,
  },
  {
    title: "Landing Page Generator",
    url: "/landing-page",
    icon: LayoutTemplate,
  }
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
            className="transition-all duration-200 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-sm active:bg-sidebar-accent/90 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground rounded-lg px-3 py-2"
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