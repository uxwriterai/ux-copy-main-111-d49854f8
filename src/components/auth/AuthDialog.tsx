import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { supabase } from "@/integrations/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTheme } from "@/components/ThemeProvider"
import { useEffect, useState } from "react"
import { AuthError } from "@supabase/supabase-js"
import { toast } from "sonner"
import Confetti from 'react-confetti'
import { Button } from "@/components/ui/button"

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const { theme } = useTheme()
  const [error, setError] = useState<string>("")
  const [showWelcome, setShowWelcome] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event)
      if (event === 'SIGNED_IN' && session?.user) {
        // Check if this is a new sign up by comparing timestamps
        const createdAt = new Date(session.user.created_at).getTime()
        const lastSignIn = new Date(session.user.last_sign_in_at).getTime()
        const timeDiff = Math.abs(createdAt - lastSignIn)
        
        console.log("Time comparison:", {
          createdAt,
          lastSignIn,
          timeDiff,
          isNewUser: timeDiff < 5000 // Consider new if timestamps are within 5 seconds
        })
        
        if (timeDiff < 5000) { // If timestamps are within 5 seconds, consider it a new signup
          console.log("New user detected, showing welcome message and confetti")
          setShowConfetti(true)
          setShowWelcome(true)
        }
        onOpenChange(false)
        toast.success('Signed in successfully')
      }
      if (event === 'SIGNED_OUT') {
        setError("")
      }
      if (event === 'USER_UPDATED' && !session) {
        const errorData = (session as any)?.error
        if (errorData) {
          setError(getErrorMessage(errorData))
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [onOpenChange])

  const getErrorMessage = (error: AuthError) => {
    switch (error.message) {
      case "Invalid login credentials":
        return "Invalid email or password. Please check your credentials and try again."
      case "User not found":
        return "No account found with these credentials."
      default:
        return error.message
    }
  }

  return (
    <>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={500}
          onConfettiComplete={() => {
            console.log("Confetti animation completed")
            setShowConfetti(false)
          }}
        />
      )}
      
      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">🎉 Welcome Aboard!</DialogTitle>
            <DialogDescription className="text-center text-lg mt-4">
              You've unlocked 15 credits to start creating amazing content!
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button 
              className="w-full"
              onClick={() => setShowWelcome(false)}
            >
              Let's Roll
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Welcome</DialogTitle>
            <DialogDescription>
              Sign in to unlock more credits and features.
            </DialogDescription>
          </DialogHeader>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Auth
            supabaseClient={supabase}
            view="sign_in"
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'rgb(var(--primary))',
                    brandAccent: 'rgb(var(--primary))',
                  }
                }
              },
              className: {
                container: 'w-full',
                button: 'w-full',
                input: 'w-full',
              }
            }}
            theme={theme}
            providers={[]}
            redirectTo={window.location.origin}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}