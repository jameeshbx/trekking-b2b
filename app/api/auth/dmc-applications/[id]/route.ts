// import { type NextRequest, NextResponse } from "next/server"
// import { prisma } from "@/lib/prisma"

// GET - Fetch single DMC Application
// export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const application = await prisma.dMCApplication.findUnique({
//       where: { id: params.id },
//     })

//     if (!application) {
//       return NextResponse.json({ error: "DMC application not found" }, { status: 404 })
//     }

//     return NextResponse.json(application)
//   } catch (error) {
//     console.error("Error fetching DMC application:", error)
//     return NextResponse.json(
//       {
//         error: "Failed to fetch DMC application",
//         details: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 },
//     )
//   }
// }

// PUT - Update DMC Application
// export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const body = await request.json()

//     const updatedApplication = await prisma.dMCApplication.update({
//       where: { id: params.id },
//       data: {
//         ...body,
//         updatedAt: new Date(),
//       },
//     })

//     return NextResponse.json(updatedApplication)
//   } catch (error) {
//     console.error("Error updating DMC application:", error)
//     return NextResponse.json(
//       {
//         error: "Failed to update DMC application",
//         details: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 },
//     )
//   }
// }

// DELETE - Delete DMC Application
// export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     await prisma.dMCApplication.delete({
//       where: { id: params.id },
//     })

//     return NextResponse.json({ message: "DMC application deleted successfully" })
//   } catch (error) {
//     console.error("Error deleting DMC application:", error)
//     return NextResponse.json(
//       {
//         error: "Failed to delete DMC application",
//         details: error instanceof Error ? error.message : "Unknown error",
//       },
//       { status: 500 },
//     )
//   }
// }
