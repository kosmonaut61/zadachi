"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useUser } from "@/contexts/user-context"
import { useTask, categories, timeframes, frequencies, predefinedTasksTemplate, type Task } from "@/contexts/task-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface ZadachiDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingTask?: Omit<Task, "id" | "userId"> | null
}

export function ZadachiDrawer({ open, onOpenChange, editingTask }: ZadachiDrawerProps) {
  const { users } = useUser()
  const { createCustomTask, updateTask } = useTask()

  // Form states
  const [title, setTitle] = useState("")
  const [points, setPoints] = useState("")
  const [category, setCategory] = useState<keyof typeof categories>("cleaning")
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [timeframe, setTimeframe] = useState<keyof typeof timeframes>("daily")
  const [frequency, setFrequency] = useState<keyof typeof frequencies>(3)
  const [selectAllUsers, setSelectAllUsers] = useState(true)

  const isEditing = !!editingTask

  // Reset form when drawer opens/closes or editing task changes
  useEffect(() => {
    if (open && editingTask) {
      setTitle(editingTask.title)
      setPoints(editingTask.points.toString())
      setCategory(editingTask.category)
      setSelectedUsers(editingTask.allowedUsers)
      setTimeframe(editingTask.timeframe)
      setFrequency(editingTask.frequency)
      setSelectAllUsers(editingTask.allowedUsers.length === 0)
    } else if (open && !editingTask) {
      setTitle("")
      setPoints("250")
      setCategory("cleaning")
      setSelectedUsers([])
      setTimeframe("daily")
      setFrequency(3)
      setSelectAllUsers(true)
    }
  }, [open, editingTask])

  const handleSave = () => {
    if (!title || !points) return

    const pointsValue = Number.parseInt(points, 10)
    if (isNaN(pointsValue)) return

    const allowedUsers = selectAllUsers ? [] : selectedUsers

    if (isEditing && editingTask) {
      // Update the task in predefined tasks template
      const index = predefinedTasksTemplate.findIndex(
        (t) => t.title === editingTask.title && t.category === editingTask.category
      )
      if (index !== -1) {
        predefinedTasksTemplate[index] = {
          ...predefinedTasksTemplate[index],
          title,
          category,
          points: pointsValue,
          allowedUsers,
          timeframe,
          frequency,
        }
      }
    } else {
      createCustomTask(title, category, pointsValue, allowedUsers, timeframe, frequency)
    }

    // Close the drawer
    onOpenChange(false)
  }

  const handleCancel = () => {
    // Close the drawer
    onOpenChange(false)
  }

  const handleUserSelection = (userId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedUsers((prev) => [...prev, userId])
    } else {
      setSelectedUsers((prev) => prev.filter((id) => id !== userId))
    }
  }

  const handleSelectAllUsers = (isChecked: boolean) => {
    setSelectAllUsers(isChecked)
    if (isChecked) {
      setSelectedUsers([])
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="border-b p-4">
          <SheetTitle>{isEditing ? "Edit Zadachi" : "Create New Zadachi"}</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title" className="text-right">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex. Feed the dog"
                required
              />
            </div>

            <div>
              <Label htmlFor="points" className="text-right">
                Points <span className="text-red-500">*</span>
              </Label>
              <Input
                id="points"
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                placeholder="Define a point value"
                min="1"
                required
              />
            </div>

            <div>
              <Label htmlFor="category" className="text-right">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select value={category} onValueChange={(value) => setCategory(value as keyof typeof categories)}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categories).map(([key, { icon }]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center">
                        <span className="mr-2">{icon}</span>
                        <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-right">
                Users <span className="text-red-500">*</span>
              </Label>
              <div className="mt-2 border rounded-md p-3 space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="selectAll" checked={selectAllUsers} onCheckedChange={handleSelectAllUsers} />
                  <label
                    htmlFor="selectAll"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    All Users
                  </label>
                </div>
                {!selectAllUsers && (
                  <div className="pl-6 space-y-2">
                    {users.map((user) => (
                      <div key={user.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`user-${user.id}`}
                          checked={selectedUsers.includes(user.id)}
                          onCheckedChange={(checked) => handleUserSelection(user.id, checked === true)}
                          disabled={selectAllUsers}
                        />
                        <label
                          htmlFor={`user-${user.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {user.firstName} {user.lastName}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="timeframe" className="text-right">
                Timeframe <span className="text-red-500">*</span>
              </Label>
              <Select value={timeframe} onValueChange={(value) => setTimeframe(value as keyof typeof timeframes)}>
                <SelectTrigger id="timeframe">
                  <SelectValue placeholder="When will the Zadachi appear?" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(timeframes).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="frequency" className="text-right">
                Frequency <span className="text-red-500">*</span>
              </Label>
              <Select
                value={frequency.toString()}
                onValueChange={(value) => setFrequency(Number.parseInt(value, 10) as keyof typeof frequencies)}
              >
                <SelectTrigger id="frequency">
                  <SelectValue placeholder="How frequent zadachi can appear" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(frequencies).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 pt-4">
              <Button className="w-full" onClick={handleSave}>
                Save
              </Button>
              <Button variant="outline" className="w-full" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
