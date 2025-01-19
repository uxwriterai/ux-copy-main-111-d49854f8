import { BrowserRouter as Router } from "react-router-dom"
import { ThemeProvider } from "@/components/ThemeProvider"
import { Toaster } from "@/components/ui/sonner"
import { AppSidebar } from "@/components/AppSidebar"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Routes, Route } from "react-router-dom"
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
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App