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
import { AuthError } from "@supabase/supabase-js"

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const { theme } = useTheme()
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        onOpenChange(false)
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
        return "Invalid email or password. If you're new, please sign up first using the Sign Up tab."
      case "Email not confirmed":
        return "Please verify your email address before signing in. Check your inbox for the confirmation email."
      case "User not found":
        return "No account found. Please sign up first using the Sign Up tab."
      default:
        return error.message || "An error occurred during authentication. Please try again."
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome</DialogTitle>
          <DialogDescription>
            New user? Please use the Sign Up tab first to create an account. Already have an account? Use Sign In to access your features.
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Auth
          supabaseClient={supabase}
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
          view="sign_up"
        />
      </DialogContent>
    </Dialog>
  )
}