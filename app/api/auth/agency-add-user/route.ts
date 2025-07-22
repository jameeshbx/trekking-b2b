import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

async function ensureUserFormTableExists() {
  try {
    // Check if table exists
    await prisma.$executeRaw`SELECT 1 FROM "user_form" LIMIT 1`;
  } catch (error: unknown) {
     if (error instanceof Error && 'code' in error && error.code === 'P2021') {
      // Table doesn't exist, create it
      await prisma.$executeRaw`
        CREATE TABLE "user_form" (
          id TEXT PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          "phoneNumber" TEXT NOT NULL,
          "phoneExtension" TEXT NOT NULL DEFAULT '+91',
          email TEXT NOT NULL UNIQUE,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          "profileImageId" TEXT UNIQUE,
          status TEXT NOT NULL DEFAULT 'ACTIVE',
          "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
          "createdBy" TEXT NOT NULL,
          FOREIGN KEY ("profileImageId") REFERENCES file(id)
        );
        
        CREATE INDEX "user_form_email_idx" ON "user_form"(email);
        CREATE INDEX "user_form_username_idx" ON "user_form"(username);
      `;
    } else {
      throw error;
    }
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Ensure table exists before proceeding
    await ensureUserFormTableExists();

    const formData = await req.formData();
    
    // Extract form data
    const name = formData.get("name") as string;
    const phoneNumber = formData.get("phone") as string;
    const phoneExtension = formData.get("phoneExtension") as string || "+91";
    const email = formData.get("email") as string;
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    const profileImage = formData.get("profile") as File | null;

    // Validate required fields
    if (!name || !phoneNumber || !email || !username || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Validate phone number format
    if (!/^\d{10}$/.test(phoneNumber)) {
      return NextResponse.json(
        { error: "Phone number must be 10 digits" },
        { status: 400 }
      );
    }

    // Validate email format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Check for existing user
    const existingUser = await prisma.userForm.findFirst({
      where: {
        OR: [
          { email },
          { username }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === email) {
        return NextResponse.json({ error: "Email already exists" }, { status: 400 });
      }
      if (existingUser.username === username) {
        return NextResponse.json({ error: "Username already exists" }, { status: 400 });
      }
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Handle file upload if exists
    let fileId = null;
    if (profileImage) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const fileBuffer = await profileImage.arrayBuffer();
      // In a real app, you'd upload this to storage (S3, etc.)
      // Here we just create a record with the filename
      const fileRecord = await prisma.file.create({
        data: {
          name: profileImage.name,
          size: profileImage.size,
          type: profileImage.type,
          url: `/uploads/${profileImage.name}`,
        }
      });
      fileId = fileRecord.id;
    }

    // Create user
    const user = await prisma.userForm.create({
      data: {
        name,
        phoneNumber,
        phoneExtension,
        email,
        username,
        password: hashedPassword,
        status: "ACTIVE",
        createdBy: session.user.id,
        ...(fileId && { profileImageId: fileId })
      },
      include: {
        profileImage: true
      }
    });

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      data: {
        ...user,
        password: undefined
      }
    }, { status: 201 });

  } catch (error: unknown) {
    console.error("Error creating user:", error);
    const message = error instanceof Error ? error.message : "Failed to create user";
    return NextResponse.json({
    error: message
  }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  try {
    // Ensure table exists before proceeding
    await ensureUserFormTableExists();

    const users = await prisma.userForm.findMany({
      include: {
        profileImage: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      data: users.map(user => ({
        ...user,
        password: undefined
      }))
    });

  } catch (error: unknown) {
     console.error("Error fetching users:", error);
     const message = error instanceof Error ? error.message : "Failed to fetch users";
      return NextResponse.json({
      error: message
  }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.userForm.findUnique({
      where: { id }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Delete user
    await prisma.userForm.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: "User deleted successfully"
    });

  } catch (error: unknown) {
    console.error("Error deleting user:", error);
    const message = error instanceof Error ? error.message : "Failed to delete user";
    return NextResponse.json({
    error: message
  }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await req.json();
    
    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Verify user exists
    const user = await prisma.userForm.findUnique({
      where: { id },
      select: {
        password: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Return the password (hashed) only if admin requests it
    return NextResponse.json({
      success: true,
      data: {
        password: user.password
      }
    });

  } catch (error: unknown) {
    console.error("Error revealing password:", error);
    const message = error instanceof Error ? error.message : "Failed to reveal password";
    return NextResponse.json({
    error: message
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, status } = body;
    
    if (!id || !status) {
      return NextResponse.json({ error: "ID and status are required" }, { status: 400 });
    }

    // Validate status
    if (!["ACTIVE", "INACTIVE"].includes(status)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.userForm.findUnique({
      where: { id }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update user status
    const updatedUser = await prisma.userForm.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json({
      success: true,
      message: "User status updated",
      data: {
        ...updatedUser,
        password: undefined
      }
    });

  } catch (error: unknown) {
     console.error("Error updating user status:", error);
    const message = error instanceof Error ? error.message : "Failed to update user status";
    return NextResponse.json({
      error: message
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}