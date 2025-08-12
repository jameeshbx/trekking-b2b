"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableRow } from "@/components/ui/table"
import { RowActions } from "./row-actions"

export type RequestRow = {
  id: string
  name: string
  phone: string
  email: string
  company: string
  status: "Pending" | "Approved"
  requestedOn?: string
  managedBy?: string
}

export function RequestsTable({
  title,
  buttonText,
  rows = [],
}: { title: string; buttonText: string; rows?: RequestRow[] }) {
  return (
    <>
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <CardTitle className="text-base">{title}</CardTitle>
        <Button size="sm" className="rounded-full h-8 px-3 bg-[#ECEDEE] hover:bg-[#ECEDEE] text-dark border-none">
          {buttonText}
        </Button>
      </div>
      <Card className="rounded-2xl overflow-hidden border-none">
        <div className="overflow-x-auto scrollbar-card">
          <Table className="text-sm  [&_th]:py-2 [&_td]:py-2 [&_th]:px-3 [&_td]:px-3 [&_th]:text-sm">
            
              
            
            <TableBody className="font-poppins">
            <TableRow>
                <TableHead className="min-w-[110px] font-semibold text-[#6B6F7B]">REQUEST ID</TableHead>
                <TableHead className="min-w-[120px] font-semibold text-[#6B6F7B]">NAME</TableHead>
                <TableHead className="min-w-[100px] font-semibold text-[#6B6F7B]">PHONE NO.</TableHead>
                <TableHead className="min-w-[180px] font-semibold text-[#6B6F7B]">EMAIL</TableHead>
                <TableHead className="min-w-[130px] font-semibold text-[#6B6F7B]">COMPANY</TableHead>
                <TableHead className="min-w-[60px] font-semibold text-[#6B6F7B]">STATUS</TableHead>
                <TableHead />
              </TableRow>
              {rows.map((r, i) => (
                <TableRow key={`${r.id}-${i}`}>
                  <TableCell className="font-medium">{r.id}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.name}</TableCell>
                  <TableCell className="whitespace-nowrap">{r.phone}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Link href="#" className="underline underline-offset-2">
                      {r.email}
                    </Link>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{r.company}</TableCell>
                  <TableCell>
                    {r.status === "Approved" ? (
                      <Badge className="bg-[#F0FEED] text-[#259800] hover:bg-bg-[#F0FEED]">Approved</Badge>
                    ) : (
                      <Badge className="bg-[#FEEDED] text-[#DC2626] hover:bg-bg-[#FEEDED] ">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <RowActions requestedOn={r.requestedOn ?? "02/02/2025"} managedBy={r.managedBy ?? "Manager 3"} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableCaption className="sr-only">{title}</TableCaption>
          </Table>
        </div>
      </Card>
    </>
  )
}
