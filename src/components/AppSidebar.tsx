import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useMobile } from "@/hooks/use-mobile"
import { useSidebar } from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router-dom"
import { Menu } from "lucide-react"
import { SidebarFooterButtons } from "@/components/sidebar/SidebarFooterButtons"
import { SidebarMenuList } from "@/components/sidebar/SidebarMenuList"

const navigation = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "UX Copy Enhancer",
    href: "/copy-improver",
  },
  {
    title: "A/B Copy Test Generator",
    href: "/generator",
  },
  {
    title: "Microcopy Creator",
    href: "/microcopy",
  },
  {
    title: "Empty State Builder",
    href: "/empty-state",
  },
  {
    title: "Hero Copy Generator",
    href: "/hero-copy",
  },
  {
    title: "Landing Page Generator",
    href: "/landing-page",
  },
]

export function AppSidebar() {
  const isMobile = useMobile()
  const { isOpen, setIsOpen } = useSidebar()
  const location = useLocation()

  if (isMobile) {
    return (
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:hidden"
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pl-1 pr-0">
          <div className="px-7">
            <Link to="/" className="flex items-center">
              <span className="font-bold">UX Writing Tools</span>
            </Link>
          </div>
          <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-7">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center text-lg font-medium transition-colors hover:text-foreground/80",
                    item.href === location.pathname
                      ? "text-foreground"
                      : "text-foreground/60"
                  )}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </ScrollArea>
          <SidebarFooterButtons />
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <div className="hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-[60px] items-center border-b px-6">
          <Link to="/" className="flex items-center gap-2 font-bold">
            UX Writing Tools
          </Link>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="flex flex-col gap-2 p-6">
            <SidebarMenuList />
          </div>
        </div>
        <SidebarFooterButtons />
      </div>
    </div>
  )
}