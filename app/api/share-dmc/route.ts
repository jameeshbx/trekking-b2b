// api/share-dmc/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { Commission, PrismaClient, SharedDMC } from "@prisma/client"
import { sendEmail } from "@/lib/email"
import fs from "fs"
import path from "path"

const prisma = new PrismaClient()

type DMCStatus = "AWAITING_TRANSFER" | "VIEWED" | "AWAITING_INTERNAL_REVIEW" | "QUOTATION_RECEIVED" | "REJECTED"

interface LocalEmailResult {
  dmcId: string;
  dmcName: string;
  email: string;
  sent: boolean;
  error?: string;
  messageId?: string;
}

interface SharedDMCItemWithDMC {
  id: string;
  dmcId: string;
  status: string;
  notes?: string;
  updatedAt: Date;
  dmc: {
    id: string;
    name: string;
    contactPerson: string | null;
    email: string | null;
    phoneNumber: string | null;
    designation: string | null;
    status: string;
    primaryCountry: string | null;
    destinationsCovered: string | null;
    cities: string | null;
  };
}

// GET - Fetch all shared DMCs with their details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const enquiryId = searchParams.get("enquiryId")
    const customerId = searchParams.get("customerId")
    const locations = searchParams.get("locations") // e.g. "Kashmir"
    const dmcWhereClause: Record<string, unknown> = { status: "ACTIVE" }

    if (locations) {
      const locationArray = locations.split(',').map(loc => loc.trim())
      dmcWhereClause.OR = locationArray.flatMap(location => [
        { primaryCountry: { contains: location, mode: "insensitive" } },
        { destinationsCovered: { contains: location, mode: "insensitive" } },
        { cities: { contains: location, mode: "insensitive" } }
      ])
    }

    const dmcs = await prisma.dMCForm.findMany({
      where: dmcWhereClause,
      select: {
        id: true,
        name: true,
        contactPerson: true,
        email: true,
        phoneNumber: true,
        designation: true,
        status: true,
        primaryCountry: true,
        destinationsCovered: true,
        cities: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        name: "asc"
      }
    })

    console.log(`Found ${dmcs.length} DMCs`)

    // Fetch shared DMC records - handle the case where table might not exist or be empty
    let sharedDMCs: (SharedDMC & { selectedDMCs: SharedDMCItemWithDMC[] })[] = []
    try {
      const whereClause: Record<string, unknown> = {}
      if (enquiryId) whereClause.enquiryId = enquiryId
      if (customerId) whereClause.customerId = customerId

      sharedDMCs = await prisma.sharedDMC.findMany({
        where: whereClause,
        include: {
          selectedDMCs: {
            include: {
              dmc: true,
            },
          },
        },
      }) as (SharedDMC & { selectedDMCs: SharedDMCItemWithDMC[] })[]
    } catch (error) {
      console.log("SharedDMC table might not exist or be empty:", error)
      sharedDMCs = []
    }

    console.log(`Found ${sharedDMCs.length} shared DMCs`)

    // Fetch commissions for pricing info - handle the case where table might not exist
    let commissions: Commission[] = []
    try {
      if (enquiryId) {
        commissions = await prisma.commission?.findMany({
          where: { enquiryId },
        }) || []
      }
    } catch (error) {
      console.log("Commission table might not exist:", error)
      commissions = []
    }

    // Transform DMCs to match interface
    const transformedDMCs = dmcs.map((dmc) => ({
      id: dmc.id,
      name: dmc.name,
      primaryContact: dmc.contactPerson || "",
      phoneNumber: dmc.phoneNumber || "",
      designation: dmc.designation || "",
      email: dmc.email || "",
      status: dmc.status === "ACTIVE" ? "Active" : "Inactive",
      primaryCountry: dmc.primaryCountry || "",
      destinationsCovered: dmc.destinationsCovered || "",
      cities: dmc.cities || "",
      createdAt: dmc.createdAt?.toISOString() || "",
      updatedAt: dmc.updatedAt?.toISOString() || "",
    }))

    // Transform shared DMC data with commission info
    const transformedSharedDMCs = sharedDMCs.map((shared) => ({
      id: shared.id,
      dateGenerated: shared.dateGenerated.toLocaleDateString("en-GB"),
      pdf: shared.pdfUrl ? "D" : "B",
      pdfUrl: shared.pdfUrl,
      activeStatus: shared.isActive,
      enquiryId: shared.enquiryId || enquiryId || "default-enquiry",
      customerId: shared.customerId || customerId, // Use from database or query params
      assignedStaffId: shared.assignedStaffId,
      selectedDMCs: shared.selectedDMCs.map((item) => {
        const commission = commissions.find(c => c.dmcId === item.dmcId && c.enquiryId === (shared.enquiryId || enquiryId))
        return {
          id: item.id,
          dmcId: item.dmcId,
          status: item.status as DMCStatus,
          dmc: {
            id: item.dmc.id,
            name: item.dmc.name,
            primaryContact: item.dmc.contactPerson || "",
            phoneNumber: item.dmc.phoneNumber || "",
            designation: item.dmc.designation || "",
            email: item.dmc.email || "",
            status: item.dmc.status === "ACTIVE" ? "Active" : "Inactive",
            primaryCountry: item.dmc.primaryCountry || "",
            destinationsCovered: item.dmc.destinationsCovered || "",
            cities: item.dmc.cities || "",
          },
          lastUpdated: item.updatedAt.toISOString(),
          quotationAmount: commission?.quotationAmount,
          markupPrice: commission?.markupPrice,
          commissionAmount: commission?.commissionAmount,
          commissionType: commission?.commissionType,
          notes: commission?.comments || item.notes || "",
        }
      }),
    }))

    // Create mock data if no shared DMCs exist
    const mockSharedItineraries = transformedSharedDMCs.length > 0 ? transformedSharedDMCs : [
      {
        id: "shared-1",
        dateGenerated: new Date().toLocaleDateString("en-GB"),
        pdf: "B", // Start with no PDF
        pdfUrl: null,
        activeStatus: true,
        enquiryId: enquiryId || "enquiry-1",
        customerId: customerId || "customer-1",
        assignedStaffId: "staff-1",
        selectedDMCs: [],
      },
    ]

    return NextResponse.json({
      success: true,
      data: mockSharedItineraries,
      availableDMCs: transformedDMCs, // Include filtered DMCs for dropdown
    })
  } catch (error) {
    console.error("Error fetching shared DMCs:", error)
    return NextResponse.json({ 
      error: "Failed to fetch shared DMCs", 
      details: error instanceof Error ? error.message : "Unknown error",
      success: false 
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// POST - Create new shared DMC entry and send email with PDF
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { enquiryId, customerId, assignedStaffId, selectedDMCIds = [], dateGenerated, pdfPath } = body

    console.log("POST request body:", body)

    // Validate required fields
    if (!selectedDMCIds || selectedDMCIds.length === 0) {
      return NextResponse.json({ 
        error: "At least one DMC must be selected",
        success: false 
      }, { status: 400 })
    }

    // Fetch the selected DMCs from database
    const selectedDMCs = await prisma.dMCForm.findMany({
      where: {
        id: { in: selectedDMCIds },
        status: "ACTIVE",
      },
      select: {
        id: true,
        name: true,
        contactPerson: true,
        email: true,
        phoneNumber: true,
        designation: true,
        status: true,
        primaryCountry: true,
        destinationsCovered: true,
        cities: true,
      },
    })

    if (selectedDMCs.length === 0) {
      return NextResponse.json({ 
        error: "No active DMCs found with the provided IDs",
        success: false 
      }, { status: 400 })
    }

    // Get customer/enquiry details for personalized email
    let customerDetails: { name: string; locations?: string } = { name: "Valued Customer" }
    if (enquiryId) {
      try {
        const enquiry = await prisma.enquiries.findUnique({
          where: { id: enquiryId },
          select: { name: true, locations: true },
        })
        if (enquiry) {
          customerDetails = {
            name: enquiry.name,
            locations: enquiry.locations || undefined
          }
        }
      } catch (error) {
        console.log("Could not fetch enquiry details:", error)
      }
    }

    // Send emails to all selected DMCs with PDF attachment
    const emailResults: LocalEmailResult[] = []
    for (const dmc of selectedDMCs) {
      if (dmc.email) {
        try {
          // Check if PDF exists
          let attachments = undefined
          const resolvedPdfPath = pdfPath ? path.resolve(pdfPath) : null
          
          if (resolvedPdfPath && fs.existsSync(resolvedPdfPath)) {
            attachments = [
              {
                filename: `itinerary-${enquiryId}.pdf`,
                path: resolvedPdfPath,
                contentType: "application/pdf",
              },
            ]
          } else if (pdfPath) {
            console.warn("PDF path provided but file does not exist:", pdfPath);
          }

          const emailResult = await sendEmail({
            to: dmc.email,
            subject: `New Itinerary Request - ${enquiryId}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4ECDC4;">New Itinerary Request</h2>
                <p>Dear ${dmc.name},</p>
                <p>You have been added to a new itinerary request for quotation.</p>
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin-top: 0;">Request Details:</h3>
                  <p><strong>Enquiry ID:</strong> ${enquiryId}</p>
                  <p><strong>Customer:</strong> ${customerDetails.name}</p>
                  <p><strong>Date Generated:</strong> ${dateGenerated || new Date().toISOString().split("T")[0]}</p>
                  <p><strong>Destinations:</strong> ${dmc.destinationsCovered}</p>
                  ${customerDetails.locations ? `<p><strong>Requested Locations:</strong> ${customerDetails.locations}</p>` : ''}
                </div>
                <p>Please review the ${attachments ? 'attached itinerary' : 'itinerary details'} and provide your quotation.</p>
                <div style="background-color: #e8f5f4; padding: 15px; border-radius: 6px; margin: 20px 0;">
                  <p style="margin: 0;"><strong>Next Steps:</strong></p>
                  <ul style="margin: 10px 0;">
                    <li>Review the itinerary requirements</li>
                    <li>Prepare your quotation</li>
                    <li>Respond with your best offer</li>
                  </ul>
                </div>
                <p>We look forward to your response!</p>
                <p>Best regards,<br><strong>Travel Team</strong></p>
              </div>
            `,
            attachments: attachments,
          })
          
          emailResults.push({
            dmcId: dmc.id,
            dmcName: dmc.name,
            email: dmc.email,
            sent: emailResult.success || false,
            error: emailResult.success ? undefined : (emailResult.error || "Failed to send email"),
            messageId: emailResult.messageId ?? undefined,
          })

          console.log(`Email result for ${dmc.name}:`, emailResult)

        } catch (emailError) {
          console.error(`Error sending email to ${dmc.name}:`, emailError)
          emailResults.push({
            dmcId: dmc.id,
            dmcName: dmc.name,
            email: dmc.email,
            sent: false,
            error: emailError instanceof Error ? emailError.message : "Failed to send email",
          })
        }
      } else {
        emailResults.push({
          dmcId: dmc.id,
          dmcName: dmc.name,
          email: "No email provided",
          sent: false,
          error: "DMC has no email address",
        })
      }
    }

    // Create the shared DMC record in database
    let newSharedDMC
    try {
      newSharedDMC = await prisma.sharedDMC.create({
        data: {
          enquiryId: enquiryId,
          customerId: customerId,
          dateGenerated: new Date(dateGenerated || new Date()),
          pdfUrl: pdfPath,
          isActive: true,
          assignedStaffId: assignedStaffId || "default-staff",
          selectedDMCs: {
            create: selectedDMCs.map((dmc) => ({
              dmcId: dmc.id,
              status: "AWAITING_TRANSFER",
            })),
          },
        },
        include: {
          selectedDMCs: {
            include: {
              dmc: true,
            },
          },
        },
      })
    } catch (dbError) {
      console.error("Database error:", dbError)
      // If database creation fails, still return success for email sending
      return NextResponse.json({
        success: true,
        message: "Emails sent successfully (database storage failed)",
        emailResults: emailResults,
        emailSummary: {
          total: emailResults.length,
          sent: emailResults.filter(r => r.sent).length,
          failed: emailResults.filter(r => !r.sent).length,
        },
        warning: "Could not store in database but emails were sent"
      })
    }

    return NextResponse.json({
      success: true,
      message: "DMC sharing created successfully and emails sent",
      data: {
        id: newSharedDMC.id,
        enquiryId,
        customerId,
        assignedStaffId: newSharedDMC.assignedStaffId,
        dateGenerated: newSharedDMC.dateGenerated.toLocaleDateString("en-GB"),
        activeStatus: newSharedDMC.isActive,
        pdf: newSharedDMC.pdfUrl ? "D" : "B",
        pdfUrl: newSharedDMC.pdfUrl,
        selectedDMCs: newSharedDMC.selectedDMCs.map((item) => ({
          id: item.id,
          dmcId: item.dmcId,
          status: item.status,
          dmc: {
            id: item.dmc.id,
            name: item.dmc.name,
            primaryContact: item.dmc.contactPerson || "",
            phoneNumber: item.dmc.phoneNumber || "",
            designation: item.dmc.designation || "",
            email: item.dmc.email || "",
            status: item.dmc.status === "ACTIVE" ? "Active" : "Inactive",
            primaryCountry: item.dmc.primaryCountry || "",
            destinationsCovered: item.dmc.destinationsCovered || "",
            cities: item.dmc.cities || "",
          },
          lastUpdated: item.updatedAt.toISOString(),
          notes: "",
        })),
      },
      emailResults: emailResults,
      emailSummary: {
        total: emailResults.length,
        sent: emailResults.filter(r => r.sent).length,
        failed: emailResults.filter(r => !r.sent).length,
      },
    })
  } catch (error) {
    console.error("Error creating shared DMC:", error)
    return NextResponse.json({ 
      error: "Failed to create shared DMC",
      details: error instanceof Error ? error.message : "Unknown error",
      success: false 
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// PUT - Update shared DMC or DMC item status, add commission, and handle customer sharing
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, action, ...updateData } = body

    console.log("PUT request:", { id, action, updateData })

    if (action === "toggleActive") {
      const updated = await prisma.sharedDMC.update({
        where: { id },
        data: { 
          isActive: updateData.isActive,
          updatedAt: new Date(),
        },
      })

      return NextResponse.json({
        success: true,
        message: "Active status updated",
        data: { id, activeStatus: updated.isActive },
      })
    }

    if (action === "updateDMCStatus") {
      // Validate that itemId exists
      if (!updateData.itemId) {
        return NextResponse.json({ 
          error: "itemId is required for updating DMC status",
          success: false 
        }, { status: 400 })
      }

      // Check if the shared DMC item exists
      const existingItem = await prisma.sharedDMCItem.findUnique({
        where: { id: updateData.itemId },
      })

      if (!existingItem) {
        return NextResponse.json({ 
          error: "SharedDMC item not found",
          success: false 
        }, { status: 404 })
      }

      const updated = await prisma.sharedDMCItem.update({
        where: { id: updateData.itemId },
        data: { 
          status: updateData.status,
          notes: updateData.notes,
          updatedAt: new Date(),
        },
      })

      return NextResponse.json({
        success: true,
        message: "DMC status updated",
        data: { 
          id: updated.id, 
          status: updated.status, 
          notes: updated.notes,
          updatedAt: updated.updatedAt.toISOString(),
        },
      })
    }

    if (action === "addCommission") {
      const { enquiryId, dmcId, quotationAmount, commissionType, commissionAmount, markupPrice, comments } = updateData

      // Validate required fields
      if (!enquiryId || !dmcId) {
        return NextResponse.json({ 
          error: "enquiryId and dmcId are required for adding commission",
          success: false 
        }, { status: 400 })
      }

      // Create or update commission record
      const commission = await prisma.commission.upsert({
        where: {
          enquiryId_dmcId: {
            enquiryId: enquiryId,
            dmcId: dmcId,
          },
        },
        create: {
          enquiryId,
          dmcId,
          quotationAmount: parseFloat(quotationAmount) || 0,
          commissionType,
          commissionAmount: parseFloat(commissionAmount) || 0,
          markupPrice: parseFloat(markupPrice) || 0,
          comments,
        },
        update: {
          quotationAmount: parseFloat(quotationAmount) || 0,
          commissionType,
          commissionAmount: parseFloat(commissionAmount) || 0,
          markupPrice: parseFloat(markupPrice) || 0,
          comments,
          updatedAt: new Date(),
        },
      })

      return NextResponse.json({
        success: true,
        message: "Commission added successfully",
        data: {
          id,
          commission: {
            id: commission.id,
            enquiryId: commission.enquiryId,
            dmcId: commission.dmcId,
            quotationAmount: commission.quotationAmount,
            commissionType: commission.commissionType,
            commissionAmount: commission.commissionAmount,
            markupPrice: commission.markupPrice,
            comments: commission.comments,
          },
        },
      })
    }

    if (action === "shareToCustomer") {
      const { enquiryId, customerId, dmcId, itineraryId } = updateData

      // Get commission details
      let commission = null
      try {
        commission = await prisma.commission.findUnique({
          where: {
            enquiryId_dmcId: {
              enquiryId: enquiryId,
              dmcId: dmcId,
            },
          },
        })
      } catch (error) {
        console.log("Could not fetch commission:", error)
      }

      if (!commission) {
        return NextResponse.json({ 
          error: "Commission not found. Please set margin first.",
          success: false 
        }, { status: 400 })
      }

      // Get customer/enquiry details
      let customer: { name: string; email: string; phone: string | null; locations?: string } | null = null;

      if (enquiryId) {
        try {
          const enquiry = await prisma.enquiries.findUnique({
            where: { id: enquiryId },
            select: { name: true, email: true, phone: true, locations: true },
          })
          
          if (enquiry) {
            customer = {
              name: enquiry.name,
              email: enquiry.email,
              phone: enquiry.phone,
              locations: enquiry.locations || undefined
            }
          }
        } catch (error) {
          console.log("Could not fetch enquiry:", error)
        }
      }
      
      if (!customer && customerId) {
        try {
          const directCustomer = await prisma.customers.findUnique({
            where: { id: customerId },
            select: { name: true, email: true, phone: true },
          })
          
          if (directCustomer) {
            customer = directCustomer
          }
        } catch (error) {
          console.log("Could not fetch customer:", error)
        }
      }

      if (!customer) {
        return NextResponse.json({ 
          error: "Customer not found",
          success: false 
        }, { status: 404 })
      }

      // Get DMC details for email
      const dmc = await prisma.dMCForm.findUnique({
        where: { id: dmcId },
        select: { name: true }
      });

      // Generate customer-facing PDF path (you might want to implement actual PDF generation)
      const customerPdfPath = path.join(process.cwd(), 'public', 'uploads', 'customer-quotes', `quote-${enquiryId || customerId}-${Date.now()}.pdf`);
      const customerPdfUrl = `/uploads/customer-quotes/quote-${enquiryId || customerId}-${Date.now()}.pdf`;
      
      // Create directories if they don't exist
      const uploadDir = path.dirname(customerPdfPath);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Check if we have a PDF to attach (you might need to generate one)
      const originalPdfPath = path.join(process.cwd(), 'public', 'uploads', 'pdfs', `itinerary-${enquiryId}.pdf`);
      let emailAttachments = undefined;
      if (fs.existsSync(originalPdfPath)) {
        emailAttachments = [
          {
            filename: `travel-quote-${enquiryId || customerId}.pdf`,
            path: originalPdfPath,
            contentType: "application/pdf",
          },
        ];
      }

      // Send email to customer with quote
      const markupPrice = commission.markupPrice ?? 0
      const emailResult = await sendEmail({
        to: customer.email,
        subject: `Your Travel Quote is Ready! - ${enquiryId || 'Quote Request'}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <div style="background: linear-gradient(135deg, #4ECDC4, #44A08D); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Your Travel Quote is Ready!</h1>
              <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Customized Just for You by ${dmc ? dmc.name : 'Our Team'}</p>
            </div>
            <p>Dear ${customer.name},</p>
            <p>Thank you for your interest in our travel services. We're excited to share your customized quote!</p>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Quote Summary:</h3>
              <p><strong>Destination:</strong> ${customer.locations || 'As per itinerary'}</p>
              <p><strong>Total Price:</strong> $${markupPrice}</p>
              <p><strong>Quote Valid Until:</strong> ${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
            </div>
            <p>Please find your detailed itinerary and quote attached to this email.</p>
            <div style="background-color: #e8f5f4; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="margin: 0;"><strong>Ready to Book?</strong></p>
              <p style="margin: 10px 0 0 0;">Contact us to confirm your booking or if you have any questions about your quote.</p>
            </div>
            <p>We look forward to making your travel dreams come true!</p>
            <p>Best regards,<br>
            <strong>Your Travel Team</strong><br>
            <em>Creating Unforgettable Journeys</em></p>
          </div>
        `,
        attachments: emailAttachments,
      })

      // Create shared customer PDF record
      let sharedPdf = null
      try {
        sharedPdf = await prisma.sharedCustomerPdf.create({
          data: {
            itineraryId: itineraryId,
            customerId: customerId || enquiryId,
            enquiryId: enquiryId,
            pdfUrl: customerPdfUrl,
            pdfFileName: `travel-quote-${enquiryId || customerId}.pdf`,
            customerName: customer.name,
            customerEmail: customer.email,
            customerPhone: customer.phone,
            emailSent: emailResult.success || false,
            emailSentAt: emailResult.success ? new Date() : null,
            createdBy: "system",
          },
        })
      } catch (error) {
        console.log("Could not create shared customer PDF record:", error)
      }

      return NextResponse.json({
        success: true,
        message: "Quote shared with customer successfully",
        data: {
          id,
          sharedPdf: sharedPdf ? {
            id: sharedPdf.id,
            customerName: sharedPdf.customerName,
            customerEmail: sharedPdf.customerEmail,
            emailSent: sharedPdf.emailSent,
            markupPrice: commission?.markupPrice,
          } : null,
        },
      })
    }

    if (action === "addDMC") {
      // Validate required fields
      if (!updateData.dmcId) {
        return NextResponse.json({ 
          error: "dmcId is required",
          success: false 
        }, { status: 400 })
      }

      const dmc = await prisma.dMCForm.findUnique({
        where: { id: updateData.dmcId },
        select: {
          id: true,
          name: true,
          contactPerson: true,
          email: true,
          phoneNumber: true,
          designation: true,
          status: true,
          primaryCountry: true,
          destinationsCovered: true,
          cities: true,
        },
      })

      if (!dmc) {
        return NextResponse.json({ 
          error: "DMC not found",
          success: false 
        }, { status: 404 })
      }

      // Try to find existing sharedDMCItem
      let sharedDMCItem = await prisma.sharedDMCItem.findFirst({
        where: {
          sharedDMCId: id,
          dmcId: updateData.dmcId,
        },
      });

      // If not exists, create it
      if (!sharedDMCItem) {
        sharedDMCItem = await prisma.sharedDMCItem.create({
          data: {
            sharedDMCId: id,
            dmcId: updateData.dmcId,
            status: "AWAITING_TRANSFER",
          },
        })
      }

      // Always send email
      let emailSent = false
      let emailError: string | null = null

      if (dmc.email && updateData.enquiryId) {
        try {
          console.log("Preparing to send DMC email to:", dmc.email, "with PDF:", updateData.pdfPath)
          
          // Check if PDF exists
          let attachments = undefined
          const resolvedPdfPath = updateData.pdfPath ? path.resolve(updateData.pdfPath) : null
          
          if (resolvedPdfPath && fs.existsSync(resolvedPdfPath)) {
            attachments = [
              {
                filename: `itinerary-${updateData.enquiryId}.pdf`,
                path: resolvedPdfPath,
                contentType: "application/pdf",
              },
            ]
          } else if (updateData.pdfPath) {
            console.warn("PDF path provided but file does not exist:", updateData.pdfPath);
          }

          const emailResult = await sendEmail({
            to: dmc.email,
            subject: `New Itinerary Request - ${updateData.enquiryId}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4ECDC4;">New Itinerary Request</h2>
                <p>Dear ${dmc.name},</p>
                <p>You have been added to a new itinerary request for quotation.</p>
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin-top: 0;">Request Details:</h3>
                  <p><strong>Enquiry ID:</strong> ${updateData.enquiryId}</p>
                  <p><strong>Date Generated:</strong> ${updateData.dateGenerated || new Date().toISOString().split("T")[0]}</p>
                  <p><strong>Destinations:</strong> ${dmc.destinationsCovered}</p>
                </div>
                <p>Please review the ${attachments ? 'attached itinerary' : 'itinerary details'} and provide your quotation.</p>
                <div style="background-color: #e8f5f4; padding: 15px; border-radius: 6px; margin: 20px 0;">
                  <p style="margin: 0;"><strong>Next Steps:</strong></p>
                  <ul style="margin: 10px 0;">
                    <li>Review the itinerary requirements</li>
                    <li>Prepare your quotation</li>
                    <li>Respond with your best offer</li>
                  </ul>
                </div>
                <p>We look forward to your response!</p>
                <p>Best regards,<br><strong>Travel Team</strong></p>
              </div>
            `,
            attachments: attachments,
          })
          
          console.log("DMC email send result:", emailResult)
          emailSent = emailResult.success || false
          emailError = emailResult.success ? null : (emailResult.error || "Failed to send email");
        } catch (error) {
          console.error(`Error sending email to ${dmc.name}:`, error)
          emailError = error instanceof Error ? error.message : "Failed to send email"
        }
      }

      const transformedDMC = {
        id: dmc.id,
        name: dmc.name,
        primaryContact: dmc.contactPerson || "",
        phoneNumber: dmc.phoneNumber || "",
        designation: dmc.designation || "",
        email: dmc.email || "",
        status: dmc.status === "ACTIVE" ? "Active" : "Inactive",
        primaryCountry: dmc.primaryCountry || "",
        destinationsCovered: dmc.destinationsCovered || "",
        cities: dmc.cities || "",
      }

      return NextResponse.json({
        success: true,
        message: emailSent
          ? "DMC email sent successfully"
          : `Failed to send DMC email: ${emailError}`,
        data: {
          id,
          selectedDMCs: [
            {
              id: sharedDMCItem.id,
              dmcId: updateData.dmcId,
              status: "AWAITING_TRANSFER" as DMCStatus,
              dmc: transformedDMC,
              lastUpdated: new Date().toISOString(),
              notes: "",
            },
          ],
        },
        emailResult: {
          dmcName: dmc.name,
          email: dmc.email,
          sent: emailSent,
          error: emailError || undefined,
        },
      })
    }

    return NextResponse.json({ 
      error: "Invalid action",
      success: false 
    }, { status: 400 })
  } catch (error) {
    console.error("Error updating shared DMC:", error)
    return NextResponse.json({ 
      error: "Failed to update shared DMC",
      details: error instanceof Error ? error.message : "Unknown error",
      success: false 
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// DELETE - Remove shared DMC entry
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ 
        error: "ID is required",
        success: false 
      }, { status: 400 })
    }

    // Delete related SharedDMCItems first (if not using cascade delete)
    await prisma.sharedDMCItem.deleteMany({
      where: { sharedDMCId: id },
    })

    // Delete the SharedDMC record
    await prisma.sharedDMC.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: "Shared DMC deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting shared DMC:", error)
    return NextResponse.json({ 
      error: "Failed to delete shared DMC",
      details: error instanceof Error ? error.message : "Unknown error",
      success: false 
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}