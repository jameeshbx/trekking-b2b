import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    const customerId = formData.get("customerId") as string
    const enquiryId = formData.get("enquiryId") as string
    const itineraryId = formData.get("itineraryId") as string
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const whatsappNumber = formData.get("whatsappNumber") as string
    const notes = formData.get("notes") as string
    const supportingDocument = formData.get("supportingDocument") as File | null

    // Validate required fields
    if (!name || !email || !whatsappNumber) {
      return NextResponse.json({ error: "Name, email, and WhatsApp number are required" }, { status: 400 })
    }

    if (!customerId && !enquiryId) {
      return NextResponse.json({ error: "Either customerId or enquiryId is required" }, { status: 400 })
    }

    // For enquiry-based flow, use enquiryId as customerId
    const finalCustomerId = customerId || enquiryId

    // Handle file upload if present
    let documentUrl: string | null = null
    let documentName: string | null = null

    if (supportingDocument && supportingDocument.size > 0) {
      // In a real implementation, you would upload to a cloud storage service
      // For now, we'll just store the filename
      documentName = supportingDocument.name
      documentUrl = `/uploads/${Date.now()}-${supportingDocument.name}`

      // TODO: Implement actual file upload to cloud storage
      console.log("File upload would happen here:", {
        name: supportingDocument.name,
        size: supportingDocument.size,
        type: supportingDocument.type,
      })
    }

    // Create sent itinerary record
    const sentItinerary = await prisma.sentItinerary.create({
      data: {
        customerId: finalCustomerId,
        itineraryId: itineraryId || null,
        customerName: name,
        email: email,
        whatsappNumber: whatsappNumber,
        notes: notes || null,
        documentUrl: documentUrl,
        documentName: documentName,
        status: "sent",
        sentDate: new Date(),
      },
    })

    // Update enquiry with contact details if this is enquiry-based
    if (enquiryId) {
      await prisma.enquiry.update({
        where: { id: enquiryId },
        data: {
          phone: whatsappNumber, // Update phone with WhatsApp number
          email: email,
          updatedAt: new Date(),
        },
      })
    }

    // Simulate sending process
    console.log(`📧 Simulating email send to: ${email}`)
    console.log(`📱 Simulating WhatsApp send to: ${whatsappNumber}`)
    console.log(`📋 Itinerary details: ${name}, ${itineraryId || "No ID"}`)
    if (notes) {
      console.log(`📝 Notes: ${notes}`)
    }
    if (documentUrl) {
      console.log(`📎 Document: ${documentUrl}`)
    }

    // Transform response to match frontend interface
    const transformedSentItinerary = {
      id: sentItinerary.id,
      date: new Date(sentItinerary.sentDate).toLocaleDateString("en-GB").replace(/\//g, " . "),
      customerId: sentItinerary.customerId,
      customerName: sentItinerary.customerName,
      email: sentItinerary.email,
      whatsappNumber: sentItinerary.whatsappNumber || "",
      notes: sentItinerary.notes || "",
      documents: sentItinerary.documentUrl ? "Download" : "",
      status: sentItinerary.status,
      documentUrl: sentItinerary.documentUrl,
      documentName: sentItinerary.documentName,
      sentDate: sentItinerary.sentDate.toISOString(),
      itineraryId: sentItinerary.itineraryId,
    }

    return NextResponse.json({
      success: true,
      message: "Itinerary sent successfully",
      sentItinerary: transformedSentItinerary,
    })
  } catch (error) {
    console.error("Error sending itinerary:", error)
    return NextResponse.json(
      {
        error: "Failed to send itinerary",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const customerId = searchParams.get("customerId")
    const enquiryId = searchParams.get("enquiryId")
    const itineraryId = searchParams.get("itineraryId")

    let filter = {}

    if (itineraryId) {
      filter = { itineraryId }
    } else if (enquiryId) {
      filter = { customerId: enquiryId } // For enquiry-based flow
    } else if (customerId) {
      filter = { customerId }
    }

    const sentItineraries = await prisma.sentItinerary.findMany({
      where: filter,
      orderBy: { sentDate: "desc" },
    })

    const transformedSentItineraries = sentItineraries.map((sent) => ({
      id: sent.id,
      date: new Date(sent.sentDate).toLocaleDateString("en-GB").replace(/\//g, " . "),
      customerId: sent.customerId,
      customerName: sent.customerName,
      email: sent.email,
      whatsappNumber: sent.whatsappNumber || "",
      notes: sent.notes || "",
      documents: sent.documentUrl ? "Download" : "",
      status: sent.status,
      documentUrl: sent.documentUrl,
      documentName: sent.documentName,
      sentDate: sent.sentDate.toISOString(),
      itineraryId: sent.itineraryId,
    }))

    return NextResponse.json({
      success: true,
      sentItineraries: transformedSentItineraries,
    })
  } catch (error) {
    console.error("Error fetching sent itineraries:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch sent itineraries",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
