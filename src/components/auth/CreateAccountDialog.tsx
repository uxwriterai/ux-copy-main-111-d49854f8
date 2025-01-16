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

interface CreateAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSignIn: () => void
}

export function CreateAccountDialog({ 
  open, 
  onOpenChange,
  onSignIn
}: CreateAccountDialogProps) {
  const { theme } = useTheme()
  const [error, setError] = useState<string>("")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create your account</DialogTitle>
          <DialogDescription>
            Sign up to unlock more credits and features.
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
              container: 'w-full',
              button: 'w-full',
              input: 'w-full',
            }
          }}
          localization={{
            variables: {
              sign_up: {
                email_input_placeholder: 'name@example.com',
              }
            }
          }}
          theme={theme}
          providers={[]}
          redirectTo={window.location.origin + window.location.pathname}
        />
      </DialogContent>
    </Dialog>
  )
}