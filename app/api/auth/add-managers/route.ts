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


    // Add email and username already exists check 


    

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
  } catch (error: unknown) {
    console.error("Error creating manager:", error);
    if (error instanceof Error) {
    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
}
}



export async function GET() {
  try {
    const managers = await prisma.manager.findMany();
    return NextResponse.json(managers);
  } catch (error) {
    if (error instanceof Error) {
    return NextResponse.json({ error: "Failed to fetch managers", details: error.message }, { status: 500 });
  }
}

return NextResponse.json(
      { error: "Failed to fetch managers" },
      { status: 500 }
    );
  }


