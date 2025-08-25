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

    // Add this function to check if user_form table exists
    const ensureUserFormTableExists = async () => {
      try {
        // Check if table exists
        await prisma.$executeRaw`SELECT 1 FROM "user_form" LIMIT 1`;
        return true;
      } catch (error: unknown) {
        if (error instanceof Error && 'code' in error && error.code === 'P2021') {
          // Table doesn't exist yet
          return false;
        } else {
          throw error;
        }
      }
    };

    // Fetch team members only if user_form table exists
    let teamMembers: { id: string; name: string; email: string; avatarUrl: string | null; lastLoggedIn: string; avatarColor: string }[] = [];
    const tableExists = await ensureUserFormTableExists();
    
    if (tableExists) {
      const userFormRecords = await prisma.userForm.findMany({
        where: {
          createdBy: user.id, // Only fetch users created by this agency
        },
        include: {
          profileImage: true,
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      // Helper function for avatar colors
      const getAvatarColor = (name: string): string => {
        const colors = [
          "#0F9D58", // Green
          "#4285F4", // Blue
          "#F4B400", // Yellow
          "#DB4437", // Red
          "#673AB7", // Purple
          "#009688", // Teal
          "#FF5722", // Orange
          "#795548", // Brown
        ];
        
        // Simple hash function to get a consistent color for each name
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
          hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        
        return colors[Math.abs(hash) % colors.length];
      };

      // Format team members for the frontend
      teamMembers = userFormRecords.map(member => ({
        id: member.id,
        name: member.name,
        email: member.email,
        avatarUrl: member.profileImage?.url || null,
        lastLoggedIn: member.updatedAt.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        avatarColor: getAvatarColor(member.name)
      }));
    }

    // Fetch agency form data
    const agencyForm = await prisma.agencyForm.findFirst({
      where: {
        createdBy: user.id,
      },
      include: {
        logo: true,
        businessLicense: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Define company information with proper types
    const companyInformation = {
      name: agencyForm?.name || user.companyName || "N/A",
      gstRegistration: agencyForm?.gstRegistered !== undefined ? (agencyForm.gstRegistered ? "Yes" : "No") : "N/A",
      gstNo: agencyForm?.gstNumber || "N/A",
      ownerName: agencyForm?.ownerName || user.name || "N/A",
      mobile: agencyForm?.companyPhone ? 
        `${agencyForm.companyPhoneCode || ''} ${agencyForm.companyPhone}`.trim() : 
        user.phone || "N/A",
      email: agencyForm?.email || user.email,
      website: agencyForm?.website || "N/A",
      logo: agencyForm?.logo?.url || null,
      country: agencyForm?.country || "N/A",
      yearOfRegistration: agencyForm?.yearOfRegistration || "N/A",
      panNo: agencyForm?.panNumber || "N/A",
      panType: agencyForm?.panType || "N/A",
      headquarters: agencyForm?.headquarters || "N/A",
      yearsOfOperation: agencyForm?.yearsOfOperation || "N/A",
      landingPageColor: agencyForm?.landingPageColor || "#0F9D58",
      businessLicense: agencyForm?.businessLicense?.url || null,
    };

    const response = {
      profileData: {
        name: user.name || "N/A",
        email: user.email,
        fullName: user.name || "N/A",
        mobile: user.phone || "N/A",
        location: "N/A",
        avatarUrl: user.profileImage?.url || null,
      },
      accountData: {
        username: user.email,
        password: "********",
        role: user.role,
        location: "N/A",
        status: user.isOnline ? "Active" : "Inactive",
        lastLoggedIn: user.updatedAt.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
      teamMembers: teamMembers,
      commentData: null,
      companyInformation: companyInformation,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}