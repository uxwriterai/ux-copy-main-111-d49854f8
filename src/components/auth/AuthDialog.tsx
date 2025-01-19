import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Auth } from '@supabase/auth-ui-react'
import { supabase } from "@/integrations/supabase/client"
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useState, useEffect } from 'react'

interface AuthDialogProps {
  isOpen: boolean
  onClose: () => void
  view?: 'sign_in' | 'sign_up' | 'forgotten_password'
}

export function AuthDialog({ isOpen, onClose, view: initialView = 'sign_in' }: AuthDialogProps) {
  const [currentView, setCurrentView] = useState(initialView)

  // Reset view when dialog opens
  useEffect(() => {
    if (isOpen) {
      setCurrentView(initialView)
    }
  }, [isOpen, initialView])

  // Listen to auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        onClose()
      }
    })

    return () => subscription.unsubscribe()
  }, [onClose])

  // Listen for view changes using MutationObserver
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target instanceof Element) {
          const view = mutation.target.getAttribute('data-supabase-auth-view')
          if (view === 'sign_in' || view === 'sign_up' || view === 'forgotten_password') {
            console.log('View changed to:', view)
            setCurrentView(view)
          }
        }
      })
    })

    const container = document.querySelector('.supabase-auth-ui_ui-container')
    if (container) {
      observer.observe(container, {
        attributes: true,
        attributeFilter: ['data-supabase-auth-view']
      })
    }

    return () => observer.disconnect()
  }, [isOpen]) // Re-run when dialog opens/closes

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
          <DialogTitle>{titles[currentView]}</DialogTitle>
          <DialogDescription>
            {descriptions[currentView]}
          </DialogDescription>
        </DialogHeader>
        <Auth
          supabaseClient={supabase}
          view={currentView}
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