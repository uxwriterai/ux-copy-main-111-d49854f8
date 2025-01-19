import { supabase } from "@/integrations/supabase/client";

const CREDITS_STORAGE_KEY = 'user_credits';

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

export const saveCreditsToStorage = (credits: number) => {
  console.log('Saving credits to storage:', credits);
  localStorage.setItem(CREDITS_STORAGE_KEY, credits.toString());
};

export const getCreditsFromStorage = (): number | null => {
  const credits = localStorage.getItem(CREDITS_STORAGE_KEY);
  console.log('Retrieved credits from storage:', credits);
  return credits ? parseInt(credits, 10) : null;
};

export const clearCreditsFromStorage = () => {
  console.log('Clearing credits from storage');
  localStorage.removeItem(CREDITS_STORAGE_KEY);
};

export const fetchUserCredits = async (userId?: string | null): Promise<number | null> => {
  try {
    console.log('Fetching credits for:', userId ? `user ${userId}` : 'anonymous user');
    
    // Check local storage first
    const storedCredits = getCreditsFromStorage();
    if (storedCredits !== null) {
      console.log('Using credits from storage:', storedCredits);
      return storedCredits;
    }

    // If user is logged in, fetch user-based credits
    if (userId) {
      console.log('User is logged in, fetching user-based credits');
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
      
      const credits = data?.credits_remaining ?? null;
      console.log('User-based credits data:', credits);
      
      if (credits !== null) {
        saveCreditsToStorage(credits);
      }
      
      return credits;
    } 
    
    // For anonymous users, fetch IP-based credits
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
    
    const credits = data?.credits_remaining ?? null;
    console.log('IP-based credits data:', credits);
    
    if (credits !== null) {
      saveCreditsToStorage(credits);
    }
    
    return credits;
  } catch (error) {
    console.error("Error in fetchUserCredits:", error);
    throw error;
  }
};

export const updateCredits = async (newCredits: number, userId?: string | null): Promise<void> => {
  try {
    console.log('Updating credits:', { newCredits, userId });
    
    if (userId) {
      // For logged-in users, first check if a record exists
      const { data: existingRecord, error: checkError } = await supabase
        .from('user_credits')
        .select('id')
        .eq('user_id', userId)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking existing record:", checkError);
        throw checkError;
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
          .insert({
            user_id: userId,
            credits_remaining: newCredits
          });

        if (insertError) {
          console.error("Error inserting user credits:", insertError);
          throw insertError;
        }
      }
      
      // Save to local storage after successful update
      saveCreditsToStorage(newCredits);
      console.log('Successfully updated credits for user:', userId);
    } else {
      // For anonymous users, handle IP-based credits
      const ipAddress = await getIpAddress();
      console.log('Anonymous user, updating credits for IP:', ipAddress);
      
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
      
      // Save to local storage after successful update
      saveCreditsToStorage(newCredits);
      console.log('Successfully updated credits for IP:', ipAddress);
    }
  } catch (error) {
    console.error("Error in updateCredits:", error);
    throw error;
  }
};
