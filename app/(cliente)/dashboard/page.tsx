import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, Activity, Code, Copy } from "lucide-react"
import Link from "next/link"

async function getUserStats(userId: string) {
  const [knowledgeBase, apiLogsCount, consultasHoje] = await Promise.all([
    prisma.knowledgeBase.findFirst({
      where: { userId },
    }),
    prisma.apiLog.count({
      where: { userId },
    }),
    prisma.apiLog.count({
      where: {
        userId,
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
  ])

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { apiToken: true },
  })

  const totalRegistros = knowledgeBase ? (knowledgeBase.data as any[]).length : 0

  return {
    totalRegistros,
    apiLogsCount,
    consultasHoje,
    apiToken: user?.apiToken,
    knowledgeBase,
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  const stats = await getUserStats(session!.user.id)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao seu painel de controle
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Registros
            </CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRegistros}</div>
            <p className="text-xs text-muted-foreground">
              Na sua base de conhecimento
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Consultas Este Mês
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.apiLogsCount}</div>
            <p className="text-xs text-muted-foreground">
              Total de consultas via API
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Consultas Hoje
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.consultasHoje}</div>
            <p className="text-xs text-muted-foreground">
              Nas últimas 24 horas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* API Token */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Meu Token API
          </CardTitle>
          <CardDescription>
            Use este token para fazer consultas à sua base de conhecimento
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <code className="flex-1 rounded bg-muted px-3 py-2 font-mono text-sm">
              {stats.apiToken || "Token não disponível"}
            </code>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                if (stats.apiToken) {
                  navigator.clipboard.writeText(stats.apiToken)
                }
              }}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <Link href="/api-docs">
            <Button variant="outline" className="w-full">
              Ver Documentação da API
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Base de Conhecimento</CardTitle>
            <CardDescription>
              Gerencie os dados da sua base de conhecimento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/base-conhecimento">
              <Button className="w-full">
                Gerenciar Base de Conhecimento
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Documentação</CardTitle>
            <CardDescription>
              Aprenda como integrar a API ao seu sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/api-docs">
              <Button variant="outline" className="w-full">
                Ver Documentação
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
