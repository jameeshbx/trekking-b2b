// app/api/itineraries/route.ts
import { NextRequest, NextResponse } from "next/server"
import { sql } from "@vercel/postgres"


// Define the expected structure for an itinerary
interface Itinerary {
  tripId: string;
  customerName: string;
  destinations: string[];
  startDate: string;
  endDate: string;
}
// Helper function to create error responses
function createErrorResponse(error: Error | unknown, statusCode = 500) {
  console.error("API Error:", error)
  const errorMessage = error instanceof Error ? error.message : "Internal server error"
const errorCode =
  error instanceof Error && "code" in error
    ? (error as { code: string | number }).code
    : "UNKNOWN_ERROR";


  return NextResponse.json(
    {
      error: errorMessage,
      code: errorCode,
    },
    { status: statusCode },
  )
}

// GET - Fetch all itineraries or a specific one by ID
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (id) {
      const { rows } = await sql`
        SELECT i.*, 
               e.id as enquiry_id, e.name as enquiry_name, e.phone as enquiry_phone,
               e.email as enquiry_email, e.locations as enquiry_locations,
               e.tour_type, e.estimated_dates, e.currency, e.budget,
               e.enquiry_date, e.assigned_staff, e.lead_source, e.tags,
               e.must_see_spots, e.pace_preference, e.flights_required, e.notes
        FROM itineraries i
        LEFT JOIN enquiries e ON i.enquiry_id = e.id
        WHERE i.id = ${id}
      `

      if (rows.length === 0) {
        return NextResponse.json({ error: "Itinerary not found" }, { status: 404 })
      }

      // Transform the joined data
      const itinerary = {
        id: rows[0].id,
        destinations: rows[0].destinations,
        startDate: rows[0].start_date,
        endDate: rows[0].end_date,
        createdAt: rows[0].created_at,
        status: rows[0].status,
        enquiry: rows[0].enquiry_id
          ? {
              id: rows[0].enquiry_id,
              name: rows[0].enquiry_name,
              phone: rows[0].enquiry_phone,
              email: rows[0].enquiry_email,
              locations: rows[0].enquiry_locations,
              tourType: rows[0].tour_type,
              estimatedDates: rows[0].estimated_dates,
              currency: rows[0].currency,
              budget: rows[0].budget,
              enquiryDate: rows[0].enquiry_date,
              assignedStaff: rows[0].assigned_staff,
              leadSource: rows[0].lead_source,
              tags: rows[0].tags,
              mustSeeSpots: rows[0].must_see_spots,
              pacePreference: rows[0].pace_preference,
              flightsRequired: rows[0].flights_required,
              notes: rows[0].notes,
            }
          : null,
      }

      return NextResponse.json(itinerary)
    }

    // Fetch all itineraries with enquiry details
    const { rows } = await sql`
      SELECT i.*, 
             e.id as enquiry_id, e.name as enquiry_name, e.phone as enquiry_phone,
             e.email as enquiry_email, e.locations as enquiry_locations,
             e.tour_type, e.estimated_dates, e.currency, e.budget,
             e.enquiry_date, e.assigned_staff, e.lead_source, e.tags,
             e.must_see_spots, e.pace_preference, e.flights_required, e.notes
      FROM itineraries i
      LEFT JOIN enquiries e ON i.enquiry_id = e.id
      ORDER BY i.created_at DESC
    `

    // Transform the joined data
    const itineraries = rows.map((row) => ({
      id: row.id,
      destinations: row.destinations,
      startDate: row.start_date,
      endDate: row.end_date,
      createdAt: row.created_at,
      status: row.status,
      enquiry: row.enquiry_id
        ? {
            id: row.enquiry_id,
            name: row.enquiry_name,
            phone: row.enquiry_phone,
            email: row.enquiry_email,
            locations: row.enquiry_locations,
            tourType: row.tour_type,
            estimatedDates: row.estimated_dates,
            currency: row.currency,
            budget: row.budget,
            enquiryDate: row.enquiry_date,
            assignedStaff: row.assigned_staff,
            leadSource: row.lead_source,
            tags: row.tags,
            mustSeeSpots: row.must_see_spots,
            pacePreference: row.pace_preference,
            flightsRequired: row.flights_required,
            notes: row.notes,
          }
        : null,
    }))

    return NextResponse.json(itineraries)
  } catch (error) {
    console.error("Error in GET /api/itineraries:", error)
    return createErrorResponse(error)
  }
}

// POST - Create a new itinerary




export async function POST(req: NextRequest) {
  try {
    const body: Itinerary = await req.json();

    // Validate fields
    if (!body.tripId || !body.destinations?.length) {
      return NextResponse.json(
        { error: "Missing itinerary details" },
        { status: 400 }
      );
    }

    // Example: Save itinerary to DB or forward to another service
    return NextResponse.json({
      message: "Itinerary saved successfully",
      data: body,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}


// PUT - Update an itinerary
export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const { id, ...updateData } = data

    if (!id) {
      return NextResponse.json(
        {
          error: "Itinerary ID is required",
          code: "VALIDATION_ERROR",
        },
        { status: 400 },
      )
    }

    // Update itinerary
    const { rows } = await sql`
      UPDATE itineraries 
      SET 
        destinations = ${updateData.destinations || ""},
        start_date = ${updateData.startDate || ""},
        end_date = ${updateData.endDate || ""},
        enquiry_id = ${updateData.enquiryId || null},
        status = ${updateData.status || "draft"},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    if (rows.length === 0) {
      return NextResponse.json({ error: "Itinerary not found" }, { status: 404 })
    }

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("Error in PUT /api/itineraries:", error)
    return createErrorResponse(error)
  }
}

// DELETE - Delete an itinerary
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        {
          error: "Itinerary ID is required",
          code: "VALIDATION_ERROR",
        },
        { status: 400 },
      )
    }

    const { rows } = await sql`
      DELETE FROM itineraries 
      WHERE id = ${id} 
      RETURNING id
    `

    if (rows.length === 0) {
      return NextResponse.json({ error: "Itinerary not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Itinerary deleted successfully",
      id: rows[0].id,
    })
  } catch (error) {
    console.error("Error in DELETE /api/itineraries:", error)
    return createErrorResponse(error)
  }
}
