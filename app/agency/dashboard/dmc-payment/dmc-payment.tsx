"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Info, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

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
              paymentGateway: gateway?.paymentLink || '',
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
      // Step 1: Save payment data with the receipt file name
      const paymentPayload = {
        ...paymentData,
        dmcId,
        enquiryId,
        paymentDate: new Date(paymentData.paymentDate).toISOString(),
        receiptUrl: selectedFile.name,
        currency,
      }

      const paymentResponse = await fetch("/api/dmc-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentPayload),
      })

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json()
        throw new Error(errorData.error || "Failed to save payment details.")
      }

      await paymentResponse.json()

      if (commission?.dmc?.email) {
        const emailFormData = new FormData()
        emailFormData.append("to", commission.dmc.email)
        emailFormData.append("subject", `Payment Notification for Itinerary: ${paymentData.itineraryReference}`)
        emailFormData.append(
          "paymentDetails",
          JSON.stringify({
            ...paymentData,
            currency,
          }),
        )
        emailFormData.append("file", selectedFile)

        const emailResponse = await fetch("/api/send-dmc-payment-email", {
          method: "POST",
          body: emailFormData,
        })

        if (!emailResponse.ok) {
          console.warn("Payment saved, but failed to send email.")
          toast({
            title: "Warning",
            description: "Payment saved successfully, but failed to send email notification.",
            variant: "destructive",
          })
        } else {
          toast({ title: "Success", description: "Payment updated and email sent successfully!" })
        }
      } else {
        toast({
          title: "Warning",
          description: "Payment saved, but DMC email is not available to send notification.",
          variant: "destructive",
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
                    <tr>
                      <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900">12 - 04 - 25</td>
                      <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900">41431545</td>
                      <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900">500.00 USD</td>
                      <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900">780.00 USD</td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-500 text-white">
                          PARTIALLY PAID
                        </span>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900">
                        {showBankDetails ? "Bank transfer" : "Payment gateway"}
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        <button className="flex items-center text-xs text-blue-600 hover:text-blue-800">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Mobile/Tablet Card View */}
              <div className="block lg:hidden p-4">
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Paid on:</span>
                      <span className="text-gray-900">12 - 04 - 25</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Transaction ID:</span>
                      <span className="text-gray-900">41431545</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Amount paid:</span>
                      <span className="text-gray-900">500.00 USD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Pending:</span>
                      <span className="text-gray-900">780.00 USD</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Status:</span>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-500 text-white">
                        PARTIALLY PAID
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Payment channel:</span>
                      <span className="text-gray-900">{showBankDetails ? "Bank transfer" : "Payment gateway"}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-gray-600 font-medium">Invoice:</span>
                      <button className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Send Reminder */}
            <div className="bg-white rounded-lg shadow-sm p-4 w-full lg:w-[528px] lg:ml-[-143px]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                <h3 className="text-sm sm:text-md font-semibold">Send Reminder</h3>
                <button className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors text-xs font-medium">
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
