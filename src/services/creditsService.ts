import { supabase } from "@/integrations/supabase/client";

export const getIpAddress = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    if (!response.ok) throw new Error('Failed to fetch IP address');
    const data = await response.json();
    console.log('Fetched IP address:', data.ip);
    return data.ip;
  } catch (error) {
    console.error("Error fetching IP address:", error);
    throw error;
  }
};

export const fetchUserCredits = async (userId?: string | null): Promise<number | null> => {
  try {
    console.log('Fetching credits for:', userId ? `user ${userId}` : 'anonymous user');
    
    if (userId) {
      // User is authenticated - fetch user-based credits
      const { data, error } = await supabase
        .from('user_credits')
        .select('credits_remaining')
        .eq('user_id', userId)
        .is('ip_address', null)
        .maybeSingle();
      
      if (error) throw error;
      return data?.credits_remaining ?? null;
    }

    // Anonymous user - fetch IP-based credits
    const ipAddress = await getIpAddress();
    const { data, error } = await supabase
      .from('user_credits')
      .select('credits_remaining')
      .eq('ip_address', ipAddress)
      .is('user_id', null)
      .maybeSingle();
    
    if (error) throw error;
    return data?.credits_remaining ?? null;
  } catch (error) {
    console.error("Error in fetchUserCredits:", error);
    throw error;
  }
};

export const updateCredits = async (newCredits: number, userId?: string | null): Promise<void> => {
  try {
    if (userId) {
      // For authenticated users
      const { data: existingData, error: selectError } = await supabase
        .from('user_credits')
        .select()
        .eq('user_id', userId)
        .is('ip_address', null)
        .maybeSingle();

      if (selectError) throw selectError;

      if (existingData) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('user_credits')
          .update({ credits_remaining: newCredits })
          .eq('user_id', userId)
          .is('ip_address', null);

        if (updateError) throw updateError;
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from('user_credits')
          .insert({
            user_id: userId,
            ip_address: null,
            credits_remaining: newCredits
          });
        
        if (insertError) throw insertError;
      }
    } else {
      // For anonymous users
      const ipAddress = await getIpAddress();
      
      const { data: existingData, error: selectError } = await supabase
        .from('user_credits')
        .select()
        .eq('ip_address', ipAddress)
        .is('user_id', null)
        .maybeSingle();

      if (selectError) throw selectError;

      if (existingData) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('user_credits')
          .update({ credits_remaining: newCredits })
          .eq('ip_address', ipAddress)
          .is('user_id', null);

        if (updateError) throw updateError;
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from('user_credits')
          .insert({
            ip_address: ipAddress,
            user_id: null,
            credits_remaining: newCredits
          });
        
        if (insertError) throw insertError;
      }
    }
  } catch (error) {
    console.error("Error in updateCredits:", error);
    throw error;
  }
};