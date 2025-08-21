import React, { useState } from 'react';
import { Info, Download } from 'lucide-react';

interface PaymentData {
  dmcName: string;
  itineraryReference: string;
  paymentMode: 'Offline' | 'Online';
  totalCost: string;
  amountPaid: string;
  paymentDate: string;
  remainingBalance: string;
  paymentStatus: string;
  paymentChannel: string;
  transactionId: string;
  selectedBank: string;
  paymentGateway: string;
}

const DMCPaymentInterface: React.FC = () => {
  const [paymentData, setPaymentData] = useState<PaymentData>({
    dmcName: 'Maple Trails DMC',
    itineraryReference: 'ITN-20250412-001',
    paymentMode: 'Offline',
    totalCost: '1,100.00',
    amountPaid: '500.00',
    paymentDate: '13 - 04 - 25',
    remainingBalance: '600.00',
    paymentStatus: 'Partial',
    paymentChannel: 'Bank transfer ( manual entry )',
    transactionId: '41431545',
    selectedBank: 'Wells Fargo Bank, N.A. ( 987654321098 )',
    paymentGateway: 'https://pages.razorpay.com/family-camping'
  });

  const [showBankDetails, setShowBankDetails] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const handleInputChange = (field: keyof PaymentData, value: string) => {
    setPaymentData(prev => ({ ...prev, [field]: value }));
  };

  const handlePaymentModeChange = (mode: 'Offline' | 'Online') => {
    setPaymentData(prev => ({ 
      ...prev, 
      paymentMode: mode,
      paymentChannel: mode === 'Offline' ? 'Bank transfer ( manual entry )' : 'Payment gateway'
    }));
    setShowBankDetails(mode === 'Offline');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (file) {
    setSelectedFile(file);
    // You can handle the file upload logic here
    console.log('Selected file:', file.name);
  }
};

  const handleCopyGateway = () => {
    navigator.clipboard.writeText(paymentData.paymentGateway);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - DMC Payment Form */}
          <div className="xl:col-span-2 bg-white rounded-lg shadow-sm w-[640px]">
            <div className="p-4 sm:p-6">
              {/* Header */}
              <div className="mb-6">
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">DMC Payment</h1>
                
                {/* Progress Bar */}
                <div className="flex items-center mb-6">
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mr-4">
                    <div className="bg-green-800 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <span className="text-xs text-gray-500 whitespace-nowrap">45% Complete</span>
                </div>
              </div>

              {/* DMC Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    DMC name:
                  </label>
                  <span className="text-sm text-gray-900">{paymentData.dmcName}</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Itinerary Reference ID:
                  </label>
                  <span className="text-sm text-gray-900">{paymentData.itineraryReference}</span>
                </div>
              </div>

              {/* Payment Overview */}
              <div className="mb-6">
                <h3 className="text-sm sm:text-md font-medium text-gray-900 mb-4">Payment overview</h3>
                
                {/* Payment Mode Toggle */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-6 mb-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMode"
                      checked={paymentData.paymentMode === 'Offline'}
                      onChange={() => handlePaymentModeChange('Offline')}
                      className="mr-2 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Offline</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="paymentMode"
                      checked={paymentData.paymentMode === 'Online'}
                      onChange={() => handlePaymentModeChange('Online')}
                      className="mr-2 text-green-600 focus:ring-green-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Online</span>
                  </label>
                </div>

                {/* Conditional Form Fields Based on Payment Mode */}
                {paymentData.paymentMode === 'Offline' ? (
                  <>
                    {/* Download Notice for Offline */}
                    <div className="mb-4 p-3 bg-gray-100 rounded-md">
                      <span className="text-xs text-gray-600">Download manual itinerary web feed details</span>
                    </div>

                    {/* Full Form Fields for Offline */}
                    <div className="space-y-4">
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
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          />
                          <select className="px-2 sm:px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm">
                            <option>US Dollar</option>
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
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                          />
                          <select className="px-2 sm:px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm">
                            <option>US Dollar</option>
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
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        >
                          <option value="13 - 04 - 25">13 - 04 - 25</option>
                          <option value="12 - 04 - 25">12 - 04 - 25</option>
                          <option value="14 - 04 - 25">14 - 04 - 25</option>
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
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-100 text-sm"
                            readOnly
                          />
                          <select className="px-2 sm:px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm">
                            <option>US Dollar</option>
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
                        </select>
                      </div>

                      {/* Payment Channel */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Payment channel
                        </label>
                        <select 
                          value={paymentData.paymentChannel}
                          onChange={(e) => handleInputChange('paymentChannel', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        >
                          <option value="Bank transfer ( manual entry )">Bank transfer ( manual entry )</option>
                          <option value="Payment gateway">Payment gateway</option>
                        </select>
                      </div>

                      {/* Transaction ID */}
                      <div>
                        <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                          Transaction ID
                          <Info className="w-4 h-4 ml-1 text-gray-400" />
                        </label>
                        <input
                          type="text"
                          value={paymentData.transactionId}
                          onChange={(e) => handleInputChange('transactionId', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        />
                      </div>

                      {/* Choose Account */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Choose Account
                        </label>
                        <div className="space-y-2">
                          <label className="flex items-start sm:items-center">
                            <input
                              type="radio"
                              name="bankAccount"
                              checked={paymentData.selectedBank.includes('Wells Fargo')}
                              onChange={() => handleInputChange('selectedBank', 'Wells Fargo Bank, N.A. ( 987654321098 )')}
                              className="mr-3 mt-0.5 sm:mt-0 text-green-600 focus:ring-green-500"
                            />
                            <span className="text-sm text-gray-700">Wells Fargo Bank, N.A. ( 987654321098 )</span>
                          </label>
                          <label className="flex items-start sm:items-center">
                            <input
                              type="radio"
                              name="bankAccount"
                              checked={paymentData.selectedBank.includes('Bank of America')}
                              onChange={() => handleInputChange('selectedBank', 'Bank of America ( 1234567890012 )')}
                              className="mr-3 mt-0.5 sm:mt-0 text-green-600 focus:ring-green-500"
                            />
                            <span className="text-sm text-gray-700">Bank of America ( 1234567890012 )</span>
                          </label>
                        </div>
                      </div>

                      {/* Attach Receipt */}
                     <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-md">
  <div className="flex flex-col">
    <span className="text-sm text-gray-600">Attach receipts / Screenshots</span>
    {selectedFile && (
      <span className="text-xs text-green-600 mt-1">
        Selected: {selectedFile.name}
      </span>
    )}
  </div>
  <div className="relative">
    <input
      type="file"
      id="file-upload"
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      onChange={handleFileUpload}
      accept="image/*,.pdf,.doc,.docx"
    />
    <label
      htmlFor="file-upload"
      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors text-sm font-medium cursor-pointer block"
    >
      Upload
    </label>
  </div>
</div>
                    </div>
                  </>
                ) : (
                  /* Simplified Online Form - Only Payment Channel and Gateway */
                  <div className="space-y-4">
                    {/* Payment Channel */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment channel
                      </label>
                      <select 
                        value="Payment gateway"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      >
                        <option value="Payment gateway">Payment gateway</option>
                      </select>
                    </div>

                    {/* Payment Gateway */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment gateway
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          value={paymentData.paymentGateway}
                          onChange={(e) => handleInputChange('paymentGateway', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                        />
                        <button
                          onClick={handleCopyGateway}
                          className="px-3 sm:px-4 py-2 bg-yellow-500 text-white rounded-r-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-colors text-sm font-medium"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Update Button */}
                <button className="w-full mt-6 px-4 py-3 bg-green-800 text-white rounded-md hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium text-sm">
                  Update
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4 sm:space-y-6">
            {/* Payment Summary Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden w-[528px] ml-[-143px] p-4">
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid on</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction ID</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount paid</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment channel</th>
                      <th className="px-2 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    <tr>
                      <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900">12 - 04 - 25</td>
                      <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900">41431545</td>
                      <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900">500.00 USD</td>
                      <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900">780.00 USD</td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-500 text-white">
                          PARTIALLY PAID
                        </span>
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap text-xs text-gray-900">
                        {showBankDetails ? 'Bank transfer' : 'Payment gateway'}
                      </td>
                      <td className="px-2 py-3 whitespace-nowrap">
                        <button className="flex items-center text-xs text-blue-600 hover:text-blue-800">
                          <Download className="w-3 h-3 mr-1" />
                          Download
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Mobile/Tablet Card View */}
              <div className="block lg:hidden p-4">
                <div className="bg-gray-50 rounded-lg p-4 border">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Paid on:</span>
                      <span className="text-gray-900">12 - 04 - 25</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Transaction ID:</span>
                      <span className="text-gray-900">41431545</span>
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
                    <div className="flex justify-between">
                      <span className="text-gray-600 font-medium">Payment channel:</span>
                      <span className="text-gray-900">{showBankDetails ? 'Bank transfer' : 'Payment gateway'}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                      <span className="text-gray-600 font-medium">Invoice:</span>
                      <button className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Send Reminder */}
            <div className="bg-white rounded-lg shadow-sm p-4 w-[528px] ml-[-143px]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
                <h3 className="text-sm sm:text-md font-semibold">Send Reminder</h3>
                <button className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors text-xs font-medium">
                  Send reminder
                </button>
              </div>

              <div className="border-l-4 border-green-500 pl-3">
                <div className="mb-1">
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-medium">
                    RECENT
                  </span>
                </div>
                <h4 className="font-medium text-gray-900 text-sm mb-1">Payment pending</h4>
                <p className="text-xs text-gray-600 mb-2">Customer is satisfied with the entire itinerary. No changes requested. Proceeding with confirmation and sending to DMC.</p>
                <p className="text-xs text-gray-500">02:00 PM , Today</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DMCPaymentInterface;