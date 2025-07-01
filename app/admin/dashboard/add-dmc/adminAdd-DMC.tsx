"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Upload } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { countries, } from "@/data/add-dmc"

export function DMCRegistrationForm() {
  const [uploadedFile, setUploadedFile] = useState<string | null>(null)
  const [formData, setFormData] = useState({
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
    registrationCertificate: null as File | null,
  })

  const [primaryPhoneExtension, setPrimaryPhoneExtension] = useState("+91")
  const [ownerPhoneExtension, setOwnerPhoneExtension] = useState("+91")


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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    toast({
      title: "Form submitted",
      description: "DMC has been registered successfully",
    })
    // Reset form after submission
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
    })
    setUploadedFile(null)
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
            <Select value={primaryPhoneExtension} onValueChange={setPrimaryPhoneExtension}>
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
            <Select value={ownerPhoneExtension} onValueChange={setOwnerPhoneExtension}>
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


        {/* GST Registration */}
        <div className="space-y-2 w-full">
          <label className="block text-sm font-medium text-gray-700 font-Poppins">GST Registration</label>
          <RadioGroup
            value={formData.gstRegistration}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, gstRegistration: value }))}
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

      <div className="flex flex-wrap gap-4 justify-end mt-4 md:mt-0">
        <Button
          type="submit"
          className="h-12 px-6 bg-custom-green hover:bg-gray-900 text-white rounded-md w-full md:w-auto"
        >
          Submit
        </Button>
      </div>

      <Toaster />
    </form>
  )
}