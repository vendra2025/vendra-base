"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, BarChart3, LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const adminMenuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Clientes",
    href: "/admin/clientes",
    icon: Users,
  },
  {
    title: "Estatísticas",
    href: "/admin/estatisticas",
    icon: BarChart3,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  return (
    <div className="flex h-screen w-64 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-border px-6">
        <h1 className="text-2xl font-bold vendra-gradient bg-clip-text text-transparent">
          VENDRA
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {adminMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-border p-4">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sair
        </Button>
      </div>
    </div>
  )
}
