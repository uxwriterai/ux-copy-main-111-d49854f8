import { useState, useEffect, useRef } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { useNavigate } from 'react-router-dom'
import { useCredits } from '@/contexts/CreditsContext'
import { toast } from 'sonner'

export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const authListenerSet = useRef(false)
  const cleanupRef = useRef<(() => void) | null>(null)
  const navigate = useNavigate()
  const { resetCredits, setCredits } = useCredits()

  useEffect(() => {
    if (authListenerSet.current || cleanupRef.current) return;
    
    let mounted = true
    console.log("Initializing auth state listener")
    authListenerSet.current = true;

    async function initializeAuth() {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        if (mounted) {
          console.log("Initial session state:", currentSession ? "logged in" : "not logged in")
          setSession(currentSession)
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          if (!mounted) return
          
          console.log("Auth event:", event)

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
            }
          }

          if (event === 'SIGNED_OUT') {
            setSession(null)
            setIsSigningOut(false)
            resetCredits()
            navigate('/')
            toast.success('Signed out successfully')
          }
        })

        cleanupRef.current = () => {
          console.log("Cleaning up auth state listener")
          mounted = false
          subscription.unsubscribe()
          authListenerSet.current = false
          cleanupRef.current = null
        }
      } catch (error) {
        console.error("Error in auth state management:", error)
        if (mounted) {
          setSession(null)
          setIsSigningOut(false)
        }
      }
    }

    initializeAuth()

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current()
      }
    }
  }, [navigate, resetCredits, setCredits])

  const handleSignOut = async () => {
    if (isSigningOut) return
    
    setIsSigningOut(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error("Error signing out:", error)
      setIsSigningOut(false)
      toast.error('Error signing out. Please try again.')
    }
  }

  return {
    session,
    isSigningOut,
    handleSignOut
  }
}