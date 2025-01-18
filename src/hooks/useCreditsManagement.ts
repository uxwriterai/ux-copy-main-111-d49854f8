import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { fetchUserCredits, updateCredits } from "@/services/creditsService";
import { toast } from "sonner";

export const useCreditsManagement = (session: Session | null) => {
  const [credits, setCredits] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const fetchCredits = async () => {
    try {
      setIsLoading(true);
      const userId = session?.user?.id;
      const fetchedCredits = await fetchUserCredits(userId);
      setCredits(fetchedCredits);
      setInitialized(true);
    } catch (error) {
      console.error("Error fetching credits:", error);
      toast.error("Failed to fetch credits");
    } finally {
      setIsLoading(false);
    }
  };

  const useCredit = async (): Promise<boolean> => {
    if (credits <= 0) {
      toast.error("No credits remaining");
      return false;
    }

    try {
      await updateCredits(credits - 1, session?.user?.id);
      setCredits(credits - 1);
      return true;
    } catch (error) {
      console.error("Error using credit:", error);
      return false;
    }
  };

  const resetCredits = async () => {
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