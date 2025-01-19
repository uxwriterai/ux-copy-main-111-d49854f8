import { useState, useCallback, useRef } from "react";
import { Session } from "@supabase/supabase-js";
import { fetchUserCredits, updateCredits } from "@/services/creditsService";

export const useCreditsManagement = (session: Session | null) => {
  const [credits, setCredits] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const fetchInProgress = useRef(false);

  const fetchCredits = useCallback(async () => {
    if (fetchInProgress.current) {
      console.log("[useCreditsManagement] Fetch already in progress, skipping");
      return;
    }

    try {
      fetchInProgress.current = true;
      setIsLoading(true);
      
      // If we have a session, prioritize fetching user credits
      if (session?.user?.id) {
        console.log('[useCreditsManagement] Fetching user credits for:', session.user.id);
        const fetchedCredits = await fetchUserCredits(session.user.id);
        
        if (fetchedCredits === null) {
          console.log("[useCreditsManagement] No user credits found, creating default");
          await updateCredits(6, session.user.id);
          setCredits(6);
        } else {
          console.log('[useCreditsManagement] User credits found:', fetchedCredits);
          setCredits(fetchedCredits);
        }
      } else {
        console.log('[useCreditsManagement] No session, fetching IP-based credits');
        const fetchedCredits = await fetchUserCredits(null);
        
        if (fetchedCredits === null) {
          console.log("[useCreditsManagement] No IP credits found, creating default");
          await updateCredits(2, null);
          setCredits(2);
        } else {
          setCredits(fetchedCredits);
        }
      }
      
      setInitialized(true);
    } catch (error) {
      console.error("[useCreditsManagement] Error in fetchCredits:", error);
      // Set default credits in case of error
      setCredits(session?.user?.id ? 6 : 2);
      setInitialized(true);
    } finally {
      setIsLoading(false);
      fetchInProgress.current = false;
    }
  }, [session?.user?.id]);

  const useCredit = async (): Promise<boolean> => {
    if (!initialized) {
      console.log('[useCreditsManagement] Cannot use credit: credits not initialized');
      return false;
    }

    if (credits === null || credits <= 0) {
      console.log('[useCreditsManagement] Cannot use credit:', credits === null ? 'credits not initialized' : 'no credits remaining');
      return false;
    }

    try {
      console.log('[useCreditsManagement] Using credit. Current credits:', credits);
      await updateCredits(credits - 1, session?.user?.id);
      setCredits(credits - 1);
      return true;
    } catch (error) {
      console.error("[useCreditsManagement] Error using credit:", error);
      return false;
    }
  };

  const resetCredits = async () => {
    console.log('[useCreditsManagement] Resetting credits');
    setInitialized(false);
    await fetchCredits();
  };

  return {
    credits: initialized ? (credits ?? 0) : null,
    setCredits,
    useCredit,
    resetCredits,
    isLoading,
    setIsLoading,
    initialized,
    setInitialized,
    fetchCredits
  };
};