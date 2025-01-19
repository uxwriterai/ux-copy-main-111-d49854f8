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
    
    // If user is logged in, ONLY fetch user-based credits
    if (userId) {
      console.log('User is logged in, fetching ONLY user-based credits');
      const { data, error } = await supabase
        .from('user_credits')
        .select('credits_remaining')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching user credits:', error);
        throw error;
      }
      
      console.log('User-based credits data:', data);
      return data?.credits_remaining ?? null;
    } 
    
    // Only fetch IP-based credits if there is NO user ID
    const ipAddress = await getIpAddress();
    console.log('Anonymous user, fetching IP-based credits for:', ipAddress);
    
    const { data, error } = await supabase
      .from('user_credits')
      .select('credits_remaining')
      .eq('ip_address', ipAddress)
      .is('user_id', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching IP-based credits:', error);
      throw error;
    }
    
    console.log('IP-based credits data:', data);
    return data?.credits_remaining ?? null;
  } catch (error) {
    console.error("Error in fetchUserCredits:", error);
    throw error;
  }
};

export const updateCredits = async (newCredits: number, userId?: string | null): Promise<void> => {
  try {
    console.log('Updating credits:', { newCredits, userId });
    
    // For logged-in users, only update user-based credits
    if (userId) {
      console.log('Updating ONLY user-based credits for user:', userId);
      
      const { error: updateError } = await supabase
        .from('user_credits')
        .upsert({
          user_id: userId,
          credits_remaining: newCredits
        });

      if (updateError) {
        console.error("Error updating user credits:", updateError);
        throw updateError;
      }
      
      console.log('Successfully updated credits for user:', userId);
      return;
    }
    
    // Only handle IP-based credits if there is NO user ID
    const ipAddress = await getIpAddress();
    console.log('Anonymous user, updating IP-based credits for:', ipAddress);
    
    const { error: upsertError } = await supabase
      .from('user_credits')
      .upsert({
        ip_address: ipAddress,
        credits_remaining: newCredits,
        user_id: null
      });

    if (upsertError) {
      console.error("Error upserting IP credits:", upsertError);
      throw upsertError;
    }
    
    console.log('Successfully updated credits for IP:', ipAddress);
  } catch (error) {
    console.error("Error in updateCredits:", error);
    throw error;
  }
};