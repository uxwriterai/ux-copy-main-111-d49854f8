import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useSessionContext } from "@supabase/auth-helpers-react"
import { toast } from "sonner"

interface CreditsContextType {
  credits: number;
  setCredits: (credits: number) => void;
  useCredit: () => Promise<boolean>;
  resetCredits: () => Promise<void>;
  isLoading: boolean;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined)

const getIpAddress = async (): Promise<string> => {
  try {
    console.log("Fetching IP address...");
    const response = await fetch('https://api.ipify.org?format=json');
    
    if (!response.ok) {
      console.error('IP address fetch failed:', response.status, response.statusText);
      throw new Error('Failed to fetch IP address');
    }
    
    const data = await response.json();
    console.log("IP address fetched:", data);
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP address:', error);
    throw error;
  }
}

export const CreditsProvider = ({ children }: { children: React.ReactNode }) => {
  const [credits, setCredits] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const { session } = useSessionContext();

  const fetchCredits = async () => {
    try {
      const ipAddress = await getIpAddress();
      if (!ipAddress) {
        throw new Error('IP address not found');
      }

      let query = supabase
        .from('user_credits')
        .select('credits_remaining')
      
      // Add conditions based on authentication status
      if (session?.user) {
        console.log("Fetching credits for authenticated user:", session.user.id);
        query = query.eq('user_id', session.user.id);
      } else {
        console.log("Fetching credits for anonymous user with IP:", ipAddress);
        query = query.is('user_id', null).eq('ip_address', ipAddress);
      }

      const { data, error } = await query.maybeSingle();

      if (error) {
        console.error("Error fetching credits:", error);
        throw error;
      }

      if (!data) {
        // Create new credits entry
        const defaultCredits = session?.user ? 6 : 2;
        console.log(`Creating new credits entry with ${defaultCredits} credits`);
        
        const { error: insertError } = await supabase
          .from('user_credits')
          .insert({
            ip_address: ipAddress,
            credits_remaining: defaultCredits,
            user_id: session?.user?.id || null
          });

        if (insertError) {
          console.error("Error creating credits:", insertError);
          throw insertError;
        }

        setCredits(defaultCredits);
      } else {
        console.log("Credits found:", data.credits_remaining);
        setCredits(data.credits_remaining);
      }
    } catch (error) {
      console.error("Error in fetchCredits:", error);
      toast.error("Error fetching credits. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const useCredit = async (): Promise<boolean> => {
    try {
      if (credits <= 0) {
        toast.error("No credits remaining");
        return false;
      }

      const ipAddress = await getIpAddress();
      let query = supabase
        .from('user_credits')
        .update({ credits_remaining: credits - 1 });

      if (session?.user) {
        query = query.eq('user_id', session.user.id);
      } else {
        query = query.is('user_id', null).eq('ip_address', ipAddress);
      }

      const { error } = await query;

      if (error) {
        console.error("Error updating credits:", error);
        throw error;
      }

      setCredits(prev => prev - 1);
      return true;
    } catch (error) {
      console.error("Error using credit:", error);
      toast.error("Error using credit. Please try again.");
      return false;
    }
  };

  const resetCredits = async () => {
    try {
      const ipAddress = await getIpAddress();
      const maxCredits = session?.user ? 6 : 2;

      let query = supabase
        .from('user_credits')
        .update({ credits_remaining: maxCredits });

      if (session?.user) {
        query = query.eq('user_id', session.user.id);
      } else {
        query = query.is('user_id', null).eq('ip_address', ipAddress);
      }

      const { error } = await query;

      if (error) {
        console.error("Error resetting credits:", error);
        throw error;
      }

      setCredits(maxCredits);
    } catch (error) {
      console.error("Error in resetCredits:", error);
      toast.error("Error resetting credits. Please try again.");
    }
  };

  // Fetch credits when session changes or component mounts
  useEffect(() => {
    console.log("Session state changed:", session?.user?.id);
    fetchCredits();
  }, [session]);

  const value = {
    credits,
    setCredits,
    useCredit,
    resetCredits,
    isLoading
  };

  return (
    <CreditsContext.Provider value={value}>
      {children}
    </CreditsContext.Provider>
  );
};

export const useCredits = () => {
  const context = useContext(CreditsContext);
  if (context === undefined) {
    throw new Error("useCredits must be used within a CreditsProvider");
  }
  return context;
};