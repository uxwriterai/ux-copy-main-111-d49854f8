import { supabase } from "@/integrations/supabase/client";

export const getIpAddress = async (): Promise<string> => {
  try {
    console.log('[creditsService] Fetching IP address');
    const response = await fetch('/api/get-ip');
    
    if (!response.ok) {
      console.error('[creditsService] Error fetching IP:', response.status, response.statusText);
      throw new Error(`Failed to fetch IP: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('[creditsService] Invalid content type:', contentType);
      throw new Error('Invalid response format');
    }

    const { ip } = await response.json();
    console.log('[creditsService] Successfully fetched IP:', ip);
    return ip;
  } catch (error) {
    console.error('[creditsService] Error in getIpAddress:', error);
    return 'unknown';
  }
};

export const fetchUserCredits = async (userId: string | null): Promise<number | null> => {
  try {
    console.log('[creditsService] Fetching credits for user:', userId);
    
    if (userId) {
      const { data, error } = await supabase
        .from('user_credits')
        .select('credits_remaining')
        .eq('user_id', userId)
        .single();
      
      if (error) {
        console.error('[creditsService] Error fetching user credits:', error);
        return null;
      }

      console.log('[creditsService] Found credits for user:', data?.credits_remaining);
      return data?.credits_remaining ?? null;
    }

    const ipAddress = await getIpAddress();
    console.log('[creditsService] Fetching credits for IP:', ipAddress);
    
    const { data, error } = await supabase
      .from('user_credits')
      .select('credits_remaining')
      .eq('ip_address', ipAddress)
      .single();
    
    if (error) {
      console.error('[creditsService] Error fetching IP credits:', error);
      return null;
    }

    console.log('[creditsService] Found credits for IP:', data?.credits_remaining);
    return data?.credits_remaining ?? null;
  } catch (error) {
    console.error('[creditsService] Error in fetchUserCredits:', error);
    return null;
  }
};

export const updateCredits = async (newCredits: number, userId: string | null): Promise<boolean> => {
  try {
    console.log('[creditsService] Updating credits:', { newCredits, userId });
    
    if (userId) {
      const { error } = await supabase
        .from('user_credits')
        .upsert({
          user_id: userId,
          credits_remaining: newCredits
        });
        
      if (error) {
        console.error('[creditsService] Error updating user credits:', error);
        return false;
      }
    } else {
      const ipAddress = await getIpAddress();
      console.log('[creditsService] Updating credits for IP:', ipAddress);
      
      const { error } = await supabase
        .from('user_credits')
        .upsert({
          ip_address: ipAddress,
          credits_remaining: newCredits
        });
        
      if (error) {
        console.error('[creditsService] Error updating IP credits:', error);
        return false;
      }
    }
    
    console.log('[creditsService] Successfully updated credits');
    return true;
  } catch (error) {
    console.error('[creditsService] Error in updateCredits:', error);
    return false;
  }
};