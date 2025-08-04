import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get("id")
    const enquiryId = searchParams.get("enquiryId")

    if (id) {
      // Get single itinerary by ID
      const itinerary = await prisma.itinerary.findUnique({
        where: { id },
        include: {
          enquiry: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
              locations: true,
              tourType: true,
              estimatedDates: true,
              currency: true,
              budget: true,
              enquiryDate: true,
              assignedStaff: true,
              leadSource: true,
              tags: true,
              mustSeeSpots: true,
              pacePreference: true,
              flightsRequired: true,
              notes: true, // Include notes for enquiryDetails
            },
          },
        },
      })

      if (!itinerary) {
        return NextResponse.json({ error: "Itinerary not found" }, { status: 404 })
      }

      return NextResponse.json(itinerary)
    } else if (enquiryId) {
      // Get itineraries by enquiry ID
      const itineraries = await prisma.itinerary.findMany({
        where: { enquiryId },
        include: {
          enquiry: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
              locations: true,
              tourType: true,
              estimatedDates: true,
              currency: true,
              budget: true,
              enquiryDate: true,
              assignedStaff: true,
              leadSource: true,
              tags: true,
              mustSeeSpots: true,
              pacePreference: true,
              flightsRequired: true,
              notes: true, // Include notes for enquiryDetails
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
      return NextResponse.json(itineraries)
    } else {
      // Get all itineraries
      const itineraries = await prisma.itinerary.findMany({
        include: {
          enquiry: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
              locations: true,
              tourType: true,
              estimatedDates: true,
              currency: true,
              budget: true,
              enquiryDate: true,
              assignedStaff: true,
              leadSource: true,
              tags: true,
              mustSeeSpots: true,
              pacePreference: true,
              flightsRequired: true,
              notes: true, // Include notes for enquiryDetails
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
      return NextResponse.json(itineraries)
    }
  } catch (error) {
    console.error("Error fetching itineraries:", error)
    return NextResponse.json(
      { error: "Failed to fetch itineraries", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    console.log("Received itinerary data:", data)

    if (!data.enquiryId) {
      return NextResponse.json({ error: "Enquiry ID is required" }, { status: 400 })
    }

    const enquiry = await prisma.enquiry.findUnique({
      where: { id: data.enquiryId },
    })

    if (!enquiry) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 })
    }

    const itinerary = await prisma.itinerary.create({
      data: {
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
        pickupLocation: data.pickupLocation || "",
        dropLocation: data.dropLocation || "",
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
        additionalRequests: data.additionalRequests || "",
        moreDetails: data.moreDetails || "",
        mustSeeSpots: data.mustSeeSpots || null,
        pacePreference: data.pacePreference || "relaxed",
        status: data.status || "draft",
        // New fields for daily itinerary and accommodation
        dailyItinerary: data.dailyItinerary || [], // Store as JSON array
        accommodation: data.accommodation || [], // Store as JSON array
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      include: {
        enquiry: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            locations: true,
            tourType: true,
            estimatedDates: true,
            currency: true,
            budget: true,
            enquiryDate: true,
            assignedStaff: true,
            leadSource: true,
            tags: true,
            mustSeeSpots: true,
            pacePreference: true,
            flightsRequired: true,
            notes: true,
          },
        },
      },
    })

    console.log("Created itinerary:", itinerary)
    return NextResponse.json(itinerary, { status: 201 })
  } catch (error) {
    console.error("Error creating itinerary:", error)
    return NextResponse.json(
      { error: "Failed to create itinerary", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, ...updateData } = data

    if (!id) {
      return NextResponse.json({ error: "Itinerary ID is required" }, { status: 400 })
    }

    const processedData = {
      ...updateData,
      destinations: Array.isArray(updateData.destinations)
        ? updateData.destinations.join(", ")
        : updateData.destinations,
      activityPreferences: Array.isArray(updateData.activityPreferences)
        ? updateData.activityPreferences.join(", ")
        : updateData.activityPreferences,
      hotelPreferences: Array.isArray(updateData.hotelPreferences)
        ? updateData.hotelPreferences.join(", ")
        : updateData.hotelPreferences,
      mealPreference: Array.isArray(updateData.mealPreference)
        ? updateData.mealPreference.join(", ")
        : updateData.mealPreference,
      dietaryPreference: Array.isArray(updateData.dietaryPreference)
        ? updateData.dietaryPreference.join(", ")
        : updateData.dietaryPreference,
      transportPreferences: Array.isArray(updateData.transportPreferences)
        ? updateData.transportPreferences.join(", ")
        : updateData.transportPreferences,
      adults: updateData.adults ? Number(updateData.adults) : undefined,
      children: updateData.children ? Number(updateData.children) : undefined,
      under6: updateData.under6 ? Number(updateData.under6) : undefined,
      from7to12: updateData.from7to12 ? Number(updateData.from7to12) : undefined,
      budget: updateData.budget ? Number(updateData.budget) : undefined,
      mustSeeSpots: updateData.mustSeeSpots,
      pacePreference: updateData.pacePreference,
      dailyItinerary: updateData.dailyItinerary, // Handle as JSON
      accommodation: updateData.accommodation, // Handle as JSON
      updatedAt: new Date(),
    }

    const updatedItinerary = await prisma.itinerary.update({
      where: { id },
      data: processedData,
      include: {
        enquiry: {
          select: {
            id: true,
            name: true,
            phone: true,
            email: true,
            locations: true,
            tourType: true,
            estimatedDates: true,
            currency: true,
            budget: true,
            enquiryDate: true,
            assignedStaff: true,
            leadSource: true,
            tags: true,
            mustSeeSpots: true,
            pacePreference: true,
            flightsRequired: true,
            notes: true,
          },
        },
      },
    })

    return NextResponse.json(updatedItinerary)
  } catch (error) {
    console.error("Error updating itinerary:", error)
    return NextResponse.json(
      { error: "Failed to update itinerary", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
