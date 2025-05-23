"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"
import { db } from "@/lib/firebase"
import { collection, doc, getDocs, setDoc, deleteDoc, query, where } from "firebase/firestore"

// Define user type
export interface User {
  id: string
  name: string
  points: number
  parentId: string
}

interface UserContextType {
  users: User[]
  addUser: (user: Omit<User, "id">) => Promise<void>
  updateUser: (userId: string, updates: Partial<User>) => Promise<void>
  removeUser: (userId: string) => Promise<void>
  updateUserPoints: (userId: string, points: number) => Promise<void>
  loading: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      setUsers([])
      setLoading(false)
      return
    }

    const fetchUsers = async () => {
      try {
        const usersQuery = query(
          collection(db, "users"),
          where("parentId", "==", user.uid)
        )
        const querySnapshot = await getDocs(usersQuery)
        const fetchedUsers = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as User[]
        setUsers(fetchedUsers)
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [user])

  const addUser = async (userData: Omit<User, "id">) => {
    if (!user) return

    try {
      const userRef = doc(collection(db, "users"))
      const newUser: User = {
        ...userData,
        id: userRef.id
      }
      await setDoc(userRef, newUser)
      setUsers(prev => [...prev, newUser])
    } catch (error) {
      console.error("Error adding user:", error)
      throw error
    }
  }

  const updateUser = async (userId: string, updates: Partial<User>) => {
    if (!user) return

    try {
      const userRef = doc(db, "users", userId)
      await setDoc(userRef, updates, { merge: true })
      setUsers(prev =>
        prev.map(u =>
          u.id === userId ? { ...u, ...updates } : u
        )
      )
    } catch (error) {
      console.error("Error updating user:", error)
      throw error
    }
  }

  const removeUser = async (userId: string) => {
    if (!user) return

    try {
      await deleteDoc(doc(db, "users", userId))
      setUsers(prev => prev.filter(u => u.id !== userId))
    } catch (error) {
      console.error("Error removing user:", error)
      throw error
    }
  }

  const updateUserPoints = async (userId: string, points: number) => {
    if (!user) return

    try {
      const userRef = doc(db, "users", userId)
      await setDoc(userRef, { points }, { merge: true })
      setUsers(prev =>
        prev.map(u =>
          u.id === userId ? { ...u, points } : u
        )
      )
    } catch (error) {
      console.error("Error updating user points:", error)
      throw error
    }
  }

  return (
    <UserContext.Provider
      value={{
        users,
        addUser,
        updateUser,
        removeUser,
        updateUserPoints,
        loading
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
