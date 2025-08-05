import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// Mock data for demonstration until Prisma schema is updated
const mockSharedDMCs = [
  {
    id: "1",
    dateGenerated: "2025-01-15",
    isActive: true,
    enquiryId: "1",
    assignedStaffId: "1",
    pdfUrl: null,
    selectedDMCs: [],
  },
]

const mockDMCs = [
  {
    id: "1",
    name: "DMC Europe",
    email: "europe@dmc.com",
    contactPerson: "John Smith",
    primaryCountry: "France",
    destinationsCovered: "Europe",
    status: "ACTIVE",
  },
  {
    id: "2",
    name: "Trails DMC",
    email: "trails@dmc.com",
    contactPerson: "Sarah Wilson",
    primaryCountry: "India",
    destinationsCovered: "Asia",
    status: "ACTIVE",
  },
  {
    id: "3",
    name: "Adventure DMC",
    email: "adventure@dmc.com",
    contactPerson: "Mike Johnson",
    primaryCountry: "USA",
    destinationsCovered: "Americas",
    status: "ACTIVE",
  },
]

// GET - Fetch all shared DMCs with their details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const staffId = searchParams.get("staffId")
    const enquiryId = searchParams.get("enquiryId")

    // For now, return mock data
    // TODO: Replace with actual Prisma query when schema is ready
    let filteredData = mockSharedDMCs

    if (staffId) {
      filteredData = filteredData.filter((item) => item.assignedStaffId === staffId)
    }

    if (enquiryId) {
      filteredData = filteredData.filter((item) => item.enquiryId === enquiryId)
    }

    return NextResponse.json({
      success: true,
      data: filteredData,
    })
  } catch (error) {
    console.error("Error fetching shared DMCs:", error)
    return NextResponse.json({ error: "Failed to fetch shared DMCs" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// POST - Create new shared DMC entry
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { enquiryId, assignedStaffId, selectedDMCIds = [], dateGenerated } = body

    // For now, create mock response
    // TODO: Replace with actual Prisma create when schema is ready
    const newSharedDMC = {
      id: `shared-${Date.now()}`,
      enquiryId,
      assignedStaffId,
      dateGenerated: dateGenerated || new Date().toISOString().split("T")[0],
      isActive: true,
      pdfUrl: null,
      selectedDMCs: selectedDMCIds.map((dmcId: string) => ({
        id: `item-${Date.now()}-${dmcId}`,
        dmcId,
        status: "AWAITING_TRANSFER",
      })),
    }

    return NextResponse.json({
      success: true,
      message: "DMC sharing created successfully",
      data: newSharedDMC,
    })
  } catch (error) {
    console.error("Error creating shared DMC:", error)
    return NextResponse.json({ error: "Failed to create shared DMC" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// PUT - Update shared DMC or DMC item status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, action, ...updateData } = body

    // For now, return mock success responses
    // TODO: Replace with actual Prisma updates when schema is ready

    if (action === "toggleActive") {
      return NextResponse.json({
        success: true,
        message: "Active status updated",
        data: { id, isActive: updateData.isActive },
      })
    }

    if (action === "updateDMCStatus") {
      return NextResponse.json({
        success: true,
        message: "DMC status updated",
        data: { id, status: updateData.status },
      })
    }

    if (action === "reassignStaff") {
      return NextResponse.json({
        success: true,
        message: "Staff reassigned successfully",
        data: { id, assignedStaffId: updateData.newStaffId },
      })
    }

    if (action === "addDMC") {
      const selectedDMC = mockDMCs.find((dmc) => dmc.id === updateData.dmcId)

      return NextResponse.json({
        success: true,
        message: "DMC added successfully",
        data: {
          id,
          selectedDMCs: [
            {
              id: `item-${Date.now()}`,
              dmcId: updateData.dmcId,
              status: updateData.status || "AWAITING_TRANSFER",
              dmc: selectedDMC || mockDMCs[0], // Fallback to first DMC if not found
            },
          ],
        },
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error updating shared DMC:", error)
    return NextResponse.json({ error: "Failed to update shared DMC" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// DELETE - Remove shared DMC entry
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    // For now, return mock success
    // TODO: Replace with actual Prisma delete when schema is ready

    return NextResponse.json({
      success: true,
      message: "Shared DMC deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting shared DMC:", error)
    return NextResponse.json({ error: "Failed to delete shared DMC" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
