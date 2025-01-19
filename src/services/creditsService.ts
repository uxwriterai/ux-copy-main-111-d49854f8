import { supabase } from "@/integrations/supabase/client";

export const fetchUserCredits = async (userId: string | null): Promise<number | null> => {
  try {
    let query = supabase.from('user_credits');
    
    if (userId) {
      query = query.select('credits_remaining').eq('user_id', userId).single();
    } else {
      const { data: { ip } } = await fetch('/api/get-ip').then(res => res.json());
      console.log('Fetched IP address:', ip);
      query = query.select('credits_remaining').eq('ip_address', ip).single();
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching credits:', error);
      return null;
    }

    return data?.credits_remaining ?? null;
  } catch (error) {
    console.error('Error in fetchUserCredits:', error);
    return null;
  }
};

export const updateCredits = async (newCredits: number, userId: string | null): Promise<boolean> => {
  try {
    let query = supabase.from('user_credits');
    
    if (userId) {
      // For authenticated users
      const { error } = await query
        .update({ credits_remaining: newCredits })
        .eq('user_id', userId);
        
      if (error) {
        console.error('Error in updateCredits:', error);
        return false;
      }
    } else {
      // For anonymous users
      const { data: { ip } } = await fetch('/api/get-ip').then(res => res.json());
      const { error } = await query
        .update({ credits_remaining: newCredits })
        .eq('ip_address', ip);
        
      if (error) {
        console.error('Error in updateCredits:', error);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in updateCredits:', error);
    return false;
  }
};