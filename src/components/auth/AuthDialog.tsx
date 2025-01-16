import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { supabase } from "@/integrations/supabase/client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTheme } from "@/components/ThemeProvider"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { WelcomeDialog } from "./WelcomeDialog"
import { AuthConfetti } from "./AuthConfetti"
import { getErrorMessage } from "@/utils/authErrors"

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
        setError("")
        onOpenChange(false)
      }

      if (event === 'SIGNED_OUT') {
        setError("")
        toast.success('Signed out successfully')
      }

      // Handle auth errors
      if (event === 'USER_UPDATED') {
        try {
          const { data, error: sessionError } = await supabase.auth.getSession()
          if (sessionError) {
            let errorMessage = getErrorMessage(sessionError)
            
            // Check for user not found error
            if (sessionError.message?.includes('Invalid login credentials')) {
              errorMessage = "Uh oh! We couldn't find your account. Please double-check your credentials."
            }
            
            console.error("Auth session error:", sessionError)
            setError(errorMessage)
            toast.error('Authentication Error', {
              description: errorMessage
            })
          }
        } catch (err) {
          let errorMessage = getErrorMessage(err)
          
          // Check for user not found error in catch block as well
          if (err.message?.includes('Invalid login credentials')) {
            errorMessage = "Uh oh! We couldn't find your account. Please double-check your credentials."
          }
          
          console.error("Auth error:", err)
          setError(errorMessage)
          toast.error('Authentication Error', {
            description: errorMessage
          })
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [onOpenChange])

  return (
    <>
      <AuthConfetti 
        show={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />

      <WelcomeDialog 
        open={showWelcome} 
        onOpenChange={setShowWelcome} 
      />

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px] p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Create your account</DialogTitle>
            <DialogDescription className="text-base">
              Already have an account? <button onClick={() => {}} className="text-primary hover:underline">Sign in</button>
            </DialogDescription>
          </DialogHeader>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Auth
            supabaseClient={supabase}
            view="sign_up"
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
                container: 'w-full space-y-4',
                button: 'w-full bg-background hover:bg-secondary border-[1px] border-border text-foreground font-medium py-2 px-4 rounded-md flex items-center justify-center gap-2',
                input: 'w-full bg-background border-[1px] border-border text-foreground rounded-md p-2',
                divider: 'my-4 text-center text-sm text-muted-foreground',
                label: 'text-sm text-muted-foreground mb-1 block',
                message: 'text-sm text-muted-foreground mt-2',
              }
            }}
            localization={{
              variables: {
                sign_up: {
                  email_label: 'Enter your email below to create your account',
                  password_label: 'Password',
                  button_label: 'Sign up',
                  social_provider_text: 'Sign up with {{provider}}',
                  divider_text: 'OR'
                }
              }
            }}
            providers={["github", "google"]}
            redirectTo={window.location.origin + window.location.pathname}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}