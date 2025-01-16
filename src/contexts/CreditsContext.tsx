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

  const resetCredits = async () => {
    console.log("Resetting credits...")
    try {
      if (session?.user) {
        // For logged-in users, check their credits in the database
        const { data: userData, error } = await supabase
          .from('user_credits')
          .select('credits_remaining')
          .eq('user_id', session.user.id)
          .single()

        if (error) {
          console.error("Error fetching user credits:", error)
          setCredits(8) // Default for new logged-in users
          await supabase
            .from('user_credits')
            .upsert({
              user_id: session.user.id,
              credits_remaining: 8
            })
        } else {
          console.log("Setting credits to user-based credits:", userData.credits_remaining)
          setCredits(userData.credits_remaining)
        }
      } else {
        // For non-logged-in users, use IP-based credits
        const response = await fetch('https://api.ipify.org?format=json')
        const data = await response.json()
        const ipAddress = data.ip
        console.log("User IP address:", ipAddress)

        const ipCredits = await getUserCredits(ipAddress)
        console.log("Credits found for IP:", ipCredits)

        if (ipCredits > 0) {
          console.log("Setting credits to IP-based credits:", ipCredits)
          setCredits(ipCredits)
        } else {
          console.log("Setting credits to default value (2)")
          setCredits(2)
          await supabase
            .from('user_credits')
            .upsert({
              ip_address: ipAddress,
              credits_remaining: 2
            })
        }
      }
    } catch (error) {
      console.error("Error resetting credits:", error)
      setCredits(session?.user ? 8 : 2)
    }
  }

  const useCredit = async () => {
    if (credits <= 0) {
      toast.error("No credits remaining!")
      return false
    }

    try {
      console.log("Using 1 credit. Credits before:", credits)
      
      if (session?.user) {
        // For logged-in users, update credits in Supabase with user_id
        const { data: userData, error: userError } = await supabase
          .from('user_credits')
          .upsert({ 
            user_id: session.user.id,
            credits_remaining: credits - 1 
          })
          .select()
          .single()

        if (userError) {
          console.error("Error updating user credits:", userError)
          toast.error("Error updating credits. Please try again.")
          return false
        }

        setCredits(userData.credits_remaining)
      } else {
        // For non-logged-in users, update credits based on IP
        const response = await fetch('https://api.ipify.org?format=json')
        const data = await response.json()
        const ipAddress = data.ip

        await updateUserCredits(ipAddress, credits - 1)
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
        console.log("User signed in, setting credits to 8")
        
        // Initialize credits for new user
        const { error } = await supabase
          .from('user_credits')
          .upsert({ 
            user_id: session.user.id,
            credits_remaining: 8 
          })

        if (error) {
          console.error("Error initializing user credits:", error)
        }

        setCredits(8)
        broadcastChannel.postMessage({ type: 'SIGNED_IN' })
      } else if (event === 'SIGNED_OUT') {
        console.log("User signed out, resetting credits")
        await resetCredits()
        broadcastChannel.postMessage({ type: 'SIGNED_OUT' })
      }
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      handleAuthChange(event, session)
    })

    // Listen for broadcast messages from other tabs
    broadcastChannel.onmessage = async (event) => {
      console.log("Received broadcast message:", event.data)
      if (event.data.type === 'SIGNED_IN') {
        setCredits(8)
      } else if (event.data.type === 'SIGNED_OUT') {
        await resetCredits()
      }
    }

    // Initialize credits based on current session
    const initializeCredits = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      
      if (!session) {
        console.log("No session found, resetting credits")
        await resetCredits()
      } else {
        // Get credits for logged-in user
        const { data: userData, error } = await supabase
          .from('user_credits')
          .select('credits_remaining')
          .eq('user_id', session.user.id)
          .single()

        if (error || !userData) {
          console.log("No credits found for user, initializing with 8")
          setCredits(8)
          // Initialize credits for new user
          await supabase
            .from('user_credits')
            .upsert({ 
              user_id: session.user.id,
              credits_remaining: 8 
            })
        } else {
          console.log("Found existing credits:", userData.credits_remaining)
          setCredits(userData.credits_remaining)
        }
      }
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