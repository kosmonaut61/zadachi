"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronUp, ChevronRight, Download, Upload, Trash2, ArrowUpDown, Check } from "lucide-react"
import { ConfirmationDialog } from "@/components/confirmation-dialog"
import { downloadCSVTemplate, parseCSV, convertCSVTasksToZadachi } from "@/lib/csv-utils"
import { useTask } from "@/contexts/task-context"
import { useUser } from "@/contexts/user-context"
import { useToast } from "@/components/ui/use-toast"

export type SortOption = "category" | "points" | "frequency" | "timeframe" | "title"
export type SortDirection = "asc" | "desc"

interface OptionsMenuProps {
  onResetAll: () => void
  currentSort: SortOption
  currentDirection: SortDirection
  onSortChange: (sort: SortOption, direction: SortDirection) => void
  onTasksUploaded: () => void
}

export function OptionsMenu({
  onResetAll,
  currentSort,
  currentDirection,
  onSortChange,
  onTasksUploaded,
}: OptionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showResetSubmenu, setShowResetSubmenu] = useState(false)
  const [showSortSubmenu, setShowSortSubmenu] = useState(false)
  const [resetDialogConfig, setResetDialogConfig] = useState<{
    open: boolean
    title: string
    description: string
    action: () => void
  }>({
    open: false,
    title: "",
    description: "",
    action: () => {},
  })

  const menuRef = useRef<HTMLDivElement>(null)
  const resetButtonRef = useRef<HTMLButtonElement>(null)
  const sortButtonRef = useRef<HTMLButtonElement>(null)
  const resetSubmenuRef = useRef<HTMLDivElement>(null)
  const sortSubmenuRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { createCustomTask, resetTaskUsage, removeAllAssignedTasks, clearAllZadachiTemplates } = useTask()
  const { users } = useUser()
  const { toast } = useToast()

  const sortOptions = [
    { key: "title" as const, label: "Title" },
    { key: "category" as const, label: "Category" },
    { key: "points" as const, label: "Points" },
    { key: "frequency" as const, label: "Frequency" },
    { key: "timeframe" as const, label: "Timeframe" },
  ]

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        resetSubmenuRef.current &&
        !resetSubmenuRef.current.contains(event.target as Node) &&
        sortSubmenuRef.current &&
        !sortSubmenuRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
        setShowResetSubmenu(false)
        setShowSortSubmenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const handleDownloadTemplate = () => {
    downloadCSVTemplate()
    setIsOpen(false)
    toast({
      title: "Template Downloaded",
      description: "CSV template has been downloaded to your device.",
    })
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
    setIsOpen(false)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      toast({
        title: "Invalid File Type",
        description: "Please upload a CSV file.",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const csvText = e.target?.result as string
        const csvTasks = parseCSV(csvText)

        if (csvTasks.length === 0) {
          toast({
            title: "No Valid Tasks Found",
            description: "The CSV file doesn't contain any valid tasks.",
            variant: "destructive",
          })
          return
        }

        const zadachiTasks = convertCSVTasksToZadachi(csvTasks, users)

        // Create all tasks
        zadachiTasks.forEach((task) => {
          createCustomTask(task.title, task.category, task.points, task.allowedUsers, task.timeframe, task.frequency)
        })

        // Notify parent component that tasks were uploaded
        onTasksUploaded()

        toast({
          title: "Tasks Imported Successfully",
          description: `${zadachiTasks.length} zadachi have been added.`,
        })
      } catch (error) {
        console.error("Error parsing CSV:", error)
        toast({
          title: "Import Failed",
          description: "There was an error processing the CSV file.",
          variant: "destructive",
        })
      }
    }

    reader.readAsText(file)

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleResetOption = (type: "all" | "assigned" | "usage" | "templates") => {
    setIsOpen(false)
    setShowResetSubmenu(false)

    const configs = {
      all: {
        title: "Reset All Zadachi",
        description: "This will remove all assigned zadachi and reset all usage counts. This action cannot be undone.",
        action: () => {
          onResetAll()
          toast({
            title: "All Zadachi Reset",
            description: "All assigned zadachi and usage counts have been cleared.",
          })
        },
      },
      assigned: {
        title: "Remove All Assigned Zadachi",
        description:
          "This will remove all currently assigned zadachi from users but keep usage counts and zadachi templates. This action cannot be undone.",
        action: () => {
          removeAllAssignedTasks()
          toast({
            title: "Assigned Zadachi Removed",
            description: "All assigned zadachi have been removed from users.",
          })
        },
      },
      usage: {
        title: "Reset All Usage Counts",
        description:
          "This will reset all zadachi usage counts, making all zadachi available again. This action cannot be undone.",
        action: () => {
          resetTaskUsage()
          toast({
            title: "Usage Counts Reset",
            description: "All zadachi usage counts have been reset.",
          })
        },
      },
      templates: {
        title: "Clear All Zadachi Templates",
        description:
          "This will permanently delete all zadachi templates from the system. Users will no longer be able to add these zadachi. This action cannot be undone.",
        action: () => {
          clearAllZadachiTemplates()
          onTasksUploaded() // Refresh the list after clearing templates
          toast({
            title: "Zadachi Templates Cleared",
            description: "All zadachi templates have been permanently deleted.",
          })
        },
      },
    }

    setResetDialogConfig({
      open: true,
      ...configs[type],
    })
  }

  const handleSortSelect = (sortKey: SortOption) => {
    // If clicking the same sort option, toggle direction
    if (currentSort === sortKey) {
      const newDirection = currentDirection === "asc" ? "desc" : "asc"
      onSortChange(sortKey, newDirection)
    } else {
      // If clicking a different sort option, default to ascending
      onSortChange(sortKey, "asc")
    }
    setShowSortSubmenu(false)
    setIsOpen(false)
  }

  const handleResetConfirm = () => {
    resetDialogConfig.action()
    setResetDialogConfig((prev) => ({ ...prev, open: false }))
  }

  const toggleResetSubmenu = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowResetSubmenu(!showResetSubmenu)
    setShowSortSubmenu(false)
  }

  const toggleSortSubmenu = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowSortSubmenu(!showSortSubmenu)
    setShowResetSubmenu(false)
  }

  return (
    <>
      <div className="relative" ref={menuRef}>
        <Button
          variant="outline"
          className="flex items-center gap-1"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          Options
          <ChevronUp className={`h-4 w-4 transition-transform ${isOpen ? "" : "rotate-180"}`} />
        </Button>

        {isOpen && (
          <>
            {/* Main Menu */}
            <div className="absolute bottom-full mb-2 left-0 w-64 bg-white rounded-lg shadow-lg z-50 overflow-hidden border">
              <div className="py-1">
                <button
                  ref={sortButtonRef}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center justify-between"
                  onClick={toggleSortSubmenu}
                >
                  <div className="flex items-center gap-3">
                    <ArrowUpDown className="h-4 w-4" />
                    <span>Sort By</span>
                  </div>
                  <ChevronRight className={`h-4 w-4 transition-transform ${showSortSubmenu ? "rotate-90" : ""}`} />
                </button>

                <button
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center gap-3"
                  onClick={handleDownloadTemplate}
                >
                  <Download className="h-4 w-4" />
                  <span>Download CSV Template</span>
                </button>

                <button
                  className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center gap-3"
                  onClick={handleUploadClick}
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload Zadachi CSV</span>
                </button>

                <hr className="my-1" />

                <div className="relative">
                  <button
                    ref={resetButtonRef}
                    className="w-full text-left px-4 py-3 hover:bg-red-50 flex items-center justify-between text-red-600"
                    onClick={toggleResetSubmenu}
                  >
                    <div className="flex items-center gap-3">
                      <Trash2 className="h-4 w-4" />
                      <span>Reset Options</span>
                    </div>
                    <ChevronRight className={`h-4 w-4 transition-transform ${showResetSubmenu ? "rotate-90" : ""}`} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Sort Submenu */}
      {isOpen && showSortSubmenu && (
        <div
          ref={sortSubmenuRef}
          className="fixed z-50 bg-white rounded-lg shadow-lg border overflow-hidden"
          style={{
            bottom: "80px", // Position above the footer
            left: "200px", // Position to the right of the main menu
          }}
        >
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
      )}

      {/* Reset Submenu */}
      {isOpen && showResetSubmenu && (
        <div
          ref={resetSubmenuRef}
          className="fixed z-50 bg-white rounded-lg shadow-lg border overflow-hidden"
          style={{
            bottom: "80px", // Position above the footer
            left: "200px", // Position to the right of the main menu
          }}
        >
          <div className="py-1">
            <button
              className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 text-sm"
              onClick={() => handleResetOption("all")}
            >
              <div>
                <div className="font-medium">Reset All Zadachi</div>
                <div className="text-xs text-gray-500">Remove assigned + reset counts</div>
              </div>
            </button>

            <button
              className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 text-sm"
              onClick={() => handleResetOption("assigned")}
            >
              <div>
                <div className="font-medium">Remove All Assigned</div>
                <div className="text-xs text-gray-500">Remove from users, keep templates</div>
              </div>
            </button>

            <button
              className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 text-sm"
              onClick={() => handleResetOption("usage")}
            >
              <div>
                <div className="font-medium">Reset Usage Counts</div>
                <div className="text-xs text-gray-500">Make all zadachi available again</div>
              </div>
            </button>

            <button
              className="w-full text-left px-4 py-3 hover:bg-red-50 text-red-600 text-sm"
              onClick={() => handleResetOption("templates")}
            >
              <div>
                <div className="font-medium">Clear All Templates</div>
                <div className="text-xs text-gray-500">Permanently delete all zadachi</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />

      {/* Reset Confirmation Dialog */}
      <ConfirmationDialog
        open={resetDialogConfig.open}
        onOpenChange={(open) => setResetDialogConfig((prev) => ({ ...prev, open }))}
        title={resetDialogConfig.title}
        description={resetDialogConfig.description}
        confirmText="Reset"
        cancelText="Cancel"
        onConfirm={handleResetConfirm}
      />
    </>
  )
}
