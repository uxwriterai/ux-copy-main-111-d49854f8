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

  // Single useEffect for initialization and session changes
  useEffect(() => {
    if (!isSessionLoading && !initialized && session?.user?.id) {
      console.log("[CreditsContext] Initial credits fetch for authenticated user");
      fetchCredits();
    }
  }, [isSessionLoading, initialized, session?.user?.id, fetchCredits]);

  // Separate useEffect for auth state changes
  useEffect(() => {
    if (authListenerSet.current || cleanupRef.current) return;
    
    console.log("[CreditsContext] Setting up auth state listener");
    authListenerSet.current = true;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("[CreditsContext] Auth state changed:", event);
      
      if (event === 'SIGNED_IN' && newSession?.user) {
        console.log("[CreditsContext] User signed in, fetching credits");
        setIsLoading(true);
        setInitialized(false);
        await fetchCredits();
        setIsLoading(false);
      }
      
      if (event === 'SIGNED_OUT') {
        console.log("[CreditsContext] User signed out, resetting credits state");
        setIsLoading(true);
        setInitialized(false);
        setCredits(null);
        setIsLoading(false);
      }
    });

    cleanupRef.current = () => {
      console.log("[CreditsContext] Cleaning up auth state listener");
      subscription.unsubscribe();
      authListenerSet.current = false;
      cleanupRef.current = null;
    };

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, []); // Empty dependency array since we use refs to prevent multiple setups

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