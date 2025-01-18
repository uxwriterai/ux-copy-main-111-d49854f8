import { useState, useCallback } from "react";
import { Session } from "@supabase/supabase-js";
import { fetchUserCredits, updateCredits } from "@/services/creditsService";

export const useCreditsManagement = (session: Session | null) => {
  const [credits, setCredits] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const fetchCredits = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Fetching credits for:', session?.user?.id ? `user ${session.user.id}` : 'anonymous user');
      
      const fetchedCredits = await fetchUserCredits(session?.user?.id);
      console.log('Fetched credits:', fetchedCredits);
      
      if (fetchedCredits === null) {
        console.log("No credits record found, creating default");
        const defaultCredits = session?.user?.id ? 6 : 2;
        await updateCredits(defaultCredits, session?.user?.id);
        setCredits(defaultCredits);
      } else {
        setCredits(fetchedCredits);
      }
      
      setInitialized(true);
    } catch (error) {
      console.error("Error in fetchCredits:", error);
      // Keep previous state on error, but still mark as initialized
      setInitialized(true);
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id]);

  const useCredit = async (): Promise<boolean> => {
    if (!initialized) {
      console.log('Cannot use credit: credits not initialized');
      return false;
    }

    if (credits === null || credits <= 0) {
      console.log('Cannot use credit:', credits === null ? 'credits not initialized' : 'no credits remaining');
      return false;
    }

    try {
      console.log('Using credit. Current credits:', credits);
      await updateCredits(credits - 1, session?.user?.id);
      setCredits(credits - 1);
      return true;
    } catch (error) {
      console.error("Error using credit:", error);
      return false;
    }
  };

  const resetCredits = async () => {
    console.log('Resetting credits');
    setInitialized(false);
    await fetchCredits();
  };

  return {
    // Only return 0 if initialized and credits is null
    credits: initialized ? (credits ?? 0) : null,
    setCredits,
    useCredit,
    resetCredits,
    isLoading,
    initialized,
    fetchCredits
  };
};
