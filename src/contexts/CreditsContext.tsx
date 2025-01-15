import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { getUserCredits, updateUserCredits } from '@/services/creditsService';

interface CreditsContextType {
  credits: number;
  useCredit: () => Promise<boolean>;
  showLoginDialog: () => void;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export function CreditsProvider({ children }: { children: React.ReactNode }) {
  const [credits, setCredits] = useState<number>(4);
  const [showDialog, setShowDialog] = useState(false);
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
        setCredits(4);
      }
    };

    fetchIPAndCredits();
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
    setShowDialog(true);
    return false;
  };

  const showLoginDialog = () => {
    setShowDialog(true);
  };

  return (
    <CreditsContext.Provider value={{ credits, useCredit, showLoginDialog }}>
      {children}
      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unlock 5x More Credits</AlertDialogTitle>
            <AlertDialogDescription>
              <p>You've used all your free credits! Sign up now to get:</p>
              <ul className="list-disc pl-4 mt-2 space-y-1">
                <li>5x more credits to generate content</li>
                <li>Priority support</li>
              </ul>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Maybe Later</AlertDialogCancel>
            <AlertDialogAction>Sign Up Now</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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