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

interface CreditsContextType {
  credits: number;
  useCredit: () => boolean;
  showLoginDialog: () => void;
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined);

export function CreditsProvider({ children }: { children: React.ReactNode }) {
  const [credits, setCredits] = useState<number>(4);
  const [showDialog, setShowDialog] = useState(false);
  const [userIP, setUserIP] = useState<string>('');

  // Fetch user's IP address and load stored credits
  useEffect(() => {
    const fetchIPAndCredits = async () => {
      try {
        // Use a more reliable IP service
        const response = await fetch('https://api64.ipify.org?format=json');
        const data = await response.json();
        const ip = data.ip;
        setUserIP(ip);
        
        // Store IP in sessionStorage for services to use
        sessionStorage.setItem('current_ip', ip);

        // Check sessionStorage for credits
        const sessionCredits = sessionStorage.getItem(`credits_${ip}`);
        if (sessionCredits !== null) {
          setCredits(parseInt(sessionCredits));
        } else {
          // Initialize credits for new users in session
          sessionStorage.setItem(`credits_${ip}`, '4');
          setCredits(4);
        }
      } catch (error) {
        console.error('Error fetching IP:', error);
        // Fallback to default credits if IP fetch fails
        setCredits(4);
      }
    };

    fetchIPAndCredits();
  }, []);

  // Update stored credits whenever credits change
  useEffect(() => {
    if (userIP) {
      sessionStorage.setItem(`credits_${userIP}`, credits.toString());
    }
  }, [credits, userIP]);

  const useCredit = () => {
    if (credits > 0) {
      setCredits(prev => prev - 1);
      return true;
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
