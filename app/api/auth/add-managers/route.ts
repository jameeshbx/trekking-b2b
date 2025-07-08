import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";


// Helper: parse form-data if you want to handle file uploads
// For now, assuming JSON body and file upload handled separately (S3, Cloudinary, etc.)


export async function POST(req: NextRequest) {
  try {
    // Parse incoming JSON
    const body = await req.json();
    const { name, phone, email, username, password, profileId } = body;

    // Basic validation
    if (!name || !phone || !email || !username || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Create the manager in the DB
    const newManager = await prisma.manager.create({
      data: {
        name,
        phone,
        email,
        username,
        password, // NOTE: In real app, hash passwords!
        profile: profileId
          ? {
              connect: {
                id: profileId,
              },
            }
          : undefined,
      },
    });


    return NextResponse.json(newManager, { status: 201 });
  } catch (error: any) {
    console.error("Error creating manager:", error);
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}
