import React from "react"
import {
  CheckCircle,
  Loader,
  XCircle,
  Network,
  Search,
  Bell,
  ChevronDown,
} from "lucide-react"
import Image from "next/image"

const Dashboard = () => {
  return (
    <div className="h-screen bg-gray-100 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-6 border-b border-gray-200 gap-4 bg-white">
        <div className="flex items-center gap-4">
          <div className="text-xs sm:text-sm text-gray-600">
            <span>Pages</span> <span className="text-gray-400">/</span>
            <span className="text-green-800 font-semibold">Dashboard</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Type here..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-transparent w-full sm:w-auto"
            />
          </div>
          <Bell className="w-5 h-5 text-gray-600" />
        </div>
      </div>

      <div className="h-[calc(100vh-73px)] bg-gray-100 px-4 py-4 overflow-y-auto overflow-x-hidden">
        {/* Container with max width to prevent horizontal scrolling */}
        <div className="max-w-[calc(100vw-32px)] mx-auto">
          {/* First Row */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Left Section - Signature Escapes */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                {/* Header */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Signature Escapes</h2>

                  <div className="flex justify-between items-center">
                    <div className="relative">
                      <select className="appearance-none bg-white border-2 border-blue-500 rounded-lg px-4 py-2 pr-8 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option>Filter by destination</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-500" />
                    </div>

                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-full transition-colors duration-200">
                      See more
                    </button>
                  </div>
                </div>


                {/* Travel Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">

                  {/* Card 1: Kaptai Serenity Escape */}
                  <div className="relative h-[340px] rounded-2xl overflow-hidden shadow-lg">
                    <Image src="/card1.png" alt="Kaptai Serenity Escape" className="absolute inset-0 w-full h-full object-cover" />

                    {/* save icon */}
                    <div className="absolute top-4 right-4 z-10 p-2 rounded-md bg-[#29A376]">
                      <Image src="/save icon.png" alt="Save" className="w-3 h-3" />
                    </div>

                    {/* title + subtitle (left/middle) */}
                    <div className="absolute left-6 top-[46%] -translate-y-1/2 z-10">
                      <h3 className="text-white text-2xl font-semibold mb-1">Kaptai Serenity Escape</h3>
                      <p className="text-white text-base/6 opacity-90">By Maple Trails DMC</p>
                    </div>

                    {/* features row (full width, left & right pills) */}
                    <div className="absolute left-6 right-6 top-[62%] z-10 flex items-center justify-between">
                      {/* left pill (green) */}
                      <div className="flex items-center bg-white/80 backdrop-blur-md rounded-full px-3 py-1.5 shadow-md">
                        <div className="w-7 h-7 rounded-md bg-emerald-600/15 flex items-center justify-center">
                          <Image src="/tick.svg" alt="Included" className="w-4 h-4" />
                        </div>
                        <span className="h-5 w-px bg-emerald-600/50 mx-1.5"></span>
                        <div className="w-7 h-7 rounded-md bg-emerald-600/10 flex items-center justify-center">
                          <Image src="/snack.svg" alt="Dining" className="w-4 h-4" />
                        </div>
                        <span className="h-5 w-px bg-emerald-600/50 mx-1.5"></span>
                        <div className="w-7 h-7 rounded-md bg-emerald-600/10 flex items-center justify-center">
                          <Image src="/train.svg" alt="Transport" className="w-4 h-4" />
                        </div>
                        <span className="h-5 w-px bg-emerald-600/50 mx-1.5"></span>
                        <div className="w-7 h-7 rounded-md bg-emerald-600/10 flex items-center justify-center">
                          <Image src="/swimming.svg" alt="Activities" className="w-4 h-4" />
                        </div>
                        <span className="h-5 w-px bg-emerald-600/50 mx-1.5"></span>
                        <div className="w-7 h-7 rounded-md bg-emerald-600/10 flex items-center justify-center">
                          <Image src="/camera.svg" alt="Photography" className="w-4 h-4" />
                        </div>
                        <span className="h-5 w-px bg-emerald-600/50 mx-1.5"></span>
                        <div className="w-7 h-7 rounded-md bg-emerald-600/10 flex items-center justify-center">
                          <Image src="/bed.svg" alt="Stay" className="w-4 h-4" />
                        </div>
                      </div>

                      {/* right pill (grey) */}
                      <div className="flex items-center bg-white/75 backdrop-blur-md rounded-full px-3 py-1.5 shadow-md">
                        <div className="w-7 h-7 rounded-md bg-gray-600/10 flex items-center justify-center">
                          <Image src="/cross-.svg" alt="Not included" className="w-4 h-4" />
                        </div>
                        <span className="h-5 w-px bg-gray-500/50 mx-1.5"></span>
                        <div className="w-7 h-7 rounded-md bg-gray-600/10 flex items-center justify-center">
                          <Image src="/dinner.svg" alt="Food" className="w-4 h-4" />
                        </div>
                        <span className="h-5 w-px bg-gray-500/50 mx-1.5"></span>
                        <div className="w-7 h-7 rounded-md bg-gray-600/10 flex items-center justify-center">
                          <Image src="/bike.svg" alt="Cycling" className="w-4 h-4" />
                        </div>
                        <span className="h-5 w-px bg-gray-500/50 mx-1.5"></span>
                        <div className="w-7 h-7 rounded-md bg-gray-600/10 flex items-center justify-center">
                          <Image src="/glass.svg" alt="Drinks" className="w-4 h-4" />
                        </div>
                        <span className="h-5 w-px bg-gray-500/50 mx-1.5"></span>
                        <div className="w-7 h-7 rounded-md bg-gray-600/10 flex items-center justify-center">
                          <Image src="/pets.svg" alt="Pets" className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* bottom gradient + date/price */}
                    <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent"></div>
                    <div className="absolute bottom-4 left-6 right-6 z-10 flex items-center justify-between">
                      <div className="flex items-center text-white text-sm">
                        <Image src="/calendar-icon.png" alt="Calendar" className="w-4 h-4 mr-2" />
                        23, Mar - 31, Mar (9D)
                      </div>
                      <div className="flex items-center text-white text-lg font-bold">
                        <Image src="/price-icon.png" alt="Price" className="w-4 h-4 mr-2" />
                        ₹51,120
                      </div>
                    </div>
                  </div>


                  {/* Card 2: Bali Tropical Escape */}
                  <div className="relative h-72 w-70 rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/card2.png"
                      alt="Bali Tropical Escape"
                      className="w-full h-full object-cover"
                    />

                    {/* Save Icon (Bookmark) - Top Right */}
                    <div className="absolute top-4 right-4 p-2 rounded-sm bg-[#29A376]">
                      <Image
                        src="/save icon.png"
                        alt="Save"
                        className="w-3 h-3"
                      />
                    </div>


                    {/* Content at Left Middle */}
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                      <h3 className="text-white text-sm font-semibold mb-2">Kaptai Serenity Escape</h3>
                      <p className="text-white text-sm opacity-80 mb-4">By Maple Trails DMC</p>

                      {/* Feature pills (match screenshot) */}
                      <div className="flex items-center gap-1">
                        {/* Left pill (green icons) */}
                        <div className="flex items-center bg-white/75 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-md">
                          <div className="w-7 h-7 rounded-md bg-emerald-600/15 flex items-center justify-center">
                            <Image src="/check.png" alt="Included" className="w-4 h-4" />
                          </div>
                          <span className="h-5 w-px bg-emerald-600/50 mx-1.5"></span>
                          <div className="w-7 h-7 rounded-md bg-emerald-600/10 flex items-center justify-center">
                            <Image src="/food.png" alt="Dining" className="w-4 h-4" />
                          </div>
                          <span className="h-5 w-px bg-emerald-600/50 mx-1.5"></span>
                          <div className="w-7 h-7 rounded-md bg-emerald-600/10 flex items-center justify-center">
                            <Image src="/travel.png" alt="Transport" className="w-4 h-4" />
                          </div>
                          <span className="h-5 w-px bg-emerald-600/50 mx-1.5"></span>
                          <div className="w-7 h-7 rounded-md bg-emerald-600/10 flex items-center justify-center">
                            <Image src="/swimming.png" alt="Activities" className="w-4 h-4" />
                          </div>
                          <span className="h-5 w-px bg-emerald-600/50 mx-1.5"></span>
                          <div className="w-7 h-7 rounded-md bg-emerald-600/10 flex items-center justify-center">
                            <Image src="/camera.png" alt="Photography" className="w-4 h-4" />
                          </div>
                          <span className="h-5 w-px bg-emerald-600/50 mx-1.5"></span>
                          <div className="w-7 h-7 rounded-md bg-emerald-600/10 flex items-center justify-center">
                            <Image src="/person.png" alt="Stay" className="w-4 h-4" />
                          </div>
                        </div>

                        {/* Right pill (grey icons) */}
                        <div className="flex items-center bg-white/70 backdrop-blur-sm rounded-full px-1 py-1.5 shadow-md">
                          <div className="w2 h-2 rounded-md bg-gray-600/10 flex items-center justify-center">
                            <Image src="/cross-icon.png" alt="Not included" className="w-4 h-4" />
                          </div>
                          <span className="h-5 w-px bg-gray-500/50 mx-1.5"></span>
                          <div className="w-7 h-7 rounded-md bg-gray-600/10 flex items-center justify-center">
                            <Image src="/utensils-icon.png" alt="Food" className="w-4 h-4" />
                          </div>
                          <span className="h-5 w-px bg-gray-500/50 mx-1.5"></span>
                          <div className="w-7 h-7 rounded-md bg-gray-600/10 flex items-center justify-center">
                            <Image src="/bicycle-icon.png" alt="Cycling" className="w-4 h-4" />
                          </div>
                          <span className="h-5 w-px bg-gray-500/50 mx-1.5"></span>
                          <div className="w-7 h-7 rounded-md bg-gray-600/10 flex items-center justify-center">
                            <Image src="/wine-icon.png" alt="Drinks" className="w-4 h-4" />
                          </div>
                          <span className="h-5 w-px bg-gray-500/50 mx-1.5"></span>
                          <div className="w-7 h-7 rounded-md bg-gray-600/10 flex items-center justify-center">
                            <Image src="/paw-icon.png" alt="Pets" className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Content - Dates and Price */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-white text-sm">
                          <Image src="/calendar-icon.png" alt="Calendar" className="w-4 h-4 mr-2" />
                          23, Mar - 31, Mar (9D)
                        </div>
                        <div className="flex items-center text-white text-lg font-bold">
                          <Image src="/price-icon.png" alt="Price" className="w-4 h-4 mr-2" />
                          ₹51,120
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Switzerland Alpine Adventure */}

                  <div className="relative h-72 w-70 rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="/card3.png"
                      alt="Switzerland Alpine Adventure"
                      className="w-full h-full object-cover"
                    />

                    {/* Save Icon (Bookmark) - Top Right */}
                    <div className="absolute top-4 right-4 p-2 rounded-sm bg-[#29A376]">
                      <Image
                        src="/save icon.png"
                        alt="Save"
                        className="w-3 h-3"
                      />
                    </div>

                    {/* Content at Left Middle */}
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <h3 className="text-white text-lg font-semibold mb-1">Kaptai Serenity Escape</h3>
                      <p className="text-white text-sm opacity-90 mb-4">By Maple Trails DMC</p>

                      {/* Feature Icons Row 1 - Left Bar (Green Background) */}
                      <div className="flex gap-2 mb-2">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Image src="/tick-icon.png" alt="Included" className="w-4 h-4" />
                        </div>
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Image src="/bed-icon.png" alt="Accommodation" className="w-4 h-4" />
                        </div>
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Image src="/bus-icon.png" alt="Transport" className="w-4 h-4" />
                        </div>
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Image src="/waves-icon.png" alt="Water Activities" className="w-4 h-4" />
                        </div>
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Image src="/camera-icon.png" alt="Photography" className="w-4 h-4" />
                        </div>
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                          <Image src="/bed-icon2.png" alt="Sleep" className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Feature Icons Row 2 - Right Bar (Grey Background) */}
                      <div className="flex gap-2">
                        <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                          <Image src="/cross-icon.png" alt="Not Included" className="w-4 h-4" />
                        </div>
                        <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                          <Image src="/food-icon.png" alt="Food" className="w-4 h-4" />
                        </div>
                        <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                          <Image src="/bicycle-icon.png" alt="Cycling" className="w-4 h-4" />
                        </div>
                        <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                          <Image src="/wine-icon.png" alt="Drinks" className="w-4 h-4" />
                        </div>
                        <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
                          <Image src="/paw-icon.png" alt="Pets" className="w-4 h-4" />
                        </div>
                      </div>
                    </div>

                    {/* Bottom Content - Dates and Price */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-white text-sm">
                          <Image src="/calendar-icon.png" alt="Calendar" className="w-4 h-4 mr-2" />
                          23, Mar - 31, Mar (9D)
                        </div>
                        <div className="flex items-center text-white text-lg font-bold">
                          <Image src="/price-icon.png" alt="Price" className="w-4 h-4 mr-2" />
                          ₹51,120
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Pagination Dots */}
              <div className="flex justify-center gap-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              </div>
            </div>



            {/* Right Section - Dashboard Metrics */}
            <div className="w-full lg:w-[300px] space-y-4">
              {/* Total Itineraries Card */}
              <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Itineraries</p>
                    <p className="text-xl font-bold text-gray-900">247</p>
                  </div>
                  <button className="bg-gray-700 text-white text-xs px-3 py-1 rounded-lg hover:bg-gray-800">View</button>
                </div>
                <p className="text-green-600 text-sm">+0.5%</p>
              </div>

              {/* Total Leads Card */}
              <div className="bg-green-50 border border-green-100 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total leads</p>
                    <p className="text-xl font-bold text-gray-900">47</p>
                  </div>
                  <button className="bg-gray-700 text-white text-xs px-3 py-1 rounded-lg hover:bg-gray-800">View</button>
                </div>
                <p className="text-green-600 text-sm">+0.5%</p>
              </div>

              {/* Generate Itineraries Button */}
              <div className="bg-gradient-to-b from-cyan-400 to-green-500 text-white rounded-lg p-4 cursor-pointer hover:from-cyan-500 hover:to-green-600 transition-all">
                <div className="flex flex-col items-center gap-3">
                  <Network className="w-8 h-8" />
                  <span className="text-sm font-semibold text-center leading-tight">Generate<br />Itineraries</span>
                </div>
              </div>

              {/* Bookings Section */}
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Bookings</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">Complete</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Loader className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-gray-700">In progress</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">5</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-gray-700">Cancelled</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">2</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Second Row */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Total Revenue Chart */}
            <div className="flex-1 bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-semibold text-gray-900">Total Revenue</h3>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-400 rounded"></div>
                    <span className="text-xs text-gray-600">Revenue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-400 rounded"></div>
                    <span className="text-xs text-gray-600">Expenses</span>
                  </div>
                </div>
              </div>

              <div className="text-xl font-bold text-gray-900 mb-3">$190,090.36</div>

              <div className="mb-3">
                <h4 className="text-xs font-semibold text-gray-900 mb-2">Income & Expenses</h4>
                <div className="grid grid-cols-12 gap-1 text-[10px] text-gray-500 mb-1">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
                    <span key={month} className="text-center">{month}</span>
                  ))}
                </div>

                {/* Chart Container */}
                <div className="h-[120px] bg-gray-50 rounded border border-gray-200 relative overflow-hidden">
                  {/* Chart Background Grid */}
                  <div className="absolute inset-0 flex flex-col">
                    {[0, 1, 2, 3, 4].map((line) => (
                      <div key={line} className="flex-1 border-b border-gray-200 last:border-b-0"></div>
                    ))}
                  </div>

                  {/* Chart Data Visualization */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 120">
                    {/* Revenue Area (Green) */}
                    <path
                      d="M 0 100 L 25 90 L 50 85 L 75 80 L 100 70 L 125 60 L 150 50 L 175 45 L 200 40 L 225 35 L 250 30 L 275 25 L 300 20 L 300 120 L 0 120 Z"
                      fill="rgba(34, 197, 94, 0.3)"
                      stroke="rgb(34, 197, 94)"
                      strokeWidth="2"
                    />
                    {/* Expenses Area (Blue) */}
                    <path
                      d="M 0 110 L 25 105 L 50 100 L 75 95 L 100 85 L 125 80 L 150 75 L 175 70 L 200 65 L 225 60 L 250 55 L 275 50 L 300 45 L 300 120 L 0 120 Z"
                      fill="rgba(59, 130, 246, 0.3)"
                      stroke="rgb(59, 130, 246)"
                      strokeWidth="2"
                    />
                  </svg>
                </div>

                <div className="text-[10px] text-gray-500 mt-1 text-right">Time</div>
              </div>
            </div>

            {/* Booking Status Pie Chart */}
            <div className="w-full lg:w-[280px] bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Booking Status Overview</h3>
              <p className="text-xs text-gray-600 mb-4">Pie chart representing the booking status distribution</p>

              <div className="flex items-center justify-center mb-4">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                    {/* Background circle */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#f3f4f6"
                      strokeWidth="20"
                    />
                    {/* Completed (Green) - 63% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="20"
                      strokeDasharray="157 251"
                      strokeDashoffset="0"
                    />
                    {/* In Progress (Blue) - 26% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="20"
                      strokeDasharray="65 251"
                      strokeDashoffset="-157"
                    />
                    {/* Cancelled (Red) - 11% */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="20"
                      strokeDasharray="28 251"
                      strokeDashoffset="-222"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-900">Bookings</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-600">Completed</span>
                  </div>
                  <span className="text-xs font-medium text-gray-900">APR12598</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span className="text-xs text-gray-600">In Progress</span>
                  </div>
                  <span className="text-xs font-medium text-gray-900">APR12399</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-xs text-gray-600">Cancelled</span>
                  </div>
                  <span className="text-xs font-medium text-gray-900">APR12344</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span className="text-xs text-gray-600">Pending</span>
                  </div>
                  <span className="text-xs font-medium text-gray-900">APR12344</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Bookings Table */}
          <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
              <button className="text-blue-600 text-sm font-medium hover:underline">See more</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px] border border-gray-200 rounded-lg overflow-hidden bg-white">
                <thead className="bg-gray-50">
                  <tr className="h-[50px]">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">BOOKING ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">ENQUIRY ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">POC</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">TOUR TYPE</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">LOCATION</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">DEPARTURE DATE</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">PAX</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">AMOUNT</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">PAYMENT STATUS</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">REVENUE GENERATED</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">AMOUNT DUE</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">BOOKING STATUS</th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Row 1 */}
                  <tr className="h-[62px] hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">B001</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">E0012</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">John Smith</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Family</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Paris, Rome</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">15-04-2025</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">4</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">$5000</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">PMD</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">$1000</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">$0</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        <span className="text-sm text-green-600">Confirmed</span>
                      </div>
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="h-[62px] hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">B002</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">E0011</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Emily Johnson</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Solo</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Tokyo</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">11-04-2025</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">1</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">$5000</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">UNIVAD</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">$300</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">$1800</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
                        <span className="text-sm text-yellow-600">Pending</span>
                      </div>
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="h-[62px] hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">B003</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">E0010</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Rahul Verma</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Partner</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Bali</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">03-05-2025</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">2</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">$5000</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">REFUNDED</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">$0</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">$0</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                        <span className="text-sm text-red-600">Cancelled</span>
                      </div>
                    </td>
                  </tr>

                  {/* Row 4 */}
                  <tr className="h-[62px] hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">B004</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">E0012</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">John Smith</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Family</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Paris, Rome</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">15-04-2025</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">4</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">$5000</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">PMD</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">$1000</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">$0</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                        <span className="text-sm text-green-600">Confirmed</span>
                      </div>
                    </td>
                  </tr>

                  {/* Row 5 */}
                  <tr className="h-[62px] hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">B005</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">E0011</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Emily Johnson</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Solo</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Tokyo</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">11-04-2025</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">1</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">$5000</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full">UNPAID</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">$300</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">$1800</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
                        <span className="text-sm text-yellow-600">Pending</span>
                      </div>
                    </td>
                  </tr>

                  {/* Row 6 */}
                  <tr className="h-[62px] hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">B006</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">E0010</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Rahul Verma</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Partner</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">Bali</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">03-05-2025</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">2</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">$5000</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">PARTIAL</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">$0</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">$0</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                        <span className="text-sm text-red-600">Cancelled</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer */}
          <div className="text-[10px] text-gray-500 mt-3">
            © 2025, Made by <span className="text-emerald-500">Trekking Miles</span>.
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard