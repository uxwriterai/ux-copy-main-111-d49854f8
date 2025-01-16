import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"
import { WelcomeDialog } from "./WelcomeDialog"
import { AuthConfetti } from "./AuthConfetti"
import { SignInDialog } from "./SignInDialog"
import { CreateAccountDialog } from "./CreateAccountDialog"
import { ForgotPasswordDialog } from "./ForgotPasswordDialog"

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [showWelcome, setShowWelcome] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [view, setView] = useState<'sign_in' | 'sign_up' | 'forgot_password'>('sign_in')

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
        onOpenChange(false)
      }

      if (event === 'SIGNED_OUT') {
        toast.success('Signed out successfully')
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

      <SignInDialog 
        open={open && view === 'sign_in'} 
        onOpenChange={onOpenChange}
        onCreateAccount={() => setView('sign_up')}
        onForgotPassword={() => setView('forgot_password')}
      />

      <CreateAccountDialog
        open={open && view === 'sign_up'}
        onOpenChange={onOpenChange}
        onSignIn={() => setView('sign_in')}
      />

      <ForgotPasswordDialog
        open={open && view === 'forgot_password'}
        onOpenChange={onOpenChange}
        onSignIn={() => setView('sign_in')}
      />
    </>
  )
}