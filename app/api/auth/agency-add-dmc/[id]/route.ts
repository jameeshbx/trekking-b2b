import { type NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { unlink } from "fs/promises"
import { join } from "path"
import { mkdir, writeFile } from "fs/promises"
import { randomUUID } from "crypto"

const prisma = new PrismaClient()

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: "DMC ID is required" }, { status: 400 })
    }

    const dmcRecord = await prisma.dMCForm.findUnique({
      where: { id },
      include: {
        registrationCertificate: {
          select: {
            id: true,
            url: true,
            name: true,
          },
        },
        paymentMethods: {
          include: {
            qrCode: {
              select: {
                id: true,
                url: true,
                name: true,
              },
            },
          },
        },
      },
    })

    if (!dmcRecord) {
      return NextResponse.json({ error: "DMC not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: dmcRecord,
    })
  } catch (error) {
    console.error("Error fetching DMC:", error)
    return NextResponse.json({ error: "Failed to fetch DMC" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: "DMC ID is required" }, { status: 400 })
    }

    // Check if this is a status update
    const contentType = request.headers.get("content-type")

    if (contentType?.includes("application/json")) {
      // Handle JSON requests (status updates)
      const body = await request.json()

      if (body.action === "toggleStatus") {
        const currentDmc = await prisma.dMCForm.findUnique({
          where: { id },
          select: { status: true },
        })

        if (!currentDmc) {
          return NextResponse.json({ error: "DMC not found" }, { status: 404 })
        }

        const newStatus = currentDmc.status === "ACTIVE" ? "DEACTIVE" : "ACTIVE"

        const updatedDmc = await prisma.dMCForm.update({
          where: { id },
          data: { status: newStatus },
        })

        return NextResponse.json({
          success: true,
          message: `DMC status updated to ${newStatus.toLowerCase()}`,
          data: updatedDmc,
        })
      }
    } else {
      // Handle FormData requests (full DMC updates)
      const formData = await request.formData()

      // Extract form fields
      const dmcName = formData.get("dmcName") as string
      const primaryContact = formData.get("primaryContact") as string
      const phoneNumber = formData.get("phoneNumber") as string
      const designation = formData.get("designation") as string
      const ownerName = formData.get("ownerName") as string
      const ownerPhoneNumber = formData.get("ownerPhoneNumber") as string
      const email = formData.get("email") as string
      const website = formData.get("website") as string
      const primaryCountry = formData.get("primaryCountry") as string
      const destinationsCovered = formData.get("destinationsCovered") as string
      const cities = formData.get("cities") as string
      const gstRegistration = formData.get("gstRegistration") as string
      const gstNo = formData.get("gstNo") as string
      const yearOfRegistration = formData.get("yearOfRegistration") as string
      const panNo = formData.get("panNo") as string
      const panType = formData.get("panType") as string
      const headquarters = formData.get("headquarters") as string
      const country = formData.get("country") as string
      const yearOfExperience = formData.get("yearOfExperience") as string
      const primaryPhoneExtension = formData.get("primaryPhoneExtension") as string
      const ownerPhoneExtension = formData.get("ownerPhoneExtension") as string
      const registrationCertificate = formData.get("registrationCertificate") as File

      // Handle file upload if present
      let registrationCertificateId: string | null = null

      if (registrationCertificate && registrationCertificate.size > 0) {
        try {
          // Create uploads directory if it doesn't exist
          const uploadsDir = join(process.cwd(), "public", "uploads", "certificates")
          await mkdir(uploadsDir, { recursive: true })

          // Generate unique filename
          const fileExtension = registrationCertificate.name.split(".").pop()
          const fileName = `${randomUUID()}.${fileExtension}`
          const filePath = join(uploadsDir, fileName)

          // Save file to disk
          const bytes = await registrationCertificate.arrayBuffer()
          const buffer = Buffer.from(bytes)
          await writeFile(filePath, buffer)

          // Save file record to database
          const fileRecord = await prisma.file.create({
            data: {
              id: randomUUID(),
              url: `/uploads/certificates/${fileName}`,
              name: registrationCertificate.name,
              size: registrationCertificate.size,
              type: registrationCertificate.type,
            },
          })

          registrationCertificateId = fileRecord.id
        } catch (fileError) {
          console.error("File upload error:", fileError)
          return NextResponse.json({ error: "Failed to upload registration certificate" }, { status: 500 })
        }
      }

      // Map PAN type to enum value
      const panTypeEnum = (panType?.toUpperCase() as "INDIVIDUAL" | "COMPANY" | "TRUST" | "OTHER") || "INDIVIDUAL"

      // Update DMC record with proper typing
      const updateData: {
        name: string
        contactPerson: string
        designation: string
        phoneNumber: string
        phoneCountryCode: string
        ownerName: string
        email: string
        ownerPhoneNumber: string
        ownerPhoneCode: string
        website: string | null
        primaryCountry: string
        destinationsCovered: string
        cities: string
        gstRegistered: boolean
        gstNumber: string | null
        yearOfRegistration: string
        panNumber: string
        panType: "INDIVIDUAL" | "COMPANY" | "TRUST" | "OTHER"
        headquarters: string
        country: string
        yearsOfExperience: string
        registrationCertificateId?: string
      } = {
        name: dmcName,
        contactPerson: primaryContact,
        designation: designation,
        phoneNumber: phoneNumber,
        phoneCountryCode: primaryPhoneExtension || "+91",
        ownerName: ownerName,
        email: email,
        ownerPhoneNumber: ownerPhoneNumber,
        ownerPhoneCode: ownerPhoneExtension || "+91",
        website: website || null,
        primaryCountry: primaryCountry,
        destinationsCovered: destinationsCovered,
        cities: cities,
        gstRegistered: gstRegistration === "Yes",
        gstNumber: gstRegistration === "Yes" ? gstNo : null,
        yearOfRegistration: yearOfRegistration,
        panNumber: panNo,
        panType: panTypeEnum,
        headquarters: headquarters,
        country: country,
        yearsOfExperience: yearOfExperience,
      }

      // Only update registration certificate if a new one was uploaded
      if (registrationCertificateId) {
        updateData.registrationCertificateId = registrationCertificateId
      }

      const updatedDmc = await prisma.dMCForm.update({
        where: { id },
        data: updateData,
        include: {
          registrationCertificate: {
            select: {
              id: true,
              url: true,
              name: true,
            },
          },
        },
      })

      return NextResponse.json({
        success: true,
        message: "DMC updated successfully",
        data: updatedDmc,
      })
    }

    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  } catch (error) {
    console.error("Error updating DMC:", error)
    return NextResponse.json({ error: "Failed to update DMC" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: "DMC ID is required" }, { status: 400 })
    }

    // First, get the DMC record to check if it has a registration certificate
    const dmcRecord = await prisma.dMCForm.findUnique({
      where: { id },
      include: {
        registrationCertificate: true,
        paymentMethods: {
          include: {
            qrCode: true,
          },
        },
      },
    })

    if (!dmcRecord) {
      return NextResponse.json({ error: "DMC not found" }, { status: 404 })
    }

    // Delete payment method files and records
    for (const paymentMethod of dmcRecord.paymentMethods) {
      if (paymentMethod.qrCode) {
        try {
          const filePath = join(process.cwd(), "public", paymentMethod.qrCode.url)
          await unlink(filePath)
        } catch (fileError) {
          console.warn("Could not delete QR code file:", fileError)
        }

        await prisma.file.delete({
          where: { id: paymentMethod.qrCodeId! },
        })
      }
    }

    // Delete all payment methods
    await prisma.paymentMethod.deleteMany({
      where: { dmcId: id },
    })

    // Delete the registration certificate file from filesystem if it exists
    if (dmcRecord.registrationCertificate) {
      try {
        const filePath = join(process.cwd(), "public", dmcRecord.registrationCertificate.url)
        await unlink(filePath)
      } catch (fileError) {
        console.warn("Could not delete registration certificate file:", fileError)
      }

      // Delete the file record from database
      await prisma.file.delete({
        where: { id: dmcRecord.registrationCertificateId! },
      })
    }

    // Delete the DMC record
    await prisma.dMCForm.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: "DMC deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting DMC:", error)
    return NextResponse.json({ error: "Failed to delete DMC" }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
