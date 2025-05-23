"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { useUser, type User } from "@/contexts/user-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface UserDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  editingUser?: User | null
}

export function UserDrawer({ open, onOpenChange, editingUser }: UserDrawerProps) {
  const { addUser, updateUser } = useUser()

  // Form states
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [startingPoints, setStartingPoints] = useState("100")
  const [totalPoints, setTotalPoints] = useState("")

  const isEditing = !!editingUser

  // Reset form when drawer opens/closes or editing user changes
  useEffect(() => {
    if (open && editingUser) {
      setFirstName(editingUser.firstName)
      setLastName(editingUser.lastName)
      setTotalPoints(editingUser.totalPoints.toString())
    } else if (open && !editingUser) {
      setFirstName("")
      setLastName("")
      setStartingPoints("100")
      setTotalPoints("")
    } else if (!open) {
      // Reset form when drawer closes
      setFirstName("")
      setLastName("")
      setStartingPoints("100")
      setTotalPoints("")
    }
  }, [open, editingUser])

  const handleSave = () => {
    if (!firstName || !lastName) return

    if (isEditing && editingUser) {
      updateUser(editingUser.id, {
        firstName,
        lastName,
        totalPoints: Number.parseInt(totalPoints) || 0,
      })
    } else {
      addUser(firstName, lastName, Number.parseInt(startingPoints) || 0)
    }

    // Close the drawer
    onOpenChange(false)
  }

  const handleCancel = () => {
    // Close the drawer
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="border-b p-4">
          <SheetTitle>{isEditing ? "Edit User" : "Create New User"}</SheetTitle>
          <SheetDescription>
            {isEditing ? "Update user information and points." : "Add a new user to your family."}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-auto p-4">
          <div className="space-y-4">
            <div>
              <Label htmlFor="firstName" className="text-right">
                First <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                required
              />
            </div>

            <div>
              <Label htmlFor="lastName" className="text-right">
                Last <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                required
              />
            </div>

            {isEditing ? (
              <div>
                <Label htmlFor="totalPoints" className="text-right">
                  Total Points <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="totalPoints"
                  type="number"
                  value={totalPoints}
                  onChange={(e) => setTotalPoints(e.target.value)}
                  placeholder="Total points"
                  min="0"
                />
              </div>
            ) : (
              <div>
                <Label htmlFor="startingPoints" className="text-right">
                  Starting Points <span className="text-red-500">*</span>
                </Label>
                <Select value={startingPoints} onValueChange={setStartingPoints}>
                  <SelectTrigger id="startingPoints">
                    <SelectValue placeholder="Select starting points" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">+0</SelectItem>
                    <SelectItem value="100">+100</SelectItem>
                    <SelectItem value="250">+250</SelectItem>
                    <SelectItem value="500">+500</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

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
