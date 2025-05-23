"use client"

import { useState, useMemo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MoreHorizontal, Plus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Navigation } from "@/components/navigation"
import { useUser } from "@/contexts/user-context"
import { useTask, categories, predefinedTasksTemplate, timeframes, type Task } from "@/contexts/task-context"
import { cn } from "@/lib/utils"
import { ZadachiDrawer } from "@/components/zadachi-drawer"
import { OptionsMenu, type SortOption, type SortDirection } from "@/components/options-menu"
import { useAuth } from "@/contexts/auth-context"

// Disable static generation for this page
export const dynamic = "force-dynamic"
export const runtime = "edge"

export default function ManageZadachi() {
  const { user } = useAuth()
  const { users } = useUser()
  const { deleteTask, resetAllTasks } = useTask()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Omit<Task, "id" | "userId"> | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>("title")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [refreshKey, setRefreshKey] = useState(0) // Used to force re-render

  // If not authenticated, show a message
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please sign in to manage tasks</p>
      </div>
    )
  }

  // Force a refresh of the task list
  const refreshTaskList = useCallback(() => {
    setRefreshKey((prev) => prev + 1)
  }, [])

  // Sort the tasks based on current sort settings
  const sortedTasks = useMemo(() => {
    const tasksToSort = [...predefinedTasksTemplate]

    return tasksToSort.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title)
          break
        case "category":
          comparison = a.category.localeCompare(b.category)
          break
        case "points":
          comparison = a.points - b.points
          break
        case "frequency":
          comparison = Number(a.frequency) - Number(b.frequency)
          break
        case "timeframe":
          // Custom order: daily, weekly, monthly
          const timeframeOrder = { daily: 1, weekly: 2, monthly: 3 }
          comparison = timeframeOrder[a.timeframe] - timeframeOrder[b.timeframe]
          break
        default:
          comparison = 0
      }

      return sortDirection === "asc" ? comparison : -comparison
    })
  }, [sortBy, sortDirection, refreshKey]) // Add refreshKey to dependencies

  const handleCreateZadachi = () => {
    setEditingTask(null)
    setIsDrawerOpen(true)
  }

  const handleEditZadachi = (task: Omit<Task, "id" | "userId">) => {
    setEditingTask(task)
    setIsDrawerOpen(true)
  }

  const handleDeleteZadachi = (taskIndex: number) => {
    // Find the original index in predefinedTasksTemplate
    const taskToDelete = sortedTasks[taskIndex]
    const originalIndex = predefinedTasksTemplate.findIndex(
      (t) => t.title === taskToDelete.title && t.category === taskToDelete.category,
    )

    if (originalIndex !== -1) {
      // Remove from predefined tasks
      predefinedTasksTemplate.splice(originalIndex, 1)
      // Force re-render
      refreshTaskList()
    }
  }

  const handleDrawerClose = (open: boolean) => {
    setIsDrawerOpen(open)
    if (!open) {
      setEditingTask(null)
      refreshTaskList() // Refresh when drawer closes (in case a task was added/edited)
    }
  }

  const handleSortChange = (sort: SortOption, direction: SortDirection) => {
    setSortBy(sort)
    setSortDirection(direction)
  }

  // Helper function to display user access
  const getUserAccessText = (allowedUsers: string[]) => {
    if (allowedUsers.length === 0) return "All"

    return allowedUsers
      .map((userId) => {
        const user = users.find((u) => u.id === userId)
        return user ? user.name : ""
      })
      .filter(Boolean)
      .join(", ")
  }

  const handleResetAll = () => {
    resetAllTasks()
    refreshTaskList()
  }

  return (
    <div className="min-h-screen flex flex-col pb-20">
      <Navigation />

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="space-y-4">
          {sortedTasks.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No Zadachi</h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                Use the Create New button in the bottom right hand corner or upload zadachi via CSV.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedTasks.map((task, index) => (
                <Card key={`${task.title}-${task.category}-${index}-${refreshKey}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-1",
                            categories[task.category as keyof typeof categories].color,
                          )}
                        >
                          <span>{categories[task.category as keyof typeof categories].icon}</span>
                        </div>
                        <div>
                          <h3 className="font-medium">{task.title}</h3>
                          <p className="text-sm text-gray-500">
                            {getUserAccessText(task.allowedUsers)} |{" "}
                            {task.category.charAt(0).toUpperCase() + task.category.slice(1)} • +{task.points}
                          </p>
                          <p className="text-sm text-gray-500">
                            {timeframes[task.timeframe]}, {task.frequency} {task.frequency === 1 ? "time" : "times"}
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-5 w-5" />
                            <span className="sr-only">More options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEditZadachi(task)}>Edit</DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteZadachi(index)}
                            className="text-red-500 focus:text-red-500"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Sticky Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center shadow-lg z-40">
        <OptionsMenu
          onSortChange={handleSortChange}
          onResetAll={handleResetAll}
          currentSort={sortBy}
          currentDirection={sortDirection}
          onTasksUploaded={refreshTaskList}
        />
        <Button onClick={handleCreateZadachi} className="ml-auto">
          <Plus className="h-5 w-5 mr-2" />
          Create New
        </Button>
      </footer>

      {/* Drawer for creating/editing tasks */}
      <ZadachiDrawer
        open={isDrawerOpen}
        onOpenChange={handleDrawerClose}
        editingTask={editingTask}
      />
    </div>
  )
}
