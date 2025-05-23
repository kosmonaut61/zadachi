"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MoreHorizontal, Plus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { Navigation } from "@/components/navigation"
import { useUser } from "@/contexts/user-context"
import { useTask, categories } from "@/contexts/task-context"
import { CategoryFilter } from "@/components/category-filter"

export default function Home() {
  const [showTaskSelection, setShowTaskSelection] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { currentUser } = useUser()
  const { tasks, addTask, completeTask, removeTask, getTasksByUserId, getAvailableTasksForUser } = useTask()

  const userTasks = getTasksByUserId(currentUser.id)
  const filteredTasks = selectedCategory ? userTasks.filter((task) => task.category === selectedCategory) : userTasks

  const availableTasks = getAvailableTasksForUser(currentUser.id)
  const filteredAvailableTasks = selectedCategory
    ? availableTasks.filter((task) => task.category === selectedCategory)
    : availableTasks

  const handleAddTask = (taskTemplate: ReturnType<typeof getAvailableTasksForUser>[0]) => {
    addTask({
      ...taskTemplate,
      userId: currentUser.id,
    })
    setShowTaskSelection(false)
  }

  const handleCompleteTask = (taskId: string) => {
    completeTask(taskId)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Main Content */}
      <main className="flex-1 p-4">
        {/* User Info */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold">
              {currentUser.firstName} {currentUser.lastName}
            </h2>
            <p className="text-sm text-gray-500">Total Points • {currentUser.totalPoints}</p>
          </div>
          <Button variant="outline">Redeem</Button>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No Zadachi</h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                {selectedCategory
                  ? `No ${selectedCategory} zadachi found. Try selecting a different category or add new zadachi.`
                  : "Use the Create New button in the bottom right hand corner."}
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <Card key={task.id} className="relative">
                <CardContent className="p-4 flex items-center">
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center mr-3",
                      categories[task.category].color,
                    )}
                  >
                    <span>{categories[task.category].icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-gray-500">
                      {task.category.charAt(0).toUpperCase() + task.category.slice(1)} • {task.points}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-5 w-5" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleCompleteTask(task.id)}>Complete</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => removeTask(task.id)}>Remove</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Task Selection Modal */}
        {showTaskSelection && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h3 className="text-lg font-medium mb-4">Select a Zadachi</h3>
              {filteredAvailableTasks.length === 0 ? (
                <p className="text-center text-gray-500 py-4">
                  No available zadachi at the moment. Check back later or create new ones.
                </p>
              ) : (
                <div className="space-y-3">
                  {filteredAvailableTasks.map((task, index) => (
                    <Card
                      key={index}
                      className={cn(
                        "cursor-pointer transform transition-transform hover:scale-105",
                        categories[task.category].color,
                      )}
                      onClick={() => handleAddTask(task)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center mb-2">
                          <span className="mr-2">{categories[task.category].icon}</span>
                          <span className="text-sm">
                            {task.category.charAt(0).toUpperCase() + task.category.slice(1)} • {task.points}
                          </span>
                        </div>
                        <p className="font-medium">{task.title}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              <div className="mt-4 flex justify-end">
                <Button variant="outline" onClick={() => setShowTaskSelection(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer with Category Filter and Add Button */}
      <footer className="p-4 flex justify-between items-center border-t">
        <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
        <Button size="icon" className="rounded-full h-12 w-12 shadow-lg" onClick={() => setShowTaskSelection(true)}>
          <Plus className="h-6 w-6" />
          <span className="sr-only">Add new task</span>
        </Button>
      </footer>
    </div>
  )
}
