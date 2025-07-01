// import { type NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/prisma"

// POST - Approve DMC Application and create actual DMC
// export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const body = await request.json()
//     const { reviewedBy } = body

    // Get the application
    // const application = await prisma.dMCApplication.findUnique({
    //   where: { id: params.id },
    // })

    // if (!application) {
    //   return NextResponse.json({ error: "DMC application not found" }, { status: 404 })
    // }

    // if (application.status !== "PENDING" && application.status !== "UNDER_REVIEW") {
    //   return NextResponse.json({ error: "Application is not in a state that can be approved" }, { status: 400 })
    // }

    // Start a transaction to create DMC and update application
    // const result = await prisma.$transaction(async (tx) => {
      // Create the actual DMC
      // const newDMC = await tx.dMC.create({
      //   data: {
      //     name: application.dmcName,
      //     config: {
      //       primaryContact: application.primaryContact,
      //       phoneNumber: application.phoneNumber,
      //       primaryPhoneExtension: application.primaryPhoneExtension,
      //       designation: application.designation,
      //       ownerName: application.ownerName,
      //       ownerPhoneNumber: application.ownerPhoneNumber,
      //       ownerPhoneExtension: application.ownerPhoneExtension,
      //       email: application.email,
      //       website: application.website,
      //       primaryCountry: application.primaryCountry,
      //       destinationsCovered: application.destinationsCovered,
      //       cities: application.cities,
      //       gstRegistration: application.gstRegistration,
      //       gstNo: application.gstNo,
      //       yearOfRegistration: application.yearOfRegistration,
      //       panNo: application.panNo,
      //       panType: application.panType,
      //       headquarters: application.headquarters,
      //       country: application.country,
      //       yearOfExperience: application.yearOfExperience,
      //       registrationCertificate: application.registrationCertificate,
      //       joinSource: application.joinSource,
      //     },
      //     createdBy: application.createdBy,
      //   },
      // })

      // Update the application status
//       const updatedApplication = await tx.dmcApplication.update({
//         where: { id: params.id },
//         data: {
//           status: "APPROVED",
//           reviewedBy: reviewedBy || "admin",
//           reviewedAt: new Date(),
//           approvedDMCId: newDMC.id,
//         },
//       })

//       return { dmc: newDMC, application: updatedApplication }
//     })

//     return NextResponse.json(result)
//   } catch (error) {
//     console.error("Error approving DMC application:", error)
//     return NextResponse.json(
//       {
//         error: "Failed to approve DMC application",
//         details: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 },
//     )
//   }
// }
