export interface Enquiry {
  id: string
  name: string
  phone: string
  email: string
  locations: string
  tourType: string
  estimatedDates: string
  currency: string
  budget: number
  notes: string
  assignedStaff: string
  pointOfContact: string
  pickupLocation: string
  dropLocation: string
  numberOfTravellers: string
  numberOfKids: string
  travelingWithPets: string
  flightsRequired: string
  leadSource: string
  tags: string
  mustSeeSpots: string
  pacePreference: string
  status:
    | "enquiry"
    | "itinerary_creation"
    | "customer_feedback"
    | "itinerary_confirmed"
    | "dmc_quotation"
    | "price_finalization"
    | "booking_request"
    | "booking_progress"
    | "payment_forex"
    | "trip_in_progress"
    | "completed"
  enquiryDate: string
}

export interface Column {
  id: string
  title: string
  icon: string
  enquiries: Enquiry[]
}

export const initialColumns: Column[] = [
  {
    id: "enquiry",
    title: "Enquiry",
    icon: "/placeholder.svg?height=32&width=32",
    enquiries: [],
  },
  {
    id: "itinerary_creation",
    title: "Itinerary Creation",
    icon: "/placeholder.svg?height=32&width=32",
    enquiries: [],
  },
  {
    id: "customer_feedback",
    title: "Customer Feedback",
    icon: "/placeholder.svg?height=32&width=32",
    enquiries: [],
  },
  {
    id: "itinerary_confirmed",
    title: "Itinerary Confirmed",
    icon: "/placeholder.svg?height=32&width=32",
    enquiries: [],
  },
  {
    id: "dmc_quotation",
    title: "DMC Quotation",
    icon: "/placeholder.svg?height=32&width=32",
    enquiries: [],
  },
  {
    id: "price_finalization",
    title: "Price Finalization",
    icon: "/placeholder.svg?height=32&width=32",
    enquiries: [],
  },
  {
    id: "booking_request",
    title: "Booking Request",
    icon: "/placeholder.svg?height=32&width=32",
    enquiries: [],
  },
  {
    id: "booking_progress",
    title: "Booking Progress",
    icon: "/placeholder.svg?height=32&width=32",
    enquiries: [],
  },
  {
    id: "payment_forex",
    title: "Payment & Forex",
    icon: "/placeholder.svg?height=32&width=32",
    enquiries: [],
  },
  {
    id: "trip_in_progress",
    title: "Trip in Progress",
    icon: "/placeholder.svg?height=32&width=32",
    enquiries: [],
  },
  {
    id: "completed",
    title: "Completed",
    icon: "/placeholder.svg?height=32&width=32",
    enquiries: [],
  },
]
