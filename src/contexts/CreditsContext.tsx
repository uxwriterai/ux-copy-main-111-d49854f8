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
  const [credits, setCredits] = useState(4);
  const [showDialog, setShowDialog] = useState(false);

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
            <AlertDialogTitle>Unlock Unlimited AI Generations</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>You've used all your free credits! Sign up now to unlock:</p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Unlimited AI generations</li>
                <li>Save and organize your generated content</li>
                <li>Access to premium features</li>
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