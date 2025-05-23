"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { MoreHorizontal, Plus } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Navigation } from "@/components/navigation"
import { useUser, type User } from "@/contexts/user-context"
import { UserDrawer } from "@/components/user-drawer"

export default function ManageUsers() {
  const { users, deleteUser } = useUser()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const handleCreateUser = useCallback(() => {
    setEditingUser(null)
    setIsDrawerOpen(true)
  }, [])

  const handleEditUser = useCallback((user: User) => {
    setEditingUser(user)
    setIsDrawerOpen(true)
  }, [])

  const handleDeleteUser = useCallback(
    (userId: string) => {
      deleteUser(userId)
    },
    [deleteUser],
  )

  const handleDrawerClose = useCallback((open: boolean) => {
    setIsDrawerOpen(open)
    if (!open) {
      // Reset editing user when drawer closes
      setEditingUser(null)
    }
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Main Content */}
      <main className="flex-1 p-4">
        <div className="space-y-4">
          {users.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">No Users</h3>
              <p className="text-sm text-gray-500 max-w-xs mx-auto">
                Use the Create New button in the bottom right hand corner.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {users.map((user) => (
                <Card key={user.id}>
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">Total Points • {user.totalPoints}</p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-5 w-5" />
                          <span className="sr-only">More options</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEditUser(user)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={users.length <= 1}
                          className="text-red-500 focus:text-red-500"
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer with Add Button */}
      <footer className="p-4 flex justify-between items-center border-t">
        <Button variant="outline" className="flex items-center gap-1">
          All Users
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-chevron-up"
          >
            <path d="m18 15-6-6-6 6" />
          </svg>
        </Button>
        <Button size="icon" className="rounded-full h-12 w-12 shadow-lg" onClick={handleCreateUser}>
          <Plus className="h-6 w-6" />
          <span className="sr-only">Add new user</span>
        </Button>
      </footer>

      {/* User Drawer */}
      <UserDrawer open={isDrawerOpen} onOpenChange={handleDrawerClose} editingUser={editingUser} />
    </div>
  )
}
