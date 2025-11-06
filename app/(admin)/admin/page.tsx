import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Activity, UserPlus, Zap } from "lucide-react"
import { formatDate } from "@/lib/utils"

async function getStats() {
  const [
    totalClientes,
    clientesAtivos,
    totalConsultas,
    consultasHoje,
    recentClientes,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "CLIENTE" } }),
    prisma.user.count({ where: { role: "CLIENTE", active: true } }),
    prisma.apiLog.count(),
    prisma.apiLog.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
        },
      },
    }),
    prisma.user.findMany({
      where: { role: "CLIENTE" },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        active: true,
        createdAt: true,
      },
    }),
  ])

  return {
    totalClientes,
    clientesAtivos,
    totalConsultas,
    consultasHoje,
    recentClientes,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema de base de conhecimento
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Clientes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClientes}</div>
            <p className="text-xs text-muted-foreground">
              {stats.clientesAtivos} ativos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Consultas API
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalConsultas}</div>
            <p className="text-xs text-muted-foreground">Total de consultas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Consultas Hoje
            </CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.consultasHoje}</div>
            <p className="text-xs text-muted-foreground">Nas últimas 24h</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Novos Este Mês
            </CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.recentClientes.length}
            </div>
            <p className="text-xs text-muted-foreground">Clientes recentes</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Clients */}
      <Card>
        <CardHeader>
          <CardTitle>Últimos Clientes Criados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentClientes.map((cliente) => (
              <div
                key={cliente.id}
                className="flex items-center justify-between border-b border-border pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">{cliente.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {cliente.email}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{formatDate(cliente.createdAt)}</p>
                  <p
                    className={`text-xs ${
                      cliente.active ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {cliente.active ? "Ativo" : "Inativo"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
