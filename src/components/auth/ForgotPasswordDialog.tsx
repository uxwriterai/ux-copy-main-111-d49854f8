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

interface ForgotPasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSignIn: () => void
}

export function ForgotPasswordDialog({ 
  open, 
  onOpenChange,
  onSignIn
}: ForgotPasswordDialogProps) {
  const { theme } = useTheme()
  const [error, setError] = useState<string>("")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reset your password</DialogTitle>
          <DialogDescription>
            Enter your email address and we'll send you a link to reset your password.
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Auth
          supabaseClient={supabase}
          view="forgotten_password"
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
              forgotten_password: {
                email_input_placeholder: 'name@example.com',
              }
            }
          }}
          theme={theme}
          providers={[]}
          redirectTo={window.location.origin + window.location.pathname}
        />
        
        <div className="mt-4 text-sm text-center">
          <button 
            onClick={onSignIn}
            className="text-primary hover:underline block w-full"
          >
            Back to sign in
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}