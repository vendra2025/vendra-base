import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createClienteSchema } from "@/lib/validations/cliente"
import bcrypt from "bcryptjs"
import { generateApiToken } from "@/lib/utils"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const clientes = await prisma.user.findMany({
      where: { role: "CLIENTE" },
      select: {
        id: true,
        name: true,
        email: true,
        active: true,
        apiToken: true,
        createdAt: true,
        _count: {
          select: {
            apiLogs: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(clientes)
  } catch (error) {
    console.error("Error fetching clients:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validation = createClienteSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors },
        { status: 400 }
      )
    }

    const { name, email, password, active } = validation.data

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Email já está em uso" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "CLIENTE",
        active,
        apiToken: generateApiToken(),
      },
    })

    // Create default knowledge base
    await prisma.knowledgeBase.create({
      data: {
        userId: user.id,
        name: "Minha Base de Conhecimento",
        columns: [
          { id: "col1", name: "Título", type: "text", order: 0 },
          { id: "col2", name: "Descrição", type: "text", order: 1 },
        ],
        data: [],
      },
    })

    return NextResponse.json(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        active: user.active,
        apiToken: user.apiToken,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating client:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
