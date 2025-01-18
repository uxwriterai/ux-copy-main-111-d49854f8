import { useState, useEffect } from "react";
import { Session } from "@supabase/supabase-js";
import { fetchUserCredits, updateCredits } from "@/services/creditsService";
import { toast } from "sonner";

export const useCreditsManagement = (session: Session | null) => {
  // Initialize with null to indicate not loaded yet, instead of 0
  const [credits, setCredits] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const fetchCredits = async () => {
    try {
      setIsLoading(true);
      const userId = session?.user?.id;
      const fetchedCredits = await fetchUserCredits(userId);
      console.log('Fetched credits:', fetchedCredits);
      setCredits(fetchedCredits);
      setInitialized(true);
    } catch (error) {
      console.error("Error fetching credits:", error);
      // Set default credits based on user status
      setCredits(session?.user?.id ? 6 : 2);
      toast.error("Failed to fetch credits");
    } finally {
      setIsLoading(false);
    }
  };

  const useCredit = async (): Promise<boolean> => {
    // Ensure credits is not null before proceeding
    if (credits === null) {
      console.error("Credits not initialized");
      return false;
    }

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
    // Convert null to 0 for display purposes
    credits: credits ?? 0,
    setCredits,
    useCredit,
    resetCredits,
    isLoading,
    initialized,
    fetchCredits
  };
};