import { useState, useEffect } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { useNavigate } from 'react-router-dom'
import { useCredits } from '@/contexts/CreditsContext'
import { toast } from 'sonner'

export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const navigate = useNavigate()
  const { resetCredits, setCredits, setIsLoading } = useCredits()

  useEffect(() => {
    let mounted = true
    console.log("Initializing auth state listener")

    async function initializeAuth() {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        if (mounted) {
          console.log("Initial session state:", currentSession ? "logged in" : "not logged in")
          setSession(currentSession)
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          if (!mounted) return
          
          console.log("Auth state changed:", event)
          setIsLoading(true) // Set loading state when auth state changes

          if (event === 'SIGNED_IN' && newSession?.user) {
            setSession(newSession)
            setIsSigningOut(false)

            try {
              const { data: existingCredits } = await supabase
                .from('user_credits')
                .select('credits_remaining')
                .eq('user_id', newSession.user.id)
                .maybeSingle()

              if (existingCredits) {
                setCredits(existingCredits.credits_remaining)
                toast.success('Welcome back!')
              }
            } catch (error) {
              console.error("Error fetching user credits:", error)
            } finally {
              setIsLoading(false) // Clear loading state after credits are fetched
            }
          }

          if (event === 'SIGNED_OUT') {
            setSession(null)
            setIsSigningOut(false)
            await resetCredits() // This will handle setting isLoading to false internally
            navigate('/')
            toast.success('Signed out successfully')
          }
        })

        return () => {
          console.log("Cleaning up auth state listener")
          mounted = false
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error("Error in auth state management:", error)
        if (mounted) {
          setSession(null)
          setIsSigningOut(false)
          setIsLoading(false) // Clear loading state on error
        }
      }
    }

    initializeAuth()
  }, [navigate, resetCredits, setCredits, setIsLoading])

  const handleSignOut = async () => {
    if (isSigningOut) return
    
    setIsSigningOut(true)
    setIsLoading(true) // Set loading state when signing out
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error("Error signing out:", error)
      setIsSigningOut(false)
      setIsLoading(false) // Clear loading state on error
      toast.error('Error signing out. Please try again.')
    }
  }

  return {
    session,
    isSigningOut,
    handleSignOut
  }
}