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
    console.log("Fetching IP address...");
    const response = await fetch('https://api.ipify.org?format=json');
    
    if (!response.ok) {
      console.error('IP address fetch failed:', response.status, response.statusText);
      throw new Error('Failed to fetch IP address');
    }
    
    const data = await response.json();
    console.log("IP address fetched:", data);
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP address:', error);
    throw error;
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

      let query = supabase
        .from('user_credits')
        .select('credits_remaining')
        .eq('ip_address', ipAddress)
      
      // Add user_id condition based on session
      if (session) {
        query = query.eq('user_id', session.user.id)
      } else {
        query = query.is('user_id', null)
      }

      const { data, error } = await query.maybeSingle()

      if (error) {
        console.error("Error fetching credits from Supabase:", error)
        throw error
      }

      if (!data) {
        // Create new credits entry
        const defaultCredits = session ? 6 : 2
        const { error: insertError } = await supabase
          .from('user_credits')
          .insert({
            ip_address: ipAddress,
            credits_remaining: defaultCredits,
            user_id: session?.user?.id || null
          })

        if (insertError) {
          console.error("Error creating credits:", insertError)
          throw insertError
        }

        setCredits(defaultCredits)
      } else {
        setCredits(data.credits_remaining)
      }
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

      if (session) {
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
      const maxCredits = session ? 6 : 2

      let query = supabase
        .from('user_credits')
        .update({ credits_remaining: maxCredits })
        .eq('ip_address', ipAddress)

      if (session) {
        query = query.eq('user_id', session.user.id)
      } else {
        query = query.is('user_id', null)
      }

      const { error } = await query

      if (error) {
        console.error("Error resetting credits:", error)
        throw error
      }

      setCredits(maxCredits)
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