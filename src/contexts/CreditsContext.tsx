import { createContext, useContext, useState, useEffect } from "react"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { getUserCredits } from "@/services/creditsService"

interface CreditsContextType {
  credits: number
  setCredits: (credits: number) => void
  resetCredits: () => Promise<void>
  useCredit: () => boolean
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined)

export function CreditsProvider({ children }: { children: React.ReactNode }) {
  const [credits, setCredits] = useState<number>(15)
  const broadcastChannel = new BroadcastChannel('auth_channel')

  const resetCredits = async () => {
    console.log("Resetting credits...")
    try {
      // Get user's IP address
      const response = await fetch('https://api.ipify.org?format=json')
      const data = await response.json()
      const ipAddress = data.ip
      console.log("User IP address:", ipAddress)

      // Check if there are existing credits for this IP
      const ipCredits = await getUserCredits(ipAddress)
      console.log("Credits found for IP:", ipCredits)

      if (ipCredits > 0) {
        console.log("Setting credits to IP-based credits:", ipCredits)
        setCredits(ipCredits)
      } else {
        console.log("Setting credits to default value (4)")
        setCredits(4)
      }
    } catch (error) {
      console.error("Error resetting credits:", error)
      // If there's an error, default to 4 credits
      console.log("Error occurred, defaulting to 4 credits")
      setCredits(4)
    }
  }

  const useCredit = () => {
    if (credits <= 0) {
      toast.error("No credits left!")
      return false
    }

    console.log("Using 1 credit. Credits before:", credits)
    setCredits(credits - 1)
    console.log("Credits after:", credits - 1)
    return true
  }

  // Handle auth state changes
  useEffect(() => {
    const handleAuthChange = async (event: string) => {
      console.log("Auth state changed:", event)
      if (event === 'SIGNED_IN') {
        console.log("User signed in, setting credits to 15")
        setCredits(15)
        broadcastChannel.postMessage({ type: 'SIGNED_IN' })
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out, resetting credits")
        await resetCredits()
        broadcastChannel.postMessage({ type: 'SIGNED_OUT' })
      }
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      handleAuthChange(event)
    })

    // Listen for broadcast messages from other tabs
    broadcastChannel.onmessage = async (event) => {
      console.log("Received broadcast message:", event.data)
      if (event.data.type === 'SIGNED_IN') {
        setCredits(15)
      } else if (event.data.type === 'SIGNED_OUT') {
        await resetCredits()
      }
    }

    // Initialize credits based on current session
    const initializeCredits = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        console.log("No session found, resetting credits")
        await resetCredits()
      } else {
        console.log("Session found, setting credits to 15")
        setCredits(15)
      }
    }

    initializeCredits()

    // Cleanup
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