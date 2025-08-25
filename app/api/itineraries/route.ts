import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// GET - Fetch itineraries
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const enquiryId = searchParams.get("enquiryId")
    const id = searchParams.get("id")

    if (id) {
      // Fetch specific itinerary by ID
      const itinerary = await prisma.itineraries.findUnique({
        where: { id },
        include: {
          enquiry: true,
        },
      })

      if (!itinerary) {
        return NextResponse.json({ error: "Itinerary not found" }, { status: 404 })
      }

      return NextResponse.json(itinerary)
    } else if (enquiryId) {
      // Fetch itineraries for specific enquiry
      const itineraries = await prisma.itineraries.findMany({
        where: { enquiryId },
        include: {
          enquiry: true,
        },
        orderBy: { createdAt: "desc" },
      })

      return NextResponse.json(itineraries)
    } else {
      // Fetch all itineraries
      const itineraries = await prisma.itineraries.findMany({
        include: {
          enquiry: true,
        },
        orderBy: { createdAt: "desc" },
      })

      return NextResponse.json(itineraries)
    }
  } catch (error) {
    console.error("Error fetching itineraries:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

// POST - Create new itinerary
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    console.log("Received data for creating itinerary:", data)

    const itineraryData = {
      enquiryId: data.enquiryId,
      destinations: Array.isArray(data.destinations) ? data.destinations.join(", ") : data.destinations || "",
      startDate: data.startDate || "",
      endDate: data.endDate || "",
      travelType: data.travelType || "",
      adults: Number(data.adults) || 0,
      children: Number(data.children) || 0,
      under6: Number(data.under6) || 0,
      from7to12: Number(data.from7to12) || 0,
      flightsRequired: data.flightsRequired || "no",
      pickupLocation: data.pickupLocation || null,
      dropLocation: data.dropLocation || null,
      currency: data.currency || "USD",
      budget: Number(data.budget) || 0,
      activityPreferences: Array.isArray(data.activityPreferences)
        ? data.activityPreferences.join(", ")
        : data.activityPreferences || "",
      hotelPreferences: Array.isArray(data.hotelPreferences)
        ? data.hotelPreferences.join(", ")
        : data.hotelPreferences || "",
      mealPreference: Array.isArray(data.mealPreference) ? data.mealPreference.join(", ") : data.mealPreference || "",
      dietaryPreference: Array.isArray(data.dietaryPreference)
        ? data.dietaryPreference.join(", ")
        : data.dietaryPreference || "",
      transportPreferences: Array.isArray(data.transportPreferences)
        ? data.transportPreferences.join(", ")
        : data.transportPreferences || "",
      travelingWithPets: data.travelingWithPets || "no",
      additionalRequests: data.additionalRequests || null,
      moreDetails: data.moreDetails || null,
      mustSeeSpots: data.mustSeeSpots || null,
      status: data.status || "draft",
      dailyItinerary: data.dailyItinerary || [],
      accommodation: data.accommodation || [],
      // Map cancellation fields to actual database columns
      cancellationPolicyType: data.cancellationPolicyType || "DEFAULT",
      customCancellationDeadline: data.customCancellationDeadline ? Number(data.customCancellationDeadline) : null,
      customCancellationTerms: data.customCancellationTerms || null,
      agencyCancellationPolicyId: data.agencyCancellationPolicyId || null,
    }

    console.log("Prepared data for database:", itineraryData)

    const newItinerary = await prisma.itineraries.create({
      data: itineraryData,
      include: {
        enquiry: true,
      },
    })

    console.log("Created itinerary successfully:", newItinerary.id)
    return NextResponse.json(newItinerary)
  } catch (error) {
    console.error("Error creating itinerary:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

// PUT - Update existing itinerary
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, ...updateData } = data

    if (!id) {
      return NextResponse.json({ error: "Itinerary ID is required" }, { status: 400 })
    }

    console.log("Updating itinerary with ID:", id, "Data:", updateData)

    const updateFields = {
      destinations: Array.isArray(updateData.destinations)
        ? updateData.destinations.join(", ")
        : updateData.destinations || "",
      startDate: updateData.startDate || "",
      endDate: updateData.endDate || "",
      travelType: updateData.travelType || "",
      adults: Number(updateData.adults) || 0,
      children: Number(updateData.children) || 0,
      under6: Number(updateData.under6) || 0,
      from7to12: Number(updateData.from7to12) || 0,
      flightsRequired: updateData.flightsRequired || "no",
      pickupLocation: updateData.pickupLocation || null,
      dropLocation: updateData.dropLocation || null,
      currency: updateData.currency || "USD",
      budget: Number(updateData.budget) || 0,
      activityPreferences: Array.isArray(updateData.activityPreferences)
        ? updateData.activityPreferences.join(", ")
        : updateData.activityPreferences || "",
      hotelPreferences: Array.isArray(updateData.hotelPreferences)
        ? updateData.hotelPreferences.join(", ")
        : updateData.hotelPreferences || "",
      mealPreference: Array.isArray(updateData.mealPreference)
        ? updateData.mealPreference.join(", ")
        : updateData.mealPreference || "",
      dietaryPreference: Array.isArray(updateData.dietaryPreference)
        ? updateData.dietaryPreference.join(", ")
        : updateData.dietaryPreference || "",
      transportPreferences: Array.isArray(updateData.transportPreferences)
        ? updateData.transportPreferences.join(", ")
        : updateData.transportPreferences || "",
      travelingWithPets: updateData.travelingWithPets || "no",
      additionalRequests: updateData.additionalRequests || null,
      moreDetails: updateData.moreDetails || null,
      mustSeeSpots: updateData.mustSeeSpots || null,
      
      status: updateData.status || "draft",
      dailyItinerary: updateData.dailyItinerary || [],
      accommodation: updateData.accommodation || [],
      // Map cancellation fields to actual database columns
      cancellationPolicyType: updateData.cancellationPolicyType || "DEFAULT",
      customCancellationDeadline: updateData.customCancellationDeadline
        ? Number(updateData.customCancellationDeadline)
        : null,
      customCancellationTerms: updateData.customCancellationTerms || null,
      agencyCancellationPolicyId: updateData.agencyCancellationPolicyId || null,
    }

    const updatedItinerary = await prisma.itineraries.update({
      where: { id },
      data: updateFields,
      include: {
        enquiry: true,
      },
    })

    console.log("Updated itinerary successfully:", updatedItinerary.id)
    return NextResponse.json(updatedItinerary)
  } catch (error) {
    console.error("Error updating itinerary:", error)

    // Handle Prisma errors
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2025") {
        return NextResponse.json({ error: "Itinerary not found" }, { status: 404 })
      }
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

// DELETE - Delete itinerary
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Itinerary ID is required" }, { status: 400 })
    }

    await prisma.itineraries.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Itinerary deleted successfully" })
  } catch (error) {
    console.error("Error deleting itinerary:", error)

    // Handle Prisma errors
    if (error && typeof error === "object" && "code" in error) {
      if (error.code === "P2025") {
        return NextResponse.json({ error: "Itinerary not found" }, { status: 404 })
      }
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
