import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Navbar } from "@/components/shared/Navbar"

export default async function ClienteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  if (session.user.role !== "CLIENTE") {
    redirect("/admin")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto p-8">
        {children}
      </main>
    </div>
  )
}
