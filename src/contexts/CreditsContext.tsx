import { createContext, useContext, useEffect, useRef } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useCreditsManagement } from "@/hooks/useCreditsManagement";
import { CreditsContextType } from "@/types/credits";

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export const CreditsProvider = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading: isSessionLoading } = useSessionContext();
  const authListenerSet = useRef(false);
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

  // Initial credits fetch
  useEffect(() => {
    if (!isSessionLoading && !initialized) {
      console.log("[CreditsContext] Initial credits fetch starting");
      setIsLoading(true);
      fetchCredits().finally(() => {
        setIsLoading(false);
        setInitialized(true);
      });
    }
  }, [isSessionLoading, initialized, fetchCredits, setIsLoading, setInitialized]);

  // Auth state changes
  useEffect(() => {
    if (authListenerSet.current) return;
    
    console.log("[CreditsContext] Setting up auth state listener");
    authListenerSet.current = true;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("[CreditsContext] Auth state changed:", event);
      
      if (event === 'SIGNED_IN' && newSession?.user) {
        console.log("[CreditsContext] User signed in, fetching credits");
        setIsLoading(true);
        setInitialized(false);
        
        try {
          await fetchCredits();
        } catch (error) {
          console.error("[CreditsContext] Error fetching user credits:", error);
        } finally {
          setIsLoading(false);
          setInitialized(true);
        }
      }
      
      if (event === 'SIGNED_OUT') {
        console.log("[CreditsContext] User signed out, resetting credits state");
        setIsLoading(true);
        setInitialized(false);
        setCredits(null);
        
        try {
          await fetchCredits();
        } catch (error) {
          console.error("[CreditsContext] Error fetching IP-based credits:", error);
        } finally {
          setIsLoading(false);
          setInitialized(true);
        }
      }
    });

    return () => {
      console.log("[CreditsContext] Cleaning up auth state listener");
      subscription.unsubscribe();
      authListenerSet.current = false;
    };
  }, [fetchCredits, setCredits, setInitialized, setIsLoading]); 

  const value = {
    credits: credits ?? 0,
    setCredits,
    useCredit,
    resetCredits,
    isLoading: isLoading || isSessionLoading
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