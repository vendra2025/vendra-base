import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "react-hot-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Vendra Knowledge Base - Base de Conhecimento IA",
  description: "Sistema de gerenciamento de base de conhecimento para automação WhatsApp com IA",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className={inter.className}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            className: '',
            style: {
              background: '#1a1a1a',
              color: '#fff',
              border: '1px solid #262626',
            },
          }}
        />
      </body>
    </html>
  )
}
