
import React, { useState, useEffect } from 'react';
import { Download, Upload, Info, AlertCircle } from 'lucide-react';

interface PaymentData {
  id: string;
  customerName: string;
  itineraryReference: string;
  totalCost: string;
  amountPaid: string;
  paymentDate: string;
  remainingBalance: string;
  paymentStatus: string;
  shareMethod: 'whatsapp' | 'email';
  paymentLink: string;
  currency: string;
}

interface PaymentHistory {
  id: string;
  paidDate: string;
  amountPaid: number;
  pendingAmount: number;
  status: string;
  invoiceUrl?: string;
}

interface PaymentReminder {
  id: string;
  type: string;
  message: string;
  time: string;
  date: string;
  status: 'RECENT' | 'SENT' | 'PENDING';
}

const PaymentOverviewForm: React.FC<{ paymentId: string }> = ({ paymentId }) => {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory[]>([]);
  const [reminders, setReminders] = useState<PaymentReminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showProgress, setShowProgress] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Fetch payment data on component mount
  useEffect(() => {
    fetchPaymentData();
  }, [paymentId]);

  const fetchPaymentData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/customer/payment/${paymentId}`);
      const result = await response.json();

      if (result.success) {
        setPaymentData(result.data.payment);
        setPaymentHistory(result.data.history);
        setReminders(result.data.reminders);
      } else {
        setError(result.error || 'Failed to fetch payment data');
      }
    } catch (error) {
      setError('Network error occurred');
      console.error('Error fetching payment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof PaymentData, value: string) => {
    if (!paymentData) return;
    
    setPaymentData(prev => {
      if (!prev) return null;
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate remaining balance when total cost or amount paid changes
      if (field === 'totalCost' || field === 'amountPaid') {
        const total = parseFloat(field === 'totalCost' ? value : prev.totalCost) || 0;
        const paid = parseFloat(field === 'amountPaid' ? value : prev.amountPaid) || 0;
        updated.remainingBalance = (total - paid).toFixed(2);
      }
      
      return updated;
    });
  };

  const handleCopyLink = () => {
    if (paymentData?.paymentLink) {
      navigator.clipboard.writeText(paymentData.paymentLink);
      // You could add a toast notification here
    }
  };

  const handleSendReminder = async () => {
    if (!paymentData) return;
    
    try {
      setShowProgress(true);
      const response = await fetch('/api/customer/payment/reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: paymentData.id,
          method: paymentData.shareMethod,
          message: `Payment reminder for ${paymentData.itineraryReference}`
        })
      });

      const result = await response.json();
      
      if (result.success) {
        // Refresh reminders list
        await fetchPaymentData();
      } else {
        setError(result.error || 'Failed to send reminder');
      }
    } catch (error) {
      setError('Failed to send reminder');
      console.error('Error sending reminder:', error);
    } finally {
      setShowProgress(false);
    }
  };

  const handleUpdate = async () => {
    if (!paymentData) return;
    
    try {
      setUpdating(true);
      const response = await fetch(`/api/customer/payment/${paymentData.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });

      const result = await response.json();
      
      if (result.success) {
        // Refresh data after successful update
        await fetchPaymentData();
      } else {
        setError(result.error || 'Failed to update payment data');
      }
    } catch (error) {
      setError('Failed to update payment data');
      console.error('Error updating payment data:', error);
    } finally {
      setUpdating(false);
    }
  };

  const handleUploadReceipt = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.jpg,.jpeg,.png';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && paymentData) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('paymentId', paymentData.id);

          const response = await fetch('/api/upload/receipt', {
            method: 'POST',
            body: formData
          });

          const result = await response.json();
          
          if (result.success) {
            // Refresh data after successful upload
            await fetchPaymentData();
          } else {
            setError(result.error || 'Failed to upload receipt');
          }
        } catch (error) {
          setError('Failed to upload receipt');
          console.error('Error uploading receipt:', error);
        }
      }
    };
    input.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchPaymentData}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-gray-600">No payment data found</p>
      </div>
    );
  }

  const completionPercentage = paymentData.paymentStatus === 'Paid' ? 100 : 
    paymentData.paymentStatus === 'Partial' ? 70 : 30;

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Left Column - Payment Overview */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 sm:p-6">
              {/* Progress Bar */}
              <div className="mb-6">
                <h2 className="text-base sm:text-lg font-semibold mb-4">Payment Overview & Link Sharing</h2>
                <div className="flex items-center">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-800 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${completionPercentage}%` }}
                    ></div>
                  </div>
                  <span className="ml-3 text-sm text-gray-600">{completionPercentage}% Complete</span>
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
                      type="number"
                      step="0.01"
                      value={paymentData.totalCost}
                      onChange={(e) => handleInputChange('totalCost', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm"
                    />
                    <select 
                      value={paymentData.currency}
                      onChange={(e) => handleInputChange('currency', e.target.value)}
                      className="px-2 sm:px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-200 focus:outline-none focus:ring-2 focus:ring-green-600 text-sm"
                    >
                      <option value="USD">US Dollar</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
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
                      type="number"
                      step="0.01"
                      value={paymentData.amountPaid}
                      onChange={(e) => handleInputChange('amountPaid', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent text-sm"
                    />
                    <select 
                      value={paymentData.currency}
                      className="px-2 sm:px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-200 focus:outline-none text-sm"
                      disabled
                    >
                      <option value={paymentData.currency}>{paymentData.currency}</option>
                    </select>
                  </div>
                </div>

                {/* Payment Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment date
                  </label>
                  <input
                    type="date"
                    value={paymentData.paymentDate}
                    onChange={(e) => handleInputChange('paymentDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  />
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
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-100 focus:outline-none text-sm"
                      readOnly
                    />
                    <select 
                      value={paymentData.currency}
                      className="px-2 sm:px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-200 text-sm"
                      disabled
                    >
                      <option value={paymentData.currency}>{paymentData.currency}</option>
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
                    className="w-full px-4 py-2 bg-green-800 text-white rounded-md hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center justify-center text-sm"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </button>
                </div>

                {/* Update Button */}
                <button
                  onClick={handleUpdate}
                  disabled={updating}
                  className="w-full mt-6 px-4 py-3 bg-green-800 text-white rounded-md hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? 'Updating...' : 'Update'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Share Payment Link & Send Reminder */}
          <div className="space-y-4 sm:space-y-6">
            {/* Share Payment Link */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
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
                className="w-full px-4 py-2 bg-green-800 text-white rounded-md hover:bg-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed mb-4 text-sm"
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
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
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
                {reminders.length > 0 ? (
                  reminders.map((reminder) => (
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
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No reminders sent yet</p>
                )}
              </div>
            </div>

            {/* Payment Summary Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4">
                <h3 className="text-base font-semibold mb-4">Payment History</h3>
              </div>
              
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
                    {paymentHistory.length > 0 ? (
                      paymentHistory.map((payment) => (
                        <tr key={payment.id}>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{payment.paidDate}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{payment.amountPaid.toFixed(2)} {paymentData.currency}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{payment.pendingAmount.toFixed(2)} {paymentData.currency}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              payment.status === 'PAID' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                            }`}>
                              {payment.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            {payment.invoiceUrl ? (
                              <a 
                                href={payment.invoiceUrl} 
                                download
                                className="flex items-center text-sm text-white bg-gray-600 hover:bg-gray-700 px-2 py-1 rounded transition-colors"
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </a>
                            ) : (
                              <span className="text-sm text-gray-400">N/A</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                          No payment history available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="block sm:hidden p-4">
                {paymentHistory.length > 0 ? (
                  paymentHistory.map((payment) => (
                    <div key={payment.id} className="bg-gray-50 rounded-lg p-4 border mb-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-medium">Paid on:</span>
                          <span className="text-gray-900">{payment.paidDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-medium">Amount paid:</span>
                          <span className="text-gray-900">{payment.amountPaid.toFixed(2)} {paymentData.currency}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 font-medium">Pending:</span>
                          <span className="text-gray-900">{payment.pendingAmount.toFixed(2)} {paymentData.currency}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 font-medium">Status:</span>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            payment.status === 'PAID' ? 'bg-green-500 text-white' : 'bg-yellow-500 text-white'
                          }`}>
                            {payment.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t">
                          <span className="text-gray-600 font-medium">Invoice:</span>
                          {payment.invoiceUrl ? (
                            <a 
                              href={payment.invoiceUrl} 
                              download
                              className="flex items-center text-sm text-white bg-gray-600 px-2 py-1 rounded"
                            >
                              <Download className="w-3 h-3 mr-1" />
                              Download
                            </a>
                          ) : (
                            <span className="text-sm text-gray-400">N/A</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-8">No payment history available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentOverviewForm