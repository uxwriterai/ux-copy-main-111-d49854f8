import { supabase } from "@/integrations/supabase/client";

// Add an interceptor to check if we should skip IP operations
let shouldSkipIpOperations = false;

export const setSkipIpOperations = (userId: string | null | undefined) => {
  shouldSkipIpOperations = !!userId;
  console.log('[creditsService] IP operations skip status:', shouldSkipIpOperations, 'for userId:', userId);
};

export const getIpAddress = async (): Promise<string> => {
  // Skip IP fetch if user is logged in
  if (shouldSkipIpOperations) {
    console.log('[creditsService] Skipping IP address fetch - user is logged in');
    return '';
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
    
    // If user is logged in, ONLY fetch user-based credits and return immediately
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

    // Only execute this block for anonymous users
    if (shouldSkipIpOperations) {
      console.log('[creditsService] Skipping IP-based credits fetch - user is logged in');
      return null;
    }

    console.log('Anonymous user, proceeding with IP-based credits');
    const ipAddress = await getIpAddress();
    console.log('Fetching IP-based credits for:', ipAddress);
    
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
    setSkipIpOperations(userId);
    
    // For logged-in users, only update user-based credits
    if (userId) {
      console.log('Updating ONLY user-based credits for user:', userId);
      
      const { error: updateError } = await supabase
        .from('user_credits')
        .upsert([{
          user_id: userId,
          credits_remaining: newCredits
        }]);

      if (updateError) {
        console.error("Error updating user credits:", updateError);
        throw updateError;
      }
      
      console.log('Successfully updated credits for user:', userId);
      return;
    }
    
    // Only handle IP-based credits for anonymous users
    if (shouldSkipIpOperations) {
      console.log('[creditsService] Skipping IP-based credits update - user is logged in');
      return;
    }

    const ipAddress = await getIpAddress();
    console.log('Anonymous user, updating IP-based credits for:', ipAddress);
    
    const { error: updateError } = await supabase
      .from('user_credits')
      .upsert([{
        ip_address: ipAddress,
        credits_remaining: newCredits,
        user_id: null
      }]);

    if (updateError) {
      console.error("Error updating IP credits:", updateError);
      throw updateError;
    }
    
    console.log('Successfully updated credits for IP:', ipAddress);
  } catch (error) {
    console.error("Error in updateCredits:", error);
    throw error;
  }
};