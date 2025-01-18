import { Button } from "@/components/ui/button"
import { useTheme } from "@/components/ThemeProvider"
import { Moon, Sun, LogOut } from "lucide-react"
import { useSessionContext } from "@supabase/auth-helpers-react"
import { useSignOut } from "@/hooks/useSignOut"

export function SidebarFooterButtons() {
  const { theme, setTheme } = useTheme()
  const { session } = useSessionContext()
  const { isSigningOut, handleSignOut } = useSignOut()

  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        className="h-9 w-9"
      >
        {theme === "light" ? (
          <Moon className="h-4 w-4" />
        ) : (
          <Sun className="h-4 w-4" />
        )}
        <span className="sr-only">Toggle theme</span>
      </Button>

      {session && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="h-9 w-9"
        >
          <LogOut className="h-4 w-4" />
          <span className="sr-only">Sign out</span>
        </Button>
      )}
    </div>
  )
}