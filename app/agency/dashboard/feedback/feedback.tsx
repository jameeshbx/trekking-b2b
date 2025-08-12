import React, { useState } from 'react';


const ShareFeedbackForm = () => {
  const [shareMethod, setShareMethod] = useState('whatsapp');
  const [copied, setCopied] = useState(false);

  const feedbackLink = "https://forms.gle/itinerary-feedback-form";

  const feedbackData = [
    {
      capturedOn: "10 - 04 - 2025",
      email: "Miguel Hernandez",
      fullName: "Miguel Hernandez", 
      tripName: "Kashmir Bliss",
      dateOfTrip: "15 - 03 - 2025",
      experience: "5 - Excellent",
      accommodation: "4 - Very Good",
      transport: "3 - Seamless and comfortable",
      sightseeing: "5 - Seamless and comfortable",
      service: "5 - Supportive and responsive",
      comments: "Thank you for making our anniversary so special"
    }
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(feedbackLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    if (shareMethod === 'whatsapp') {
      const message = encodeURIComponent(`Please share your feedback about your trip: ${feedbackLink}`);
      window.open(`https://wa.me/?text=${message}`, '_blank');
    } else {
      const subject = encodeURIComponent('Share Your Trip Feedback');
      const body = encodeURIComponent(`Please share your feedback about your trip: ${feedbackLink}`);
      window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-xl font-semibold text-gray-900 mb-6">Share Feedback Form Link</h1>
          
          {/* Share Options */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-700 mb-3">Share via :</p>
            <div className="flex gap-4 mb-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="shareMethod"
                  value="whatsapp"
                  checked={shareMethod === 'whatsapp'}
                  onChange={(e) => setShareMethod(e.target.value)}
                  className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">Whatsapp</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="shareMethod"
                  value="email"
                  checked={shareMethod === 'email'}
                  onChange={(e) => setShareMethod(e.target.value)}
                  className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                />
                <span className="ml-2 text-sm text-gray-700">Email</span>
              </label>
            </div>
            
            <button 
              onClick={handleSend}
              className="bg-green-800 hover:bg-green-900 text-white px-6 py-2 rounded text-sm font-medium transition-colors"
            >
              Send
            </button>
          </div>

          <div className="text-center text-gray-400 text-sm mb-6">
            or
          </div>

          {/* Copy Link Section */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Copy link</p>
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 bg-gray-50 border border-gray-200 rounded px-3 py-2">
                <span className="text-sm text-gray-600">{feedbackLink}</span>
              </div>
              <button
                onClick={handleCopyLink}
                className="bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded text-sm font-medium transition-colors"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* Feedback Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-green-50 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">Feedback Responses</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Captured on
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Email Address
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Full Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Trip Name / Destination
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Date of Trip
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    How would you rate your experience?
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Accommodation Quality
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Transport & Transfers
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Sightseeing & Activities
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-r border-gray-200">
                    Service from Our Team
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Any additional comments?
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {feedbackData.map((feedback, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                      {feedback.capturedOn}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                      {feedback.email}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                      {feedback.fullName}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                      {feedback.tripName}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-r border-gray-200">
                      {feedback.dateOfTrip}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 border-r border-gray-200">
                      <div className="max-w-32">
                        <span className="text-green-600 font-medium">{feedback.experience}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 border-r border-gray-200">
                      <div className="max-w-32">
                        <span className="text-blue-600 font-medium">{feedback.accommodation}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 border-r border-gray-200">
                      <div className="max-w-40">
                        <span className="text-yellow-600 font-medium">{feedback.transport}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 border-r border-gray-200">
                      <div className="max-w-40">
                        <span className="text-green-600 font-medium">{feedback.sightseeing}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900 border-r border-gray-200">
                      <div className="max-w-40">
                        <span className="text-green-600 font-medium">{feedback.service}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-900">
                      <div className="max-w-48">
                        {feedback.comments}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareFeedbackForm;