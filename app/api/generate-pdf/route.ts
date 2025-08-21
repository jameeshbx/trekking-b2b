import { type NextRequest, NextResponse } from "next/server"
import { generateItineraryPDF } from "@/lib/generate-pdf"
import { PrismaClient } from "@prisma/client"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { existsSync } from "fs"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { enquiryId, itineraryId, formData } = body

    if (!enquiryId || !itineraryId || !formData) {
      return NextResponse.json(
        { error: "Missing required fields: enquiryId, itineraryId, or formData" },
        { status: 400 },
      )
    }

    // Fetch enquiry data
    const enquiry = await prisma.enquiries.findUnique({
      where: { id: enquiryId },
      include: { customer: true },
    })

    if (!enquiry) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 })
    }

    const pdfData = {
      enquiryId,
      itineraryId,
      formData,
      enquiryData: {
        name: enquiry.name,
        email: enquiry.email,
        phone: enquiry.phone,
        locations: enquiry.locations || "",
        tourType: enquiry.tourType || "",
        budget: enquiry.budget || 0,
        currency: formData.currency || "USD",
      },
    }

    const { pdfBuffer, filename } = await generateItineraryPDF(pdfData)

    // Save PDF to public directory
    const publicPath = join(process.cwd(), "public", "pdfs")
    const filePath = join(publicPath, filename)

    if (!existsSync(publicPath)) {
      await mkdir(publicPath, { recursive: true })
    }

    // Ensure directory exists
    try {
      await writeFile(filePath, pdfBuffer)
    } catch (error) {
      console.error("Error saving PDF file:", error)
      return NextResponse.json({ error: "Failed to save PDF file" }, { status: 500 })
    }

    const pdfUrl = `/pdfs/${filename}`

    // Update itinerary with PDF URL
    await prisma.itineraries.update({
      where: { id: itineraryId },
      data: {
        pdfUrl: pdfUrl,
        status: "completed",
      },
    })

    // Create shared customer PDF record
    if (enquiry.customerId) {
      await prisma.sharedCustomerPdf.create({
        data: {
          itineraryId,
          customerId: enquiry.customerId,
          enquiryId,
          pdfUrl,
          pdfFileName: filename,
          customerName: enquiry.name,
          customerEmail: enquiry.email,
          customerPhone: enquiry.phone,
          status: "GENERATED",
          createdBy: "system", // You might want to pass actual user ID
        },
      })
    }

    return NextResponse.json({
      success: true,
      pdfUrl,
      filename,
      message: "PDF generated successfully with CSV data",
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
