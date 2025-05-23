"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"

// Define user type
export interface User {
  id: string
  firstName: string
  lastName: string
  totalPoints: number
}

// Define initial users
const initialUsers: User[] = [
  {
    id: "user1",
    firstName: "User",
    lastName: "One",
    totalPoints: 0,
  },
  {
    id: "user2",
    firstName: "User",
    lastName: "Two",
    totalPoints: 0,
  },
]

interface UserContextType {
  users: User[]
  currentUser: User
  setCurrentUser: (user: User) => void
  addUser: (firstName: string, lastName: string, startingPoints: number) => void
  updateUser: (userId: string, updates: Partial<User>) => void
  deleteUser: (userId: string) => void
  updateUserPoints: (userId: string, points: number) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState<User[]>(initialUsers)
  const [currentUser, setCurrentUser] = useState<User>(initialUsers[0])

  // Load users from localStorage on mount
  useEffect(() => {
    const savedUsers = localStorage.getItem("zadachi-users")
    if (savedUsers) {
      try {
        const parsedUsers = JSON.parse(savedUsers)
        setUsers(parsedUsers)

        // Set current user to the first user or keep the default
        if (parsedUsers.length > 0) {
          const savedCurrentUserId = localStorage.getItem("zadachi-current-user-id")
          if (savedCurrentUserId) {
            const savedCurrentUser = parsedUsers.find((u: User) => u.id === savedCurrentUserId)
            if (savedCurrentUser) {
              setCurrentUser(savedCurrentUser)
            } else {
              setCurrentUser(parsedUsers[0])
            }
          } else {
            setCurrentUser(parsedUsers[0])
          }
        }
      } catch (e) {
        console.error("Failed to parse saved users", e)
      }
    }
  }, [])

  // Save users to localStorage when they change
  useEffect(() => {
    localStorage.setItem("zadachi-users", JSON.stringify(users))
  }, [users])

  // Save current user ID to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("zadachi-current-user-id", currentUser.id)
  }, [currentUser.id])

  const addUser = useCallback((firstName: string, lastName: string, startingPoints: number) => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      firstName,
      lastName,
      totalPoints: startingPoints,
    }
    setUsers((prevUsers) => [...prevUsers, newUser])
  }, [])

  const updateUser = useCallback(
    (userId: string, updates: Partial<User>) => {
      setUsers((prevUsers) => {
        const updatedUsers = prevUsers.map((user) => {
          if (user.id === userId) {
            return { ...user, ...updates }
          }
          return user
        })

        return updatedUsers
      })

      // Update current user separately if it's the one being updated
      if (currentUser.id === userId) {
        setCurrentUser((prevCurrentUser) => ({
          ...prevCurrentUser,
          ...updates,
        }))
      }
    },
    [currentUser.id],
  )

  const updateUserPoints = useCallback(
    (userId: string, points: number) => {
      setUsers((prevUsers) => {
        const updatedUsers = prevUsers.map((user) => {
          if (user.id === userId) {
            return { ...user, totalPoints: user.totalPoints + points }
          }
          return user
        })

        return updatedUsers
      })

      // Update current user separately if it's the one being updated
      if (currentUser.id === userId) {
        setCurrentUser((prevCurrentUser) => ({
          ...prevCurrentUser,
          totalPoints: prevCurrentUser.totalPoints + points,
        }))
      }
    },
    [currentUser.id],
  )

  const deleteUser = useCallback(
    (userId: string) => {
      // Don't delete if it's the last user
      setUsers((prevUsers) => {
        if (prevUsers.length <= 1) return prevUsers

        const newUsers = prevUsers.filter((user) => user.id !== userId)

        // If current user is deleted, switch to first available user
        if (currentUser.id === userId) {
          setCurrentUser(newUsers[0])
        }

        return newUsers
      })
    },
    [currentUser.id],
  )

  return (
    <UserContext.Provider
      value={{
        users,
        currentUser,
        setCurrentUser,
        addUser,
        updateUser,
        deleteUser,
        updateUserPoints,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
