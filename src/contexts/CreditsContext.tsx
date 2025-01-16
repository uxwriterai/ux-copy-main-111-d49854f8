import { createContext, useContext, useState, useEffect } from "react"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { getUserCredits, updateUserCredits } from "@/services/creditsService"
import { AuthError, Session } from "@supabase/supabase-js"

interface CreditsContextType {
  credits: number
  setCredits: (credits: number) => void
  resetCredits: () => Promise<void>
  useCredit: () => Promise<boolean>
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined)

export function CreditsProvider({ children }: { children: React.ReactNode }) {
  const [credits, setCredits] = useState<number>(2) // Default to non-logged in user limit
  const [session, setSession] = useState<Session | null>(null)
  const broadcastChannel = new BroadcastChannel('auth_channel')

  const getIpAddress = async () => {
    try {
      const response = await fetch('/functions/v1/get-ip')
      const data = await response.json()
      return data.ip
    } catch (error) {
      console.error('Error fetching IP address:', error)
      return null
    }
  }

  const resetCredits = async () => {
    console.log("Resetting credits...")
    try {
      const ipAddress = await getIpAddress()
      if (!ipAddress) {
        console.error("Could not fetch IP address")
        setCredits(session ? 6 : 2) // Set default based on auth status
        return
      }

      // Query Supabase for existing credits
      const { data, error } = await supabase
        .from('user_credits')
        .select('credits_remaining')
        .eq('ip_address', ipAddress)
        .is('user_id', session ? session.user.id : null)
        .maybeSingle()

      if (error) {
        console.error("Error fetching credits from Supabase:", error)
        setCredits(session ? 6 : 2)
        return
      }

      // If no record exists, create one with default credits
      if (!data) {
        const defaultCredits = session ? 6 : 2
        const { error: insertError } = await supabase
          .from('user_credits')
          .insert({
            ip_address: ipAddress,
            credits_remaining: defaultCredits,
            user_id: session?.user?.id || null
          })

        if (insertError) {
          console.error("Error creating new credits record:", insertError)
          setCredits(defaultCredits)
          return
        }

        setCredits(defaultCredits)
        return
      }

      // Use existing credits, but ensure they don't exceed the maximum
      const maxCredits = session ? 6 : 2
      const finalCredits = Math.min(data.credits_remaining, maxCredits)
      console.log("Setting credits to:", finalCredits)
      setCredits(finalCredits)
    } catch (error) {
      console.error("Error resetting credits:", error)
      setCredits(session ? 6 : 2)
    }
  }

  const useCredit = async () => {
    if (credits <= 0) {
      toast.error("No credits remaining!")
      return false
    }

    try {
      const ipAddress = await getIpAddress()
      if (!ipAddress) {
        console.error("Could not fetch IP address")
        return false
      }

      const newCredits = credits - 1
      const { error } = await supabase
        .from('user_credits')
        .upsert({
          ip_address: ipAddress,
          credits_remaining: newCredits,
          user_id: session?.user?.id || null
        }, {
          onConflict: 'ip_address,user_id'
        })

      if (error) {
        console.error("Error updating credits in Supabase:", error)
        toast.error("Error updating credits. Please try again.")
        return false
      }

      setCredits(newCredits)
      return true
    } catch (error) {
      console.error("Error using credit:", error)
      toast.error("Error updating credits. Please try again.")
      return false
    }
  }

  // Handle auth state changes
  useEffect(() => {
    const handleAuthChange = async (event: string, session: Session | null) => {
      console.log("Auth state changed:", event)
      setSession(session)
      
      if (event === 'SIGNED_IN' && session) {
        console.log("User signed in, resetting credits to logged-in limit")
        await resetCredits()
        broadcastChannel.postMessage({ type: 'SIGNED_IN' })
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out, resetting credits to non-logged-in limit")
        await resetCredits()
        broadcastChannel.postMessage({ type: 'SIGNED_OUT' })
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      handleAuthChange(event, session)
    })

    // Listen for broadcast messages from other tabs
    broadcastChannel.onmessage = async (event) => {
      console.log("Received broadcast message:", event.data)
      if (event.data.type === 'SIGNED_IN' || event.data.type === 'SIGNED_OUT') {
        await resetCredits()
      }
    }

    // Initialize credits based on current session
    const initializeCredits = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      await resetCredits()
    }

    initializeCredits()

    return () => {
      subscription.unsubscribe()
      broadcastChannel.close()
    }
  }, [])

  return (
    <CreditsContext.Provider value={{ credits, setCredits, resetCredits, useCredit }}>
      {children}
    </CreditsContext.Provider>
  )
}

export function useCredits() {
  const context = useContext(CreditsContext)
  if (context === undefined) {
    throw new Error("useCredits must be used within a CreditsProvider")
  }
  return context
}