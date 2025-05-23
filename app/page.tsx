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
import { ZadachiSelectionGame } from "@/components/zadachi-selection-game"
import { PointsRedemptionModal } from "@/components/points-redemption-modal"

export default function Home() {
  const [showTaskSelection, setShowTaskSelection] = useState(false)
  const [showRedemption, setShowRedemption] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { currentUser, updateUser } = useUser()
  const { tasks, addTask, completeTask, removeTask, getTasksByUserId, getAvailableTasksForUser } = useTask()

  const userTasks = getTasksByUserId(currentUser.id)
  const filteredTasks = selectedCategory ? userTasks.filter((task) => task.category === selectedCategory) : userTasks

  const availableTasks = getAvailableTasksForUser(currentUser.id)
  const filteredAvailableTasks = selectedCategory
    ? availableTasks.filter((task) => task.category === selectedCategory)
    : availableTasks

  // Debug logging
  console.log("All available tasks for user:", availableTasks.length)
  console.log("User tasks:", userTasks.length)
  console.log("Filtered available tasks:", filteredAvailableTasks.length)

  // Filter out tasks that user already has (prevent stacking)
  const tasksNotAlreadyAssigned = filteredAvailableTasks.filter(
    (task) => !userTasks.some((userTask) => userTask.title === task.title && userTask.category === task.category),
  )

  console.log("Tasks not already assigned:", tasksNotAlreadyAssigned.length)

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

  const handleRedeemPoints = (points: number) => {
    updateUser(currentUser.id, {
      totalPoints: currentUser.totalPoints - points,
    })
  }

  return (
    <div className="min-h-screen flex flex-col pb-20">
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
          <Button variant="outline" onClick={() => setShowRedemption(true)}>
            Redeem
          </Button>
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

        {/* Gamified Task Selection */}
        <ZadachiSelectionGame
          open={showTaskSelection}
          onOpenChange={setShowTaskSelection}
          availableTasks={tasksNotAlreadyAssigned}
          onSelectTask={handleAddTask}
          userName={`${currentUser.firstName} ${currentUser.lastName}`}
        />

        {/* Points Redemption Modal */}
        <PointsRedemptionModal
          open={showRedemption}
          onOpenChange={setShowRedemption}
          userName={`${currentUser.firstName} ${currentUser.lastName}`}
          totalPoints={currentUser.totalPoints}
          onRedeem={handleRedeemPoints}
        />
      </main>

      {/* Sticky Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center shadow-lg z-40">
        <CategoryFilter selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} />
        <Button size="icon" className="rounded-full h-12 w-12 shadow-lg" onClick={() => setShowTaskSelection(true)}>
          <Plus className="h-6 w-6" />
          <span className="sr-only">Add new tasks</span>
        </Button>
      </footer>
    </div>
  )
}
