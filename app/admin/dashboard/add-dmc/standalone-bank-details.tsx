"use client"
import { useState } from "react"
import { X, QrCode, Smartphone, Globe, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Textarea } from "@/components/ui/textarea"

interface StandaloneBankDetailsProps {
  isOpen: boolean
  onClose: () => void
  dmcId?: string | null
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

type Bank = {
  accountHolderName: string
  bankName: string
  branchName?: string
  accountNumber: string
  ifscCode?: string
  bankCountry?: string
  currency?: string
  notes?: string
}

type UpiPayload = {
  type: "UPI";
  upiProvider: string;
  upiId: string;
  dmcId?: string;
};

type GatewayPayload = {
  type: "PAYMENT_GATEWAY";
  paymentLink: string;
  dmcId?: string;
};

export function StandaloneBankDetails({ isOpen, onClose, dmcId = null }: StandaloneBankDetailsProps) {
  const [banks, setBanks] = useState<Bank[]>([
    {
      accountHolderName: "",
      bankName: "",
      branchName: "",
      accountNumber: "",
      ifscCode: "",
      bankCountry: "India",
      currency: "INR",
      notes: "",
    },
  ])
  const [selectedUpiProvider, setSelectedUpiProvider] = useState("Google Pay UPI")
  const [upiId, setUpiId] = useState("")
  const [paymentLink, setPaymentLink] = useState("")
  const [qrFile, setQrFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  if (!isOpen) return null

  const addBank = () => {
    if (banks.length >= 3) return
    setBanks((prev) => [
      ...prev,
      {
        accountHolderName: "",
        bankName: "",
        branchName: "",
        accountNumber: "",
        ifscCode: "",
        bankCountry: "India",
        currency: "INR",
        notes: "",
      },
    ])
  }

  const updateBank = (idx: number, key: keyof Bank, value: string) => {
    const next = [...banks]
    next[idx][key] = value
    setBanks(next)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      // Prepare banks array (filter out empty)
      const banksToSave = banks.filter(
        (b) => b.accountHolderName.trim() || b.bankName.trim() || b.accountNumber.trim(),
      )

      // Only send if there are banks
      if (banksToSave.length > 0) {
        const payload = {
          type: "BANK_ACCOUNT",
          bank: banksToSave, // <-- send as array
          dmcId,
        }
        const res = await fetch("/api/auth/standalone-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || "Failed to save bank details")
      }

      // Save UPI if present
      if (upiId.trim()) {
        const upiPayload: UpiPayload = {
          type: "UPI",
          upiProvider: selectedUpiProvider,
          upiId,
          ...(dmcId ? { dmcId } : {}),
        };

        const res = await fetch("/api/auth/standalone-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(upiPayload),
        })
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || "Failed to save UPI details")
        }
      }

      // Save QR if present
      if (qrFile) {
        const formData = new FormData()
        formData.append("qrCode", qrFile)
        if (dmcId) formData.append("dmcId", dmcId)

          const res = await fetch("/api/auth/standalone-payment/qr-upload", {
            method: "POST",
            body: formData,
          })
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || "Failed to save QR code")
        }
      }

      // Save Payment Gateway link if present
      if (paymentLink.trim()) {
        const gatewayPayload: GatewayPayload = {
          type: "PAYMENT_GATEWAY",
          paymentLink,
          ...(dmcId ? { dmcId } : {}),
        };

        const res = await fetch("/api/auth/standalone-payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(gatewayPayload),
        })
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || "Failed to save payment gateway link")
        }
      }

      toast({
        title: "Success",
        description: "Payment details saved successfully",
      })

      // reset
      setBanks([
        {
          accountHolderName: "",
          bankName: "",
          branchName: "",
          accountNumber: "",
          ifscCode: "",
          bankCountry: "India",
          currency: "INR",
          notes: "",
        },
      ])
      setSelectedUpiProvider("Google Pay UPI")
      setUpiId("")
      setPaymentLink("")
      setQrFile(null)
      onClose()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save payment details",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-medium">Payment details</h3>
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
                      <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M5 6L12 3L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M4 10V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M20 10V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M8 14V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 14V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M16 14V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="font-medium">Bank Details</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-full bg-greenlight text-white border-0 hover:bg-emerald-600 disabled:opacity-60"
                  onClick={addBank}
                  disabled={banks.length >= 3}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add more
                </Button>
              </div>

              <div className="space-y-6">
                {banks.map((b, idx) => (
                  <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 border rounded-md p-3">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Account Holder Name</label>
                      <Input
                        className="w-full h-10"
                        value={b.accountHolderName}
                        onChange={(e) => updateBank(idx, "accountHolderName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Bank Name</label>
                      <Input
                        className="w-full h-10"
                        value={b.bankName}
                        onChange={(e) => updateBank(idx, "bankName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Branch Name / Location</label>
                      <Input
                        className="w-full h-10"
                        value={b.branchName || ""}
                        onChange={(e) => updateBank(idx, "branchName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Account Number</label>
                      <Input
                        className="w-full h-10"
                        value={b.accountNumber}
                        onChange={(e) => updateBank(idx, "accountNumber", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">IFSC / SWIFT Code</label>
                      <Input
                        className="w-full h-10"
                        value={b.ifscCode || ""}
                        onChange={(e) => updateBank(idx, "ifscCode", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Bank Country</label>
                      <Select
                        value={b.bankCountry || "India"}
                        onValueChange={(val) => updateBank(idx, "bankCountry", val)}
                      >
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
                      <label className="block text-sm font-medium text-gray-700">Currency</label>
                      <Select
                        value={b.currency || "INR"}
                        onValueChange={(val) => updateBank(idx, "currency", val)}
                      >
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
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Enter any notes if required</label>
                      <Textarea
                        className="w-full min-h-[60px]"
                        value={b.notes || ""}
                        onChange={(e) => updateBank(idx, "notes", e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">You can add up to 3 bank accounts.</p>
            </div>

            {/* UPI Section */}
            <div className="border rounded-md mb-4">
              <div className="px-4 py-3 flex items-center gap-2">
                <div className="bg-gray-100 p-2 rounded">
                  <Smartphone className="h-5 w-5" />
                </div>
                <span className="font-medium">UPI</span>
              </div>
              <div className="px-4 pb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">UPI Provider</label>
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
                  <label className="block text-sm font-medium text-gray-700">Enter UPI ID</label>
                  <Input className="w-full h-10" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="border rounded-md mb-4">
              <div className="px-4 py-3 flex items-center gap-2">
                <div className="bg-gray-100 p-2 rounded">
                  <QrCode className="h-5 w-5" />
                </div>
                <span className="font-medium">QR Code</span>
              </div>
              <div className="px-4 pb-4">
                <input
                  id="standalone-qrCode"
                  type="file"
                  className="hidden"
                  onChange={(e) => setQrFile(e.target.files?.[0] || null)}
                />
                <div className="flex items-center gap-2">
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center flex-1">
                    <p className="text-sm text-gray-500">{qrFile ? qrFile.name : "Upload QR Code"}</p>
                  </div>
                  <Button
                    variant="outline"
                    className="h-10 bg-greenlight hover:bg-emerald-600 text-white border-0"
                    onClick={() => document.getElementById("standalone-qrCode")?.click()}
                    type="button"
                  >
                    Upload
                  </Button>
                </div>
              </div>
            </div>

            {/* Payment Gateway Section */}
            <div className="border rounded-md">
              <div className="px-4 py-3 flex items-center gap-2">
                <div className="bg-gray-100 p-2 rounded">
                  <Globe className="h-5 w-5" />
                </div>
                <span className="font-medium">Payment Gateway</span>
              </div>
              <div className="px-4 pb-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Paste the link</label>
                  <Input
                    className="w-full h-10"
                    value={paymentLink}
                    onChange={(e) => setPaymentLink(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                className="bg-custom-green hover:bg-green-900 text-white"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Details"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </>
  )
}