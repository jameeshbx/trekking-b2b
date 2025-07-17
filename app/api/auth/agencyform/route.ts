import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    console.log("Agency form submission started")
    const data = await request.json()
    console.log("Received data:", data)
    
    // Create a basic record with minimal fields
    const agency = await prisma.agencyForm.create({
      data: {
        name: data.contactPerson || "New Agency",
        email: data.email,
        contactPerson: data.contactPerson,
        phoneNumber: data.phoneNumber,
        phoneCountryCode: data.phoneCountryCode || "+91",
        designation: data.designation,
        website: data.website,
        ownerName: data.ownerName,
        companyPhone: data.companyPhone,
        companyPhoneCode: data.companyPhoneCode || "+91",
        landingPageColor: data.landingPageColor || "#4ECDC4",
        gstRegistered: data.gstRegistered,
        gstNumber: data.gstNumber,
        yearOfRegistration: data.yearOfRegistration,
        panNumber: data.panNumber,
        panType: data.panType,
        headquarters: data.headquarters,
        country: data.country || "INDIA",
        yearsOfOperation: data.yearsOfOperation,
        agencyType: data.agencyType || "PRIVATE_LIMITED",
        config: {
          status: "ACTIVE",
          requestType: "PENDING"
        },
        createdBy: "admin"
      }
    })

    console.log("Agency created successfully:", agency)
    return NextResponse.json({
      message: "Agency created successfully",
      agency: {
        id: agency.id,
        name: agency.name,
        email: agency.email
      }
    })

  } catch (error) {
    console.error("Error creating agency:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json(
      { 
        error: "Failed to create agency",
        details: errorMessage,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
