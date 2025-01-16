import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useSessionContext } from "@supabase/auth-helpers-react"
import { toast } from "sonner"

interface CreditsContextType {
  credits: number
  setCredits: (credits: number) => void
  useCredit: () => Promise<boolean>
  resetCredits: () => Promise<void>
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined)

const getIpAddress = async (): Promise<string> => {
  try {
    console.log("Fetching IP address...")
    const response = await fetch('https://api.ipify.org?format=json')
    
    if (!response.ok) {
      console.error('IP address fetch failed:', response.status, response.statusText)
      throw new Error('Failed to fetch IP address')
    }
    
    const data = await response.json()
    console.log("IP address fetched:", data)
    return data.ip
  } catch (error) {
    console.error('Error fetching IP address:', error)
    throw error
  }
}

export const CreditsProvider = ({ children }: { children: React.ReactNode }) => {
  const [credits, setCredits] = useState(0)
  const { session } = useSessionContext()

  const fetchCredits = async () => {
    try {
      const ipAddress = await getIpAddress()
      if (!ipAddress) {
        throw new Error('IP address not found')
      }

      // If user is logged in, try to get their credits first
      if (session?.user) {
        console.log("Fetching credits for logged-in user:", session.user.id)
        const { data: userCredits, error: userError } = await supabase
          .from('user_credits')
          .select('credits_remaining')
          .eq('user_id', session.user.id)
          .maybeSingle()

        if (userError) {
          console.error("Error fetching user credits:", userError)
          throw userError
        }

        // If no user credits found, create new entry with 6 credits for new signup
        if (!userCredits) {
          console.log("New user signup detected, setting 6 credits")
          const { error: insertError } = await supabase
            .from('user_credits')
            .insert({
              user_id: session.user.id,
              ip_address: ipAddress,
              credits_remaining: 6
            })

          if (insertError) {
            console.error("Error creating user credits:", insertError)
            throw insertError
          }

          setCredits(6)
          return
        }

        setCredits(userCredits.credits_remaining)
        return
      }

      // If not logged in, get IP-based credits
      console.log("Fetching IP-based credits for:", ipAddress)
      const { data: ipCredits, error: ipError } = await supabase
        .from('user_credits')
        .select('credits_remaining')
        .is('user_id', null)
        .eq('ip_address', ipAddress)
        .maybeSingle()

      if (ipError) {
        console.error("Error fetching IP credits:", ipError)
        throw ipError
      }

      if (!ipCredits) {
        // Create new IP-based credits entry with 2 credits
        const { error: insertError } = await supabase
          .from('user_credits')
          .insert({
            ip_address: ipAddress,
            credits_remaining: 2,
            user_id: null
          })

        if (insertError) {
          console.error("Error creating IP credits:", insertError)
          throw insertError
        }

        setCredits(2)
        return
      }

      setCredits(ipCredits.credits_remaining)
    } catch (error) {
      console.error("Error in fetchCredits:", error)
      toast.error("Error fetching credits. Please try again.")
    }
  }

  const useCredit = async (): Promise<boolean> => {
    try {
      const ipAddress = await getIpAddress()
      if (!credits || credits <= 0) {
        toast.error("No credits remaining")
        return false
      }

      let query = supabase
        .from('user_credits')
        .update({ credits_remaining: credits - 1 })
        .eq('ip_address', ipAddress)

      if (session?.user) {
        query = query.eq('user_id', session.user.id)
      } else {
        query = query.is('user_id', null)
      }

      const { error } = await query

      if (error) {
        console.error("Error updating credits:", error)
        throw error
      }

      setCredits(prev => prev - 1)
      return true
    } catch (error) {
      console.error("Error using credit:", error)
      toast.error("Error using credit. Please try again.")
      return false
    }
  }

  const resetCredits = async () => {
    try {
      const ipAddress = await getIpAddress()
      
      // If user is signing out, we need to get their IP-based credits
      const { data: ipCredits, error: ipError } = await supabase
        .from('user_credits')
        .select('credits_remaining')
        .is('user_id', null)
        .eq('ip_address', ipAddress)
        .maybeSingle()

      if (ipError) {
        console.error("Error fetching IP credits during reset:", ipError)
        throw ipError
      }

      const creditsToSet = ipCredits?.credits_remaining ?? 2

      console.log("Resetting credits to IP-based value:", creditsToSet)
      setCredits(creditsToSet)
    } catch (error) {
      console.error("Error in resetCredits:", error)
      toast.error("Error resetting credits. Please try again.")
    }
  }

  useEffect(() => {
    fetchCredits()
  }, [session])

  const value = {
    credits,
    setCredits,
    useCredit,
    resetCredits,
  }

  return (
    <CreditsContext.Provider value={value}>
      {children}
    </CreditsContext.Provider>
  )
}

export const useCredits = () => {
  const context = useContext(CreditsContext)
  if (context === undefined) {
    throw new Error("useCredits must be used within a CreditsProvider")
  }
  return context
}