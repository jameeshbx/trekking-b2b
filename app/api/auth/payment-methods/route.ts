import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient, type Prisma, PaymentMethodType } from "@prisma/client"

const prisma = new PrismaClient()

// Get all payment methods or filter by DMC ID
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dmcId = searchParams.get("dmcId")
    const type = searchParams.get("type")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const skip = (page - 1) * limit

    const whereClause: Prisma.PaymentMethodWhereInput = {
      isActive: true,
    }

    if (dmcId) {
      whereClause.dmcId = dmcId
    }

    if (type) {
      // Validate that the type is a valid PaymentMethodType enum value
      const validTypes = Object.values(PaymentMethodType)
      if (validTypes.includes(type as PaymentMethodType)) {
        whereClause.type = type as PaymentMethodType
      }
    }

    const [paymentMethods, total] = await Promise.all([
      prisma.paymentMethod.findMany({
        where: whereClause,
        include: {
          qrCode: true,
          dmc: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: limit,
      }),
      prisma.paymentMethod.count({
        where: whereClause,
      }),
    ])

    return NextResponse.json({
      success: true,
      data: paymentMethods,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching payment methods:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch payment methods",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Delete a payment method
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Payment method ID is required" }, { status: 400 })
    }

    // Soft delete by setting isActive to false
    const paymentMethod = await prisma.paymentMethod.update({
      where: { id },
      data: { isActive: false },
    })

    return NextResponse.json({
      success: true,
      data: paymentMethod,
      message: "Payment method deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting payment method:", error)
    return NextResponse.json(
      {
        error: "Failed to delete payment method",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
