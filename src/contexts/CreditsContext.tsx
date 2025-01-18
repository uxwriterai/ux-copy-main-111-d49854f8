import { createContext, useContext } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useCreditsManagement } from "@/hooks/useCreditsManagement";
import { CreditsContextType } from "@/types/credits";
import { useEffect } from "react";

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export const CreditsProvider = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading: isSessionLoading } = useSessionContext();
  const {
    credits,
    setCredits,
    useCredit,
    resetCredits,
    isLoading,
    initialized,
    fetchCredits
  } = useCreditsManagement(session);

  useEffect(() => {
    if (!isSessionLoading && !initialized) {
      console.log("Session state changed or not initialized, fetching credits...");
      fetchCredits();
    }
  }, [session?.user?.id, isSessionLoading, initialized, fetchCredits]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event) => {
      console.log("Auth state changed:", _event);
      if (_event === 'SIGNED_OUT') {
        setCredits(0);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setCredits]);

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