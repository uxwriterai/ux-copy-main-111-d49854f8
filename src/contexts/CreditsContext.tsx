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
      // If we have a session, we should only fetch user credits
      if (session?.user) {
        console.log("[CreditsContext] Initial credits fetch for logged-in user");
        fetchCredits();
      } else {
        // Only fetch IP-based credits if there's no session
        console.log("[CreditsContext] Initial credits fetch for anonymous user");
        fetchCredits();
      }
    }
  }, [isSessionLoading, initialized, fetchCredits, session?.user]);

  // Separate useEffect for auth state changes
  useEffect(() => {
    if (authListenerSet.current || cleanupRef.current) return;
    
    console.log("[CreditsContext] Setting up auth state listener");
    authListenerSet.current = true;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("[CreditsContext] Auth state changed:", event);
      
      if (event === 'SIGNED_IN' && newSession?.user) {
        console.log("[CreditsContext] User signed in, fetching user credits");
        setIsLoading(true);
        setInitialized(false);
        
        setTimeout(async () => {
          try {
            await fetchCredits();
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
        
        // Ensure we fetch IP-based credits after sign out
        setTimeout(async () => {
          try {
            await fetchCredits();
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