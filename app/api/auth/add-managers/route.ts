import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, username, password, profileId } = body;

    if (!name || !phone || !email || !username || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newManager = await prisma.manager.create({
      data: {
        name,
        phone,
        email,
        username,
        password,
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
    const errorMessage = error instanceof Error ? error.message : "Something went wrong";
    return NextResponse.json(
      { error: "Something went wrong", details: errorMessage },
      { status: 500 }
    );
  }
}