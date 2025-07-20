import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { DMCRegistrationData } from "@/types/dmc";

import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

// Define the PanType based on what your Prisma schema expects
type PanType = "INDIVIDUAL" | "COMPANY" | "TRUST" | "OTHER";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data: DMCRegistrationData = await req.json();

    // Validate and type cast panType
<<<<<<< HEAD
    const panType = data.panType as "INDIVIDUAL" | "COMPANY" | "TRUST" | "OTHER";
=======
    const panType = data.panType as PanType;
>>>>>>> 1e1b2f0a30dabaa65ddd16e369f9bdf74be3b288

    // Create DMC record
    const dmc = await prisma.dMCForm.create({
      data: {
        name: data.dmcName,
        contactPerson: data.primaryContact,
        phoneNumber: data.phoneNumber,
        phoneCountryCode: data.primaryPhoneExtension,
        designation: data.designation,
        ownerName: data.ownerName,
        ownerPhoneNumber: data.ownerPhoneNumber,
        ownerPhoneCode: data.ownerPhoneExtension,
        email: data.email,
        website: data.website,
        primaryCountry: data.primaryCountry,
        destinationsCovered: data.destinationsCovered,
        cities: data.cities,
        gstRegistered: data.gstRegistration === "Yes",
        gstNumber: data.gstNo,
        yearOfRegistration: data.yearOfRegistration,
        panNumber: data.panNo,
        panType: panType,
        headquarters: data.headquarters,
        country: data.country,
        yearsOfExperience: data.yearOfExperience,
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

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const dmcForms = await prismaClient.dMCForm.findMany({
      include: {
        registrationCertificate: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const dmcData = dmcForms.map((dmc) => ({
      id: dmc.id,
      name: dmc.name,
      primaryContact: dmc.contactPerson || '',
      phoneNumber: dmc.phoneNumber || '',
      designation: dmc.designation || '',
      email: dmc.email || '',
      status: 'Active',
      joinSource: 'Direct',
      createdAt: dmc.createdAt,
      registrationCertificate: dmc.registrationCertificate,
      ownerName: dmc.ownerName || '',
      ownerPhoneNumber: dmc.ownerPhoneNumber || '',
      website: dmc.website || '',
      primaryCountry: dmc.primaryCountry || '',
      destinationsCovered: dmc.destinationsCovered || '',
      cities: dmc.cities || '',
      gstRegistered: dmc.gstRegistered,
      gstNumber: dmc.gstNumber || '',
      yearOfRegistration: dmc.yearOfRegistration || '',
      panNumber: dmc.panNumber || '',
      panType: dmc.panType as PanType,  // Ensure proper typing here too
      headquarters: dmc.headquarters || '',
      country: dmc.country || '',
      yearsOfExperience: dmc.yearsOfExperience || '',
    }));

    return NextResponse.json({
      success: true,
      data: dmcData
    });

  } catch (error: unknown) {
    console.error("Error fetching DMC data:", error);
<<<<<<< HEAD

    let message = "Failed to fetch DMC data";
  if (error instanceof Error) {
    message = error.message;
  }

    return NextResponse.json(
      { error: message || "Failed to fetch DMC data" },
=======
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch DMC data";
    return NextResponse.json(
      { error: errorMessage },
>>>>>>> 1e1b2f0a30dabaa65ddd16e369f9bdf74be3b288
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing DMC id" }, { status: 400 });
    }

    await prismaClient.dMCForm.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting DMC:", error);
    return NextResponse.json({ error: "Failed to delete DMC" }, { status: 500 });
  }
}