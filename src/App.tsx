import { ThemeProvider } from "@/components/ThemeProvider"
import { Toaster } from "@/components/ui/sonner"
import { AppSidebar } from "@/components/AppSidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { CreditsProvider } from "@/contexts/CreditsContext"
import { Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import HeroCopyGenerator from "@/pages/HeroCopyGenerator"
import LandingPageGenerator from "@/pages/LandingPageGenerator"
import EmptyStateGenerator from "@/pages/EmptyStateGenerator"
import CopyImprover from "@/pages/CopyImprover"
import ABTestingForm from "@/components/ab-testing/ABTestingForm"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <CreditsProvider>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <AppSidebar />
              <main className="flex-1 overflow-y-auto">
                <Routes>
                  <Route path="/" element={<HeroCopyGenerator />} />
                  <Route path="/landing-page" element={<LandingPageGenerator />} />
                  <Route path="/empty-state" element={<EmptyStateGenerator />} />
                  <Route path="/copy-improver" element={<CopyImprover />} />
                  <Route path="/ab-testing" element={<ABTestingForm />} />
                </Routes>
              </main>
            </div>
          </SidebarProvider>
          <Toaster />
        </CreditsProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
