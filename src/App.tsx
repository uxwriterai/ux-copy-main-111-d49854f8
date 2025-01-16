import { ThemeProvider } from "@/components/ThemeProvider"
import { Toaster } from "@/components/ui/sonner"
import { BrowserRouter } from "react-router-dom"
import { AppSidebar } from "@/components/AppSidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { CreditsProvider } from "@/contexts/CreditsContext"

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <CreditsProvider>
          <SidebarProvider>
            <div className="flex min-h-screen">
              <AppSidebar />
              <Toaster />
            </div>
          </SidebarProvider>
        </CreditsProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App