import { BrowserRouter as Router } from "react-router-dom"
import { ThemeProvider } from "@/components/ThemeProvider"
import { Toaster } from "@/components/ui/sonner"
import { AppSidebar } from "@/components/AppSidebar"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Routes, Route } from "react-router-dom"
import { HelmetProvider } from 'react-helmet-async';
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { supabase } from "@/integrations/supabase/client"
import CopyImprover from "@/pages/CopyImprover"
import EmptyStateGenerator from "@/pages/EmptyStateGenerator"
import HeroCopyGenerator from "@/pages/HeroCopyGenerator"
import LandingPageGenerator from "@/pages/LandingPageGenerator"
import Generator from "@/pages/Generator"
import MicrocopyGenerator from "@/pages/MicrocopyGenerator"
import Index from "@/pages/Index"

// Create a client
const queryClient = new QueryClient()

function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <SessionContextProvider supabaseClient={supabase}>
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
                    </Routes>
                  </main>
                </div>
                <Toaster />
              </Router>
            </SidebarProvider>
          </ThemeProvider>
        </SessionContextProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App