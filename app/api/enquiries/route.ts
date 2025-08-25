import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")

    if (id) {
      // Get single enquiry by ID
      const enquiry = await prisma.enquiries.findUnique({
        where: { id },
      })

      if (!enquiry) {
        return NextResponse.json({ error: "Enquiry not found" }, { status: 404 })
      }

      return NextResponse.json(enquiry)
    } else {
      // Get all enquiries
      const enquiries = await prisma.enquiries.findMany({
        orderBy: { createdAt: "desc" },
      })
      return NextResponse.json(enquiries)
    }
  } catch (error) {
    console.error("GET /api/enquiries error:", error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json()
    console.log("Creating enquiry with data:", data)

    // Validate required fields
    if (!data.name || !data.phone || !data.email) {
      return NextResponse.json({ error: "Name, phone, and email are required" }, { status: 400 })
    }

    const enquiry = await prisma.enquiries.create({
      data: {
        ...data,
        // Ensure default values for new fields
        leadSource: data.leadSource || "Direct",
        tags: data.tags || "sightseeing",
        flightsRequired: data.flightsRequired || "no",
        mustSeeSpots: data.mustSeeSpots || null,
      },
    })

    console.log("Created enquiry:", enquiry)
    return NextResponse.json(enquiry, { status: 201 })
  } catch (error) {
    console.error("POST /api/enquiries error:", error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, ...updateData } = data

    if (!id) {
      return NextResponse.json({ error: "Enquiry ID is required" }, { status: 400 })
    }

    const updatedEnquiry = await prisma.enquiries.update({
      where: { id },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(updatedEnquiry)
  } catch (error) {
    console.error("Error updating enquiry:", error)
    return NextResponse.json(
      { error: "Failed to update enquiry", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Enquiry ID is required" }, { status: 400 })
    }

    await prisma.enquiries.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Enquiry deleted successfully" })
  } catch (error) {
    console.error("Error deleting enquiry:", error)
    return NextResponse.json(
      { error: "Failed to delete enquiry", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}