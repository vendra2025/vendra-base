import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // Criar usuário admin
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@vendra.com.br' },
    update: {},
    create: {
      email: 'admin@vendra.com.br',
      name: 'Admin Vendra',
      password: adminPassword,
      role: 'ADMIN',
      active: true,
      apiToken: crypto.randomUUID(),
    },
  })

  console.log('✅ Admin criado:', admin.email)

  // Criar cliente de exemplo
  const clientePassword = await bcrypt.hash('cliente123', 10)
  const cliente = await prisma.user.upsert({
    where: { email: 'cliente@exemplo.com' },
    update: {},
    create: {
      email: 'cliente@exemplo.com',
      name: 'Cliente Exemplo',
      password: clientePassword,
      role: 'CLIENTE',
      active: true,
      apiToken: crypto.randomUUID(),
    },
  })

  console.log('✅ Cliente criado:', cliente.email)

  // Criar base de conhecimento de exemplo
  const kb = await prisma.knowledgeBase.upsert({
    where: { id: 'exemplo-kb' },
    update: {},
    create: {
      id: 'exemplo-kb',
      userId: cliente.id,
      name: 'Base de Conhecimento Exemplo',
      columns: [
        { id: 'col1', name: 'Nome do Evento', type: 'text', order: 0 },
        { id: 'col2', name: 'Data', type: 'text', order: 1 },
        { id: 'col3', name: 'Local', type: 'text', order: 2 },
        { id: 'col4', name: 'Descrição', type: 'text', order: 3 },
      ],
      data: [
        {
          'Nome do Evento': 'O Inter 2025',
          'Data': '20 a 22/11/2025',
          'Local': 'São Paulo Convention Center',
          'Descrição': 'Maior evento de tecnologia e inovação do Brasil',
        },
        {
          'Nome do Evento': 'Tech Summit',
          'Data': '15/12/2025',
          'Local': 'Rio de Janeiro',
          'Descrição': 'Conferência de tecnologia e startups',
        },
      ],
    },
  })

  console.log('✅ Base de conhecimento criada:', kb.name)
  console.log('\n📝 Credenciais de acesso:')
  console.log('Admin - Email: admin@vendra.com.br | Senha: admin123')
  console.log('Cliente - Email: cliente@exemplo.com | Senha: cliente123')
  console.log(`Cliente API Token: ${cliente.apiToken}`)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
