import { createContext, useContext, useEffect } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useCreditsManagement } from "@/hooks/useCreditsManagement";
import { CreditsContextType } from "@/types/credits";

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export const CreditsProvider = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading: isSessionLoading } = useSessionContext();
  const {
    credits,
    setCredits,
    useCredit,
    resetCredits,
    isLoading,
    setIsLoading,
    initialized,
    setInitialized,
    fetchCredits
  } = useCreditsManagement(session);

  useEffect(() => {
    let isMounted = true;
    console.log("Session or initialization state changed");
    
    const initializeCredits = async () => {
      if (!isSessionLoading && !initialized && isMounted) {
        console.log("Fetching credits...");
        try {
          await fetchCredits();
        } catch (error) {
          console.error("Error fetching credits:", error);
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      }
    };

    initializeCredits();

    return () => {
      isMounted = false;
    };
  }, [session?.user?.id, isSessionLoading, initialized, fetchCredits, setIsLoading]);

  useEffect(() => {
    console.log("Setting up auth state change listener");
    let isMounted = true;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (!isMounted) return;
      
      console.log("Auth state changed:", event);
      if (event === 'SIGNED_OUT') {
        console.log("User signed out, resetting credits state");
        setIsLoading(true);
        setInitialized(false);
        setCredits(null);
        
        if (isMounted) {
          try {
            console.log("Fetching IP-based credits");
            await fetchCredits();
          } catch (error) {
            console.error("Error fetching IP-based credits:", error);
          } finally {
            if (isMounted) {
              setIsLoading(false);
            }
          }
        }
      }
    });

    return () => {
      console.log("Cleaning up auth state listener");
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchCredits, setCredits, setIsLoading, setInitialized]);

  const value = {
    credits: credits ?? 0,
    setCredits,
    useCredit,
    resetCredits,
    isLoading,
    setIsLoading
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