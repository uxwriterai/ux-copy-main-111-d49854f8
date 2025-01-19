import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Auth } from '@supabase/auth-ui-react'
import { supabase } from "@/integrations/supabase/client"
import { ThemeSupa } from '@supabase/auth-ui-shared'

interface AuthDialogProps {
  isOpen: boolean
  onClose: () => void
  view?: 'sign_in' | 'sign_up' | 'forgotten_password'
}

export function AuthDialog({ isOpen, onClose, view = 'sign_in' }: AuthDialogProps) {
  console.log("Current view:", view) // Debug log to track the current view

  const titles = {
    sign_in: "Welcome back!",
    sign_up: "Join our community",
    forgotten_password: "No worries!"
  }

  const descriptions = {
    sign_in: "Great to see you again. Enter your details to continue.",
    sign_up: "Create an account to get more free credits and unlock all features.",
    forgotten_password: "Enter your email and we'll send you a reset link."
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{titles[view]}</DialogTitle>
          <DialogDescription>
            {descriptions[view]}
          </DialogDescription>
        </DialogHeader>
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
            }
          }}
          providers={[]}
        />
      </DialogContent>
    </Dialog>
  )
}