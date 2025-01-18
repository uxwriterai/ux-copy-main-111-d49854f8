import { Moon, Sun, PanelLeft, PanelLeftClose, LogIn, LogOut, Settings } from "lucide-react"
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
  const [isSigningOut, setIsSigningOut] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session)
      setSession(session)
      
      if (_event === 'SIGNED_OUT') {
        setSession(null)
        resetCredits()
        navigate('/')
        setIsSigningOut(false)
        toast.success('Signed out successfully')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [navigate, resetCredits])

  const handleLogout = async () => {
    if (isSigningOut) return // Prevent multiple sign-out attempts
    
    try {
      setIsSigningOut(true)
      console.log("Attempting to sign out...")
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error("Error during sign out:", error)
        toast.error('Error signing out', {
          description: error.message
        })
        setIsSigningOut(false) // Reset signing out state on error
      }

      // Add a timeout to reset the signing out state if the auth state change event doesn't fire
      setTimeout(() => {
        if (isSigningOut) {
          setIsSigningOut(false)
          setSession(null)
          resetCredits()
          navigate('/')
          toast.success('Signed out successfully')
        }
      }, 3000)
    } catch (error) {
      console.error("Caught error during sign out:", error)
      toast.error('Error signing out')
      setIsSigningOut(false)
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
      
      {session && (
        <Button 
          variant="ghost" 
          className="w-full flex items-center justify-between px-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center"
          onClick={() => navigate('/settings')}
        >
          <Settings className="h-5 w-5" />
          <span className="group-data-[collapsible=icon]:hidden">Settings</span>
        </Button>
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
          disabled={isSigningOut}
        >
          <LogOut className="h-5 w-5" />
          <span className="group-data-[collapsible=icon]:hidden">
            {isSigningOut ? 'Signing out...' : 'Sign out'}
          </span>
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