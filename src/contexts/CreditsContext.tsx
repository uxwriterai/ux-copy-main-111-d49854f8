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
  const [credits, setCredits] = useState<number>(8)
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
        setCredits(8)
        return
      }

      const userCredits = await getUserCredits(ipAddress)
      console.log("Setting credits to:", userCredits)
      setCredits(userCredits)
    } catch (error) {
      console.error("Error resetting credits:", error)
      setCredits(8)
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

      await updateUserCredits(ipAddress, credits - 1)
      setCredits(credits - 1)
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
        console.log("User signed in, resetting credits")
        await resetCredits()
        broadcastChannel.postMessage({ type: 'SIGNED_IN' })
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out, resetting credits")
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