import React, { useCallback, useEffect, useState } from 'react';
import { Plus, X, Calendar, MapPin, Users, Phone, User, Edit2, Save } from 'lucide-react';

// Type definitions
interface ProgressData {
  id: number;
  date: string;
  service: string;
  status: string;
  dmcNotes: string;
}

interface Feedback {
  id: number;
  note: string;
  createdAt: string;
}

interface Reminder {
  id: number;
  date: string;
  note: string;
}

interface Service {
  time: string;
  activity: string;
  type: string;
  description: string;
}

interface ItineraryService {
  day: number;
  date: Date;
  services: Service[];
}

interface ItineraryData {
  id: string;
  name: string;
  phone: string;
  email: string;
  startDate: string;
  endDate: string;
  days: number;
  nights: number;
  adults: number;
  kids: number;
  costINR: number;
  costUSD: number;
  locations: string;
  package: string;
}

interface DMCData {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phoneNumber: string;
}

interface NewRow {
  date: string;
  service: string;
  status: string;
  dmcNotes: string;
}

interface NewFeedback {
  note: string;
}

interface NewReminder {
  date: string;
  note: string;
}

const statusOptions = ["Pending", "Confirmed", "Cancelled", "Not included", "In Progress", "Awaiting Confirmation"];

const BookingProgressDashboard = () => {
  // Get enquiry ID from URL params (in real app this would come from router)
  const [enquiryId, ] = useState('enquiry-1'); 
  const [, setAssignedStaffId] = useState('staff-1');

  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [itineraryData, setItineraryData] = useState<ItineraryData | null>(null);
  const [, setDmcData] = useState<DMCData | null>(null);
  const [itineraryServices, setItineraryServices] = useState<ItineraryService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newRow, setNewRow] = useState<NewRow>({ date: "", service: "", status: "Pending", dmcNotes: "" });
  const [showAddProgressModal, setShowAddProgressModal] = useState<boolean>(false);
  const [editingRow, setEditingRow] = useState<number | null>(null);

  // Feedback state
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [showAddNoteModal, setShowAddNoteModal] = useState<boolean>(false);
  const [newFeedback, setNewFeedback] = useState<NewFeedback>({ note: "" });

  // Reminder state
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [showReminderModal, setShowReminderModal] = useState<boolean>(false);
  const [newReminder, setNewReminder] = useState<NewReminder>({ date: "", note: "" });

  // Fetch enquiry data dynamically
  const fetchEnquiryData = async (id: string) => {
    try {
      const response = await fetch(`/api/enquiries/${id}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const enquiry = result.data;
          
          // Calculate days and nights
          const start = new Date(enquiry.startDate);
          const end = new Date(enquiry.endDate);
          const timeDiff = end.getTime() - start.getTime();
          const days = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
          
          setItineraryData({
            id: enquiry.id,
            name: enquiry.name,
            phone: enquiry.phone,
            email: enquiry.email,
            startDate: enquiry.startDate,
            endDate: enquiry.endDate,
            days: days,
            nights: days - 1,
            adults: enquiry.adults || 2,
            kids: enquiry.kids || 0,
            costINR: enquiry.totalCostINR || 0,
            costUSD: enquiry.totalCostUSD || 0,
            locations: enquiry.locations || '',
            package: enquiry.packageName || `${enquiry.locations} Adventure Package`
          });
        }
      }
    } catch (error) {
      console.error('Error fetching enquiry data:', error);
    }
  };

  // Fetch selected DMC data from share-dmc
  const fetchSelectedDMC = async (enquiryId: string) => {
    try {
      const response = await fetch(`/api/share-dmc?enquiryId=${enquiryId}`);
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data.length > 0) {
          // Get the first shared DMC entry
          const sharedDMC = result.data[0];
          if (sharedDMC.selectedDMCs && sharedDMC.selectedDMCs.length > 0) {
            // Get the first selected DMC (you can modify this logic as needed)
            const selectedDMC = sharedDMC.selectedDMCs[0].dmc;
            setDmcData({
              id: selectedDMC.id,
              name: selectedDMC.name,
              contactPerson: selectedDMC.primaryContact,
              email: selectedDMC.email,
              phoneNumber: selectedDMC.phoneNumber
            });
            setAssignedStaffId(sharedDMC.assignedStaffId);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching DMC data:', error);
    }
  };

  // Parse services from CSV (mock implementation - replace with actual CSV reading)
  const loadServicesFromCSV = useCallback(async () => {
    try {
      // In a real implementation, you would read the CSV file here
      // For now, we'll simulate this with some mock data based on the enquiry
      
          if (itineraryData) {
      const mockServices: ItineraryService[] = [];
      
      for (let day = 1; day <= itineraryData.days; day++) {
        const dayDate = new Date(itineraryData.startDate);
        dayDate.setDate(dayDate.getDate() + (day - 1));
        
        const services: Service[] = [
          {
            time: "08:00",
            activity: "Breakfast",
            type: "meal",
            description: "Hotel breakfast"
          }
        ];

          
          // Add location-specific activities
          if (itineraryData.locations.toLowerCase().includes('kashmir')) {
            services.push({
              time: "09:30",
              activity: day === 1 ? "Arrival & Check-in" : day === 2 ? "Dal Lake Shikara Ride" : "Gulmarg Gondola",
              type: day === 1 ? "transfer" : "sightseeing",
              description: day === 1 ? "Airport pickup and hotel check-in" : day === 2 ? "Romantic boat ride on Dal Lake" : "Cable car ride to Khilanmarg"
            });
          } else {
            services.push({
              time: "09:30",
              activity: `${itineraryData.locations} Sightseeing`,
              type: "sightseeing",
              description: `Explore ${itineraryData.locations} attractions`
            });
          }
          
          services.push({
            time: "19:00",
            activity: "Dinner",
            type: "meal",
            description: "Local cuisine dinner"
          });
          
          mockServices.push({
            day,
            date: dayDate,
            services
          });
        }
        
        setItineraryServices(mockServices);
      }
    } catch (error) {
    console.error("Error loading services from CSV:", error);
  }
}, [itineraryData]);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchEnquiryData(enquiryId);
      await fetchSelectedDMC(enquiryId);
      setLoading(false);
    };
    
    loadData();
  }, [enquiryId]);

  // Load services when itinerary data is available
  useEffect(() => {
  loadServicesFromCSV();
}, [loadServicesFromCSV]);

  // Add new progress row
  const handleAddProgress = () => {
    const newProgress: ProgressData = {
      id: Date.now(),
      date: newRow.date,
      service: newRow.service,
      status: newRow.status,
      dmcNotes: newRow.dmcNotes
    };
    setProgressData(prev => [...prev, newProgress]);
    setNewRow({ date: "", service: "", status: "Pending", dmcNotes: "" });
    setShowAddProgressModal(false);
  };

  // Update progress row
  const handleUpdateProgress = (id: number, field: string, value: string) => {
    setProgressData(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // Save progress row
  const handleSaveProgress = (id: number) => {
    setEditingRow(null);
    // Here you would typically save to the database
    console.log('Saving progress row:', id);
  };

  // Add new feedback
  const handleAddFeedback = () => {
    const newFeedbackItem: Feedback = {
      id: Date.now(),
      note: newFeedback.note,
      createdAt: new Date().toISOString()
    };
    setFeedbacks(prev => [...prev, newFeedbackItem]);
    setNewFeedback({ note: "" });
    setShowAddNoteModal(false);
  };

  // Add new reminder
  const handleAddReminder = () => {
    const newReminderItem: Reminder = {
      id: Date.now(),
      date: newReminder.date,
      note: newReminder.note
    };
    setReminders(prev => [...prev, newReminderItem]);
    setNewReminder({ date: "", note: "" });
    setShowReminderModal(false);
  };

  // Get available services for dropdown based on itinerary
  const getAvailableServices = (): string[] => {
    const allServices: string[] = [];
    itineraryServices.forEach(day => {
      day.services.forEach(service => {
        allServices.push(`Day ${day.day}: ${service.activity}`);
      });
    });
    return allServices;
  };

  // Add Progress Modal Component
  const AddProgressModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Add Progress</h2>
          <button 
            onClick={() => setShowAddProgressModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date*</label>
            <input
              type="date"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={newRow.date}
              onChange={e => setNewRow({ ...newRow, date: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service*</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={newRow.service}
              onChange={e => setNewRow({ ...newRow, service: e.target.value })}
            >
              <option value="">Select a service</option>
              {getAvailableServices().map((service, idx) => (
                <option key={idx} value={service}>{service}</option>
              ))}
              <option value="custom">Custom Service</option>
            </select>
            {newRow.service === "custom" && (
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg mt-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter custom service"
                onChange={e => setNewRow({ ...newRow, service: e.target.value })}
              />
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Booking Status*</label>
            <select
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={newRow.status}
              onChange={e => setNewRow({ ...newRow, status: e.target.value })}
            >
              {statusOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">DMC Notes</label>
            <input
              className="w-full p-3 border border-gray-300 rounded-lg h-20 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-vertical"
              placeholder="Add notes..."
              value={newRow.dmcNotes}
              onChange={e => setNewRow({ ...newRow, dmcNotes: e.target.value })}
            />
          </div>
        </div>
        <div className="mt-8">
          <button
            onClick={handleAddProgress}
            className="w-full bg-green-800 text-white py-3 rounded-lg font-medium hover:bg-green-900 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!newRow.date || !newRow.service}
          >
            Add Progress
          </button>
        </div>
      </div>
    </div>
  );

  // Add Note Modal Component
  const AddNoteModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Add Customer Feedback</h2>
          <button 
            onClick={() => setShowAddNoteModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <textarea
            className="w-full p-3 border border-gray-300 rounded-lg h-32 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-vertical"
            placeholder="Enter customer feedback or notes..."
            value={newFeedback.note}
            onChange={e => setNewFeedback({ ...newFeedback, note: e.target.value })}
          />
        </div>
        <div className="mt-8">
          <button
            onClick={handleAddFeedback}
            className="w-full bg-green-800 text-white py-3 rounded-lg font-medium hover:bg-green-900 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!newFeedback.note.trim()}
          >
            Add Feedback
          </button>
        </div>
      </div>
    </div>
  );

  // Reminder Modal
  const AddReminderModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Set Reminder</h2>
          <button 
            onClick={() => setShowReminderModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Date*</label>
            <input
              type="date"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={newReminder.date}
              onChange={e => setNewReminder({ ...newReminder, date: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Reminder Note*</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg h-24 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-vertical"
              placeholder="Enter reminder details..."
              value={newReminder.note}
              onChange={e => setNewReminder({ ...newReminder, note: e.target.value })}
            />
          </div>
        </div>
        <div className="mt-8">
          <button
            onClick={handleAddReminder}
            className="w-full bg-green-800 text-white py-3 rounded-lg font-medium hover:bg-green-900 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!newReminder.date || !newReminder.note.trim()}
          >
            Set Reminder
          </button>
        </div>
      </div>
    </div>
  );

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      case 'Not included': return 'bg-gray-100 text-gray-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Awaiting Confirmation': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Progress Dashboard
          </h1>
          <p className="text-gray-600">
            {itineraryData?.package || 'Loading...'} - {enquiryId}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Booking Progress Monitor */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-800">Booking Progress Monitor</h2>
                  <button 
                    onClick={() => setShowAddProgressModal(true)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                  >
                    <Plus size={16} />
                    Add Progress
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DMC Notes</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                            <span className="ml-2">Loading progress...</span>
                          </div>
                        </td>
                      </tr>
                    ) : progressData.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
  No progress entries yet. Click &quot;Add Progress&quot; to get started.
</td>
                      </tr>
                    ) : (
                      progressData.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {editingRow === item.id ? (
                              <input
                                type="date"
                                value={item.date}
                                onChange={e => handleUpdateProgress(item.id, 'date', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded text-sm"
                              />
                            ) : (
                              item.date ? new Date(item.date).toLocaleDateString() : ""
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                            {editingRow === item.id ? (
                              <select
                                value={item.service}
                                onChange={e => handleUpdateProgress(item.id, 'service', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded text-sm"
                              >
                                {getAvailableServices().map((service, idx) => (
                                  <option key={idx} value={service}>{service}</option>
                                ))}
                              </select>
                            ) : (
                              item.service
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {editingRow === item.id ? (
                              <select
                                value={item.status}
                                onChange={e => handleUpdateProgress(item.id, 'status', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded text-sm"
                              >
                                {statusOptions.map(opt => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            ) : (
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(item.status)}`}>
                                {item.status}
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 max-w-xs">
                            {editingRow === item.id ? (
                              <textarea
                                value={item.dmcNotes}
                                onChange={e => handleUpdateProgress(item.id, 'dmcNotes', e.target.value)}
                                className="w-full p-2 border border-gray-300 rounded text-sm h-20 resize-vertical"
                                placeholder="Enter DMC notes..."
                              />
                            ) : (
                              <div className="truncate" title={item.dmcNotes}>
                                {item.dmcNotes || "—"}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {editingRow === item.id ? (
                              <button
                                onClick={() => handleSaveProgress(item.id)}
                                className="text-green-600 hover:text-green-900 flex items-center gap-1"
                              >
                                <Save size={16} />
                                Save
                              </button>
                            ) : (
                              <button
                                onClick={() => setEditingRow(item.id)}
                                className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                              >
                                <Edit2 size={16} />
                                Edit
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer Feedbacks */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Customer Feedback</h3>
                    <button 
                      onClick={() => setShowAddNoteModal(true)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-1 transition-colors"
                    >
                      <Plus size={14} />
                      Add Note
                    </button>
                  </div>
                </div>
                <div className="p-6 max-h-64 overflow-y-auto">
                  <div className="space-y-4">
                    {feedbacks.length === 0 ? (
                      <div className="text-gray-500 text-sm text-center py-4">No feedback entries yet.</div>
                    ) : (
                      feedbacks.map((fb) => (
                        <div key={fb.id} className="bg-gray-50 rounded-lg p-4">
                          <p className="text-gray-800 text-sm mb-2">{fb.note}</p>
                          <span className="text-xs text-gray-500">
                            {new Date(fb.createdAt).toLocaleString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Reminders */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">Reminders</h3>
                    <button 
                      onClick={() => setShowReminderModal(true)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-full text-sm flex items-center gap-1 transition-colors"
                    >
                      <Plus size={14} />
                      Set Reminder
                    </button>
                  </div>
                </div>
                <div className="p-6 max-h-64 overflow-y-auto">
                  <div className="space-y-4">
                    {reminders.length === 0 ? (
                      <div className="text-gray-500 text-sm text-center py-4">No reminders set.</div>
                    ) : (
                      reminders.map((rem) => (
                        <div key={rem.id} className="bg-yellow-50 border-l-4 border-yellow-400 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <Calendar className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="text-gray-800 text-sm mb-1">{rem.note}</p>
                              <span className="text-xs text-gray-600">
                                Due: {new Date(rem.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
           
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Itinerary Overview */}
            <div className="bg-gradient-to-b from-green-50 to-green-100 border border-green-200 rounded-lg shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  Itinerary Overview
                </h3>
                
                <div className="mb-4">
                  <div className="bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium text-center">
                    Start Date: {itineraryData?.startDate || 'Loading...'}
                  </div>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-600 font-medium">Package:</span>
                    <span className="text-gray-900">{itineraryData?.name || 'Loading...'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-600 font-medium">Duration:</span>
                    <span className="text-gray-900">
                      {itineraryData ? `${itineraryData.days} Days, ${itineraryData.nights} Nights` : 'Loading...'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-600 font-medium">Travelers:</span>
                    <span className="text-gray-900">
                      {itineraryData ? `${itineraryData.adults} Adults${itineraryData.kids ? `, ${itineraryData.kids} Kids` : ''}` : 'Loading...'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 flex-shrink-0">💰</div>
                    <span className="text-gray-600 font-medium">Cost:</span>
                    <span className="text-gray-900">
                      {itineraryData ? `₹${itineraryData.costINR?.toLocaleString()} / ${itineraryData.costUSD}` : 'Loading...'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-600 font-medium">Status:</span>
                    <span className="text-gray-900">Booking in progress</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-600 font-medium">Quote ID:</span>
                    <span className="text-gray-900">{itineraryData?.id || 'Loading...'}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-600 font-medium">DMC:</span>
                    <span className="text-gray-900">Maple Trails DMC</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-600 font-medium">Staff:</span>
                    <span className="text-gray-900">Afsalfa</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* WhatsApp Promotion */}
            <div className="bg-gradient-to-br from-green-600 to-green-800 text-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <h3 className="text-sm font-medium mb-4 leading-tight">
                  Save Time On Calls And Emails! Invite Your DMC To Connect Via WhatsApp Business For Faster Updates.
                </h3>
                <button className="bg-white text-green-800 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium text-sm transition-colors">
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
      {showReminderModal && <AddReminderModal />}
    </div>
  );
};

export default BookingProgressDashboard;