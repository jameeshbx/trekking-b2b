import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// POST => Create new manager with default status
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, username, password, status, profileId, countryCode } = body;


    // ✅ Add name validation here
    const nameRegex = /^[A-Za-z\s]+$/;

    if (!name?.trim()) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 }
      );
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters long." },
        { status: 400 }
      );
    }

    if (!nameRegex.test(name.trim())) {
      return NextResponse.json(
        { error: "Name must contain only letters and spaces." },
        { status: 400 }
      );
    }


    // 🟢 Next, validate phone as before:
    // ✅ Phone required
    if (!phone) {
      return NextResponse.json({ error: "Phone is required." }, { status: 400 });
    }

    // ✅ Only digits
    if (!/^\d+$/.test(phone)) {
      return NextResponse.json({ error: "Phone must contain digits only" }, { status: 400 });
    }

    // ✅ For +91 country code, must be exactly 10 digits
    if (countryCode === "+91" && phone.length !== 10) {
      return NextResponse.json({ error: "For India (+91), phone number must be exactly 10 digits." }, { status: 400 });
    }
    // 🟢 Email validation (keep as is)
    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // 🟢 Username validation
    if (!username) {
      return NextResponse.json({ error: "Username is required." }, { status: 400 });
    }

    if (username.length < 3) {
      return NextResponse.json({ error: "Username must be at least 3 characters" }, { status: 400 });
    }

    // 🟢 Password validation
    if (!password) {
      return NextResponse.json({ error: "Password is required." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    // ✅ Status check (as you already have it)
    if (status && !["ACTIVE", "INACTIVE"].includes(status)) {
      return NextResponse.json({ error: "Invalid status. Must be ACTIVE or INACTIVE" }, { status: 400 })
    }

    // Check for duplicates
    const existingManager = await prisma.manager.findFirst({
      where: {
        OR: [
          { email: email },
          { username: username }
        ]
      },
    });

    if (existingManager) {
      return NextResponse.json(
        { error: "Email or username already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    const newManager = await prisma.manager.create({
      data: {
        name,
        phone,
        email,
        username,
        password: hashedPassword,
        status: status || "INACTIVE",
        profile: profileId ? { connect: { id: profileId } } : undefined,
      },
    });


    // Return manager data without password
    const { password: _, ...managerWithoutPassword } = newManager
    return NextResponse.json(managerWithoutPassword, { status: 201 })
  } catch (error: unknown) {
    console.error("Error creating manager:", error)
    return NextResponse.json(
      { error: "Something went wrong", details: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}


// GET => Fetch all managers
export async function GET() {
  try {
    const managers = await prisma.manager.findMany({
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        username: true,
        password: true, // Include password for display (you might want to exclude this in production)
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    })
    return NextResponse.json(managers)
  } catch (error) {
    console.error("Error fetching managers:", error)
    if (error instanceof Error) {
      return NextResponse.json({ error: "Failed to fetch managers", details: error.message }, { status: 500 })
    }
    return NextResponse.json({ error: "Failed to fetch managers" }, { status: 500 })
  }
}
