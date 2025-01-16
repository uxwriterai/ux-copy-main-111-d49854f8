import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AppSidebar } from "@/components/AppSidebar"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/ThemeProvider"
import { CreditsProvider } from "@/contexts/CreditsContext"
import { SidebarProvider } from "@/components/ui/sidebar"
import Index from "@/pages/Index"
import Generator from "@/pages/Generator"
import Analysis from "@/pages/Analysis"
import HeroCopyGenerator from "@/pages/HeroCopyGenerator"
import LandingPageGenerator from "@/pages/LandingPageGenerator"
import MicrocopyGenerator from "@/pages/MicrocopyGenerator"
import EmptyStateGenerator from "@/pages/EmptyStateGenerator"
import ErrorEnhancer from "@/pages/ErrorEnhancer"
import ToneAdjuster from "@/pages/ToneAdjuster"
import CopyImprover from "@/pages/CopyImprover"
import Accessibility from "@/pages/Accessibility"
import Settings from "@/pages/Settings"

function App() {
  return (
    <ThemeProvider>
      <CreditsProvider>
        <SidebarProvider>
          <Router>
            <div className="flex min-h-screen">
              <AppSidebar />
              <main className="flex-1 overflow-y-auto">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/generator" element={<Generator />} />
                  <Route path="/analysis" element={<Analysis />} />
                  <Route path="/hero-copy" element={<HeroCopyGenerator />} />
                  <Route path="/landing-page" element={<LandingPageGenerator />} />
                  <Route path="/microcopy" element={<MicrocopyGenerator />} />
                  <Route path="/empty-state" element={<EmptyStateGenerator />} />
                  <Route path="/error-enhancer" element={<ErrorEnhancer />} />
                  <Route path="/tone-adjuster" element={<ToneAdjuster />} />
                  <Route path="/copy-improver" element={<CopyImprover />} />
                  <Route path="/accessibility" element={<Accessibility />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </main>
            </div>
            <Toaster />
          </Router>
        </SidebarProvider>
      </CreditsProvider>
    </ThemeProvider>
  )
}

export default App