import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const agencyId = searchParams.get("agencyId")

    if (!agencyId) {
      return NextResponse.json({ error: "Agency ID is required" }, { status: 400 })
    }

    // TODO: Replace with actual database query
    const paymentMethod = {
      bank: [],
      upiProvider: "",
      identifier: "",
      paymentLink: "",
      qrCode: null,
    }

    return NextResponse.json({ success: true, paymentMethod })
  } catch (error) {
    console.error("Error fetching bank details:", error)
    return NextResponse.json({ error: "Failed to fetch bank details" }, { status: 500 })
  }
}

// Helper function to process form data
async function processPaymentRequest(request: NextRequest, isUpdate = false) {
  try {
    // Check if it's multipart/form-data
    const contentType = request.headers.get("content-type") || ""
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Content-Type must be multipart/form-data" },
        { status: 400 }
      )
    }

    const formData = await request.formData()
    const agencyId = formData.get("agencyId") as string

    if (!agencyId) {
      return NextResponse.json({ error: "Agency ID is required" }, { status: 400 })
    }

    // Process form data
    const bankData = formData.get("bank") as string
    const upiProvider = formData.get("upiProvider") as string
    const upiId = formData.get("upiId") as string
    const paymentLink = formData.get("paymentLink") as string
    const qrFile = formData.get("qrCode") as File | null

    // Parse bank data
    let banks = []
    if (bankData && bankData !== "undefined" && bankData !== "null") {
      try {
        banks = JSON.parse(bankData)
      } catch (parseError) {
        console.error("Error parsing bank data:", parseError)
        return NextResponse.json(
          {
            error: "Invalid bank data format",
            details: "Bank data must be valid JSON",
          },
          { status: 400 },
        )
      }
    }

    // TODO: Save/Update to database - replace with actual database operations
    console.log(`${isUpdate ? "Updating" : "Saving"} payment methods:`, {
      agencyId,
      banksCount: banks.length,
      upiProvider,
      upiId,
      paymentLink,
      hasQrFile: !!qrFile,
      qrFileName: qrFile?.name,
    })

    // Mock successful response
    return NextResponse.json({
      success: true,
      message: `Payment methods ${isUpdate ? "updated" : "saved"} successfully`,
      data: {
        agencyId,
        banks,
        upiProvider,
        upiId,
        paymentLink,
        qrCode: qrFile ? { 
          url: `/uploads/${Date.now()}_${qrFile.name}`,
          filename: qrFile.name
        } : null,
      },
    })

  } catch (error) {
    console.error(`Error ${isUpdate ? "updating" : "saving"} payment methods:`, error)
    
    // Ensure we always return JSON, even on errors
    return NextResponse.json(
      {
        error: `Failed to ${isUpdate ? "update" : "save"} payment methods`,
        details: error instanceof Error ? error.message : "Unknown server error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  return processPaymentRequest(request, false)
}

export async function PUT(request: NextRequest) {
  return processPaymentRequest(request, true)
}