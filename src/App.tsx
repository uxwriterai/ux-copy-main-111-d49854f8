import { ThemeProvider } from "@/components/ThemeProvider"
import { Toaster } from "@/components/ui/sonner"
import { AppSidebar } from "@/components/AppSidebar"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { CreditsProvider } from "./contexts/CreditsContext"
import { Routes, Route } from "react-router-dom"
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
    <QueryClientProvider client={queryClient}>
      <CreditsProvider>
        <ThemeProvider>
          <SidebarProvider>
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
          </SidebarProvider>
        </ThemeProvider>
      </CreditsProvider>
    </QueryClientProvider>
  )
}

export default App