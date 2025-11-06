import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { generateApiToken } from "@/lib/utils"

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        apiToken: generateApiToken(),
      },
      select: {
        apiToken: true,
      },
    })

    return NextResponse.json({ apiToken: user.apiToken })
  } catch (error) {
    console.error("Error regenerating token:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
