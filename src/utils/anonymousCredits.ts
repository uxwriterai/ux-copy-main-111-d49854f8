import { supabase } from "@/integrations/supabase/client"

export const getAnonymousCredits = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json')
    const { ip } = await response.json()
    
    const { data: anonCredits } = await supabase
      .from('user_credits')
      .select('credits_remaining')
      .is('user_id', null)
      .eq('ip_address', ip)
      .maybeSingle()
      
    return anonCredits?.credits_remaining || 2
  } catch (error) {
    console.error("Error fetching anonymous credits:", error)
    return 2 // Default anonymous credits
  }
}