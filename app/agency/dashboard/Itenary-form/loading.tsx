export default function LoadingComponent() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading itinerary form...</p>
      </div>
    </div>
  )
}
