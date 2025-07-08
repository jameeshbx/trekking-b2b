import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { DMCRegistrationData } from "@/types/dmc";
import { PrismaClient } from "@prisma/client";

const prismaClient = new PrismaClient();

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

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get all DMC forms with related data
    const dmcForms = await prismaClient.dMCForm.findMany({
      include: {
        registrationCertificate: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform the data to match the table structure
    const dmcData = dmcForms.map((dmc) => ({
      id: dmc.id,
      name: dmc.name,
      primaryContact: dmc.contactPerson || '',
      phoneNumber: dmc.phoneNumber || '',
      designation: dmc.designation || '',
      email: dmc.email || '',
      status: 'Active', // You can add a status field to your schema if needed
      joinSource: 'Direct', // You can add a joinSource field to your schema if needed
      createdAt: dmc.createdAt,
      registrationCertificate: dmc.registrationCertificate,
      // Additional fields from the form
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
      panType: dmc.panType,
      headquarters: dmc.headquarters || '',
      country: dmc.country || '',
      yearsOfExperience: dmc.yearsOfExperience || '',
    }));

    return NextResponse.json({
      success: true,
      data: dmcData
    });

  } catch (error: any) {
    console.error("Error fetching DMC data:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch DMC data" },
      { status: 500 }
    );
  }
}
