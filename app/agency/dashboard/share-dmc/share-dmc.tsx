"use client"

import { useState, useEffect } from "react"
import { FileText, Calendar, X, Eye, Edit, Share2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

interface DMC {
  id: string
  name: string
  primaryContact: string
  email: string
  status: string
  primaryCountry: string
  destinationsCovered: string
  cities: string
}

interface SharedItinerary {
  id: string
  dateGenerated: string
  pdf: string
  activeStatus: boolean
  enquiryId: string
  customerId?: string
  assignedStaffId: string
  selectedDMCs: SharedDMCItem[]
}

interface SharedDMCItem {
  id: string
  dmcId: string
  status: "AWAITING_TRANSFER" | "VIEWED" | "AWAITING_INTERNAL_REVIEW" | "QUOTATION_RECEIVED" | "REJECTED"
  dmc: DMC
  lastUpdated?: string
  quotationAmount?: number
  notes?: string
}

interface CommunicationLog {
  id: string
  date: string
  status: string
  companyType: "DMC" | "Agency"
  feedback: string
  dmcName: string
}

const ShareDMCTable = () => {
  const router = useRouter()
  const [sharedItineraries, setSharedItineraries] = useState<SharedItinerary[]>([])
  const [availableDMCs, setAvailableDMCs] = useState<DMC[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDMCForAdd, setSelectedDMCForAdd] = useState<string>("")

  // Modal states
  const [showCommunicationLog, setShowCommunicationLog] = useState(false)
  const [showUpdateStatus, setShowUpdateStatus] = useState(false)
  const [showSetMargin, setShowSetMargin] = useState(false)
  const [selectedDMCItem, setSelectedDMCItem] = useState<SharedDMCItem | null>(null)
  const [selectedItinerary, setSelectedItinerary] = useState<SharedItinerary | null>(null)

  // Form states for modals
  const [statusDetails, setStatusDetails] = useState("Details sent")
  const [feedbackText, setFeedbackText] = useState("")
  const [commissionType, setCommissionType] = useState("Flat commission")
  const [commissionAmount, setCommissionAmount] = useState("180")
  const [markupPrice, setMarkupPrice] = useState("1280")
  const [comments, setComments] = useState("")
  const [quotationPrice, setQuotationPrice] = useState("1100.00")

  // Communication log data
  const [communicationLogs, setCommunicationLogs] = useState<CommunicationLog[]>([])

  // Fetch shared itineraries and DMCs on component mount
  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch available DMCs from add-dmc section
      const dmcResponse = await fetch("/api/auth/agency-add-dmc?limit=100")
      if (dmcResponse.ok) {
        const dmcData = await dmcResponse.json()
        setAvailableDMCs(dmcData.data || [])
      }

      // Fetch shared itineraries
      const sharedResponse = await fetch("/api/shared-dmc")
      if (sharedResponse.ok) {
        const sharedData = await sharedResponse.json()
        setSharedItineraries(sharedData.data || [])
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const toggleActiveStatus = async (itineraryId: string, currentStatus: boolean) => {
    try {
      const response = await fetch("/api/shared-dmc", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: itineraryId,
          action: "toggleActive",
          isActive: !currentStatus,
        }),
      })

      if (response.ok) {
        setSharedItineraries((prev) =>
          prev.map((item) => (item.id === itineraryId ? { ...item, activeStatus: !currentStatus } : item)),
        )
        toast({
          title: "Success",
          description: `Itinerary ${!currentStatus ? "activated" : "deactivated"}`,
        })
      }
    } catch (error) {
      console.error("Error toggling status:", error)
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      })
    }
  }

  const addDMCToItinerary = async (itineraryId: string, dmcId: string) => {
    if (!dmcId) return

    try {
      const response = await fetch("/api/shared-dmc", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: itineraryId,
          action: "addDMC",
          dmcId: dmcId,
          status: "AWAITING_TRANSFER",
        }),
      })

      if (response.ok) {
        // Refresh data to get updated state
        await fetchData()
        setSelectedDMCForAdd("")
        toast({
          title: "Success",
          description: "DMC added to itinerary",
        })
      }
    } catch (error) {
      console.error("Error adding DMC:", error)
      toast({
        title: "Error",
        description: "Failed to add DMC",
        variant: "destructive",
      })
    }
  }

  const handleViewUpdates = (dmcItem: SharedDMCItem, itinerary: SharedItinerary) => {
    setSelectedDMCItem(dmcItem)
    setSelectedItinerary(itinerary)

    // Mock communication logs - replace with actual API call
    setCommunicationLogs([
      {
        id: "1",
        date: "01-04-2025",
        status: dmcItem.status.replace("_", " "),
        companyType: "DMC",
        feedback: dmcItem.notes || "",
        dmcName: dmcItem.dmc.name,
      },
    ])

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
    setShowSetMargin(true)
  }

  const handleShareToCustomer = (itinerary: SharedItinerary) => {
    // Navigate to share-customer with proper query parameters
    const params = new URLSearchParams()
    if (itinerary.enquiryId) {
      params.append("enquiryId", itinerary.enquiryId)
    }
    if (itinerary.customerId) {
      params.append("customerId", itinerary.customerId)
    }
    // Pass the itinerary ID so the share-customer dashboard can pre-select it
    params.append("itineraryId", itinerary.id)

    router.push(`/agency/dashboard/share-customer?${params.toString()}`)
  }

  const updateDMCStatus = async () => {
    if (!selectedDMCItem) return

    try {
      const response = await fetch("/api/shared-dmc", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedDMCItem.id,
          action: "updateDMCStatus",
          status: statusDetails.replace(" ", "_").toUpperCase(),
          notes: feedbackText,
        }),
      })

      if (response.ok) {
        await fetchData()
        setShowUpdateStatus(false)
        toast({
          title: "Success",
          description: "DMC status updated",
        })
      }
    } catch (error) {
      console.error("Error updating status:", error)
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "AWAITING_TRANSFER":
        return "bg-yellow-100 text-yellow-800"
      case "VIEWED":
        return "bg-blue-100 text-blue-800"
      case "AWAITING_INTERNAL_REVIEW":
        return "bg-orange-100 text-orange-800"
      case "QUOTATION_RECEIVED":
        return "bg-green-100 text-green-800"
      case "REJECTED":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
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
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="bg-green-100 px-6 py-3 flex items-center justify-between text-sm font-medium text-gray-700">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Date generated
            </div>
            <div>PDF</div>
            <div>Active Status</div>
            <div>Send to DMC</div>
          </div>

          <div className="divide-y divide-gray-200">
            {sharedItineraries.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                No shared itineraries found
              </div>
            ) : (
              sharedItineraries.map((itinerary) => (
                <div
                  key={itinerary.id}
                  className={`px-6 py-4 flex items-center justify-between ${
                    itinerary.activeStatus ? "bg-yellow-50" : ""
                  }`}
                >
                  <div className="text-sm text-gray-600">{itinerary.dateGenerated}</div>
                  <div>
                    <FileText className={`w-5 h-5 ${itinerary.pdf === "D" ? "text-yellow-600" : "text-gray-600"}`} />
                  </div>
                  <div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={itinerary.activeStatus}
                        onChange={() => toggleActiveStatus(itinerary.id, itinerary.activeStatus)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                    </label>
                  </div>
                  <div className="flex gap-2 items-center">
                    {itinerary.selectedDMCs.map((dmcItem) => (
                      <Badge key={dmcItem.id} className={`text-xs ${getStatusColor(dmcItem.status)}`}>
                        {dmcItem.status.replace("_", " ")} - {dmcItem.dmc.name}
                      </Badge>
                    ))}
                    <Select
                      value={selectedDMCForAdd}
                      onValueChange={(value: string) => {
                        setSelectedDMCForAdd(value)
                        if (value) {
                          addDMCToItinerary(itinerary.id, value)
                        }
                      }}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Add DMC..." />
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
          {sharedItineraries.flatMap((itinerary) =>
            itinerary.selectedDMCs.map((dmcItem) => (
              <Card key={dmcItem.id} className="bg-white shadow-sm">
                <CardHeader className="pb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center mr-3">
                      <Image
                        src="/placeholder.svg?height=40&width=40"
                        alt={dmcItem.dmc.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    </div>
                    <div>
                      <CardTitle className="text-base">{dmcItem.dmc.name}</CardTitle>
                      <p className="text-sm text-gray-500">
                        {dmcItem.dmc.primaryCountry} • {dmcItem.dmc.destinationsCovered}
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="mb-4">
                    <Badge className={`text-xs ${getStatusColor(dmcItem.status)}`}>
                      {dmcItem.status.replace("_", " ")}
                    </Badge>
                    <p className="text-sm text-gray-500 mt-2">Last updated: {dmcItem.lastUpdated || "Recently"}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewUpdates(dmcItem, itinerary)}
                      className="text-xs"
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View updates
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleUpdateStatus(dmcItem)} className="text-xs">
                      <Edit className="w-3 h-3 mr-1" />
                      Update Status
                    </Button>
                    {dmcItem.status === "QUOTATION_RECEIVED" && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSetMargin(dmcItem)}
                          className="text-xs"
                        >
                          Set margin
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleShareToCustomer(itinerary)}
                          className="text-xs"
                        >
                          <Share2 className="w-3 h-3 mr-1" />
                          Share to customer
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )),
          )}
        </div>

        {/* Communication Log Modal */}
        {showCommunicationLog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Communication Log: Status Updates & Responses</h2>
                  <p className="text-sm text-gray-600 mt-1">DMC: {selectedDMCItem?.dmc.name}</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowCommunicationLog(false)}>
                  <X className="w-6 h-6" />
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-green-100">
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Date</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Status</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Company Type</th>
                      <th className="text-left p-3 text-sm font-medium text-gray-700">Feedback</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {communicationLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50">
                        <td className="p-3 text-sm text-gray-600">{log.date}</td>
                        <td className="p-3">
                          <Badge className={`text-xs ${getStatusColor(log.status.replace(" ", "_").toUpperCase())}`}>
                            {log.status}
                          </Badge>
                        </td>
                        <td className="p-3 text-sm text-gray-600">{log.companyType}</td>
                        <td className="p-3 text-sm text-gray-600">{log.feedback}</td>
                      </tr>
                    ))}
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
                  <Image
                    src="/placeholder.svg?height=40&width=40"
                    alt="Staff"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <span className="font-medium text-gray-800">Lisa Ray</span>
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
                  <textarea
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    placeholder="Enter feedback..."
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
            <div className="bg-white rounded-lg p-6 w-full max-w-5xl mx-4">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">Add commission</h2>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-gray-600">DMC: {selectedDMCItem?.dmc.name}</p>
                    <Button
                      onClick={() => selectedItinerary && handleShareToCustomer(selectedItinerary)}
                      className="bg-green-800 hover:bg-green-700 text-xs px-3 py-1 ml-auto"
                    >
                      Share to customer
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">Quotation received</p>
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
                    <input
                      type="text"
                      value={quotationPrice}
                      onChange={(e) => setQuotationPrice(e.target.value)}
                      className="flex-1 p-3 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter quotation amount"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Commission type</label>
                    <Select value={commissionType} onValueChange={setCommissionType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Flat commission">Flat commission</SelectItem>
                        <SelectItem value="Percentage commission">Percentage commission</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Commission {commissionType === "Percentage commission" ? "(%)" : ""}
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={commissionAmount}
                        onChange={(e) => setCommissionAmount(e.target.value)}
                        className="flex-1 p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder={commissionType === "Percentage commission" ? "Enter percentage" : "Enter amount"}
                      />
                      <Select>
                        <SelectTrigger className="w-20 rounded-l-none border-l-0">
                          <SelectValue placeholder={commissionType === "Percentage commission" ? "%" : "$"} />
                        </SelectTrigger>
                        <SelectContent>
                          {commissionType === "Percentage commission" ? (
                            <SelectItem value="%">%</SelectItem>
                          ) : (
                            <>
                              <SelectItem value="USD">USD</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                              <SelectItem value="GBP">GBP</SelectItem>
                            </>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Markup price</label>
                    <div className="flex">
                      <input
                        type="text"
                        value={markupPrice}
                        onChange={(e) => setMarkupPrice(e.target.value)}
                        readOnly
                        className="flex-1 p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50"
                      />
                      <Select>
                        <SelectTrigger className="w-20 rounded-l-none border-l-0">
                          <SelectValue placeholder="USD" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
                  <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    placeholder="Enter comments..."
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => setShowSetMargin(false)} className="bg-green-600 hover:bg-green-700">
                    Add commission
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ShareDMCTable
