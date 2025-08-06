import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

// POST - Generate PDF for itinerary
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { enquiryId,  } = body

    // Fetch enquiry data
    const enquiry = await prisma.enquiry.findUnique({
      where: { id: enquiryId },
    })

    if (!enquiry) {
      return NextResponse.json({ error: "Enquiry not found" }, { status: 404 })
    }

    // Simulate PDF generation (in real app, you'd use a PDF library)
    const pdfUrl = `/pdfs/itinerary-${enquiryId}-${Date.now()}.pdf`

    // Note: Update this when you have the SharedDMC model in your Prisma schema
    // For now, we'll just return the PDF URL

    return NextResponse.json({
      success: true,
      message: "PDF generated successfully",
      pdfUrl,
    })
  } catch (error) {
    console.error("Error generating PDF:", error)
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
