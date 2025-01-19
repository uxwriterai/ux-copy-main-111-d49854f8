import { ThemeProvider } from "@/components/ThemeProvider"
import { Toaster } from "@/components/ui/sonner"
import { AppSidebar } from "@/components/AppSidebar"
import { CreditsProvider } from "@/contexts/CreditsContext"
import { Routes, Route } from "react-router-dom"
import { SessionContextProvider } from "@supabase/auth-helpers-react"
import { supabase } from "@/integrations/supabase/client"
import Home from "@/pages/Home"
import About from "@/pages/About"
import Contact from "@/pages/Contact"
import CopyImprover from "@/pages/CopyImprover"
import EmptyStateGenerator from "@/pages/EmptyStateGenerator"
import LandingPageGenerator from "@/pages/LandingPageGenerator"
import HeroCopyGenerator from "@/pages/HeroCopyGenerator"
import ABTestingForm from "@/components/ab-testing/ABTestingForm"

export default function App() {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <CreditsProvider>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <div className="min-h-screen bg-background">
            <div className="flex">
              <AppSidebar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/copy-improver" element={<CopyImprover />} />
                  <Route path="/empty-state-generator" element={<EmptyStateGenerator />} />
                  <Route path="/landing-page-generator" element={<LandingPageGenerator />} />
                  <Route path="/hero-copy-generator" element={<HeroCopyGenerator />} />
                  <Route path="/ab-testing" element={<ABTestingForm />} />
                </Routes>
              </main>
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </CreditsProvider>
    </SessionContextProvider>
  )
}
