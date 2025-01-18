import { supabase } from "@/integrations/supabase/client";
import { UserCredits } from "@/types/credits";
import { toast } from "sonner";

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

export const fetchUserCredits = async (userId?: string | null): Promise<number> => {
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
      return data?.credits_remaining ?? 6;
    } else {
      const ipAddress = await getIpAddress();
      console.log('Fetching credits for IP:', ipAddress);
      
      const { data, error } = await supabase
        .from('user_credits')
        .select('credits_remaining')
        .is('user_id', null)
        .eq('ip_address', ipAddress)
        .maybeSingle();

      if (error) {
        console.error('Error fetching IP-based credits:', error);
        throw error;
      }

      if (!data) {
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

        return newData.credits_remaining;
      }

      console.log('IP-based credits data:', data);
      return data.credits_remaining;
    }
  } catch (error) {
    console.error('Error in fetchUserCredits:', error);
    toast.error('Failed to fetch credits');
    return userId ? 6 : 2; // Default values for fallback
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
    toast.error('Failed to update credits');
    throw error;
  }
};