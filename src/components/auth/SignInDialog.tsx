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

interface SignInDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onForgotPassword: () => void
  onCreateAccount: () => void
}

export function SignInDialog({ 
  open, 
  onOpenChange,
  onForgotPassword,
  onCreateAccount
}: SignInDialogProps) {
  const { theme } = useTheme()
  const [error, setError] = useState<string>("")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sign in</DialogTitle>
          <DialogDescription>
            Enter your email and password below to login
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
              anchor: 'hidden', // Hide Supabase's default links
            }
          }}
          localization={{
            variables: {
              sign_in: {
                email_input_placeholder: 'name@example.com',
              }
            }
          }}
          theme={theme}
          providers={[]}
          redirectTo={window.location.origin + window.location.pathname}
        />
        
        <div className="mt-4 text-sm text-center space-y-2">
          <button 
            onClick={onForgotPassword}
            className="text-primary hover:underline block w-full"
          >
            Forgot password?
          </button>
          <button 
            onClick={onCreateAccount}
            className="text-primary hover:underline block w-full"
          >
            Don't have an account? Create one
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}