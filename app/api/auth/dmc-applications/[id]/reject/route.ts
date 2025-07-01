// import { type NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/prisma"

// POST - Reject DMC Application
// export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const body = await request.json()
//     const { rejectionReason, reviewedBy } = body

//     const application = await prisma.dMCApplication.findUnique({
//       where: { id: params.id },
//     })

//     if (!application) {
//       return NextResponse.json({ error: "DMC application not found" }, { status: 404 })
//     }

//     if (application.status !== "PENDING" && application.status !== "UNDER_REVIEW") {
//       return NextResponse.json({ error: "Application is not in a state that can be rejected" }, { status: 400 })
//     }

//     const updatedApplication = await prisma.dMCApplication.update({
//       where: { id: params.id },
//       data: {
//         status: "REJECTED",
//         rejectionReason: rejectionReason || "No reason provided",
//         reviewedBy: reviewedBy || "admin",
//         reviewedAt: new Date(),
//       },
//     })

//     return NextResponse.json(updatedApplication)
//   } catch (error) {
//     console.error("Error rejecting DMC application:", error)
//     return NextResponse.json(
//       {
//         error: "Failed to reject DMC application",
//         details: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 },
//     )
//   }
// }
