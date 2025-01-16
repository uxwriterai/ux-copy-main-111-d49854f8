import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type UserCredits = Database['public']['Tables']['user_credits']['Row'];

export async function getUserCredits(ipAddress: string): Promise<number> {
  console.log("Fetching credits for IP:", ipAddress);
  
  const { data, error } = await supabase
    .from('user_credits')
    .select('credits_remaining')
    .eq('ip_address', ipAddress)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user credits:', error);
    return 2; // Default credits for new users
  }

  console.log("Credits data from DB:", data);
  return data?.credits_remaining ?? 2;
}

export async function updateUserCredits(ipAddress: string, newCredits: number) {
  console.log("Updating credits for IP:", ipAddress, "to:", newCredits);
  
  const { error } = await supabase
    .from('user_credits')
    .upsert(
      { 
        ip_address: ipAddress, 
        credits_remaining: newCredits 
      },
      { 
        onConflict: 'ip_address'
      }
    );

  if (error) {
    console.error('Error updating user credits:', error);
    throw error;
  }

  console.log("Credits updated successfully");
}

export async function getGeminiApiKey() {
  const { data, error } = await supabase
    .from('api_keys')
    .select('key_value')
    .eq('key_name', 'GEMINI_API_KEY')
    .single();

  if (error) {
    console.error('Error fetching Gemini API key:', error);
    throw error;
  }

  return data.key_value;
}