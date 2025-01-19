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

  // Wait for session to be checked before initial fetch
  useEffect(() => {
    if (!isSessionLoading) {
      console.log("[CreditsContext] Session loading complete, user:", session?.user?.id || 'anonymous');
      if (!initialized) {
        console.log("[CreditsContext] Initializing credits");
        fetchCredits();
      }
    }
  }, [isSessionLoading, initialized, fetchCredits, session?.user?.id]);

  // Handle auth state changes
  useEffect(() => {
    if (authListenerSet.current || cleanupRef.current) return;
    
    console.log("[CreditsContext] Setting up auth state listener");
    authListenerSet.current = true;
    let mounted = true;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("[CreditsContext] Auth state changed:", event);
      
      if (!mounted) return;

      if (event === 'SIGNED_IN' && newSession?.user) {
        console.log("[CreditsContext] User signed in, fetching user credits");
        setIsLoading(true);
        setInitialized(false);
        await fetchCredits();
      }
      
      if (event === 'SIGNED_OUT') {
        console.log("[CreditsContext] User signed out, resetting to IP-based credits");
        setIsLoading(true);
        setInitialized(false);
        setCredits(null);
        await fetchCredits();
      }
    });

    cleanupRef.current = () => {
      console.log("[CreditsContext] Cleaning up auth state listener");
      mounted = false;
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