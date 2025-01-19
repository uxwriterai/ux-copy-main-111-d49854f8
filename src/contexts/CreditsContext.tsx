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

  // Wait for session to be loaded before initializing
  useEffect(() => {
    if (!isSessionLoading && !initialized) {
      console.log("[CreditsContext] Initial credits fetch, session loaded:", !!session?.user);
      if (session?.user) {
        console.log("[CreditsContext] Fetching authenticated user credits");
        fetchCredits();
      } else {
        console.log("[CreditsContext] Fetching anonymous credits");
        fetchCredits();
      }
    }
  }, [isSessionLoading, initialized, fetchCredits, session]);

  // Handle auth state changes
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
        setCredits(null); // Clear existing credits before fetching new ones
        
        try {
          console.log("[CreditsContext] Fetching user credits after sign in");
          await fetchCredits();
        } catch (error) {
          console.error("[CreditsContext] Error fetching user credits:", error);
        } finally {
          setIsLoading(false);
        }
      }
      
      if (event === 'SIGNED_OUT') {
        console.log("[CreditsContext] User signed out, resetting credits state");
        setIsLoading(true);
        setInitialized(false);
        setCredits(null);
        
        try {
          console.log("[CreditsContext] Fetching IP-based credits after sign out");
          await fetchCredits();
        } catch (error) {
          console.error("[CreditsContext] Error fetching IP-based credits:", error);
        } finally {
          setIsLoading(false);
        }
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
  }, [fetchCredits, setCredits, setInitialized, setIsLoading]);

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