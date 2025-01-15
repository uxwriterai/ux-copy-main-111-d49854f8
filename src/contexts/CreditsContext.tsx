import { createContext, useContext, useState } from "react"
import { toast } from "sonner"

interface CreditsContextType {
  credits: number
  setCredits: (credits: number) => void
  resetCredits: () => void
  useCredit: () => boolean
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined)

export function CreditsProvider({ children }: { children: React.ReactNode }) {
  const [credits, setCredits] = useState<number>(15)

  const resetCredits = () => {
    console.log("Resetting credits to default value")
    setCredits(15)
  }

  const useCredit = () => {
    console.log("Attempting to use a credit. Current credits:", credits)
    if (credits <= 0) {
      console.log("No credits remaining")
      toast.error("No credits remaining")
      return false
    }
    
    setCredits(prev => prev - 1)
    console.log("Credit used successfully. Remaining credits:", credits - 1)
    return true
  }

  return (
    <CreditsContext.Provider value={{ credits, setCredits, resetCredits, useCredit }}>
      {children}
    </CreditsContext.Provider>
  )
}

export function useCredits() {
  const context = useContext(CreditsContext)
  if (context === undefined) {
    throw new Error("useCredits must be used within a CreditsProvider")
  }
  return context
}