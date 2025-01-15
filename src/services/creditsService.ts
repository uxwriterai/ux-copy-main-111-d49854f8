import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type UserCredits = Database['public']['Tables']['user_credits']['Row'];

export async function getUserCredits(ipAddress: string): Promise<number> {
  const { data, error } = await supabase
    .from('user_credits')
    .select('credits_remaining')
    .eq('ip_address', ipAddress)
    .maybeSingle();

  if (error) {
    console.error('Error fetching user credits:', error);
    return 4; // Default credits for new users
  }

  return data?.credits_remaining ?? 4;
}

export async function updateUserCredits(ipAddress: string, newCredits: number) {
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