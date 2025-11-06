import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { knowledgeBaseSchema } from "@/lib/validations/knowledge-base"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "CLIENTE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const knowledgeBase = await prisma.knowledgeBase.findFirst({
      where: { userId: session.user.id },
    })

    if (!knowledgeBase) {
      // Create default knowledge base if doesn't exist
      const newKb = await prisma.knowledgeBase.create({
        data: {
          userId: session.user.id,
          name: "Minha Base de Conhecimento",
          columns: [
            { id: "col1", name: "Título", type: "text", order: 0 },
            { id: "col2", name: "Descrição", type: "text", order: 1 },
          ],
          data: [],
        },
      })
      return NextResponse.json(newKb)
    }

    return NextResponse.json(knowledgeBase)
  } catch (error) {
    console.error("Error fetching knowledge base:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "CLIENTE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validation = knowledgeBaseSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors },
        { status: 400 }
      )
    }

    const { name, columns, data } = validation.data

    const knowledgeBase = await prisma.knowledgeBase.findFirst({
      where: { userId: session.user.id },
    })

    if (!knowledgeBase) {
      return NextResponse.json(
        { error: "Knowledge base not found" },
        { status: 404 }
      )
    }

    const updated = await prisma.knowledgeBase.update({
      where: { id: knowledgeBase.id },
      data: {
        name,
        columns,
        data,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating knowledge base:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
