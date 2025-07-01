"use client"

import { useState, useEffect } from "react"
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
  agencyData,
  getStatusColor,
  getEmailHighlight,
  getRequestTypeColor,
  type AgencyRequest,
  getRequestTypeDotColor,
} from "@/data/agency"

export default function ManageAgencySignup() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5)
  const [filteredRequests, setFilteredRequests] = useState<AgencyRequest[]>(agencyData)
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

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem)
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)

  // Filter requests based on search term, status filters, and date range
  useEffect(() => {
    const filtered = agencyData.filter((request) => {
      const matchesSearch =
        request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.AgencyName.toLowerCase().includes(searchTerm.toLowerCase())

      const statusSelected = selectedStatuses[request.requestType] || false

      // Date range filter
      let matchesDateRange = true
      if (dateRange.from && dateRange.to && request.requestDate) {
        const requestDate = new Date(request.requestDate)
        matchesDateRange = requestDate >= dateRange.from && requestDate <= dateRange.to
      }

      return matchesSearch && statusSelected && matchesDateRange
    })

    // Apply sorting
    const sortedRequests = [...filtered].sort((a, b) => {
      let comparison = 0

      if (sortBy === "id") {
        comparison = a.id.localeCompare(b.id)
      } else if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name)
      } else if (sortBy === "date" || sortBy === "time") {
        if (a.requestDate && b.requestDate) {
          comparison = new Date(a.requestDate).getTime() - new Date(b.requestDate).getTime()
        }
      } else if (sortBy === "status") {
        const statusPriority = { Active: 1, Inactive: 2 }
        comparison = (statusPriority[a.status] || 99) - (statusPriority[b.status] || 99)
      } else if (sortBy === "requestType") {
        const typePriority = { Approved: 1, Pending: 2, Rejected: 3 }
        comparison = (typePriority[a.requestType] || 99) - (typePriority[b.requestType] || 99)
      }

      return sortDirection === "asc" ? comparison : -comparison
    })

    setFilteredRequests(sortedRequests)
    setCurrentPage(1)
  }, [searchTerm, selectedStatuses, dateRange, sortBy, sortDirection])

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

  // Handle status filter changes
  const handleStatusChange = (status: string, checked: boolean) => {
    setSelectedStatuses((prev) => ({
      ...prev,
      [status]: checked,
    }))
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
                    No records found
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