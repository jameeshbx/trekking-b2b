import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const enquiryId = searchParams.get("enquiryId")
    const customerId = searchParams.get("customerId")
    const itineraryId = searchParams.get("itineraryId")

    // Handle both enquiryId and customerId parameters
    let customerData = null
    let finalCustomerId = null

    if (enquiryId) {
      // Fetch enquiry first to get customer info
      const enquiry = await prisma.enquiry.findUnique({
        where: { id: enquiryId },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          locations: true,
          tourType: true,
          estimatedDates: true,
          currency: true,
          budget: true,
          enquiryDate: true,
          assignedStaff: true,
          pointOfContact: true,
          notes: true,
          tags: true,
          mustSeeSpots: true,
          pacePreference: true,
          flightsRequired: true,
          numberOfTravellers: true,
          numberOfKids: true,
          travelingWithPets: true,
          pickupLocation: true,
          dropLocation: true,
        },
      })

      if (!enquiry) {
        return NextResponse.json({ error: "Enquiry not found" }, { status: 404 })
      }

      // Create customer object from enquiry data
      customerData = {
        id: enquiry.id, // Use enquiry ID as customer ID for this workflow
        name: enquiry.name,
        email: enquiry.email,
        phone: enquiry.phone,
        whatsappNumber: enquiry.phone, // Use phone as whatsapp for enquiry-based flow
        createdAt: enquiry.enquiryDate,
        updatedAt: new Date().toISOString(),
      }
      finalCustomerId = enquiry.id
    } else if (customerId) {
      // Original customer-based flow
      const customer = await prisma.customer.findUnique({
        where: { id: customerId },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          whatsappNumber: true,
          createdAt: true,
          updatedAt: true,
        },
      })

      if (!customer) {
        return NextResponse.json({ error: "Customer not found" }, { status: 404 })
      }

      customerData = customer
      finalCustomerId = customerId
    } else {
      return NextResponse.json({ error: "Either enquiryId or customerId is required" }, { status: 400 })
    }

    // Fetch itineraries based on enquiryId or customerId
    let itineraryFilter = {}
    if (itineraryId) {
      itineraryFilter = { id: itineraryId }
    } else if (enquiryId) {
      itineraryFilter = { enquiryId: enquiryId }
    } else if (customerId) {
      itineraryFilter = { customerId: customerId }
    }

    const itineraries = await prisma.itinerary.findMany({
      where: itineraryFilter,
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        pdfUrl: true,
        activeStatus: true,
        itineraryType: true,
        status: true,
        destinations: true,
        startDate: true,
        endDate: true,
        budget: true,
        currency: true,
        enquiryId: true,
        customerId: true,
        enquiry: {
          select: {
            name: true,
            locations: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    // Transform itineraries to match frontend interface
    const transformedItineraries = itineraries.map((itinerary) => ({
      id: itinerary.id,
      dateGenerated: new Date(itinerary.createdAt).toLocaleDateString("en-GB").replace(/\//g, " . "),
      pdf: itinerary.pdfUrl ? "D" : "B",
      activeStatus: itinerary.activeStatus || false,
      itinerary: "Download",
      status: itinerary.status || "draft",
      customerName: itinerary.enquiry?.name || customerData.name,
      destinations: itinerary.destinations || itinerary.enquiry?.locations || "Not specified",
      startDate: itinerary.startDate,
      endDate: itinerary.endDate,
      budget: itinerary.budget,
      currency: itinerary.currency,
      pdfUrl: itinerary.pdfUrl,
    }))

    // Fetch customer feedbacks based on enquiryId or customerId
    let feedbackFilter = {}
    if (itineraryId) {
      feedbackFilter = { itineraryId: itineraryId }
    } else if (enquiryId) {
      // For enquiry-based flow, we need to find feedbacks by customer ID that matches enquiry ID
      feedbackFilter = { customerId: enquiryId }
    } else if (customerId) {
      feedbackFilter = { customerId: customerId }
    }

    const feedbacks = await prisma.customerFeedback.findMany({
      where: feedbackFilter,
      select: {
        id: true,
        type: true,
        title: true,
        description: true,
        status: true,
        documentUrl: true,
        documentName: true,
        createdAt: true,
        updatedAt: true,
        customerId: true,
        itineraryId: true,
      },
      orderBy: { createdAt: "desc" },
    })

    // Transform feedbacks to match frontend interface
    const transformedFeedbacks = feedbacks.map((feedback) => ({
      id: feedback.id,
      customerId: feedback.customerId || finalCustomerId,
      itineraryId: feedback.itineraryId,
      type: feedback.type,
      title: feedback.title,
      description: feedback.description,
      time: formatDateTime(feedback.createdAt),
      status: feedback.status,
      customerName: customerData.name,
      documentUrl: feedback.documentUrl,
      documentName: feedback.documentName,
      createdAt: feedback.createdAt.toISOString(),
    }))

    // Fetch sent itineraries history
    let sentItineraryFilter = {}
    if (itineraryId) {
      sentItineraryFilter = { itineraryId: itineraryId }
    } else if (enquiryId) {
      // For enquiry-based flow, we need to find sent itineraries by customer ID that matches enquiry ID
      sentItineraryFilter = { customerId: enquiryId }
    } else if (customerId) {
      sentItineraryFilter = { customerId: customerId }
    }

    const sentItineraries = await prisma.sentItinerary.findMany({
      where: sentItineraryFilter,
      select: {
        id: true,
        customerName: true,
        email: true,
        whatsappNumber: true,
        notes: true,
        documentUrl: true,
        documentName: true,
        status: true,
        sentDate: true,
        createdAt: true,
        customerId: true,
        itineraryId: true,
      },
      orderBy: { sentDate: "desc" },
    })

    // Transform sent itineraries to match frontend interface
    const transformedSentItineraries = sentItineraries.map((sent) => ({
      id: sent.id,
      date: new Date(sent.sentDate).toLocaleDateString("en-GB").replace(/\//g, " . "),
      customerId: sent.customerId || finalCustomerId,
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
      customer: customerData,
      itineraries: transformedItineraries,
      feedbacks: transformedFeedbacks,
      sentItineraries: transformedSentItineraries,
    })
  } catch (error) {
    console.error("Error fetching customer share dashboard data:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch customer data",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerId, enquiryId, itineraryId, type, title, description } = body

    if ((!customerId && !enquiryId) || !type || !title) {
      return NextResponse.json({ error: "Customer ID or Enquiry ID, type, and title are required" }, { status: 400 })
    }

    // For enquiry-based flow, use enquiryId as customerId
    const finalCustomerId = customerId || enquiryId

    // Create new customer feedback
    const feedback = await prisma.customerFeedback.create({
      data: {
        customerId: finalCustomerId,
        itineraryId: itineraryId || null,
        type,
        title,
        description: description || "",
        status: "pending",
      },
    })

    // Get customer name for response
    let customerName = "Unknown"
    if (enquiryId) {
      const enquiry = await prisma.enquiry.findUnique({
        where: { id: enquiryId },
        select: { name: true },
      })
      customerName = enquiry?.name || "Unknown"
    } else if (customerId) {
      const customer = await prisma.customer.findUnique({
        where: { id: customerId },
        select: { name: true },
      })
      customerName = customer?.name || "Unknown"
    }

    return NextResponse.json({
      success: true,
      message: "Feedback added successfully",
      feedback: {
        id: feedback.id,
        customerId: feedback.customerId,
        itineraryId: feedback.itineraryId,
        type: feedback.type,
        title: feedback.title,
        description: feedback.description,
        status: feedback.status,
        time: formatDateTime(feedback.createdAt),
        customerName: customerName,
        documentUrl: feedback.documentUrl,
        documentName: feedback.documentName,
        createdAt: feedback.createdAt.toISOString(),
      },
    })
  } catch (error) {
    console.error("Error creating customer feedback:", error)
    return NextResponse.json(
      {
        error: "Failed to create feedback",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { feedbackId, status, title, description } = body

    if (!feedbackId) {
      return NextResponse.json({ error: "Feedback ID is required" }, { status: 400 })
    }

    // Update feedback
    const updatedFeedback = await prisma.customerFeedback.update({
      where: { id: feedbackId },
      data: {
        ...(status && { status }),
        ...(title && { title }),
        ...(description && { description }),
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({
      success: true,
      message: "Feedback updated successfully",
      feedback: {
        id: updatedFeedback.id,
        customerId: updatedFeedback.customerId,
        itineraryId: updatedFeedback.itineraryId,
        type: updatedFeedback.type,
        title: updatedFeedback.title,
        description: updatedFeedback.description,
        status: updatedFeedback.status,
        time: formatDateTime(updatedFeedback.updatedAt),
        customerName: "Customer", // We don't have customer relation in update
        documentUrl: updatedFeedback.documentUrl,
        documentName: updatedFeedback.documentName,
        createdAt: updatedFeedback.createdAt.toISOString(),
      },
    })
  } catch (error) {
    console.error("Error updating customer feedback:", error)
    return NextResponse.json(
      {
        error: "Failed to update feedback",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const feedbackId = searchParams.get("feedbackId")

    if (!feedbackId) {
      return NextResponse.json({ error: "Feedback ID is required" }, { status: 400 })
    }

    await prisma.customerFeedback.delete({
      where: { id: feedbackId },
    })

    return NextResponse.json({
      success: true,
      message: "Feedback deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting customer feedback:", error)
    return NextResponse.json(
      {
        error: "Failed to delete feedback",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

// Helper function to format date and time
function formatDateTime(date: Date): string {
  const now = new Date()
  const diffInHours = Math.abs(now.getTime() - date.getTime()) / (1000 * 60 * 60)

  if (diffInHours < 24) {
    return (
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }) + ", Today"
    )
  } else if (diffInHours < 48) {
    return (
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }) + ", Yesterday"
    )
  } else {
    return (
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }) +
      ", " +
      date.toLocaleDateString()
    )
  }
}
