# Guia de Correção de Instalação - Vendra Knowledge Base

## Problema Identificado
Você está com apenas 4 pacotes instalados quando deveria ter mais de 500.

## Solução Passo a Passo

### 1. Verifique se está na pasta correta

```bash
# No PowerShell/CMD, execute:
cd C:\Users\Diego\vscode-apps\vendra-base-de-conhecimento\vendra-base-claude-vendra-knowledge-base-system-011CUsEhwG5EayRXB8mQii4k

# Verifique se o package.json existe
dir package.json
```

### 2. Delete node_modules e package-lock.json

```bash
# No PowerShell:
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
```

### 3. Limpe o cache do npm

```bash
npm cache clean --force
```

### 4. Verifique o package.json

Abra o arquivo `package.json` e confirme que ele tem este conteúdo:

```json
{
  "name": "vendra-knowledge-base",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "prisma db push",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@prisma/client": "^5.7.0",
    "next-auth": "^4.24.0",
    "@next-auth/prisma-adapter": "^1.0.7",
    "bcryptjs": "^2.4.3",
    "zod": "^3.22.0",
    "@radix-ui/react-alert-dialog": "^1.0.5",
    "@radix-ui/react-avatar": "^1.0.4",
    "@radix-ui/react-checkbox": "^1.0.4",
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-dropdown-menu": "^2.0.6",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-select": "^2.0.0",
    "@radix-ui/react-slot": "^1.0.2",
    "@radix-ui/react-switch": "^1.0.3",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-toast": "^1.1.5",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "lucide-react": "^0.309.0",
    "recharts": "^2.10.0",
    "date-fns": "^2.30.0",
    "react-hot-toast": "^2.4.1",
    "papaparse": "^5.4.1"
  },
  "devDependencies": {
    "typescript": "^5.3.3",
    "@types/node": "^20.10.6",
    "@types/react": "^18.2.46",
    "@types/react-dom": "^18.2.18",
    "@types/bcryptjs": "^2.4.6",
    "@types/papaparse": "^5.3.14",
    "prisma": "^5.7.0",
    "tsx": "^4.7.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.33",
    "tailwindcss": "^3.4.1",
    "tailwindcss-animate": "^1.0.7",
    "eslint": "^8.56.0",
    "eslint-config-next": "^14.2.0"
  }
}
```

### 5. Instale novamente

```bash
npm install
```

Agora você deve ver a instalação de mais de 500 pacotes.

### 6. Verifique os arquivos do Prisma

```bash
# Verifique se a pasta prisma existe
dir prisma

# Verifique se o schema.prisma existe
dir prisma\schema.prisma

# Verifique se o seed.ts existe
dir prisma\seed.ts
```

### 7. Configure o arquivo .env.local

Crie o arquivo `.env.local` na raiz do projeto com:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/vendra_kb?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="vendra-kb-secret-change-in-production-2024"
```

**IMPORTANTE:** Ajuste a `DATABASE_URL` com suas credenciais do PostgreSQL.

### 8. Configure o PostgreSQL

Certifique-se de ter o PostgreSQL instalado e rodando:

```bash
# Teste a conexão (ajuste com suas credenciais)
psql -U postgres -h localhost
```

### 9. Execute os comandos do Prisma

```bash
# Gerar o cliente Prisma
npx prisma generate

# Criar as tabelas no banco
npx prisma db push

# Popular com dados iniciais
npm run db:seed
```

### 10. Execute o projeto

```bash
npm run dev
```

Acesse: http://localhost:3000

## ⚠️ Se ainda não funcionar

### Opção 1: Baixe novamente do repositório

```bash
# Clone novamente em uma pasta limpa
git clone <url-do-repo> vendra-kb-novo
cd vendra-kb-novo
npm install
```

### Opção 2: Verifique a versão do Node

```bash
node --version
```

Certifique-se de ter Node.js 18+ instalado.

### Opção 3: Use Yarn ao invés de npm

```bash
# Instale o yarn
npm install -g yarn

# Use yarn
yarn install
```

## 📝 Checklist Final

- [ ] Node.js 18+ instalado
- [ ] PostgreSQL instalado e rodando
- [ ] package.json correto
- [ ] Todos os arquivos na pasta prisma/
- [ ] .env.local configurado
- [ ] node_modules instalado (500+ pacotes)
- [ ] `npx prisma generate` executado com sucesso
- [ ] `npx prisma db push` executado com sucesso
- [ ] `npm run db:seed` executado com sucesso
- [ ] `npm run dev` rodando

## 🆘 Erros Comuns

### "Could not find Prisma Schema"
- Verifique se `prisma/schema.prisma` existe
- Execute `npx prisma generate --schema=./prisma/schema.prisma`

### "Missing script: db:seed"
- Seu package.json não tem o script correto
- Substitua pelo package.json fornecido acima

### "Connection timed out"
- PostgreSQL não está rodando
- Credenciais no .env.local estão erradas
- Porta 5432 está bloqueada

### "Module not found"
- Execute `npm install` novamente
- Delete node_modules e reinstale

## 📞 Se nada funcionar

Entre em contato e forneça:
1. Output completo de `npm install`
2. Conteúdo de `package.json`
3. Output de `dir prisma`
4. Versão do Node: `node --version`
5. Sistema operacional

---

Siga este guia passo a passo e o sistema funcionará! 🚀
