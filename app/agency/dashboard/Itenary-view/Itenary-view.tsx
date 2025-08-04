"use client"

import { useState, useEffect, Suspense } from "react"
import { MapPin, Calendar, Users, Download, Edit, Share2, ChevronDown, ChevronUp } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"
import Image from "next/image"


// Define types for the itinerary data
interface Activity {
  time: string
  title: string
  type: string
  description: string
  image?: string
}

interface DayItinerary {
  day: number
  date: string
  title: string
  activities: Activity[]
}

interface Accommodation {
  name: string
  rating: number
  nights: number
  image: string
}

interface BudgetEstimation {
  amount: number
  currency: string
  costTourist: number
}

interface EnquiryDetails {
  description: string
}

// Updated ItineraryData interface to match backend structure
interface ItineraryData {
  id: string
  enquiryId: string
  location: string // This will be derived from enquiry.locations
  numberOfDays: string // This will be derived from enquiry.estimatedDates
  travelStyle: string // This will be derived from enquiry.tourType
  budgetEstimation: BudgetEstimation
  accommodation: Accommodation[] // Now directly from DB
  dailyItinerary: DayItinerary[] // Now directly from DB
  enquiryDetails: EnquiryDetails // This will be derived from enquiry.notes
  // Fields directly from Itinerary model
  destinations: string
  startDate: string
  endDate: string
  travelType: string
  adults: number
  children: number
  under6: number
  from7to12: number
  flightsRequired: string
  pickupLocation: string | null
  dropLocation: string | null
  currency: string
  budget: number
  activityPreferences: string
  hotelPreferences: string
  mealPreference: string
  dietaryPreference: string
  transportPreferences: string
  travelingWithPets: string
  additionalRequests: string | null
  moreDetails: string | null
  mustSeeSpots: string | null
  pacePreference: string | null
  status: string
  createdAt: string
  updatedAt: string
  enquiry: {
    id: string
    name: string
    phone: string
    email: string
    locations: string
    tourType: string
    estimatedDates: string
    currency: string
    budget: number
    enquiryDate: string
    assignedStaff: string | null
    pointOfContact: string | null
    notes: string | null
    // Add other enquiry fields if needed
  }
}

const staffMembers = ["Kevin Blake", "Maria Rodriguez", "Priya Sharma", "Ahmed Khan", "Emily Johnson"]

function ItineraryViewContent() {
  const [itineraryData, setItineraryData] = useState<ItineraryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({ 1: true })
  const [showReassignStaffDialog, setShowReassignStaffDialog] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<string>("")
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchItineraryData = async () => {
      setLoading(true)
      try {
        // Use useSearchParams instead of window.location.search
        const enquiryId = searchParams.get("enquiryId")
        const itineraryId = searchParams.get("itineraryId")

        let apiUrl = ""
        if (itineraryId) {
          apiUrl = `/api/itineraries?id=${itineraryId}`
        } else if (enquiryId) {
          apiUrl = `/api/itineraries?enquiryId=${enquiryId}`
        } else {
          console.error("No enquiryId or itineraryId provided in URL.")
          setLoading(false)
          return
        }

        const response = await fetch(apiUrl)
        if (!response.ok) {
          throw new Error(`Failed to fetch itinerary: ${response.statusText}`)
        }

        const data = await response.json()
        const fetchedItinerary = Array.isArray(data) ? data[0] : data

        if (fetchedItinerary) {
          const mappedData: ItineraryData = {
            ...fetchedItinerary,
            location: fetchedItinerary.enquiry?.locations || "N/A",
            numberOfDays: fetchedItinerary.enquiry?.estimatedDates || "N/A",
            travelStyle: fetchedItinerary.enquiry?.tourType || "N/A",
            budgetEstimation: {
              amount: fetchedItinerary.enquiry?.budget || 0,
              currency: fetchedItinerary.enquiry?.currency || "USD",
              costTourist: 32.3,
            },
            enquiryDetails: {
              description:
                fetchedItinerary.moreDetails || fetchedItinerary.enquiry?.notes || "No additional details provided.",
            },
            dailyItinerary: fetchedItinerary.dailyItinerary || [],
            accommodation: fetchedItinerary.accommodation || [],
          }

          setItineraryData(mappedData)
          setSelectedStaff(fetchedItinerary.enquiry?.assignedStaff || "")
        } else {
          setItineraryData(null)
        }
      } catch (error) {
        console.error("Error fetching itinerary:", error)
        setItineraryData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchItineraryData()
  }, [searchParams])

  const toggleDayExpansion = (day: number) => {
    setExpandedDays((prev) => ({
      ...prev,
      [day]: !prev[day],
    }))
  }

  const handleEditPlan = () => {
    if (!itineraryData) return

    const queryParams = new URLSearchParams({
      enquiryId: itineraryData.enquiryId,
      edit: "true",
    })

    // Use window.location.href only on client side
    if (typeof window !== "undefined") {
      window.location.href = `/agency/dashboard/Itenary-form?${queryParams.toString()}`
    }
  }

  const handleExportPDF = () => {
    if (typeof window === "undefined") return

    const printContent = document.getElementById("itinerary-content")
    if (!printContent) return

    const originalContents = document.body.innerHTML
    const printArea = printContent.cloneNode(true) as HTMLElement

    document.body.innerHTML = ""
    document.body.appendChild(printArea)
    window.print()
    document.body.innerHTML = originalContents
    window.location.reload()
  }

  const handleShareToCustomer = () => {
    if (!itineraryData) {
      console.error("No enquiry data available to generate itinerary.")
      alert("Please select an enquiry first.")
      return
    }

    // Pass customer phone
    const customerPhone = itineraryData?.enquiry?.phone || "N/A"
    const queryParams = new URLSearchParams({
      enquiryId: itineraryData?.enquiryId || "",
      customerPhone,
    })

    if (typeof window !== "undefined") {
      window.location.href = `/agency/dashboard/share-customer?${queryParams.toString()}`
    }
  }

  const handleGenerateOtherPlan = () => {
    alert("Generating alternative plan...")
  }

  const handleReassignStaff = async () => {
    if (!itineraryData || !selectedStaff) return

    try {
      const response = await fetch("/api/enquiries", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: itineraryData.enquiryId,
          assignedStaff: selectedStaff,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to reassign staff")
      }

      setItineraryData((prev) => {
        if (!prev) return null
        return {
          ...prev,
          enquiry: {
            ...prev.enquiry,
            assignedStaff: selectedStaff,
          },
        }
      })

      setShowReassignStaffDialog(false)
      alert(`Staff reassigned to ${selectedStaff} successfully!`)
    } catch (error) {
      console.error("Error reassigning staff:", error)
      alert(`Failed to reassign staff: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  const getActivityIcon = (type: string) => {
    const icons: Record<string, string> = {
      "airport-arrival": "✈️",
      "airport-departure": "🛫",
      transfer: "🚗",
      "hotel-checkin": "🏨",
      "hotel-checkout": "🏨",
      meal: "🍽️",
      activity: "🎯",
      sightseeing: "📸",
      adventure: "🏔️",
      nature: "🌿",
      shopping: "🛍️",
    }
    return icons[type] || "📍"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center h-screen w-full ">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading itinerary...</p>
        </div>
      </div>
    )
  }

  if (!itineraryData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Itinerary not found</p>
        </div>
      </div>
    )
  }

  return (
    <div id="itineraries" className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Itinerary Details</h1>
            <div className="flex gap-3">
              <button
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2 border font-semibold border-gray-300 rounded-full hover:bg-gray-100 text-green-500"
              >
                <Download className="h-4 w-4" />
                Export
              </button>
              <button
                onClick={handleEditPlan}
                className="flex items-center gap-2 px-4 py-2 bg-light-orange hover:bg-yellow-500 text-white font-semibold rounded-full"
              >
                <Edit className="h-4 w-4" />
                Edit plan
              </button>
              <button
                onClick={() => setShowReassignStaffDialog(true)} // Open dialog
                className="px-4 py-2 border border-green-300 text-gray-600 rounded-lg hover:bg-gray-50"
              >
                Reassign Staff
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Enquiry Details Only */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow-lg rounded-lg relative overflow-hidden">
              <Image
                src="/bg-pic.png" // Use the provided image URL
                alt="Enquiry background"
                width={600}
                height={400}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div> {/* Blurred overlay */}
              <div className="p-6 relative z-10 pb-[327px]">
                <div className="flex items-center mb-4">
                  <span className="bg-gray-600/50 text-white text-xs px-3 py-1 rounded-full flex items-center gap-2">
                    <span className="text-lg">🤖</span> Enquiry
                  </span>
                </div>
                <div className="mt-6">
                  <p className="text-sm text-white leading-relaxed">{itineraryData.enquiryDetails.description}</p>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="mt-6 bg-white rounded-lg shadow">
              <div className="p-4">
                <h4 className="font-semibold mb-3 text-sm">Map</h4>
                <div className="relative">
                  <Image
                    src="/kashmir-map.png"
                    alt="Kashmir Map"
                    width={400}
                    height={384} // h-96 is 384px
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  {/* Map markers */}
                  <div className="absolute top-8 left-16 w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
                  <div className="absolute top-12 left-20 text-xs bg-white px-2 py-1 rounded shadow text-gray-800 font-medium">
                    Srinagar
                  </div>
                  <div className="absolute bottom-16 left-12 w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
                  <div className="absolute bottom-20 left-16 text-xs bg-white px-2 py-1 rounded shadow text-gray-800 font-medium">
                    Pahalgam
                  </div>
                  <div className="absolute top-20 right-16 w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-lg"></div>
                  <div className="absolute top-24 right-20 text-xs bg-white px-2 py-1 rounded shadow text-gray-800 font-medium">
                    Gulmarg
                  </div>
                  {/* Navigation controls */}
                  <div className="absolute top-4 right-4 flex flex-col gap-1">
                    <button className="w-8 h-8 bg-white rounded shadow flex items-center justify-center hover:bg-gray-50">
                      <span className="text-lg font-bold text-gray-600">{"+"}</span>
                    </button>
                    <button className="w-8 h-8 bg-white rounded shadow flex items-center justify-center hover:bg-gray-50">
                      <span className="text-lg font-bold text-gray-600">{"-"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3" id="itinerary-content">
            {/* Top Info Cards - Horizontal Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Location */}
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="text-xs text-gray-500 uppercase mb-1">LOCATION</div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{itineraryData.location}</span>
                </div>
              </div>

              {/* Number of Days */}
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="text-xs text-gray-500 uppercase mb-1">NUMBER OF DAY</div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{itineraryData.numberOfDays}</span>
                </div>
              </div>

              {/* Travel Style */}
              <div className="bg-white rounded-lg p-4 shadow">
                <div className="text-xs text-gray-500 uppercase mb-1">TRAVEL STYLE</div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">{itineraryData.travelStyle}</span>
                </div>
              </div>
            </div>

            {/* Budget and Accommodation Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Budget Estimation */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="font-semibold">Budget Estimation</h3>
                    <span className="text-gray-400">ℹ️</span>
                  </div>
                  <div className="flex items-baseline text-3xl font-bold text-violet-600 mb-2">
                    <span>$</span>
                    <span className="text-black ml-1">{itineraryData.budgetEstimation.amount.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Cost/Tourist: $ {itineraryData.budgetEstimation.costTourist}
                  </p>
                  <Select value={itineraryData.budgetEstimation.currency} onValueChange={() => {}}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">US Dollar</SelectItem>
                      <SelectItem value="EUR">Euro</SelectItem>
                      <SelectItem value="INR">Indian Rupee</SelectItem>
                    </SelectContent>
                  </Select>
                  {/* AI Assistant Section */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs">🤖</span>
                      </div>
                      <span className="font-medium text-sm">AI Assistant</span>
                    </div>
                    <p className="text-xs text-gray-600">Powered by intelligent budget estimation</p>
                  </div>
                </div>
              </div>

              {/* Accommodation */}
              <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="font-semibold">Accommodation</h3>
                    <span className="text-gray-400">ℹ️</span>
                  </div>
                  <div className="space-y-3">
                    {itineraryData.accommodation.map((hotel, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Image
                          src={hotel.image || "/placeholder.svg?height=60&width=80&query=hotel building"}
                          alt={hotel.name}
                          width={48}
                          height={36}
                          className="w-12 h-9 rounded object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{hotel.name}</p>
                          <div className="flex items-center gap-1">
                            {[...Array(hotel.rating)].map((_, i) => (
                              <span key={i} className="text-yellow-400 text-xs">
                                ⭐
                              </span>
                            ))}
                            <span className="text-xs text-gray-500">{hotel.rating} star</span>
                          </div>
                        </div>
                        <span className="text-sm font-medium">{hotel.nights} nights</span>
                      </div>
                    ))}
                  </div>
                  <button className="text-blue-600 text-sm mt-3 hover:underline">See all</button>
                </div>
              </div>
            </div>

            {/* Daily Itinerary */}
            <div className="bg-white rounded-lg shadow overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Daily Itinerary</h3>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleGenerateOtherPlan}
                      className="text-green-600 bg-white hover:bg-white  border-white  px-3 py-1 rounded text-sm flex items-center gap-1"
                    >
                      <Image
                        src="/Magic.png"
                        alt="Magic wand icon"
                        width={16}
                        height={16}
                        className="w-4 h-4 text-green-600"
                      />
                      Generate other plan
                    </Button>
                    <Button
                      onClick={handleShareToCustomer}
                      className="bg-gradient-to-r from-[#183F30] to-[#5BC17F] hover:from-[#183F30] hover:to-[#4CAF50] text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
                    >
                      <Share2 className="h-4 w-4" />
                      Share to customer
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  {itineraryData.dailyItinerary.map((day) => (
                    <div key={day.day} className=" rounded-lg">
                      <div
                        className="p-4 bg-gray-100 cursor-pointer flex justify-between items-center hover:bg-gray-200"
                        onClick={() => toggleDayExpansion(day.day)}
                      >
                        <div>
                          <h4 className="font-semibold">DAY {day.day}</h4>
                          <p className="text-sm text-gray-600">
                            {day.date} - {day.title}
                          </p>
                        </div>
                        {expandedDays[day.day] ? (
                          <ChevronUp className="h-5 w-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      {expandedDays[day.day] && (
                        <div className="p-4 space-y-4 bg-white">
                          {day.activities.map((activity, index) => (
                            <div key={index} className="flex gap-4 items-start">
                              <div className="text-sm font-medium text-gray-600 w-16 flex-shrink-0">
                                {activity.time}
                              </div>
                              <div className="flex-1 flex gap-3">
                                <div className="flex-shrink-0 mt-1">
                                  <span className="text-lg">{getActivityIcon(activity.type)}</span>
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-900">{activity.title}</h5>
                                  <p className="text-sm text-gray-600">{activity.description}</p>
                                </div>
                                {activity.image && (
                                  <Image
                                    src={activity.image || "/placeholder.svg?height=64&width=80&query=activity image"}
                                    alt={activity.title}
                                    width={80}
                                    height={64}
                                    className="w-20 h-16 rounded object-cover flex-shrink-0"
                                  />
                                )}
                              </div>
                              <button className="mb-3 text-blue-600 hover:text-blue-800 text-sm px-2 py-1 rounded hover:bg-blue-50 flex-shrink-0">
                                Details
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reassign Staff Dialog */}
      <Dialog open={showReassignStaffDialog} onOpenChange={setShowReassignStaffDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reassign Staff</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="staff" className="text-right">
                Staff
              </label>
              <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  {staffMembers.map((staff) => (
                    <SelectItem key={staff} value={staff}>
                      {staff}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReassignStaffDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleReassignStaff}>Reassign</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function ItineraryView() {
  return (
     <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading itinerary...</p>
          </div>
        </div>
      }
    >
      <ItineraryViewContent />
    </Suspense>
  )
}
