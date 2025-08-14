import { NextResponse } from "next/server";
import { sql } from "@vercel/postgres";


function createErrorResponse(error: unknown, statusCode: number = 500) {
  console.error("API Error:", error);

  let errMessage = "Internal server error";
  let errCode = "UNKNOWN_ERROR";

  if (error instanceof Error) {
    errMessage = error.message;
  }
  if (typeof error === "object" && error !== null && "code" in error) {
    errCode = String((error as { code?: string }).code ?? "UNKNOWN_ERROR");
  }

  return NextResponse.json(
    { error: errMessage, code: errCode },
    { status: statusCode }
  );
}

// GET
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const { rows } = await sql`SELECT * FROM enquiries WHERE id = ${id}`;
      if (rows.length === 0) {
        return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
      }
      return NextResponse.json(rows[0]);
    }

    const { rows } = await sql`
      SELECT * FROM enquiries ORDER BY created_at DESC
    `;
    return NextResponse.json(rows);
  } catch (error) {
    return createErrorResponse(error);
  }
}

// POST
export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.name || !data.phone || !data.email) {
      return NextResponse.json(
        { error: "Name, phone, and email are required", code: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }

    await sql`
      CREATE TABLE IF NOT EXISTS enquiries (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        email VARCHAR(255) NOT NULL,
        locations TEXT,
        tour_type VARCHAR(255),
        estimated_dates VARCHAR(255),
        currency VARCHAR(10),
        budget DECIMAL(10,2),
        notes TEXT,
        assigned_staff VARCHAR(255),
        point_of_contact VARCHAR(255),
        pickup_location VARCHAR(255),
        drop_location VARCHAR(255),
        number_of_travellers VARCHAR(50),
        number_of_kids VARCHAR(50),
        traveling_with_pets VARCHAR(10),
        flights_required VARCHAR(10),
        lead_source VARCHAR(100),
        tags VARCHAR(255),
        must_see_spots TEXT,
        pace_preference VARCHAR(100),
        status VARCHAR(50),
        enquiry_date VARCHAR(50),
        payment_status VARCHAR(50),
        booking_status VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const { rows } = await sql`
      INSERT INTO enquiries (
        id, name, phone, email, locations, tour_type, estimated_dates,
        currency, budget, notes, assigned_staff, point_of_contact,
        pickup_location, drop_location, number_of_travellers, 
        number_of_kids, traveling_with_pets, flights_required,
        lead_source, tags, must_see_spots, pace_preference,
        status, enquiry_date, payment_status, booking_status
      ) VALUES (
        ${data.id},
        ${data.name},
        ${data.phone},
        ${data.email},
        ${data.locations || ''},
        ${data.tourType || ''},
        ${data.estimatedDates || ''},
        ${data.currency || 'USD'},
        ${data.budget || 0},
        ${data.notes || ''},
        ${data.assignedStaff || ''},
        ${data.pointOfContact || ''},
        ${data.pickupLocation || ''},
        ${data.dropLocation || ''},
        ${data.numberOfTravellers || ''},
        ${data.numberOfKids || ''},
        ${data.travelingWithPets || 'No'},
        ${data.flightsRequired || 'No'},
        ${data.leadSource || 'Direct'},
        ${data.tags || ''},
        ${data.mustSeeSpots || ''},
        ${data.pacePreference || ''},
        ${data.status || 'enquiry'},
        ${data.enquiryDate || new Date().toISOString().split('T')[0]},
        ${data.paymentStatus || 'UNPAID'},
        ${data.bookingStatus || 'Pending'}
      ) RETURNING *
    `;

    return NextResponse.json(rows[0], { status: 201 });
  } catch (error) {
    return createErrorResponse(error);
  }
}

// PUT & DELETE remain the same, just replace `error: any` with `error: unknown` in createErrorResponse


// PUT - Update an enquiry
export async function PUT(request: Request) {
  try {
    const data = await request.json()
    const { id, ...updateData } = data

    if (!id) {
      return NextResponse.json(
        {
          error: "Enquiry ID is required",
          code: "VALIDATION_ERROR",
        },
        { status: 400 }
      )
    }

    // Handle simple status updates with explicit queries
    if (Object.keys(updateData).length === 1) {
      if (updateData.status) {
        const { rows } = await sql`
          UPDATE enquiries 
          SET status = ${updateData.status}, updated_at = CURRENT_TIMESTAMP
          WHERE id = ${id}
          RETURNING *
        `
        if (rows.length === 0) {
          return NextResponse.json({ error: "Enquiry not found" }, { status: 404 })
        }
        return NextResponse.json(rows[0])
      } else if (updateData.paymentStatus) {
        const { rows } = await sql`
          UPDATE enquiries 
          SET payment_status = ${updateData.paymentStatus}, updated_at = CURRENT_TIMESTAMP
          WHERE id = ${id}
          RETURNING *
        `
        if (rows.length === 0) {
          return NextResponse.json({ error: "Enquiry not found" }, { status: 404 })
        }
        return NextResponse.json(rows[0])
      } else if (updateData.bookingStatus) {
        const { rows } = await sql`
          UPDATE enquiries 
          SET booking_status = ${updateData.bookingStatus}, updated_at = CURRENT_TIMESTAMP
          WHERE id = ${id}
          RETURNING *
        `
        if (rows.length === 0) {
          return NextResponse.json({ error: "Enquiry not found" }, { status: 404 })
        }
        return NextResponse.json(rows[0])
      }
    }

    // Full update for multiple fields
    const { rows } = await sql`
      UPDATE enquiries 
      SET 
        name = ${updateData.name || ''},
        phone = ${updateData.phone || ''},
        email = ${updateData.email || ''},
        locations = ${updateData.locations || ''},
        tour_type = ${updateData.tourType || ''},
        estimated_dates = ${updateData.estimatedDates || ''},
        currency = ${updateData.currency || 'USD'},
        budget = ${updateData.budget || 0},
        notes = ${updateData.notes || ''},
        assigned_staff = ${updateData.assignedStaff || ''},
        point_of_contact = ${updateData.pointOfContact || ''},
        pickup_location = ${updateData.pickupLocation || ''},
        drop_location = ${updateData.dropLocation || ''},
        number_of_travellers = ${updateData.numberOfTravellers || ''},
        number_of_kids = ${updateData.numberOfKids || ''},
        traveling_with_pets = ${updateData.travelingWithPets || 'No'},
        flights_required = ${updateData.flightsRequired || 'No'},
        lead_source = ${updateData.leadSource || 'Direct'},
        tags = ${updateData.tags || ''},
        must_see_spots = ${updateData.mustSeeSpots || ''},
        pace_preference = ${updateData.pacePreference || ''},
        status = ${updateData.status || 'enquiry'},
        payment_status = ${updateData.paymentStatus || 'UNPAID'},
        booking_status = ${updateData.bookingStatus || 'Pending'},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${id}
      RETURNING *
    `

    if (rows.length === 0) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 })
    }

    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("Error in PUT /api/enquiries:", error)
    return createErrorResponse(error)
  }
}

// DELETE - Delete an enquiry
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json(
        {
          error: "Enquiry ID is required",
          code: "VALIDATION_ERROR",
        },
        { status: 400 }
      )
    }

    const { rows } = await sql`
      DELETE FROM enquiries 
      WHERE id = ${id} 
      RETURNING id
    `

    if (rows.length === 0) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "Enquiry deleted successfully",
      id: rows[0].id,
    })
  } catch (error) {
    console.error("Error in DELETE /api/enquiries:", error)
    return createErrorResponse(error)
  }
}