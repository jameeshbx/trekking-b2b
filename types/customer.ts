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
  customerId?: string
  enquiryId?: string
}

export interface CustomerFeedback {
  id: string
  title: string
  description: string
  type: string
  status: string
  documentUrl?: string
  documentName?: string
  createdAt: string
  customerId?: string
  enquiryId?: string
}

export interface SentItinerary {
  id: string
  date: string
  customerName: string
  email: string
  whatsappNumber: string
  notes?: string
  documents?: string
  customerId?: string
  enquiryId?: string
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
  customer?: Customer
  itineraries: Itinerary[]
  feedbacks: CustomerFeedback[]
  sentItineraries: SentItinerary[]
}
