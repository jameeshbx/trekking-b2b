import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { randomUUID } from "crypto"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const sortBy = searchParams.get("sortBy") || "createdAt"
    const sortOrder = searchParams.get("sortOrder") || "desc"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Build where clause for search
    const whereClause = search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" as const } },
            { contactPerson: { contains: search, mode: "insensitive" as const } },
            { email: { contains: search, mode: "insensitive" as const } },
          ],
        }
      : {}

    // Build orderBy clause
    const orderByClause = (() => {
      switch (sortBy) {
        case "name":
          return { name: sortOrder as "asc" | "desc" }
        case "primaryContact":
          return { contactPerson: sortOrder as "asc" | "desc" }
        case "status":
          return { status: sortOrder as "asc" | "desc" }
        default:
          return { createdAt: sortOrder as "asc" | "desc" }
      }
    })()

    // Fetch DMCs with pagination
    const [dmcs, totalCount] = await Promise.all([
      prisma.dMCForm.findMany({
        where: whereClause,
        orderBy: orderByClause,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          registrationCertificate: {
            select: {
              id: true,
              url: true,
              name: true,
            },
          },
        },
      }),
      prisma.dMCForm.count({ where: whereClause }),
    ])

    // Transform data to match frontend interface
    const transformedDmcs = dmcs.map((dmc) => ({
      id: dmc.id,
      name: dmc.name,
      primaryContact: dmc.contactPerson || "",
      phoneNumber: dmc.phoneNumber || "",
      designation: dmc.designation || "",
      email: dmc.email || "",
      status: dmc.status === "ACTIVE" ? "Active" : "Inactive",
      joinSource: "Agency", // Since these are created by agencies
      registrationCertificateUrl: dmc.registrationCertificate?.url || null,
      createdAt: dmc.createdAt,
      updatedAt: dmc.updatedAt,
    }))

    return NextResponse.json({
      success: true,
      data: transformedDmcs,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching DMCs:", error)
    return NextResponse.json({ error: "Failed to fetch DMCs" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extract form fields
    const dmcName = formData.get("dmcName") as string
    const primaryContact = formData.get("primaryContact") as string
    const phoneNumber = formData.get("phoneNumber") as string
    const designation = formData.get("designation") as string
    const ownerName = formData.get("ownerName") as string
    const ownerPhoneNumber = formData.get("ownerPhoneNumber") as string
    const email = formData.get("email") as string
    const website = formData.get("website") as string
    const primaryCountry = formData.get("primaryCountry") as string
    const destinationsCovered = formData.get("destinationsCovered") as string
    const cities = formData.get("cities") as string
    const gstRegistration = formData.get("gstRegistration") as string
    const gstNo = formData.get("gstNo") as string
    const yearOfRegistration = formData.get("yearOfRegistration") as string
    const panNo = formData.get("panNo") as string
    const panType = formData.get("panType") as string
    const headquarters = formData.get("headquarters") as string
    const country = formData.get("country") as string
    const yearOfExperience = formData.get("yearOfExperience") as string
    const primaryPhoneExtension = formData.get("primaryPhoneExtension") as string
    const ownerPhoneExtension = formData.get("ownerPhoneExtension") as string
    const registrationCertificate = formData.get("registrationCertificate") as File

    // Validate required fields
    if (!dmcName || !primaryContact || !phoneNumber || !email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Handle file upload if present
    let registrationCertificateId: string | null = null

    if (registrationCertificate && registrationCertificate.size > 0) {
      try {
        // Create uploads directory if it doesn't exist
        const uploadsDir = join(process.cwd(), "public", "uploads", "certificates")
        await mkdir(uploadsDir, { recursive: true })

        // Generate unique filename
        const fileExtension = registrationCertificate.name.split(".").pop()
        const fileName = `${randomUUID()}.${fileExtension}`
        const filePath = join(uploadsDir, fileName)

        // Save file to disk
        const bytes = await registrationCertificate.arrayBuffer()
        const buffer = Buffer.from(bytes)
        await writeFile(filePath, buffer)

        // Save file record to database
        const fileRecord = await prisma.file.create({
          data: {
            id: randomUUID(),
            url: `/uploads/certificates/${fileName}`,
            name: registrationCertificate.name,
            size: registrationCertificate.size,
            type: registrationCertificate.type,
          },
        })

        registrationCertificateId = fileRecord.id
      } catch (fileError) {
        console.error("File upload error:", fileError)
        return NextResponse.json({ error: "Failed to upload registration certificate" }, { status: 500 })
      }
    }

    // Map PAN type to enum value
    const panTypeEnum = (panType?.toUpperCase() as "INDIVIDUAL" | "COMPANY" | "TRUST" | "OTHER") || "INDIVIDUAL"

    // Create DMC record
    const dmcRecord = await prisma.dMCForm.create({
      data: {
        id: randomUUID(),
        name: dmcName,
        config: {}, // Default empty JSON object
        contactPerson: primaryContact,
        designation: designation,
        phoneNumber: phoneNumber,
        phoneCountryCode: primaryPhoneExtension || "+91",
        ownerName: ownerName,
        email: email,
        ownerPhoneNumber: ownerPhoneNumber,
        ownerPhoneCode: ownerPhoneExtension || "+91",
        website: website || null,
        primaryCountry: primaryCountry,
        destinationsCovered: destinationsCovered,
        cities: cities,
        gstRegistered: gstRegistration === "Yes",
        gstNumber: gstRegistration === "Yes" ? gstNo : null,
        yearOfRegistration: yearOfRegistration,
        panNumber: panNo,
        panType: panTypeEnum,
        headquarters: headquarters,
        country: country,
        yearsOfExperience: yearOfExperience,
        registrationCertificateId: registrationCertificateId,
        createdBy: "agency", // You might want to get this from session/auth
        status: "ACTIVE",
      },
    })

    return NextResponse.json({
      success: true,
      message: "DMC registered successfully",
      data: dmcRecord,
    })
  } catch (error) {
    console.error("DMC registration error:", error)

    // Handle Prisma validation errors
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return NextResponse.json({ error: "Email already exists" }, { status: 409 })
      }
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
