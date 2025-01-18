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
    if (userId) {
      const { data, error } = await supabase
        .from('user_credits')
        .select('credits_remaining')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data?.credits_remaining ?? 6;
    } else {
      const ipAddress = await getIpAddress();
      const { data, error } = await supabase
        .from('user_credits')
        .select('credits_remaining')
        .is('user_id', null)
        .eq('ip_address', ipAddress)
        .maybeSingle();

      if (error) throw error;
      return data?.credits_remaining ?? 2;
    }
  } catch (error) {
    console.error('Error fetching credits:', error);
    toast.error('Failed to fetch credits');
    return 0;
  }
};

export const updateCredits = async (
  newCredits: number,
  userId?: string | null
): Promise<void> => {
  try {
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
      const { error } = await supabase
        .from('user_credits')
        .upsert({ 
          ip_address: ipAddress,
          credits_remaining: newCredits,
          user_id: null 
        });

      if (error) throw error;
    }
  } catch (error) {
    console.error('Error updating credits:', error);
    toast.error('Failed to update credits');
    throw error;
  }
};