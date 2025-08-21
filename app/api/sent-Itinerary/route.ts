import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { emailService } from "@/lib/email"


const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  console.log("🚀 === EMAIL API CALLED ===")
  console.log("⏰ Timestamp:", new Date().toISOString())

  try {
    // Log environment check first
    console.log("🔧 Environment Check:")
    console.log("- NODE_ENV:", process.env.NODE_ENV)
    console.log("- SMTP_HOST:", process.env.SMTP_HOST ? "✅ Set" : "❌ Missing")
    console.log("- SMTP_USER:", process.env.SMTP_USER ? "✅ Set" : "❌ Missing")
    console.log("- SMTP_PASSWORD:", process.env.SMTP_PASSWORD ? "✅ Set" : "❌ Missing")
    console.log("- SMTP_FROM:", process.env.SMTP_FROM ? "✅ Set" : "❌ Missing")
    console.log("- DATABASE_URL:", process.env.DATABASE_URL ? "✅ Set" : "❌ Missing")

    // Check if required env vars are present
    const requiredEnvVars = ["SMTP_HOST", "SMTP_USER", "SMTP_PASSWORD", "SMTP_FROM"]
    const missingEnvVars = requiredEnvVars.filter((varName) => !process.env[varName])

    if (missingEnvVars.length > 0) {
      console.error("❌ CRITICAL: Missing environment variables:", missingEnvVars)
      return NextResponse.json(
        {
          error: `Server configuration error: Missing ${missingEnvVars.join(", ")}`,
          details: "Please check your .env file configuration",
          missingVars: missingEnvVars,
        },
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    // Parse request body with error handling
    console.log("📥 Parsing request body...")
    let body
    try {
      body = await request.json()
    } catch (parseError) {
      console.error("❌ Failed to parse request body:", parseError)
      return NextResponse.json(
        {
          error: "Invalid JSON in request body",
          details: "Please check the request format"
        },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    console.log("📋 Request body:", JSON.stringify(body, null, 2))

    const {
      customerId,
      itineraryId,
      customerName,
      email,
      whatsappNumber,
      notes,
      documentUrl,
      documentName,
      enquiryId,
    } = body

    // Detailed validation
    console.log("✅ Validating input data...")

    if (!customerName?.trim()) {
      console.error("❌ Validation failed: Customer name missing")
      return NextResponse.json(
        {
          error: "Customer name is required",
          field: "customerName",
        },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    if (!email?.trim()) {
      console.error("❌ Validation failed: Email missing")
      return NextResponse.json(
        {
          error: "Email is required",
          field: "email",
        },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.error("❌ Validation failed: Invalid email format:", email)
      return NextResponse.json(
        {
          error: "Invalid email format",
          field: "email",
          value: email,
        },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    if (!itineraryId && !customerId) {
      console.error("❌ Validation failed: No ID provided")
      return NextResponse.json(
        {
          error: "Either itinerary ID or customer ID is required",
          provided: { itineraryId, customerId },
        },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    console.log("✅ Input validation passed")

    // Test database connection
    console.log("🔗 Testing database connection...")
    try {
      await prisma.$connect()
      console.log("✅ Database connected successfully")
    } catch (dbError) {
      console.error("❌ Database connection failed:", dbError)
      return NextResponse.json(
        {
          error: "Database connection failed",
          details: dbError instanceof Error ? dbError.message : String(dbError),
        },
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    // Fetch itinerary
    console.log("🔍 Fetching itinerary data...")
    let itinerary = null

    if (itineraryId) {
      console.log("📋 Searching by itinerary ID:", itineraryId)
      itinerary = await prisma.itineraries.findUnique({
        where: { id: itineraryId },
        include: {
          enquiry: {
            select: {
              id: true,
              name: true,
              locations: true,
              estimatedDates: true,
              budget: true,
              currency: true,
            },
          },
        },
      })
    } else if (customerId) {
      console.log("📋 Searching by customer ID:", customerId)
      itinerary = await prisma.itineraries.findFirst({
        where: {
          OR: [{ customerId: customerId }, { enquiryId: customerId }],
        },
        include: {
          enquiry: {
            select: {
              id: true,
              name: true,
              locations: true,
              estimatedDates: true,
              budget: true,
              currency: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      })
    }

    if (!itinerary) {
      console.error("❌ No itinerary found")
      return NextResponse.json(
        {
          error: "No itinerary found",
          searchCriteria: { itineraryId, customerId },
        },
        { 
          status: 404,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    console.log("✅ Found itinerary:", {
      id: itinerary.id,
      hasPDF: !!itinerary.pdfUrl,
      pdfUrl: itinerary.pdfUrl,
    })

    // Check PDF availability
    if (!itinerary.pdfUrl) {
      console.error("❌ PDF not available for itinerary:", itinerary.id)
      return NextResponse.json(
        {
          error: "PDF not available for this itinerary",
          itineraryId: itinerary.id,
          suggestion: "Please generate PDF first",
        },
        { 
          status: 400,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    // Test SMTP before sending
    console.log("📧 Testing SMTP connection...")
    try {
      const connectionTest = await emailService.verifyConnection()
      if (!connectionTest) {
        console.error("❌ SMTP connection test failed")
        return NextResponse.json(
          {
            error: "Email server connection failed",
            details: "Please check SMTP configuration in .env file",
          },
          { 
            status: 500,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        )
      }
      console.log("✅ SMTP connection verified")
    } catch (smtpError) {
      console.error("❌ SMTP test error:", smtpError)
      return NextResponse.json(
        {
          error: "Email configuration error",
          details: smtpError instanceof Error ? smtpError.message : String(smtpError),
        },
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    // Prepare email data
    console.log("📨 Preparing email data...")
    const emailData = {
      customerName: customerName.trim(),
      customerEmail: email.trim(),
      itineraryId: itinerary.id,
      enquiryId: itinerary.enquiryId || enquiryId || null,
      notes: notes?.trim() || null,
      destinations: itinerary.enquiry?.locations || "Your Selected Destinations",
      startDate: itinerary.startDate ? new Date(itinerary.startDate) : null,
      endDate: itinerary.endDate ? new Date(itinerary.endDate) : null,
      budget: itinerary.budget || itinerary.enquiry?.budget || null,
      currency: itinerary.currency || itinerary.enquiry?.currency || "USD",
      pdfUrl: itinerary.pdfUrl,
    }

    console.log("📊 Email data prepared:", {
      customerName: emailData.customerName,
      customerEmail: emailData.customerEmail,
      destinations: emailData.destinations,
      hasPDF: !!emailData.pdfUrl,
      enquiryId: emailData.enquiryId,
    })

    // Send email
    console.log("🚀 Sending email...")
    const emailResult = await emailService.sendItineraryToCustomer(emailData)

    if (!emailResult.success) {
      console.error("❌ Email sending failed:", emailResult.error)
      return NextResponse.json(
        {
          error: `Email sending failed: ${emailResult.error}`,
          emailData: {
            to: emailData.customerEmail,
            subject: `Travel Itinerary - ${emailData.destinations}`,
          },
        },
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    }

    console.log("✅ Email sent successfully:", emailResult.messageId)

    // Save to database
    console.log("💾 Saving sent itinerary record...")
    const sentItinerary = await prisma.sent_itineraries.create({
      data: {
        customerId: customerId || itinerary.enquiryId || "",
        itineraryId: itinerary.id,
        customerName: customerName.trim(),
        email: email.trim(),
        whatsappNumber: whatsappNumber?.trim() || "",
        notes: notes?.trim() || "",
        documentUrl: documentUrl || null,
        documentName: documentName || null,
        status: "sent",
        sentDate: new Date(),
        emailSent: true,
      },
    })

    console.log("✅ Database record created:", sentItinerary.id)

    const response = {
      success: true,
      message: "Itinerary sent successfully via email!",
      messageId: emailResult.messageId,
      sentItinerary: {
        id: sentItinerary.id,
        date: new Date(sentItinerary.sentDate).toLocaleDateString("en-GB").replace(/\//g, " . "),
        customerId: sentItinerary.customerId,
        customerName: sentItinerary.customerName,
        email: sentItinerary.email,
        whatsappNumber: sentItinerary.whatsappNumber,
        notes: sentItinerary.notes,
        documents: sentItinerary.documentUrl ? "Download" : "",
        status: sentItinerary.status,
        documentUrl: sentItinerary.documentUrl,
        documentName: sentItinerary.documentName,
        sentDate: sentItinerary.sentDate.toISOString(),
        itineraryId: sentItinerary.itineraryId,
      },
      timestamp: new Date().toISOString(),
    }

    console.log("🎉 === EMAIL API SUCCESS ===")
    console.log("📧 Final response:", JSON.stringify(response, null, 2))

    return NextResponse.json(response, {
      headers: {
        'Content-Type': 'application/json'
      }
    })

  } catch (error) {
    console.error("💥 === EMAIL API CRITICAL ERROR ===")
    console.error("⏰ Error timestamp:", new Date().toISOString())
    console.error("🔥 Error details:", error)

    if (error instanceof Error) {
      console.error("📛 Error name:", error.name)
      console.error("📛 Error message:", error.message)
      console.error("📛 Error stack:", error.stack)
    }

    // Categorize error types
    let errorCategory = "UNKNOWN_ERROR"
    let userFriendlyMessage = "An unexpected error occurred"

    if (error instanceof Error) {
      const msg = error.message.toLowerCase()

      if (msg.includes("prisma") || msg.includes("database")) {
        errorCategory = "DATABASE_ERROR"
        userFriendlyMessage = "Database connection or query failed"
      } else if (msg.includes("smtp") || msg.includes("email") || msg.includes("nodemailer")) {
        errorCategory = "EMAIL_ERROR"
        userFriendlyMessage = "Email service configuration or sending failed"
      } else if (msg.includes("json") || msg.includes("parse")) {
        errorCategory = "DATA_PARSING_ERROR"
        userFriendlyMessage = "Invalid data format received"
      } else if (msg.includes("fetch") || msg.includes("network")) {
        errorCategory = "NETWORK_ERROR"
        userFriendlyMessage = "Network or external service error"
      }
    }

    const errorResponse = {
      error: userFriendlyMessage,
      category: errorCategory,
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString(),
    }

    console.log("📤 Error response being sent:", JSON.stringify(errorResponse, null, 2))

    return NextResponse.json(errorResponse, { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } finally {
    // Always disconnect Prisma
    console.log("🔌 Disconnecting from database...")
    await prisma.$disconnect()
    console.log("✅ Database disconnected")
  }
}

// Remove the duplicate transporter creation and handler function at the bottom
// since you're already using the emailService from lib/email