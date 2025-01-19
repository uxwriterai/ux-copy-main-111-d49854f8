import { supabase } from "@/integrations/supabase/client";

// Add an interceptor to check if we should skip IP operations
let shouldSkipIpOperations = false;

export const setSkipIpOperations = (userId: string | null | undefined) => {
  shouldSkipIpOperations = !!userId;
  console.log('[creditsService] IP operations skip status:', shouldSkipIpOperations, 'for userId:', userId);
};

export const getIpAddress = async (): Promise<string> => {
  // Block IP-based operations if user is authenticated
  if (shouldSkipIpOperations) {
    console.log('[creditsService] Blocking IP fetch - user is authenticated');
    throw new Error('IP operations blocked - user is authenticated');
  }

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
    setSkipIpOperations(userId);
    
    // If user is logged in, ONLY fetch user-based credits
    if (userId) {
      console.log('User is logged in, fetching ONLY user-based credits');
      const { data, error } = await supabase
        .from('user_credits')
        .select('credits_remaining')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching user credits:', error);
        throw error;
      }
      
      console.log('User-based credits data:', data);
      return data?.credits_remaining ?? null;
    }

    // Only execute IP-based credits fetch if userId is explicitly null or undefined
    if (!userId) {
      console.log('Anonymous user, proceeding with IP-based credits');
      const ipAddress = await getIpAddress();
      console.log('Fetching IP-based credits for:', ipAddress);
      
      const { data, error } = await supabase
        .from('user_credits')
        .select('credits_remaining')
        .eq('ip_address', ipAddress)
        .is('user_id', null)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching IP-based credits:', error);
        throw error;
      }
      
      console.log('IP-based credits data:', data);
      return data?.credits_remaining ?? null;
    }

    console.log('No valid user ID or IP-based credits scenario, returning null');
    return null;
  } catch (error) {
    console.error("Error in fetchUserCredits:", error);
    throw error;
  }
};

export const updateCredits = async (newCredits: number, userId?: string | null): Promise<void> => {
  try {
    console.log('Updating credits:', { newCredits, userId });
    setSkipIpOperations(userId);
    
    // For logged-in users, only update user-based credits
    if (userId) {
      console.log('Updating ONLY user-based credits for user:', userId);
      
      const { error: upsertError } = await supabase
        .from('user_credits')
        .upsert({
          user_id: userId,
          credits_remaining: newCredits
        }, {
          onConflict: 'user_id'
        });

      if (upsertError) {
        console.error("Error updating user credits:", upsertError);
        throw upsertError;
      }
      
      console.log('Successfully updated credits for user:', userId);
      return;
    }

    // Only handle IP-based credits when userId is explicitly null or undefined
    if (!userId) {
      console.log('Anonymous user, updating IP-based credits');
      const ipAddress = await getIpAddress();
      console.log('Updating IP-based credits for:', ipAddress);
      
      const { error: upsertError } = await supabase
        .from('user_credits')
        .upsert({
          ip_address: ipAddress,
          credits_remaining: newCredits,
          user_id: null
        });

      if (upsertError) {
        console.error("Error updating IP credits:", upsertError);
        throw upsertError;
      }
      
      console.log('Successfully updated credits for IP:', ipAddress);
    } else {
      console.log('Skipping credit update - no valid user ID or IP scenario');
    }
  } catch (error) {
    console.error("Error in updateCredits:", error);
    throw error;
  }
};