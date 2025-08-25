// api/share-dmc/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { sendEmail } from "@/lib/email"

const prisma = new PrismaClient()

interface WhereClause {
  assignedStaffId?: string
  enquiryId?: string
}

type DMCStatus = "AWAITING_TRANSFER" | "VIEWED" | "QUOTATION_RECEIVED"


// GET - Fetch all shared DMCs with their details
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const staffId = searchParams.get("staffId")
    const enquiryId = searchParams.get("enquiryId")

    const whereClause: WhereClause = {}

    if (staffId) {
      whereClause.assignedStaffId = staffId
    }

    if (enquiryId) {
      whereClause.enquiryId = enquiryId
    }

    // Fetch actual DMCs from your existing DMC table
    const dmcs = await prisma.dMCForm.findMany({
      where: { status: "ACTIVE" },
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
    })

    // Fetch shared DMC records
    const sharedDMCs = await prisma.sharedDMC.findMany({
      where: whereClause,
      include: {
        selectedDMCs: {
          include: {
            dmc: true,
          },
        },
      },
    })

    // Fetch commissions for pricing info
    const commissions = await prisma.commission?.findMany({
      where: enquiryId ? { enquiryId } : {},
    }) || []

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
      activeStatus: shared.isActive,
      enquiryId: enquiryId || "default-enquiry",
      assignedStaffId: shared.assignedStaffId,
      selectedDMCs: shared.selectedDMCs.map((item) => {
        const commission = commissions.find(c => c.dmcId === item.dmcId && c.enquiryId === enquiryId)
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
          notes: commission?.comments || "",
        }
      }),
    }))

    // Create mock data if no shared DMCs exist
    const mockSharedItineraries = transformedSharedDMCs.length > 0 ? transformedSharedDMCs : [
      {
        id: "shared-1",
        dateGenerated: "06-03-2025",
        pdf: "D",
        activeStatus: true,
        enquiryId: enquiryId || "enquiry-1",
        customerId: "customer-1",
        assignedStaffId: "staff-1",
        selectedDMCs: transformedDMCs.slice(0, 3).map((dmc, index) => ({
          id: `item-${index + 1}`,
          dmcId: dmc.id,
          status: (["AWAITING_TRANSFER", "VIEWED", "QUOTATION_RECEIVED"] as const)[index] as DMCStatus,
          dmc: dmc,
          lastUpdated: new Date().toISOString(),
          quotationAmount: index === 2 ? 1100 : undefined,
          notes: `Sample notes for ${dmc.name}`,
        })),
      },
    ]

    return NextResponse.json({
      success: true,
      data: mockSharedItineraries,
    })
  } catch (error) {
    console.error("Error fetching shared DMCs:", error)
    return NextResponse.json({ error: "Failed to fetch shared DMCs" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// POST - Create new shared DMC entry and send email with PDF
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { enquiryId, customerId, assignedStaffId, selectedDMCIds = [], dateGenerated, } = body

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

    // Generate PDF for the itinerary (mock implementation)
    const pdfUrl = `/uploads/itineraries/itinerary-${enquiryId}-${Date.now()}.pdf`
    
    // In real implementation, you would generate the PDF here
    // const pdfBuffer = await generateItineraryPDF(enquiryId)
    // Save PDF to file system or cloud storage

    // Send emails to all selected DMCs with PDF attachment
    const emailResults = []
    for (const dmc of selectedDMCs) {
      if (dmc.email) {
        try {
          const emailResult = await sendEmail({
            to: dmc.email,
            subject: `New Itinerary Request - ${enquiryId}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4ECDC4;">New Itinerary Request</h2>
                <p>Dear ${dmc.name},</p>
                <p>You have received a new itinerary request for quotation.</p>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin-top: 0;">Request Details:</h3>
                  <p><strong>Enquiry ID:</strong> ${enquiryId}</p>
                  <p><strong>Date Generated:</strong> ${dateGenerated || new Date().toISOString().split("T")[0]}</p>
                  <p><strong>Destinations:</strong> ${dmc.destinationsCovered}</p>
                </div>

                <p>Please review the attached itinerary document and provide your best quotation.</p>
                
                <div style="background-color: #e8f5f4; padding: 15px; border-radius: 6px; margin: 20px 0;">
                  <p style="margin: 0;"><strong>Next Steps:</strong></p>
                  <ol style="margin: 10px 0 0 20px;">
                    <li>Review the attached itinerary</li>
                    <li>Prepare your detailed quotation</li>
                    <li>Submit your quote through our system</li>
                  </ol>
                </div>

                <p>We look forward to your competitive quotation.</p>
                
                <p>Best regards,<br>
                <strong>Travel Team</strong><br>
                <em>Your Travel Partner</em></p>
              </div>
            `,
            attachments: pdfUrl
              ? [
                  {
                    filename: `itinerary-${enquiryId}.pdf`,
                    path: pdfUrl,
                    contentType: "application/pdf",
                  },
                ]
              : undefined,
          })

          emailResults.push({
            dmcId: dmc.id,
            dmcName: dmc.name,
            email: dmc.email,
            sent: emailResult.success,
            error: emailResult.success ? null : "Failed to send email",
          })
        } catch (emailError) {
          console.error(`Error sending email to ${dmc.name} (${dmc.email}):`, emailError)
          emailResults.push({
            dmcId: dmc.id,
            dmcName: dmc.name,
            email: dmc.email,
            sent: false,
            error: emailError instanceof Error ? emailError.message : "Unknown email error",
          })
        }
      }
    }

    // Create the shared DMC record in database
    const newSharedDMC = await prisma.sharedDMC.create({
      data: {
        dateGenerated: new Date(dateGenerated || new Date()),
        pdfUrl: pdfUrl,
        isActive: true,
        assignedStaffId: assignedStaffId,
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

    return NextResponse.json({
      success: true,
      message: "DMC sharing created successfully and emails sent",
      data: {
        id: newSharedDMC.id,
        enquiryId,
        customerId,
        assignedStaffId,
        dateGenerated: newSharedDMC.dateGenerated.toLocaleDateString("en-GB"),
        activeStatus: newSharedDMC.isActive,
        pdf: "D",
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
    })
  } catch (error) {
    console.error("Error creating shared DMC:", error)
    return NextResponse.json({ error: "Failed to create shared DMC" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

// PUT - Update shared DMC or DMC item status, add commission, and handle customer sharing
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, action, ...updateData } = body

    if (action === "toggleActive") {
      const updated = await prisma.sharedDMC.update({
        where: { id },
        data: { isActive: updateData.isActive },
      })

      return NextResponse.json({
        success: true,
        message: "Active status updated",
        data: { id, activeStatus: updated.isActive },
      })
    }

    if (action === "updateDMCStatus") {
      const updated = await prisma.sharedDMCItem.update({
        where: { id: updateData.itemId },
        data: { status: updateData.status },
      })

      return NextResponse.json({
        success: true,
        message: "DMC status updated",
        data: { id, status: updated.status, notes: updateData.notes },
      })
    }

    if (action === "addCommission") {
      const { enquiryId, dmcId, quotationAmount, commissionType, commissionAmount, markupPrice, comments } = updateData

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
          quotationAmount,
          commissionType,
          commissionAmount,
          markupPrice,
          comments,
        },
        update: {
          quotationAmount,
          commissionType,
          commissionAmount,
          markupPrice,
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
      const commission = await prisma.commission.findUnique({
        where: {
          enquiryId_dmcId: {
            enquiryId: enquiryId,
            dmcId: dmcId,
          },
        },
      })

      // Get customer/enquiry details
      let customer: { name: string; email: string; phone: string | null; locations?: string } | null = null;
      

 if (enquiryId) {
  const enquiry = await prisma.enquiries.findUnique({
    where: { id: enquiryId },
    select: { name: true, email: true, phone: true, locations: true },
  })
  
  if (enquiry) {
    customer = {
      name: enquiry.name,
      email: enquiry.email,
      phone: enquiry.phone,
      locations: enquiry.locations || undefined // Convert null to undefined
    };
   
  }
} 
  
  if (!customer && customerId) {
    const directCustomer = await prisma.customers.findUnique({
      where: { id: customerId },
      select: { name: true, email: true, phone: true },
    })
    
    if (directCustomer) {
      customer = directCustomer;
     
    }
  }


      if (!customer) {
        return NextResponse.json({ error: "Customer not found" }, { status: 404 })
      }

      // Generate customer-facing PDF with pricing
      const customerPdfUrl = `/uploads/customer-quotes/quote-${enquiryId || customerId}-${Date.now()}.pdf`
      
      // Send email to customer with quote
      const emailResult = await sendEmail({
        to: customer.email,
        subject: `Your Travel Quote - ${enquiryId || 'Quote Request'}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #4ECDC4;">Your Travel Quote is Ready!</h2>
            <p>Dear ${customer.name},</p>
            <p>Thank you for your interest in our travel services. We're excited to share your customized quote!</p>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Quote Summary:</h3>
              <p><strong>Destination:</strong> ${customer.locations || 'As per itinerary'}</p>
              <p><strong>Total Price:</strong> $${commission?.markupPrice || 'Contact us for pricing'}</p>
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
        attachments: [
          {
            filename: `travel-quote-${enquiryId || customerId}.pdf`,
            path: customerPdfUrl,
            contentType: "application/pdf",
          },
        ],
      })

      // Create shared customer PDF record
      const sharedPdf = await prisma.sharedCustomerPdf.create({
        data: {
          itineraryId: itineraryId,
          customerId: customerId || enquiryId,
          enquiryId: enquiryId,
          pdfUrl: customerPdfUrl,
          pdfFileName: `travel-quote-${enquiryId || customerId}.pdf`,
          customerName: customer.name,
          customerEmail: customer.email,
          customerPhone: customer.phone,
          emailSent: emailResult.success,
          emailSentAt: emailResult.success ? new Date() : null,
          createdBy: "system",
        },
      })

      return NextResponse.json({
        success: true,
        message: "Quote shared with customer successfully",
        data: {
          id,
          sharedPdf: {
            id: sharedPdf.id,
            customerName: sharedPdf.customerName,
            customerEmail: sharedPdf.customerEmail,
            emailSent: sharedPdf.emailSent,
            markupPrice: commission?.markupPrice,
          },
        },
      })
    }

    if (action === "addDMC") {
  // Check if DMC is already added to this shared itinerary
  const existingDMC = await prisma.sharedDMCItem.findFirst({
    where: {
      sharedDMCId: id,
      dmcId: updateData.dmcId,
    },
  });

  if (existingDMC) {
    return NextResponse.json({ 
      error: "This DMC is already added to the itinerary" 
    }, { status: 400 });
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
        return NextResponse.json({ error: "DMC not found" }, { status: 404 })
      }

      // Add DMC to shared list and send email
      const sharedDMCItem = await prisma.sharedDMCItem.create({
        data: {
          sharedDMCId: id,
          dmcId: updateData.dmcId,
          status: "AWAITING_TRANSFER",
        },
      })

      // Send email to newly added DMC
      let emailSent = false
      let emailError = null

      if (dmc.email && updateData.enquiryId) {
        try {
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

                <p>Please review the attached itinerary and provide your quotation.</p>
                <p>Best regards,<br>Travel Team</p>
              </div>
            `,
            attachments: updateData.pdfPath
              ? [
                  {
                    filename: `itinerary-${updateData.enquiryId}.pdf`,
                    path: updateData.pdfPath,
                    contentType: "application/pdf",
                  },
                ]
              : undefined,
          })
          emailSent = emailResult.success
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
        message: "DMC added successfully",
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
          error: emailError,
        },
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Error updating shared DMC:", error)
    return NextResponse.json({ error: "Failed to update shared DMC" }, { status: 500 })
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
      return NextResponse.json({ error: "ID is required" }, { status: 400 })
    }

    await prisma.sharedDMC.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: "Shared DMC deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting shared DMC:", error)
    return NextResponse.json({ error: "Failed to delete shared DMC" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}