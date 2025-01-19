import { useState, useCallback, useRef, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { fetchUserCredits, updateCredits } from "@/services/creditsService";

const CREDITS_STORAGE_KEY = 'user_credits_state';

interface StoredCreditsState {
  credits: number;
  userId: string | null;
  timestamp: number;
}

export const useCreditsManagement = (session: Session | null) => {
  const [credits, setCredits] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const fetchInProgress = useRef(false);
  const userId = session?.user?.id;

  // Load credits from storage on mount
  useEffect(() => {
    const loadStoredCredits = () => {
      const storedData = localStorage.getItem(CREDITS_STORAGE_KEY);
      if (storedData) {
        const stored: StoredCreditsState = JSON.parse(storedData);
        
        // Only use stored credits if they match the current user and are less than 5 minutes old
        const isValid = 
          stored.userId === userId && 
          Date.now() - stored.timestamp < 5 * 60 * 1000;
        
        if (isValid) {
          console.log('[useCreditsManagement] Using stored credits:', stored.credits);
          setCredits(stored.credits);
          setInitialized(true);
          setIsLoading(false);
          return true;
        }
      }
      return false;
    };

    if (!initialized && !loadStoredCredits()) {
      // If no valid stored credits, fetch new ones
      fetchCredits();
    }
  }, [userId, initialized]);

  // Handle tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('[useCreditsManagement] Tab became visible, checking credits');
        const storedData = localStorage.getItem(CREDITS_STORAGE_KEY);
        if (!storedData) {
          fetchCredits();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // Persist credits to storage whenever they change
  useEffect(() => {
    if (credits !== null) {
      const dataToStore: StoredCreditsState = {
        credits,
        userId: userId || null,
        timestamp: Date.now()
      };
      localStorage.setItem(CREDITS_STORAGE_KEY, JSON.stringify(dataToStore));
      console.log('[useCreditsManagement] Stored credits:', credits);
    }
  }, [credits, userId]);

  const fetchCredits = useCallback(async () => {
    if (fetchInProgress.current) {
      console.log("[useCreditsManagement] Fetch already in progress, skipping");
      return;
    }

    try {
      fetchInProgress.current = true;
      setIsLoading(true);
      console.log('[useCreditsManagement] Fetching credits for:', userId ? `user ${userId}` : 'anonymous user');
      
      const fetchedCredits = await fetchUserCredits(userId);
      console.log('[useCreditsManagement] Fetched credits:', fetchedCredits);
      
      if (fetchedCredits === null) {
        console.log("[useCreditsManagement] No credits record found, creating default");
        const defaultCredits = userId ? 6 : 2;
        await updateCredits(defaultCredits, userId);
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
  }, [userId]);

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
      await updateCredits(credits - 1, userId);
      setCredits(credits - 1);
      return true;
    } catch (error) {
      console.error("[useCreditsManagement] Error using credit:", error);
      return false;
    }
  };

  const resetCredits = async () => {
    console.log('[useCreditsManagement] Resetting credits');
    localStorage.removeItem(CREDITS_STORAGE_KEY);
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