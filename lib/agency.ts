import { z } from "zod";

const phoneRegex = new RegExp(
  /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/
);

const gstRegex = new RegExp(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/);

const panRegex = new RegExp(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/);

const urlRegex = new RegExp(
  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
);

export const agencyFormSchema = z.object({
  // Basic Information
  contactPerson: z.string().min(2, "Contact person must be at least 2 characters"),
  agencyType: z.enum([
    "PRIVATE_LIMITED",
    "PROPRIETORSHIP",
    "PARTNERSHIP",
    "PUBLIC_LIMITED",
    "LLP",
    "TOUR_OPERATOR",
    "TRAVEL_AGENT",
    "DMC",
    "OTHER"
  ]),
  designation: z.string().min(2, "Designation must be at least 2 characters"),
  phoneNumber: z.string().regex(phoneRegex, "Invalid phone number"),
  phoneCountryCode: z.string().default("+91"),

  // Company Details
  ownerName: z.string().min(2, "Owner name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  companyPhone: z.string().regex(phoneRegex, "Invalid phone number"),
  companyPhoneCode: z.string().default("+91"),
  website: z.string().regex(urlRegex, "Invalid website URL"),
  landingPageColor: z.string().default("#4ECDC4"),

  // GST & Registration Details
  gstRegistered: z.boolean().default(true),
  gstNumber: z.string().optional().nullable(),
  yearOfRegistration: z.string().min(4, "Year must be 4 digits").max(4, "Year must be 4 digits"),
  panNumber: z.string().regex(panRegex, "Invalid PAN number"),
  panType: z.enum(["INDIVIDUAL", "COMPANY", "TRUST", "OTHER"]),
  headquarters: z.string().min(5, "Headquarters must be at least 5 characters"),
  country: z.string().default("INDIA"),
  yearsOfOperation: z.string().min(1, "Years of operation is required"),

  // File Uploads - Make them optional for frontend validation
  logo: z.any().optional(),
  businessLicense: z.any().optional(),
}).refine((data) => {
  // If GST is not registered, GST number should be optional
  if (!data.gstRegistered) {
    return true; // Allow submission without GST number
  }
  // If GST is registered, GST number should be provided and valid
  if (!data.gstNumber || data.gstNumber.trim() === "") {
    return false;
  }
  // Validate GST number format if provided
  return gstRegex.test(data.gstNumber);
}, {
  message: "Valid GST number is required when GST is registered",
  path: ["gstNumber"]
});

export type AgencyFormValues = z.infer<typeof agencyFormSchema>;