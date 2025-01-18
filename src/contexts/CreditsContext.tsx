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

      if (session?.user) {
        console.log("Fetching credits for user:", session.user.id);
        const { data: userCredits, error: userCreditsError } = await supabase
          .from('user_credits')
          .select('credits_remaining')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (userCreditsError) {
          console.error("Error fetching user credits:", userCreditsError);
          throw userCreditsError;
        }

        if (userCredits) {
          console.log("Found credits for user:", userCredits);
          setCredits(userCredits.credits_remaining);
        } else {
          console.log("No credits found for user, creating new entry with 6 credits");
          const { data: newUserCredits, error: createError } = await supabase
            .from('user_credits')
            .insert({ 
              user_id: session.user.id, 
              credits_remaining: 6 
            })
            .select('credits_remaining')
            .single();

          if (createError) {
            console.error("Error creating user credits:", createError);
            throw createError;
          }

          console.log("Created credits for user:", newUserCredits);
          setCredits(newUserCredits.credits_remaining);
        }
      } else {
        const ipAddress = await getIpAddress();
        console.log("Fetching credits for IP:", ipAddress);
        
        const { data: ipCredits, error: ipCreditsError } = await supabase
          .from('user_credits')
          .select('credits_remaining')
          .is('user_id', null)
          .eq('ip_address', ipAddress)
          .maybeSingle();

        if (ipCreditsError) {
          console.error("Error fetching IP credits:", ipCreditsError);
          throw ipCreditsError;
        }

        if (ipCredits) {
          console.log("Found credits for IP:", ipCredits);
          setCredits(ipCredits.credits_remaining);
        } else {
          console.log("No credits found for IP, creating new entry with 2 credits");
          const { data: newIpCredits, error: createError } = await supabase
            .from('user_credits')
            .insert({ 
              ip_address: ipAddress, 
              credits_remaining: 2,
              user_id: null 
            })
            .select('credits_remaining')
            .single();

          if (createError) {
            console.error("Error creating IP credits:", createError);
            throw createError;
          }

          console.log("Created credits for IP:", newIpCredits);
          setCredits(newIpCredits.credits_remaining);
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
    if (credits <= 0) {
      toast.error("No credits remaining");
      return false;
    }

    try {
      if (session?.user) {
        const { error: updateError } = await supabase
          .from('user_credits')
          .update({ credits_remaining: credits - 1 })
          .eq('user_id', session.user.id);

        if (updateError) throw updateError;
      } else {
        const ipAddress = await getIpAddress();
        const { error: updateError } = await supabase
          .from('user_credits')
          .update({ credits_remaining: credits - 1 })
          .is('user_id', null)
          .eq('ip_address', ipAddress);

        if (updateError) throw updateError;
      }

      setCredits(credits - 1);
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