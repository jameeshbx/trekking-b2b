export interface DMCRegistrationData {
  dmcName: string;
  primaryContact: string;
  phoneNumber: string;
  designation: string;
  ownerName: string;
  ownerPhoneNumber: string;
  email: string;
  website: string;
  primaryCountry: string;
  destinationsCovered: string;
  cities: string;
  gstRegistration: "Yes" | "No";
  gstNo: string;
  yearOfRegistration: string;
  panNo: string;
  panType: string;
  headquarters: string;
  country: string;
  yearOfExperience: string;
  registrationCertificate: File | null;
  primaryPhoneExtension: string;
  ownerPhoneExtension: string;
}

export interface DMCRegistrationResponse {
  success: boolean;
  message: string;
  data?: DMCRegistrationData;
  error?: string;
}
