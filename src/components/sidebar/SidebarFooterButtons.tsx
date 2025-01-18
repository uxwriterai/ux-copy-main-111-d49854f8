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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session)
      setSession(session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    if (isSigningOut) {
      console.log("Already signing out, ignoring request")
      return
    }
    
    setIsSigningOut(true)
    console.log("Starting sign out process...")

    try {
      // Reset local state first to ensure UI feedback
      setSession(null)
      resetCredits()
      
      let attempts = 0
      const maxAttempts = 5 // Increased max attempts
      let signOutSuccess = false
      
      const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

      while (attempts < maxAttempts && !signOutSuccess) {
        try {
          console.log(`Attempt ${attempts + 1} to sign out`)
          const { error } = await supabase.auth.signOut()
          
          if (!error) {
            console.log("Sign out successful")
            signOutSuccess = true
          } else {
            console.error(`Sign out attempt ${attempts + 1} failed:`, error)
            // Exponential backoff with longer initial delay
            const delay = Math.min(1000 * Math.pow(2, attempts), 10000)
            console.log(`Waiting ${delay}ms before next attempt`)
            await wait(delay)
          }
        } catch (error: any) {
          console.error(`Sign out attempt ${attempts + 1} failed with error:`, error)
          
          // Special handling for 503 errors
          if (error?.status === 503) {
            console.log("Service unavailable (503), waiting longer before retry")
            await wait(5000) // Wait 5 seconds for 503 errors
          }
        }
        attempts++
      }

      if (!signOutSuccess) {
        throw new Error("Failed to sign out after multiple attempts")
      }

      // Get anonymous credits after successful sign out
      console.log("Fetching IP for anonymous credits")
      const response = await fetch('https://api.ipify.org?format=json')
      const { ip } = await response.json()
      
      console.log("Fetching anonymous credits for IP:", ip)
      const { data: anonCredits } = await supabase
        .from('user_credits')
        .select('credits_remaining')
        .is('user_id', null)
        .eq('ip_address', ip)
        .maybeSingle()

      // Navigate and show success message
      navigate('/')
      toast.success('Signed out successfully')
    } catch (error) {
      console.error("Error during sign out process:", error)
      // Restore session state on error
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
      })
      toast.error('Error signing out. Please try again in a few moments.')
    } finally {
      setIsSigningOut(false)
    }
  }

  // ... keep existing code (render methods for credits badge, settings button, theme toggle, and sidebar toggle)

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