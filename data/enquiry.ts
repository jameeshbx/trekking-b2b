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
  }
  
  export interface Column {
    id: string
    title: string
    enquiries: Enquiry[]
    icon: string
    color: string
  }
  
  // Initial data
  export const initialEnquiries: Enquiry[] = [
    {
      id: "1",
      name: "Philip Sharma",
      phone: "+44 123 456789",
      email: "philip.sharma@example.com",
      locations: "Bali, Indonesia",
      status: "enquiry",
      enquiryDate: "15-04-2023",
      tourType: "Family",
      estimatedDates: "15 Jun - 30 Jun",
      budget: 3500,
      currency: "USD",
    },
    {
      id: "2",
      name: "Maria Rodriguez",
      phone: "+34 612 345 678",
      email: "maria.r@example.com",
      locations: "Paris, Rome, Barcelona",
      status: "itinerary_creation",
      enquiryDate: "12-04-2023",
      assignedStaff: "Maria Rodriguez",
      tourType: "Cultural",
      estimatedDates: "1 Jul - 15 Jul",
      budget: 4200,
      currency: "EUR",
    },
    {
      id: "3",
      name: "Hiroko Tanaka",
      phone: "+81 90 1234 5678",
      email: "hiroko.tanaka@example.com",
      locations: "Kyoto, Tokyo",
      status: "customer_feedback",
      enquiryDate: "10-04-2023",
      assignedStaff: "Priya Sharma",
      tourType: "Luxury",
      estimatedDates: "20 May - 5 Jun",
      budget: 5800,
      currency: "USD",
    },
    {
      id: "4",
      name: "Ahmed Khan",
      phone: "+971 50 123 4567",
      email: "ahmed.k@example.com",
      locations: "Queenstown, New Zealand",
      status: "itinerary_confirmed",
      enquiryDate: "05-04-2023",
      assignedStaff: "Kevin Blake",
      tourType: "Adventure",
      estimatedDates: "10 Aug - 25 Aug",
      budget: 3200,
      currency: "AUD",
    },
    {
      id: "5",
      name: "Kevin Blake",
      phone: "+1 415 555 7890",
      email: "kevin.b@example.com",
      locations: "Maldives",
      status: "dmc_quotation",
      enquiryDate: "01-04-2023",
      assignedStaff: "Emily Johnson",
      tourType: "Beach",
      estimatedDates: "1 Sep - 10 Sep",
      budget: 4500,
      currency: "USD",
    },
    {
      id: "6",
      name: "Adele Patel",
      phone: "+44 7700 900123",
      email: "adele.p@example.com",
      locations: "Costa Rica",
      status: "price_finalization",
      enquiryDate: "28-03-2023",
      assignedStaff: "Kevin Blake",
      tourType: "Eco Tourism",
      estimatedDates: "5 Oct - 15 Oct",
      budget: 3800,
      currency: "USD",
    },
    {
      id: "7",
      name: "Fatima Al-Mansouri",
      phone: "+971 52 123 4567",
      email: "fatima.m@example.com",
      locations: "South Africa Safari",
      status: "booking_request",
      enquiryDate: "25-03-2023",
      assignedStaff: "Priya Sharma",
      tourType: "Wildlife",
      estimatedDates: "1 Nov - 15 Nov",
      budget: 6200,
      currency: "USD",
    },
    {
      id: "8",
      name: "Sophie Martin",
      phone: "+33 6 12 34 56 78",
      email: "sophie.m@example.com",
      locations: "Greek Islands",
      status: "booking_progress",
      enquiryDate: "20-03-2023",
      assignedStaff: "Maria Rodriguez",
      tourType: "Beach",
      estimatedDates: "15 Jun - 30 Jun",
      budget: 4100,
      currency: "EUR",
    },
    {
      id: "9",
      name: "Henrik Holmgren",
      phone: "+46 70 123 45 67",
      email: "henrik.h@example.com",
      locations: "Peru, Machu Picchu",
      status: "payment_fees",
      enquiryDate: "15-03-2023",
      assignedStaff: "Emily Johnson",
      tourType: "Historical",
      estimatedDates: "10 May - 25 May",
      budget: 5500,
      currency: "USD",
    },
    {
      id: "10",
      name: "Miguel Hernandez",
      phone: "+52 55 1234 5678",
      email: "miguel.h@example.com",
      locations: "Thailand",
      status: "trip_in_progress",
      enquiryDate: "10-03-2023",
      assignedStaff: "Kevin Blake",
      tourType: "Beach",
      estimatedDates: "1 Jul - 15 Jul",
      budget: 3200,
      currency: "EUR",
    },
    {
      id: "11",
      name: "Sophia Novak",
      phone: "+420 601 123 456",
      email: "sophia.n@example.com",
      locations: "Iceland",
      status: "completed",
      enquiryDate: "05-03-2023",
      assignedStaff: "Priya Sharma",
      tourType: "Adventure",
      estimatedDates: "20 Aug - 5 Sep",
      budget: 4800,
      currency: "USD",
    },
  ]
  
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
  