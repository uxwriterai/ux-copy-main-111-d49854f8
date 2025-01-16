import { ThemeProvider } from "@/components/ThemeProvider"
import { Toaster } from "@/components/ui/sonner"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AppSidebar } from "@/components/AppSidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { CreditsProvider } from "@/contexts/CreditsContext"
import Index from "@/pages/Index"
import CopyImprover from "@/pages/CopyImprover"
import Generator from "@/pages/Generator"
import MicrocopyGenerator from "@/pages/MicrocopyGenerator"
import EmptyStateGenerator from "@/pages/EmptyStateGenerator"
import HeroCopyGenerator from "@/pages/HeroCopyGenerator"
import LandingPageGenerator from "@/pages/LandingPageGenerator"
import Settings from "@/pages/Settings"

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <CreditsProvider>
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <main className="flex-1 w-full">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/copy-improver" element={<CopyImprover />} />
                  <Route path="/generator" element={<Generator />} />
                  <Route path="/microcopy" element={<MicrocopyGenerator />} />
                  <Route path="/empty-state" element={<EmptyStateGenerator />} />
                  <Route path="/hero-copy" element={<HeroCopyGenerator />} />
                  <Route path="/landing-page" element={<LandingPageGenerator />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </main>
              <Toaster />
            </div>
          </SidebarProvider>
        </CreditsProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;