import { createContext, useContext, useState } from "react"

interface CreditsContextType {
  credits: number
  setCredits: (credits: number) => void
  resetCredits: () => void
}

const CreditsContext = createContext<CreditsContextType | undefined>(undefined)

export function CreditsProvider({ children }: { children: React.ReactNode }) {
  const [credits, setCredits] = useState<number>(15)

  const resetCredits = () => {
    console.log("Resetting credits to default value")
    setCredits(15)
  }

  return (
    <CreditsContext.Provider value={{ credits, setCredits, resetCredits }}>
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