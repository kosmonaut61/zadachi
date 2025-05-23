"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./auth-context"
import { db } from "@/lib/firebase"
import { collection, doc, getDocs, setDoc, deleteDoc, query, where } from "firebase/firestore"

export interface Task {
  id: string
  title: string
  category: string
  points: number
  completed: boolean
  userId: string
}

interface TaskContextType {
  tasks: Task[]
  addTask: (task: Omit<Task, "id" | "userId">) => Promise<void>
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>
  removeTask: (taskId: string) => Promise<void>
  loading: boolean
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      setTasks([])
      setLoading(false)
      return
    }

    const fetchTasks = async () => {
      try {
        const tasksQuery = query(
          collection(db, "tasks"),
          where("userId", "==", user.uid)
        )
        const querySnapshot = await getDocs(tasksQuery)
        const fetchedTasks = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Task[]
        setTasks(fetchedTasks)
      } catch (error) {
        console.error("Error fetching tasks:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [user])

  const addTask = async (task: Omit<Task, "id" | "userId">) => {
    if (!user) return

    try {
      const taskRef = doc(collection(db, "tasks"))
      const newTask: Task = {
        ...task,
        id: taskRef.id,
        userId: user.uid
      }
      await setDoc(taskRef, newTask)
      setTasks(prev => [...prev, newTask])
    } catch (error) {
      console.error("Error adding task:", error)
      throw error
    }
  }

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    if (!user) return

    try {
      const taskRef = doc(db, "tasks", taskId)
      await setDoc(taskRef, updates, { merge: true })
      setTasks(prev =>
        prev.map(task =>
          task.id === taskId ? { ...task, ...updates } : task
        )
      )
    } catch (error) {
      console.error("Error updating task:", error)
      throw error
    }
  }

  const removeTask = async (taskId: string) => {
    if (!user) return

    try {
      await deleteDoc(doc(db, "tasks", taskId))
      setTasks(prev => prev.filter(task => task.id !== taskId))
    } catch (error) {
      console.error("Error removing task:", error)
      throw error
    }
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        removeTask,
        loading
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export function useTask() {
  const context = useContext(TaskContext)
  if (context === undefined) {
    throw new Error("useTask must be used within a TaskProvider")
  }
  return context
} 