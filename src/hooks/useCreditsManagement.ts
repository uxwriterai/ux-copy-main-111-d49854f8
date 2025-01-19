import { useState, useCallback, useRef } from "react";
import { Session } from "@supabase/supabase-js";
import { fetchUserCredits, updateCredits, clearCreditsFromStorage, getCreditsFromStorage } from "@/services/creditsService";

export const useCreditsManagement = (session: Session | null) => {
  const [credits, setCredits] = useState<number | null>(() => getCreditsFromStorage());
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const fetchInProgress = useRef(false);

  const fetchCredits = useCallback(async () => {
    if (fetchInProgress.current) {
      console.log("[useCreditsManagement] Fetch already in progress, skipping");
      return;
    }

    // Check if credits are already in state
    if (credits !== null && initialized) {
      console.log("[useCreditsManagement] Credits already loaded:", credits);
      return;
    }

    try {
      fetchInProgress.current = true;
      setIsLoading(true);
      console.log('[useCreditsManagement] Fetching credits for:', session?.user?.id ? `user ${session.user.id}` : 'anonymous user');
      
      const fetchedCredits = await fetchUserCredits(session?.user?.id);
      console.log('[useCreditsManagement] Fetched credits:', fetchedCredits);
      
      if (fetchedCredits === null) {
        console.log("[useCreditsManagement] No credits record found, creating default");
        const defaultCredits = session?.user?.id ? 6 : 2;
        await updateCredits(defaultCredits, session?.user?.id);
        setCredits(defaultCredits);
      } else {
        setCredits(fetchedCredits);
      }
      
      setInitialized(true);
    } catch (error) {
      console.error("[useCreditsManagement] Error in fetchCredits:", error);
      setInitialized(true);
    } finally {
      setIsLoading(false);
      fetchInProgress.current = false;
    }
  }, [session?.user?.id, credits, initialized]);

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
    clearCreditsFromStorage();
    setInitialized(false);
    setCredits(null);
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