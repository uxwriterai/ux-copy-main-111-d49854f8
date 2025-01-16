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
import { createPortal } from 'react-dom'

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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
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
          isNewUser: timeDiff < 5000
        })
        
        if (timeDiff < 5000) {
          console.log("New user detected, showing welcome message and confetti")
          setShowConfetti(true)
          setShowWelcome(true)
          toast.success('Welcome! Your account has been created successfully.')
        } else {
          toast.success('Welcome back!')
        }
        onOpenChange(false)
      }

      if (event === 'SIGNED_OUT') {
        setError("")
        toast.success('Signed out successfully')
      }

      // Handle authentication errors
      if (event === 'USER_UPDATED' && !session) {
        const errorData = (session as any)?.error
        if (errorData) {
          const errorMessage = getErrorMessage(errorData)
          setError(errorMessage)
          toast.error('Authentication Error', {
            description: errorMessage
          })
        }
      }
    })

    // Listen for auth errors using the onAuthStateChange event
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'USER_UPDATED') {
        const error = (session as any)._error as AuthError
        if (error) {
          const errorMessage = getErrorMessage(error)
          setError(errorMessage)
          toast.error('Authentication Error', {
            description: errorMessage
          })
        }
      }
    }, {
      onError: (error) => {
        const errorMessage = getErrorMessage(error)
        setError(errorMessage)
        toast.error('Authentication Error', {
          description: errorMessage
        })
      }
    })

    return () => {
      subscription.unsubscribe()
      authSubscription.unsubscribe()
    }
  }, [onOpenChange])

  const getErrorMessage = (error: AuthError) => {
    const message = error.message?.toLowerCase() || '';
    
    if (message.includes('invalid login credentials') || message.includes('invalid password')) {
      return "Incorrect password. Please try again.";
    }
    if (message.includes('user not found') || message.includes('invalid user')) {
      return "No account found with this email address.";
    }
    if (message.includes('email not confirmed')) {
      return "Please verify your email address before signing in.";
    }
    if (message.includes('email already registered')) {
      return "An account with this email already exists.";
    }
    
    // Handle rate limiting
    if (message.includes('too many requests') || message.includes('rate limit')) {
      return "Too many attempts. Please try again later.";
    }
    
    // Handle network errors
    if (message.includes('network') || message.includes('connection')) {
      return "Network error. Please check your internet connection.";
    }
    
    return error.message || "An unexpected error occurred. Please try again.";
  }

  return (
    <>
      {showConfetti && createPortal(
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          pointerEvents: 'none',
          zIndex: 2147483647
        }}>
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
        </div>,
        document.body
      )}

      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">8 credits unlocked!</DialogTitle>
            <DialogDescription className="text-center text-lg mt-4">
              Let's get started and make something awesome.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button 
              className="w-full"
              onClick={() => setShowWelcome(false)}
            >
              Let's go!
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
            redirectTo={window.location.origin + window.location.pathname}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}