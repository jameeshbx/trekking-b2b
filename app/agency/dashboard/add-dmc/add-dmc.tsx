"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Upload, PlusCircle, X, CreditCard, QrCode, Smartphone, Globe, Eye, Plus } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { countries, cities, destinations } from "@/data/add-dmc"
import type { DMCRegistrationData, DMCRegistrationResponse } from "@/types/dmc"

export function DMCRegistrationForm() {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [formData, setFormData] = useState<DMCRegistrationData>({
    dmcName: "",
    primaryContact: "",
    phoneNumber: "",
    designation: "",
    ownerName: "",
    ownerPhoneNumber: "",
    email: "",
    website: "",
    primaryCountry: "",
    destinationsCovered: "",
    cities: "",
    gstRegistration: "Yes",
    gstNo: "",
    yearOfRegistration: "",
    panNo: "",
    panType: "",
    headquarters: "",
    country: "",
    yearOfExperience: "",
    registrationCertificate: null,
    primaryPhoneExtension: "+91",
    ownerPhoneExtension: "+91",
  })

  const [showBankDetailsModal, setShowBankDetailsModal] = useState(false)
  const [showCardNumber, setShowCardNumber] = useState(false)
  const [showCVV, setShowCVV] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setFormData((prev) => ({ ...prev, registrationCertificate: file }))
      setUploadedFile(file.name)
      toast({
        title: "File uploaded",
        description: `Successfully uploaded: ${file.name}`,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      // Create FormData object for file upload
      const submitData = new FormData()

      // Add all form fields to FormData
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          submitData.append(key, value)
        }
      })

      // Add phone extensions
      submitData.append("primaryPhoneExtension", formData.primaryPhoneExtension)
      submitData.append("ownerPhoneExtension", formData.ownerPhoneExtension)

      // Make API call
      const response = await fetch("/api/dmc", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(submitData)),
        headers: {
          "Content-Type": "application/json",
        },
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to register DMC")
      }

      toast({
        title: "Success",
        description: "DMC has been registered successfully",
      })

      // Reset form after successful submission
      setFormData({
        dmcName: "",
        primaryContact: "",
        phoneNumber: "",
        designation: "",
        ownerName: "",
        ownerPhoneNumber: "",
        email: "",
        website: "",
        primaryCountry: "",
        destinationsCovered: "",
        cities: "",
        gstRegistration: "Yes",
        gstNo: "",
        yearOfRegistration: "",
        panNo: "",
        panType: "",
        headquarters: "",
        country: "",
        yearOfExperience: "",
        registrationCertificate: null,
        primaryPhoneExtension: "+91",
        ownerPhoneExtension: "+91",
      })
      setUploadedFile(null)

    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to register DMC",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-28">
        {/* DMC Name */}
        <div className="space-y-2 w-full">
          <label htmlFor="dmcName" className="block text-sm font-medium text-gray-700 font-Poppins">
            DMC name
          </label>
          <Input
            id="dmcName"
            name="dmcName"
            value={formData.dmcName}
            onChange={handleInputChange}
            className="w-full h-12 focus:border-emerald-500 hover:border-emerald-500 transition-colors"
            required
          />
        </div>

        {/* Primary Contact Person */}
        <div className="space-y-2 w-full">
          <label htmlFor="primaryContact" className="block text-sm font-medium text-gray-700 font-Poppins">
            Primary contact person
          </label>
          <Input
            id="primaryContact"
            name="primaryContact"
            value={formData.primaryContact}
            onChange={handleInputChange}
            className="w-full h-12 focus:border-emerald-500 hover:border-emerald-500 transition-colors"
            required
          />
        </div>

        {/* Phone Number */}
        <div className="space-y-2 w-full">
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 font-Poppins">
            Phone number
          </label>
          <div className="flex">
            <Select value={formData.primaryPhoneExtension} onValueChange={(value) => setFormData((prev) => ({ ...prev, primaryPhoneExtension: value }))}>
              <SelectTrigger className="w-28 h-12 rounded-r-none border-r-0">
                <SelectValue placeholder="+91" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="+91">
                  <div className="flex items-center">
                    <Image
                      src="https://flagcdn.com/w20/in.png"
                      alt="India"
                      className="h-4 mr-1"
                      width={20}
                      height={14}
                    />
                    <span>+91</span>
                  </div>
                </SelectItem>
                <SelectItem value="+1">
                  <div className="flex items-center">
                    <Image src="https://flagcdn.com/w20/us.png" alt="USA" className="h-4 mr-1" width={20} height={14} />
                    <span>+1</span>
                  </div>
                </SelectItem>
                <SelectItem value="+44">
                  <div className="flex items-center">
                    <Image src="https://flagcdn.com/w20/gb.png" alt="UK" className="h-4 mr-1" width={20} height={14} />
                    <span>+44</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="flex-1 h-12 rounded-l-none focus:border-emerald-500 hover:border-emerald-500 transition-colors"
              required
            />
          </div>
        </div>

        {/* Designation */}
        <div className="space-y-2 w-full">
          <label htmlFor="designation" className="block text-sm font-medium text-gray-700 font-Poppins">
            Designation
          </label>
          <Input
            id="designation"
            name="designation"
            value={formData.designation}
            onChange={handleInputChange}
            className="w-full h-12 focus:border-emerald-500 hover:border-emerald-500 transition-colors"
            required
          />
        </div>

        {/* Owner Name */}
        <div className="space-y-2 w-full">
          <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 font-Poppins">
            Owner name
          </label>
          <Input
            id="ownerName"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleInputChange}
            className="w-full h-12 focus:border-emerald-500 hover:border-emerald-500 transition-colors"
            required
          />
        </div>

        {/* Owner Phone Number */}
        <div className="space-y-2 w-full">
          <label htmlFor="ownerPhoneNumber" className="block text-sm font-medium text-gray-700 font-Poppins">
            Phone number
          </label>
          <div className="flex">
            <Select value={formData.ownerPhoneExtension} onValueChange={(value) => setFormData((prev) => ({ ...prev, ownerPhoneExtension: value }))}>
              <SelectTrigger className="w-28 h-12 rounded-r-none border-r-0">
                <SelectValue placeholder="+91" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="+91">
                  <div className="flex items-center">
                    <Image
                      src="https://flagcdn.com/w20/in.png"
                      alt="India"
                      className="h-4 mr-1"
                      width={20}
                      height={14}
                    />
                    <span>+91</span>
                  </div>
                </SelectItem>
                <SelectItem value="+1">
                  <div className="flex items-center">
                    <Image src="https://flagcdn.com/w20/us.png" alt="USA" className="h-4 mr-1" width={20} height={14} />
                    <span>+1</span>
                  </div>
                </SelectItem>
                <SelectItem value="+44">
                  <div className="flex items-center">
                    <Image src="https://flagcdn.com/w20/gb.png" alt="UK" className="h-4 mr-1" width={20} height={14} />
                    <span>+44</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <Input
              id="ownerPhoneNumber"
              name="ownerPhoneNumber"
              value={formData.ownerPhoneNumber}
              onChange={handleInputChange}
              className="flex-1 h-12 rounded-l-none focus:border-emerald-500 hover:border-emerald-500 transition-colors"
              required
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-2 w-full">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 font-Poppins">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full h-12 focus:border-emerald-500 hover:border-emerald-500 transition-colors"
            required
          />
        </div>

        {/* Website */}
        <div className="space-y-2 w-full">
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 font-Poppins">
            Website
          </label>
          <Input
            id="website"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            className="w-full h-12 focus:border-emerald-500 hover:border-emerald-500 transition-colors"
          />
        </div>

        {/* Primary Country */}
        <div className="space-y-2 w-full">
          <label htmlFor="primaryCountry" className="block text-sm font-medium text-gray-700 font-Poppins">
            Primary country
          </label>
          <Select
            value={formData.primaryCountry}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, primaryCountry: value }))}
          >
            <SelectTrigger className="w-full h-12">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.name}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Destinations Covered */}
        <div className="space-y-2 w-full">
          <label htmlFor="destinationsCovered" className="block text-sm font-medium text-gray-700 font-Poppins">
            Destinations Covered
          </label>
          <Select
            value={formData.destinationsCovered}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, destinationsCovered: value }))}
          >
            <SelectTrigger className="w-full h-12">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {destinations.map((destination) => (
                <SelectItem key={destination} value={destination}>
                  {destination}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Cities */}
        <div className="space-y-2 w-full">
          <label htmlFor="cities" className="block text-sm font-medium text-gray-700 font-Poppins">
            Cities
          </label>
          <Select
            value={formData.cities}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, cities: value }))}
          >
            <SelectTrigger className="w-full h-12">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* GST Registration */}
        <div className="space-y-2 w-full">
          <label className="block text-sm font-medium text-gray-700 font-Poppins">GST Registration</label>
          <RadioGroup
            value={formData.gstRegistration}
            onValueChange={(value) => {
              setFormData((prev) => ({
                ...prev,
                gstRegistration: value as "Yes" | "No"
              }))
            }}
            className="flex items-center gap-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="Yes" id="gst-yes" className="text-emerald-500" />
              <Label htmlFor="gst-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="No" id="gst-no" />
              <Label htmlFor="gst-no">No</Label>
            </div>
          </RadioGroup>
        </div>

        {/* GST No. */}
        <div className="space-y-2 w-full">
          <label htmlFor="gstNo" className="block text-sm font-medium text-gray-700 font-Poppins">
            GST No.
          </label>
          <Input
            id="gstNo"
            name="gstNo"
            value={formData.gstNo}
            onChange={handleInputChange}
            className="w-full h-12 focus:border-emerald-500 hover:border-emerald-500 transition-colors"
            disabled={formData.gstRegistration === "No"}
          />
        </div>

        {/* Year of Registration */}
        <div className="space-y-2 w-full">
          <label htmlFor="yearOfRegistration" className="block text-sm font-medium text-gray-700 font-Poppins">
            Year of Registration
          </label>
          <div className="relative">
            <Input
              id="yearOfRegistration"
              name="yearOfRegistration"
              value={formData.yearOfRegistration}
              onChange={handleInputChange}
              className="w-full h-12 focus:border-emerald-500 hover:border-emerald-500 transition-colors"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-100 px-2 py-1 rounded text-sm text-gray-600 font-Poppins">
              Years
            </div>
          </div>
        </div>

        {/* PAN No. */}
        <div className="space-y-2 w-full">
          <label htmlFor="panNo" className="block text-sm font-medium text-gray-700 font-Poppins">
            PAN No.
          </label>
          <Input
            id="panNo"
            name="panNo"
            value={formData.panNo}
            onChange={handleInputChange}
            className="w-full h-12 focus:border-emerald-500 hover:border-emerald-500 transition-colors"
          />
        </div>

        {/* PAN Type */}
        <div className="space-y-2 w-full">
          <label htmlFor="panType" className="block text-sm font-medium text-gray-700 font-Poppins">
            PAN type
          </label>
          <Select
            value={formData.panType}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, panType: value }))}
          >
            <SelectTrigger className="w-full h-12">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Individual">Individual</SelectItem>
              <SelectItem value="Company">Company</SelectItem>
              <SelectItem value="HUF">HUF</SelectItem>
              <SelectItem value="Firm">Firm</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Headquarters */}
        <div className="space-y-2 w-full">
          <label htmlFor="headquarters" className="block text-sm font-medium text-gray-700 font-Poppins">
            Headquarters
          </label>
          <Input
            id="headquarters"
            name="headquarters"
            value={formData.headquarters}
            onChange={handleInputChange}
            className="w-full h-12 focus:border-emerald-500 hover:border-emerald-500 transition-colors"
          />
        </div>

        {/* Country */}
        <div className="space-y-2 w-full">
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 font-Poppins">
            Country
          </label>
          <Select
            value={formData.country}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, country: value }))}
          >
            <SelectTrigger className="w-full h-12">
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country.code} value={country.name}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Year of Experience */}
        <div className="space-y-2 w-full">
          <label htmlFor="yearOfExperience" className="block text-sm font-medium text-gray-700 font-Poppins">
            Year of Experience
          </label>
          <div className="relative">
            <Input
              id="yearOfExperience"
              name="yearOfExperience"
              value={formData.yearOfExperience}
              onChange={handleInputChange}
              className="w-full h-12 focus:border-emerald-500 hover:border-emerald-500 transition-colors"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gray-100 px-2 py-1 rounded text-sm text-gray-600 font-Poppins">
              Years
            </div>
          </div>
        </div>

        {/* Business Registration / Registration Certificate - Fixed alignment */}
        <div className="space-y-2 w-full">
          <label htmlFor="registrationCertificate" className="block text-sm font-medium text-gray-700 font-Poppins">
            Business registration / Registration certificate
          </label>
          <div className="flex items-center h-12">
            <Input
              id="certificate-display"
              readOnly
              value={uploadedFile || ""}
              placeholder="No file chosen"
              className="flex-1 h-full rounded-r-none focus:border-emerald-500 hover:border-emerald-500 transition-colors"
            />
            <Button
              type="button"
              variant="outline"
              className="h-full rounded-l-none bg-greenlight hover:bg-emerald-600 text-white border-0 flex items-center"
              onClick={() => document.getElementById("certificate-upload")?.click()}
            >
              <Upload className="h-4 w-4 mr-1 font-Poppins" />
              Upload
            </Button>
            <input
              id="certificate-upload"
              name="registrationCertificate"
              type="file"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mt-6">
        <Button
          type="button"
          className="h-12 px-6 bg-greenlight hover:bg-emerald-600 text-white rounded-md flex items-center gap-2"
          onClick={() => setShowBankDetailsModal(true)}
        >
          <PlusCircle className="h-4 w-4" />
          Add bank details
        </Button>

        <Button type="submit" className="h-12 px-6 bg-custom-green hover:bg-gray-900 text-white rounded-md ml-auto">
          Submit
        </Button>
      </div>

      {/* Bank Details Modal */}
      {showBankDetailsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-medium">Bank details</h3>
              <Button variant="ghost" size="icon" onClick={() => setShowBankDetailsModal(false)}>
                <X className="h-5 w-5" />
              </Button>
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
                    <label htmlFor="accountHolderName" className="block text-sm font-medium text-gray-700">
                      Account Holder Name
                    </label>
                    <Input id="accountHolderName" className="w-full h-10" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="bankName" className="block text-sm font-medium text-gray-700">
                      Bank Name
                    </label>
                    <Input id="bankName" className="w-full h-10" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="branchName" className="block text-sm font-medium text-gray-700">
                      Branch Name / Location
                    </label>
                    <Input id="branchName" className="w-full h-10" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
                      Account Number
                    </label>
                    <Input id="accountNumber" className="w-full h-10" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="ifscCode" className="block text-sm font-medium text-gray-700">
                      IFSC / SWIFT Code
                    </label>
                    <Input id="ifscCode" className="w-full h-10" />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="bankCountry" className="block text-sm font-medium text-gray-700">
                      Bank Country
                    </label>
                    <Select>
                      <SelectTrigger className="w-full h-10">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem key={country.code} value={country.name}>
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700">
                      Currency
                    </label>
                    <Select>
                      <SelectTrigger className="w-full h-10">
                        <SelectValue placeholder="US Dollar" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usd">US Dollar</SelectItem>
                        <SelectItem value="eur">Euro</SelectItem>
                        <SelectItem value="gbp">British Pound</SelectItem>
                        <SelectItem value="inr">Indian Rupee</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 mt-1">*Currency accepted</p>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                      Enter any notes if required
                    </label>
                    <Textarea id="notes" className="w-full min-h-[60px]" />
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <Button className="bg-custom-green hover:bg-green-900 text-white">Save Details</Button>
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
                        <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">
                          Enter your name...
                        </label>
                        <Input id="cardName" className="w-full h-10" />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">
                          Enter card number
                        </label>
                        <div className="relative">
                          <Input
                            id="cardNumber"
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
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">
                          CVV
                        </label>
                        <div className="relative">
                          <Input id="cvv" className="w-full h-10 pr-10" type={showCVV ? "text" : "password"} />
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
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">
                          Expiry Date Month
                        </label>
                        <Input id="expiryDate" className="w-full h-10" placeholder="MM/YY" />
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <Button className="bg-custom-green hover:bg-green-900 text-white">Save Details</Button>
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
                        <label htmlFor="upiProvider" className="block text-sm font-medium text-gray-700">
                          UPI Provider
                        </label>
                        <Select>
                          <SelectTrigger className="w-full h-10">
                            <SelectValue placeholder="Google Pay UPI" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gpay">Google Pay UPI</SelectItem>
                            <SelectItem value="phonepe">PhonePe</SelectItem>
                            <SelectItem value="paytm">Paytm</SelectItem>
                            <SelectItem value="bhim">BHIM UPI</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="upiId" className="block text-sm font-medium text-gray-700">
                          Enter UPI ID
                        </label>
                        <Input id="upiId" className="w-full h-10" />
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <Button className="bg-custom-green hover:bg-green-900 text-white">Save Details</Button>
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
                        <Input id="qrCode" type="file" className="hidden" />
                        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                          <p className="text-sm text-gray-500">Upload QR Code</p>
                        </div>
                        <Button
                          variant="outline"
                          className="h-10 bg-greenlight hover:bg-emerald-600 text-white border-0"
                          onClick={() => document.getElementById("qrCode")?.click()}
                        >
                          Upload
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <Button className="bg-custom-green hover:bg-green-900 text-white">Save Details</Button>
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
                        <label htmlFor="paymentLink" className="block text-sm font-medium text-gray-700">
                          Paste the link
                        </label>
                        <Input id="paymentLink" className="w-full h-10" />
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <Button className="bg-custom-green hover:bg-green-900 text-white">Save Details</Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </div>
      )}

      <Toaster />
    </form>
  )
}
