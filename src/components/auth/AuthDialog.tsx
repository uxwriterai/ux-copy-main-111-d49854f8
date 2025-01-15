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
  const [view, setView] = useState<"sign_in" | "sign_up">("sign_in")

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
        return "Invalid email or password. Please check your credentials and try again."
      case "User not found":
        return "No account found with these credentials."
      default:
        return error.message
    }
  }

  const getTitleAndDescription = () => {
    if (view === "sign_in") {
      return {
        title: "Welcome back!",
        description: "Sign in to your account to access your UX writing tools and saved content."
      }
    }
    return {
      title: "Create an account",
      description: "Join us to unlock powerful UX writing tools and start creating better content today."
    }
  }

  const { title, description } = getTitleAndDescription()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
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
          onViewChange={(newView) => setView(newView as "sign_in" | "sign_up")}
        />
      </DialogContent>
    </Dialog>
  )
}