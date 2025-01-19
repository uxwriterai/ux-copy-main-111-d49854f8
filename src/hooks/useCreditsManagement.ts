import { useState, useCallback, useRef } from "react";
import { Session } from "@supabase/supabase-js";
import { fetchUserCredits, updateCredits } from "@/services/creditsService";

const CREDITS_STORAGE_KEY = 'user_credits';

const getStoredCredits = (): number | null => {
  const stored = localStorage.getItem(CREDITS_STORAGE_KEY);
  return stored ? parseInt(stored, 10) : null;
};

const setStoredCredits = (credits: number | null) => {
  if (credits === null) {
    localStorage.removeItem(CREDITS_STORAGE_KEY);
  } else {
    localStorage.setItem(CREDITS_STORAGE_KEY, credits.toString());
  }
};

export const useCreditsManagement = (session: Session | null) => {
  const [credits, setCredits] = useState<number | null>(() => getStoredCredits());
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const fetchInProgress = useRef(false);

  const fetchCredits = useCallback(async () => {
    // Skip if fetch is in progress or credits are already loaded
    if (fetchInProgress.current) {
      console.log("[useCreditsManagement] Fetch already in progress, skipping");
      return;
    }

    // Check if credits are in localStorage
    const storedCredits = getStoredCredits();
    if (storedCredits !== null && initialized) {
      console.log("[useCreditsManagement] Using stored credits:", storedCredits);
      setCredits(storedCredits);
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
        setStoredCredits(defaultCredits);
      } else {
        setCredits(fetchedCredits);
        setStoredCredits(fetchedCredits);
      }
      
      setInitialized(true);
    } catch (error) {
      console.error("[useCreditsManagement] Error in fetchCredits:", error);
      setInitialized(true);
    } finally {
      setIsLoading(false);
      fetchInProgress.current = false;
    }
  }, [session?.user?.id, initialized]);

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
      const newCredits = credits - 1;
      setCredits(newCredits);
      setStoredCredits(newCredits);
      return true;
    } catch (error) {
      console.error("[useCreditsManagement] Error using credit:", error);
      return false;
    }
  };

  const resetCredits = async () => {
    console.log('[useCreditsManagement] Resetting credits');
    setStoredCredits(null);
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