"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Copy, RefreshCw, Edit, Trash2 } from "lucide-react"
import toast from "react-hot-toast"
import { formatDate } from "@/lib/utils"

interface Cliente {
  id: string
  name: string
  email: string
  active: boolean
  apiToken: string
  createdAt: string
  _count: {
    apiLogs: number
  }
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  useEffect(() => {
    fetchClientes()
  }, [])

  const fetchClientes = async () => {
    try {
      const response = await fetch("/api/admin/clientes")
      const data = await response.json()
      setClientes(data)
    } catch (error) {
      toast.error("Erro ao carregar clientes")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateCliente = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error("Senhas não coincidem")
      return
    }

    try {
      const response = await fetch("/api/admin/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          active: true,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        toast.error(error.error || "Erro ao criar cliente")
        return
      }

      toast.success("Cliente criado com sucesso!")
      setIsDialogOpen(false)
      setFormData({ name: "", email: "", password: "", confirmPassword: "" })
      fetchClientes()
    } catch (error) {
      toast.error("Erro ao criar cliente")
    }
  }

  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token)
    toast.success("Token copiado!")
  }

  const handleRegenerateToken = async (id: string) => {
    if (!confirm("Tem certeza? O token antigo deixará de funcionar.")) return

    try {
      const response = await fetch(`/api/admin/clientes/${id}/regenerate-token`, {
        method: "POST",
      })
      const data = await response.json()
      toast.success("Token regenerado!")
      handleCopyToken(data.apiToken)
      fetchClientes()
    } catch (error) {
      toast.error("Erro ao regenerar token")
    }
  }

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      await fetch(`/api/admin/clientes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !currentActive }),
      })
      toast.success(currentActive ? "Cliente desativado" : "Cliente ativado")
      fetchClientes()
    } catch (error) {
      toast.error("Erro ao atualizar status")
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.")) return

    try {
      await fetch(`/api/admin/clientes/${id}`, {
        method: "DELETE",
      })
      toast.success("Cliente excluído")
      fetchClientes()
    } catch (error) {
      toast.error("Erro ao excluir cliente")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gerenciar Clientes</h1>
          <p className="text-muted-foreground">
            Crie e gerencie clientes do sistema
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Cliente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Cliente</DialogTitle>
              <DialogDescription>
                Preencha os dados para criar um novo cliente
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateCliente} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Criar Cliente
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Consultas</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientes.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell className="font-medium">{cliente.name}</TableCell>
                    <TableCell>{cliente.email}</TableCell>
                    <TableCell>
                      <Badge variant={cliente.active ? "success" : "destructive"}>
                        {cliente.active ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell>{cliente._count.apiLogs}</TableCell>
                    <TableCell>{formatDate(cliente.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopyToken(cliente.apiToken)}
                          title="Copiar Token"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRegenerateToken(cliente.id)}
                          title="Regenerar Token"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleToggleActive(cliente.id, cliente.active)}
                          title={cliente.active ? "Desativar" : "Ativar"}
                        >
                          {cliente.active ? "Desativar" : "Ativar"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(cliente.id)}
                          title="Excluir"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
