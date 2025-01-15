import { Moon, Sun, PanelLeft, PanelLeftClose } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/ThemeProvider"
import { useSidebar } from "@/components/ui/sidebar"
import { useCredits } from "@/contexts/CreditsContext"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { AuthDialog } from "@/components/auth/AuthDialog"

export function SidebarFooterButtons() {
  const { theme, setTheme } = useTheme()
  const { state, toggleSidebar } = useSidebar()
  const { credits } = useCredits()
  const isCollapsed = state === "collapsed"
  const [showAuthDialog, setShowAuthDialog] = useState(false)

  return (
    <>
      {!isCollapsed && (
        <div className="w-full flex justify-center mb-2">
          <Badge 
            variant="outline" 
            className={cn(
              "cursor-pointer transition-colors px-4 py-1",
              credits === 0 
                ? "bg-destructive/10 hover:bg-destructive/20 text-destructive border-destructive/50" 
                : "bg-sidebar-accent/50 hover:bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border"
            )}
            onClick={() => setShowAuthDialog(true)}
          >
            {credits} credits left
          </Badge>
        </div>
      )}
      <Button 
        variant="ghost" 
        className="w-full flex items-center justify-between px-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      >
        {theme === "light" ? (
          <>
            <Moon className="h-5 w-5" />
            <span className="group-data-[collapsible=icon]:hidden">Dark mode</span>
          </>
        ) : (
          <>
            <Sun className="h-5 w-5" />
            <span className="group-data-[collapsible=icon]:hidden">Light mode</span>
          </>
        )}
      </Button>
      <Button
        variant="ghost"
        className="w-full flex items-center justify-between px-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center"
        onClick={toggleSidebar}
      >
        {isCollapsed ? (
          <>
            <PanelLeft className="h-5 w-5" />
            <span className="group-data-[collapsible=icon]:hidden">Expand sidebar</span>
          </>
        ) : (
          <>
            <PanelLeftClose className="h-5 w-5" />
            <span className="group-data-[collapsible=icon]:hidden">Collapse sidebar</span>
          </>
        )}
      </Button>
      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </>
  )
}