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
      
      // First, check if a record exists
      const { data: existingRecord, error: fetchError } = await supabase
        .from('user_credits')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (fetchError) {
        console.error("Error checking existing user credits:", fetchError);
        throw fetchError;
      }

      if (existingRecord) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('user_credits')
          .update({ credits_remaining: newCredits })
          .eq('user_id', userId);

        if (updateError) {
          console.error("Error updating user credits:", updateError);
          throw updateError;
        }
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('user_credits')
          .insert([{
            user_id: userId,
            credits_remaining: newCredits
          }]);

        if (insertError) {
          console.error("Error inserting user credits:", insertError);
          throw insertError;
        }
      }
      
      console.log('Successfully updated credits for user:', userId);
      return;
    }
    
    // Only handle IP-based credits if there is NO user ID
    const ipAddress = await getIpAddress();
    console.log('Anonymous user, updating IP-based credits for:', ipAddress);
    
    // First, check if a record exists
    const { data: existingRecord, error: fetchError } = await supabase
      .from('user_credits')
      .select('id')
      .eq('ip_address', ipAddress)
      .is('user_id', null)
      .maybeSingle();

    if (fetchError) {
      console.error("Error checking existing IP credits:", fetchError);
      throw fetchError;
    }

    if (existingRecord) {
      // Update existing record
      const { error: updateError } = await supabase
        .from('user_credits')
        .update({ credits_remaining: newCredits })
        .eq('ip_address', ipAddress)
        .is('user_id', null);

      if (updateError) {
        console.error("Error updating IP credits:", updateError);
        throw updateError;
      }
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from('user_credits')
        .insert([{
          ip_address: ipAddress,
          credits_remaining: newCredits,
          user_id: null
        }]);

      if (insertError) {
        console.error("Error inserting IP credits:", insertError);
        throw insertError;
      }
    }
    
    console.log('Successfully updated credits for IP:', ipAddress);
  } catch (error) {
    console.error("Error in updateCredits:", error);
    throw error;
  }
};