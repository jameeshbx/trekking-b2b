"use client"
import { useState } from "react"
import { X, CreditCard, QrCode, Smartphone, Globe, Eye, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface StandaloneBankDetailsProps {
  isOpen: boolean
  onClose: () => void
}

const countries = [
  { name: "India", code: "IN" },
  { name: "United States", code: "US" },
  { name: "United Kingdom", code: "GB" },
  { name: "Canada", code: "CA" },
  { name: "Australia", code: "AU" },
  { name: "Germany", code: "DE" },
  { name: "France", code: "FR" },
  { name: "Japan", code: "JP" },
  { name: "China", code: "CN" },
  { name: "Brazil", code: "BR" },
]

export function StandaloneBankDetails({ isOpen, onClose }: StandaloneBankDetailsProps) {
  const [showCardNumber, setShowCardNumber] = useState(false)
  const [showCVV, setShowCVV] = useState(false)
  const [selectedBankCountry, setSelectedBankCountry] = useState("India")
  const [selectedCurrency, setSelectedCurrency] = useState("INR")
  const [selectedUpiProvider, setSelectedUpiProvider] = useState("Google Pay UPI")

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-medium">Bank details</h3>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="p-4">
            {/* Bank Details Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="bg-gray-100 p-2 rounded">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3 21H21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 10H21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M5 6L12 3L19 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4 10V21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M20 10V21"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M8 14V17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 14V17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16 14V17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <span className="font-medium">Bank Details</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-full bg-greenlight text-white border-0 hover:bg-emerald-600"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add more
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="standalone-accountHolderName" className="block text-sm font-medium text-gray-700">
                    Account Holder Name
                  </label>
                  <Input id="standalone-accountHolderName" className="w-full h-10" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="standalone-bankName" className="block text-sm font-medium text-gray-700">
                    Bank Name
                  </label>
                  <Input id="standalone-bankName" className="w-full h-10" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="standalone-branchName" className="block text-sm font-medium text-gray-700">
                    Branch Name / Location
                  </label>
                  <Input id="standalone-branchName" className="w-full h-10" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="standalone-accountNumber" className="block text-sm font-medium text-gray-700">
                    Account Number
                  </label>
                  <Input id="standalone-accountNumber" className="w-full h-10" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="standalone-ifscCode" className="block text-sm font-medium text-gray-700">
                    IFSC / SWIFT Code
                  </label>
                  <Input id="standalone-ifscCode" className="w-full h-10" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="standalone-bankCountry" className="block text-sm font-medium text-gray-700">
                    Bank Country
                  </label>
                  <Select value={selectedBankCountry} onValueChange={setSelectedBankCountry}>
                    <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {countries.map((country) => (
                        <SelectItem key={country.code} value={country.name}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label htmlFor="standalone-currency" className="block text-sm font-medium text-gray-700">
                    Currency
                  </label>
                  <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                    <SelectTrigger className="w-full h-10">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">US Dollar</SelectItem>
                      <SelectItem value="EUR">Euro</SelectItem>
                      <SelectItem value="GBP">British Pound</SelectItem>
                      <SelectItem value="INR">Indian Rupee</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">*Currency accepted</p>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label htmlFor="standalone-notes" className="block text-sm font-medium text-gray-700">
                    Enter any notes if required
                  </label>
                  <Textarea id="standalone-notes" className="w-full min-h-[60px]" />
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <Button
                  className="bg-custom-green hover:bg-green-900 text-white"
                  onClick={async () => {
                    const accountHolderName = (
                      document.getElementById("standalone-accountHolderName") as HTMLInputElement
                    )?.value
                    const bankName = (document.getElementById("standalone-bankName") as HTMLInputElement)?.value
                    const branchName = (document.getElementById("standalone-branchName") as HTMLInputElement)?.value
                    const accountNumber = (document.getElementById("standalone-accountNumber") as HTMLInputElement)
                      ?.value
                    const ifscCode = (document.getElementById("standalone-ifscCode") as HTMLInputElement)?.value
                    const notes = (document.getElementById("standalone-notes") as HTMLTextAreaElement)?.value

                    const bankData = {
                      type: "BANK_ACCOUNT",
                      accountHolderName,
                      bankName,
                      branchName,
                      accountNumber,
                      ifscCode,
                      bankCountry: selectedBankCountry,
                      currency: selectedCurrency,
                      notes,
                    }

                    try {
                      console.log("Sending bank data:", bankData)
                      const response = await fetch("/api/standalone-payment", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify(bankData),
                      })

                      console.log("Response status:", response.status)
                      console.log("Response headers:", response.headers)

                      const result = await response.json()
                      console.log("Response data:", result)

                      if (!response.ok) {
                        throw new Error(result.error || `HTTP ${response.status}: ${response.statusText}`)
                      }

                      toast({
                        title: "Success",
                        description: "Bank details saved successfully",
                      })

                      // Clear form
                      ;(document.getElementById("standalone-accountHolderName") as HTMLInputElement).value = ""
                      ;(document.getElementById("standalone-bankName") as HTMLInputElement).value = ""
                      ;(document.getElementById("standalone-branchName") as HTMLInputElement).value = ""
                      ;(document.getElementById("standalone-accountNumber") as HTMLInputElement).value = ""
                      ;(document.getElementById("standalone-ifscCode") as HTMLInputElement).value = ""
                      ;(document.getElementById("standalone-notes") as HTMLTextAreaElement).value = ""
                    } catch (error) {
                      console.error("Error saving bank details:", error)
                      toast({
                        title: "Error",
                        description: error instanceof Error ? error.message : "Failed to save bank details",
                        variant: "destructive",
                      })
                    }
                  }}
                >
                  Save Details
                </Button>
              </div>
            </div>

            {/* Credit/Debit Card Section */}
            <Accordion type="single" collapsible className="border rounded-md mb-4">
              <AccordionItem value="card" className="border-0">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-100 p-2 rounded">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <span className="font-medium">Credit/Debit card</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="standalone-cardName" className="block text-sm font-medium text-gray-700">
                        Enter your name...
                      </label>
                      <Input id="standalone-cardName" className="w-full h-10" />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="standalone-cardNumber" className="block text-sm font-medium text-gray-700">
                        Enter card number
                      </label>
                      <div className="relative">
                        <Input
                          id="standalone-cardNumber"
                          className="w-full h-10 pr-10"
                          type={showCardNumber ? "text" : "password"}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-10 w-10"
                          onClick={() => setShowCardNumber(!showCardNumber)}
                          type="button"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="standalone-cvv" className="block text-sm font-medium text-gray-700">
                        CVV
                      </label>
                      <div className="relative">
                        <Input id="standalone-cvv" className="w-full h-10 pr-10" type={showCVV ? "text" : "password"} />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-10 w-10"
                          onClick={() => setShowCVV(!showCVV)}
                          type="button"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="standalone-expiryDate" className="block text-sm font-medium text-gray-700">
                        Expiry Date Month
                      </label>
                      <Input id="standalone-expiryDate" className="w-full h-10" placeholder="MM/YY" />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button
                      className="bg-custom-green hover:bg-green-900 text-white"
                      onClick={async () => {
                        const cardName = (document.getElementById("standalone-cardName") as HTMLInputElement)?.value
                        const cardNumber = (document.getElementById("standalone-cardNumber") as HTMLInputElement)?.value
                        const expiryDate = (document.getElementById("standalone-expiryDate") as HTMLInputElement)?.value

                        const cardData = {
                          type: "CREDIT_CARD",
                          cardName,
                          cardNumber,
                          expiryDate,
                        }

                        try {
                          const response = await fetch("/api/standalone-payment", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify(cardData),
                          })

                          if (!response.ok) {
                            const result = await response.json()
                            throw new Error(result.error || "Failed to save card details")
                          }

                          toast({
                            title: "Success",
                            description: "Card details saved successfully",
                          })

                          // Clear form
                          ;(document.getElementById("standalone-cardName") as HTMLInputElement).value = ""
                          ;(document.getElementById("standalone-cardNumber") as HTMLInputElement).value = ""
                          ;(document.getElementById("standalone-expiryDate") as HTMLInputElement).value = ""
                        } catch (error) {
                          toast({
                            title: "Error",
                            description: error instanceof Error ? error.message : "Failed to save card details",
                            variant: "destructive",
                          })
                        }
                      }}
                    >
                      Save Details
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* UPI Section */}
            <Accordion type="single" collapsible className="border rounded-md mb-4">
              <AccordionItem value="upi" className="border-0">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-100 p-2 rounded">
                      <Smartphone className="h-5 w-5" />
                    </div>
                    <span className="font-medium">UPI</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label htmlFor="standalone-upiProvider" className="block text-sm font-medium text-gray-700">
                        UPI Provider
                      </label>
                      <Select value={selectedUpiProvider} onValueChange={setSelectedUpiProvider}>
                        <SelectTrigger className="w-full h-10">
                          <SelectValue placeholder="Google Pay UPI" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Google Pay UPI">Google Pay UPI</SelectItem>
                          <SelectItem value="PhonePe">PhonePe</SelectItem>
                          <SelectItem value="Paytm">Paytm</SelectItem>
                          <SelectItem value="BHIM UPI">BHIM UPI</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="standalone-upiId" className="block text-sm font-medium text-gray-700">
                        Enter UPI ID
                      </label>
                      <Input id="standalone-upiId" className="w-full h-10" />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button
                      className="bg-custom-green hover:bg-green-900 text-white"
                      onClick={async () => {
                        const upiId = (document.getElementById("standalone-upiId") as HTMLInputElement)?.value

                        const upiData = {
                          type: "UPI",
                          upiProvider: selectedUpiProvider,
                          upiId,
                        }

                        try {
                          const response = await fetch("/api/standalone-payment", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify(upiData),
                          })

                          if (!response.ok) {
                            const result = await response.json()
                            throw new Error(result.error || "Failed to save UPI details")
                          }

                          toast({
                            title: "Success",
                            description: "UPI details saved successfully",
                          })

                          // Clear form
                          ;(document.getElementById("standalone-upiId") as HTMLInputElement).value = ""
                        } catch (error) {
                          toast({
                            title: "Error",
                            description: error instanceof Error ? error.message : "Failed to save UPI details",
                            variant: "destructive",
                          })
                        }
                      }}
                    >
                      Save Details
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* QR Code Section */}
            <Accordion type="single" collapsible className="border rounded-md mb-4">
              <AccordionItem value="qr" className="border-0">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-100 p-2 rounded">
                      <QrCode className="h-5 w-5" />
                    </div>
                    <span className="font-medium">QR Code</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                      <Input id="standalone-qrCode" type="file" className="hidden" />
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                        <p className="text-sm text-gray-500">Upload QR Code</p>
                      </div>
                      <Button
                        variant="outline"
                        className="h-10 bg-greenlight hover:bg-emerald-600 text-white border-0"
                        onClick={() => document.getElementById("standalone-qrCode")?.click()}
                      >
                        Upload
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button
                      className="bg-custom-green hover:bg-green-900 text-white"
                      onClick={async () => {
                        const qrCodeInput = document.getElementById("standalone-qrCode") as HTMLInputElement
                        const file = qrCodeInput?.files?.[0]

                        if (!file) {
                          toast({
                            title: "Error",
                            description: "Please select a QR code file",
                            variant: "destructive",
                          })
                          return
                        }

                        const formData = new FormData()
                        formData.append("qrCode", file)

                        try {
                          const response = await fetch("/api/standalone-payment/qr-upload", {
                            method: "POST",
                            body: formData,
                          })

                          if (!response.ok) {
                            const result = await response.json()
                            throw new Error(result.error || "Failed to save QR code")
                          }

                          toast({
                            title: "Success",
                            description: "QR code saved successfully",
                          })

                          // Clear form
                          qrCodeInput.value = ""
                        } catch (error) {
                          toast({
                            title: "Error",
                            description: error instanceof Error ? error.message : "Failed to save QR code",
                            variant: "destructive",
                          })
                        }
                      }}
                    >
                      Save Details
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Payment Gateway Section */}
            <Accordion type="single" collapsible className="border rounded-md">
              <AccordionItem value="gateway" className="border-0">
                <AccordionTrigger className="px-4 py-3 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-100 p-2 rounded">
                      <Globe className="h-5 w-5" />
                    </div>
                    <span className="font-medium">Payment Gateway</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="standalone-paymentLink" className="block text-sm font-medium text-gray-700">
                        Paste the link
                      </label>
                      <Input id="standalone-paymentLink" className="w-full h-10" />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button
                      className="bg-custom-green hover:bg-green-900 text-white"
                      onClick={async () => {
                        const paymentLink = (document.getElementById("standalone-paymentLink") as HTMLInputElement)
                          ?.value

                        const paymentData = {
                          type: "PAYMENT_GATEWAY",
                          paymentLink,
                        }

                        try {
                          const response = await fetch("/api/standalone-payment", {
                            method: "POST",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify(paymentData),
                          })

                          if (!response.ok) {
                            const result = await response.json()
                            throw new Error(result.error || "Failed to save payment gateway")
                          }

                          toast({
                            title: "Success",
                            description: "Payment gateway saved successfully",
                          })

                          // Clear form
                          ;(document.getElementById("standalone-paymentLink") as HTMLInputElement).value = ""
                        } catch (error) {
                          toast({
                            title: "Error",
                            description: error instanceof Error ? error.message : "Failed to save payment gateway",
                            variant: "destructive",
                          })
                        }
                      }}
                    >
                      Save Details
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  )
}
