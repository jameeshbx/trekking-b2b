import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient, PaymentMethodType } from "@prisma/client"

const prisma = new PrismaClient()

type BankAccount = {
  accountHolderName: string
  bankName: string
  branchName: string
  accountNumber: string
  ifscCode: string
  bankCountry: string
  currency: string
  notes?: string
}

const fileToDataUrl = async (file: File): Promise<string> => {
  const buf = Buffer.from(await file.arrayBuffer())
  const base64 = buf.toString("base64")
  return `data:${file.type || "application/octet-stream"};base64,${base64}`
}

export async function POST(request: NextRequest) {
  try {
    let dmcId = ""
    let banks: BankAccount[] = []
    let upiProvider = ""
    let upiId = ""
    let paymentLink = ""
    let qrFile: File | null = null

    // Support both JSON and FormData
    const contentType = request.headers.get("content-type") || ""
    if (contentType.includes("application/json")) {
      const body = await request.json()
      dmcId = String(body.dmcId || "").trim()
      banks = Array.isArray(body.bank) ? body.bank : []
      upiProvider = String(body.upiProvider || "")
      upiId = String(body.upiId || "")
      paymentLink = String(body.paymentLink || "")
    } else {
      const formData = await request.formData()
      dmcId = String(formData.get("dmcId") || "").trim()
      try {
        const banksRaw = String(formData.get("bank") || "[]")
        banks = JSON.parse(banksRaw || "[]")
      } catch {
        banks = []
      }
      upiProvider = String(formData.get("upiProvider") || "")
      upiId = String(formData.get("upiId") || "")
      paymentLink = String(formData.get("paymentLink") || "")
      qrFile = (formData.get("qrCode") as File) || null
    }

    if (!dmcId) {
      return NextResponse.json({ error: "dmcId is required" }, { status: 400 })
    }

    // Handle BANK_ACCOUNT payment method
    if (banks && banks.length > 0) {
      const bankData = banks[0] // Using first bank account
      const existing = await prisma.paymentMethod.findFirst({
        where: { dmcId, type: PaymentMethodType.BANK_ACCOUNT }
      })

      const bankUpdateData = {
        type: PaymentMethodType.BANK_ACCOUNT,
        name: bankData.accountHolderName,
        identifier: bankData.accountNumber, // Using identifier field for account number
        bankName: bankData.bankName,
        branchName: bankData.branchName,
        ifscCode: bankData.ifscCode,
        bankCountry: bankData.bankCountry,
        currency: bankData.currency,
        notes: bankData.notes,
        isActive: true
      }

      if (existing) {
        await prisma.paymentMethod.update({
          where: { id: existing.id },
          data: bankUpdateData
        })
      } else {
        await prisma.paymentMethod.create({
          data: {
            dmcId,
            ...bankUpdateData
          }
        })
      }
    }

    // Handle UPI payment method
    if (upiId) {
      const existing = await prisma.paymentMethod.findFirst({
        where: { dmcId, type: PaymentMethodType.UPI }
      })

      const upiUpdateData = {
        type: PaymentMethodType.UPI,
        name: upiProvider || "UPI",
        identifier: upiId,
        upiProvider: upiProvider || null,
        isActive: true
      }

      if (existing) {
        await prisma.paymentMethod.update({
          where: { id: existing.id },
          data: upiUpdateData
        })
      } else {
        await prisma.paymentMethod.create({
          data: {
            dmcId,
            ...upiUpdateData
          }
        })
      }
    }

    // Handle PAYMENT_GATEWAY payment method
    if (paymentLink) {
      const existing = await prisma.paymentMethod.findFirst({
        where: { dmcId, type: PaymentMethodType.PAYMENT_GATEWAY }
      })

      const gatewayUpdateData = {
        type: PaymentMethodType.PAYMENT_GATEWAY,
        name: "Payment Gateway",
        identifier: paymentLink,
        paymentLink: paymentLink,
        isActive: true
      }

      if (existing) {
        await prisma.paymentMethod.update({
          where: { id: existing.id },
          data: gatewayUpdateData
        })
      } else {
        await prisma.paymentMethod.create({
          data: {
            dmcId,
            ...gatewayUpdateData
          }
        })
      }
    }

    // Handle QR_CODE payment method
    if (qrFile) {
      const dataUrl = await fileToDataUrl(qrFile)
      const fileRow = await prisma.file.create({
        data: {
          url: dataUrl,
          name: qrFile.name || "qr-code",
          size: Number(qrFile.size || 0),
          type: qrFile.type || "application/octet-stream",
        },
      })

      const existing = await prisma.paymentMethod.findFirst({
        where: { dmcId, type: PaymentMethodType.QR_CODE }
      })

      const qrUpdateData = {
        type: PaymentMethodType.QR_CODE,
        name: "QR Code",
        identifier: fileRow.id,
        qrCodeId: fileRow.id,
        isActive: true
      }

      if (existing) {
        await prisma.paymentMethod.update({
          where: { id: existing.id },
          data: qrUpdateData
        })
      } else {
        await prisma.paymentMethod.create({
          data: {
            dmcId,
            ...qrUpdateData
          }
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payment details saved successfully"
    })
  } catch (error) {
    console.error("Error saving payment details:", error)
    return NextResponse.json(
      {
        error: "Failed to save payment details",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const dmcId = searchParams.get("dmcId") || undefined

    const methods = dmcId
      ? await prisma.paymentMethod.findMany({
          where: { dmcId },
          include: { qrCode: true },
          orderBy: { createdAt: "desc" },
        })
      : []

    return NextResponse.json({ success: true, data: { methods } })
  } catch (error) {
    console.error("Error fetching payment details:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch payment details",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}