"use client"

import { useState, useEffect } from "react"
import { Calendar, FileText, X, Download, Send, Eye } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"

// Interface for DMC data from your API
interface DMC {
  id: string
  name: string
  primaryContact: string
  phoneNumber: string
  designation: string
  email: string
  status: string
  primaryCountry?: string
  destinationsCovered?: string
  cities?: string
}

interface SharedDMCItem {
  id: string
  dmcId: string
  status: "AWAITING_TRANSFER" | "VIEWED" | "AWAITING_INTERNAL_REVIEW" | "QUOTATION_RECEIVED" | "REJECTED"
  quotedPrice?: number
  lastUpdated?: string
  quotationAmount?: number
  markupPrice?: number
  commissionAmount?: number
  commissionType?: "FLAT" | "PERCENTAGE"
  notes?: string
  dmc?: DMC
}

interface SharedItinerary {
  id: string
  dateGenerated: string
  pdf: string
  pdfUrl?: string | null
  activeStatus: boolean
  enquiryId: string
  customerId?: string
  assignedStaffId?: string
  selectedDMCs: SharedDMCItem[]
}

interface CommunicationLog {
  id: string
  date: string
  status: string
  companyType: "DMC" | "Agency"
  feedback: string
  dmcName: string
}

const DMCAdminInterface = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const enquiryId = searchParams.get("enquiryId")
  const customerId = searchParams.get("customerId")

  const [itineraries, setItineraries] = useState<SharedItinerary[]>([])
  const [availableDMCs, setAvailableDMCs] = useState<DMC[]>([])
  const [selectedDMCForAdd, setSelectedDMCForAdd] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [addingDMC, setAddingDMC] = useState<string | null>(null)

  const [showCommunicationLog, setShowCommunicationLog] = useState(false)
  const [showUpdateStatus, setShowUpdateStatus] = useState(false)
  const [showSetMargin, setShowSetMargin] = useState(false)
  const [selectedDMCItem, setSelectedDMCItem] = useState<SharedDMCItem | null>(null)
  const [selectedItinerary, setSelectedItinerary] = useState<SharedItinerary | null>(null)

  const [statusDetails, setStatusDetails] = useState("Details sent")
  const [feedbackText, setFeedbackText] = useState("")
  const [commissionType, setCommissionType] = useState<"FLAT" | "PERCENTAGE">("FLAT")
  const [commissionAmount, setCommissionAmount] = useState("180")
  const [markupPrice, setMarkupPrice] = useState("1280")
  const [comments, setComments] = useState("")
  const [quotationPrice, setQuotationPrice] = useState("1100.00")

  const [communicationLogs, setCommunicationLogs] = useState<CommunicationLog[]>([])
  const [isSubmittingCommission, setIsSubmittingCommission] = useState(false)
  const [isShareToCustomerLoading, setIsShareToCustomerLoading] = useState(false)

  // PDF-related state
  const [showPDFPreview, setShowPDFPreview] = useState(false)
  const [selectedPDFUrl, setSelectedPDFUrl] = useState<string | null>(null)
  const [regeneratingPDF, setRegeneratingPDF] = useState<string | null>(null)

  // Calculate markup price dynamically
  const calculateMarkupPrice = () => {
    const quotation = parseFloat(quotationPrice) || 0
    const commission = parseFloat(commissionAmount) || 0
    
    if (commissionType === "PERCENTAGE") {
      const commissionValue = (quotation * commission) / 100
      return (quotation + commissionValue).toFixed(2)
    } else {
      return (quotation + commission).toFixed(2)
    }
  }

  // Update markup price when quotation or commission changes
  useEffect(() => {
    setMarkupPrice(calculateMarkupPrice())
  }, [quotationPrice, commissionAmount, commissionType, calculateMarkupPrice])

  // Fetch DMCs and shared itineraries from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch DMCs from your API endpoint
        const dmcResponse = await fetch("/api/auth/agency-add-dmc?limit=100")
        
        if (!dmcResponse.ok) {
          const errorData = await dmcResponse.text()
          console.error("DMC API Error:", errorData)
          throw new Error(`Failed to fetch DMCs: ${dmcResponse.statusText}`)
        }

        const dmcData = await dmcResponse.json()
        if (dmcData.success && dmcData.data) {
          setAvailableDMCs(dmcData.data)
        } else {
          console.warn("DMC API returned no data or unsuccessful response:", dmcData)
          setAvailableDMCs([])
        }

        // Fetch shared DMC data
        const params = new URLSearchParams()
        if (enquiryId) params.append("enquiryId", enquiryId)
        if (customerId) params.append("customerId", customerId)

        const sharedResponse = await fetch(`/api/share-dmc?${params.toString()}`)
        
        if (!sharedResponse.ok) {
          const errorData = await sharedResponse.text()
          console.error("Shared DMC API Error:", errorData)
          
          // Try to parse as JSON for better error info
          try {
            const errorJson = JSON.parse(errorData)
            throw new Error(errorJson.error || errorJson.details || `Failed to fetch shared DMCs: ${sharedResponse.statusText}`)
          } catch  {
            throw new Error(`Failed to fetch shared DMCs: ${sharedResponse.statusText}`)
          }
        }

        const sharedData = await sharedResponse.json()
        if (sharedData.success && sharedData.data) {
          setItineraries(sharedData.data)
          // Also update available DMCs if provided in the response
          if (sharedData.availableDMCs) {
            setAvailableDMCs(sharedData.availableDMCs)
          }
        } else {
          console.warn("Shared DMC API returned unsuccessful response:", sharedData)
          setError(sharedData.error || sharedData.details || "Failed to fetch shared DMCs")
        }

      } catch (err) {
        console.error("Error fetching data:", err)
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch data"
        setError(errorMessage)
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [enquiryId, customerId])

  const getDMCById = (dmcId: string) => {
    return availableDMCs.find((dmc) => dmc.id === dmcId)
  }

  // PDF Generation function
  const handleRegeneratePDF = async (itinerary: SharedItinerary) => {
    setRegeneratingPDF(itinerary.id)

    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enquiryId: enquiryId || itinerary.enquiryId,
          itineraryId: itinerary.id,
          formData: {
            customerName: "DMC Customer",
            destinations: ["Default Destination"],
            startDate: new Date().toISOString().split("T")[0],
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            adults: 2,
            travelType: "Premium",
            currency: "USD",
            budget: 2000,
            // Add other form data as needed
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to regenerate PDF")
      }

      const result = await response.json()

      // Update the itinerary with new PDF URL
      setItineraries((prev) =>
        prev.map((item) => 
          item.id === itinerary.id
            ? { ...item, pdfUrl: result.pdfUrl, pdf: "D" }
            : item
        )
      )

      toast({
        title: "Success",
        description: "PDF regenerated successfully",
      })
    } catch (error) {
      console.error("Error regenerating PDF:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to regenerate PDF",
        variant: "destructive",
      })
    } finally {
      setRegeneratingPDF(null)
    }
  }

  // View PDF function
  const handleViewPDF = (pdfUrl: string | null) => {
    if (pdfUrl) {
      setSelectedPDFUrl(pdfUrl)
      setShowPDFPreview(true)
    } else {
      toast({
        title: "Error",
        description: "PDF not available",
        variant: "destructive",
      })
    }
  }

  // Download PDF function
  const handleDownloadPDF = (pdfUrl: string | null, filename: string) => {
    if (pdfUrl) {
      const link = document.createElement("a")
      link.href = pdfUrl
      link.download = filename || "itinerary.pdf"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      toast({
        title: "Error",
        description: "PDF not available",
        variant: "destructive",
      })
    }
  }

  const toggleActiveStatus = async (itineraryId: string, currentStatus: boolean) => {
    try {
      const response = await fetch("/api/share-dmc", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: itineraryId,
          action: "toggleActive",
          isActive: !currentStatus,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || result.details || "Failed to update status")
      }

      setItineraries((prev) =>
        prev.map((itin) => (itin.id === itineraryId ? { ...itin, activeStatus: !itin.activeStatus } : itin)),
      )

      toast({
        title: "Success",
        description: `Itinerary ${!currentStatus ? "activated" : "deactivated"}`,
      })
    } catch (error) {
      console.error("Error toggling status:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update status",
        variant: "destructive",
      })
    }
  }

  const addDMCToItinerary = async (itineraryId: string, dmcId: string) => {
    if (!dmcId) return

    try {
      setAddingDMC(dmcId)

      const response = await fetch("/api/share-dmc", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: itineraryId,
          action: "addDMC",
          dmcId: dmcId,
          enquiryId: enquiryId,
          dateGenerated: new Date().toISOString().split("T")[0],
          pdfPath: "/itinerary.pdf", // You might want to use the actual PDF path from the itinerary
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || result.details || "Failed to add DMC")
      }

      // Update local state
      setItineraries((prev) =>
        prev.map((itin) =>
          itin.id === itineraryId
            ? {
                ...itin,
                selectedDMCs: [...itin.selectedDMCs, ...result.data.selectedDMCs],
              }
            : itin,
        ),
      )

      setSelectedDMCForAdd("")

      // Show email result in toast
      if (result.emailResult) {
        const { dmcName, email, sent, error: emailError } = result.emailResult
        if (sent) {
          toast({
            title: "Success",
            description: `DMC "${dmcName}" added and email sent to ${email}`,
          })
        } else {
          toast({
            title: "Warning",
            description: `DMC "${dmcName}" added but email failed: ${emailError}`,
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "Success",
          description: "DMC added to itinerary",
        })
      }
    } catch (error) {
      console.error("Error adding DMC:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add DMC",
        variant: "destructive",
      })
    } finally {
      setAddingDMC(null)
    }
  }

  const handleViewUpdates = (dmcItem: SharedDMCItem, itinerary: SharedItinerary) => {
    setSelectedDMCItem(dmcItem)
    setSelectedItinerary(itinerary)
    setCommunicationLogs([])
    setShowCommunicationLog(true)
  }

  const handleUpdateStatus = (dmcItem: SharedDMCItem) => {
    setSelectedDMCItem(dmcItem)
    setStatusDetails(dmcItem.status.replace("_", " "))
    setFeedbackText(dmcItem.notes || "")
    setShowUpdateStatus(true)
  }

  const handleSetMargin = (dmcItem: SharedDMCItem) => {
    setSelectedDMCItem(dmcItem)
    setQuotationPrice(dmcItem.quotationAmount?.toString() || "1100.00")
    setCommissionType(dmcItem.commissionType || "FLAT")
    setCommissionAmount(dmcItem.commissionAmount?.toString() || "180")
    setMarkupPrice(dmcItem.markupPrice?.toString() || calculateMarkupPrice())
    setComments(dmcItem.notes || "")
    setShowSetMargin(true)
  }

  const handleShareToCustomer = async (itinerary: SharedItinerary, dmcItem: SharedDMCItem) => {
    try {
      setIsShareToCustomerLoading(true)

      const response = await fetch("/api/share-dmc", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: itinerary.id,
          action: "shareToCustomer",
          enquiryId: enquiryId || itinerary.enquiryId,
          customerId: customerId || itinerary.customerId,
          dmcId: dmcItem.dmcId,
          itineraryId: itinerary.id,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || result.details || "Failed to share to customer")
      }

      toast({
        title: "Success",
        description: "Quote shared with customer successfully",
      })

      // Do NOT redirect here!
      // router.push(`/agency/dashboard/share-customer?${params.toString()}`)

    } catch (error) {
      console.error("Error sharing to customer:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to share quote with customer",
        variant: "destructive",
      })
    } finally {
      setIsShareToCustomerLoading(false)
    }
  }

  const updateDMCStatus = async () => {
    if (!selectedDMCItem) return

    try {
      const response = await fetch("/api/share-dmc", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedDMCItem.id,
          action: "updateDMCStatus",
          itemId: selectedDMCItem.id,
          status: statusDetails.replace(" ", "_").toUpperCase(),
          notes: feedbackText,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || result.details || "Failed to update status")
      }

      // Update local state
      setItineraries((prev) =>
        prev.map((itin) => ({
          ...itin,
          selectedDMCs: itin.selectedDMCs.map((dmc) =>
            dmc.id === selectedDMCItem.id
              ? {
                  ...dmc,
                  status: statusDetails.replace(" ", "_").toUpperCase() as SharedDMCItem["status"],
                  notes: feedbackText,
                }
              : dmc,
          ),
        })),
      )

      setShowUpdateStatus(false)
      toast({
        title: "Success",
        description: "DMC status updated",
      })
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update status",
        variant: "destructive",
      })
    }
  }

  const addCommission = async () => {
    if (!selectedDMCItem || !enquiryId) return

    try {
      setIsSubmittingCommission(true)

      const response = await fetch("/api/share-dmc", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: selectedItinerary?.id,
          action: "addCommission",
          enquiryId: enquiryId,
          dmcId: selectedDMCItem.dmcId,
          quotationAmount: parseFloat(quotationPrice),
          commissionType: commissionType,
          commissionAmount: parseFloat(commissionAmount),
          markupPrice: parseFloat(markupPrice),
          comments: comments,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || result.details || "Failed to add commission")
      }

      // Update local state with commission data
      setItineraries((prev) =>
        prev.map((itin) => ({
          ...itin,
          selectedDMCs: itin.selectedDMCs.map((dmc) =>
            dmc.id === selectedDMCItem.id
              ? {
                  ...dmc,
                  quotationAmount: parseFloat(quotationPrice),
                  commissionAmount: parseFloat(commissionAmount),
                  commissionType: commissionType,
                  markupPrice: parseFloat(markupPrice),
                  notes: comments,
                }
              : dmc,
          ),
        })),
      )

      setShowSetMargin(false)
      toast({
        title: "Success",
        description: "Commission added successfully",
      })
    } catch (error) {
      console.error("Error adding commission:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add commission",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingCommission(false)
    }
  }

  const handlePayDMC = () => {
    router.push("/agency/dashboard/share-dmc")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading DMC data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold">Error Loading Data</p>
          <p className="mt-2">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="mt-4"
            variant="outline"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            Handled by: <span className="font-medium text-gray-800">AStaff2</span>
            {enquiryId && (
              <span className="ml-4">
                Enquiry: <span className="font-medium text-gray-800">{enquiryId}</span>
              </span>
            )}
          </div>
          <button className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-md text-sm font-medium">
            Reassign Staff
          </button>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="bg-green-100 px-6 py-3 grid grid-cols-5 text-sm font-medium text-gray-700">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Date generated
            </div>
            <div className="text-center">PDF</div>
            <div className="text-center">PDF Actions</div>
            <div className="text-center">Active Status</div>
            <div className="text-center">Send to DMC</div>
          </div>

          <div className="divide-y divide-gray-200">
            {itineraries.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                No shared itineraries found
              </div>
            ) : (
              itineraries
                .filter((itinerary) => itinerary.activeStatus || itinerary.selectedDMCs.length > 0)
                .map((itinerary) => (
                  <div
                    key={itinerary.id}
                    className={`px-6 py-4 grid grid-cols-5 items-center ${
                      itinerary.activeStatus ? "bg-orange-50" : ""
                    }`}
                  >
                    <div className="text-sm text-gray-600">{itinerary.dateGenerated}</div>
                    <div className="text-center">
                      <div
                        className={`w-8 h-8 rounded flex items-center justify-center text-white font-bold mx-auto ${
                          itinerary.pdf === "D" ? "bg-yellow-500" : "bg-gray-800"
                        }`}
                      >
                        {itinerary.pdf}
                      </div>
                      {!itinerary.pdfUrl && (
                        <button
                          onClick={() => handleRegeneratePDF(itinerary)}
                          disabled={regeneratingPDF === itinerary.id}
                          className="text-xs text-blue-600 hover:underline disabled:opacity-50 mt-1"
                        >
                          {regeneratingPDF === itinerary.id ? "Generating..." : "Generate PDF"}
                        </button>
                      )}
                    </div>
                    <div className="text-center">
                      <div className="flex gap-1 justify-center">
                        {itinerary.pdfUrl && (
                          <>
                            <button
                              onClick={() => handleViewPDF(itinerary.pdfUrl ?? null)}
                              className="flex items-center gap-1 px-2 py-1 bg-blue-500 hover:bg-blue-600 rounded text-xs text-white transition-colors"
                              disabled={!itinerary.pdfUrl}
                            >
                              <Eye className="w-3 h-3" />
                              View
                            </button>
                            <button
                              onClick={() => handleDownloadPDF(itinerary.pdfUrl ?? null, `itinerary-${itinerary.id}.pdf`)}
                              className="flex items-center gap-1 px-2 py-1 bg-gray-500 hover:bg-gray-600 rounded text-xs text-white transition-colors"
                              disabled={!itinerary.pdfUrl}
                            >
                              <Download className="w-3 h-3" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={itinerary.activeStatus}
                          onChange={() => toggleActiveStatus(itinerary.id, itinerary.activeStatus)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-400"></div>
                      </label>
                    </div>
                    <div className="flex gap-2 items-center justify-center flex-wrap">
                      <Select
                        value={selectedDMCForAdd}
                        onValueChange={(value: string) => {
                          setSelectedDMCForAdd(value)
                          if (value) {
                            addDMCToItinerary(itinerary.id, value)
                          }
                        }}
                        disabled={addingDMC !== null}
                      >
                        <SelectTrigger className="w-32 text-xs">
                          <SelectValue placeholder={addingDMC ? "Adding..." : "Add DMC..."} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableDMCs
                            .filter((dmc) => dmc.status === "Active")
                            .filter((dmc) => !itinerary.selectedDMCs.some((item) => item.dmcId === dmc.id))
                            .map((dmc) => (
                              <SelectItem key={dmc.id} value={dmc.id}>
                                {dmc.name}
                              </SelectItem>
                            ))}
                          {availableDMCs.filter((dmc) => dmc.status === "Active").length === 0 && (
                            <SelectItem value="" disabled>No active DMCs available</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* DMC Cards Section */}
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Itinerary Quote & Margin Overview</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {itineraries.flatMap((itinerary) =>
            itinerary.selectedDMCs.map((dmcItem) => {
              const dmc = dmcItem.dmc || getDMCById(dmcItem.dmcId)
              if (!dmc) return null

              const getCardStatus = () => {
                switch (dmcItem.status) {
                  case "VIEWED":
                    return "Itinerary viewed"
                  case "AWAITING_INTERNAL_REVIEW":
                    return "Awaiting internal review"
                  case "QUOTATION_RECEIVED":
                    return "Quotation received"
                  case "REJECTED":
                    return "Rejected"
                  default:
                    return "Itinerary sent"
                }
              }

              const getCardColor = () => {
                switch (dmcItem.status) {
                  case "QUOTATION_RECEIVED":
                    return "bg-white border-l-4 border-green-500"
                  case "REJECTED":
                    return "bg-white border-l-4 border-red-500"
                  case "VIEWED":
                    return "bg-white border-l-4 border-blue-500"
                  default:
                    return "bg-white border-l-4 border-gray-300"
                }
              }

              const hasCommission = dmcItem.quotationAmount && dmcItem.markupPrice

              return (
                <Card key={dmcItem.id} className={`shadow-sm ${getCardColor()}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center mr-3 text-white font-bold">
                        {dmc.name.charAt(0)}
                      </div>
                      <div>
                        <CardTitle className="text-base font-semibold">{dmc.name}</CardTitle>
                        <p className="text-sm text-gray-500">
                          {dmcItem.status === "AWAITING_INTERNAL_REVIEW" ? "Not responded" : "Manually entered"}
                        </p>
                        {dmc.email && (
                          <p className="text-xs text-gray-400">{dmc.email}</p>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="mb-4">
                      <h3 className="font-semibold text-lg mb-1">{getCardStatus()}</h3>
                      <p className="text-sm text-gray-500">Itinerary sent on : {itinerary.dateGenerated}</p>
                      {dmcItem.status === "QUOTATION_RECEIVED" && dmcItem.quotationAmount && (
                        <div className="mt-2 space-y-1">
                          <p className="text-sm font-semibold text-gray-900">
                            Quoted Price : <span className="text-lg">${dmcItem.quotationAmount}</span>
                          </p>
                          {hasCommission && (
                            <p className="text-sm font-semibold text-blue-600">
                              Final Price : <span className="text-lg">${dmcItem.markupPrice}</span>
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1"
                        onClick={() => handleViewUpdates(dmcItem, itinerary)}
                      >
                        View updates
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-1"
                        onClick={() => handleUpdateStatus(dmcItem)}
                      >
                        Update Status
                      </Button>
                      {dmcItem.status === "QUOTATION_RECEIVED" && (
                        <>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1"
                            onClick={() => handleSetMargin(dmcItem)}
                          >
                            Set margin
                          </Button>
                          {hasCommission && (
                            <>
                              <Button
                                size="sm"
                                className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-3 py-1"
                                onClick={() => handleShareToCustomer(itinerary, dmcItem)}
                                disabled={isShareToCustomerLoading}
                              >
                                <Send className="w-3 h-3 mr-1" />
                                Share to customer
                              </Button>
                              <Button 
                                size="sm" 
                                className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-1"
                                onClick={handlePayDMC}
                              >
                                Pay to DMC
                              </Button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            }),
          )}
        </div>

        {itineraries.every(itinerary => itinerary.selectedDMCs.length === 0) && (
          <div className="text-center py-8 text-gray-500">
            <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">No DMCs added yet</p>
            <p className="text-sm">Use the dropdown above to add DMCs to your itinerary</p>
          </div>
        )}

        {/* Communication Log Modal */}
        {showCommunicationLog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Communication Log: Status Updates & Responses</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    DMC: {selectedDMCItem && getDMCById(selectedDMCItem.dmcId)?.name}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowCommunicationLog(false)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-green-100">
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Feedback received</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Status</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Company Type</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Feedback</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {communicationLogs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-gray-500">
                          No communication logs found
                        </td>
                      </tr>
                    ) : (
                      communicationLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-gray-50">
                          <td className="p-3 text-sm text-gray-600">{log.date}</td>
                          <td className="p-3 text-sm text-gray-600">{log.status}</td>
                          <td className="p-3 text-sm text-gray-600">{log.companyType}</td>
                          <td className="p-3 text-sm text-gray-600">{log.feedback}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Update Status Modal */}
        {showUpdateStatus && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Update status and add feedbacks</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowUpdateStatus(false)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {selectedDMCItem && getDMCById(selectedDMCItem.dmcId)?.name.charAt(0)}
                    </span>
                  </div>
                  <span className="font-medium text-gray-800">
                    {selectedDMCItem && getDMCById(selectedDMCItem.dmcId)?.name}
                  </span>
                </div>
                <div>
                  <Select value={statusDetails} onValueChange={setStatusDetails}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Details sent">Details sent</SelectItem>
                      <SelectItem value="Awaiting response">Awaiting response</SelectItem>
                      <SelectItem value="Under review">Under review</SelectItem>
                      <SelectItem value="Quotation received">Quotation received</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    rows={4}
                    className="w-full"
                    placeholder="Enter feedback or notes..."
                  />
                </div>
                <Button onClick={updateDMCStatus} className="w-full bg-green-600 hover:bg-green-700">
                  Update Status
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Set Margin Modal */}
        {showSetMargin && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-800">Add commission</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    DMC: {selectedDMCItem && getDMCById(selectedDMCItem.dmcId)?.name}
                  </p>
                  <p className="text-sm text-gray-600">Quotation received</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowSetMargin(false)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quotation received</label>
                  <div className="flex">
                    <span className="flex items-center px-3 border border-r-0 border-gray-300 rounded-l-md bg-gray-50 text-gray-500">
                      $
                    </span>
                    <Input
                      type="number"
                      step="0.01"
                      value={quotationPrice}
                      onChange={(e) => setQuotationPrice(e.target.value)}
                      className="rounded-l-none"
                      placeholder="Enter quotation amount"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Commission type</label>
                    <Select value={commissionType} onValueChange={(value: "FLAT" | "PERCENTAGE") => setCommissionType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="FLAT">Flat commission</SelectItem>
                        <SelectItem value="PERCENTAGE">Percentage commission</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Commission</label>
                    <div className="flex">
                      <Input
                        type="number"
                        step="0.01"
                        value={commissionAmount}
                        onChange={(e) => setCommissionAmount(e.target.value)}
                        className="rounded-r-none"
                        placeholder={commissionType === "PERCENTAGE" ? "10" : "180"}
                      />
                      <div className="flex items-center px-3 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm">
                        {commissionType === "PERCENTAGE" ? "%" : "$"}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Markup price</label>
                    <div className="flex">
                      <Input
                        type="text"
                        value={markupPrice}
                        readOnly
                        className="rounded-r-none bg-gray-50"
                        placeholder="1280"
                      />
                      <div className="flex items-center px-3 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm">
                        $
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
                  <Textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={3}
                    placeholder="Enter comments..."
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowSetMargin(false)}
                    disabled={isSubmittingCommission}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={addCommission} 
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isSubmittingCommission}
                  >
                    {isSubmittingCommission ? "Adding..." : "Add commission"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PDF Preview Modal */}
        {showPDFPreview && selectedPDFUrl && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-4 w-full max-w-4xl mx-4 h-5/6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">PDF Preview</h3>
                <button 
                  onClick={() => setShowPDFPreview(false)} 
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <iframe 
                src={selectedPDFUrl} 
                className="w-full h-full border rounded" 
                title="PDF Preview" 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DMCAdminInterface