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

  // Single useEffect for initialization and session changes
  useEffect(() => {
    console.log("Session or initialization state changed");
    console.log("Session state:", session?.user?.id ? "logged in" : "not logged in");
    console.log("Initialized:", initialized);
    console.log("Session loading:", isSessionLoading);

    if (!isSessionLoading && !initialized) {
      console.log("Fetching credits...");
      fetchCredits();
    }
  }, [session?.user?.id, isSessionLoading, initialized, fetchCredits]);

  // Separate useEffect for auth state changes
  useEffect(() => {
    console.log("Setting up auth state change listener");
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      console.log("Auth state changed:", event);
      if (event === 'SIGNED_OUT') {
        console.log("User signed out, resetting credits state");
        setIsLoading(true);
        setInitialized(false); // Reset initialized state
        setCredits(null);
        
        try {
          console.log("Fetching IP-based credits");
          await fetchCredits();
        } catch (error) {
          console.error("Error fetching IP-based credits:", error);
        }
      }
    });

    return () => {
      console.log("Cleaning up auth state listener");
      subscription.unsubscribe();
    };
  }, [fetchCredits, setCredits, setIsLoading, setInitialized]);

  const value = {
    credits: credits ?? 0,
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