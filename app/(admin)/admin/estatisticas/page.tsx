import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDateTime } from "@/lib/utils"

async function getRecentLogs() {
  const logs = await prisma.apiLog.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  })

  return logs
}

export default async function EstatisticasPage() {
  const logs = await getRecentLogs()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Estatísticas</h1>
        <p className="text-muted-foreground">
          Logs de consultas API do sistema
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Últimas 50 Consultas API</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Query</TableHead>
                <TableHead>Endpoint</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tempo (ms)</TableHead>
                <TableHead>Data/Hora</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{log.user.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {log.user.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {log.query || "-"}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {log.endpoint}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        log.statusCode === 200
                          ? "bg-green-500/10 text-green-500"
                          : "bg-red-500/10 text-red-500"
                      }`}
                    >
                      {log.statusCode}
                    </span>
                  </TableCell>
                  <TableCell>{log.responseTime}ms</TableCell>
                  <TableCell className="text-sm">
                    {formatDateTime(log.createdAt)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
