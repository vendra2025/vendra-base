import { redirect } from "next/navigation"

export default function Home() {
  // Redirect para login por padrão
  redirect("/login")
}
