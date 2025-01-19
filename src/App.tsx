import { BrowserRouter as Router } from "react-router-dom"
import { ThemeProvider } from "@/components/ThemeProvider"
import { Toaster } from "@/components/ui/sonner"
import { AppSidebar } from "@/components/AppSidebar"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SessionContextProvider } from "@supabase/auth-helpers-react"
import { supabase } from "./integrations/supabase/client"
import { CreditsProvider } from "./contexts/CreditsContext"
import { Routes, Route } from "react-router-dom"
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store/store'
import CopyImprover from "@/pages/CopyImprover"
import EmptyStateGenerator from "@/pages/EmptyStateGenerator"
import HeroCopyGenerator from "@/pages/HeroCopyGenerator"
import LandingPageGenerator from "@/pages/LandingPageGenerator"
import Settings from "@/pages/Settings"
import Generator from "@/pages/Generator"
import MicrocopyGenerator from "@/pages/MicrocopyGenerator"
import Index from "@/pages/Index"
import { SidebarProvider } from "@/components/ui/sidebar"

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SessionContextProvider supabaseClient={supabase}>
          <QueryClientProvider client={queryClient}>
            <CreditsProvider>
              <ThemeProvider>
                <SidebarProvider>
                  <Router>
                    <div className="flex min-h-screen w-full">
                      <AppSidebar />
                      <main className="flex-1 overflow-y-auto">
                        <Routes>
                          <Route path="/" element={<Index />} />
                          <Route path="/copy-improver" element={<CopyImprover />} />
                          <Route path="/generator" element={<Generator />} />
                          <Route path="/microcopy" element={<MicrocopyGenerator />} />
                          <Route path="/empty-state" element={<EmptyStateGenerator />} />
                          <Route path="/hero" element={<HeroCopyGenerator />} />
                          <Route path="/hero-copy" element={<HeroCopyGenerator />} />
                          <Route path="/landing-page" element={<LandingPageGenerator />} />
                          <Route path="/settings" element={<Settings />} />
                        </Routes>
                      </main>
                    </div>
                    <Toaster />
                  </Router>
                </SidebarProvider>
              </ThemeProvider>
            </CreditsProvider>
          </QueryClientProvider>
        </SessionContextProvider>
      </PersistGate>
    </Provider>
  )
}

export default App