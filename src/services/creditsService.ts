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
    } else {
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
      
      if (error) {
        console.error('Error fetching IP-based credits:', error);
        throw error;
      }
      
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
      // For logged-in users, use upsert with user_id
      const { error } = await supabase
        .from('user_credits')
        .upsert(
          { 
            user_id: userId, 
            credits_remaining: newCredits 
          },
          { 
            onConflict: 'user_credits_user_id_key'
          }
        );

      if (error) {
        console.error("Error updating user credits:", error);
        throw error;
      }
      
      console.log('Successfully updated credits for user:', userId);
    } else {
      // For anonymous users, handle IP-based credits
      const ipAddress = await getIpAddress();
      console.log('Updating credits for IP:', ipAddress);
      
      // First, delete any existing record for this IP
      const { error: deleteError } = await supabase
        .from('user_credits')
        .delete()
        .eq('ip_address', ipAddress)
        .is('user_id', null);

      if (deleteError) {
        console.error("Error deleting existing IP credits:", deleteError);
        throw deleteError;
      }

      // Then insert the new record
      const { error: insertError } = await supabase
        .from('user_credits')
        .insert({
          ip_address: ipAddress,
          credits_remaining: newCredits,
          user_id: null
        });

      if (insertError) {
        console.error("Error inserting new IP credits:", insertError);
        throw insertError;
      }
      
      console.log('Successfully updated credits for IP:', ipAddress);
    }
  } catch (error) {
    console.error("Error in updateCredits:", error);
    throw error;
  }
};