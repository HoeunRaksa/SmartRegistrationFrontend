import * as React from "react"

export function Badge({ children, className = "", variant = "default" }) {
  let base =
    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"

  let variants = {
    default: "bg-gray-200 text-gray-800",
    success: "bg-green-100 text-green-700",
    danger: "bg-red-100 text-red-700",
    warning: "bg-yellow-100 text-yellow-800",
    info: "bg-blue-100 text-blue-700",
  }

  return (
    <span className={`${base} ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  )
}
