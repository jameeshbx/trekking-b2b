"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Info, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

interface PaymentRecord {
  id: string
  paymentDate: string
  transactionId: string | null
  amountPaid: number
  remainingBalance: number
  paymentStatus: string
  paymentChannel: string
  receiptFile?: {
    id: string
    url: string
    name: string
  } | null
  enquiry?: {
    currency: string
  }
}

interface PaymentData {
  dmcName: string
  itineraryReference: string
  totalCost: string
  amountPaid: string
  paymentDate: string
  remainingBalance: string
  paymentStatus: string
  paymentChannel: "Bank transfer ( manual entry )" | "Payment gateway"
  transactionId: string
  selectedBank: string
  paymentGateway: string
}

interface Commission {
  dmc: {
    id: string
    name: string
    email?: string
  }
  markupPrice: string
}

interface PaymentMethod {
  type: string
  bank?: Array<{
    bankName: string
    accountNumber: string
  }>
  paymentLink?: string
}

const DMCPaymentInterface: React.FC = () => {
  const searchParams = useSearchParams()
  const enquiryId = searchParams.get("enquiryId")

  const [dmcId, setDmcId] = useState<string | null>(null)
  const [commission, setCommission] = useState<Commission | null>(null)
  const [showBankDetails, setShowBankDetails] = useState<boolean>(true)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [currency, setCurrency] = useState<string>("USD")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [paymentData, setPaymentData] = useState<PaymentData>({
    dmcName: "",
    itineraryReference: "ITN-20250412-001",
    totalCost: "",
    amountPaid: "",
    paymentDate: "",
    remainingBalance: "",
    paymentStatus: "Partial",
    paymentChannel: "Bank transfer ( manual entry )",
    transactionId: "",
    selectedBank: "",
    paymentGateway: "",
  })
  const [payments, setPayments] = useState<PaymentRecord[]>([])

  const { toast } = useToast()

  useEffect(() => {
    if (enquiryId) {
      const fetchCommission = async () => {
        try {
          const response = await fetch(`/api/commission?enquiryId=${enquiryId}`)
          if (response.ok) {
            const data = await response.json()
            setCommission(data)
            setDmcId(data.dmc.id)
            setPaymentData((prev: PaymentData) => ({ ...prev, dmcName: data.dmc.name }))
          }
        } catch (error) {
          console.error("Error fetching commission:", error)
        }
      }

      fetchCommission()
    }
  }, [enquiryId])

  useEffect(() => {
    if (commission) {
      setPaymentData((prev) => ({ ...prev, totalCost: commission.markupPrice }))
    }
  }, [commission])

  useEffect(() => {
    if (enquiryId) {
      const fetchCurrency = async () => {
        try {
          const response = await fetch(`/api/enquiries?id=${enquiryId}`)
          if (response.ok) {
            const data = await response.json()
            setCurrency(data.currency)
          }
        } catch (error) {
          console.error("Error fetching currency:", error)
        }
      }

      fetchCurrency()
    }
  }, [enquiryId])

  useEffect(() => {
    if (dmcId) {
      const fetchPaymentMethods = async () => {
        try {
          const response = await fetch(`/api/auth/standalone-payment?dmcId=${dmcId}`)
          if (response.ok) {
            const result = await response.json()
            const paymentMethodsData = (result.data.methods || []) as PaymentMethod[]
            setPaymentMethods(paymentMethodsData)
            // Set payment gateway link from the first available method
            const gateway = paymentMethodsData.find((pm) => pm.paymentLink)
            setPaymentData((prev) => ({
              ...prev,
              paymentGateway: gateway?.paymentLink || "",
            }))
          }
        } catch (error) {
          console.error("Error fetching payment methods:", error)
        }
      }

      fetchPaymentMethods()
    }
  }, [dmcId])

  useEffect(() => {
    if (enquiryId && dmcId) {
      fetch(`/api/dmc-payment?enquiryId=${enquiryId}&dmcId=${dmcId}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) setPayments(data)
          else if (Array.isArray(data.payments)) setPayments(data.payments)
        })
        .catch((err) => {
          console.error("Error fetching payments:", err)
        })
    }
  }, [enquiryId, dmcId])

  useEffect(() => {
    const total = Number.parseFloat(paymentData.totalCost) || 0
    const paid = Number.parseFloat(paymentData.amountPaid) || 0
    const remaining = total - paid
    setPaymentData((prev: PaymentData) => ({
      ...prev,
      remainingBalance: remaining >= 0 ? remaining.toFixed(2) : "0.00",
    }))
  }, [paymentData.totalCost, paymentData.amountPaid])

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const handleInputChange = (field: keyof PaymentData, value: string) => {
    setPaymentData((prev: PaymentData) => ({ ...prev, [field]: value }))
  }

  const handlePaymentChannelChange = (channel: "Bank transfer ( manual entry )" | "Payment gateway") => {
    setShowBankDetails(channel === "Bank transfer ( manual entry )")
    setPaymentData((prev: PaymentData) => ({
      ...prev,
      paymentChannel: channel,
    }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "File size must be less than 10MB.",
          variant: "destructive",
        })
        return
      }

      const allowedTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ]
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Error",
          description: "Please select a valid file type (JPG, PNG, GIF, PDF, DOC, DOCX).",
          variant: "destructive",
        })
        return
      }

      setSelectedFile(file)
      console.log("Selected file:", file.name)
    }
  }

  const handleDownload = async (fileUrl: string, fileName: string) => {
    try {
      // If it's a full URL, use it directly, otherwise prepend the base URL
      const fullUrl = fileUrl.startsWith("http") ? fileUrl : `${window.location.origin}${fileUrl}`

      // Fetch the file
      const response = await fetch(fullUrl)
      const blob = await response.blob()

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob)

      // Create a temporary anchor element to trigger the download
      const a = document.createElement("a")
      a.href = url
      a.download = fileName || "receipt"
      document.body.appendChild(a)
      a.click()

      // Cleanup
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error("Error downloading file:", error)
      toast({
        title: "Error",
        description: "Failed to download the file. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSendReminder = async () => {
    if (!enquiryId || !dmcId) {
      toast({
        title: "Error",
        description: "Missing required information to send reminder",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch("/api/send-dmc-payment-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enquiryId,
          dmcId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Success",
          description: "Reminder email has been sent successfully",
          variant: "default",
        })
      } else {
        throw new Error(data.message || "Failed to send reminder")
      }
    } catch (error) {
      console.error("Error sending reminder:", error)
      toast({
        title: "Error",
        description: "Failed to send reminder. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async () => {
    if (!enquiryId || !dmcId) {
      toast({ title: "Error", description: "Missing Enquiry ID or DMC ID.", variant: "destructive" })
      return
    }

    if (!selectedFile) {
      toast({ title: "Error", description: "Please select a receipt file to upload.", variant: "destructive" })
      return
    }

    if (!paymentData.amountPaid || Number.parseFloat(paymentData.amountPaid) <= 0) {
      toast({ title: "Error", description: "Please enter a valid amount paid.", variant: "destructive" })
      return
    }

    if (!paymentData.paymentDate) {
      toast({ title: "Error", description: "Please select a payment date.", variant: "destructive" })
      return
    }

    setIsLoading(true)

    try {
      const paymentFormData = new FormData()
      paymentFormData.append("dmcId", dmcId)
      paymentFormData.append("enquiryId", enquiryId)
      paymentFormData.append("amountPaid", paymentData.amountPaid)
      paymentFormData.append("paymentDate", new Date(paymentData.paymentDate).toISOString())
      paymentFormData.append("transactionId", paymentData.transactionId || "")
      paymentFormData.append("paymentChannel", paymentData.paymentChannel)
      paymentFormData.append("paymentStatus", paymentData.paymentStatus)
      paymentFormData.append("totalCost", paymentData.totalCost)
      paymentFormData.append("currency", currency)
      paymentFormData.append("selectedBank", paymentData.selectedBank || "")

      // Add the receipt file
      if (selectedFile) {
        paymentFormData.append("receipt", selectedFile)
      }

      const paymentResponse = await fetch("/api/dmc-payment", {
        method: "POST",
        body: paymentFormData, // Send FormData instead of JSON
      })

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json()
        throw new Error(errorData.details || errorData.error || "Failed to save payment details.")
      }

      const savedPayment = await paymentResponse.json()

      if (enquiryId && dmcId) {
        fetch(`/api/dmc-payment?enquiryId=${enquiryId}&dmcId=${dmcId}`)
          .then((res) => res.json())
          .then((data) => {
            if (Array.isArray(data)) setPayments(data)
            else if (Array.isArray(data.payments)) setPayments(data.payments)
          console.log("data.payments",data.payments);
          
          })
          .catch((err) => {
            console.error("Error refreshing payments:", err)
          })
      }

      if (commission?.dmc?.email) {
        try {
          const emailFormData = new FormData()
          emailFormData.append("to", commission.dmc.email)
          emailFormData.append("subject", `Payment Notification for Itinerary: ${paymentData.itineraryReference}`)

          // Add payment details with proper data structure
          const emailPaymentDetails = {
            ...paymentData,
            dmcName: commission.dmc.name,
            currency,
            paymentDate: paymentData.paymentDate,
            itineraryReference: savedPayment.itineraryReference || paymentData.itineraryReference,
          }

          emailFormData.append("paymentDetails", JSON.stringify(emailPaymentDetails))

          // Add file if it exists
          if (selectedFile) {
            emailFormData.append("file", selectedFile)
          }

          console.log("Sending email to:", commission.dmc.email)

          const emailResponse = await fetch("/api/send-dmc-payment-email", {
            method: "POST",
            body: emailFormData,
          })

          const responseData = await emailResponse.json()

          if (!emailResponse.ok) {
            console.warn("Failed to send email:", responseData)
            toast({
              title: "Payment Saved",
              description: `Payment saved successfully, but email notification failed: ${responseData.details || responseData.error}`,
              variant: "destructive",
            })
          } else {
            console.log("Email sent successfully:", responseData.messageId)
            toast({
              title: "Success",
              description: "Payment updated and email sent successfully!",
            })
          }
        } catch (error) {
          console.error("Error sending email:", error)
          const errorMessage = error instanceof Error ? error.message : "Failed to send email notification"
          toast({
            title: "Payment Saved",
            description: `Payment saved successfully, but email notification failed: ${errorMessage}`,
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "Payment Saved",
          description: "Payment saved successfully, but DMC email is not available to send notification.",
        })
      }

      setSelectedFile(null)
      setPaymentData((prev) => ({
        ...prev,
        amountPaid: "",
        paymentDate: "",
        transactionId: "",
        selectedBank: "",
      }))

      // Reset file input
      const fileInput = document.getElementById("file-upload") as HTMLInputElement
      if (fileInput) {
        fileInput.value = ""
      }
    } catch (error) {
      console.error("Error in payment submission:", error)
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred."
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyGateway = () => {
    navigator.clipboard.writeText(paymentData.paymentGateway)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - DMC Payment Form */}
          <div className="xl:col-span-2 bg-white rounded-lg shadow-sm w-full lg:w-[640px]">
            <div className="p-4 sm:p-6">
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">DMC Payment</h1>

                {/* Progress Bar */}
                <div className="flex items-center mb-6">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mr-4">
                    <div className="bg-green-800 h-2 rounded-full" style={{ width: "45%" }}></div>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">45% Complete</span>
                </div>
              </div>

              {/* DMC Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">DMC name:</label>
                  <span className="text-sm text-gray-900">{paymentData.dmcName}</span>
                </div>
              </div>

              {/* Payment Overview */}
              <div className="mb-6">
                <h3 className="text-sm sm:text-md font-medium text-gray-900 mb-4">Payment overview</h3>

                {/* Payment Form Fields */}
                <div className="space-y-4">
                  {/* Download Notice */}
                  <div className="mb-4 p-3 bg-gray-100 rounded-md">
                    <span className="text-xs text-gray-600">Download manual itinerary web feed details</span>
                  </div>

                  {/* Total Itinerary Cost */}
                  <div>
                    <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                      Total Itinerary Cost
                      <Info className="w-4 h-4 ml-1 text-gray-400" />
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={paymentData.totalCost}
                        onChange={(e) => handleInputChange("totalCost", e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm bg-gray-100"
                        readOnly
                      />
                      <select
                        value={currency}
                        disabled
                        className="px-2 sm:px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      >
                        <option>{currency}</option>
                      </select>
                    </div>
                  </div>

                  {/* Amount Paid */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount paid</label>
                    <div className="flex">
                      <input
                        type="text"
                        value={paymentData.amountPaid}
                        onChange={(e) => handleInputChange("amountPaid", e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      />
                      <select
                        value={currency}
                        disabled
                        className="px-2 sm:px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      >
                        <option>{currency}</option>
                      </select>
                    </div>
                  </div>

                  {/* Payment Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                    <input
                      type="date"
                      value={paymentData.paymentDate}
                      onChange={(e) => handleInputChange("paymentDate", e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                    />
                  </div>

                  {/* Remaining Balance */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Remaining Balance</label>
                    <div className="flex">
                      <input
                        type="text"
                        value={paymentData.remainingBalance}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-100 text-sm"
                        readOnly
                      />
                      <select
                        value={currency}
                        disabled
                        className="px-2 sm:px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      >
                        <option>{currency}</option>
                      </select>
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment status</label>
                    <select
                      value={paymentData.paymentStatus}
                      onChange={(e) => handleInputChange("paymentStatus", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    >
                      <option value="Partial">Partial</option>
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>

                  {/* Payment Channel */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Channel</label>
                    <select
                      value={paymentData.paymentChannel}
                      onChange={(e) =>
                        handlePaymentChannelChange(
                          e.target.value as "Bank transfer ( manual entry )" | "Payment gateway",
                        )
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    >
                      <option value="Bank transfer ( manual entry )">Bank transfer (manual entry)</option>
                      <option value="Payment gateway">Payment gateway</option>
                    </select>
                  </div>

                  {/* Conditional details below Payment Channel */}
                  {showBankDetails ? (
                    <div className="space-y-4">
                      {/* Transaction ID */}
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                          Transaction ID
                          <Info className="w-4 h-4 ml-1 text-gray-400" />
                        </label>
                        <input
                          type="text"
                          value={paymentData.transactionId}
                          onChange={(e) => handleInputChange("transactionId", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        />
                      </div>

                      {/* Choose Bank */}
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <p className="text-sm text-blue-700 mb-3">Choose bank account for reference</p>
                        <div className="space-y-2">
                          {(paymentMethods.find((pm) => pm.type === "BANK_ACCOUNT")?.bank || []).map(
                            (bank: { bankName: string; accountNumber: string }, index: number) => (
                              <div key={index} className="flex items-start sm:items-center">
                                <input
                                  type="radio"
                                  name="bankAccount"
                                  checked={paymentData.selectedBank === `${bank.bankName} ( ${bank.accountNumber} )`}
                                  onChange={() =>
                                    handleInputChange("selectedBank", `${bank.bankName} ( ${bank.accountNumber} )`)
                                  }
                                  className="mr-3 mt-0.5 sm:mt-0 text-green-600 focus:ring-green-500"
                                />
                                <span className="text-sm text-gray-700">
                                  {bank.bankName} ( {bank.accountNumber} )
                                </span>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Payment Link */}
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <input
                            type="text"
                            value={paymentData.paymentGateway}
                            readOnly
                            className="flex-1 px-3 py-2 border border-blue-200 rounded-md bg-white text-sm"
                          />
                          <button
                            type="button"
                            onClick={handleCopyGateway}
                            className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 text-sm"
                          >
                            Copy link
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Attach Receipt */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md">
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-600">Attach receipts / Screenshots</span>
                      {selectedFile && (
                        <span className="text-xs text-green-600 mt-1">Selected: {selectedFile.name}</span>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        type="file"
                        id="file-upload"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={handleFileUpload}
                        accept="image/*,.pdf,.doc,.docx"
                      />
                      <label
                        htmlFor="file-upload"
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors text-sm font-medium cursor-pointer block"
                      >
                        Choose File
                      </label>
                    </div>
                  </div>

                  <div className="">
                    <Button
                      onClick={handleSubmit}
                      disabled={isLoading}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 font-medium"
                    >
                      {isLoading ? "UPDATING..." : "UPDATE"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6">
            {/* Payment Summary Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden w-full lg:w-[528px] lg:ml-[-143px] p-4">
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Paid on
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Transaction ID
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount paid
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pending
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment channel
                      </th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invoice
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {payments.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-2 py-3 text-center text-xs text-gray-400">
                          No payments found.
                        </td>
                      </tr>
                    ) : (
                      payments.map((payment, idx) => (
                        <tr key={payment.id || idx}>
                          <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900">
                            {new Date(payment.paymentDate).toLocaleDateString()}
                          </td>
                          <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900">
                            {payment.transactionId || "-"}
                          </td>
                          <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900">
                            {payment.amountPaid} {payment.enquiry?.currency || currency}
                          </td>
                          <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900">
                            {payment.remainingBalance} {payment.enquiry?.currency || currency}
                          </td>
                          <td className="px-2 py-3 whitespace-nowrap">
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${payment.paymentStatus === "PAID" ? "bg-green-500" : payment.paymentStatus === "PARTIAL" ? "bg-yellow-500" : "bg-gray-400"} text-white`}
                            >
                              {payment.paymentStatus}
                            </span>
                          </td>
                          <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900">
                            {payment.paymentChannel}
                          </td>
                          <td className="px-2 py-3 whitespace-nowrap">
                            {payment.receiptFile?.url ? (
                              <button
                                onClick={() =>
                                  handleDownload(payment.receiptFile!.url, payment.receiptFile?.name || "receipt")
                                }
                                className="flex items-center text-xs text-blue-600 hover:text-blue-800"
                              >
                                <Download className="w-3 h-3 mr-1" />
                                Download
                              </button>
                            ) : (
                              <span className="text-xs text-gray-400">No file</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile/Tablet Card View */}
              <div className="block lg:hidden">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Payment History</h3>
                {payments.length === 0 ? (
                  <div className="text-center text-sm text-gray-400 py-8">No payments found.</div>
                ) : (
                  <div className="space-y-4">
                    {payments.map((payment, idx) => (
                      <div key={payment.id || idx} className="bg-gray-50 rounded-lg p-4 border">
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between items-start">
                            <span className="text-gray-600 font-medium">Paid on:</span>
                            <span className="text-gray-900">{new Date(payment.paymentDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex justify-between items-start">
                            <span className="text-gray-600 font-medium">Transaction ID:</span>
                            <span className="text-gray-900 text-right">{payment.transactionId || "-"}</span>
                          </div>
                          <div className="flex justify-between items-start">
                            <span className="text-gray-600 font-medium">Amount paid:</span>
                            <span className="text-gray-900">
                              {payment.amountPaid} {payment.enquiry?.currency || currency}
                            </span>
                          </div>
                          <div className="flex justify-between items-start">
                            <span className="text-gray-600 font-medium">Pending:</span>
                            <span className="text-gray-900">
                              {payment.remainingBalance} {payment.enquiry?.currency || currency}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 font-medium">Status:</span>
                            <span
                              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${payment.paymentStatus === "PAID" ? "bg-green-500" : payment.paymentStatus === "PARTIAL" ? "bg-yellow-500" : "bg-gray-400"} text-white`}
                            >
                              {payment.paymentStatus}
                            </span>
                          </div>
                          <div className="flex justify-between items-start">
                            <span className="text-gray-600 font-medium">Payment channel:</span>
                            <span className="text-gray-900 text-right">{payment.paymentChannel}</span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t">
                            <span className="text-gray-600 font-medium">Invoice:</span>
                            {payment.receiptFile?.url ? (
                              <button
                                onClick={() =>
                                  handleDownload(payment.receiptFile!.url, payment.receiptFile?.name || "receipt")
                                }
                                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </button>
                            ) : (
                              <span className="text-sm text-gray-400">No file</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Send Reminder Section */}
            <div className="bg-white rounded-lg shadow-sm p-4 w-full lg:w-[528px] lg:ml-[-143px]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                <h3 className="text-sm sm:text-md font-semibold">Send Reminder</h3>
                <button
                  onClick={handleSendReminder}
                  className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors text-xs font-medium"
                >
                  Send reminder
                </button>
              </div>

              <div className="border-l-4 border-green-500 pl-3">
                <div className="mb-1">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-medium">RECENT</span>
                </div>
                <h4 className="font-medium text-gray-900 text-sm mb-1">Payment pending</h4>
                <p className="text-xs text-gray-600 mb-2">
                  Customer is satisfied with the entire itinerary. No changes requested. Proceeding with confirmation
                  and sending to DMC.
                </p>
                <p className="text-xs text-gray-500">02:00 PM, Today</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DMCPaymentInterface
