import { createContext, useContext, useEffect, useRef } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useCreditsManagement } from "@/hooks/useCreditsManagement";
import { CreditsContextType } from "@/types/credits";

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export const CreditsProvider = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading: isSessionLoading } = useSessionContext();
  const authListenerSet = useRef(false);
  const cleanupRef = useRef<(() => void) | null>(null);
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

  // Cleanup function for auth listener
  const cleanupAuthListener = () => {
    console.log("Cleaning up auth state listener");
    if (cleanupRef.current) {
      cleanupRef.current();
      authListenerSet.current = false;
      cleanupRef.current = null;
    }
  };

  // Initialize auth listener
  const initializeAuthListener = () => {
    if (authListenerSet.current) return;

    console.log("Initializing auth state listener");
    authListenerSet.current = true;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("Auth event:", event);
      
      if (event === 'SIGNED_IN' && newSession?.user) {
        console.log("Initial session state: logged in");
        setIsLoading(true);
        setInitialized(false);
        await fetchCredits();
        setIsLoading(false);
      }
      
      if (event === 'SIGNED_OUT') {
        console.log("Initial session state: not logged in");
        setIsLoading(true);
        setInitialized(false);
        setCredits(null);
        await fetchCredits();
        setIsLoading(false);
      }
    });

    cleanupRef.current = () => {
      subscription.unsubscribe();
    };
  };

  // Effect for initial setup and cleanup
  useEffect(() => {
    cleanupAuthListener();
    initializeAuthListener();

    return () => {
      cleanupAuthListener();
    };
  }, []);

  // Effect for session changes
  useEffect(() => {
    if (!isSessionLoading && !initialized) {
      console.log("Auth event: INITIAL_SESSION");
      console.log("Initial session state:", session ? "logged in" : "not logged in");
      fetchCredits();
    }
  }, [isSessionLoading, initialized, session, fetchCredits]);

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