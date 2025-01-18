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
import { useState } from "react"
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