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

  // Single useEffect for initialization
  useEffect(() => {
    if (!isSessionLoading && !initialized) {
      console.log("[CreditsContext] Initial credits fetch");
      // Always check session first before fetching
      if (session?.user) {
        console.log("[CreditsContext] Initial session with user, fetching user credits");
        fetchCredits(true); // Pass true to force user-based credits
      } else {
        console.log("[CreditsContext] No initial user session, fetching IP-based credits");
        fetchCredits(false); // Pass false to force IP-based credits
      }
    }
  }, [isSessionLoading, initialized, fetchCredits, session]);

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
        
        setTimeout(async () => {
          try {
            console.log("[CreditsContext] Fetching user credits after sign in");
            await fetchCredits(true); // Force user-based credits
          } catch (error) {
            console.error("[CreditsContext] Error fetching user credits:", error);
          } finally {
            setIsLoading(false);
          }
        }, 0);
      }
      
      if (event === 'SIGNED_OUT') {
        console.log("[CreditsContext] User signed out, resetting credits state");
        setIsLoading(true);
        setInitialized(false);
        setCredits(null);
        
        setTimeout(async () => {
          try {
            console.log("[CreditsContext] Fetching IP-based credits after sign out");
            await fetchCredits(false); // Force IP-based credits
          } catch (error) {
            console.error("[CreditsContext] Error fetching IP-based credits:", error);
          } finally {
            setIsLoading(false);
          }
        }, 0);
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
  }, []); 

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