import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// GET - Fetch all DMCs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const sortBy = searchParams.get("sortBy") || "name"
    const sortOrder = searchParams.get("sortOrder") || "asc"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const skip = (page - 1) * limit

    let whereClause = {}
    if (search) {
      whereClause = {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { primaryContact: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      }
    }

    const dmcs = await prisma.dMC.findMany({
      where: whereClause,
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take: limit,
    })

    const total = await prisma.dMC.count({ where: whereClause })

    return NextResponse.json({
      dmcs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching DMCs:", error)
    return NextResponse.json({ error: "Failed to fetch DMCs" }, { status: 500 })
  }
}

// POST - Create new DMC
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      dmcName,
      primaryContact,
      phoneNumber,
      primaryPhoneExtension,
      designation,
      ownerName,
      ownerPhoneNumber,
      ownerPhoneExtension,
      email,
      website,
      primaryCountry,
      destinationsCovered,
      cities,
      gstRegistration,
      gstNo,
      yearOfRegistration,
      panNo,
      panType,
      headquarters,
      country,
      yearOfExperience,
      registrationCertificate,
      createdBy,
    } = body

    // Check if DMC with email already exists
    const existingDMC = await prisma.dMC.findUnique({
      where: { email },
    })

    if (existingDMC) {
      return NextResponse.json({ error: "DMC with this email already exists" }, { status: 400 })
    }

    const newDMC = await prisma.dMC.create({
      data: {
        name: dmcName,
        primaryContact,
        phoneNumber,
        primaryPhoneExtension: primaryPhoneExtension || "+91",
        designation,
        ownerName,
        ownerPhoneNumber,
        ownerPhoneExtension: ownerPhoneExtension || "+91",
        email,
        website,
        primaryCountry,
        destinationsCovered,
        cities,
        gstRegistration: gstRegistration === "Yes",
        gstNo: gstRegistration === "Yes" ? gstNo : null,
        yearOfRegistration,
        panNo,
        panType: panType as any,
        headquarters,
        country,
        yearOfExperience,
        registrationCertificate,
        createdBy: createdBy || "admin",
        status: "PENDING",
      },
    })

    return NextResponse.json(newDMC, { status: 201 })
  } catch (error) {
    console.error("Error creating DMC:", error)
    return NextResponse.json({ error: "Failed to create DMC" }, { status: 500 })
  }
}
