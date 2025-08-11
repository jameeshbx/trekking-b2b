import { TrendingUp } from "lucide-react"


import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

import ActiveUsersChart from "@/components/active-users-chart"
import SalesOverviewChart from "@/components/sales-overview-chart"
import { RequestsTable, type RequestRow } from "@/components/requests-table"
import { SubscriptionsTable, type SubRow } from "@/components/subscriptions-table"

export default function Page() {
  const subscriptionPercent = 40

  const requestRows: RequestRow[] = [
    {
      id: "AREQ12350",
      name: "Lisa Ray",
      phone: "+1-678-901-2345",
      email: "lisaray@example.com",
      company: "AdventureGo",
      status: "Pending",
      requestedOn: "02/02/2025",
      managedBy: "Manager 3",
    },
    {
      id: "AREQ12350",
      name: "Lisa Ray",
      phone: "+1-678-901-2345",
      email: "lisaray@example.com",
      company: "AdventureGo",
      status: "Pending",
      requestedOn: "02/02/2025",
      managedBy: "Manager 3",
    },
    {
      id: "AREQ12350",
      name: "Lisa Ray",
      phone: "+1-678-901-2345",
      email: "lisaray@example.com",
      company: "AdventureGo",
      status: "Approved",
      requestedOn: "02/02/2025",
      managedBy: "Manager 3",
    },
  ]

  const subsRows: SubRow[] = [
    {
      id: "SUB12345",
      name: "Lisa Ray",
      email: "lisaray@example.com",
      company: "AdventureGo",
      status: "Active",
      requestedOn: "02/02/2025",
      managedBy: "Manager 3",
    },
    {
      id: "SUB12344",
      name: "Lisa Ray",
      email: "lisaray@example.com",
      company: "AdventureGo",
      status: "Inactive",
      requestedOn: "02/02/2025",
      managedBy: "Manager 3",
    },
    {
      id: "SUB12343",
      name: "Lisa Ray",
      email: "lisaray@example.com",
      company: "AdventureGo",
      status: "Active",
      requestedOn: "02/02/2025",
      managedBy: "Manager 3",
    },
    {
      id: "SUB12345",
      name: "Lisa Ray",
      email: "lisaray@example.com",
      company: "AdventureGo",
      status: "Active",
      requestedOn: "02/02/2025",
      managedBy: "Manager 3",
    },
    {
      id: "SUB12344",
      name: "Lisa Ray",
      email: "lisaray@example.com",
      company: "AdventureGo",
      status: "Inactive",
      requestedOn: "02/02/2025",
      managedBy: "Manager 3",
    },
    {
      id: "SUB12344",
      name: "Lisa Ray",
      email: "lisaray@example.com",
      company: "AdventureGo",
      status: "Inactive",
      requestedOn: "02/02/2025",
      managedBy: "Manager 3",
    },
    {
      id: "SUB12344",
      name: "Lisa Ray",
      email: "lisaray@example.com",
      company: "AdventureGo",
      status: "Inactive",
      requestedOn: "02/02/2025",
      managedBy: "Manager 3",
    },
    {
      id: "SUB12345",
      name: "Lisa Ray",
      email: "lisaray@example.com",
      company: "AdventureGo",
      status: "Active",
      requestedOn: "02/02/2025",
      managedBy: "Manager 3",
    },
    {
      id: "SUB12345",
      name: "Lisa Ray",
      email: "lisaray@example.com",
      company: "AdventureGo",
      status: "Active",
      requestedOn: "02/02/2025",
      managedBy: "Manager 3",
    },
  ]
  return (
    <div className="min-h-screen w-full bg-muted/40">
      <main className="mx-auto max-w-7xl p-2 md:p-2 lg:p-2 space-y-6">
        {/* Top metrics */}
        <div className="w-full max-w-4xl grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
          <Card className="rounded-xl p-4 border-none">
            
              <div className="flex items-start justify-between ">
                <div>
                  <CardDescription className='font-semibold font-Helvetica text-[#6F7175]'>Today{"'"}s Subscription</CardDescription>
                  <CardTitle className="text-xl mt-1 flex items-center gap-2">
                    5
                    <span className="text-emerald-600 text-sm font-medium inline-flex items-center gap-1">
                       {"+"}2%
                    </span>
                  </CardTitle>
                </div>
                <div className="size-10 rounded-lg bg-[#183F30] text-emerald-700 flex items-center justify-center">
                  <Image src="/dashboard/sublogo.svg" alt="Calendar" width={20} height={20} />
                </div>
              </div>
            
          </Card>

          <Card className="rounded-xl p-4 border-none">
            
              <div className="flex items-start justify-between">
                <div>
                  <CardDescription className='font-semibold font-Helvetica text-[#6F7175]'>Today{"'"}s Users</CardDescription>
                  <CardTitle className="text-xl mt-1 flex items-center gap-2">
                    50
                    <span className="text-emerald-600 text-sm font-medium inline-flex items-center gap-1">
                       {"+"}5%
                    </span>
                  </CardTitle>
                </div>
                <div className="size-10 rounded-lg bg-[#183F30] text-emerald-700 flex items-center justify-center">
                  <Image src="/dashboard/userlogo.svg" alt="Calendar" width={20} height={20} />
                </div>
              </div>
           
          </Card>

          {/* Subscription Rate wide pill card */}
          <Card className="rounded-xl px-4 py-2 border-none bg-[var(--dark-blue)]">
            
              <div className="flex items-center justify-between  ">
                <div className="text-sm text-muted-foreground text-[#B8C0CC] font-semibold font-Helvetica">Subscription Rate</div>
                <div className="size-6 rounded-lg bg-[#243B53]  flex items-center justify-center">
                  <Image src="/dashboard/graphlogo.svg" alt="Calendar" width={15} height={15} />
                </div>
              </div>
            
            
              <div className="flex items-center gap-3 ">
                <div className="text-xl font-semibold text-white">12%</div>
                <Badge variant="secondary" className="bg-[#D2FFE6] text-emerald-700 hover:bg-emerald-50">
                  <TrendingUp className="h-3.5 w-3.5 mr-1" /> +37.60%
                </Badge>
                <span className="ml-auto mt-2 text-xs text-muted-foreground text-[#B8C0CC]">{subscriptionPercent}%</span>
              </div>
              <div className="mt-1 h-1 w-full rounded-full bg-[#627D98]">
                <div
                  className="h-1 rounded-full bg-[#00C7F2]"
                  style={{ width: `${subscriptionPercent}%` }}
                  aria-label="subscription progress"
                />
              </div>
            
          </Card>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] gap-4 md:gap-6">
          {/* Active Users Card */}
          <Card className="rounded-2xl overflow-hidden border-none">
            <CardContent className="p-0">
              <div className="p-2">
                <div className="rounded-xl bg-gradient-to-br from-[#0b1027] to-[#1b2a57] text-white p-4 sm:p-6">
                  <div className="h-[160px] sm:h-[160px]">
                    <ActiveUsersChart />
                  </div>
                </div>

                {/* Meta row */}
                <div className="mt-4 px-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold  font-Helvetica ">Active Users</div>
                      <div className="text-xs text-[#6F7175]   inline-flex items-center gap-1">
                         <span className='text-emerald-600 font-bold'>(+23)</span> than last year
                      </div>
                    </div>
                  </div>

                

                  <div className="grid grid-cols-3 gap-3 py-2 text-sm mt-4">
                    <div className="flex l items-center gap-2">
                      <div  className="flex flex-col items-center gap-1">
                      <div className="size-10 rounded-lg bg-[#183F30] text-emerald-700 flex items-center justify-center">
                        <Image src="/dashboard/default.svg" alt="Calendar" width={20} height={20} />
                      </div>
                      <div className="font-semibold">420</div>
                      </div>
                      <div className='pb-6'>
                      <div className="text-xs text-muted-foreground">Users</div>
                      </div>
                      
                    </div>
                    <div className="flex l items-center gap-2">
                      <div  className="flex flex-col items-center gap-1">
                      <div className="size-10 rounded-lg bg-[#183F30] text-emerald-700 flex items-center justify-center">
                        <Image src="/dashboard/sharp.svg" alt="Calendar" width={20} height={20} />
                      </div>
                      <div className="font-semibold">1.5m</div>
                      </div>
                      <div className='pb-6'>
                      <div className="text-xs text-muted-foreground">Clicks</div>
                      </div>
                      
                    </div>
                    <div className="flex l items-center gap-2">
                      <div  className="flex flex-col items-center gap-1">
                      <div className="size-10 rounded-lg bg-[#183F30] text-emerald-700 flex items-center justify-center">
                        <Image src="/dashboard/sales.svg" alt="Calendar" width={20} height={20} />
                      </div>
                      <div className="font-semibold">220₹</div>
                      </div>
                      <div className='pb-6'>
                      <div className="text-xs text-muted-foreground">Sales</div>
                      </div>
                      
                    </div>
                    
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sales Overview */}
          <Card className="rounded-2xl border-none">
            
              <div className="flex items-start justify-between p-4 px-6 ">
                <div>
                  <CardTitle>Sales overview</CardTitle>
                  <CardDescription className="inline-flex text-[#6F7175] items-center gap-1 mt-1">
                    <span className="text-emerald-600 font-semibold inline-flex items-center gap-1">
                      ({"+"}5) more
                    </span>
                  in 2025
                  </CardDescription>
                </div>
                
              </div>
            
           
              <div className="h-[240px] sm:h-[280px] lg:h-[240px] mt-4">
                <SalesOverviewChart />
              </div>
           
          </Card>
        </div>

        {/* Tables row */}
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-2 md:gap-4">
          {/* Left column (two tables stacked) */}
          <div className="grid grid-cols-1 gap-3 md:gap-4 xl:col-span-3 ">
          <RequestsTable title="Agency Requests" buttonText="See more" rows={requestRows} />
          <RequestsTable title="DMC Requests" buttonText="See more" rows={requestRows} />
          </div>

          {/* Right column (wider) */}
          <div className="xl:col-span-2 ">
          <SubscriptionsTable  title="Recent Subscriptions" buttonText="See more" rows={subsRows} />
          </div>
        </div>

        <footer className="py-6  text-xs text-muted-foreground">
        @ 2025, Made by Trekking Miles.
        </footer>
      </main>
    </div>
  )
}

