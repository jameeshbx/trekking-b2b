// api/shared-dmc/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { emailService } from "@/lib/email"


const prisma = new PrismaClient()

interface WhereClause {
  assignedStaffId?: string
  enquiryId?: string
}

type DMCStatus = 'AWAITING_TRANSFER' | 'VIEWED' | 'QUOTATION_RECEIVED'

// GET - Fetch all shared DMCs with their details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const staffId = searchParams.get("staffId")
    const enquiryId = searchParams.get("enquiryId")

    const whereClause: WhereClause = {}
    
    if (staffId) {
      whereClause.assignedStaffId = staffId
    }
    
    if (enquiryId) {
      whereClause.enquiryId = enquiryId
    }

    // Fetch actual DMCs from your existing DMC table
    const dmcs = await prisma.dMCForm.findMany({
      where: { status: 'ACTIVE' },
      select: {
        id: true,
        name: true,
        contactPerson: true,
        email: true,
        phoneNumber: true,
        designation: true,
        status: true,
        primaryCountry: true,
        destinationsCovered: true,
        cities: true,
        createdAt: true,
        updatedAt: true,
      }
    })

    // Transform DMCs to match interface
    const transformedDMCs = dmcs.map(dmc => ({
      id: dmc.id,
      name: dmc.name,
      primaryContact: dmc.contactPerson || '',
      phoneNumber: dmc.phoneNumber || '',
      designation: dmc.designation || '',
      email: dmc.email || '',
      status: dmc.status === 'ACTIVE' ? 'Active' : 'Inactive',
      primaryCountry: dmc.primaryCountry || '',
      destinationsCovered: dmc.destinationsCovered || '',
      cities: dmc.cities || '',
      createdAt: dmc.createdAt?.toISOString() || '',
      updatedAt: dmc.updatedAt?.toISOString() || '',
    }))

    // Create mock shared itineraries with real DMC data
    const mockSharedItineraries = [
      {
        id: "shared-1",
        dateGenerated: "06-03-2025",
        pdf: "D",
        activeStatus: true,
        enquiryId: "enquiry-1",
        customerId: "customer-1",
        assignedStaffId: "staff-1",
        selectedDMCs: transformedDMCs.slice(0, 3).map((dmc, index) => ({
          id: `item-${index + 1}`,
          dmcId: dmc.id,
          status: (['AWAITING_TRANSFER', 'VIEWED', 'QUOTATION_RECEIVED'] as const)[index] as DMCStatus,
          dmc: dmc,
          lastUpdated: new Date().toISOString(),
          quotationAmount: index === 2 ? 1100 : undefined,
          notes: `Sample notes for ${dmc.name}`,
        }))
      },
      {
        id: "shared-2",
        dateGenerated: "08-03-2025",
        pdf: "B",
        activeStatus: false,
        enquiryId: "enquiry-2",
        assignedStaffId: "staff-1",
        selectedDMCs: []
      }
    ]

    let filteredData = mockSharedItineraries
    
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

// POST - Create new shared DMC entry and send email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { enquiryId, customerId, assignedStaffId, selectedDMCIds = [], dateGenerated, pdfPath } = body

    // Fetch the selected DMCs from database
    const selectedDMCs = await prisma.dMCForm.findMany({
      where: {
        id: { in: selectedDMCIds },
        status: 'ACTIVE'
      },
      select: {
        id: true,
        name: true,
        contactPerson: true,
        email: true,
        phoneNumber: true,
        designation: true,
        status: true,
        primaryCountry: true,
        destinationsCovered: true,
        cities: true,
      }
    })

    // Send emails to all selected DMCs
    const emailResults = []
    for (const dmc of selectedDMCs) {
      if (dmc.email) {
        try {
          const emailSent = await emailService.sendItineraryToDMC(
            dmc.email,
            dmc.name,
            {
              enquiryId,
              dateGenerated: dateGenerated || new Date().toISOString().split("T")[0],
              pdfPath: pdfPath, // Path to the PDF file
            }
          )
          
          emailResults.push({
            dmcId: dmc.id,
            dmcName: dmc.name,
            email: dmc.email,
            sent: emailSent,
            error: emailSent ? null : 'Failed to send email'
          })
        } catch (emailError) {
          console.error(`Error sending email to ${dmc.name} (${dmc.email}):`, emailError)
          emailResults.push({
            dmcId: dmc.id,
            dmcName: dmc.name,
            email: dmc.email,
            sent: false,
            error: emailError instanceof Error ? emailError.message : 'Unknown email error'
          })
        }
      } else {
        emailResults.push({
          dmcId: dmc.id,
          dmcName: dmc.name,
          email: null,
          sent: false,
          error: 'No email address found'
        })
      }
    }

    // Create the shared DMC record
    const newSharedDMC = {
      id: `shared-${Date.now()}`,
      enquiryId,
      customerId,
      assignedStaffId,
      dateGenerated: dateGenerated || new Date().toISOString().split("T")[0],
      activeStatus: true,
      pdf: "B",
      selectedDMCs: selectedDMCs.map((dmc) => ({
        id: `item-${Date.now()}-${dmc.id}`,
        dmcId: dmc.id,
        status: "AWAITING_TRANSFER" as const,
        dmc: {
          id: dmc.id,
          name: dmc.name,
          primaryContact: dmc.contactPerson || '',
          phoneNumber: dmc.phoneNumber || '',
          designation: dmc.designation || '',
          email: dmc.email || '',
          status: dmc.status === 'ACTIVE' ? 'Active' : 'Inactive',
          primaryCountry: dmc.primaryCountry || '',
          destinationsCovered: dmc.destinationsCovered || '',
          cities: dmc.cities || '',
        },
        lastUpdated: new Date().toISOString(),
        notes: '',
      })),
    }

    return NextResponse.json({
      success: true,
      message: "DMC sharing created successfully",
      data: newSharedDMC,
      emailResults: emailResults,
    })
  } catch (error) {
    console.error("Error creating shared DMC:", error)
    return NextResponse.json({ error: "Failed to create shared DMC" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// PUT - Update shared DMC or DMC item status and send email notification
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, action, ...updateData } = body

    if (action === "toggleActive") {
      return NextResponse.json({
        success: true,
        message: "Active status updated",
        data: { id, activeStatus: updateData.isActive },
      })
    }

    if (action === "updateDMCStatus") {
      return NextResponse.json({
        success: true,
        message: "DMC status updated",
        data: { id, status: updateData.status, notes: updateData.notes },
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
      // Fetch the DMC details from database
      const dmc = await prisma.dMCForm.findUnique({
        where: { id: updateData.dmcId },
        select: {
          id: true,
          name: true,
          contactPerson: true,
          email: true,
          phoneNumber: true,
          designation: true,
          status: true,
          primaryCountry: true,
          destinationsCovered: true,
          cities: true,
        }
      })

      if (!dmc) {
        return NextResponse.json({ error: "DMC not found" }, { status: 404 })
      }

      // Send email to the newly added DMC
      let emailSent = false
      let emailError = null

      if (dmc.email && updateData.enquiryId) {
        try {
          emailSent = await emailService.sendItineraryToDMC(
            dmc.email,
            dmc.name,
            {
              enquiryId: updateData.enquiryId,
              dateGenerated: updateData.dateGenerated || new Date().toISOString().split("T")[0],
              pdfPath: updateData.pdfPath,
            }
          )
        } catch (error) {
          console.error(`Error sending email to ${dmc.name}:`, error)
          emailError = error instanceof Error ? error.message : 'Failed to send email'
        }
      }

      const transformedDMC = {
        id: dmc.id,
        name: dmc.name,
        primaryContact: dmc.contactPerson || '',
        phoneNumber: dmc.phoneNumber || '',
        designation: dmc.designation || '',
        email: dmc.email || '',
        status: dmc.status === 'ACTIVE' ? 'Active' : 'Inactive',
        primaryCountry: dmc.primaryCountry || '',
        destinationsCovered: dmc.destinationsCovered || '',
        cities: dmc.cities || '',
      }

      return NextResponse.json({
        success: true,
        message: "DMC added successfully",
        data: {
          id,
          selectedDMCs: [
            {
              id: `item-${Date.now()}`,
              dmcId: updateData.dmcId,
              status: (updateData.status || "AWAITING_TRANSFER") as DMCStatus,
              dmc: transformedDMC,
              lastUpdated: new Date().toISOString(),
              notes: '',
            },
          ],
        },
        emailResult: {
          dmcName: dmc.name,
          email: dmc.email,
          sent: emailSent,
          error: emailError
        }
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

    // In a real implementation, you'd delete from database
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
