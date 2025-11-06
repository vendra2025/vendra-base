# Vendra Knowledge Base

Sistema completo de Base de Conhecimento para a Vendra AI - Uma plataforma SaaS de automação WhatsApp com IA.

## 🎯 Sobre o Projeto

O Vendra Knowledge Base é um sistema que permite que clientes gerenciem suas bases de conhecimento (estilo planilha) e a IA da Vendra consulte essas informações via webhook com sistema de relevância.

## 🚀 Funcionalidades

### Admin
- ✅ Dashboard com estatísticas gerais
- ✅ Gerenciamento completo de clientes (CRUD)
- ✅ Geração e regeneração de tokens API
- ✅ Visualização de logs de consultas
- ✅ Ativação/desativação de clientes

### Cliente
- ✅ Dashboard pessoal com estatísticas
- ✅ Base de conhecimento editável (estilo planilha)
- ✅ Auto-save com debounce de 3 segundos
- ✅ Gerenciamento de colunas (adicionar/remover)
- ✅ Adicionar/remover linhas
- ✅ Import/Export CSV
- ✅ Documentação interativa da API
- ✅ Teste de API em tempo real

### API Pública
- ✅ Endpoint de busca com autenticação via token
- ✅ Sistema de relevância para resultados
- ✅ Logs de todas as consultas
- ✅ Rate limiting pronto para implementação

## 🛠️ Stack Tecnológica

- **Frontend:** Next.js 14 (App Router), React 18
- **Styling:** Tailwind CSS + shadcn/ui
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL com Prisma ORM
- **Auth:** NextAuth.js com JWT
- **Validação:** Zod
- **CSV:** PapaParse

## 📦 Instalação

### 1. Clone o repositório

```bash
git clone <repository-url>
cd vendra-base
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Edite o `.env.local` com suas configurações:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/vendra_kb?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-secret-super-seguro-aqui"
```

### 4. Configure o banco de dados

```bash
# Gerar cliente Prisma
npx prisma generate

# Criar as tabelas no banco
npx prisma db push

# Popular com dados iniciais
npm run db:seed
```

### 5. Execute o projeto

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

## 👤 Credenciais Padrão

Após executar o seed, você pode fazer login com:

### Admin
- **Email:** admin@vendra.com.br
- **Senha:** admin123

### Cliente (exemplo)
- **Email:** cliente@exemplo.com
- **Senha:** cliente123

## 📁 Estrutura do Projeto

```
vendra-knowledge-base/
├── app/
│   ├── (auth)/              # Rotas de autenticação
│   │   └── login/
│   ├── (admin)/             # Rotas do admin
│   │   └── admin/
│   │       ├── page.tsx     # Dashboard admin
│   │       ├── clientes/    # Gerenciar clientes
│   │       └── estatisticas/ # Logs e estatísticas
│   ├── (cliente)/           # Rotas do cliente
│   │   ├── dashboard/       # Dashboard cliente
│   │   ├── base-conhecimento/ # Gerenciar KB
│   │   └── api-docs/        # Documentação
│   └── api/
│       ├── auth/            # NextAuth
│       ├── admin/           # APIs admin
│       ├── cliente/         # APIs cliente
│       └── v1/              # API pública
├── components/
│   ├── ui/                  # Componentes shadcn/ui
│   ├── admin/               # Componentes admin
│   ├── cliente/             # Componentes cliente
│   └── shared/              # Componentes compartilhados
├── lib/
│   ├── auth.ts              # Config NextAuth
│   ├── prisma.ts            # Cliente Prisma
│   ├── utils.ts             # Utilidades
│   └── validations/         # Schemas Zod
├── prisma/
│   ├── schema.prisma        # Schema do banco
│   └── seed.ts              # Seed inicial
└── types/
    └── index.ts             # TypeScript types
```

## 🔌 API de Busca

### Endpoint

```
POST /api/v1/knowledge-base/search
```

### Headers

```
Content-Type: application/json
Authorization: Bearer {SEU_TOKEN_API}
```

### Request Body

```json
{
  "query": "texto para buscar",
  "filters": {
    "coluna": "valor"
  },
  "limit": 10
}
```

### Response

```json
{
  "success": true,
  "results": [
    {
      "id": "result-0",
      "data": {
        "Nome": "Exemplo",
        "Descrição": "Descrição do item"
      },
      "relevance": 0.95
    }
  ],
  "total": 1,
  "query": "exemplo"
}
```

### Sistema de Relevância

- **1.0** - Match exato
- **0.8** - Match no início do texto
- **0.5** - Match no meio do texto
- **+0.2** - Bonus por match em múltiplas colunas

## 🎨 Design System

### Cores

```css
Primary (Verde Vendra): #10b981
Background: #0a0a0a
Surface: #1a1a1a
Text Primary: #ffffff
Text Secondary: #a3a3a3
Accent: #34d399
Error: #ef4444
```

### Componentes

O projeto utiliza **shadcn/ui** com tema dark personalizado baseado na identidade visual da Vendra.

## 📊 Banco de Dados

### Schema Principal

- **User** - Usuários (Admin e Cliente)
- **KnowledgeBase** - Bases de conhecimento
- **ApiLog** - Logs de consultas API

Veja o schema completo em `prisma/schema.prisma`

## 🔒 Segurança

- ✅ Autenticação JWT com NextAuth.js
- ✅ Senhas hasheadas com bcrypt
- ✅ Validação de inputs com Zod
- ✅ Tokens API únicos (UUID)
- ✅ Proteção de rotas por role
- ✅ Logs de todas as consultas

## 🚢 Deploy

### Recomendado: Vercel

1. Push para GitHub
2. Conecte no Vercel
3. Configure as variáveis de ambiente
4. Deploy automático

### Database

Recomendamos usar:
- **Neon** (PostgreSQL serverless)
- **Supabase**
- **Railway**

## 📝 Scripts Disponíveis

```bash
npm run dev          # Desenvolvimento
npm run build        # Build produção
npm run start        # Produção
npm run lint         # ESLint
npm run db:push      # Atualizar schema DB
npm run db:seed      # Seed banco de dados
npm run db:studio    # Prisma Studio
```

## 🔄 Próximos Passos (Features Futuras)

- [ ] Busca semântica com embeddings
- [ ] Múltiplas bases por cliente
- [ ] Versionamento de dados
- [ ] Webhooks para notificar mudanças
- [ ] Integração com Google Sheets
- [ ] 2FA para admin
- [ ] Rate limiting avançado
- [ ] Analytics detalhado

## 🤝 Contribuindo

Este é um projeto proprietário da Vendra AI. Para contribuir, entre em contato com a equipe.

## 📄 Licença

Propriedade da Vendra AI. Todos os direitos reservados.

## 📧 Suporte

Para suporte, entre em contato com: suporte@vendra.com.br

---

Desenvolvido com ❤️ para a Vendra AI
