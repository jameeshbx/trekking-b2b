import * as React from "react"
import { cn } from "@/lib/utils"

export type SeparatorProps = React.HTMLAttributes<HTMLHRElement>

export function Separator({ className, ...props }: SeparatorProps) {
  return (
    <hr
      className={cn("shrink-0 border-t border-muted", className)}
      {...props}
    />
  )
}

export default Separator


