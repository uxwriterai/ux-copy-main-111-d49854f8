import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/integrations/supabase/client"
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
    const response = await fetch('https://api.ipify.org?format=json');
    if (!response.ok) throw new Error('Failed to fetch IP address');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP address:', error);
    throw error;
  }
}

export const CreditsProvider = ({ children }: { children: React.ReactNode }) => {
  const [credits, setCredits] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCredits = async () => {
    try {
      console.log("Fetching credits...");
      const ipAddress = await getIpAddress();
      console.log("IP address:", ipAddress);
      
      const { data, error } = await supabase
        .from('user_credits')
        .select('credits_remaining')
        .eq('ip_address', ipAddress)
        .maybeSingle();

      if (error) {
        console.error("Error fetching credits:", error);
        throw error;
      }

      if (!data) {
        console.log("Creating new credits entry with 2 credits");
        const { error: insertError, data: insertedData } = await supabase
          .from('user_credits')
          .insert({ ip_address: ipAddress, credits_remaining: 2 })
          .select('credits_remaining')
          .single();

        if (insertError) {
          console.error("Error creating credits:", insertError);
          throw insertError;
        }

        setCredits(insertedData.credits_remaining);
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
      const { error, data } = await supabase
        .from('user_credits')
        .update({ credits_remaining: credits - 1 })
        .eq('ip_address', ipAddress)
        .select('credits_remaining')
        .single();

      if (error) {
        console.error("Error updating credits:", error);
        throw error;
      }

      setCredits(data.credits_remaining);
      return true;
    } catch (error) {
      console.error("Error using credit:", error);
      toast.error("Error using credit. Please try again.");
      return false;
    }
  };

  const resetCredits = async () => {
    try {
      await fetchCredits();
    } catch (error) {
      console.error("Error in resetCredits:", error);
      toast.error("Error resetting credits. Please try again.");
    }
  };

  useEffect(() => {
    fetchCredits();
  }, []);

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