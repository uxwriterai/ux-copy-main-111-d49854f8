import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { useSessionContext } from "@supabase/auth-helpers-react"
import { useCredits } from "@/contexts/CreditsContext"
import { getAnonymousCredits } from "@/utils/anonymousCredits"

export const useSignOut = () => {
  const [isSigningOut, setIsSigningOut] = useState(false)
  const navigate = useNavigate()
  const { setSession } = useSessionContext()
  const { resetCredits } = useCredits()

  const handleSignOut = async () => {
    if (isSigningOut) return
    
    console.log("Attempting to sign out...")
    setIsSigningOut(true)

    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error("Sign out error:", error)
        toast.error("Failed to sign out")
        setIsSigningOut(false)
        return
      }

      // Reset session state
      setSession(null)
      
      // Reset credits to anonymous state
      await getAnonymousCredits()
      resetCredits()
      
      // Navigate to home
      navigate('/')
      
      setIsSigningOut(false)
      toast.success('Signed out successfully')

    } catch (error) {
      console.error("Sign out error:", error)
      toast.error("An error occurred while signing out")
      setIsSigningOut(false)
    }
  }

  return {
    isSigningOut,
    handleSignOut
  }
}