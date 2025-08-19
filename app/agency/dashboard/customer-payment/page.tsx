"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import BreadcrumbDemo from "../breadcrumbs-tab/breadcrumbs-tab";
import EnquiryStatusDemo from "../breadcrumbs-status.tsx/status";
import PaymentOverviewForm from "./customer";

export default function Enquiry() {
  const searchParams = useSearchParams();
  const paymentId =
    searchParams.get("itineraryId") ??
    searchParams.get("enquiryId") ??
    "";

  return (
    <div className="w-full h-screen bg-gray-50 mx-auto">
      {/* Wrap EnquiryStatusDemo in a Suspense boundary to prevent server-side rendering errors. */}
      <Suspense fallback={<div>Loading...</div>}>
        <div className="z-0 relative">
          <EnquiryStatusDemo />
        </div>
      </Suspense>
      <div className="max-w-[1200px] w-full">
        <BreadcrumbDemo />
      </div>
      <div className="w-full">
        <PaymentOverviewForm paymentId={paymentId} />
      </div>
    </div>
  );
}