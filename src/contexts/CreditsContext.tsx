import { createContext, useContext, useEffect, useState } from "react"
import { Session } from "@supabase/supabase-js"
import { supabase } from "@/integrations/supabase/client"
import { toast } from "sonner"

interface CreditsContextType {
  credits: number
  useCredit: () => Promise<boolean>
  resetCredits: () => void
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

export function CreditsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [credits, setCredits] = useState(2)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchCredits = async () => {
    try {
      console.log("Fetching credits...")
      const ipAddress = await getIpAddress()
      console.log("IP address for credits:", ipAddress)

      let query = supabase
        .from('user_credits')
        .select('credits_remaining')

      // If user is logged in, query by user_id
      if (session?.user) {
        console.log("Fetching credits for user:", session.user.id)
        query = query.eq('user_id', session.user.id)
      } else {
        // Otherwise query by IP
        console.log("Fetching credits for IP:", ipAddress)
        query = query.eq('ip_address', ipAddress).is('user_id', null)
      }

      const { data, error } = await query.single()

      if (error) {
        console.log("No existing credits found, creating new entry")
        // If no credits found, create new entry
        const initialCredits = session?.user ? 6 : 2
        const { data: newCredits, error: insertError } = await supabase
          .from('user_credits')
          .insert({
            ip_address: ipAddress,
            credits_remaining: initialCredits,
            user_id: session?.user?.id || null
          })
          .select('credits_remaining')
          .single()

        if (insertError) {
          console.error("Error creating credits:", insertError)
          throw insertError
        }

        console.log("New credits created:", newCredits)
        setCredits(initialCredits)
      } else {
        console.log("Existing credits found:", data)
        setCredits(data.credits_remaining)
      }
    } catch (error) {
      console.error("Error in fetchCredits:", error)
      toast.error("Failed to fetch credits")
    } finally {
      setLoading(false)
    }
  }

  const useCredit = async (): Promise<boolean> => {
    try {
      if (credits <= 0) {
        return false
      }

      const ipAddress = await getIpAddress()
      let query = supabase
        .from('user_credits')
        .update({ credits_remaining: credits - 1 })

      if (session?.user) {
        query = query.eq('user_id', session.user.id)
      } else {
        query = query.eq('ip_address', ipAddress).is('user_id', null)
      }

      const { error } = await query

      if (error) {
        console.error("Error using credit:", error)
        throw error
      }

      setCredits(prev => prev - 1)
      return true
    } catch (error) {
      console.error("Error in useCredit:", error)
      toast.error("Failed to use credit")
      return false
    }
  }

  const resetCredits = () => {
    console.log("Resetting credits state")
    setCredits(2)
  }

  // Initialize session state
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session:", session)
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", _event, session)
      setSession(session)

      if (_event === 'SIGNED_IN') {
        // Fetch or create credits for new user
        const ipAddress = await getIpAddress()
        const { data: existingCredits } = await supabase
          .from('user_credits')
          .select('credits_remaining')
          .eq('user_id', session.user.id)
          .single()

        if (!existingCredits) {
          console.log("Creating credits for new user")
          const { error: insertError } = await supabase
            .from('user_credits')
            .insert({
              ip_address: ipAddress,
              credits_remaining: 6,
              user_id: session.user.id
            })

          if (insertError) {
            console.error("Error creating user credits:", insertError)
            toast.error("Failed to initialize credits")
          } else {
            setCredits(6)
          }
        } else {
          setCredits(existingCredits.credits_remaining)
        }
      } else if (_event === 'SIGNED_OUT') {
        // Restore IP-based credits
        fetchCredits()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  // Fetch initial credits
  useEffect(() => {
    if (!loading) {
      fetchCredits()
    }
  }, [session, loading])

  const value = {
    credits,
    useCredit,
    resetCredits,
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
