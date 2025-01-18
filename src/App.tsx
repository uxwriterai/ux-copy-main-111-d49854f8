import { BrowserRouter as Router } from "react-router-dom"
import { ThemeProvider } from "@/components/ThemeProvider"
import { Toaster } from "@/components/ui/sonner"
import { AppSidebar } from "@/components/AppSidebar"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SessionContextProvider } from "@supabase/auth-helpers-react"
import { supabase } from "./integrations/supabase/client"
import { CreditsProvider } from "./contexts/CreditsContext"
import { Routes, Route } from "react-router-dom"
import CopyImprover from "@/pages/CopyImprover"
import EmptyStateGenerator from "@/pages/EmptyStateGenerator"
import HeroCopyGenerator from "@/pages/HeroCopyGenerator"
import LandingPageGenerator from "@/pages/LandingPageGenerator"
import Settings from "@/pages/Settings"

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <QueryClientProvider client={queryClient}>
        <CreditsProvider>
          <ThemeProvider>
            <Router>
              <div className="flex min-h-screen">
                <AppSidebar />
                <main className="flex-1 overflow-y-auto">
                  <Routes>
                    <Route path="/" element={<CopyImprover />} />
                    <Route path="/empty-state" element={<EmptyStateGenerator />} />
                    <Route path="/hero" element={<HeroCopyGenerator />} />
                    <Route path="/landing-page" element={<LandingPageGenerator />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </main>
              </div>
              <Toaster />
            </Router>
          </ThemeProvider>
        </CreditsProvider>
      </QueryClientProvider>
    </SessionContextProvider>
  )
}

export default App