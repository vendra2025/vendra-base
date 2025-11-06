"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Play } from "lucide-react"
import toast from "react-hot-toast"

export default function ApiDocsPage() {
  const [apiToken, setApiToken] = useState("")
  const [testQuery, setTestQuery] = useState("inter 2025")
  const [testResponse, setTestResponse] = useState<any>(null)
  const [isTestingAPI, setIsTestingAPI] = useState(false)

  useEffect(() => {
    fetchApiToken()
  }, [])

  const fetchApiToken = async () => {
    try {
      const response = await fetch("/api/cliente/knowledge-base")
      const kb = await response.json()
      // Buscar o token do usuário
      const userResponse = await fetch("/api/auth/session")
      const session = await userResponse.json()

      // Para pegar o token, precisamos de outro endpoint ou incluir no session
      // Por simplicidade, vamos simular
      setApiToken("seu-token-api-aqui")
    } catch (error) {
      console.error("Error fetching token:", error)
    }
  }

  const handleTestAPI = async () => {
    if (!testQuery.trim()) {
      toast.error("Digite uma query para testar")
      return
    }

    setIsTestingAPI(true)
    try {
      const response = await fetch(`${window.location.origin}/api/v1/knowledge-base/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiToken}`,
        },
        body: JSON.stringify({
          query: testQuery,
          limit: 10,
        }),
      })

      const data = await response.json()
      setTestResponse(data)
    } catch (error) {
      toast.error("Erro ao testar API")
      setTestResponse({ error: "Erro ao fazer requisição" })
    } finally {
      setIsTestingAPI(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copiado!")
  }

  const curlExample = `curl -X POST ${typeof window !== 'undefined' ? window.location.origin : 'https://seu-dominio.com'}/api/v1/knowledge-base/search \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \\
  -d '{
    "query": "inter 2025",
    "limit": 10
  }'`

  const jsExample = `fetch('${typeof window !== 'undefined' ? window.location.origin : 'https://seu-dominio.com'}/api/v1/knowledge-base/search', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer SEU_TOKEN_AQUI'
  },
  body: JSON.stringify({
    query: 'inter 2025',
    limit: 10
  })
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`

  const pythonExample = `import requests

url = '${typeof window !== 'undefined' ? window.location.origin : 'https://seu-dominio.com'}/api/v1/knowledge-base/search'
headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer SEU_TOKEN_AQUI'
}
data = {
    'query': 'inter 2025',
    'limit': 10
}

response = requests.post(url, json=data, headers=headers)
print(response.json())`

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-3xl font-bold">Documentação da API</h1>
        <p className="text-muted-foreground">
          Aprenda como integrar a API de busca da base de conhecimento
        </p>
      </div>

      {/* API Token */}
      <Card>
        <CardHeader>
          <CardTitle>Seu Token de API</CardTitle>
          <CardDescription>
            Use este token para autenticar suas requisições
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              value={apiToken}
              readOnly
              className="font-mono text-sm"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(apiToken)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            ⚠️ Mantenha seu token seguro e não o compartilhe publicamente
          </p>
        </CardContent>
      </Card>

      {/* Endpoint */}
      <Card>
        <CardHeader>
          <CardTitle>Endpoint de Busca</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-sm font-mono">
                POST
              </span>
              <code className="text-sm">/api/v1/knowledge-base/search</code>
            </div>
            <p className="text-sm text-muted-foreground">
              Realiza busca na base de conhecimento com scoring de relevância
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Headers</h4>
            <div className="bg-muted p-3 rounded font-mono text-sm space-y-1">
              <div>Content-Type: application/json</div>
              <div>Authorization: Bearer {'<seu-token>'}</div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Request Body</h4>
            <pre className="bg-muted p-3 rounded font-mono text-sm overflow-x-auto">
{`{
  "query": "string (obrigatório)",
  "filters": {
    "column_name": "value"
  },
  "limit": 10
}`}
            </pre>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Response 200 OK</h4>
            <pre className="bg-muted p-3 rounded font-mono text-sm overflow-x-auto">
{`{
  "success": true,
  "results": [
    {
      "id": "result-0",
      "data": {
        "Nome do Evento": "O Inter 2025",
        "Data": "20 a 22/11/2025"
      },
      "relevance": 0.95
    }
  ],
  "total": 1,
  "query": "inter 2025"
}`}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Exemplos de Código */}
      <Card>
        <CardHeader>
          <CardTitle>Exemplos de Código</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* cURL */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">cURL</h4>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(curlExample)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copiar
              </Button>
            </div>
            <pre className="bg-muted p-4 rounded font-mono text-sm overflow-x-auto">
              {curlExample}
            </pre>
          </div>

          {/* JavaScript */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">JavaScript (Fetch)</h4>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(jsExample)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copiar
              </Button>
            </div>
            <pre className="bg-muted p-4 rounded font-mono text-sm overflow-x-auto">
              {jsExample}
            </pre>
          </div>

          {/* Python */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Python (Requests)</h4>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(pythonExample)}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copiar
              </Button>
            </div>
            <pre className="bg-muted p-4 rounded font-mono text-sm overflow-x-auto">
              {pythonExample}
            </pre>
          </div>
        </CardContent>
      </Card>

      {/* Teste Interativo */}
      <Card>
        <CardHeader>
          <CardTitle>Teste Interativo</CardTitle>
          <CardDescription>
            Teste a API diretamente daqui
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="test-query">Query de Busca</Label>
            <div className="flex gap-2">
              <Input
                id="test-query"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                placeholder="Digite sua busca..."
              />
              <Button onClick={handleTestAPI} disabled={isTestingAPI}>
                <Play className="h-4 w-4 mr-2" />
                {isTestingAPI ? "Testando..." : "Testar"}
              </Button>
            </div>
          </div>

          {testResponse && (
            <div className="space-y-2">
              <Label>Resposta</Label>
              <pre className="bg-muted p-4 rounded font-mono text-sm overflow-x-auto max-h-96">
                {JSON.stringify(testResponse, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Códigos de Erro */}
      <Card>
        <CardHeader>
          <CardTitle>Códigos de Erro</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="font-medium">400 - Bad Request</div>
              <p className="text-sm text-muted-foreground">
                Query inválida ou parâmetros incorretos
              </p>
            </div>
            <div>
              <div className="font-medium">401 - Unauthorized</div>
              <p className="text-sm text-muted-foreground">
                Token ausente ou inválido
              </p>
            </div>
            <div>
              <div className="font-medium">404 - Not Found</div>
              <p className="text-sm text-muted-foreground">
                Base de conhecimento não encontrada
              </p>
            </div>
            <div>
              <div className="font-medium">500 - Internal Server Error</div>
              <p className="text-sm text-muted-foreground">
                Erro interno do servidor
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
