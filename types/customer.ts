// Define interfaces for customer-related data
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  whatsappNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Itinerary {
  id: string;
  dateGenerated: string;
  pdf: string; // "D" for download, "B" for something else (e.g., view in browser)
  activeStatus: boolean;
  itinerary: string; // "Download" or similar text
  status: string;
  customerName: string;
  destinations: string;
  startDate: string | null;
  endDate: string | null;
  budget: number;
  currency: string;
  pdfUrl: string | null; // Actual URL to the PDF
}

export interface CustomerFeedback {
  id: string;
  customerId: string;
  itineraryId: string | null;
  type: string; // e.g., "note", "feedback", "change_request"
  title: string;
  description: string;
  time: string; // Formatted time string
  status: string; // e.g., "pending", "confirmed", "changes", "note"
  customerName: string;
  documentUrl: string | null; // URL to uploaded document
  documentName: string | null; // Original filename
  createdAt: string;
}

export interface SentItinerary {
  id: string;
  date: string; // Formatted date string
  customerId: string;
  customerName: string;
  email: string;
  whatsappNumber: string | null;
  notes: string | null;
  documents: string; // "Download" or empty string
  status: string; // e.g., "sent", "delivered", "read", "failed", "partial", "processing"
  documentUrl: string | null; // URL to supporting document
  documentName: string | null; // Original filename
  sentDate: string; // ISO string date
  itineraryId: string | null;
  emailSent: boolean; // Track if email was sent successfully
  whatsappSent: boolean; // Track if WhatsApp was sent successfully
}

// Form data for sending itinerary
export interface FormData {
  name: string;
  email: string;
  whatsappNumber: string;
  notes: string;
  supportingDocument: File | null;
}

// Form data for adding a new note/feedback
export interface NewNote {
  title: string;
  description: string;
  type: string;
  document: File | null;
}

// Data structure for the customer dashboard API response
export interface CustomerDashboardData {
  success: boolean;
  customer: Customer | null;
  itineraries: Itinerary[];
  feedbacks: CustomerFeedback[];
  sentItineraries: SentItinerary[];
}
  