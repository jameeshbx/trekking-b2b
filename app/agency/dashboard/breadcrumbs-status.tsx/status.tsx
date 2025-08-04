"use client"

import { useState, useEffect } from "react"
import { Check, ArrowLeft, Bell, Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface EnquiryData {
  id: string
  name: string
  phone: string
  email: string
  locations: string
  tourType: string
  estimatedDates: string
  currency: string
  budget: number
  assignedStaff: string
  pointOfContact: string
  enquiryDate: string
  flightsRequired?: string
  pickupLocation?: string
  dropLocation?: string
  numberOfTravellers?: string
  numberOfKids?: string
  travelingWithPets?: string
  notes?: string
  tags?: string
  mustSeeSpots?: string
  pacePreference?: string
}

const EnquiryStatusProgress = ({ currentStep = 2, customerName = "Loading...", phoneNumber = "Loading..." }) => {
  const steps = [
    { id: 1, label: "Enquiry", status: "completed" },
    { id: 2, label: "Itinerary Creation", status: "completed" },
    { id: 3, label: "Customer Feedback", status: "pending" },
    { id: 4, label: "Customer Confirmation", status: "pending" },
    { id: 5, label: "DMC Quotation", status: "pending" },
    { id: 6, label: "Price Finalization", status: "pending" },
    { id: 7, label: "Booking Request", status: "pending" },
    { id: 8, label: "Booking Progress", status: "pending" },
    { id: 9, label: "Payment & Assg", status: "pending" },
    { id: 10, label: "Completed", status: "pending" },
  ]

  const router = useRouter()

  return (
    <div className="w-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="text-sm text-gray-600">
            <span>Pages</span> <span className="text-gray-400">/</span> <span>Dashboard</span>
          </div>
          <div className="text-sm font-medium text-green-900 font-semibold">Enquiry Details</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Type here..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#183F30] focus:border-transparent"
            />
          </div>
          <Bell className="w-5 h-5 text-gray-600" />
        </div>
      </div>
      {/* Customer Info & Back Button */}
      <div className="flex items-center justify-between p-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{customerName}</h1>
          <p className="text-sm text-gray-600">{phoneNumber}</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          onClick={() => router.back()} // Use router.back() for navigation
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </div>
      {/* Progress Steps */}
      <div className="px-7 pb-16 pt-3">
        <div className="flex items-center justify-between relative">
          {/* Background Line */}
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 z-0"></div>
          {/* Completed Progress Line */}
          <div
            className="absolute top-4 left-0 h-0.5 bg-[#14A155] z-0 transition-all duration-500"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          ></div>
          {steps.map((step, ) => {
            const isCompleted = step.id <= currentStep
            const isCurrent = step.id === currentStep

            return (
              <div key={step.id} className="flex flex-col items-center relative z-10">
                {/* Circle */}
                <div
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
                    ${
                      isCompleted
                        ? "bg-[#183F30] text-gray-100"
                        : "bg-white border-2 border-gray-100 text-gray-400 rounded-full"
                    }
                    ${isCurrent ? "ring-4 ring-[#183F30]" : ""}
                  `}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                </div>

                {/* Label */}
                <div className="mt-2 text-center ">
                  <div
                    className={`
                      text-sm font-medium px-2 py-1 rounded
                      ${isCompleted ? "bg-[#14A155]text-white" : "bg-gray-100 text-gray-600 rounded-full px-4"}
                      ${isCurrent ? "bg-[#14A155] text-white rounded-full px-8 " : ""}
                    `}
                  >
                    {step.label}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Demo Component with Controls
const EnquiryStatusDemo = () => {
  const [currentStep, ] = useState(2)
  const [customerName, setCustomerName] = useState("Loading...")
  const [phoneNumber, setPhoneNumber] = useState("Loading...")
  const searchParams = useSearchParams()
  

  useEffect(() => {
    const loadEnquiryData = async () => {
      let enquiry: EnquiryData | null = null
      const enquiryId = searchParams.get("enquiryId")

      if (enquiryId) {
        try {
          const response = await fetch(`/api/enquiries?id=${enquiryId}`)
          if (response.ok) {
            enquiry = await response.json()
          } else {
            console.error("Failed to fetch enquiry by ID:", response.statusText)
          }
        } catch (error) {
          console.error("Error fetching enquiry:", error)
        }
      }

      if (!enquiry) {
        // Fallback to localStorage if not found by ID or error
        const storedEnquiry = localStorage.getItem("currentEnquiry")
        if (storedEnquiry) {
          enquiry = JSON.parse(storedEnquiry)
        }
      }

      if (enquiry) {
        setCustomerName(enquiry.name)
        setPhoneNumber(enquiry.phone)
        // You might also want to set the currentStep based on enquiry.status here
        // For example:
        // const statusToStepMap: Record<string, number> = {
        //   "enquiry": 1,
        //   "itinerary_creation": 2,
        //   // ... map all statuses to steps
        // };
        // setCurrentStep(statusToStepMap[enquiry.status] || 1);
      } else {
        setCustomerName("N/A")
        setPhoneNumber("N/A")
      }
    }

    loadEnquiryData()
  }, [searchParams]) // Re-run when search params change

  return (
    <div className="w-full">
      {/* Main Component */}
      <EnquiryStatusProgress currentStep={currentStep} customerName={customerName} phoneNumber={phoneNumber} />
    </div>
  )
}

export default EnquiryStatusDemo
