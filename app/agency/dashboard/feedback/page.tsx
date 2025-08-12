"use client"


import BreadcrumbDemo from "../breadcrumbs-tab/breadcrumbs-tab"
import EnquiryStatusDemo from "../breadcrumbs-status.tsx/status"
import TravelBookingSystem from "./feedback"

export default function Enquiry() {
  return (
    <div className="w-full h-screen bg-gray-50 mx-auto">
      <div className="z-0 relative">
        <EnquiryStatusDemo/>
      </div>
      <div className="max-w-[1200px] w-full">
        <BreadcrumbDemo/>
      </div>
      <div className="h-screen overflow-hidden max-w-[1200px] w-full min-h-screen">
      <TravelBookingSystem/>
      </div>
    </div>
  )
}