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
    const response = await fetch('https://api.ipify.org?format=json');
    if (!response.ok) throw new Error('Failed to fetch IP address');
    const data = await response.json();
    console.log('Fetched IP address:', data.ip);
    return data.ip;
  } catch (error) {
    console.error('Error fetching IP address:', error);
    throw error;
  }
}

export const CreditsProvider = ({ children }: { children: React.ReactNode }) => {
  const [credits, setCredits] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const { session, isLoading: isSessionLoading } = useSessionContext();
  const [initialized, setInitialized] = useState(false);

  const fetchCredits = async () => {
    try {
      console.log("Fetching credits, session state:", !!session?.user);
      
      if (isSessionLoading) {
        console.log("Session is still loading, waiting...");
        return;
      }

      const ipAddress = await getIpAddress();
      console.log("Current IP address:", ipAddress);

      if (session?.user) {
        console.log("Fetching credits for user:", session.user.id);
        const { data, error } = await supabase
          .from('user_credits')
          .select('credits_remaining')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          console.log("No credits found for user, creating new entry with 6 credits");
          const { data: newData, error: insertError } = await supabase
            .from('user_credits')
            .insert({ user_id: session.user.id, credits_remaining: 6 })
            .select('credits_remaining')
            .single();

          if (insertError) throw insertError;
          console.log("Created credits for user:", newData);
          setCredits(newData.credits_remaining);
        } else {
          console.log("Found credits for user:", data);
          setCredits(data.credits_remaining);
        }
      } else {
        console.log("Fetching credits for IP:", ipAddress);
        const { data, error } = await supabase
          .from('user_credits')
          .select('credits_remaining')
          .is('user_id', null)
          .eq('ip_address', ipAddress)
          .maybeSingle();

        if (error) throw error;

        if (!data) {
          console.log("No credits found for IP, creating new entry with 2 credits");
          const { data: newData, error: insertError } = await supabase
            .from('user_credits')
            .insert({ ip_address: ipAddress, credits_remaining: 2 })
            .select('credits_remaining')
            .single();

          if (insertError) throw insertError;
          console.log("Created credits for IP:", newData);
          setCredits(newData.credits_remaining);
        } else {
          console.log("Found credits for IP:", data);
          setCredits(data.credits_remaining);
        }
      }
    } catch (error) {
      console.error("Error in fetchCredits:", error);
      toast.error("Error fetching credits. Please try again.");
    } finally {
      setIsLoading(false);
      setInitialized(true);
    }
  };

  const useCredit = async (): Promise<boolean> => {
    try {
      if (credits <= 0) {
        toast.error("No credits remaining");
        return false;
      }

      const ipAddress = await getIpAddress();
      console.log("Using credit for IP:", ipAddress);

      let query = supabase
        .from('user_credits')
        .update({ credits_remaining: credits - 1 });

      if (session?.user) {
        query = query.eq('user_id', session.user.id);
      } else {
        query = query.is('user_id', null).eq('ip_address', ipAddress);
      }

      const { error, data } = await query.select('credits_remaining').maybeSingle();

      if (error) {
        console.error("Error updating credits:", error);
        throw error;
      }

      if (!data) {
        console.error("No credits record found to update");
        return false;
      }

      console.log("Credits updated successfully:", data.credits_remaining);
      setCredits(data.credits_remaining);
      return true;
    } catch (error) {
      console.error("Error using credit:", error);
      toast.error("Error using credit. Please try again.");
      return false;
    }
  };

  const resetCredits = async () => {
    setInitialized(false);
    await fetchCredits();
  };

  useEffect(() => {
    if (!isSessionLoading && !initialized) {
      console.log("Session state changed or not initialized, fetching credits...");
      fetchCredits();
    }
  }, [session?.user?.id, isSessionLoading, initialized]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event, session);
      if (_event === 'SIGNED_OUT') {
        setInitialized(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
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