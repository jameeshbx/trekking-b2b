"use client"

import { useState } from 'react';
import Sidebar from './(components)/Sidebar';
import React from 'react';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar expanded={sidebarExpanded} setExpanded={setSidebarExpanded} />
      <main className={`flex-1 transition-all duration-300 ${sidebarExpanded ? 'lg:ml-64' : 'lg:ml-20'} ml-16`}>
       <div className="p-3 sm:p-4 md:p-6 lg:p-8 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}