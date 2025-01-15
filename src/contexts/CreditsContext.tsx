import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserCredits, updateUserCredits } from '@/services/creditsService';
import { supabase } from '@/integrations/supabase/client';

interface CreditsContextType {
  credits: number;
  useCredit: () => Promise<boolean>;
  showLoginDialog: () => void;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export function CreditsProvider({ children }: { children: React.ReactNode }) {
  const [credits, setCredits] = useState<number>(15);
  const [userIP, setUserIP] = useState<string>('');

  useEffect(() => {
    const fetchIPAndCredits = async () => {
      try {
        const response = await fetch('https://api64.ipify.org?format=json');
        const data = await response.json();
        const ip = data.ip;
        setUserIP(ip);
        
        // Store IP for services to use
        sessionStorage.setItem('current_ip', ip);

        // Fetch credits from Supabase
        const credits = await getUserCredits(ip);
        setCredits(credits);
      } catch (error) {
        console.error('Error fetching IP or credits:', error);
        setCredits(15);
      }
    };

    fetchIPAndCredits();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        // Refresh credits when user signs in
        const ip = sessionStorage.getItem('current_ip');
        if (ip) {
          const credits = await getUserCredits(ip);
          setCredits(credits);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const useCredit = async () => {
    if (credits > 0) {
      const newCredits = credits - 1;
      try {
        await updateUserCredits(userIP, newCredits);
        setCredits(newCredits);
        return true;
      } catch (error) {
        console.error('Error updating credits:', error);
        return false;
      }
    }
    return false;
  };

  const showLoginDialog = () => {
    // This is now handled by the AuthDialog component
    return;
  };

  return (
    <CreditsContext.Provider value={{ credits, useCredit, showLoginDialog }}>
      {children}
    </CreditsContext.Provider>
  );
}

export function useCredits() {
  const context = useContext(CreditsContext);
  if (context === undefined) {
    throw new Error('useCredits must be used within a CreditsProvider');
  }
  return context;
}