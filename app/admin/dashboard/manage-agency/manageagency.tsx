"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  Search,
  ChevronDown,
  Download,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  Eye,
  Edit,
  Trash2,
  CalendarIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import {
  getStatusColor,
  getEmailHighlight,
  getRequestTypeColor,
  getRequestTypeDotColor,
} from "@/data/agency"

// Define the type for agency form data
type AgencyFormData = {
  id: string
  name: string
  email: string
  phoneNumber: string
  AgencyName: string
  status: string
  requestType: string
  requestDate: string
  contactPerson: string
  designation: string
  website: string
  ownerName: string
  gstNumber: string
  panNumber: string
  headquarters: string
  logo: any
  businessLicense: any
  agencyType: string
  phoneCountryCode: string
  companyPhone: string
  companyPhoneCode: string
  landingPageColor: string
  gstRegistered: boolean
  yearOfRegistration: string
  panType: string
  country: string
  yearsOfOperation: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export default function ManageAgencySignup() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [filteredRequests, setFilteredRequests] = useState<AgencyFormData[]>([])
  const [allRequests, setAllRequests] = useState<AgencyFormData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatuses, setSelectedStatuses] = useState<Record<string, boolean>>({
    Approved: true,
    Pending: true,
    Rejected: true,
  })
  const [showStatusFilter, setShowStatusFilter] = useState(false)
  const [selectAll, setSelectAll] = useState(false)
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({})
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: new Date("2025-03-28"),
    to: new Date("2025-04-10"),
  })
  const [calendarOpen, setCalendarOpen] = useState(false)
  const [sortBy, setSortBy] = useState<string>("id")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [, setIsClient] = useState(false)
  const [screenSize, setScreenSize] = useState("lg") // Default to large screen

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        console.log("Fetching agency data...")
        const response = await fetch("/api/auth/manage-agency")
        console.log("Response status:", response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log("API response data:", data)
          
          if (!data.requests || !Array.isArray(data.requests)) {
            console.error("Invalid data format received:", data)
            setError("Invalid data format received from server")
            return
          }
          
          // Transform the data if needed to match expected format
          const transformedData = data.requests.map((request: any) => ({
            ...request,
            // Ensure these fields exist to prevent filtering issues
            requestType: request.requestType || "PENDING",
            status: request.status || "ACTIVE",
            // Ensure date fields are properly formatted
            requestDate: request.requestDate || request.createdAt,
            createdAt: request.createdAt || new Date().toISOString(),
            updatedAt: request.updatedAt || new Date().toISOString()
          }))
          
          console.log("Transformed data:", transformedData)
          setAllRequests(transformedData)
          setFilteredRequests(transformedData)
        } else {
          const errorText = await response.text()
          console.error("API error response:", errorText)
          setError(`Failed to fetch agency data: ${response.status}`)
        }
      } catch (error) {
        console.error("Error fetching agency data:", error)
        setError("Error fetching agency data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    setIsClient(true)
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setScreenSize("sm")
      } else if (window.innerWidth < 768) {
        setScreenSize("md")
      } else if (window.innerWidth < 1024) {
        setScreenSize("lg")
      } else {
        setScreenSize("xl")
      }
    }

    // Set initial size
    handleResize()

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Reset filters when component mounts
  useEffect(() => {
    setSelectedStatuses({
      PENDING: true,
      APPROVED: true,
      REJECTED: true
    })
    
    // Reset date range to include all dates
    setDateRange({
      from: undefined,
      to: undefined
    })
  }, [])

  // Handle status filter changes
  const handleStatusChange = (status: string, checked: boolean) => {
    setSelectedStatuses((prev) => ({
      ...prev,
      [status.toUpperCase()]: checked,
    }))
  }

  // Filter requests based on search term, status filters, and date range
  useEffect(() => {
    console.log("Filtering with:", {
      searchTerm,
      selectedStatuses,
      dateRange,
      allRequests: allRequests.length
    })

    const filtered = allRequests.filter((request: AgencyFormData) => {
      // Log each request being filtered
      console.log("Filtering request:", request)

      // Search term filter
      const matchesSearch =
        !searchTerm || // If no search term, include all
        request.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.AgencyName?.toLowerCase().includes(searchTerm.toLowerCase())

      // Status filter - include if no status is selected or if status matches
      const statusSelected = 
        Object.values(selectedStatuses).every(v => !v) || // If no status is selected, show all
        (request.requestType && selectedStatuses[request.requestType.toUpperCase()]) // Check if status is selected

      // Date range filter - include if no date range or if within range
      let matchesDateRange = true
      if (dateRange.from && dateRange.to && request.requestDate) {
        const requestDate = new Date(request.requestDate)
        const from = new Date(dateRange.from)
        const to = new Date(dateRange.to)
        to.setHours(23, 59, 59, 999) // Include the entire end day
        matchesDateRange = requestDate >= from && requestDate <= to
      }

      const shouldInclude = matchesSearch && statusSelected && matchesDateRange
      console.log("Filter result:", { 
        matchesSearch, 
        statusSelected, 
        matchesDateRange, 
        shouldInclude,
        requestType: request.requestType,
        selectedStatuses
      })
      
      return shouldInclude
    })

    console.log("Filtered results:", filtered)
    setFilteredRequests(filtered)
  }, [searchTerm, selectedStatuses, dateRange, allRequests])

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)

  // Handle pagination
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = screenSize === "sm" ? 3 : screenSize === "md" ? 3 : 5

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      let startPage = Math.max(2, currentPage - Math.floor((maxVisiblePages - 2) / 2))
      let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3)

      if (currentPage <= 2) {
        endPage = Math.min(totalPages - 1, maxVisiblePages - 1)
      }

      if (currentPage >= totalPages - 1) {
        startPage = Math.max(2, totalPages - (maxVisiblePages - 1))
      }

      if (startPage > 2) {
        pages.push("ellipsis-start")
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      if (endPage < totalPages - 1) {
        pages.push("ellipsis-end")
      }

      pages.push(totalPages)
    }

    return pages
  }

  // Apply status filters
  const applyStatusFilters = () => {
    setShowStatusFilter(false)
  }

  // Reset status filters
  const resetStatusFilters = () => {
    setSelectedStatuses({
      Approved: true,
      Pending: true,
      Rejected: true,
    })
  }

  // Handle select all checkbox
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked)

    const newSelectedItems: Record<string, boolean> = {}
    currentItems.forEach((item) => {
      newSelectedItems[item.id] = checked
    })

    setSelectedItems(newSelectedItems)
  }

  // Handle individual item selection
  const handleSelectItem = (id: string, checked: boolean) => {
    setSelectedItems((prev) => {
      const newSelected = { ...prev, [id]: checked }

      const allSelected = currentItems.every((item) => newSelected[item.id])
      setSelectAll(allSelected)

      return newSelected
    })
  }

  // Handle sort change
  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortDirection("asc")
    }
  }

  // Format date range for display
  const formatDateRange = () => {
    if (dateRange.from && dateRange.to) {
      if (screenSize === "sm") {
        return `${format(dateRange.from, "d/M")}-${format(dateRange.to, "d/M")}`
      } else if (screenSize === "md") {
        return `${format(dateRange.from, "dd/MM")}-${format(dateRange.to, "dd/MM")}`
      } else {
        return `${format(dateRange.from, "dd MMM yy")} - ${format(dateRange.to, "dd MMM yy")}`
      }
    }
    return screenSize === "sm" ? "Date" : "Select date range"
  }

  // Navigate to detail page
  const navigateToDetail = (id: string) => {
    router.push(`/request-dashboard/${id}`)
  }

  if (loading) {
    return (
      <div className="w-full p-1 sm:p-2 md:p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading agency data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full p-1 sm:p-2 md:p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <div className="flex gap-2 justify-center">
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-green-600 hover:bg-green-700"
              >
                Retry
              </Button>
              <Button 
                onClick={async () => {
                  try {
                    const response = await fetch("/api/add-sample-data", { method: "POST" })
                    if (response.ok) {
                      window.location.reload()
                    }
                  } catch (error) {
                    console.error("Error adding sample data:", error)
                  }
                }} 
                className="bg-blue-600 hover:bg-blue-700"
              >
                Add Sample Data
              </Button>
              <Button 
                onClick={async () => {
                  try {
                    const response = await fetch("/api/test-agency")
                    const data = await response.json()
                    console.log("Test result:", data)
                    alert(`Test result: ${JSON.stringify(data, null, 2)}`)
                  } catch (error) {
                    console.error("Error testing API:", error)
                    alert(`Test error: ${error}`)
                  }
                }} 
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                Test DB
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full p-1 sm:p-2 md:p-4 bg-white rounded-lg border border-gray-200">
      {/* Search and Filters */}
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search-input"
              placeholder="Search for..."
              className="pl-8 w-full h-9 sm:h-10 border-gray-300 text-xs sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative inline-block w-full sm:w-auto">
              <Button
                variant="outline"
                className="bg-green-600 text-white hover:bg-green-700 border-0 h-9 sm:h-10 flex items-center gap-1 w-full sm:w-auto justify-between text-xs sm:text-sm"
                onClick={() => setShowStatusFilter(!showStatusFilter)}
              >
                <div className="flex items-center gap-1">
                  <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{screenSize === "sm" ? "Filter" : "Request Status"}</span>
                </div>
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              {showStatusFilter && (
                <div className="absolute z-10 mt-1 w-full sm:w-[200px] bg-white border border-gray-200 rounded-md shadow-lg">
                  <div className="p-2 border-b border-gray-200">
                    <div className="text-xs sm:text-sm text-gray-500">Filter Status</div>
                  </div>
                  <div className="p-2">
                    <div className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id="approved"
                        checked={selectedStatuses.Approved}
                        onCheckedChange={(checked) => handleStatusChange("Approved", !!checked)}
                        className="scale-75 sm:scale-100"
                      />
                      <label htmlFor="approved" className="text-xs sm:text-sm">
                        Approved
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id="pending"
                        checked={selectedStatuses.Pending}
                        onCheckedChange={(checked) => handleStatusChange("Pending", !!checked)}
                        className="scale-75 sm:scale-100"
                      />
                      <label htmlFor="pending" className="text-xs sm:text-sm">
                        Pending
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="rejected"
                        checked={selectedStatuses.Rejected}
                        onCheckedChange={(checked) => handleStatusChange("Rejected", !!checked)}
                        className="scale-75 sm:scale-100"
                      />
                      <label htmlFor="rejected" className="text-xs sm:text-sm">
                        Rejected
                      </label>
                    </div>
                  </div>
                  <div className="p-2 border-t border-gray-200 flex justify-between">
                    <Button
                      variant="default"
                      className="bg-green-600 hover:bg-green-700 text-xs h-7 sm:h-8"
                      onClick={applyStatusFilters}
                    >
                      Apply
                    </Button>
                    <Button
                      variant="ghost"
                      className="text-xs h-7 sm:h-8"
                      onClick={() => {
                        resetStatusFilters()
                        setShowStatusFilter(false)
                      }}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 sm:h-10 flex items-center gap-1 border-gray-300 text-xs sm:text-sm w-full sm:w-auto"
                >
                  <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                  <span className="text-xs sm:text-sm truncate">{formatDateRange()}</span>
                  {screenSize !== "sm" && <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 ml-1 text-gray-500" />}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 border-gray-200 shadow-lg" align="start">
                <div className="p-2 sm:p-3 border-b border-gray-100 bg-gray-50">
                  <h3 className="text-xs sm:text-sm font-medium">Select Date Range</h3>
                </div>
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={(range) => {
                    if (range?.from) {
                      setDateRange({
                        from: range.from,
                        to: range.to || range.from,
                      })
                      if (range.to) {
                        setCalendarOpen(false)
                      }
                    }
                  }}
                  numberOfMonths={1}
                  className="p-2 sm:p-3"
                />
                <div className="flex items-center justify-between p-2 sm:p-3 border-t border-gray-100 bg-gray-50">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 sm:h-8"
                    onClick={() => {
                      setDateRange({
                        from: new Date("2025-03-28"),
                        to: new Date("2025-04-10"),
                      })
                    }}
                  >
                    Reset
                  </Button>
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-xs h-7 sm:h-8"
                    onClick={() => setCalendarOpen(false)}
                  >
                    Apply
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex gap-2 ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 sm:h-10 flex items-center gap-1 border-gray-300 text-xs sm:text-sm"
                >
                  {screenSize === "sm" ? (
                    <span>Sort</span>
                  ) : (
                    <>
                      <span>Sort by</span>
                      <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                    </>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36 sm:w-48">
                <div className="p-2 border-b border-gray-100">
                  <p className="text-xs text-gray-500">Sort Options</p>
                </div>
                {[
                  { id: "id", label: "Request ID" },
                  { id: "name", label: "Name" },
                  { id: "date", label: "Date" },
                  { id: "status", label: "Status" },
                  { id: "requestStatus", label: "Request Status" },
                ].map((option) => (
                  <DropdownMenuItem
                    key={option.id}
                    onClick={() => handleSortChange(option.id)}
                    className="flex items-center justify-between cursor-pointer text-xs sm:text-sm"
                  >
                    <span>{option.label}</span>
                    {sortBy === option.id && (
                      <span className="text-green-600 font-bold">{sortDirection === "asc" ? "↑" : "↓"}</span>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              className="h-9 sm:h-10 w-9 sm:w-10 p-0 flex items-center justify-center"
              aria-label="Download"
            >
              <Download className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
        <div className="min-w-full">
          <table className="w-full border-collapse table-auto">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-2 text-left w-8 sm:w-10">
                  <Checkbox checked={selectAll} onCheckedChange={(checked) => handleSelectAll(!!checked)} />
                </th>
                {screenSize !== "sm" && (
                  <th
                    className="p-2 sm:p-3 text-left font-medium cursor-pointer hover:bg-gray-100 whitespace-nowrap hidden lg:table-cell"
                    onClick={() => handleSortChange("id")}
                  >
                    <div className="flex items-center">
                      <span>Request ID</span>
                      {sortBy === "id" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                    </div>
                  </th>
                )}
                <th
                  className="p-1 sm:p-3 text-left font-medium text-xs sm:text-sm cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSortChange("name")}
                >
                  <div className="flex items-center">
                    Name
                    {sortBy === "name" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                  </div>
                </th>
                {screenSize !== "sm" && screenSize !== "md" && (
                  <th className="p-2 sm:p-3 text-left font-medium hidden lg:table-cell">Phone no.</th>
                )}
                {screenSize === "xl" && (
                  <th className="p-2 sm:p-3 text-left font-medium hidden xl:table-cell">Email</th>
                )}
                <th className="p-1 sm:p-3 text-left font-medium text-xs sm:text-sm">
                  {screenSize === "sm" ? "Agency" : "Agency Name"}
                </th>
                <th
                  className="p-1 sm:p-3 text-left font-medium text-xs sm:text-sm cursor-pointer hover:bg-gray-100 whitespace-nowrap"
                  onClick={() => handleSortChange("status")}
                >
                  <div className="flex items-center">
                    Status
                    {sortBy === "status" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                  </div>
                </th>
                {screenSize !== "sm" && (
                  <th
                    className="p-2 sm:p-3 text-left font-medium cursor-pointer hover:bg-gray-100 whitespace-nowrap hidden lg:table-cell"
                    onClick={() => handleSortChange("requestType")}
                  >
                    <div className="flex items-center">
                      Request Status
                      {sortBy === "requestType" && <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>}
                    </div>
                  </th>
                )}
                <th className="p-1 sm:p-3 text-left w-8 sm:w-10">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((request) => (
                <tr key={request.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-1 sm:p-3">
                    <Checkbox
                      checked={selectedItems[request.id] || false}
                      onCheckedChange={(checked) => handleSelectItem(request.id, !!checked)}
                      className="scale-75 sm:scale-100"
                    />
                  </td>
                  {screenSize !== "sm" && (
                    <td className="p-2 sm:p-3 text-sm font-medium hidden lg:table-cell">{request.id}</td>
                  )}
                  <td className="p-1 sm:p-3 text-xs sm:text-sm font-medium sm:font-normal">
                    <span className="line-clamp-1">{request.name}</span>
                  </td>
                  {screenSize !== "sm" && screenSize !== "md" && (
                    <td className="p-2 sm:p-3 text-sm hidden lg:table-cell">{request.phoneNumber}</td>
                  )}
                  {screenSize === "xl" && (
                    <td className="p-2 sm:p-3 text-sm hidden xl:table-cell">
                      <span className={`${getEmailHighlight(request.email) || ""} px-2 py-1 rounded`}>
                        {request.email}
                      </span>
                    </td>
                  )}
                  <td className="p-1 sm:p-3 text-xs sm:text-sm">
                    {screenSize === "sm" ? (
                      <span className="truncate max-w-[60px] inline-block">{request.AgencyName}</span>
                    ) : (
                      request.AgencyName
                    )}
                  </td>
                  <td className="p-1 sm:p-3 text-xs sm:text-sm">
                    <span
                      className={`${getStatusColor(request.status)} px-1 sm:px-3 py-0.5 sm:py-1 rounded-md text-xs whitespace-nowrap`}
                    >
                      {request.status}
                    </span>
                  </td>
                  {screenSize !== "sm" && (
                    <td className="p-2 sm:p-3 text-sm hidden lg:table-cell">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-block h-2 w-2 rounded-full ${getRequestTypeDotColor(request.requestType)}`}
                        ></span>
                        <span
                          className={`${getRequestTypeColor(request.requestType)} px-2 sm:px-3 py-1 rounded-md text-xs whitespace-nowrap`}
                        >
                          {request.requestType}
                        </span>
                      </div>
                    </td>
                  )}
                  <td className="p-1 sm:p-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-8 sm:w-8 p-0">
                          <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-36 sm:w-auto">
                        <DropdownMenuItem
                          className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm"
                          onClick={() => navigateToDetail(request.id)}
                          aria-label="View"
                        >
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>View</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="flex items-center gap-2 cursor-pointer text-xs sm:text-sm"
                          onClick={() => console.log("Edit", request.id)}
                        >
                          <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="flex items-center gap-2 cursor-pointer text-red-600 text-xs sm:text-sm"
                          onClick={() => console.log("Delete", request.id)}
                        >
                          <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
              {currentItems.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-4 sm:p-8 text-center text-gray-500 text-xs sm:text-sm">
                    {allRequests.length === 0 ? (
                      "No agency forms submitted yet"
                    ) : (
                      "No records found matching your filters"
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-center sm:justify-end mt-4 gap-1 sm:gap-2">
        <div className="flex items-center gap-0.5 sm:gap-1">
          {screenSize !== "sm" && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6 sm:h-8 sm:w-8"
                onClick={() => paginate(1)}
                disabled={currentPage === 1}
                aria-label="First page"
              >
                <ChevronsLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6 sm:h-8 sm:w-8"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </>
          )}

          {getPageNumbers().map((page, index) =>
            page === "ellipsis-start" || page === "ellipsis-end" ? (
              <Button
                key={`ellipsis-${index}`}
                variant="outline"
                size="icon"
                className="h-6 w-6 sm:h-8 sm:w-8 text-xs sm:text-sm"
                disabled
              >
                ...
              </Button>
            ) : (
              <Button
                key={`page-${page}`}
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                className={`h-6 w-6 sm:h-8 sm:w-8 text-xs sm:text-sm ${currentPage === page ? "bg-green-600 hover:bg-green-700" : ""}`}
                onClick={() => paginate(page as number)}
                aria-label={currentPage === page ? "Current page" : `Go to page ${page}`}
              >
                {page}
              </Button>
            ),
          )}

          {screenSize !== "sm" && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6 sm:h-8 sm:w-8"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-6 w-6 sm:h-8 sm:w-8"
                onClick={() => paginate(totalPages)}
                disabled={currentPage === totalPages}
                aria-label="Last page"
              >
                <ChevronsRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
      <div className="text-xs text-gray-500 mt-8">
        © 2023, Made by <span className="text-emerald-500">Trekking Miles</span>.
      </div>
    </div>
  )
}