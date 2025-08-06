import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// POST - Send itinerary to customer
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const customerId = formData.get("customerId") as string
    const enquiryId = formData.get("enquiryId") as string
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const whatsappNumber = formData.get("whatsappNumber") as string
    const notes = formData.get("notes") as string
    const supportingDocument = formData.get("supportingDocument") as File

    // For now, create mock sent itinerary
    // TODO: Replace with actual Prisma create when models are ready
    const sentItinerary = {
      id: `sent-${Date.now()}`,
      date: new Date().toLocaleDateString("en-GB"),
      customerName: name,
      email,
      whatsappNumber,
      notes: notes || null,
      documents: supportingDocument ? supportingDocument.name : null,
      customerId,
      enquiryId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      message: "Itinerary sent successfully",
      sentItinerary,
    })
  } catch (error) {
    console.error("Error sending itinerary:", error)
    return NextResponse.json({ error: "Failed to send itinerary" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
