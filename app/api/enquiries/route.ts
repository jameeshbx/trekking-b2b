import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET() {
  try {
    const enquiries = await prisma.enquiry.findMany()
    return NextResponse.json(enquiries)
  } catch (error) {
    console.error("GET /api/enquiries error:", error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    const enquiry = await prisma.enquiry.create({ data })
    return NextResponse.json(enquiry, { status: 201 })
  } catch (error) {
    console.error("POST /api/enquiries error:", error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}