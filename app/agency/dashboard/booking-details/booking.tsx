import React, { useState } from 'react';
import { Download, Plus, X } from 'lucide-react';

const KashmirBookingDashboard = () => {
  const [] = useState('progress');
  const [showAddProgressModal, setShowAddProgressModal] = useState(false);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);

  const bookingData = [
    {
      date: '18 - 04 - 2025',
      service: 'Hotel in Srinagar',
      status: 'Confirmed',
      statusColor: 'bg-green-500',
      notes: 'Confirmed at Royal Retreat',
      hasDownload: true,
    
    },
    {
      date: '07 - 04 - 2025',
      service: 'Houseboat Stay',
      status: 'Pending',
      statusColor: 'bg-red-500',
      notes: 'Awaiting final hotel reply',
      hasDownload: false,
    },
    {
      date: '05 - 04 - 2025',
      service: 'Local Transport',
      status: 'Confirmed',
      statusColor: 'bg-green-500',
      notes: 'Driver & SUV assigned',
      hasDownload: true,
      
    },
    {
      date: '07 - 04 - 2025',
      service: 'Activities',
      status: 'Not included',
      statusColor: 'bg-gray-400',
      notes: 'Customer opted out',
      hasDownload: false,
     
    },
    {
      date: '07 - 04 - 2025',
      service: 'Gondola Tickets',
      status: 'Confirmed',
      statusColor: 'bg-green-500',
      notes: 'Booked - Private Family',
      hasDownload: true,
      
    },
    {
      date: '05 - 04 - 2025',
      service: 'Guide',
      status: 'Pending',
      statusColor: 'bg-red-500',
      notes: 'Awaiting assignment',
      hasDownload: false,
      
    }
  ];

  // Add Progress Modal Component
  const AddProgressModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Add progress</h2>
          <button 
            onClick={() => setShowAddProgressModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date*
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option>15 Mar 25</option>
              <option>16 Mar 25</option>
              <option>17 Mar 25</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service*
            </label>
            <input 
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter service"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Booking status*
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option>Pending</option>
              <option>Confirmed</option>
              <option>Cancelled</option>
              <option>Not included</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-20"
              placeholder="Add notes..."
            />
          </div>
          
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supporting document
            </label>
            <div className="flex gap-2">
              <input 
                type="text"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="No file chosen"
              />
              <button className="bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700">
                Upload
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <button 
            onClick={() => setShowAddProgressModal(false)}
            className="w-full bg-green-800 text-white py-3 rounded-lg font-medium hover:bg-green-900"
          >
            Add progress
          </button>
        </div>
      </div>
    </div>
  );

  // Add Note Modal Component
  const AddNoteModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Notes - customer feedbacks</h2>
          <button 
            onClick={() => setShowAddNoteModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-orange-400 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">LR</span>
            </div>
            <span className="font-medium text-gray-800">Lisa Ray</span>
          </div>
          
          <div>
            <input 
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent mb-4"
              placeholder="Requested changes"
            />
            
            <textarea 
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent h-20 mb-4"
              placeholder="Customer requested to upgrade all hotels to 4-star category, especially in Pahalgam and Srinagar."
            />
            
            <div className="flex gap-2 mb-6">
              <input 
                type="text"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="No file chosen"
              />
              <button className="bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700">
                Upload
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <button 
            onClick={() => setShowAddNoteModal(false)}
            className="bg-green-600 text-white px-8 py-2 rounded-lg font-medium hover:bg-green-700"
          >
            Add feedbacks
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">
            Track Booking Progress - Itinerary: Kashmir Bliss (ITN-20250412-001)
          </h1>
          
          {/* Status Pills */}
          <div className="flex gap-3 mb-6">
            <span className="bg-green-800 text-white px-4 py-2 rounded-full text-sm font-medium">
              View Final Itinerary
            </span>
            <span className="bg-green-800 text-white px-4 py-2 rounded-full text-sm font-medium">
              View Payment Send to DMC
            </span>
            <span className="bg-green-800 text-white px-4 py-2 rounded-full text-sm font-medium">
              View Customer Payment Details
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6 w-[879px]">
            {/* Booking Progress Monitor */}
            <div className="bg-white rounded-lg shadow-sm ">
              <div className="p-6 ">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">Booking Progress Monitor</h2>
                  <button 
                    onClick={() => setShowAddProgressModal(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                  >
                    <Plus size={16} />
                    Add Progress
                  </button>
                </div>
              </div>

             
              {/* Table Header */}
              <div className="px-6 py-3 bg-gray-50">
                <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
                  <div className="col-span-2">Captured on</div>
                  <div className="col-span-2">Services</div>
                  <div className="col-span-2">Booking Status</div>
                  <div className="col-span-2">DMC Notes</div>
                  <div className="col-span-2">Download Files</div>
                </div>
              </div>

              {/* Table Body */}
              <div>
                {bookingData.map((item, index) => (
                  <div key={index} className="px-6 py-4 ">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-2 text-sm text-gray-600">
                        {item.date}
                      </div>
                      <div className="col-span-2 text-sm text-gray-800 font-medium">
                        {item.service}
                      </div>
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${item.statusColor}`}></div>
                          <span className="text-sm text-gray-800">{item.status}</span>
                        </div>
                      </div>
                      <div className="col-span-2 text-sm text-gray-600">
                        {item.notes}
                      </div>
                      <div className="col-span-2">
                        {item.hasDownload && (
                          <button className="bg-gray-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1">
                            <Download size={12} />
                            Download
                          </button>
                        )}
                      </div>
                     
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Feedbacks */}
              <div className="bg-white rounded-lg shadow-sm ">
                <div className="p-6 ">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Customer Feedbacks And Updations</h3>
                    <button 
                      onClick={() => setShowAddNoteModal(true)}
                      className="bg-green-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 w-[111px]"
                    >
                      <Plus size={14} />
                      Add Note
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">RECENT</span>
                      <div className="mt-2">
                        <h4 className="font-medium text-gray-800 mb-1">Itinerary confirmed</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Customer is satisfied with the entire itinerary. No changes requested. Proceeding with confirmation and sending to DMC.
                        </p>
                        <span className="text-xs text-gray-500">02:00 PM - Today</span>
                      </div>
                    </div>
                    <div>
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">OTHER</span>
                      <div className="mt-2">
                        <h4 className="font-medium text-gray-800 mb-1">Requested changes</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          Customer requested to upgrade all hotels to 4-star category, especially in Pahalgam and Srinagar.
                        </p>
                        <span className="text-xs text-gray-500">09:00 PM - Today</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Send Reminder */}
              <div className="bg-white rounded-lg shadow-sm ">
                <div className="p-6 ">
                  <h3 className="text-lg font-semibold text-gray-800 ">Set Reminder</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">BOOKED</span>
                      <div className="mt-2 flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-800 mb-1">Payment pending</h4>
                          <p className="text-sm text-gray-600 mb-2">
                            Customer booked with this entire itinerary. No payment record detected - expecting with confirmation and sending to DMC.
                          </p>
                          <span className="text-xs text-gray-500">12:02 PM - Today</span>
                        </div>
                        <button className="bg-green-600 text-white px-3 py-1 rounded-full text-sm w-[245px]  mt-[-50px] flex items-center justify-center">
                          Set reminder
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6  ml-[103px]">
            {/* Itinerary Overview */}
<div 
  className="border border-gray-200 rounded-lg shadow-lg relative bg-white"
  style={{
    width: "283px",
    minHeight: "390px",
    background: "linear-gradient(to bottom, rgba(91, 193, 127, 0.07), rgba(91, 193, 127, 0.38))",
  }}
>
  <div className="p-5">
    {/* Header */}
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900 font-poppins">Itinerary Overview</h3>
    </div>
    
    {/* Date Badge */}
    <div className="mb-5">
      <div className="bg-green-800 text-white px-3 py-2 rounded-md text-sm font-medium text-center font-poppins">
        Enquiry on: 23-03-2025
      </div>
    </div>
    
    {/* Content */}
    <div className="space-y-3 text-sm">
      <div className="flex gap-2">
        <span className="text-gray-700 font-medium w-24 font-poppins">Destination:</span>
        <span className="text-gray-900 flex-1">Kashmir (Srinagar, Gulmarg, Pahalgam, Sonamarg)</span>
      </div>
      
      <div className="flex gap-2">
        <span className="text-gray-700 font-medium w-24">Customer:</span>
        <span className="text-gray-900 flex-1 font-poppins">Miguel Hernandez</span>
      </div>
      
      <div className="flex gap-2">
        <span className="text-gray-700 font-medium w-24">Dates:</span>
        <span className="text-gray-900 flex-1 font-poppins">15 Mar 25 - 20 Mar 25</span>
      </div>
      
      <div className="flex gap-2">
        <span className="text-gray-700 font-medium w-24">Travellers:</span>
        <span className="text-gray-900 flex-1">2 Adults 2 Children</span>
      </div>
      
      <div className="flex gap-2">
        <span className="text-gray-700 font-medium w-24">DMC:</span>
        <span className="text-gray-900 flex-1 font-poppins">Maple Trails DMC</span>
      </div>
      
      <div className="flex gap-2">
        <span className="text-gray-700 font-medium w-24 font-poppins">Status:</span>
        <span className="text-gray-900 flex-1 font-poppins">Booking in progress</span>
      </div>
      
      <div className="flex gap-2">
        <span className="text-gray-700 font-medium w-24 font-poppins">Contact:</span>
        <span className="text-gray-900 flex-1 font-poppins">Khurffiv</span>
      </div>
      
      <div className="flex gap-2">
        <span className="text-gray-700 font-medium w-24 font-poppins">Staff:</span>
        <span className="text-gray-900 flex-1 font-poppins">Afsalfa</span>
      </div>
    </div>
  </div>
</div>

            {/* WhatsApp Promotion - Fixed positioning and styling */}
           <div className="border-5 border-white shadow-lg bg-gray-200 shadow-lg relative overflow-hidden"
              style={{
                width: "283px",
                height: "328px",
                background: "url('/img.png'), linear-gradient(to bottom, rgba(91, 193, 127, 0.07), rgba(91, 193, 127, 0.38))",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
              }}>
              <div className="p-4 ml-[24px]">
                <div className="absolute right-4 top-4">
                
                </div>
                <h3 className="text-xs  text-center text-white mb-3  font-poppins leading-tight w-[253px] ml-[-40px]">
                  Save Time On Calls And Emails! Invite Your DMC To Connect Via WhatsApp Business For Faster Updates.
                </h3>
                <button className="bg-pink hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-xs mt-4 font-poppins mt-[165px]">
                  START WHATSAPP CHATS
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAddProgressModal && <AddProgressModal />}
      {showAddNoteModal && <AddNoteModal />}
    </div>
  );
};

export default KashmirBookingDashboard;