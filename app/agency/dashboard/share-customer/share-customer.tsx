"use client"

import type React from "react"
import { useState, useEffect, Suspense} from "react"
import { Download, Upload, Plus, X, AlertCircle, CheckCircle, Clock, FileText } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useSearchParams } from "next/navigation"

import type {
  Customer,
  Itinerary,
  CustomerFeedback,
  SentItinerary,
  FormData,
  NewNote,
  CustomerDashboardData,
} from "@/types/customer"
import LoadingComponent from "../Itenary-form/loading"

const ShareCustomerDashboardContent = () => {
  const searchParams = useSearchParams()
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    whatsappNumber: "",
    notes: "",
    supportingDocument: null,
  })

  const [showAddNotePopup, setShowAddNotePopup] = useState(false)
  const [newNote, setNewNote] = useState<NewNote>({
    title: "",
    description: "",
    type: "note",
    document: null,
  })

  const [, setCustomer] = useState<Customer | null>(null)
  const [itineraries, setItineraries] = useState<Itinerary[]>([])
  const [customerFeedbacks, setCustomerFeedbacks] = useState<CustomerFeedback[]>([])
  const [sentItineraries, setSentItineraries] = useState<SentItinerary[]>([])
  const [loading, setLoading] = useState(true)
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [enquiryId, setEnquiryId] = useState<string | null>(null)
  const [itineraryId, setItineraryId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [sendingItinerary, setSendingItinerary] = useState(false)
  const [addingNote, setAddingNote] = useState(false)

  // Fetch data on component mount
  useEffect(() => {
    
    const customerIdParam = searchParams.get("customerId")
    const enquiryIdParam = searchParams.get("enquiryId")
    const itineraryIdParam = searchParams.get("itineraryId")

    setCustomerId(customerIdParam)
    setEnquiryId(enquiryIdParam)
    setItineraryId(itineraryIdParam)

    if (enquiryIdParam || customerIdParam) {
      fetchCustomerData(customerIdParam, enquiryIdParam, itineraryIdParam)
    } else {
      setError("Either Customer ID or Enquiry ID is required")
      setLoading(false)
    }
  }, [searchParams])

  const fetchCustomerData = async (
    customerIdParam: string | null,
    enquiryIdParam: string | null,
    itineraryIdParam: string | null,
  ) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (customerIdParam) {
        params.append("customerId", customerIdParam)
      }
      if (enquiryIdParam) {
        params.append("enquiryId", enquiryIdParam)
      }
      if (itineraryIdParam) {
        params.append("itineraryId", itineraryIdParam)
      }

      const response = await fetch(`/api/share-customer?${params.toString()}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data: CustomerDashboardData = await response.json()

      if (data.customer) {
        setCustomer(data.customer)
        setFormData((prev) => ({
          ...prev,
          name: data.customer.name || "",
          email: data.customer.email || "",
          whatsappNumber: data.customer.whatsappNumber || data.customer.phone || "",
        }))
      }

      setItineraries(data.itineraries || [])
      setCustomerFeedbacks(data.feedbacks || [])
      setSentItineraries(data.sentItineraries || [])
    } catch (error) {
      console.error("Error fetching customer data:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch customer data")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      setFormData((prev) => ({
        ...prev,
        supportingDocument: file,
      }))
    }
  }

  const handleNoteFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const file = files[0]
      setNewNote((prev) => ({
        ...prev,
        document: file,
      }))
    }
  }

  const handleAddNote = async () => {
    if (!newNote.title.trim() || !newNote.description.trim()) {
      alert("Please fill in all required fields")
      return
    }

    if (!customerId && !enquiryId) {
      alert("Customer ID or Enquiry ID is required")
      return
    }

    try {
      setAddingNote(true)

      const requestBody = {
        customerId: customerId,
        enquiryId: enquiryId,
        itineraryId: itineraryId,
        type: newNote.type,
        title: newNote.title,
        description: newNote.description,
      }

      const response = await fetch("/api/share-customer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.success && result.feedback) {
        // Add new feedback to the list
        setCustomerFeedbacks((prev) => [result.feedback, ...prev])

        // Reset form and close popup
        setNewNote({
          title: "",
          description: "",
          type: "note",
          document: null,
        })
        setShowAddNotePopup(false)
        alert("Note added successfully!")
      } else {
        throw new Error(result.error || "Failed to add note")
      }
    } catch (error) {
      console.error("Error adding note:", error)
      alert(error instanceof Error ? error.message : "Failed to add note. Please try again.")
    } finally {
      setAddingNote(false)
    }
  }

  const handleSendItinerary = async () => {
    if (!formData.name || !formData.email || !formData.whatsappNumber) {
      alert("Please fill in all required fields")
      return
    }

    if (!customerId && !enquiryId) {
      alert("Customer ID or Enquiry ID is required")
      return
    }

    try {
      setSendingItinerary(true)

      const formDataToSend = new FormData()
      if (customerId) {
        formDataToSend.append("customerId", customerId)
      }
      if (enquiryId) {
        formDataToSend.append("enquiryId", enquiryId)
      }
      formDataToSend.append("name", formData.name)
      formDataToSend.append("email", formData.email)
      formDataToSend.append("whatsappNumber", formData.whatsappNumber)
      formDataToSend.append("notes", formData.notes)
      if (itineraryId) {
        formDataToSend.append("itineraryId", itineraryId)
      }
      if (formData.supportingDocument) {
        formDataToSend.append("supportingDocument", formData.supportingDocument)
      }

      const response = await fetch("/api/send-itinerary", {
        method: "POST",
        body: formDataToSend,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      if (result.success && result.sentItinerary) {
        // Add to sent itineraries list
        setSentItineraries((prev) => [result.sentItinerary, ...prev])

        // Reset form
        setFormData((prev) => ({
          ...prev,
          notes: "",
          supportingDocument: null,
        }))

        alert("Itinerary sent successfully!")
      } else {
        throw new Error(result.error || "Failed to send itinerary")
      }
    } catch (error) {
      console.error("Error sending itinerary:", error)
      alert(error instanceof Error ? error.message : "Failed to send itinerary. Please try again.")
    } finally {
      setSendingItinerary(false)
    }
  }

  const getFeedbackIcon = (type: string, status: string) => {
    if (status === "confirmed") return <CheckCircle className="w-4 h-4 text-green-600" />
    if (status === "changes") return <AlertCircle className="w-4 h-4 text-orange-600" />
    if (type === "note") return <FileText className="w-4 h-4 text-blue-600" />
    return <Clock className="w-4 h-4 text-gray-600" />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto" />
          <p className="mt-4 text-gray-600">Loading customer data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
     
       

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Itinerary List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Itinerary Table */}
            <div className="bg-white rounded-lg shadow-sm">
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-green-50 border-b">
                      <th className="text-left p-4 text-sm font-medium text-gray-700">Date Generated</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">PDF</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">Active Status</th>
                      <th className="text-left p-4 text-sm font-medium text-gray-700">Itinarary</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itineraries.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-500">
                          <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                          No itineraries found for this customer
                        </td>
                      </tr>
                    ) : (
                      itineraries.map((item, index) => (
                        <tr key={item.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                          <td className="p-4 text-sm text-gray-600">{item.dateGenerated}</td>
                          <td className="p-4">
                            <div
                              className={`w-6 h-8 rounded flex items-center justify-center text-white text-sm font-medium ${
                                item.pdf === "D" ? "bg-orange-400" : "bg-gray-600"
                              }`}
                            >
                              {item.pdf}
                            </div>
                          </td>
                          <td className="p-4">
                            <div
                              className={`w-12 h-6 rounded-full p-1 ${
                                item.activeStatus ? "bg-golden-yellow" : "bg-gray-300"
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                                  item.activeStatus ? "translate-x-6" : "translate-x-0"
                                }`}
                              ></div>
                            </div>
                          </td>
                         
                          <td className="p-4">
                            <button className="flex items-center gap-2 px-3 py-1 bg-gray-400 hover:bg-gray-400 rounded text-sm text-white transition-colors">
                              Download
                              <Download className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Share To Customer Form */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-6">Share To Customer</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name*</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter name"
                    disabled={sendingItinerary}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email*</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter email"
                    disabled={sendingItinerary}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number*</label>
                  <input
                    type="tel"
                    name="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter WhatsApp number"
                    disabled={sendingItinerary}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    placeholder="Add notes"
                    disabled={sendingItinerary}
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Supporting Document</label>
                <div className="flex gap-2">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    disabled={sendingItinerary}
                  />
                  <button
                    type="button"
                    className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2 disabled:opacity-50"
                    disabled={sendingItinerary}
                  >
                    <Upload className="w-4 h-4" />
                    Upload
                  </button>
                </div>
                {formData.supportingDocument && (
                  <p className="text-sm text-gray-600 mt-2">Selected: {formData.supportingDocument.name}</p>
                )}
              </div>
              <button
                onClick={handleSendItinerary}
                disabled={sendingItinerary}
                className="w-full py-3 bg-green-900 text-white font-medium rounded-lg hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {sendingItinerary ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Sending Itinerary...
                  </>
                ) : (
                  "Send Itinerary"
                )}
              </button>
            </div>
          </div>

          {/* Right Column - Customer Feedbacks */}
          <div className="bg-white rounded-lg shadow-sm h-fit">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold">Customer Feedbacks & Updates</h3>
                  <p className="text-xs text-gray-500">Total: {customerFeedbacks.length} items</p>
                </div>
                <button
                  onClick={() => setShowAddNotePopup(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-green-700 text-white rounded-lg hover:bg-green-600 text-sm transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Note
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">RECENT</span>
              </div>
               <div className="space-y-4 max-h-96 overflow-y-auto">
                {customerFeedbacks.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                    <p>No feedback or notes yet</p>
                    <p className="text-xs">Click &quot;Add Note&quot; to get started</p>
                  </div>
                ) : (
                  customerFeedbacks.map((feedback) => (
                    <div key={feedback.id} className="border-l-4 border-green-500 pl-4 pb-4">
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-gray-900">{feedback.title}</h4>
                            {getFeedbackIcon(feedback.type, feedback.status)}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{feedback.description}</p>
                          
                          {feedback.documentUrl && (
                            <div className="mt-2">
                              <button className="text-xs text-blue-600 hover:underline">
                                📎 View Document: {feedback.documentName}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sent Itineraries Table */}
        <div className="bg-white rounded-lg shadow-sm mt-6">
          <div className="p-4 border-b">
            <h3 className="text-lg font-semibold">Sent Itineraries History</h3>
            <p className="text-sm text-gray-600">Total: {sentItineraries.length} sent</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-green-50 border-b">
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Itinerary Sent On</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Customer Name</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Email</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">WhatsApp Number</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Notes</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-700">Documents</th>
                </tr>
              </thead>
              <tbody>
                {sentItineraries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-500">
                      <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      No sent itineraries found
                    </td>
                  </tr>
                ) : (
                  sentItineraries.map((item, ) => (
                    <tr key={item.id} className="border-b hover:bg-gray-50">
                      <td className="p-4 text-sm text-gray-600">{item.date}</td>
                      <td className="p-4 text-sm text-gray-900">{item.customerName}</td>
                      <td className="p-4 text-sm text-gray-600">{item.email}</td>
                      <td className="p-4 text-sm text-gray-600">{item.whatsappNumber}</td>
                      <td className="p-4 text-sm text-gray-600 max-w-xs truncate" title={item.notes}>
                        {item.notes || "No notes"}
                      </td>
                    
                      <td className="p-4">
                        {item.documents && (
                          <button className="flex items-center gap-2 px-3 py-1 bg-gray-300 hover:bg-gray-300 rounded text-sm text-white transition-colors">
                            Download
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Note Popup */}
      {showAddNotePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Customer Feedback</h3>
              <button
                onClick={() => setShowAddNotePopup(false)}
                className="text-gray-400 hover:text-gray-600"
                disabled={addingNote}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={newNote.type}
                  onChange={(e) => setNewNote((prev) => ({ ...prev, type: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={addingNote}
                >
                  <option value="note">Note</option>
                  <option value="feedback">Feedback</option>
                  <option value="change_request">Change Request</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title*</label>
                <input
                  type="text"
                  value={newNote.title}
                  onChange={(e) => setNewNote((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter title"
                  disabled={addingNote}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description*</label>
                <textarea
                  value={newNote.description}
                  onChange={(e) => setNewNote((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  rows={3}
                  placeholder="Enter description"
                  disabled={addingNote}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Supporting Document</label>
                <input
                  type="file"
                  onChange={handleNoteFileUpload}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled={addingNote}
                />
                {newNote.document && <p className="text-sm text-gray-600 mt-2">Selected: {newNote.document.name}</p>}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddNotePopup(false)}
                className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                disabled={addingNote}
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                disabled={addingNote}
                className="flex-1 py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {addingNote ? (
                  <>
                    <LoadingSpinner size="sm" />
                    Adding...
                  </>
                ) : (
                  "Add Note"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


 
export default function SharecustomerFormPage() {
  return (
    <Suspense fallback={<LoadingComponent />}>
      <ShareCustomerDashboardContent/>
    </Suspense>
  )
}
