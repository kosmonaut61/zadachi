"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronUp, ArrowUpDown, Check } from "lucide-react"

export type SortOption = "category" | "points" | "frequency" | "timeframe" | "title"
export type SortDirection = "asc" | "desc"

interface SortMenuProps {
  currentSort: SortOption
  currentDirection: SortDirection
  onSortChange: (sort: SortOption, direction: SortDirection) => void
}

export function SortMenu({ currentSort, currentDirection, onSortChange }: SortMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const sortOptions = [
    { key: "title" as const, label: "Title" },
    { key: "category" as const, label: "Category" },
    { key: "points" as const, label: "Points" },
    { key: "frequency" as const, label: "Frequency" },
    { key: "timeframe" as const, label: "Timeframe" },
  ]

  const handleSortSelect = (sortKey: SortOption) => {
    // If clicking the same sort option, toggle direction
    if (currentSort === sortKey) {
      const newDirection = currentDirection === "asc" ? "desc" : "asc"
      onSortChange(sortKey, newDirection)
    } else {
      // If clicking a different sort option, default to ascending
      onSortChange(sortKey, "asc")
    }
    setIsOpen(false)
  }

  const getCurrentSortLabel = () => {
    const option = sortOptions.find((opt) => opt.key === currentSort)
    const directionLabel = currentDirection === "asc" ? "↑" : "↓"
    return `${option?.label || "Title"} ${directionLabel}`
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="flex items-center gap-1"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <ArrowUpDown className="h-4 w-4" />
        Sort by {getCurrentSortLabel()}
        <ChevronUp className={`h-4 w-4 transition-transform ${isOpen ? "" : "rotate-180"}`} />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Menu */}
          <div className="absolute bottom-full mb-2 left-0 w-48 bg-white rounded-lg shadow-lg z-50 overflow-hidden border">
            <div className="py-1">
              {sortOptions.map((option) => (
                <button
                  key={option.key}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center justify-between"
                  onClick={() => handleSortSelect(option.key)}
                >
                  <span>{option.label}</span>
                  <div className="flex items-center gap-1">
                    {currentSort === option.key && (
                      <>
                        <span className="text-xs text-gray-500">{currentDirection === "asc" ? "A-Z" : "Z-A"}</span>
                        <Check className="h-4 w-4" />
                      </>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
