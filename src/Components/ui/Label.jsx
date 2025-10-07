import React from "react"
import { cn } from "../../lib/utils"; // optional helper for conditional classNames

export function Label({ htmlFor, children, className = "", ...props }) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      {...props}
    >
      {children}
    </label>
  )
}
