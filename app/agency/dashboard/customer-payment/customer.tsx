import React, { useState } from 'react';
import {  Download, Upload, Info } from 'lucide-react';

interface PaymentData {
  customerName: string;
  itineraryReference: string;
  totalCost: string;
  amountPaid: string;
  paymentDate: string;
  remainingBalance: string;
  paymentStatus: string;
  shareMethod: 'whatsapp' | 'email';
  paymentLink: string;
}

const PaymentOverviewForm: React.FC = () => {
  const [paymentData, setPaymentData] = useState<PaymentData>({
    customerName: 'Miguel Hernandez',
    itineraryReference: 'ITN-20250412-001',
    totalCost: '1,280.00',
    amountPaid: '500.00',
    paymentDate: '12-04-25',
    remainingBalance: '780.00',
    paymentStatus: 'Partial',
    shareMethod: 'whatsapp',
    paymentLink: 'https://rzp-test.razorpay.com/l/abc123xyz'
  });

  const [reminders, setReminders] = useState([
    {
      id: 1,
      type: 'Payment pending',
      message: 'Customer is satisfied with the entire itinerary. No changes requested. Proceeding with confirmation and sending to DMC.',
      time: '02:00 PM',
      date: 'Today',
      status: 'RECENT'
    }
  ]);

  const [showProgress, setShowProgress] = useState(false);

  const handleInputChange = (field: keyof PaymentData, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(paymentData.paymentLink);
    // You could add a toast notification here
  };

  const handleSendReminder = () => {
    setShowProgress(true);
    // Simulate sending reminder
    setTimeout(() => {
      setShowProgress(false);
      // Add new reminder to list
      const newReminder = {
        id: reminders.length + 1,
        type: 'Reminder sent',
        message: `Payment reminder sent via ${paymentData.shareMethod}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        date: 'Today',
        status: 'SENT'
      };
      setReminders(prev => [newReminder, ...prev]);
    }, 2000);
  };

  const handleUpdate = () => {
    // Handle form update
    console.log('Updating payment data:', paymentData);
  };

  const handleUploadReceipt = () => {
    // Handle file upload
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log('Uploaded file:', file.name);
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Payment Overview */}
          <div className="bg-white rounded-lg shadow-sm w-[640px]">
            <div className="p-4 sm:p-6">
              {/* Progress Bar */}
              <div className="mb-6">
                <h2 className="text-base sm:text-lg font-semibold mb-4">Payment Overview & Link Sharing</h2>
                <div className="flex items-center">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-800 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <span className="ml-3 text-sm text-gray-600">70% Complete</span>
                </div>
              </div>

              {/* Customer Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-bold text-black mb-1">
                    Customer name:
                  </label>
                  <input
                    type="text"
                    value={paymentData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-1">
                    Itinerary Reference ID:
                  </label>
                  <input
                    type="text"
                    value={paymentData.itineraryReference}
                    onChange={(e) => handleInputChange('itineraryReference', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              {/* Payment Overview Section */}
              <div className="space-y-4">
                <h3 className="text-sm sm:text-md font-medium text-gray-900">Payment overview</h3>
                
                {/* Total Itinerary Cost */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    Total Itinerary Cost
                    <Info className="w-4 h-4 ml-1 text-gray-400" />
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={paymentData.totalCost}
                      onChange={(e) => handleInputChange('totalCost', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm"
                    />
                    <select className="px-2 sm:px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm">
                      <option>US Dollar</option>
                      <option>EUR</option>
                      <option>GBP</option>
                    </select>
                  </div>
                </div>

                {/* Amount Paid */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount paid
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={paymentData.amountPaid}
                      onChange={(e) => handleInputChange('amountPaid', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm"
                    />
                    <select className="px-2 sm:px-3 py-2 border border-l-0 border-gray-500 rounded-r-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 text-sm">
                      <option>US Dollar</option>
                      <option>EUR</option>
                      <option>GBP</option>
                    </select>
                  </div>
                </div>

                {/* Payment Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment date
                  </label>
                  <select 
                    value={paymentData.paymentDate}
                    onChange={(e) => handleInputChange('paymentDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  >
                    <option value="12-04-25">12 - 04 - 25</option>
                    <option value="13-04-25">13 - 04 - 25</option>
                    <option value="14-04-25">14 - 04 - 25</option>
                  </select>
                </div>

                {/* Remaining Balance */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remaining Balance
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={paymentData.remainingBalance}
                      onChange={(e) => handleInputChange('remainingBalance', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      readOnly
                    />
                    <select className="px-2 sm:px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm">
                      <option>US Dollar</option>
                      <option>EUR</option>
                      <option>GBP</option>
                    </select>
                  </div>
                </div>

                {/* Payment Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment status
                  </label>
                  <select 
                    value={paymentData.paymentStatus}
                    onChange={(e) => handleInputChange('paymentStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  >
                    <option value="Partial">Partial</option>
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                </div>

                {/* Attach Receipt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Attach receipt
                  </label>
                  <button
                    onClick={handleUploadReceipt}
                    className="w-full px-4 py-2 bg-green-800 text-white rounded-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center justify-center text-sm"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </button>
                </div>

                {/* Update Button */}
                <button
                  onClick={handleUpdate}
                  className="w-full mt-6 px-4 py-3 bg-green-800 text-white rounded-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium text-sm"
                >
                  Update
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Share Payment Link & Send Reminder */}
          <div className="space-y-4 sm:space-y-6">
            {/* Share Payment Link */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 w-[528px] ml-[57px]">
              <h3 className="text-base sm:text-lg font-semibold mb-4">Share Payment Link</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Share via:
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="shareMethod"
                      value="whatsapp"
                      checked={paymentData.shareMethod === 'whatsapp'}
                      onChange={(e) => handleInputChange('shareMethod', e.target.value)}
                      className="mr-2 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm">Whatsapp</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="shareMethod"
                      value="email"
                      checked={paymentData.shareMethod === 'email'}
                      onChange={(e) => handleInputChange('shareMethod', e.target.value)}
                      className="mr-2 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm">Email</span>
                  </label>
                </div>
              </div>

              <button
                onClick={handleSendReminder}
                disabled={showProgress}
                className="w-full px-4 py-2 bg-green-800 text-white rounded-md hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed mb-4 text-sm"
              >
                {showProgress ? 'Sending...' : 'Send'}
              </button>

              <div className="text-center text-gray-500 text-sm mb-4">or</div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Copy link
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={paymentData.paymentLink}
                    onChange={(e) => handleInputChange('paymentLink', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3 sm:px-4 py-2 bg-yellow-500 text-white rounded-r-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>

            {/* Send Reminder */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 w-[528px] ml-[57px]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                <h3 className="text-base sm:text-lg font-semibold">Send Reminder</h3>
                <button
                  onClick={handleSendReminder}
                  disabled={showProgress}
                  className="px-3 sm:px-4 py-2 bg-green-800 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {showProgress ? 'Sending...' : 'Send reminder'}
                </button>
              </div>

              <div className="space-y-3">
                {reminders.map((reminder) => (
                  <div key={reminder.id} className="border-l-4 border-green-500 pl-4 pb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                        {reminder.status}
                      </span>
                    </div>
                    <h4 className="font-medium text-gray-900 mb-1 text-sm">{reminder.type}</h4>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">{reminder.message}</p>
                    <p className="text-xs text-gray-500">{reminder.time}, {reminder.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Summary Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden w-[528px] ml-[57px]">
              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid on</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount paid</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">12 - 04 - 25</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">500.00 USD</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">780.00 USD</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-500 text-white">
                          PARTIALLY PAID
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <button className="flex items-center text-sm text-white bg-gray-600 hover:text-blue-800 px-2 py-1 rounded">
                          <Download className="w-4 h-4 mr-1" />
                          Download
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="block sm:hidden p-4">
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Paid on:</span>
                      <span className="text-gray-900">12 - 04 - 25</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Amount paid:</span>
                      <span className="text-gray-900">500.00 USD</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Pending:</span>
                      <span className="text-gray-900">780.00 USD</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 font-medium">Status:</span>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-500 text-white">
                        PARTIALLY PAID
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-gray-600 font-medium">Invoice:</span>
                      <button className="flex items-center text-sm text-white bg-gray-600 px-2 py-1 rounded">
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentOverviewForm;