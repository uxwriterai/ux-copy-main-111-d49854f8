import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { fetchUserCredits, updateCredits } from "@/services/creditsService";
import { toast } from "sonner";

export const useCreditsManagement = (session: Session | null) => {
  const [credits, setCredits] = useState<number>(2); // Initialize with default credits
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const fetchCredits = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching credits for:', session?.user?.id ? `user ${session.user.id}` : 'anonymous user');
      const fetchedCredits = await fetchUserCredits(session?.user?.id);
      console.log('Fetched credits:', fetchedCredits);
      
      if (fetchedCredits === null) {
        console.log("No credits record found, using defaults");
        const defaultCredits = session?.user?.id ? 6 : 2;
        setCredits(defaultCredits);
        // Create initial credits record
        await updateCredits(defaultCredits, session?.user?.id);
      } else {
        setCredits(fetchedCredits);
      }
      
      setInitialized(true);
    } catch (error) {
      console.error("Error fetching credits:", error);
      const defaultCredits = session?.user?.id ? 6 : 2;
      setCredits(defaultCredits);
      toast.error("Failed to fetch credits");
    } finally {
      setIsLoading(false);
    }
  };

  const useCredit = async (): Promise<boolean> => {
    if (credits <= 0) {
      console.log('Cannot use credit: no credits remaining');
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
    credits,
    setCredits,
    useCredit,
    resetCredits,
    isLoading,
    initialized,
    fetchCredits
  };
};