import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/components/ThemeProvider"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import Index from "./pages/Index"
import Analysis from "./pages/Analysis"
import Generator from "./pages/Generator"
import Accessibility from "./pages/Accessibility"
import ToneAdjuster from "./pages/ToneAdjuster"
import ErrorEnhancer from "./pages/ErrorEnhancer"

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
                  <SidebarTrigger />
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/analysis" element={<Analysis />} />
                    <Route path="/generator" element={<Generator />} />
                    <Route path="/accessibility" element={<Accessibility />} />
                    <Route path="/tone" element={<ToneAdjuster />} />
                    <Route path="/error" element={<ErrorEnhancer />} />
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