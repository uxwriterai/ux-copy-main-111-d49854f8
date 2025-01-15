import { supabase } from "@/integrations/supabase/client";

export async function getUserCredits(ipAddress: string) {
  const { data, error } = await supabase
    .from('user_credits')
    .select('credits_remaining')
    .eq('ip_address', ipAddress)
    .single();

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
        onConflict: 'ip_address',
        ignoreDuplicates: false 
      }
    );

  if (error) {
    console.error('Error updating user credits:', error);
    throw error;
  }
}

export async function getGeminiApiKey() {
  const { data: { value } } = await supabase
    .functions.invoke('get-gemini-key');
  
  return value;
}