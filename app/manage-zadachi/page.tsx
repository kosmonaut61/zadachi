"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MoreHorizontal, Plus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Navigation } from "@/components/navigation"
import { useUser } from "@/contexts/user-context"
import { useTask, categories, predefinedTasksTemplate, timeframes } from "@/contexts/task-context"
import { cn } from "@/lib/utils"
import { ZadachiDrawer } from "@/components/zadachi-drawer"
// Import the ConfirmationDialog component
import { ConfirmationDialog } from "@/components/confirmation-dialog"
import { Trash2 } from "lucide-react"

export default function ManageZadachi() {
  const { users } = useUser()
  const { deleteTask, resetAllTasks } = useTask()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<(typeof predefinedTasksTemplate)[0] | null>(null)
  // Add state for the confirmation dialog
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)

  const handleCreateZadachi = () => {
    setEditingTask(null)
    setIsDrawerOpen(true)
  }

  const handleEditZadachi = (task: (typeof predefinedTasksTemplate)[0]) => {
    setEditingTask(task)
    setIsDrawerOpen(true)
  }

  const handleDeleteZadachi = (taskIndex: number) => {
    // Remove from predefined tasks
    predefinedTasksTemplate.splice(taskIndex, 1)
    // Force re-render
    window.location.reload()
  }

  const handleDrawerClose = (open: boolean) => {
    setIsDrawerOpen(open)
    if (!open) {
      setEditingTask(null)
    }
  }

  // Helper function to display user access
  const getUserAccessText = (allowedUsers: string[]) => {
    if (allowedUsers.length === 0) return "All"

    return allowedUsers
      .map((userId) => {
        const user = users.find((u) => u.id === userId)
        return user ? user.firstName : ""
      })
      .filter(Boolean)
      .join(", ")
  }

  // Add a reset function
  const handleReset = () => {
    resetAllTasks()
    setIsResetDialogOpen(false)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="space-y-4">
          {predefinedTasksTemplate.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No Zadachi</h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                Use the Create New button in the bottom right hand corner.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {predefinedTasksTemplate.map((task, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center mr-3 mt-1",
                            categories[task.category].color,
                          )}
                        >
                          <span>{categories[task.category].icon}</span>
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

      {/* Footer with Reset Button and Add Button */}
      <footer className="p-4 flex justify-between items-center border-t">
        <Button
          variant="outline"
          className="flex items-center gap-1 text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => setIsResetDialogOpen(true)}
        >
          <Trash2 className="h-4 w-4" />
          Reset All Zadachi
        </Button>
        <Button size="icon" className="rounded-full h-12 w-12 shadow-lg" onClick={handleCreateZadachi}>
          <Plus className="h-6 w-6" />
          <span className="sr-only">Add new zadachi</span>
        </Button>
      </footer>

      {/* Reset Confirmation Dialog */}
      <ConfirmationDialog
        open={isResetDialogOpen}
        onOpenChange={setIsResetDialogOpen}
        title="Reset All Zadachi"
        description="This will remove all assigned zadachi and reset all usage counts. This action cannot be undone."
        confirmText="Reset"
        cancelText="Cancel"
        onConfirm={handleReset}
      />

      {/* Zadachi Drawer */}
      <ZadachiDrawer open={isDrawerOpen} onOpenChange={handleDrawerClose} editingTask={editingTask} />
    </div>
  )
}
