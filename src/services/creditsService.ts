import { supabase } from "@/integrations/supabase/client";

export const getIpAddress = async (): Promise<string> => {
  try {
    const { data: { ip } } = await fetch('/api/get-ip').then(res => res.json());
    console.log('Fetched IP address:', ip);
    return ip;
  } catch (error) {
    console.error('Error fetching IP address:', error);
    throw error;
  }
};

export const fetchUserCredits = async (userId: string | null): Promise<number | null> => {
  try {
    if (userId) {
      const { data, error } = await supabase
        .from('user_credits')
        .select('credits_remaining')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching credits:', error);
        return null;
      }

      return data?.credits_remaining ?? null;
    }

    const ipAddress = await getIpAddress();
    const { data, error } = await supabase
      .from('user_credits')
      .select('credits_remaining')
      .eq('ip_address', ipAddress)
      .single();
    
    if (error) {
      console.error('Error fetching credits:', error);
      return null;
    }

    return data?.credits_remaining ?? null;
  } catch (error) {
    console.error('Error in fetchUserCredits:', error);
    return null;
  }
};

export const updateCredits = async (newCredits: number, userId: string | null): Promise<boolean> => {
  try {
    if (userId) {
      const { error } = await supabase
        .from('user_credits')
        .upsert({
          user_id: userId,
          credits_remaining: newCredits
        })
        .eq('user_id', userId);
        
      if (error) {
        console.error('Error in updateCredits:', error);
        return false;
      }
    } else {
      const ipAddress = await getIpAddress();
      const { error } = await supabase
        .from('user_credits')
        .upsert({
          ip_address: ipAddress,
          credits_remaining: newCredits
        })
        .eq('ip_address', ipAddress);
        
      if (error) {
        console.error('Error in updateCredits:', error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateCredits:', error);
    return false;
  }
};