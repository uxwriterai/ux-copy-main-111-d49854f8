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
    const response = await fetch('https://api.ipify.org?format=json')
    const data = await response.json()
    return data.ip
  }

  const resetCredits = async () => {
    console.log("Resetting credits...")
    try {
      const ipAddress = await getIpAddress()
      
      if (session?.user) {
        // For logged-in users, check their credits in the database
        const { data: userData, error } = await supabase
          .from('user_credits')
          .select('credits_remaining')
          .eq('user_id', session.user.id)
          .single()

        if (error) {
          console.error("Error fetching user credits:", error)
          // For new logged-in users, upsert with onConflict handling
          const { error: upsertError } = await supabase
            .from('user_credits')
            .upsert(
              {
                user_id: session.user.id,
                credits_remaining: 8,
                ip_address: ipAddress
              },
              {
                onConflict: 'user_id',
                ignoreDuplicates: false
              }
            )
          
          if (upsertError) {
            console.error("Error upserting user credits:", upsertError)
            toast.error("Error initializing credits")
            return
          }
          setCredits(8)
        } else {
          console.log("Setting credits to user-based credits:", userData.credits_remaining)
          setCredits(userData.credits_remaining)
        }
      } else {
        // For non-logged-in users, use IP-based credits
        const { data: ipData, error: ipError } = await supabase
          .from('user_credits')
          .select('credits_remaining')
          .eq('ip_address', ipAddress)
          .is('user_id', null)
          .single()

        if (ipError) {
          console.log("No existing IP-based credits, creating new record")
          const { error: insertError } = await supabase
            .from('user_credits')
            .upsert(
              {
                ip_address: ipAddress,
                credits_remaining: 8,
                user_id: null
              },
              {
                onConflict: 'ip_address',
                ignoreDuplicates: false
              }
            )
          
          if (insertError) {
            console.error("Error inserting IP credits:", insertError)
            toast.error("Error initializing credits")
            return
          }
          setCredits(8)
        } else {
          console.log("Found existing IP credits:", ipData.credits_remaining)
          setCredits(ipData.credits_remaining)
        }
      }
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
      console.log("Using 1 credit. Credits before:", credits)
      const ipAddress = await getIpAddress()
      
      if (session?.user) {
        // For logged-in users, update credits with user_id
        const { error: updateError } = await supabase
          .from('user_credits')
          .upsert(
            { 
              user_id: session.user.id,
              credits_remaining: credits - 1,
              ip_address: ipAddress
            },
            {
              onConflict: 'user_id',
              ignoreDuplicates: false
            }
          )

        if (updateError) {
          console.error("Error updating user credits:", updateError)
          toast.error("Error updating credits. Please try again.")
          return false
        }

        setCredits(credits - 1)
      } else {
        // For non-logged-in users, update credits based on IP
        const { error: updateError } = await supabase
          .from('user_credits')
          .upsert(
            { 
              ip_address: ipAddress,
              credits_remaining: credits - 1,
              user_id: null
            },
            {
              onConflict: 'ip_address',
              ignoreDuplicates: false
            }
          )

        if (updateError) {
          console.error("Error updating IP credits:", updateError)
          toast.error("Error updating credits. Please try again.")
          return false
        }

        setCredits(credits - 1)
      }

      console.log("Credits after:", credits - 1)
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

    // Initialize credits immediately
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