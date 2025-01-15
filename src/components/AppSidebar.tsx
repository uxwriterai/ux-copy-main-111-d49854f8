import { 
  AlertCircle, 
  BarChart2, 
  FileText, 
  MessageSquare, 
  Moon,
  Settings, 
  SplitSquareVertical,
  Sun
} from "lucide-react"
import { useLocation, Link } from "react-router-dom"
import { useTheme } from "@/components/ThemeProvider"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

const items = [
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

const Logo = () => (
  <svg width="63" height="11" viewBox="0 0 63 11" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-foreground">
    <path d="M59.3938 10L60.4847 3.45456H62.3L61.2091 10H59.3938ZM61.5799 2.60228C61.31 2.60228 61.087 2.5128 60.9108 2.33382C60.7375 2.152 60.6665 1.93609 60.6978 1.68609C60.729 1.43041 60.8512 1.2145 61.0643 1.03836C61.2773 0.859386 61.5188 0.769897 61.7887 0.769897C62.0586 0.769897 62.2787 0.859386 62.4492 1.03836C62.6197 1.2145 62.6907 1.43041 62.6623 1.68609C62.6339 1.93609 62.5131 2.152 62.3 2.33382C62.0898 2.5128 61.8498 2.60228 61.5799 2.60228Z" fill="currentColor"/>
    <path d="M0.5 5.5C0.5 2.46243 2.96243 0 6 0C9.03757 0 11.5 2.46243 11.5 5.5C11.5 8.53757 9.03757 11 6 11C2.96243 11 0.5 8.53757 0.5 5.5Z" fill="currentColor"/>
  </svg>
)

export function AppSidebar() {
  const location = useLocation()
  const { theme, setTheme } = useTheme()
  const { toggleSidebar } = useSidebar()

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel asChild>
            <div className="flex items-center justify-center py-4">
              <Logo />
            </div>
          </SidebarGroupLabel>
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
      <SidebarFooter className="border-t p-4 space-y-2">
        <Button 
          variant="ghost" 
          className="w-full justify-start" 
          onClick={toggleSidebar}
        >
          <span>Collapse Sidebar</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? (
            <>
              <Sun className="mr-2 h-4 w-4" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark Mode</span>
            </>
          )}
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}
