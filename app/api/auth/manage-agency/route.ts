import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET - Fetch agency requests with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "10")
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status")
    const requestType = searchParams.get("requestType")
    const sortBy = searchParams.get("sortBy") || "requestDate"
    const sortDirection = searchParams.get("sortDirection") || "desc"
    const dateFrom = searchParams.get("dateFrom")
    const dateTo = searchParams.get("dateTo")

    // Build where clause
    const where: any = {}

    if (search) {
      where.OR = [
        { requestId: { contains: search, mode: "insensitive" } },
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { agencyName: { contains: search, mode: "insensitive" } },
      ]
    }

    if (status) {
      where.status = status
    }

    if (requestType) {
      where.requestType = requestType
    }

    if (dateFrom || dateTo) {
      where.requestDate = {}
      if (dateFrom) {
        where.requestDate.gte = new Date(dateFrom)
      }
      if (dateTo) {
        where.requestDate.lte = new Date(dateTo)
      }
    }

    // Build orderBy clause
    const orderBy: any = {}
    orderBy[sortBy] = sortDirection

    // Calculate pagination
    const skip = (page - 1) * limit

    // Fetch data with pagination
    const [requests, totalCount] = await Promise.all([
      prisma.agencyRequest.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          logo: true,
          businessLicense: true,
        },
      }),
      prisma.agencyRequest.count({ where }),
    ])

    // Transform data to match frontend expectations
    const transformedRequests = requests.map((request) => ({
      id: request.requestId,
      name: request.name,
      email: request.email,
      phoneNumber: request.phoneNumber,
      AgencyName: request.agencyName,
      status: request.status === "APPROVED" ? "Active" : "Inactive",
      requestType: request.status,
      requestDate: request.requestDate.toISOString(),
      contactPerson: request.contactPerson,
      designation: request.designation,
      website: request.website,
      ownerName: request.ownerName,
      gstNumber: request.gstNumber,
      panNumber: request.panNumber,
      headquarters: request.headquarters,
      logo: request.logo,
      businessLicense: request.businessLicense,
      notes: request.notes,
      reviewNotes: request.reviewNotes,
      reviewedBy: request.reviewedBy,
      reviewedAt: request.reviewedAt,
    }))

    return NextResponse.json({
      requests: transformedRequests,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        hasNextPage: page * limit < totalCount,
        hasPrevPage: page > 1,
      },
    })
  } catch (error) {
    console.error("Error fetching agency requests:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// POST - Create new agency request
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      name,
      email,
      phoneNumber,
      agencyName,
      contactPerson,
      designation,
      website,
      ownerName,
      companyPhone,
      gstRegistered,
      gstNumber,
      yearOfRegistration,
      panNumber,
      panType,
      headquarters,
      country,
      yearsOfOperation,
      logoId,
      businessLicenseId,
      notes,
    } = body

    // Validate required fields
    if (!name || !email || !phoneNumber || !agencyName) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingRequest = await prisma.agencyRequest.findFirst({
      where: { email },
    })

    if (existingRequest) {
      return NextResponse.json(
        { error: "Agency request with this email already exists" },
        { status: 409 }
      )
    }

    const newRequest = await prisma.agencyRequest.create({
      data: {
        name,
        email,
        phoneNumber,
        agencyName,
        contactPerson,
        designation,
        website,
        ownerName,
        companyPhone,
        gstRegistered,
        gstNumber,
        yearOfRegistration,
        panNumber,
        panType,
        headquarters,
        country,
        yearsOfOperation,
        logoId,
        businessLicenseId,
        notes,
      },
      include: {
        logo: true,
        businessLicense: true,
      },
    })

    return NextResponse.json(
      { 
        message: "Agency request created successfully",
        request: {
          id: newRequest.requestId,
          name: newRequest.name,
          email: newRequest.email,
          phoneNumber: newRequest.phoneNumber,
          AgencyName: newRequest.agencyName,
          status: "Pending",
          requestType: "PENDING",
          requestDate: newRequest.requestDate.toISOString(),
        }
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating agency request:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// PATCH - Update agency request status
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { requestId, status, reviewNotes } = body

    if (!requestId || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const updatedRequest = await prisma.agencyRequest.update({
      where: { requestId },
      data: {
        status,
        reviewNotes,
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
      },
      include: {
        logo: true,
        businessLicense: true,
      },
    })

    return NextResponse.json({
      message: "Agency request updated successfully",
      request: {
        id: updatedRequest.requestId,
        name: updatedRequest.name,
        email: updatedRequest.email,
        phoneNumber: updatedRequest.phoneNumber,
        AgencyName: updatedRequest.agencyName,
        status: updatedRequest.status === "APPROVED" ? "Active" : "Inactive",
        requestType: updatedRequest.status,
        requestDate: updatedRequest.requestDate.toISOString(),
        reviewNotes: updatedRequest.reviewNotes,
        reviewedBy: updatedRequest.reviewedBy,
        reviewedAt: updatedRequest.reviewedAt,
      },
    })
  } catch (error) {
    console.error("Error updating agency request:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// DELETE - Delete agency request
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const requestId = searchParams.get("requestId")

    if (!requestId) {
      return NextResponse.json(
        { error: "Request ID is required" },
        { status: 400 }
      )
    }

    await prisma.agencyRequest.delete({
      where: { requestId },
    })

    return NextResponse.json({
      message: "Agency request deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting agency request:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 