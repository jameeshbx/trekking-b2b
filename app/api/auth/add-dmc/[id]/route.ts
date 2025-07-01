import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// GET - Fetch single DMC
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const dmc = await prisma.dMC.findUnique({
      where: { id: params.id },
    })

    if (!dmc) {
      return NextResponse.json({ error: "DMC not found" }, { status: 404 })
    }

    return NextResponse.json(dmc)
  } catch (error) {
    console.error("Error fetching DMC:", error)
    return NextResponse.json({ error: "Failed to fetch DMC" }, { status: 500 })
  }
}

// PUT - Update DMC
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()

    const updatedDMC = await prisma.dMC.update({
      where: { id: params.id },
      data: {
        ...body,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(updatedDMC)
  } catch (error) {
    console.error("Error updating DMC:", error)
    return NextResponse.json({ error: "Failed to update DMC" }, { status: 500 })
  }
}

// DELETE - Delete DMC
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.dMC.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "DMC deleted successfully" })
  } catch (error) {
    console.error("Error deleting DMC:", error)
    return NextResponse.json({ error: "Failed to delete DMC" }, { status: 500 })
  }
}
