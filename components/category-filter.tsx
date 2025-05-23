"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Check, ChevronUp, Search } from "lucide-react"
import { categories } from "@/contexts/task-context"
import { cn } from "@/lib/utils"

interface CategoryFilterProps {
  selectedCategory: string | null
  onSelectCategory: (category: string | null) => void
}

export function CategoryFilter({ selectedCategory, onSelectCategory }: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const filteredCategories = Object.entries(categories).filter(([key]) =>
    key.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelectCategory = (category: string | null) => {
    onSelectCategory(category)
    setIsOpen(false)
  }

  const getButtonText = () => {
    if (!selectedCategory) return "All Zadachi"
    const categoryKey = selectedCategory as keyof typeof categories
    const categoryName = categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1)
    return `${categories[categoryKey].icon} ${categoryName}`
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        className="flex items-center gap-1"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        {getButtonText()}
        <ChevronUp className={`h-4 w-4 transition-transform ${isOpen ? "" : "rotate-180"}`} />
      </Button>

      {isOpen && (
        <div className="absolute bottom-full mb-2 left-0 w-80 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search a type..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto">
            <button
              className={cn(
                "w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center justify-between",
                !selectedCategory && "bg-gray-50",
              )}
              onClick={() => handleSelectCategory(null)}
            >
              <span>All Categories</span>
              {!selectedCategory && <Check className="h-4 w-4" />}
            </button>
            {filteredCategories.map(([key, { icon }]) => (
              <button
                key={key}
                className={cn(
                  "w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center justify-between",
                  selectedCategory === key && "bg-gray-50",
                )}
                onClick={() => handleSelectCategory(key)}
              >
                <div className="flex items-center">
                  <span className="mr-3 text-xl">{icon}</span>
                  <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                </div>
                {selectedCategory === key && <Check className="h-4 w-4" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
