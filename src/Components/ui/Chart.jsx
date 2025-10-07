import React from "react";
import { ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { motion } from "framer-motion";
import { cn } from "../../lib/utils"; // optional utility if available

// ─────────────────────────────
// ChartContainer
// ─────────────────────────────
export function ChartContainer({ title, description, children, className }) {
  return (
    <div
      className={cn(
        "w-full h-[350px] p-4 rounded-2xl border bg-card shadow-sm",
        className
      )}
    >
      {title && (
        <div className="mb-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

// ─────────────────────────────
// ChartTooltip
// ─────────────────────────────
export function ChartTooltip({ content }) {
  return (
    <RechartsTooltip
      cursor={{ fill: "rgba(0,0,0,0.05)" }}
      content={content}
      wrapperStyle={{ outline: "none" }}
    />
  );
}

// ─────────────────────────────
// ChartTooltipContent
// ─────────────────────────────
export function ChartTooltipContent({ active, payload, label }) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      className="rounded-lg border bg-popover px-3 py-2 text-sm shadow-md"
    >
      <p className="font-medium text-foreground">{label}</p>
      {payload.map((entry, index) => (
        <div key={`tooltip-${index}`} className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">
            {entry.name}:{" "}
            <span className="font-medium text-foreground">{entry.value}</span>
          </span>
        </div>
      ))}
    </motion.div>
  );
}
