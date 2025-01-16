import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type UserCredits = Database['public']['Tables']['user_credits']['Row'];

export async function getUserCredits(ipAddress: string): Promise<number> {
  console.log("Fetching credits for IP:", ipAddress);
  
  // First try to get user-based credits if logged in
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.user) {
    const { data, error } = await supabase
      .from('user_credits')
      .select('credits_remaining')
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (error) {
      console.error('Error fetching user credits:', error);
      return 8; // Default credits for new users
    }

    return data?.credits_remaining ?? 8;
  }

  // If not logged in, get IP-based credits
  const { data, error } = await supabase
    .from('user_credits')
    .select('credits_remaining')
    .eq('ip_address', ipAddress)
    .is('user_id', null)
    .maybeSingle();

  if (error) {
    console.error('Error fetching IP-based credits:', error);
    return 8; // Default credits for new users
  }

  console.log("Credits data from DB:", data);
  return data?.credits_remaining ?? 8;
}

export async function updateUserCredits(ipAddress: string, newCredits: number) {
  console.log("Updating credits to:", newCredits);
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session?.user) {
    // Update user-based credits
    const { error } = await supabase
      .from('user_credits')
      .upsert(
        { 
          user_id: session.user.id,
          credits_remaining: newCredits,
          ip_address: ipAddress // Keep track of last IP used
        },
        { 
          onConflict: 'user_id'
        }
      );

    if (error) {
      console.error('Error updating user credits:', error);
      throw error;
    }
  } else {
    // Update IP-based credits
    const { error } = await supabase
      .from('user_credits')
      .upsert(
        { 
          ip_address: ipAddress, 
          credits_remaining: newCredits,
          user_id: null
        },
        { 
          onConflict: 'ip_address'
        }
      );

    if (error) {
      console.error('Error updating IP-based credits:', error);
      throw error;
    }
  }

  console.log("Credits updated successfully");
}

export async function getGeminiApiKey(): Promise<string> {
  const { data, error } = await supabase
    .from('api_keys')
    .select('key_value')
    .eq('key_name', 'GEMINI_API_KEY')
    .maybeSingle();

  if (error) {
    console.error('Error fetching Gemini API key:', error);
    throw new Error('Failed to fetch API key');
  }

  if (!data?.key_value) {
    throw new Error('Gemini API key not found');
  }

  return data.key_value;
}