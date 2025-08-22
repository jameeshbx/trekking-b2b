import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import fs from "fs/promises"
import path from "path"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    console.log("[v0] PDF generation started")
    const body = await request.json()
    console.log("[v0] Request body:", body)
    const { enquiryId, itineraryId, formData } = body

    const pdfTemplatePath = path.join(process.cwd(), "lib", "itinerary.pdf")
    const itineraryDir = path.join(process.cwd(), "public", "itinerary")

    console.log("[v0] PDF template path:", pdfTemplatePath)
    console.log("[v0] Looking for CSV files in:", itineraryDir)

    try {
      await fs.access(pdfTemplatePath)
      console.log("[v0] itinerary.pdf file exists at:", pdfTemplatePath)
    } catch (error) {
      console.error("[v0] itinerary.pdf file not found:", error)
      return NextResponse.json(
        {
          error: "PDF template not found",
          details: `lib/itinerary.pdf file is missing at ${pdfTemplatePath}`,
          path: pdfTemplatePath,
        },
        { status: 500 },
      )
    }

    let csvFilePath = null
    let csvFileName = null

    if (enquiryId) {
      const availableCSVFiles = ["EVER001.csv", "GOA001.csv", "KASH001.csv", "KER001.csv", "RAJ001.csv", "THAI001.csv"]
      const matchingFile = availableCSVFiles.find((file) => file.toLowerCase().includes(enquiryId.toLowerCase()))
      if (matchingFile) {
        csvFilePath = path.join(itineraryDir, matchingFile)
        csvFileName = matchingFile
      }
    }

    if (!csvFilePath && formData.destinations?.[0]) {
      const destination = formData.destinations[0].toLowerCase()
      const destinationMap: { [key: string]: string } = {
        kerala: "EVER001.csv",
        kochi: "EVER001.csv",
        munnar: "EVER001.csv",
        alleppey: "EVER001.csv",
        goa: "GOA001.csv",
        "north goa": "GOA001.csv",
        "south goa": "GOA001.csv",
        kashmir: "KASH001.csv",
        srinagar: "KASH001.csv",
        gulmarg: "KASH001.csv",
        rajasthan: "RAJ001.csv",
        jaipur: "RAJ001.csv",
        jodhpur: "RAJ001.csv",
        thailand: "THAI001.csv",
        bangkok: "THAI001.csv",
        phuket: "THAI001.csv",
      }

      for (const [dest, file] of Object.entries(destinationMap)) {
        if (destination.includes(dest)) {
          csvFilePath = path.join(itineraryDir, file)
          csvFileName = file
          break
        }
      }
    }

    if (!csvFilePath) {
      const availableCSVFiles = ["EVER001.csv", "GOA001.csv", "KASH001.csv", "KER001.csv", "RAJ001.csv", "THAI001.csv"]
      csvFileName = availableCSVFiles[0]
      csvFilePath = path.join(itineraryDir, csvFileName)
    }

    console.log("[v0] Selected CSV file:", csvFileName)
    console.log("[v0] CSV file path:", csvFilePath)

    try {
      await fs.access(csvFilePath)
      console.log("[v0] CSV file exists at:", csvFilePath)
    } catch (error) {
      console.error("[v0] CSV file not found:", error)
      return NextResponse.json(
        {
          error: "CSV template not found",
          details: `CSV file ${csvFileName} is missing at ${csvFilePath}`,
          path: csvFilePath,
          availableFiles: ["EVER001.csv", "GOA001.csv", "KASH001.csv", "KER001.csv", "RAJ001.csv", "THAI001.csv"],
        },
        { status: 500 },
      )
    }

    const formBytes = await fs.readFile(pdfTemplatePath)
    console.log("[v0] PDF template loaded, size:", formBytes.length)

    const pdfDoc = await PDFDocument.load(formBytes)
    console.log("[v0] PDF document loaded successfully")

    const pages = pdfDoc.getPages()
    let firstPage = pages[0]
    const { height } = firstPage.getSize()

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    const drawText = (text: string, x: number, y: number, size = 10, page = firstPage, fontType = font) => {
      page.drawText(text, {
        x,
        y,
        size,
        font: fontType,
        color: rgb(0, 0, 0),
      })
    }

    const csvData = await fs.readFile(csvFilePath, "utf-8")
    console.log("[v0] CSV data loaded from:", csvFilePath)

    const csvLines = csvData.trim().split("\n")
    const headers = csvLines[0].split(",")
    console.log("[v0] CSV headers:", headers)

    // Parse all CSV rows into structured data
    const itineraryActivities = []
    for (let i = 1; i < csvLines.length; i++) {
      const row = csvLines[i].split(",")
      if (row.length >= headers.length) {
        const activity = {
          packageId: row[0]?.trim(),
          destination: row[1]?.trim(),
          day: Number.parseInt(row[2]?.trim()) || 1,
          time: row[3]?.trim(),
          activity: row[4]?.trim(),
          activityType: row[5]?.trim(),
          description: row[6]?.trim(),
          meal: row[7]?.trim(),
          transport: row[8]?.trim(),
          accommodation: row[9]?.trim(),
          cost: Number.parseInt(row[10]?.trim()) || 0,
        }
        itineraryActivities.push(activity)
      }
    }

    console.log("[v0] Parsed activities:", itineraryActivities.length)

    // Group activities by day
    const dayWiseActivities = itineraryActivities.reduce(
      (acc, activity) => {
        if (!acc[activity.day]) {
          acc[activity.day] = []
        }
        acc[activity.day].push(activity)
        return acc
      },
      {} as Record<number, typeof itineraryActivities>,
    )

    // Calculate totals
    const totalDays = Math.max(...itineraryActivities.map((a) => a.day))
    const totalCost = itineraryActivities.reduce((sum, activity) => sum + activity.cost, 0)
    const destination = itineraryActivities[0]?.destination || formData.destinations?.[0] || "Unknown"

    const itineraryData = {
      // Basic Info
      date: new Date().toLocaleDateString(),
      travelerName: formData.customerName || formData.name || "Valued Customer",
      email: formData.customerEmail || formData.email || "customer@example.com",
      phone: formData.customerPhone || formData.whatsappNumber || "+91-9876543210",

      // Travel Details
      destination: destination,
      travelDates: `${formData.startDate || formData.checkInDate || new Date().toLocaleDateString()} to ${formData.endDate || formData.checkOutDate || new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}`,
      groupSize: `${formData.adults || 2} Adults${formData.children ? `, ${formData.children} Children` : ""}${formData.under6 ? `, ${formData.under6} Under 6` : ""}${formData.from7to12 ? `, ${formData.from7to12} Age 7-12` : ""}`,
      travelType: formData.travelType || "Family",
      budgetRange: `${formData.currency || "USD"} ${formData.budget || totalCost}`,

      // Package Details
      duration: `${totalDays} Days / ${totalDays - 1} Nights`,
      totalCost: `${formData.currency || "USD"} ${totalCost}`,
      packageName: `${destination} ${formData.travelType || "Premium"} Package`,

      // Activities
      dayWiseActivities: dayWiseActivities,
      totalDays: totalDays,
    }

    console.log("[v0] Enhanced itinerary data:", itineraryData)

    let yPosition = height - 75

    // Header Information
    drawText(itineraryData.date, 60, yPosition, 10)
    drawText(itineraryData.packageName, 340, yPosition - 45, 14, firstPage, boldFont)

    yPosition -= 100

    // Customer Information
    drawText("Traveler Details:", 60, yPosition, 12, firstPage, boldFont)
    yPosition -= 25
    drawText(`Name: ${itineraryData.travelerName}`, 60, yPosition, 10)
    drawText(`Email: ${itineraryData.email}`, 300, yPosition, 10)
    yPosition -= 20
    drawText(`Phone: ${itineraryData.phone}`, 60, yPosition, 10)
    drawText(`Group Size: ${itineraryData.groupSize}`, 300, yPosition, 10)
    yPosition -= 20
    drawText(`Travel Type: ${itineraryData.travelType}`, 60, yPosition, 10)
    drawText(`Budget: ${itineraryData.budgetRange}`, 300, yPosition, 10)

    yPosition -= 40

    // Package Summary
    drawText("Package Summary:", 60, yPosition, 12, firstPage, boldFont)
    yPosition -= 25
    drawText(`Destination: ${itineraryData.destination}`, 60, yPosition, 10)
    drawText(`Duration: ${itineraryData.duration}`, 300, yPosition, 10)
    yPosition -= 20
    drawText(`Travel Dates: ${itineraryData.travelDates}`, 60, yPosition, 10)
    drawText(`Total Cost: ${itineraryData.totalCost}`, 300, yPosition, 10)

    yPosition -= 40

    // Day-wise Itinerary
    drawText("Detailed Itinerary:", 60, yPosition, 12, firstPage, boldFont)
    yPosition -= 30

    for (let day = 1; day <= itineraryData.totalDays; day++) {
      const activities = dayWiseActivities[day] || []

      if (activities.length > 0) {
        // Check if we need a new page
        if (yPosition < 150) {
          const newPage = pdfDoc.addPage()
          const { height: newHeight } = newPage.getSize()
          yPosition = newHeight - 50
          firstPage = newPage
        }

        drawText(`Day ${day}:`, 60, yPosition, 11, firstPage, boldFont)
        yPosition -= 20

        activities.forEach((activity, ) => {
          if (yPosition < 100) {
            const newPage = pdfDoc.addPage()
            const { height: newHeight } = newPage.getSize()
            yPosition = newHeight - 50
            firstPage = newPage
          }

          drawText(`${activity.time} - ${activity.activity}`, 80, yPosition, 9)
          yPosition -= 15
          drawText(`${activity.description}`, 100, yPosition, 8)
          yPosition -= 12
          drawText(
            `Transport: ${activity.transport} | Meal: ${activity.meal} | Cost: $${activity.cost}`,
            100,
            yPosition,
            7,
          )
          yPosition -= 20
        })

        yPosition -= 10
      }
    }

    const pdfBytes = await pdfDoc.save()
    console.log("[v0] Enhanced PDF generated successfully, size:", pdfBytes.length)

    const generatedPdfsDir = path.join(process.cwd(), "public", "generated-pdfs")

    // Ensure the generated-pdfs directory exists
    try {
      await fs.access(generatedPdfsDir)
    } catch {
      await fs.mkdir(generatedPdfsDir, { recursive: true })
      console.log("[v0] Created generated-pdfs directory")
    }

    // Save the PDF file
    const pdfFileName = `itinerary-${itineraryId}-${Date.now()}.pdf`
    const pdfFilePath = path.join(generatedPdfsDir, pdfFileName)
    await fs.writeFile(pdfFilePath, pdfBytes)
    console.log("[v0] PDF saved to:", pdfFilePath)

    // Return JSON response with PDF URL
    const pdfUrl = `/generated-pdfs/${pdfFileName}`
    return NextResponse.json({
      success: true,
      message: "PDF generated successfully",
      pdfUrl: pdfUrl,
      filename: pdfFileName,
    })
  } catch (error) {
    console.error("[v0] Error generating PDF:", error)
    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Please use POST method to generate itinerary PDF",
    example: 'curl -X POST /api/generate-pdf -d \'{"enquiryId":"123","itineraryId":"456","formData":{}}\'',
    templateRequired: "lib/itinerary.pdf",
    csvData: "public/itinerary/[EVER001|GOA001|KASH001|KER001|RAJ001|THAI001].csv",
  })
}
