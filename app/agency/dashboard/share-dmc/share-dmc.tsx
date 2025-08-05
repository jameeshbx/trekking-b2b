import React, { useState } from 'react';
import { ChevronDown, FileText, Calendar } from 'lucide-react';
import Image from 'next/image';

const TravelBookingInterface = () => {
  const [activeStatuses, setActiveStatuses] = useState<Record<number, boolean>>({
    1: false,
    2: true,
    3: false,
    4: false
  });

  const toggleStatus = (id: number) => {
    setActiveStatuses(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm text-gray-600">
            Handled by : <span className="font-medium text-gray-800">AStaff2</span>
          </div>
          <button className="bg-white border border-gray-300 rounded px-3 py-1 text-sm text-gray-600 hover:bg-gray-50">
            Reassign Staff
          </button>
        </div>

        {/* Main Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          {/* Table Header */}
          <div className="bg-green-100 px-6 py-3 flex items-center justify-between text-sm font-medium text-gray-700">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Date generated
            </div>
            <div>PDF</div>
            <div>Active Status</div>
            <div>Send to DMC</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-gray-200">
            {/* Row 1 */}
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">08 - 03 - 2025</div>
              <div>
                <FileText className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={activeStatuses[1]}
                    onChange={() => toggleStatus(1)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center">
                <select className="text-sm text-gray-500 border-none bg-transparent focus:outline-none">
                  <option>Select...</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
              </div>
            </div>

            {/* Row 2 - Highlighted */}
            <div className="px-6 py-4 flex items-center justify-between bg-yellow-50">
              <div className="text-sm text-gray-600">06 - 03 - 2025</div>
              <div>
                <FileText className="w-5 h-5 text-golden-yellow" />
              </div>
              <div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={activeStatuses[2]}
                    onChange={() => toggleStatus(2)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-golden-yellow"></div>
                </label>
              </div>
              <div className="flex gap-2">
                <span className="bg-golden-yellow text-white text-xs px-2 py-1 rounded">Awaiting Transfer</span>
                <span className="bg-golden-yellow text-white text-xs px-2 py-1 rounded">Awaiting DMC Europe</span>
                <span className="bg-golden-yellow text-white text-xs px-2 py-1 rounded">Awaiting Trails DMC</span>
                <button className="text-gray-400 hover:text-gray-600">×</button>
              </div>
            </div>

            {/* Row 3 */}
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">03 - 03 - 2025</div>
              <div>
                <FileText className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={activeStatuses[3]}
                    onChange={() => toggleStatus(3)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center">
                <select className="text-sm text-gray-500 border-none bg-transparent focus:outline-none">
                  <option>Select...</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
              </div>
            </div>

            {/* Row 4 */}
            <div className="px-6 py-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">28 - 02 - 2025</div>
              <div>
                <FileText className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={activeStatuses[4]}
                    onChange={() => toggleStatus(4)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center">
                <select className="text-sm text-gray-500 border-none bg-transparent focus:outline-none">
                  <option>Select...</option>
                </select>
                <ChevronDown className="w-4 h-4 text-gray-400 ml-1" />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section Title */}
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Itinerary Quote & Margin Overview</h3>

        {/* Cards Section */}
        <div className="grid grid-cols-3 gap-6">
          {/* Card 1 - EuroVista Travels */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center mr-3">
               <Image src="/avatar.png" alt="" width={100} height={100}/>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">EuroVista Travels</h4>
                <p className="text-sm text-gray-500">Manually entered</p>
              </div>
            </div>
            
            <h5 className="font-semibold text-gray-800 mb-2">Itinerary viewed</h5>
            <p className="text-sm text-gray-500 mb-4">Itinerary sent on : 07 - 03 - 2025</p>
            
            <div className="flex gap-2">
              <button className="bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700">
                View Itinerary
              </button>
              <button className="bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700">
                Update Status
              </button>
            </div>
          </div>

          {/* Card 2 - BlueSky DMC Europe */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center mr-3">
                <Image src="/avatar.png" alt="" width={100} height={100}/>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">BlueSky DMC Europe</h4>
                <p className="text-sm text-gray-500">Self registered</p>
              </div>
            </div>
            
            <h5 className="font-semibold text-gray-800 mb-2">Awaiting internal review</h5>
            <p className="text-sm text-gray-500 mb-4">Itinerary sent on : 07 - 03 - 2025</p>
            
            <div className="flex gap-2">
              <button className="bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700">
                View Itinerary
              </button>
              <button className="bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700">
                Update Status
              </button>
            </div>
          </div>

          {/* Card 3 - Maple Trails DMC */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-teal-600 rounded-full flex items-center justify-center mr-3">
                <Image src="/avatar.png" alt="" width={100} height={100}/>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Maple Trails DMC</h4>
                <p className="text-sm text-gray-500">Manually entered</p>
              </div>
            </div>
            
            <h5 className="font-semibold text-gray-800 mb-2">Quotation received</h5>
            <p className="text-sm text-gray-500 mb-4">Itinerary sent on : 07 - 03 - 2025</p>
            
            <div className="space-y-2">
              <div className="flex gap-2">
                <button className="bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700">
                  View Itinerary
                </button>
                <button className="bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700">
                  Update Status
                </button>
              </div>
              <div className="flex gap-2">
                <button className="bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700">
                  Get margin
                </button>
                <button className="bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700">
                  Share to customer
                </button>
              </div>
              <button className="bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700 w-full">
                Pay to DMC
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelBookingInterface;