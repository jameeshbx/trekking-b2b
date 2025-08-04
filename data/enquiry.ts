import type React from "react"
export interface Enquiry {
  id: string
  name: string
  phone: string
  email: string
  locations: string
  status:
    | "enquiry"
    | "itinerary_creation"
    | "customer_feedback"
    | "itinerary_confirmed"
    | "dmc_quotation"
    | "price_finalization"
    | "booking_request"
    | "booking_progress"
    | "payment_fees"
    | "trip_in_progress"
    | "completed"
  pointOfContact?: string
  enquiryDate: string
  assignedStaff?: string
  tourType?: string
  estimatedDates?: string
  budget?: number
  currency?: string
  notes?: string
  pickupLocation?: string
  dropLocation?: string
  numberOfTravellers?: string
  numberOfKids?: string
  travelingWithPets?: "yes" | "no"
  flightsRequired: string
  leadSource: string
  tags?: string
  mustSeeSpots?: string
  pacePreference?: string
}

export interface Column {
  id: string
  title: string
  icon: React.ReactNode
  enquiries: Enquiry[]
  color: string
}

// Initial data is now empty; fetch from API instead
export const initialEnquiries: Enquiry[] = []

export const initialColumns: Column[] = [
  {
    id: "enquiry",
    title: "Enquiry",
    enquiries: initialEnquiries.filter((e) => e.status === "enquiry"),
    icon: "/icons/Icon (2).png",
    color: "bg-amber-50 text-amber-600",
  },
  {
    id: "itinerary_creation",
    title: "Itinerary Creation",
    enquiries: initialEnquiries.filter((e) => e.status === "itinerary_creation"),
    icon: "/icons/Icon (3).png",
    color: "bg-amber-50 text-amber-600",
  },
  {
    id: "customer_feedback",
    title: "Customer Feedback",
    enquiries: initialEnquiries.filter((e) => e.status === "customer_feedback"),
    icon: "/icons/Icon (5).png",
    color: "bg-amber-50 text-amber-600",
  },
  {
    id: "itinerary_confirmed",
    title: "Itinerary Confirmed",
    enquiries: initialEnquiries.filter((e) => e.status === "itinerary_confirmed"),
    icon: "/icons/Icon (4).png",
    color: "bg-amber-50 text-amber-600",
  },
  {
    id: "dmc_quotation",
    title: "DMC Quotation",
    enquiries: initialEnquiries.filter((e) => e.status === "dmc_quotation"),
    icon: "/icons/Icon (7).png",
    color: "bg-amber-50 text-amber-600",
  },
  {
    id: "price_finalization",
    title: "Price Finalization",
    enquiries: initialEnquiries.filter((e) => e.status === "price_finalization"),
    icon: "/icons/Icon (8).png",
    color: "bg-amber-50 text-amber-600",
  },
  {
    id: "booking_request",
    title: "Booking Request",
    enquiries: initialEnquiries.filter((e) => e.status === "booking_request"),
    icon: "/icons/Icon (9).png",
    color: "bg-amber-50 text-amber-600",
  },
  {
    id: "booking_progress",
    title: "Booking Progress",
    enquiries: initialEnquiries.filter((e) => e.status === "booking_progress"),
    icon: "/icons/Icon (10).png",
    color: "bg-amber-50 text-amber-600",
  },
  {
    id: "payment_fees",
    title: "Payment & Fees",
    enquiries: initialEnquiries.filter((e) => e.status === "payment_fees"),
    icon: "/icons/Icon (11).png",
    color: "bg-amber-50 text-amber-600",
  },
  {
    id: "trip_in_progress",
    title: "Trip in progress",
    enquiries: initialEnquiries.filter((e) => e.status === "trip_in_progress"),
    icon: "/icons/bx_trip.png",
    color: "bg-amber-50 text-amber-600",
  },
  {
    id: "completed",
    title: "Completed",
    enquiries: initialEnquiries.filter((e) => e.status === "completed"),
    icon: "/icons/Icon (12).png",
    color: "bg-amber-50 text-amber-600",
  },
]
