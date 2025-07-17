import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { agencyFormSchema } from "@/lib/agency";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Handle FormData
    const formData = await req.formData();
    
    // Convert FormData to a plain object
    const formValues: Record<string, unknown> = {};
    
    // Debug logging
    console.log("Received form data entries:");
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value instanceof File ? `File: ${value.name}` : value}`);
      
      // Handle file fields separately
      if (key === 'logo' || key === 'businessLicense') {
        const file = value as File;
        if (file.size > 0) {
          formValues[key] = file;
        }
      } else if (key === 'gstRegistered') {
        // Ensure boolean conversion is correct
        formValues[key] = value === 'true';
      } else {
        // Convert string values to proper types
        formValues[key] = value;
      }
    }

    console.log("Processed form values:", formValues);

    // Validate the form data
    try {
      // Create a modified schema for validation that handles File objects
      const validationSchema = agencyFormSchema.omit({ 
        logo: true, 
        businessLicense: true 
      });
      
      const validatedData = validationSchema.parse(formValues);
      
      // Handle file uploads (in a real app, upload to S3 or similar)
      const logoFileName = formValues.logo ? (formValues.logo as File).name : null;
      const licenseFileName = formValues.businessLicense ? (formValues.businessLicense as File).name : null;

      console.log("Creating agency with data:", {
        ...validatedData,
        logoUrl: logoFileName,
        businessLicenseUrl: licenseFileName,
        createdBy: session.user.id,
      });

      // Create agency record in database
      const agency = await prisma.agencyForm.create({
        data: {

          name: validatedData.name,
          contactPerson: validatedData.contactPerson,
          agencyType: validatedData.agencyType,
          designation: validatedData.designation,
          phoneNumber: validatedData.phoneNumber,
          phoneCountryCode: validatedData.phoneCountryCode,
          ownerName: validatedData.ownerName,
          email: validatedData.email,
          companyPhone: validatedData.companyPhone,
          companyPhoneCode: validatedData.companyPhoneCode,
          website: validatedData.website,
          landingPageColor: validatedData.landingPageColor,
          gstRegistered: validatedData.gstRegistered,
          gstNumber: validatedData.gstNumber,
          yearOfRegistration: validatedData.yearOfRegistration,
          panNumber: validatedData.panNumber,
          panType: validatedData.panType,
          headquarters: validatedData.headquarters,
          country: validatedData.country,
          yearsOfOperation: validatedData.yearsOfOperation,

          createdBy: session.user.id,
        },
      });

      return NextResponse.json(agency, { status: 201 });
    } catch (validationError) {
      console.error("Validation error:", validationError);
      if (validationError instanceof z.ZodError) {
        return NextResponse.json(
          { error: validationError.errors[0].message },
          { status: 400 }
        );
      }
      throw validationError;
    }
  } catch (error) {
    console.error("Error creating agency:", error);
    return NextResponse.json(
      { error: "Failed to create agency. Please try again." },
      { status: 500 }
    );
  }
}
