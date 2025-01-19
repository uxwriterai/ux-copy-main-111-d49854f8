import { createContext, useContext, useEffect, useRef } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useCreditsManagement } from "@/hooks/useCreditsManagement";
import { CreditsContextType } from "@/types/credits";
import { useAppDispatch } from "@/hooks/useAppSelector";
import { setCredits, setLoading } from "@/store/slices/creditsSlice";

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export const CreditsProvider = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading: isSessionLoading } = useSessionContext();
  const authListenerSet = useRef(false);
  const cleanupRef = useRef<(() => void) | null>(null);
  const dispatch = useAppDispatch();
  const {
    credits,
    useCredit,
    resetCredits,
    isLoading,
    initialized,
    setInitialized,
    fetchCredits
  } = useCreditsManagement(session);

  // Single useEffect for initialization
  useEffect(() => {
    if (!isSessionLoading && !initialized) {
      console.log("[CreditsContext] Initial credits fetch");
      fetchCredits();
    }
  }, [isSessionLoading, initialized, fetchCredits]);

  // Separate useEffect for auth state changes
  useEffect(() => {
    if (authListenerSet.current || cleanupRef.current) return;
    
    console.log("[CreditsContext] Setting up auth state listener");
    authListenerSet.current = true;
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("[CreditsContext] Auth state changed:", event);
      
      if (event === 'SIGNED_IN' && newSession?.user) {
        console.log("[CreditsContext] User signed in, fetching credits");
        dispatch(setLoading(true));
        setInitialized(false);
        
        setTimeout(async () => {
          try {
            console.log("[CreditsContext] Fetching user credits after sign in");
            await fetchCredits();
          } catch (error) {
            console.error("[CreditsContext] Error fetching user credits:", error);
          } finally {
            dispatch(setLoading(false));
          }
        }, 0);
      }
      
      if (event === 'SIGNED_OUT') {
        console.log("[CreditsContext] User signed out, resetting credits state");
        dispatch(setLoading(true));
        setInitialized(false);
        dispatch(setCredits(null));
        
        // Ensure we fetch IP-based credits after sign out
        setTimeout(async () => {
          try {
            console.log("[CreditsContext] Fetching IP-based credits after sign out");
            await fetchCredits();
          } catch (error) {
            console.error("[CreditsContext] Error fetching IP-based credits:", error);
          } finally {
            dispatch(setLoading(false));
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
  }, [dispatch]); // Added dispatch to dependencies

  const value = {
    credits: credits ?? 0,
    useCredit,
    resetCredits,
    isLoading,
    initialized,
    setInitialized,
    fetchCredits
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