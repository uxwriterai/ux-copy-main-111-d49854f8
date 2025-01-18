import { supabase } from "@/integrations/supabase/client";

export const getIpAddress = async (): Promise<string> => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    if (!response.ok) throw new Error('Failed to fetch IP address');
    const data = await response.json();
    console.log('Fetched IP address:', data.ip);
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP address:', error);
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
        .maybeSingle();

      if (error) {
        console.error('Error fetching user credits:', error);
        throw error;
      }
      
      console.log('User credits data:', data);
      return data?.credits_remaining ?? null;
    } else {
      const ipAddress = await getIpAddress();
      console.log('Fetching credits for IP:', ipAddress);
      
      const { data: existingCredits, error: selectError } = await supabase
        .from('user_credits')
        .select('credits_remaining')
        .is('user_id', null)
        .eq('ip_address', ipAddress)
        .maybeSingle();

      if (selectError) {
        console.error('Error fetching IP-based credits:', selectError);
        throw selectError;
      }

      if (!existingCredits) {
        console.log('No existing credits found for IP, creating new entry');
        const { data: newData, error: insertError } = await supabase
          .from('user_credits')
          .insert({ 
            ip_address: ipAddress,
            credits_remaining: 2,
            user_id: null 
          })
          .select('credits_remaining')
          .single();

        if (insertError) {
          console.error('Error creating IP-based credits:', insertError);
          throw insertError;
        }

        console.log('Created new credits entry:', newData);
        return newData.credits_remaining;
      }

      console.log('Found existing IP-based credits:', existingCredits);
      return existingCredits.credits_remaining;
    }
  } catch (error) {
    console.error('Error in fetchUserCredits:', error);
    throw error;
  }
};

export const updateCredits = async (
  newCredits: number,
  userId?: string | null
): Promise<void> => {
  try {
    console.log('Updating credits:', { newCredits, userId });
    
    if (userId) {
      const { error } = await supabase
        .from('user_credits')
        .upsert({ 
          user_id: userId,
          credits_remaining: newCredits 
        });

      if (error) throw error;
    } else {
      const ipAddress = await getIpAddress();
      console.log('Updating credits for IP:', ipAddress);
      
      const { error } = await supabase
        .from('user_credits')
        .upsert({ 
          ip_address: ipAddress,
          credits_remaining: newCredits,
          user_id: null 
        });

      if (error) throw error;
    }
    
    console.log('Credits updated successfully');
  } catch (error) {
    console.error('Error updating credits:', error);
    throw error;
  }
};