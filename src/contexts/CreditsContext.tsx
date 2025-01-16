import { createContext, useContext, useEffect, useState } from "react"
import { Session, User } from "@supabase/supabase-js"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface CreditsContextType {
  credits: number
  useCredit: () => Promise<boolean>
  resetCredits: () => void
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined)

async function getIpAddress() {
  try {
    const response = await fetch("https://api.ipify.org?format=json")
    const data = await response.json()
    return data.ip
  } catch (error) {
    console.error("Error getting IP address:", error)
    return null
  }
}

export function CreditsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [credits, setCredits] = useState<number | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchCredits = async () => {
    try {
      console.log("Fetching credits")
      const ipAddress = await getIpAddress()
      
      if (!ipAddress) {
        console.error("Could not get IP address")
        return
      }

      let query = supabase
        .from('user_credits')
        .select('*')

      if (session?.user) {
        // For authenticated users, get their credits
        query = query.eq('user_id', session.user.id)
      } else {
        // For anonymous users, get credits by IP
        query = query.eq('ip_address', ipAddress)
      }

      const { data, error } = await query.maybeSingle()

      if (error) {
        throw error
      }

      if (!data) {
        // If no record exists, create one
        const initialCredits = session?.user ? 6 : 2
        const { data: newData, error: insertError } = await supabase
          .from('user_credits')
          .insert({
            ip_address: ipAddress,
            credits_remaining: initialCredits,
            user_id: session?.user?.id || null
          })
          .select()
          .single()

        if (insertError) {
          throw insertError
        }

        setCredits(initialCredits)
      } else {
        setCredits(data.credits_remaining)
      }
    } catch (error) {
      console.error("Error fetching credits:", error)
      toast.error("Failed to fetch credits")
    }
  }

  const useCredit = async (): Promise<boolean> => {
    if (!credits || credits <= 0) {
      return false
    }

    try {
      const ipAddress = await getIpAddress()
      let query = supabase
        .from('user_credits')
        .update({ credits_remaining: credits - 1 })

      if (session?.user) {
        query = query.eq('user_id', session.user.id)
      } else {
        query = query.eq('ip_address', ipAddress)
      }

      const { error } = await query

      if (error) {
        throw error
      }

      setCredits(prev => (prev !== null ? prev - 1 : null))
      return true
    } catch (error) {
      console.error("Error in useCredit:", error)
      return false
    }
  }

  const resetCredits = () => {
    console.log("Resetting credits state")
    setCredits(null)
    fetchCredits()
  }

  // Initialize session state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      console.log("Initial session:", initialSession)
      setSession(initialSession)
      setLoading(false)
    })
  }, [])

  // Listen for auth changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      console.log("Auth state changed:", _event, newSession)
      
      if (_event === 'SIGNED_IN') {
        // When user signs in, update their credits to 6 if they're a new user
        const ipAddress = await getIpAddress()
        if (ipAddress && newSession?.user) {
          const { data } = await supabase
            .from('user_credits')
            .select('*')
            .eq('user_id', newSession.user.id)
            .maybeSingle()

          if (!data) {
            // New user, set credits to 6
            await supabase
              .from('user_credits')
              .insert({
                ip_address: ipAddress,
                credits_remaining: 6,
                user_id: newSession.user.id
              })
          }
        }
      }

      if (_event === 'SIGNED_OUT') {
        // When user signs out, reset to IP-based credits
        resetCredits()
      }

      setSession(newSession)
    })

    return () => {
      console.log("Cleaning up auth subscription")
      subscription.unsubscribe()
    }
  }, [])

  // Fetch initial credits
  useEffect(() => {
    if (!loading && credits === null) {
      fetchCredits()
    }
  }, [session, loading, credits])

  const value = {
    credits: credits ?? 0,
    useCredit,
    resetCredits,
  }

  // Instead of returning null, we'll render the children with a loading state
  if (loading || credits === null) {
    return (
      <CreditsContext.Provider value={{ credits: 0, useCredit, resetCredits }}>
        {children}
      </CreditsContext.Provider>
    )
  }

  return (
    <CreditsContext.Provider value={value}>
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