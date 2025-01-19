import { useState, useEffect, useRef } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAppDispatch } from '@/store/hooks'
import { setUser, clearUser } from '@/store/slices/authSlice'
import { resetCredits, initializeCredits } from '@/store/slices/creditsSlice'

export function useAuthState() {
  const [session, setSession] = useState<Session | null>(null)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const authListenerSet = useRef(false)
  const cleanupRef = useRef<(() => void) | null>(null)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (authListenerSet.current || cleanupRef.current) return;
    
    let mounted = true
    console.log("[useAuthState] Initializing auth state listener")
    authListenerSet.current = true;

    async function initializeAuth() {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession()
        if (mounted) {
          console.log("[useAuthState] Initial session state:", currentSession ? "logged in" : "not logged in")
          setSession(currentSession)
          if (currentSession?.user) {
            // Clear existing credits and fetch user-based credits
            dispatch(resetCredits())
            dispatch(setUser(currentSession.user.id))
            dispatch(initializeCredits({ type: 'user', userId: currentSession.user.id }));
          }
        }

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
          if (!mounted) return
          
          console.log("[useAuthState] Auth event:", event)

          if (event === 'SIGNED_IN' && newSession?.user) {
            setSession(newSession)
            setIsSigningOut(false)
            // Clear existing credits and fetch user-based credits
            dispatch(resetCredits())
            dispatch(setUser(newSession.user.id))
            dispatch(initializeCredits({ type: 'user', userId: newSession.user.id }));
            toast.success('Welcome back!')
          }

          if (event === 'SIGNED_OUT') {
            setSession(null)
            setIsSigningOut(false)
            dispatch(clearUser())
            dispatch(resetCredits())
            navigate('/')
            toast.success('Signed out successfully')
          }
        })

        cleanupRef.current = () => {
          console.log("[useAuthState] Cleaning up auth state listener")
          mounted = false
          subscription.unsubscribe()
          authListenerSet.current = false
          cleanupRef.current = null
        }
      } catch (error) {
        console.error("[useAuthState] Error in auth state management:", error)
        if (mounted) {
          setSession(null)
          setIsSigningOut(false)
          dispatch(clearUser())
          dispatch(resetCredits())
        }
      }
    }

    initializeAuth()

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current()
      }
    }
  }, [navigate, dispatch])

  const handleSignOut = async () => {
    if (isSigningOut) return
    
    setIsSigningOut(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error("[useAuthState] Error signing out:", error)
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
