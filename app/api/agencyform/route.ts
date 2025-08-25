import { NextResponse } from "next/server";
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { agencyFormSchemaBase } from "@/lib/agency";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    
    // Check if the content type is multipart/form-data
    const contentType = req.headers.get("content-type") || "";
    
    if (contentType.includes("multipart/form-data")) {
      // Handle FormData
      const formData = await req.formData();
      
      // Convert FormData to a plain object
      const formValues: Record<string, unknown> = {};
      
      for (const [key, value] of formData.entries()) {
        // Handle file fields
        if (key === 'logo' || key === 'businessLicense') {
          const file = value as File;
          if (file.size > 0) {
            formValues[key] = file;
          }
        } else {
          // Convert string values to proper types
          formValues[key] = value;
        }
      }

      // Validate the form data (excluding files)
      const validationSchema = agencyFormSchemaBase.omit({ 
        logo: true, 
        businessLicense: true 
      });
      
      const validatedData = validationSchema.parse(formValues);
      
      // Handle file uploads (in a real app, upload to S3 or similar)
      // Note: File handling logic would go here in a real implementation

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
    } else {
      // Handle JSON data (for development/testing)
      const jsonData = await req.json();
      
      // Validate the JSON data
      const validatedData = agencyFormSchemaBase.parse(jsonData);
      
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
    }
  } catch (error) {
    console.error("Error creating agency:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Validation failed", 
          details: error.issues // Changed from error.errors to error.issues
        },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to create agency. Please try again." },
      { status: 500 }
    );
  }
}