import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { Sidebar } from "@/components/shared/Sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/login")
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto bg-background">
        <div className="container mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
