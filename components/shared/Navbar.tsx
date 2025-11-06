"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Database, LayoutDashboard, BookOpen, LogOut, User } from "lucide-react"
import { signOut, useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Base de Conhecimento",
    href: "/base-conhecimento",
    icon: Database,
  },
  {
    title: "Documentação API",
    href: "/api-docs",
    icon: BookOpen,
  },
]

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" })
  }

  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/dashboard">
              <h1 className="text-2xl font-bold vendra-gradient bg-clip-text text-transparent">
                VENDRA
              </h1>
            </Link>

            {/* Menu Items */}
            <div className="hidden md:flex items-center gap-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary text-white"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.title}
                  </Link>
                )
              })}
            </div>
          </div>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden md:inline">{session?.user?.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
