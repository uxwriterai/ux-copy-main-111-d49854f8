import { ThemeProvider } from "@/components/ThemeProvider"
import { Toaster } from "@/components/ui/sonner"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { AppSidebar } from "@/components/AppSidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { CreditsProvider } from "@/contexts/CreditsContext"
import Index from "@/pages/Index"

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <CreditsProvider>
          <SidebarProvider>
            <div className="flex min-h-screen">
              <AppSidebar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                </Routes>
              </main>
              <Toaster />
            </div>
          </SidebarProvider>
        </CreditsProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App