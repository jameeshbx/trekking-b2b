import React from 'react';
import { ChevronDown, MoreHorizontal, Eye } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Section with Signature Escapes */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Signature Escapes</h1>
            <div className="flex items-center gap-2 mt-2">
              <button className="flex items-center gap-1 px-3 py-1 bg-white border border-gray-200 rounded-md text-sm">
                Filter by destinations <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
          <button className="text-blue-600 text-sm hover:underline">See more</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Travel Cards and Revenue Chart */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Travel Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* Kapuai Serenity Escape Card */}
              <div className="relative bg-cover bg-center h-48 rounded-xl overflow-hidden group cursor-pointer" 
                   style={{backgroundImage: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 300 200\"><rect fill=\"%23059669\" width=\"300\" height=\"200\"/><path fill=\"%23047857\" d=\"M0,100 Q75,50 150,100 T300,100 V200 H0 Z\"/><rect fill=\"%23ffffff\" x=\"120\" y=\"20\" width=\"4\" height=\"60\" opacity=\"0.7\"/><rect fill=\"%23ffffff\" x=\"140\" y=\"30\" width=\"3\" height=\"50\" opacity=\"0.5\"/></svg>')"}}>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-semibold text-lg mb-1">Kapuai Serenity Escape</h3>
                  <p className="text-white/80 text-sm mb-2">By Arctic Truth THC</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full mr-0.5"></div>
                        ))}
                      </div>
                      <span className="text-white/80 text-xs ml-1">4.8</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white/80 text-xs">25 May - 31 May (6D)</div>
                      <div className="text-white font-semibold">₹51,330</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bali Tropical Escape Card */}
              <div className="relative bg-cover bg-center h-48 rounded-xl overflow-hidden group cursor-pointer"
                   style={{backgroundImage: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 300 200\"><rect fill=\"%23312e81\" width=\"300\" height=\"200\"/><rect fill=\"%23fbbf24\" x=\"250\" y=\"30\" width=\"20\" height=\"20\" rx=\"10\"/><path fill=\"%231f2937\" d=\"M50,150 L80,120 L110,130 L140,110 L170,120 L200,100 L230,110 L260,90 L300,100 V200 H50 Z\"/><rect fill=\"%23374151\" x=\"120\" y=\"80\" width=\"60\" height=\"80\" rx=\"5\"/></svg>')"}}>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-semibold text-lg mb-1">Bali Tropical Escape</h3>
                  <p className="text-white/80 text-sm mb-2">By Island Vibes Travel</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[...Array(4)].map((_, i) => (
                          <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full mr-0.5"></div>
                        ))}
                        <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      </div>
                      <span className="text-white/80 text-xs ml-1">4.2</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white/80 text-xs">05 Oct - 15 Oct (10D)</div>
                      <div className="text-white font-semibold">₹1,52,800</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Switzerland Alpine Adventure Card */}
              <div className="relative bg-cover bg-center h-48 rounded-xl overflow-hidden group cursor-pointer"
                   style={{backgroundImage: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 300 200\"><rect fill=\"%2387ceeb\" width=\"300\" height=\"200\"/><path fill=\"%23ffffff\" d=\"M0,120 L60,80 L120,100 L180,60 L240,90 L300,70 V0 H0 Z\"/><path fill=\"%23d1d5db\" d=\"M0,120 L60,80 L120,100 L180,60 L240,90 L300,70 V120 L240,130 L180,110 L120,140 L60,120 L0,140 Z\"/></svg>')"}}>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-semibold text-lg mb-1">Switzerland Alpine Adventure</h3>
                  <p className="text-white/80 text-sm mb-2">By Ecoplina Holidays</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <div key={i} className="w-2 h-2 bg-yellow-400 rounded-full mr-0.5"></div>
                        ))}
                      </div>
                      <span className="text-white/80 text-xs ml-1">4.9</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white/80 text-xs">14 Nov - 22 Nov (8D)</div>
                      <div className="text-white font-semibold">₹3,47,750</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pagination Dots */}
            <div className="flex justify-center gap-2">
              {[0, 1, 2, 3, 4, 5].map((_, index) => (
                <div key={index} className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-gray-800' : 'bg-gray-300'}`}></div>
              ))}
            </div>

            {/* Revenue Chart */}
            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Total Revenue</h3>
                <button className="p-2 hover:bg-gray-100 rounded-lg">
                  <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="mb-4">
                <div className="text-3xl font-bold text-gray-900">$190,090.36</div>
              </div>
              
              {/* Legend */}
              <div className="flex gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-teal-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-sm text-gray-600">Expenses</span>
                </div>
              </div>

              {/* Chart Area */}
              <div className="relative h-64">
                <svg viewBox="0 0 500 200" className="w-full h-full">
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <line key={i} x1="0" y1={i * 25} x2="500" y2={i * 25} stroke="#f3f4f6" strokeWidth="1"/>
                  ))}
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                    <line key={i} x1={i * 40} y1="0" x2={i * 40} y2="200" stroke="#f3f4f6" strokeWidth="1"/>
                  ))}
                  
                  {/* Revenue Area (Teal) */}
                  <path
                    d="M0,180 L40,170 L80,165 L120,150 L160,140 L200,130 L240,120 L280,100 L320,90 L360,80 L400,70 L440,60 L480,50 L500,45 L500,200 L0,200 Z"
                    fill="#14b8a6"
                    opacity="0.6"
                  />
                  
                  {/* Expenses Area (Green) */}
                  <path
                    d="M0,190 L40,185 L80,180 L120,175 L160,170 L200,165 L240,160 L280,155 L320,150 L360,145 L400,140 L440,135 L480,130 L500,125 L500,200 L0,200 Z"
                    fill="#10b981"
                    opacity="0.6"
                  />
                  
                  {/* Revenue Line */}
                  <path
                    d="M0,180 L40,170 L80,165 L120,150 L160,140 L200,130 L240,120 L280,100 L320,90 L360,80 L400,70 L440,60 L480,50 L500,45"
                    stroke="#14b8a6"
                    strokeWidth="2"
                    fill="none"
                  />
                  
                  {/* Expenses Line */}
                  <path
                    d="M0,190 L40,185 L80,180 L120,175 L160,170 L200,165 L240,160 L280,155 L320,150 L360,145 L400,140 L440,135 L480,130 L500,125"
                    stroke="#10b981"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
                
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-500 -ml-8">
                  <span>12k</span>
                  <span>10k</span>
                  <span>8k</span>
                  <span>6k</span>
                  <span>4k</span>
                  <span>2k</span>
                  <span>0</span>
                </div>
                
                {/* X-axis labels */}
                <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-gray-500 -mb-6">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                  <span>Sep</span>
                  <span>Oct</span>
                  <span>Nov</span>
                  <span>Dec</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Stats and Booking Status */}
          <div className="space-y-6 ">
            
            {/* Stats Cards */}
            <div className="space-y-4 ">
              
              {/* Total Itineraries */}
              <div className=" rounded-xl p-4 bg-gray-200">
                <div className="flex items-center justify-between">
                  <div className=''>
                    <p className="text-sm text-gray-600 mb-1 ">Total itineraries</p>
                    <p className="text-2xl font-bold text-gray-900">547</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">+1.3%</span>
                  </div>
                </div>
              </div>
              
              {/* Total Leads */}
              <div className="bg-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total leads</p>
                    <p className="text-2xl font-bold text-gray-900">47</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">+4.5%</span>
                  </div>
                </div>
              </div>
              
              {/* Generate Itineraries Button */}
              <div className="bg-gradient-to-r from-[#00F5A0] to-[#00D9F5] rounded-xl p-0 text-center grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 mr-[246px]">
  <div className="text-white mb-0">
    <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
    </svg>
  </div>
  <h3 className="text-white font-semibold mb-1">Generate Itineraries</h3>

{/* Bookings Summary */}
            <div className="bg-white rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Bookings</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Complete</span>
                  <span className="ml-auto text-sm font-semibold">12</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">In progress</span>
                  <span className="ml-auto text-sm font-semibold">5</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Cancelled</span>
                  <span className="ml-auto text-sm font-semibold">2</span>
                </div>
              </div>
            </div>
            </div>
</div>
            {/* Booking Status Overview */}
            <div className="bg-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Booking Status Overview</h3>
                <button className="p-1 hover:bg-gray-700 rounded">
                  <Eye className="w-4 h-4 text-gray-400" />
                </button>
              </div>
              <p className="text-gray-400 text-sm mb-6">Pie chart representing the booking status distribution</p>
              
              {/* Donut Chart */}
              <div className="relative w-40 h-40 mx-auto mb-6">
                <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 160 160">
                  <circle cx="80" cy="80" r="70" stroke="#374151" strokeWidth="20" fill="none" />
                  <circle cx="80" cy="80" r="70" stroke="#fbbf24" strokeWidth="20" fill="none"
                          strokeDasharray="200 440" strokeDashoffset="0" />
                  <circle cx="80" cy="80" r="70" stroke="#f97316" strokeWidth="20" fill="none"
                          strokeDasharray="150 440" strokeDashoffset="-200" />
                  <circle cx="80" cy="80" r="70" stroke="#10b981" strokeWidth="20" fill="none"
                          strokeDasharray="90 440" strokeDashoffset="-350" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">75%</div>
                    <div className="text-xs text-gray-400">Booked</div>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Confirmed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Pending</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-300 text-sm">Canceled</span>
                </div>
              </div>

              {/* Status Tags */}
              <div className="grid grid-cols-2 gap-2">
                <span className="inline-block px-3 py-1 bg-green-600 text-white rounded-full text-xs text-center">COMPLETED</span>
                <span className="inline-block px-3 py-1 bg-yellow-600 text-white rounded-full text-xs text-center">PROGRESS</span>
                <span className="inline-block px-3 py-1 bg-gray-600 text-white rounded-full text-xs text-center">CANCELLED</span>
                <span className="inline-block px-3 py-1 bg-blue-600 text-white rounded-full text-xs text-center">PROSPECTS</span>
              </div>
            </div>

            
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="bg-white rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Recent Bookings</h3>
            <button className="text-blue-600 text-sm hover:underline">See more</button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">BOOKING ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">ENQUIRY ID</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">POC</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">TOUR TYPE</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">LOCATION</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">DEPARTURE DATE</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">PAX</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">AMOUNT</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">PAYMENT STATUS</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">REVENUE GENERATED</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">AMOUNT DUE</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider">BOOKING STATUS</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">BH01</td>
                  <td className="py-3 px-4 text-sm text-gray-900">EH012</td>
                  <td className="py-3 px-4 text-sm text-gray-900">John Smith</td>
                  <td className="py-3 px-4 text-sm text-gray-900">Family</td>
                  <td className="py-3 px-4 text-sm text-gray-900">Paris, Rome</td>
                  <td className="py-3 px-4 text-sm text-gray-900">12-09-2025</td>
                  <td className="py-3 px-4 text-sm text-gray-900">4</td>
                  <td className="py-3 px-4 text-sm text-gray-900">$5000</td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">PAID</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">$1000</td>
                  <td className="py-3 px-4 text-sm text-gray-900">$0</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-900">Confirmed</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                  </td>
                </tr>
                
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">BH02</td>
                  <td className="py-3 px-4 text-sm text-gray-900">EH011</td>
                  <td className="py-3 px-4 text-sm text-gray-900">Emily Johnson</td>
                  <td className="py-3 px-4 text-sm text-gray-900">Solo</td>
                  <td className="py-3 px-4 text-sm text-gray-900">Tokyo</td>
                  <td className="py-3 px-4 text-sm text-gray-900">11-04-2025</td>
                  <td className="py-3 px-4 text-sm text-gray-900">1</td>
                  <td className="py-3 px-4 text-sm text-gray-900">$4000</td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">UNPAID</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">$400</td>
                  <td className="py-3 px-4 text-sm text-gray-900">$1800</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm text-gray-900">Pending</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                  </td>
                </tr>
                
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">BH03</td>
                  <td className="py-3 px-4 text-sm text-gray-900">EH010</td>
                  <td className="py-3 px-4 text-sm text-gray-900">Rahul Verma</td>
                  <td className="py-3 px-4 text-sm text-gray-900">Partner</td>
                  <td className="py-3 px-4 text-sm text-gray-900">Bali</td>
                  <td className="py-3 px-4 text-sm text-gray-900">03-06-2025</td>
                  <td className="py-3 px-4 text-sm text-gray-900">2</td>
                  <td className="py-3 px-4 text-sm text-gray-900">$3000</td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">REFUNDED</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">$0</td>
                  <td className="py-3 px-4 text-sm text-gray-900">$0</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-900">Canceled</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                  </td>
                </tr>
                
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">BH04</td>
                  <td className="py-3 px-4 text-sm text-gray-900">EH012</td>
                  <td className="py-3 px-4 text-sm text-gray-900">John Smith</td>
                  <td className="py-3 px-4 text-sm text-gray-900">Family</td>
                  <td className="py-3 px-4 text-sm text-gray-900">Paris, Rome</td>
                  <td className="py-3 px-4 text-sm text-gray-900">15-04-2025</td>
                  <td className="py-3 px-4 text-sm text-gray-900">4</td>
                  <td className="py-3 px-4 text-sm text-gray-900">$5000</td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">PAID</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">$1000</td>
                  <td className="py-3 px-4 text-sm text-gray-900">$0</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm text-gray-900">Confirmed</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                  </td>
                </tr>
                
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">BH12</td>
                  <td className="py-3 px-4 text-sm text-gray-900">EH011</td>
                  <td className="py-3 px-4 text-sm text-gray-900">Emily Johnson</td>
                  <td className="py-3 px-4 text-sm text-gray-900">Solo</td>
                  <td className="py-3 px-4 text-sm text-gray-900">Tokyo</td>
                  <td className="py-3 px-4 text-sm text-gray-900">11-06-2025</td>
                  <td className="py-3 px-4 text-sm text-gray-900">1</td>
                  <td className="py-3 px-4 text-sm text-gray-900">$6000</td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">UNPAID</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">$300</td>
                  <td className="py-3 px-4 text-sm text-gray-900">$1800</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-sm text-gray-900">Pending</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                  </td>
                </tr>
                
                <tr className="hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm text-gray-900">BH13</td>
                  <td className="py-3 px-4 text-sm text-gray-900">EH010</td>
                  <td className="py-3 px-4 text-sm text-gray-900">Rahul Verma</td>
                  <td className="py-3 px-4 text-sm text-gray-900">Partner</td>
                  <td className="py-3 px-4 text-sm text-gray-900">Goa</td>
                  <td className="py-3 px-4 text-sm text-gray-900">09-05-2025</td>
                  <td className="py-3 px-4 text-sm text-gray-900">2</td>
                  <td className="py-3 px-4 text-sm text-gray-900">$2000</td>
                  <td className="py-3 px-4">
                    <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">PARTIAL PAID</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">$0</td>
                  <td className="py-3 px-4 text-sm text-gray-900">$0</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm text-gray-900">Canceled</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreHorizontal className="w-4 h-4 text-gray-400" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default Dashboard;