import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    console.log("Testing database connection...")
    
    // Test basic connection
    const count = await prisma.agencyForm.count()
    console.log("Total agency forms:", count)
    
    // Get first few records
    const forms = await prisma.agencyForm.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        contactPerson: true,
        createdAt: true,
      }
    })
    
    return NextResponse.json({
      success: true,
      count,
      forms,
      message: "Database connection successful"
    })
  } catch (error) {
    console.error("Database test error:", error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
      message: "Database connection failed"
    }, { status: 500 })
  }
} 