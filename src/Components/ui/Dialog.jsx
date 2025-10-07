"use client"

import React, { createContext, useContext, useState } from "react"
import { X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const DialogContext = createContext()

export function Dialog({ open, onOpenChange, children }) {
  const [isOpen, setIsOpen] = useState(open || false)

  const handleOpenChange = (value) => {
    setIsOpen(value)
    onOpenChange?.(value)
  }

  return (
    <DialogContext.Provider value={{ isOpen, handleOpenChange }}>
      {children}
    </DialogContext.Provider>
  )
}

export function DialogTrigger({ children }) {
  const { handleOpenChange } = useContext(DialogContext)
  return (
    <div onClick={() => handleOpenChange(true)} className="cursor-pointer">
      {children}
    </div>
  )
}

export function DialogContent({ children, className = "" }) {
  const { isOpen, handleOpenChange } = useContext(DialogContext)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => handleOpenChange(false)}
        >
          <motion.div
            className={`relative w-full max-w-lg rounded-2xl bg-background p-6 shadow-lg ${className}`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => handleOpenChange(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition"
            >
              <X className="h-5 w-5" />
            </button>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function DialogHeader({ children, className = "" }) {
  return (
    <div className={`mb-4 text-center space-y-2 ${className}`}>
      {children}
    </div>
  )
}

export function DialogTitle({ children, className = "" }) {
  return (
    <h2 className={`text-xl font-semibold leading-none tracking-tight ${className}`}>
      {children}
    </h2>
  )
}

export function DialogDescription({ children, className = "" }) {
  return (
    <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
  )
}

export function DialogFooter({ children, className = "" }) {
  return (
    <div className={`mt-6 flex justify-end gap-3 ${className}`}>
      {children}
    </div>
  )
}
