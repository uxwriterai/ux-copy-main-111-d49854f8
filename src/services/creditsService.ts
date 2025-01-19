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
    
    if (userId) {
      console.log('User is logged in, fetching ONLY user-based credits');
      const { data, error } = await supabase
        .from('user_credits')
        .select('credits_remaining')
        .eq('user_id', userId)
        .is('ip_address', null)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching user credits:', error);
        throw error;
      }
      
      console.log('User-based credits data:', data);
      return data?.credits_remaining ?? null;
    }

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
    
    if (userId) {
      console.log('Updating ONLY user-based credits for user:', userId);
      
      // First try to update existing record
      const { error: updateError } = await supabase
        .from('user_credits')
        .update({ credits_remaining: newCredits })
        .eq('user_id', userId)
        .is('ip_address', null);

      if (updateError) {
        // If update fails (no record exists), try to insert
        const { error: insertError } = await supabase
          .from('user_credits')
          .insert({
            user_id: userId,
            ip_address: null,
            credits_remaining: newCredits
          })
          .select()
          .single();

        if (insertError) {
          if (insertError.code === '23505') {
            // If we hit a race condition where record was created between our update and insert
            // Try the update one more time
            const { error: finalUpdateError } = await supabase
              .from('user_credits')
              .update({ credits_remaining: newCredits })
              .eq('user_id', userId)
              .is('ip_address', null);

            if (finalUpdateError) throw finalUpdateError;
          } else {
            throw insertError;
          }
        }
      }
      
      console.log('Successfully updated credits for user:', userId);
      return;
    }

    if (!userId) {
      console.log('Anonymous user, updating IP-based credits');
      const ipAddress = await getIpAddress();
      console.log('Updating IP-based credits for:', ipAddress);
      
      const { error: updateError } = await supabase
        .from('user_credits')
        .update({ credits_remaining: newCredits })
        .eq('ip_address', ipAddress)
        .is('user_id', null);

      if (updateError) {
        const { error: insertError } = await supabase
          .from('user_credits')
          .insert({
            ip_address: ipAddress,
            credits_remaining: newCredits,
            user_id: null
          })
          .select()
          .single();

        if (insertError) {
          if (insertError.code === '23505') {
            // Handle race condition
            const { error: finalUpdateError } = await supabase
              .from('user_credits')
              .update({ credits_remaining: newCredits })
              .eq('ip_address', ipAddress)
              .is('user_id', null);

            if (finalUpdateError) throw finalUpdateError;
          } else {
            throw insertError;
          }
        }
      }
      
      console.log('Successfully updated credits for IP:', ipAddress);
    }
  } catch (error) {
    console.error("Error in updateCredits:", error);
    throw error;
  }
};