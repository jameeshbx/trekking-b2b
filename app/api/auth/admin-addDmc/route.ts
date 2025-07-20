import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import type { PanType } from "@prisma/client";

const prisma = new PrismaClient()

type PanType = "INDIVIDUAL" | "COMPANY" | "TRUST" | "OTHER";

export async function POST(request: Request) {
  try {
    console.log("DMC Registration API called")
    
    const session = await getServerSession(authOptions)
    
    if (!session) {
      console.log("No session found")
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    console.log("Session user:", session.user.id)

    const formData = await request.formData()
    
    const dmcName = formData.get('dmcName') as string
    const primaryContact = formData.get('primaryContact') as string
    const phoneNumber = formData.get('phoneNumber') as string
    const designation = formData.get('designation') as string
    const ownerName = formData.get('ownerName') as string
    const ownerPhoneNumber = formData.get('ownerPhoneNumber') as string
    const email = formData.get('email') as string
    const website = formData.get('website') as string
    const primaryCountry = formData.get('primaryCountry') as string
    const destinationsCovered = formData.get('destinationsCovered') as string
    const cities = formData.get('cities') as string
    const gstRegistration = formData.get('gstRegistration') as string
    const gstNo = formData.get('gstNo') as string
    const yearOfRegistration = formData.get('yearOfRegistration') as string
    const panNo = formData.get('panNo') as string
    const panType = formData.get('panType') as PanType
    const headquarters = formData.get('headquarters') as string
    const country = formData.get('country') as string
    const yearOfExperience = formData.get('yearOfExperience') as string
    const primaryPhoneExtension = formData.get('primaryPhoneExtension') as string
    const ownerPhoneExtension = formData.get('ownerPhoneExtension') as string

    if (!dmcName || !primaryContact || !phoneNumber || !designation || !ownerName || !ownerPhoneNumber || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }
    
    let registrationCertificateId = null
    const registrationCertificate = formData.get('registrationCertificate') as File | null
    
    if (registrationCertificate && registrationCertificate.size > 0) {
      const file = await prisma.file.create({
        data: {
          name: registrationCertificate.name,
          type: registrationCertificate.type,
          size: registrationCertificate.size,
          url: `/uploads/${registrationCertificate.name}`
        }
      })
      registrationCertificateId = file.id
    }

    const dmcForm = await prisma.dMCForm.create({
      data: {
        name: dmcName,
        contactPerson: primaryContact,
        designation: designation,
        phoneNumber: phoneNumber,
        phoneCountryCode: primaryPhoneExtension,
        ownerName: ownerName,
        email: email,
        ownerPhoneNumber: ownerPhoneNumber,
        ownerPhoneCode: ownerPhoneExtension,
        website: website,
        primaryCountry: primaryCountry,
        destinationsCovered: destinationsCovered,
        cities: cities,
        gstRegistered: gstRegistration === "Yes",
        gstNumber: gstNo,
        yearOfRegistration: yearOfRegistration,
        panNumber: panNo,
<<<<<<< HEAD
        panType: panType ? (panType as PanType) : undefined,

=======
        panType: panType,
>>>>>>> 1e1b2f0a30dabaa65ddd16e369f9bdf74be3b288
        headquarters: headquarters,
        country: country,
        yearsOfExperience: yearOfExperience,
        registrationCertificateId,
        createdBy: session.user.id,
        config: {}
      }
    })

    console.log("DMC Form created successfully:", dmcForm.id)
    
    return NextResponse.json(
      { success: true, data: dmcForm },
      { status: 201 }
    )
  } catch (error: unknown) {
    console.error("DMC Registration Error:", error)
<<<<<<< HEAD
    let message = "Failed to register DMC"
  if (error instanceof Error) {
    message = error.message
  }
    return NextResponse.json(
      { error: message || "Failed to register DMC" },
=======
    const errorMessage = error instanceof Error ? error.message : "Failed to register DMC";
    return NextResponse.json(
      { error: errorMessage },
>>>>>>> 1e1b2f0a30dabaa65ddd16e369f9bdf74be3b288
      { status: 500 }
    )
  }
}