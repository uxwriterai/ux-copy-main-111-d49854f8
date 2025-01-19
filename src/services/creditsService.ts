import { supabase } from "@/integrations/supabase/client";

// Add an interceptor to check if we should skip IP operations
let shouldSkipIpOperations = false;

export const setSkipIpOperations = (userId: string | null | undefined) => {
  shouldSkipIpOperations = !!userId;
  console.log('[creditsService] IP operations skip status:', shouldSkipIpOperations, 'for userId:', userId);
};

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
    setSkipIpOperations(userId);
    
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
        .order('created_at', { ascending: false })
        .limit(1)
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
      
      // First check if a record exists
      const { data: existingRecord } = await supabase
        .from('user_credits')
        .select('id')
        .eq('user_id', userId)
        .single();

      let updateError;
      
      if (existingRecord) {
        // Update existing record
        console.log('Updating existing record for user:', userId);
        const { error } = await supabase
          .from('user_credits')
          .update({ credits_remaining: newCredits })
          .eq('user_id', userId);
        updateError = error;
      } else {
        // Insert new record
        console.log('Creating new record for user:', userId);
        const { error } = await supabase
          .from('user_credits')
          .insert([{
            user_id: userId,
            credits_remaining: newCredits
          }]);
        updateError = error;
      }

      if (updateError) {
        console.error("Error updating user credits:", updateError);
        throw updateError;
      }
      
      console.log('Successfully updated credits for user:', userId);
      return;
    }

    // Only handle IP-based credits when userId is explicitly null or undefined
    if (!userId) {
      console.log('Anonymous user, updating IP-based credits');
      const ipAddress = await getIpAddress();
      console.log('Updating IP-based credits for:', ipAddress);
      
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
    } else {
      console.log('Skipping credit update - no valid user ID or IP scenario');
    }
  } catch (error) {
    console.error("Error in updateCredits:", error);
    throw error;
  }
};