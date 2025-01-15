import { Moon, Sun, PanelLeft, PanelLeftClose, LogIn, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/ThemeProvider"
import { useSidebar } from "@/components/ui/sidebar"
import { useCredits } from "@/contexts/CreditsContext"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { AuthDialog } from "@/components/auth/AuthDialog"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import { Session } from "@supabase/supabase-js"

export function SidebarFooterButtons() {
  const { theme, setTheme } = useTheme()
  const { state, toggleSidebar } = useSidebar()
  const { credits, resetCredits } = useCredits()
  const isCollapsed = state === "collapsed"
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [showCreditsDialog, setShowCreditsDialog] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session:", session)
      setSession(session)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session)
      setSession(session)
      
      if (_event === 'SIGNED_OUT') {
        console.log("User signed out, resetting state...")
        setSession(null)
        resetCredits()
        navigate('/')
      }
    })

    return () => {
      console.log("Cleaning up auth subscription")
      subscription.unsubscribe()
    }
  }, [navigate, resetCredits])

  const handleLogout = async () => {
    try {
      console.log("Attempting to sign out...")
      
      // First get the current session
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      
      if (!currentSession) {
        console.log("No active session found")
        setSession(null)
        resetCredits()
        navigate('/')
        return
      }

      // Then sign out
      const { error } = await supabase.auth.signOut({
        scope: 'local' // Changed from 'global' to 'local' to avoid session conflicts
      })
      
      if (error) {
        console.error("Error signing out:", error)
        toast.error('Error signing out')
      } else {
        console.log("Successfully signed out")
        toast.success('Signed out successfully')
      }
    } catch (error) {
      console.error("Caught error during sign out:", error)
      toast.error('Error signing out')
    }
  }

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
            onClick={() => setShowCreditsDialog(true)}
          >
            {credits} credits left
          </Badge>
        </div>
      )}
      {!session ? (
        <Button 
          variant="ghost" 
          className="w-full flex items-center justify-between px-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center"
          onClick={() => setShowAuthDialog(true)}
        >
          <LogIn className="h-5 w-5" />
          <span className="group-data-[collapsible=icon]:hidden">Sign in</span>
        </Button>
      ) : (
        <Button 
          variant="ghost" 
          className="w-full flex items-center justify-between px-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span className="group-data-[collapsible=icon]:hidden">Sign out</span>
        </Button>
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

      <Dialog open={showCreditsDialog} onOpenChange={setShowCreditsDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Unlock 5x More Credits</DialogTitle>
            <DialogDescription className="pt-2">
              You've used all your free credits! Sign up now to get:
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>5x more credits to generate content</li>
                <li>Priority support</li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setShowCreditsDialog(false)}>
              Maybe later
            </Button>
            <Button onClick={() => {
              setShowCreditsDialog(false)
              setShowAuthDialog(true)
            }}>
              Sign up
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
    </>
  )
}