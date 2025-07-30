import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient, type Prisma, PaymentMethodType } from "@prisma/client"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("Received payment data:", body)

    const { type } = body

    let paymentMethodData: Prisma.PaymentMethodCreateInput = {
      type,
      isActive: true,
    }

    // Handle different payment method types
    switch (type) {
      case "BANK_ACCOUNT":
        paymentMethodData = {
          ...paymentMethodData,
          name: body.accountHolderName,
          identifier: body.accountNumber,
          bankName: body.bankName,
          branchName: body.branchName,
          ifscCode: body.ifscCode,
          bankCountry: body.bankCountry,
          currency: body.currency,
          notes: body.notes,
        }
        break

      case "CREDIT_CARD":
      case "DEBIT_CARD":
        paymentMethodData = {
          ...paymentMethodData,
          name: body.cardName,
          identifier: body.cardNumber,
          cardHolder: body.cardName,
          expiryDate: body.expiryDate,
        }
        break

      case "UPI":
        paymentMethodData = {
          ...paymentMethodData,
          name: body.upiProvider,
          identifier: body.upiId,
          upiProvider: body.upiProvider,
        }
        break

      case "PAYMENT_GATEWAY":
        paymentMethodData = {
          ...paymentMethodData,
          name: "Payment Gateway",
          identifier: body.paymentLink,
          paymentLink: body.paymentLink,
        }
        break

      default:
        return NextResponse.json({ error: "Invalid payment method type" }, { status: 400 })
    }

    // Save to database
    const paymentMethod = await prisma.paymentMethod.create({
      data: paymentMethodData,
    })

    console.log("Payment method saved:", paymentMethod)

    return NextResponse.json({
      success: true,
      data: paymentMethod,
      message: "Payment method saved successfully",
    })
  } catch (error) {
    console.error("Error saving payment method:", error)
    return NextResponse.json(
      {
        error: "Failed to save payment method",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dmcId = searchParams.get("dmcId")
    const type = searchParams.get("type")

    const whereClause: Prisma.PaymentMethodWhereInput = {}

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

    const paymentMethods = await prisma.paymentMethod.findMany({
      where: whereClause,
      include: {
        qrCode: true,
        dmc: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({
      success: true,
      data: paymentMethods,
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
