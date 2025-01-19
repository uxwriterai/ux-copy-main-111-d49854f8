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
  console.log("Current view:", currentView) // Debug log to track the current view

  // Reset view when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentView(initialView)
    }
  }, [isOpen, initialView])

  // Listen to auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event) // Debug log for auth events
      
      if (event === 'SIGNED_IN') {
        onClose()
      } else if (event === 'USER_UPDATED') {
        // Handle password reset, etc.
        setCurrentView('sign_in')
      }
    })

    return () => subscription.unsubscribe()
  }, [onClose])

  // Listen specifically for view changes
  useEffect(() => {
    const handleViewChange = (event: any) => {
      if (event.target?.classList.contains('supabase-auth-ui_ui-anchor')) {
        // Small delay to ensure view updates after click
        setTimeout(() => {
          const newView = document.querySelector('.supabase-auth-ui_ui-container')?.getAttribute('data-supabase-auth-view')
          if (newView) {
            console.log("View changed to:", newView)
            setCurrentView(newView as 'sign_in' | 'sign_up' | 'forgotten_password')
          }
        }, 100)
      }
    }

    document.addEventListener('click', handleViewChange)
    return () => document.removeEventListener('click', handleViewChange)
  }, [])

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