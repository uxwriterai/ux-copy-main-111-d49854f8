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
  const [view, setView] = useState<'sign_in' | 'sign_up' | 'forgotten_password'>('sign_in')

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id)
      
      if (event === 'SIGNED_IN' && session?.user) {
        try {
          // Check if this is a new user by querying for existing credits
          const { data: existingCredits, error: queryError } = await supabase
            .from('user_credits')
            .select('credits_remaining')
            .eq('user_id', session.user.id)
            .maybeSingle()

          if (queryError) {
            console.error("Error checking existing credits:", queryError)
            throw queryError
          }

          // If no existing credits found, this is a new user
          if (!existingCredits) {
            console.log("New user detected, creating credits entry")
            
            // Get the IP address for reference
            const ipAddress = await fetch('https://api.ipify.org?format=json')
              .then(res => res.json())
              .then(data => data.ip);

            // Delete any existing IP-based credits
            await supabase
              .from('user_credits')
              .delete()
              .is('user_id', null)
              .eq('ip_address', ipAddress);

            const { error: creditsError } = await supabase
              .from('user_credits')
              .insert({
                user_id: session.user.id,
                credits_remaining: 6,
                ip_address: ipAddress
              })

            if (creditsError) {
              console.error("Error creating initial credits:", creditsError)
              throw creditsError
            }

            console.log("Successfully created initial credits")
            setShowConfetti(true)
            setShowWelcome(true)
            toast.success('Welcome! Your account has been created successfully.')
          } else {
            console.log("Existing user detected with credits:", existingCredits)
            toast.success('Welcome back!')
          }
          
          setError("")
          onOpenChange(false)
        } catch (err) {
          console.error("Error handling user credits:", err)
          const errorMessage = getErrorMessage(err)
          setError(errorMessage)
          toast.error('Error setting up your account', {
            description: errorMessage
          })
        }
      }

      if (event === 'SIGNED_OUT') {
        setError("")
        toast.success('Signed out successfully')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [onOpenChange])

  const getAuthContent = () => {
    switch (view) {
      case 'sign_in':
        return {
          title: "Welcome back!",
          description: "Sign in to your account to continue your journey"
        }
      case 'sign_up':
        return {
          title: "Create your account",
          description: "Sign up to unlock more credits and features."
        }
      case 'forgotten_password':
        return {
          title: "Reset your password",
          description: "Enter your email and we'll send you instructions to reset your password"
        }
      default:
        return {
          title: "Authentication",
          description: "Please complete the required steps"
        }
    }
  }

  const content = getAuthContent()

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
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{content.title}</DialogTitle>
            <DialogDescription>{content.description}</DialogDescription>
          </DialogHeader>
          
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Auth
            supabaseClient={supabase}
            view={view}
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
            localization={{
              variables: {
                sign_in: {
                  email_input_placeholder: 'name@example.com',
                  password_input_placeholder: 'Your password',
                  email_label: 'Email address',
                  password_label: 'Password',
                },
                sign_up: {
                  email_input_placeholder: 'name@example.com',
                  password_input_placeholder: 'Create a password',
                  email_label: 'Email address',
                  password_label: 'Password',
                }
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