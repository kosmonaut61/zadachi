"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { useUser } from "@/contexts/user-context"
import { useAuth } from "./auth-context"
import { db } from "@/lib/firebase"
import { collection, doc, getDocs, setDoc, deleteDoc, query, where, onSnapshot, addDoc, updateDoc } from "firebase/firestore"
import { useToast } from "@/components/ui/use-toast"

// Define task categories with their icons and colors
export const categories = {
  exercise: { icon: "🔥", color: "bg-orange-100" },
  water: { icon: "💧", color: "bg-blue-100" },
  cleaning: { icon: "🧹", color: "bg-green-100" },
  home: { icon: "🏠", color: "bg-red-100" },
  family: { icon: "💖", color: "bg-pink-100" },
  creativity: { icon: "⭐", color: "bg-yellow-100" },
  meditation: { icon: "👁️", color: "bg-purple-100" },
  general: { icon: "💎", color: "bg-gray-100" },
  chill: { icon: "❄️", color: "bg-teal-100" },
  outdoors: { icon: "🌿", color: "bg-green-100" },
  unknown: { icon: "❓", color: "bg-slate-100" },
}

// Define timeframe options
export const timeframes = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
}

// Define frequency options
export const frequencies = {
  1: "1 time",
  2: "2 times",
  3: "3 times",
  5: "5 times",
  10: "10 times",
}

// Define task types
export interface Task {
  id: string
  title: string
  category: string
  points: number
  userId: string
  completed: boolean
  createdAt: Date
  completedAt?: Date
  allowedUsers: string[]
  timeframe: "daily" | "weekly" | "monthly"
  frequency: number
}

// Define task usage tracking
export interface TaskUsage {
  taskId: string // This is a composite key of title+category to identify the task template
  userId: string
  lastUsedDate: string
  usageCount: number
  timeframe: keyof typeof timeframes
}

// Predefined tasks template (will be assigned to users when selected)
export const predefinedTasksTemplate: Omit<Task, "id" | "userId">[] = [
  {
    title: "Clean bedroom",
    category: "cleaning" as const,
    points: 10,
    allowedUsers: [],
    timeframe: "weekly" as const,
    frequency: 1,
    completed: false,
    createdAt: new Date()
  },
  {
    title: "Make bed",
    category: "cleaning" as const,
    points: 5,
    allowedUsers: [],
    timeframe: "daily" as const,
    frequency: 1,
    completed: false,
    createdAt: new Date()
  },
  {
    title: "Clean bathroom",
    category: "cleaning" as const,
    points: 15,
    allowedUsers: [],
    timeframe: "daily" as const,
    frequency: 1,
    completed: false,
    createdAt: new Date()
  },
  {
    title: "Draw a picture",
    category: "creativity" as const,
    points: 20,
    allowedUsers: [],
    timeframe: "weekly" as const,
    frequency: 1,
    completed: false,
    createdAt: new Date()
  },
  {
    title: "Write a story",
    category: "creativity" as const,
    points: 25,
    allowedUsers: [],
    timeframe: "weekly" as const,
    frequency: 2,
    completed: false,
    createdAt: new Date()
  },
  {
    title: "Clean kitchen",
    category: "cleaning" as const,
    points: 15,
    allowedUsers: [],
    timeframe: "weekly" as const,
    frequency: 2,
    completed: false,
    createdAt: new Date()
  },
  {
    title: "Vacuum living room",
    category: "cleaning" as const,
    points: 10,
    allowedUsers: [],
    timeframe: "weekly" as const,
    frequency: 1,
    completed: false,
    createdAt: new Date()
  },
  {
    title: "Paint a picture",
    category: "creativity" as const,
    points: 30,
    allowedUsers: [],
    timeframe: "weekly" as const,
    frequency: 2,
    completed: false,
    createdAt: new Date()
  },
  {
    title: "Clean up toys",
    category: "home" as const,
    points: 5,
    allowedUsers: [],
    timeframe: "daily" as const,
    frequency: 1,
    completed: false,
    createdAt: new Date()
  },
  {
    title: "Do jumping jacks",
    category: "exercise" as const,
    points: 15,
    allowedUsers: [],
    timeframe: "daily" as const,
    frequency: 2,
    completed: false,
    createdAt: new Date()
  },
  {
    title: "Clear your stuff from kitchen table",
    category: "cleaning" as const,
    points: 5,
    allowedUsers: [],
    timeframe: "weekly" as const,
    frequency: 1,
    completed: false,
    createdAt: new Date()
  },
  {
    title: "Clean up your room",
    category: "cleaning" as const,
    points: 10,
    allowedUsers: [],
    timeframe: "daily" as const,
    frequency: 1,
    completed: false,
    createdAt: new Date()
  },
  {
    title: "Clean up your toys",
    category: "cleaning" as const,
    points: 5,
    allowedUsers: [],
    timeframe: "daily" as const,
    frequency: 1,
    completed: false,
    createdAt: new Date()
  },
  {
    title: "Create a dance",
    category: "creativity" as const,
    points: 20,
    allowedUsers: [],
    timeframe: "weekly" as const,
    frequency: 1,
    completed: false,
    createdAt: new Date()
  },
  {
    title: "Make something with clay / dough",
    category: "creativity" as const,
    points: 15,
    allowedUsers: [],
    timeframe: "weekly" as const,
    frequency: 2,
    completed: false,
    createdAt: new Date()
  },
  {
    title: "Record a silly video",
    category: "creativity" as const,
    points: 25,
    allowedUsers: [],
    timeframe: "weekly" as const,
    frequency: 2,
    completed: false,
    createdAt: new Date()
  },
  {
    title: "Pick up trash outside",
    category: "outdoors" as const,
    points: 15,
    allowedUsers: [],
    timeframe: "weekly" as const,
    frequency: 1,
    completed: false,
    createdAt: new Date()
  },
  {
    title: "Play on trampoline",
    category: "exercise" as const,
    points: 10,
    allowedUsers: [],
    timeframe: "daily" as const,
    frequency: 1,
    completed: false,
    createdAt: new Date()
  },
  {
    title: "Pickup 10 things from kids corner",
    category: "cleaning",
    points: 600,
    allowedUsers: [],
    timeframe: "weekly",
    frequency: 1,
    completed: false
  },
  {
    title: "Write or illustrate a story",
    category: "creativity",
    points: 360,
    allowedUsers: [],
    timeframe: "weekly",
    frequency: 2,
    completed: false
  },
  {
    title: "Make a healthy snack",
    category: "home",
    points: 300,
    allowedUsers: [],
    timeframe: "daily",
    frequency: 1,
    completed: false
  },
  {
    title: "Dance for 10 minutes",
    category: "exercise",
    points: 270,
    allowedUsers: [],
    timeframe: "daily",
    frequency: 2,
    completed: false
  },
  {
    title: "Ride your bike",
    category: "outdoors",
    points: 320,
    allowedUsers: [],
    timeframe: "daily",
    frequency: 2,
    completed: false
  },
  {
    title: "Do a random act of kindness",
    category: "general",
    points: 300,
    allowedUsers: [],
    timeframe: "weekly",
    frequency: 1,
    completed: false
  },
  {
    title: "Help prepare a meal",
    category: "home",
    points: 500,
    allowedUsers: [],
    timeframe: "weekly",
    frequency: 2,
    completed: false
  },
  {
    title: "Brush Teeth",
    category: "general",
    points: 300,
    allowedUsers: [],
    timeframe: "daily",
    frequency: 2,
    completed: false
  },
  {
    title: "Clean bathroom sink",
    category: "cleaning",
    points: 750,
    allowedUsers: [],
    timeframe: "weekly",
    frequency: 2,
    completed: false
  },
  {
    title: "Play a board game",
    category: "chill",
    points: 30,
    allowedUsers: [],
    timeframe: "weekly",
    frequency: 2,
    completed: false
  },
  {
    title: "Watch TV",
    category: "chill",
    points: 15,
    allowedUsers: [],
    timeframe: "daily",
    frequency: 1,
    completed: false
  },
  {
    title: "Build something with LEGO",
    category: "creativity",
    points: 240,
    allowedUsers: [],
    timeframe: "weekly",
    frequency: 2,
    completed: false
  },
  {
    title: "Do a puzzle",
    category: "creativity",
    points: 180,
    allowedUsers: [],
    timeframe: "weekly",
    frequency: 1,
    completed: false
  },
  {
    title: "Write a letter / text to a grandparent",
    category: "family",
    points: 280,
    allowedUsers: [],
    timeframe: "weekly",
    frequency: 1,
    completed: false
  },
  {
    title: "Wipe down kitchen counters",
    category: "cleaning",
    points: 300,
    allowedUsers: [],
    timeframe: "daily",
    frequency: 1,
    completed: false
  },
  {
    title: "Dust a room",
    category: "cleaning",
    points: 450,
    allowedUsers: [],
    timeframe: "weekly",
    frequency: 3,
    completed: false
  },
  {
    title: "Vacuum a room",
    category: "cleaning",
    points: 750,
    allowedUsers: [],
    timeframe: "weekly",
    frequency: 3,
    completed: false
  },
  {
    title: "Tidy up shoes",
    category: "cleaning",
    points: 300,
    allowedUsers: [],
    timeframe: "daily",
    frequency: 1,
    completed: false
  },
  {
    title: "Put dirty clothes in hamper",
    category: "cleaning",
    points: 150,
    allowedUsers: [],
    timeframe: "daily",
    frequency: 1,
    completed: false
  },
  {
    title: "Clean up one room",
    category: "cleaning",
    points: 600,
    allowedUsers: [],
    timeframe: "daily",
    frequency: 1,
    completed: false
  },
  {
    title: "Scrub the bathtub",
    category: "cleaning",
    points: 900,
    allowedUsers: [],
    timeframe: "weekly",
    frequency: 1,
    completed: false
  },
  {
    title: "Wipe down bathroom mirror",
    category: "cleaning",
    points: 450,
    allowedUsers: [],
    timeframe: "weekly",
    frequency: 1,
    completed: false
  },
  {
    title: "Empty dishwasher",
    category: "cleaning",
    points: 600,
    allowedUsers: [],
    timeframe: "daily",
    frequency: 1,
    completed: false
  },
  {
    title: "Clean dining table",
    category: "cleaning",
    points: 450,
    allowedUsers: [],
    timeframe: "daily",
    frequency: 1,
    completed: false
  },
  {
    title: "Make a card for someone",
    category: "creativity",
    points: 240,
    allowedUsers: [],
    timeframe: "weekly",
    frequency: 1,
    completed: false
  },
  {
    title: "Design a comic strip",
    category: "creativity",
    points: 300,
    allowedUsers: [],
    timeframe: "weekly",
    frequency: 1,
    completed: false
  },
  {
    title: "Make something with just paper",
    category: "creativity",
    points: 120,
    allowedUsers: [],
    timeframe: "weekly",
    frequency: 2,
    completed: false
  },
  {
    title: "Do an activity box thing",
    category: "creativity",
    points: 120,
    allowedUsers: [],
    timeframe: "daily",
    frequency: 1,
    completed: false
  },
  {
    title: "Build a fort & clean it up",
    category: "creativity",
    points: 360,
    allowedUsers: [],
    timeframe: "weekly",
    frequency: 1,
    completed: false
  },
  {
    title: "Write a joke",
    category: "creativity",
    points: 120,
    allowedUsers: [],
    timeframe: "daily",
    frequency: 1,
    completed: false
  },
  {
    title: "Go swimming",
    category: "exercise" as const,
    points: 20,
    allowedUsers: [],
    timeframe: "weekly" as const,
    frequency: 1,
    completed: false,
    createdAt: new Date()
  },
  {
    title: "Go for a bike ride",
    category: "exercise" as const,
    points: 15,
    allowedUsers: [],
    timeframe: "weekly" as const,
    frequency: 1,
    completed: false,
    createdAt: new Date()
  },
  {
    title: "Do 10 push-ups",
    category: "exercise" as const,
    points: 5,
    allowedUsers: [],
    timeframe: "daily" as const,
    frequency: 1,
    completed: false,
    createdAt: new Date()
  },
  {
    title: "Do 20 jumping jacks",
    category: "exercise" as const,
    points: 5,
    allowedUsers: [],
    timeframe: "daily" as const,
    frequency: 1,
    completed: false,
    createdAt: new Date()
  },
  {
    title: "Do 10 sit-ups",
    category: "exercise" as const,
    points: 5,
    allowedUsers: [],
    timeframe: "daily" as const,
    frequency: 1,
    completed: false,
    createdAt: new Date()
  },
  {
    title: "Go for a walk",
    category: "exercise" as const,
    points: 10,
    allowedUsers: [],
    timeframe: "weekly" as const,
    frequency: 1,
    completed: false,
    createdAt: new Date()
  },
  {
    title: "Play catch",
    category: "exercise" as const,
    points: 10,
    allowedUsers: [],
    timeframe: "daily" as const,
    frequency: 1,
    completed: false,
    createdAt: new Date()
  },
  {
    title: "Play basketball",
    category: "exercise" as const,
    points: 15,
    allowedUsers: [],
    timeframe: "weekly" as const,
    frequency: 1,
    completed: false,
    createdAt: new Date()
  },
  {
    title: "Play soccer",
    category: "exercise" as const,
    points: 15,
    allowedUsers: [],
    timeframe: "weekly" as const,
    frequency: 1,
    completed: false,
    createdAt: new Date()
  }
]

// Add a new resetAllTasks function to the TaskContextType interface
interface TaskContextType {
  tasks: Task[]
  taskUsage: TaskUsage[]
  addTask: (task: Omit<Task, "id" | "userId" | "createdAt" | "completed">) => Promise<void>
  completeTask: (taskId: string) => number
  removeTask: (taskId: string) => Promise<void>
  getTasksByUserId: (userId: string) => Task[]
  getAvailableTasksForUser: (userId: string) => Omit<Task, "id" | "userId">[]
  createCustomTask: (
    title: string,
    category: keyof typeof categories,
    points: number,
    allowedUsers: string[],
    timeframe: keyof typeof timeframes,
    frequency: keyof typeof frequencies,
  ) => void
  updateTask: (id: string, updates: Partial<Task>) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  resetTaskUsage: () => void
  resetAllTasks: () => Promise<void>
  removeAllAssignedTasks: () => void
  clearAllZadachiTemplates: () => void
  loading: boolean
}

const TaskContext = createContext<TaskContextType | undefined>(undefined)

// Helper function to generate a task template ID
const getTaskTemplateId = (title: string, category: string) => {
  return `${title}-${category}`.toLowerCase().replace(/\s+/g, "-")
}

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [taskUsage, setTaskUsage] = useState<TaskUsage[]>([])
  const [customTasks, setCustomTasks] = useState<Omit<Task, "id" | "userId">[]>([])
  const { updateUserPoints, users } = useUser()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (!user) {
      setTasks([])
      setLoading(false)
      return
    }

    setLoading(true)
    const tasksQuery = query(
      collection(db, "tasks"),
      where("userId", "==", user.uid)
    )

    const unsubscribe = onSnapshot(
      tasksQuery,
      (snapshot) => {
        const tasksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          completedAt: doc.data().completedAt?.toDate(),
        })) as Task[]
        setTasks(tasksData)
        setLoading(false)
      },
      (error) => {
        console.error("Error fetching tasks:", error)
        toast({
          title: "Error",
          description: "Failed to fetch tasks. Please try again.",
          variant: "destructive",
        })
        setLoading(false)
      }
    )

    return () => unsubscribe()
  }, [user, toast])

  // Load task usage from localStorage on mount
  useEffect(() => {
    const savedTaskUsage = localStorage.getItem("zadachi-task-usage")
    if (savedTaskUsage) {
      try {
        setTaskUsage(JSON.parse(savedTaskUsage))
      } catch (e) {
        console.error("Failed to parse saved task usage", e)
      }
    }
  }, [])

  // Load custom tasks from localStorage on mount
  useEffect(() => {
    const savedCustomTasks = localStorage.getItem("zadachi-custom-tasks")
    if (savedCustomTasks) {
      try {
        const parsedCustomTasks = JSON.parse(savedCustomTasks)
        setCustomTasks(parsedCustomTasks)

        // Merge with predefined tasks
        // First, remove any custom tasks that might already be in the predefined list
        const filteredPredefined = predefinedTasksTemplate.filter(
          (task) =>
            !parsedCustomTasks.some(
              (customTask: Omit<Task, "id" | "userId">) =>
                customTask.title === task.title && customTask.category === task.category,
            ),
        )

        // Then add the custom tasks
        predefinedTasksTemplate.length = 0
        predefinedTasksTemplate.push(...filteredPredefined, ...parsedCustomTasks)
      } catch (e) {
        console.error("Failed to parse saved custom tasks", e)
      }
    }
  }, [])

  // Load predefined tasks from localStorage on mount
  useEffect(() => {
    const savedPredefinedTasks = localStorage.getItem("zadachi-predefined-tasks")
    if (savedPredefinedTasks) {
      try {
        const parsedPredefinedTasks = JSON.parse(savedPredefinedTasks)
        predefinedTasksTemplate.length = 0
        predefinedTasksTemplate.push(...parsedPredefinedTasks)
      } catch (e) {
        console.error("Failed to parse saved predefined tasks", e)
      }
    }
  }, [])

  // Save tasks to localStorage when they change
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("zadachi-tasks", JSON.stringify(tasks))
    }
  }, [tasks])

  // Save task usage to localStorage when it changes
  useEffect(() => {
    if (taskUsage.length > 0) {
      localStorage.setItem("zadachi-task-usage", JSON.stringify(taskUsage))
    }
  }, [taskUsage])

  // Save custom tasks to localStorage when they change
  useEffect(() => {
    if (customTasks.length > 0) {
      localStorage.setItem("zadachi-custom-tasks", JSON.stringify(customTasks))
    }
  }, [customTasks])

  // Save predefined tasks to localStorage when they change
  useEffect(() => {
    localStorage.setItem("zadachi-predefined-tasks", JSON.stringify(predefinedTasksTemplate))
  }, [predefinedTasksTemplate])

  const addTask = async (task: Omit<Task, "id" | "userId" | "createdAt" | "completed">) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be signed in to add tasks",
        variant: "destructive",
      })
      return
    }

    try {
      await addDoc(collection(db, "tasks"), {
        ...task,
        userId: user.uid,
        completed: false,
        createdAt: new Date(),
      })
      toast({
        title: "Success",
        description: "Task added successfully",
      })
    } catch (error) {
      console.error("Error adding task:", error)
      toast({
        title: "Error",
        description: "Failed to add task. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  const completeTask = useCallback(
    (taskId: string) => {
      const task = tasks.find((t) => t.id === taskId)
      if (!task) return 0

      // Update user points
      updateUserPoints(task.userId, task.points)

      // Remove task from list
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId))

      return task.points
    },
    [tasks, updateUserPoints],
  )

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

  const getTasksByUserId = useCallback(
    (userId: string) => {
      return tasks.filter((task) => task.userId === userId)
    },
    [tasks],
  )

  // Reset task usage for testing
  const resetTaskUsage = useCallback(() => {
    setTaskUsage([])
    localStorage.removeItem("zadachi-task-usage")
  }, [])

  // Add the resetAllTasks implementation in the TaskProvider
  // Add this function after the resetTaskUsage function
  const resetAllTasks = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be signed in to reset tasks",
        variant: "destructive",
      })
      return
    }

    try {
      const tasksQuery = query(
        collection(db, "tasks"),
        where("userId", "==", user.uid)
      )
      const snapshot = await getDocs(tasksQuery)
      const batch = db.batch()
      
      snapshot.docs.forEach((doc) => {
        batch.update(doc.ref, { completed: false, completedAt: null })
      })
      
      await batch.commit()
      toast({
        title: "Success",
        description: "All tasks have been reset",
      })
    } catch (error) {
      console.error("Error resetting tasks:", error)
      toast({
        title: "Error",
        description: "Failed to reset tasks. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  // Remove all assigned tasks but keep usage counts
  const removeAllAssignedTasks = useCallback(() => {
    setTasks([])
    localStorage.removeItem("zadachi-tasks")
  }, [])

  // Clear all zadachi templates (predefined tasks)
  const clearAllZadachiTemplates = useCallback(() => {
    // Clear predefined tasks
    predefinedTasksTemplate.length = 0

    // Clear custom tasks
    setCustomTasks([])
    localStorage.removeItem("zadachi-custom-tasks")
  }, [])

  const updateTask = async (id: string, updates: Partial<Task>) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be signed in to update tasks",
        variant: "destructive",
      })
      return
    }

    try {
      const taskRef = doc(db, "tasks", id)
      await updateDoc(taskRef, {
        ...updates,
        completedAt: updates.completed ? new Date() : null,
      })
      toast({
        title: "Success",
        description: "Task updated successfully",
      })
    } catch (error) {
      console.error("Error updating task:", error)
      toast({
        title: "Error",
        description: "Failed to update task. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  const updateTaskUsage = useCallback((taskId: string, usage: Omit<TaskUsage, "taskId">) => {
    setTaskUsage((prevUsage: TaskUsage[]) => {
      const existingUsage = prevUsage.find((u: TaskUsage) => u.taskId === taskId)
      if (existingUsage) {
        return prevUsage.map((u: TaskUsage) =>
          u.taskId === taskId ? { ...u, ...usage } : u
        )
      }
      return [...prevUsage, { taskId, ...usage }]
    })
  }, [])

  // Get available tasks for a user based on timeframe and frequency
  const getAvailableTasksForUser = useCallback(
    (userId: string) => {
      const now = new Date()
      console.log("Checking available tasks for user:", userId)
      console.log("Total predefined tasks:", predefinedTasksTemplate.length)
      console.log("Current task usage records:", taskUsage.length)

      return predefinedTasksTemplate.filter((template) => {
        // Check if user is allowed to access this task
        if (template.allowedUsers.length > 0 && !template.allowedUsers.includes(userId)) {
          return false
        }

        // Get task template ID
        const taskTemplateId = getTaskTemplateId(template.title, template.category)

        // Find usage for this task and user
        const usage = taskUsage.find((u) => u.taskId === taskTemplateId && u.userId === userId)

        // If no usage, this template is available
        if (!usage) {
          console.log(`Task "${template.title}" available (no usage record)`)
          return true
        }

        // Check if user has reached frequency limit for this timeframe
        if (usage.usageCount >= template.frequency) {
          // Check if timeframe has reset
          const lastUsedDate = new Date(usage.lastUsedDate)

          let timeframeReset = false
          switch (template.timeframe) {
            case "daily":
              // Reset if last used was yesterday or earlier
              timeframeReset =
                now.getDate() !== lastUsedDate.getDate() ||
                now.getMonth() !== lastUsedDate.getMonth() ||
                now.getFullYear() !== lastUsedDate.getFullYear()
              break
            case "weekly":
              // Reset if last used was in a different week
              const daysSinceLastUsed = Math.floor((now.getTime() - lastUsedDate.getTime()) / (1000 * 60 * 60 * 24))
              timeframeReset = daysSinceLastUsed >= 7
              break
            case "monthly":
              // Reset if last used was in a different month
              timeframeReset =
                now.getMonth() !== lastUsedDate.getMonth() || now.getFullYear() !== lastUsedDate.getFullYear()
              break
          }

          if (timeframeReset) {
            console.log(`Task "${template.title}" available (timeframe reset)`)
            return true
          } else {
            console.log(
              `Task "${template.title}" unavailable (frequency limit reached: ${usage.usageCount}/${template.frequency})`,
            )
            return false
          }
        }

        // User hasn't reached frequency limit
        console.log(`Task "${template.title}" available (under frequency limit)`)
        return true
      })
    },
    [taskUsage],
  )

  const createCustomTask = useCallback(
    (
      title: string,
      category: keyof typeof categories,
      points: number,
      allowedUsers: string[],
      timeframe: keyof typeof timeframes,
      frequency: keyof typeof frequencies,
    ) => {
      const newTask = {
        title,
        category,
        points,
        allowedUsers,
        timeframe,
        frequency,
        completed: false
      }

      // Check if task already exists
      const existingIndex = predefinedTasksTemplate.findIndex((t) => t.title === title && t.category === category)

      if (existingIndex >= 0) {
        // Update existing task
        predefinedTasksTemplate[existingIndex] = newTask
      } else {
        // Add to predefined tasks
        predefinedTasksTemplate.push(newTask)
      }

      // Update custom tasks state for persistence
      setCustomTasks((prevCustomTasks) => {
        const existingCustomIndex = prevCustomTasks.findIndex((t) => t.title === title && t.category === category)

        if (existingCustomIndex >= 0) {
          // Update existing custom task
          const updatedCustomTasks = [...prevCustomTasks]
          updatedCustomTasks[existingCustomIndex] = newTask
          return updatedCustomTasks
        } else {
          // Add new custom task
          return [...prevCustomTasks, newTask]
        }
      })
    },
    [],
  )

  const deleteTask = async (id: string) => {
    if (!user) {
      toast({
        title: "Error",
        description: "You must be signed in to delete tasks",
        variant: "destructive",
      })
      return
    }

    try {
      await deleteDoc(doc(db, "tasks", id))
      toast({
        title: "Success",
        description: "Task deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting task:", error)
      toast({
        title: "Error",
        description: "Failed to delete task. Please try again.",
        variant: "destructive",
      })
      throw error
    }
  }

  // Update the context provider value to include the new function
  return (
    <TaskContext.Provider
      value={{
        tasks,
        taskUsage,
        addTask,
        completeTask,
        removeTask,
        getTasksByUserId,
        getAvailableTasksForUser,
        createCustomTask,
        updateTask,
        deleteTask,
        resetTaskUsage,
        resetAllTasks,
        removeAllAssignedTasks,
        clearAllZadachiTemplates,
        loading,
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
