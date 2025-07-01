// import { type NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/prisma"

// GET - Fetch all DMC Applications
// export async function GET(request: NextRequest) {
//   try {
//     const { searchParams } = new URL(request.url)
//     const search = searchParams.get("search")
//     const sortBy = searchParams.get("sortBy") || "dmcName"
//     const sortOrder = searchParams.get("sortOrder") || "asc"
//     const status = searchParams.get("status")
//     const page = Number.parseInt(searchParams.get("page") || "1")
//     const limit = Number.parseInt(searchParams.get("limit") || "10")

//     const skip = (page - 1) * limit

//     const whereClause: any = {}

    // Add search filter
    // if (search) {
    //   whereClause.OR = [
    //     { dmcName: { contains: search, mode: "insensitive" } },
    //     { primaryContact: { contains: search, mode: "insensitive" } },
    //     { email: { contains: search, mode: "insensitive" } },
    //   ]
    // }

    // Add status filter
//     if (status && status !== "all") {
//       whereClause.status = status
//     }

//     const applications = await prisma.dMCApplication.findMany({
//       where: whereClause,
//       orderBy: {
//         [sortBy]: sortOrder,
//       },
//       skip,
//       take: limit,
//     })

//     const total = await prisma.dMCApplication.count({ where: whereClause })

//     return NextResponse.json({
//       applications,
//       pagination: {
//         page,
//         limit,
//         total,
//         totalPages: Math.ceil(total / limit),
//       },
//     })
//   } catch (error) {
//     console.error("Error fetching DMC applications:", error)
//     return NextResponse.json(
//       {
//         error: "Failed to fetch DMC applications",
//         details: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 },
//     )
//   }
// }

// POST - Create new DMC Application
// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json()

//     const {
//       dmcName,
//       primaryContact,
//       phoneNumber,
//       primaryPhoneExtension,
//       designation,
//       ownerName,
//       ownerPhoneNumber,
//       ownerPhoneExtension,
//       email,
//       website,
//       primaryCountry,
//       destinationsCovered,
//       cities,
//       gstRegistration,
//       gstNo,
//       yearOfRegistration,
//       panNo,
//       panType,
//       headquarters,
//       country,
//       yearOfExperience,
//       registrationCertificate,
//       createdBy,
//     } = body

    // Validate required fields
    // if (!dmcName || !primaryContact || !phoneNumber || !designation || !ownerName || !ownerPhoneNumber || !email) {
    //   return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    // }

    // Check if DMC application with email already exists
//     const existingApplication = await prisma.dMCApplication.findUnique({
//       where: { email },
//     })

//     if (existingApplication) {
//       return NextResponse.json({ error: "DMC application with this email already exists" }, { status: 400 })
//     }

//     const newApplication = await prisma.dMCApplication.create({
//       data: {
//         dmcName,
//         primaryContact,
//         phoneNumber,
//         primaryPhoneExtension: primaryPhoneExtension || "+91",
//         designation,
//         ownerName,
//         ownerPhoneNumber,
//         ownerPhoneExtension: ownerPhoneExtension || "+91",
//         email,
//         website: website || null,
//         primaryCountry: primaryCountry || null,
//         destinationsCovered: destinationsCovered || null,
//         cities: cities || null,
//         gstRegistration: gstRegistration === "Yes",
//         gstNo: gstRegistration === "Yes" ? gstNo : null,
//         yearOfRegistration: yearOfRegistration || null,
//         panNo: panNo || null,
//         panType: panType ? (panType as any) : null,
//         headquarters: headquarters || null,
//         country: country || null,
//         yearOfExperience: yearOfExperience || null,
//         registrationCertificate: registrationCertificate || null,
//         createdBy: createdBy || "admin",
//         status: "PENDING",
//       },
//     })

//     return NextResponse.json(newApplication, { status: 201 })
//   } catch (error) {
//     console.error("Error creating DMC application:", error)
//     return NextResponse.json(
//       {
//         error: "Failed to create DMC application",
//         details: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 },
//     )
//   }
// }
