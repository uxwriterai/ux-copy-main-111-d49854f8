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
      // For logged-in users, fetch by user_id
      const { data, error } = await supabase
        .from('user_credits')
        .select('credits_remaining')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      console.log('User-based credits data:', data);
      return data?.credits_remaining ?? null;
    } else {
      // For anonymous users, fetch by IP
      const ipAddress = await getIpAddress();
      console.log('Fetching credits for IP:', ipAddress);
      
      const { data, error } = await supabase
        .from('user_credits')
        .select('credits_remaining')
        .eq('ip_address', ipAddress)
        .is('user_id', null)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      console.log('IP-based credits data:', data);
      return data?.credits_remaining ?? null;
    }
  } catch (error) {
    console.error("Error in fetchUserCredits:", error);
    throw error;
  }
};

export const updateCredits = async (newCredits: number, userId?: string | null): Promise<void> => {
  try {
    console.log('Updating credits:', { newCredits, userId });
    
    if (userId) {
      // For logged-in users, upsert by user_id
      const { error } = await supabase
        .from('user_credits')
        .upsert({
          user_id: userId,
          credits_remaining: newCredits
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
    } else {
      // For anonymous users, upsert by IP
      const ipAddress = await getIpAddress();
      console.log('Updating credits for IP:', ipAddress);
      
      const { error } = await supabase
        .from('user_credits')
        .upsert({
          ip_address: ipAddress,
          credits_remaining: newCredits,
          user_id: null
        }, {
          onConflict: 'ip_address'
        });

      if (error) throw error;
    }

    console.log('Credits updated successfully');
  } catch (error) {
    console.error("Error in updateCredits:", error);
    throw error;
  }
};