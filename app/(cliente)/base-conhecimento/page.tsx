"use client"

import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, Upload, Download, Columns, Save } from "lucide-react"
import toast from "react-hot-toast"
import Papa from "papaparse"

interface Column {
  id: string
  name: string
  type: 'text' | 'number' | 'date' | 'boolean'
  order: number
}

export default function BaseConhecimentoPage() {
  const [columns, setColumns] = useState<Column[]>([])
  const [data, setData] = useState<Record<string, any>[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [editingCell, setEditingCell] = useState<{ row: number; col: string } | null>(null)
  const [isColumnDialogOpen, setIsColumnDialogOpen] = useState(false)
  const [newColumnName, setNewColumnName] = useState("")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  useEffect(() => {
    fetchKnowledgeBase()
  }, [])

  // Auto-save após 3 segundos de inatividade
  useEffect(() => {
    if (!hasUnsavedChanges) return

    const timeout = setTimeout(() => {
      saveKnowledgeBase()
    }, 3000)

    return () => clearTimeout(timeout)
  }, [data, columns, hasUnsavedChanges])

  const fetchKnowledgeBase = async () => {
    try {
      const response = await fetch("/api/cliente/knowledge-base")
      const kb = await response.json()
      setColumns(kb.columns || [])
      setData(kb.data || [])
    } catch (error) {
      toast.error("Erro ao carregar base de conhecimento")
    } finally {
      setIsLoading(false)
    }
  }

  const saveKnowledgeBase = async () => {
    setIsSaving(true)
    try {
      await fetch("/api/cliente/knowledge-base", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Minha Base de Conhecimento",
          columns,
          data,
        }),
      })
      setHasUnsavedChanges(false)
      toast.success("Salvo automaticamente")
    } catch (error) {
      toast.error("Erro ao salvar")
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddColumn = () => {
    if (!newColumnName.trim()) {
      toast.error("Nome da coluna não pode ser vazio")
      return
    }

    const newColumn: Column = {
      id: `col-${Date.now()}`,
      name: newColumnName,
      type: 'text',
      order: columns.length,
    }

    setColumns([...columns, newColumn])
    setNewColumnName("")
    setIsColumnDialogOpen(false)
    setHasUnsavedChanges(true)
    toast.success("Coluna adicionada")
  }

  const handleDeleteColumn = (columnId: string) => {
    if (!confirm("Tem certeza que deseja excluir esta coluna?")) return

    const column = columns.find(c => c.id === columnId)
    if (!column) return

    // Remover coluna e seus dados
    setColumns(columns.filter(c => c.id !== columnId))
    setData(data.map(row => {
      const newRow = { ...row }
      delete newRow[column.name]
      return newRow
    }))
    setHasUnsavedChanges(true)
    toast.success("Coluna removida")
  }

  const handleAddRow = () => {
    const newRow: Record<string, any> = {}
    columns.forEach(col => {
      newRow[col.name] = ""
    })
    setData([...data, newRow])
    setHasUnsavedChanges(true)
  }

  const handleDeleteRow = (index: number) => {
    if (!confirm("Tem certeza que deseja excluir esta linha?")) return
    setData(data.filter((_, i) => i !== index))
    setHasUnsavedChanges(true)
    toast.success("Linha removida")
  }

  const handleCellChange = (rowIndex: number, columnName: string, value: any) => {
    const newData = [...data]
    newData[rowIndex] = { ...newData[rowIndex], [columnName]: value }
    setData(newData)
    setHasUnsavedChanges(true)
  }

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        if (results.data.length === 0) {
          toast.error("Arquivo CSV vazio")
          return
        }

        // Criar colunas baseadas no CSV
        const headers = Object.keys(results.data[0] as any)
        const newColumns: Column[] = headers.map((name, index) => ({
          id: `col-${Date.now()}-${index}`,
          name,
          type: 'text',
          order: index,
        }))

        setColumns(newColumns)
        setData(results.data as any[])
        setHasUnsavedChanges(true)
        toast.success(`${results.data.length} registros importados`)
      },
      error: () => {
        toast.error("Erro ao importar CSV")
      },
    })

    e.target.value = ""
  }

  const handleExportCSV = () => {
    if (data.length === 0) {
      toast.error("Nenhum dado para exportar")
      return
    }

    const csv = Papa.unparse(data)
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "base-conhecimento.csv"
    a.click()
    URL.revokeObjectURL(url)
    toast.success("CSV exportado")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-lg font-medium">Carregando...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Base de Conhecimento</h1>
          <p className="text-muted-foreground">
            Gerencie os dados da sua base de conhecimento
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isSaving && (
            <span className="text-sm text-muted-foreground">Salvando...</span>
          )}
          {hasUnsavedChanges && !isSaving && (
            <span className="text-sm text-yellow-500">Alterações não salvas</span>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={() => setIsColumnDialogOpen(true)} variant="outline">
              <Columns className="mr-2 h-4 w-4" />
              Nova Coluna
            </Button>
            <Button onClick={handleAddRow} variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Nova Linha
            </Button>
            <Button onClick={() => document.getElementById('csv-upload')?.click()} variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Importar CSV
            </Button>
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleImportCSV}
              className="hidden"
            />
            <Button onClick={handleExportCSV} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar CSV
            </Button>
            <Button onClick={saveKnowledgeBase} disabled={!hasUnsavedChanges || isSaving}>
              <Save className="mr-2 h-4 w-4" />
              Salvar Agora
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="pt-6">
          {columns.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                Nenhuma coluna criada ainda. Adicione sua primeira coluna para começar.
              </p>
              <Button onClick={() => setIsColumnDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Coluna
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-4 py-2 text-left">#</th>
                    {columns.map((col) => (
                      <th key={col.id} className="px-4 py-2 text-left">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium">{col.name}</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteColumn(col.id)}
                          >
                            <Trash2 className="h-3 w-3 text-destructive" />
                          </Button>
                        </div>
                      </th>
                    ))}
                    <th className="px-4 py-2 text-left">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, rowIndex) => (
                    <tr key={rowIndex} className="border-b hover:bg-muted/50">
                      <td className="px-4 py-2 text-muted-foreground">{rowIndex + 1}</td>
                      {columns.map((col) => (
                        <td key={col.id} className="px-4 py-2">
                          <Input
                            value={row[col.name] || ""}
                            onChange={(e) => handleCellChange(rowIndex, col.name, e.target.value)}
                            className="min-w-[150px]"
                          />
                        </td>
                      ))}
                      <td className="px-4 py-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteRow(rowIndex)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog Nova Coluna */}
      <Dialog open={isColumnDialogOpen} onOpenChange={setIsColumnDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Coluna</DialogTitle>
            <DialogDescription>
              Digite o nome da nova coluna
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="column-name">Nome da Coluna</Label>
              <Input
                id="column-name"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                placeholder="Ex: Nome do Produto"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddColumn()
                  }
                }}
              />
            </div>
            <Button onClick={handleAddColumn} className="w-full">
              Adicionar Coluna
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
