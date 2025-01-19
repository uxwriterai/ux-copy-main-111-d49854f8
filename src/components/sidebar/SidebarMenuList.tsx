import { cn } from "@/lib/utils"
import { Link, useLocation } from "react-router-dom"

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

export function SidebarMenuList() {
  const location = useLocation()

  return (
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
  )
}