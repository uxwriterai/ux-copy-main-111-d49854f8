import { createContext, useContext, useState, useEffect } from "react"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { getUserCredits } from "@/services/creditsService"

interface CreditsContextType {
  credits: number
  setCredits: (credits: number) => void
  resetCredits: () => void
  useCredit: () => boolean
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined)

export function CreditsProvider({ children }: { children: React.ReactNode }) {
  const [credits, setCredits] = useState<number>(15)

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
    console.log("Attempting to use a credit. Current credits:", credits)
    if (credits <= 0) {
      console.log("No credits remaining")
      toast.error("No credits remaining")
      return false
    }
    
    setCredits(prev => prev - 1)
    console.log("Credit used successfully. Remaining credits:", credits - 1)
    return true
  }

  // Initialize credits based on auth state
  useEffect(() => {
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