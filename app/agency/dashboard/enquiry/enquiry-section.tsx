"use client"

import { useState, useRef, useEffect } from "react"
import { Search, ChevronDown, Plus, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowUpRight } from "lucide-react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { initialColumns, type Enquiry as EnquiryType, type Column } from "@/data/enquiry"
import Image from "next/image"
import { toast } from "sonner"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

const generateUniqueId = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const columnMessages: Record<string, string> = {
  enquiry: "Awaiting Agency response",
  itinerary_creation: "Draft itinerary in review",
  customer_feedback: "Awaiting customer feedback",
  itinerary_confirmed: "Itinerary confirmed",
  dmc_quotation: "Awaiting DMC quotes",
  price_finalization: "Adding margin and confirming",
  booking_request: "Booking Sent to DMC",
  booking_progress: "Awaiting DMC confirmation",
  payment_forex: "Processing Forex payments",
  trip_in_progress: "Successfully completed",
  completed: "Trip completed",
}

export default function Enquiry() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [columns, setColumns] = useState<Column[]>(initialColumns)
  const [isClient, setIsClient] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [hoveredEnquiry, setHoveredEnquiry] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  const [newEnquiry, setNewEnquiry] = useState<Omit<EnquiryType, "id" | "status" | "enquiryDate">>({
    name: "",
    phone: "",
    email: "",
    locations: "",
    tourType: "",
    estimatedDates: "",
    currency: "USD",
    budget: 1000,
    notes: "",
    assignedStaff: "",
    pointOfContact: "",
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      const storedColumns = localStorage.getItem("enquiryColumns")
      if (storedColumns) {
        try {
          setColumns(JSON.parse(storedColumns))
        } catch (error) {
          console.error("Failed to parse stored columns:", error)
        }
      }
    }
  }, [isClient])

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("enquiryColumns", JSON.stringify(columns))
    }
  }, [columns, isClient])

  const handleInputChange = (field: string, value: string | number) => {
    setNewEnquiry((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleAddEnquiry = () => {
    const today = new Date()
    const formattedDate = `${today.getDate().toString().padStart(2, "0")}-${(today.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${today.getFullYear()}`

    const newEnquiryWithId: EnquiryType = {
      ...newEnquiry,
      id: generateUniqueId(),
      status: "enquiry",
      enquiryDate: formattedDate,
    }

    const updatedColumns = JSON.parse(JSON.stringify(columns))
    const enquiryColumnIndex = updatedColumns.findIndex((col: Column) => col.id === "enquiry")

    if (enquiryColumnIndex !== -1) {
      updatedColumns[enquiryColumnIndex].enquiries.push(newEnquiryWithId)
      setColumns(updatedColumns)
    }

    toast.success("Enquiry Added", {
      description: `New enquiry for ${newEnquiry.name} has been added successfully.`,
    })

    setIsDialogOpen(false)
    setNewEnquiry({
      name: "",
      phone: "",
      email: "",
      locations: "",
      tourType: "",
      estimatedDates: "",
      currency: "USD",
      budget: 1000,
      notes: "",
      assignedStaff: "",
      pointOfContact: "",
    })
    setDateRange({
      from: undefined,
      to: undefined,
    })
  }

  const onDragEnd = (result: DropResult) => {
    const { destination, source } = result

    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return
    }

    setColumns((prevColumns) => {
      const newColumns = JSON.parse(JSON.stringify(prevColumns))
      const sourceColIndex = newColumns.findIndex((col: Column) => col.id === source.droppableId)
      const destColIndex = newColumns.findIndex((col: Column) => col.id === destination.droppableId)

      if (sourceColIndex === -1 || destColIndex === -1) {
        return prevColumns
      }

      const movedItem = newColumns[sourceColIndex].enquiries[source.index]
      newColumns[sourceColIndex].enquiries.splice(source.index, 1)

      const updatedItem = {
        ...movedItem,
        status: destination.droppableId as EnquiryType["status"],
      }

      newColumns[destColIndex].enquiries.splice(destination.index, 0, updatedItem)

      if (source.droppableId !== destination.droppableId) {
        toast.success("Enquiry Updated", {
          description: `${movedItem.name}'s enquiry moved to ${newColumns[destColIndex].title}`,
        })
      }

      return newColumns
    })
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col w-full overflow-x-hidden">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-gray-100 p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-0 sm:justify-between sm:items-center">
          <div className="relative w-[180px] sm:w-64 bg-white">
            <Search className="absolute left-2 top-2.5 h-4 w-4 font-poppins" />
            <Input
              placeholder="Search for..."
              className="pl-8 h-9 bg-white border-emerald-500 focus:border-emerald-500 hover:border-emerald-500 transition-colors font-poppins w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="flex items-center gap-1 font-poppins text-sm sm:text-base">
              Sort by
              <ChevronDown className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-white hover:bg-white text-green-800 border-2 border-green-600 text-sm sm:text-base flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add enquiry</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Columns area */}
      <div className="relative flex-1 p-2 sm:p-4">
        <div
          ref={scrollContainerRef}
          className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth px-2"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {isClient ? (
            <DragDropContext onDragEnd={onDragEnd}>
              {columns.map((column) => (
                <Droppable droppableId={column.id} key={column.id}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="bg-white rounded-lg shadow-sm overflow-hidden min-w-[240px] w-[240px] sm:w-[260px] flex-shrink-0 h-[calc(100vh-180px)] sm:h-[calc(100vh-140px)]"
                    >
                      {/* Column header */}
                      <div className="p-3 sm:p-4 shadow-sm rounded-t-lg bg-white">
                        <div className="flex items-center gap-3">
                          <div className="bg-amber-100 p-2 sm:p-3 rounded-md">
                            <Image
                              src={column.icon || "/placeholder.svg?height=32&width=32"}
                              alt={column.title}
                              width={32}
                              height={32}
                              className="w-6 h-6 sm:w-8 sm:h-8"
                            />
                          </div>
                          <h3 className="font-semibold text-sm sm:text-base font-poppins">{column.title}</h3>
                        </div>
                      </div>

                      {/* Enquiries list */}
                      <div className="p-2 sm:p-3 overflow-y-auto h-[calc(100%-76px)] font-poppins">
                        {column.enquiries.map((enquiry, index) => (
                          <Draggable key={enquiry.id} draggableId={enquiry.id} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-white rounded-lg p-3 sm:p-4 mb-3 shadow-sm hover:shadow-md transition-shadow relative"
                                onMouseEnter={() => setHoveredEnquiry(enquiry.id)}
                                onMouseLeave={() => setHoveredEnquiry(null)}
                              >
                                <div className="space-y-1">
                                  <div className="flex justify-between items-start">
                                    <h4 className="font-medium text-sm sm:text-base font-poppins">{enquiry.name}</h4>
                                    <div className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white rounded-full h-6 w-6 sm:h-7 sm:w-7 flex items-center justify-center"></div>
                                  </div>
                                  <p className="text-xs sm:text-sm text-gray-600 font-poppins">{enquiry.phone}</p>
                                  <p className="text-xs sm:text-sm text-gray-600 font-poppins truncate">
                                    {enquiry.email}
                                  </p>
                                  <div className="flex items-center justify-between mt-2">
                                    <p className="text-xs sm:text-sm text-green-500 font-poppins">
                                      Enquiry on: {enquiry.enquiryDate}
                                    </p>
                                    <button className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full border-1 border-black">
                                      <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </button>
                                  </div>

                                  {hoveredEnquiry === enquiry.id && (
                                    <div className="absolute -bottom-20 right-0 bg-green-100 p-2 sm:p-3 rounded-md shadow-sm w-40 sm:w-48 z-10">
                                      <p className="text-xs sm:text-sm text-green-800 font-medium font-poppins">
                                        {columnMessages[column.id]}
                                      </p>
                                      <p className="text-xs sm:text-sm text-green-800 mt-1 font-poppins truncate">
                                        Assigned: {enquiry.assignedStaff || "Unassigned"}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </DragDropContext>
          ) : (
            <div className="w-full flex justify-center items-center">
              <div className="p-4">Loading enquiries...</div>
            </div>
          )}
        </div>
      </div>

      {/* Add Enquiry Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden w-[calc(100vw-20px)] max-h-[90vh] overflow-y-auto">
          <div className="p-4 sm:p-6">
            <DialogTitle className="text-lg sm:text-xl font-semibold font-poppins">Add Enquiry</DialogTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4">
              <div className="space-y-1 sm:space-y-2 col-span-2 sm:col-span-1">
                <label className="text-xs sm:text-sm font-medium font-poppins">Name</label>
                <Input
                  value={newEnquiry.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Client name"
                  className="text-sm sm:text-base"
                />
              </div>
              <div className="space-y-1 sm:space-y-2 col-span-2 sm:col-span-1">
                <label className="text-xs sm:text-sm font-medium font-poppins">Phone No.</label>
                <div className="flex">
                  <div className="flex items-center border rounded-l-md px-2 bg-gray-50">
                    <Image
                      src="https://flagcdn.com/w20/in.png"
                      width={20}
                      height={20}
                      alt="India flag"
                      className="mr-1"
                    />
                    <span className="text-xs sm:text-sm">+91</span>
                    <ChevronDown className="h-4 w-4 ml-1 text-gray-400" />
                  </div>
                  <Input
                    value={newEnquiry.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="Phone number"
                    className="rounded-l-none text-sm sm:text-base"
                  />
                </div>
              </div>
              <div className="space-y-1 sm:space-y-2 col-span-2 sm:col-span-1">
                <label className="text-xs sm:text-sm font-medium font-poppins">Email</label>
                <Input
                  type="email"
                  value={newEnquiry.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Email address"
                  className="text-sm sm:text-base"
                />
              </div>
              <div className="space-y-1 sm:space-y-2 col-span-2 sm:col-span-1">
                <label className="text-xs sm:text-sm font-medium font-poppins">Location(s)</label>
                <Input
                  value={newEnquiry.locations}
                  onChange={(e) => handleInputChange("locations", e.target.value)}
                  placeholder="Desired destinations"
                  className="text-sm sm:text-base"
                />
              </div>
              <div className="space-y-1 sm:space-y-2 col-span-2 sm:col-span-1">
                <label className="text-xs sm:text-sm font-medium font-poppins">Tour type</label>
                <Select value={newEnquiry.tourType} onValueChange={(value) => handleInputChange("tourType", value)}>
                  <SelectTrigger className="text-sm sm:text-base">
                    <SelectValue placeholder="Select tour type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Adventure" className="text-sm sm:text-base">
                      Adventure
                    </SelectItem>
                    <SelectItem value="Cultural" className="text-sm sm:text-base">
                      Cultural
                    </SelectItem>
                    <SelectItem value="Beach" className="text-sm sm:text-base">
                      Beach
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1 sm:space-y-2 col-span-2 sm:col-span-1">
                <label className="text-xs sm:text-sm font-medium">Estimated dates</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal text-sm sm:text-base",
                        !dateRange.from && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, "dd MMM yy")} - {format(dateRange.to, "dd MMM yy")}
                          </>
                        ) : (
                          format(dateRange.from, "dd MMM yy")
                        )
                      ) : (
                        <span>Select dates</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={new Date(2025, 2)}
                      selected={dateRange}
                      onSelect={(range) => {
                        setDateRange({
                          from: range?.from,
                          to: range?.to || undefined,
                        })
                        if (range?.from && range?.to) {
                          handleInputChange(
                            "estimatedDates",
                            `${format(range.from, "dd MMM yy")} - ${format(range.to, "dd MMM yy")}`,
                          )
                        }
                      }}
                      numberOfMonths={1}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-1 sm:space-y-2 col-span-2 sm:col-span-1 font-poppins">
                <label className="text-xs sm:text-sm font-medium">Currency</label>
                <Select value={newEnquiry.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                  <SelectTrigger className="text-sm sm:text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD" className="text-sm sm:text-base">
                      USD
                    </SelectItem>
                    <SelectItem value="EUR" className="text-sm sm:text-base">
                      EUR
                    </SelectItem>
                    <SelectItem value="GBP" className="text-sm sm:text-base">
                      GBP
                    </SelectItem>
                    <SelectItem value="JPY" className="text-sm sm:text-base">
                      JPY
                    </SelectItem>
                    <SelectItem value="AUD" className="text-sm sm:text-base">
                      AUD
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1 sm:space-y-2 col-span-2 font-poppins">
                <label className="text-xs sm:text-sm font-medium">Budget</label>
                <div className="pt-2 px-2">
                  <Slider
                    defaultValue={[1000]}
                    max={5000}
                    min={100}
                    step={100}
                    onValueChange={(value) => handleInputChange("budget", value[0])}
                  />
                  <div className="flex justify-between mt-2 text-xs sm:text-sm text-gray-500">
                    <span>$100</span>
                    <div className="bg-green-100 px-2 py-1 rounded text-green-800">${newEnquiry.budget}</div>
                    <span>$5000</span>
                  </div>
                </div>
              </div>
              <div className="col-span-2 space-y-1 sm:space-y-2 font-poppins">
                <label className="text-xs sm:text-sm font-medium">Notes</label>
                <Textarea
                  value={newEnquiry.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  className="min-h-[100px] text-sm sm:text-base"
                  placeholder="Additional details about the enquiry"
                />
              </div>
              <div className="space-y-1 sm:space-y-2 col-span-2 sm:col-span-1">
                <label className="text-xs sm:text-sm font-medium font-poppins">Point of contact</label>
                <Select
                  value={newEnquiry.pointOfContact || ""}
                  onValueChange={(value) => handleInputChange("pointOfContact", value)}
                >
                  <SelectTrigger className="text-sm sm:text-base">
                    <SelectValue placeholder="Select point of contact" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Direct" className="text-sm sm:text-base">
                      Direct
                    </SelectItem>
                    <SelectItem value="Agent" className="text-sm sm:text-base">
                      Agent
                    </SelectItem>
                    <SelectItem value="Referral" className="text-sm sm:text-base">
                      Referral
                    </SelectItem>
                    <SelectItem value="Website" className="text-sm sm:text-base">
                      Website
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1 sm:space-y-2 col-span-2 sm:col-span-1">
                <label className="text-xs sm:text-sm font-medium font-poppins">Assign staff</label>
                <Select
                  value={newEnquiry.assignedStaff}
                  onValueChange={(value) => handleInputChange("assignedStaff", value)}
                >
                  <SelectTrigger className="text-sm sm:text-base">
                    <SelectValue placeholder="Select staff member" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kevin Blake" className="text-sm sm:text-base">
                      Kevin Blake
                    </SelectItem>
                    <SelectItem value="Maria Rodriguez" className="text-sm sm:text-base">
                      Maria Rodriguez
                    </SelectItem>
                    <SelectItem value="Priya Sharma" className="text-sm sm:text-base">
                      Priya Sharma
                    </SelectItem>
                    <SelectItem value="Ahmed Khan" className="text-sm sm:text-base">
                      Ahmed Khan
                    </SelectItem>
                    <SelectItem value="Emily Johnson" className="text-sm sm:text-base">
                      Emily Johnson
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="border-t p-3 sm:p-4 flex justify-end font-poppins">
            <Button
              onClick={handleAddEnquiry}
              className="bg-green-700 hover:bg-green-800 text-white w-full text-sm sm:text-base"
              disabled={!newEnquiry.name || !newEnquiry.phone}
            >
              Add Enquiry
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}