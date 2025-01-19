import { useState, useCallback, useRef } from "react";
import { Session } from "@supabase/supabase-js";
import { fetchUserCredits, updateCredits } from "@/services/creditsService";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppSelector";
import { setCredits, setUserId, setLoading, setError } from "@/store/slices/creditsSlice";

export const useCreditsManagement = (session: Session | null) => {
  const [initialized, setInitialized] = useState(false);
  const fetchInProgress = useRef(false);
  const dispatch = useAppDispatch();
  const { credits, isLoading } = useAppSelector(state => state.credits);

  const fetchCredits = useCallback(async () => {
    if (fetchInProgress.current) {
      console.log("[useCreditsManagement] Fetch already in progress, skipping");
      return;
    }

    try {
      fetchInProgress.current = true;
      dispatch(setLoading(true));
      console.log('[useCreditsManagement] Fetching credits for:', session?.user?.id ? `user ${session.user.id}` : 'anonymous user');
      
      if (session?.user?.id) {
        dispatch(setUserId(session.user.id));
      }

      const fetchedCredits = await fetchUserCredits(session?.user?.id);
      console.log('[useCreditsManagement] Fetched credits:', fetchedCredits);
      
      if (fetchedCredits === null) {
        console.log("[useCreditsManagement] No credits record found, creating default");
        const defaultCredits = session?.user?.id ? 6 : 2;
        await updateCredits(defaultCredits, session?.user?.id);
        dispatch(setCredits(defaultCredits));
      } else {
        dispatch(setCredits(fetchedCredits));
      }
      
      setInitialized(true);
    } catch (error) {
      console.error("[useCreditsManagement] Error in fetchCredits:", error);
      dispatch(setError(error instanceof Error ? error.message : 'Unknown error'));
      setInitialized(true);
    } finally {
      dispatch(setLoading(false));
      fetchInProgress.current = false;
    }
  }, [session?.user?.id, dispatch]);

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
      dispatch(setCredits(credits - 1));
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
    useCredit,
    resetCredits,
    isLoading,
    initialized,
    setInitialized,
    fetchCredits
  };
};