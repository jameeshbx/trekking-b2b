"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MoreHorizontal } from "lucide-react"

type RowActionsProps = {
  requestedOn?: string
  managedBy?: string
  side?: "top" | "right" | "bottom" | "left"
}

export function RowActions({ requestedOn = "02/02/2025", managedBy = "Manager 3", side = "right" }: RowActionsProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
          aria-label="Row actions"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        side={side}
        align="end"
        sideOffset={8}
        className="w-[260px] rounded-2xl border border-black/10 shadow-md p-4 relative"
      >
        {/* close bubble */}
        <button
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="absolute -top-3 -right-3 h-6 w-6 rounded-full bg-[#183F30] text-white text-sm leading-none grid place-items-center shadow"
        >
          {"\u00D7"}
        </button>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-semibold text-slate-500">Requested on</span>
            <span className="text-[15px] font-semibold text-slate-600">{requestedOn}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-semibold text-slate-500">Managed by</span>
            <span className="text-[15px] font-semibold text-slate-600">{managedBy}</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
