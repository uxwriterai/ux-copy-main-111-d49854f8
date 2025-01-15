import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/components/ThemeProvider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import Index from "./pages/Index"
import Generator from "./pages/Generator"
import CopyImprover from "./pages/CopyImprover"
import MicrocopyGenerator from "./pages/MicrocopyGenerator"

const queryClient = new QueryClient()

const App = () => (
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <SidebarProvider>
            <div className="min-h-screen flex w-full">
              <AppSidebar />
              <main className="flex-1">
                <div className="container">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/copy-improver" element={<CopyImprover />} />
                    <Route path="/generator" element={<Generator />} />
                    <Route path="/microcopy" element={<MicrocopyGenerator />} />
                  </Routes>
                </div>
              </main>
            </div>
            <Toaster />
            <Sonner />
          </SidebarProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </BrowserRouter>
)

export default App