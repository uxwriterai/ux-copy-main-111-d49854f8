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
      const userId = session?.user?.id;
      
      if (userId) {
        console.log('[useCreditsManagement] Fetching credits for authenticated user:', userId);
        const fetchedCredits = await fetchUserCredits(userId);
        
        if (fetchedCredits === null) {
          console.log("[useCreditsManagement] No user credits record found, creating default");
          await updateCredits(6, userId);
          setCredits(6);
        } else {
          console.log("[useCreditsManagement] Setting user credits:", fetchedCredits);
          setCredits(fetchedCredits);
        }
      } else {
        console.log('[useCreditsManagement] Fetching credits for anonymous user');
        const fetchedCredits = await fetchUserCredits(null);
        
        if (fetchedCredits === null) {
          console.log("[useCreditsManagement] No anonymous credits record found, creating default");
          await updateCredits(2, null);
          setCredits(2);
        } else {
          console.log("[useCreditsManagement] Setting anonymous credits:", fetchedCredits);
          setCredits(fetchedCredits);
        }
      }
      
      setInitialized(true);
    } catch (error) {
      console.error("[useCreditsManagement] Error in fetchCredits:", error);
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