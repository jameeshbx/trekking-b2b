export interface Customer {
  id: string
  name: string
  email: string
  phone?: string
  whatsappNumber?: string
  createdAt: string
  updatedAt: string
}

export interface Itinerary {
  id: string
  dateGenerated: string
  pdf: string
  activeStatus: boolean
  itinerary: string
  status: string
  customerName: string
  destinations?: string
  startDate?: string | null
  endDate?: string | null
  budget?: number | null
  currency?: string | null
  pdfUrl?: string | null
}

export interface CustomerFeedback {
  id: string
  customerId: string
  itineraryId?: string | null
  type: string
  title: string
  description: string
  time: string
  status: string
  customerName: string
  documentUrl?: string | null
  documentName?: string | null
  createdAt: string
}

export interface SentItinerary {
  id: string
  date: string
  customerId?: string
  customerName: string
  email: string
  whatsappNumber?: string
  notes?: string
  documents: string
  status: string
  documentUrl?: string | null
  documentName?: string | null
  sentDate: string
  itineraryId?: string | null
  enquiryId?: string;
}

export interface FormData {
  name: string
  email: string
  whatsappNumber: string
  notes: string
  supportingDocument: File | null
}

export interface NewNote {
  title: string
  description: string
  type: string
  document: File | null
}

export interface CustomerDashboardData {
  success: boolean
  customer?: Customer
  itineraries: Itinerary[]
  feedbacks: CustomerFeedback[]
  sentItineraries: SentItinerary[]
}
