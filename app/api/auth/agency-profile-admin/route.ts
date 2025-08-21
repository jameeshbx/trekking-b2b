import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        profileImage: true,
        agency: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isAuthorized = user.userType === "AGENCY" || user.role === "ADMIN" || user.role === "SUPER_ADMIN"

    if (!isAuthorized) {
      return NextResponse.json(
        {
          error: `Access denied. User type: ${user.userType}, Role: ${user.role}`,
        },
        { status: 403 },
      )
    }

    const response = {
      profileData: {
        name: user.name || "N/A",
        email: user.email,
        fullName: user.name || "N/A",
        mobile: user.phone || "N/A",
        location: "N/A", // Add location field to your user model if needed
        avatarUrl: user.profileImage?.url || null,
      },
      accountData: {
        username: user.email, // Using email as username
        password: "********", // Never send actual password
        role: user.role,
        location: "N/A", // Add location field to your user model if needed
        status: user.isOnline ? "Active" : "Inactive",
        lastLoggedIn: user.updatedAt.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      teamMembers: [],
      commentData: null,
      companyInformation: {
        name: user.companyName || "N/A",
        gstRegistration: "N/A",
        gstNo: "N/A",
        ownerName: user.name || "N/A",
        mobile: user.phone || "N/A",
        email: user.email,
        website: "N/A",
        logo: null,
        country: "N/A",
        yearOfRegistration: "N/A",
        panNo: "N/A",
        panType: "N/A",
        headquarters: "N/A",
        yearsOfOperation: "N/A",
        landingPageColor: "#0F9D58",
      },
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
