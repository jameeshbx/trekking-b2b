import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { DMCRegistrationData } from "@/types/dmc";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data: DMCRegistrationData = await req.json();

    // Create DMC record
    const dmc = await prisma.dMC.create({
      data: {
        name: data.dmcName,
        config: {
          primaryContact: data.primaryContact,
          phoneNumber: data.phoneNumber,
          designation: data.designation,
          ownerName: data.ownerName,
          ownerPhoneNumber: data.ownerPhoneNumber,
          email: data.email,
          website: data.website,
          primaryCountry: data.primaryCountry,
          destinationsCovered: data.destinationsCovered,
          cities: data.cities,
          gstRegistration: data.gstRegistration,
          gstNo: data.gstNo,
          yearOfRegistration: data.yearOfRegistration,
          panNo: data.panNo,
          panType: data.panType,
          headquarters: data.headquarters,
          country: data.country,
          yearOfExperience: data.yearOfExperience,
          primaryPhoneExtension: data.primaryPhoneExtension,
          ownerPhoneExtension: data.ownerPhoneExtension,
        },
        createdBy: session.user.id,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "DMC registered successfully",
        data: dmc,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error registering DMC:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to register DMC",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
