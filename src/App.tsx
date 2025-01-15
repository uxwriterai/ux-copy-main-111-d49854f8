import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@/components/ThemeProvider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { useEffect } from "react"
import Index from "./pages/Index"
import Generator from "./pages/Generator"
import CopyImprover from "./pages/CopyImprover"
import MicrocopyGenerator from "./pages/MicrocopyGenerator"
import EmptyStateGenerator from "./pages/EmptyStateGenerator"
import HeroCopyGenerator from "./pages/HeroCopyGenerator"
import LandingPageGenerator from "./pages/LandingPageGenerator"

const queryClient = new QueryClient()

const App = () => {
  useEffect(() => {
    const loadFont = async () => {
      const font = new FontFace(
        'Manrope',
        'url(https://fonts.gstatic.com/s/manrope/v15/xn7gYHE41ni1AdIRggexSg.woff2)'
      );

      try {
        await font.load();
        document.fonts.add(font);
        console.log('Manrope font loaded successfully');
      } catch (error) {
        console.error('Error loading Manrope font:', error);
      }
    };

    loadFont();
  }, []);

  return (
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
                      <Route path="/empty-state" element={<EmptyStateGenerator />} />
                      <Route path="/hero-copy" element={<HeroCopyGenerator />} />
                      <Route path="/landing-page" element={<LandingPageGenerator />} />
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
}

export default App