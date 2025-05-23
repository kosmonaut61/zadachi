"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { useUser } from "@/contexts/user-context"

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
  category: keyof typeof categories
  points: number
  userId: string
  allowedUsers: string[] // IDs of users who can access this task
  timeframe: keyof typeof timeframes
  frequency: keyof typeof frequencies
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
  // Original tasks
  {
    title: "Pick up 5 items off of floor.",
    category: "cleaning",
    points: 250,
    allowedUsers: [], // Empty array means all users
    timeframe: "daily",
    frequency: 3,
  },
  {
    title: "Play outside for 15 minutes.",
    category: "outdoors",
    points: 250,
    allowedUsers: [], // Empty array means all users
    timeframe: "daily",
    frequency: 3,
  },
  {
    title: "Practice guitar for 15 minutes.",
    category: "creativity",
    points: 250,
    allowedUsers: [], // Empty array means all users
    timeframe: "weekly",
    frequency: 3,
  },

  // New tasks - Cleaning
  {
    title: "Clean bathroom sink.",
    category: "cleaning",
    points: 200,
    allowedUsers: [],
    timeframe: "daily",
    frequency: 2,
  },
  {
    title: "Vacuum one room.",
    category: "cleaning",
    points: 300,
    allowedUsers: [],
    timeframe: "daily",
    frequency: 1,
  },
  {
    title: "Make your bed.",
    category: "cleaning",
    points: 100,
    allowedUsers: [],
    timeframe: "daily",
    frequency: 5,
  },

  // Exercise
  {
    title: "Do 10 jumping jacks.",
    category: "exercise",
    points: 150,
    allowedUsers: [],
    timeframe: "daily",
    frequency: 3,
  },
  {
    title: "Stretch for 5 minutes.",
    category: "exercise",
    points: 200,
    allowedUsers: [],
    timeframe: "daily",
    frequency: 3,
  },

  // Water
  {
    title: "Drink a glass of water.",
    category: "water",
    points: 100,
    allowedUsers: [],
    timeframe: "daily",
    frequency: 5,
  },

  // Home
  {
    title: "Help set the table.",
    category: "home",
    points: 150,
    allowedUsers: [],
    timeframe: "daily",
    frequency: 3,
  },
  {
    title: "Take out the trash.",
    category: "home",
    points: 200,
    allowedUsers: [],
    timeframe: "weekly",
    frequency: 2,
  },

  // Family
  {
    title: "Help a family member.",
    category: "family",
    points: 250,
    allowedUsers: [],
    timeframe: "daily",
    frequency: 3,
  },

  // Creativity
  {
    title: "Draw a picture.",
    category: "creativity",
    points: 200,
    allowedUsers: [],
    timeframe: "daily",
    frequency: 2,
  },

  // Meditation
  {
    title: "Take 5 deep breaths.",
    category: "meditation",
    points: 100,
    allowedUsers: [],
    timeframe: "daily",
    frequency: 5,
  },

  // General
  {
    title: "Complete homework assignment.",
    category: "general",
    points: 300,
    allowedUsers: [],
    timeframe: "daily",
    frequency: 2,
  },

  // Chill
  {
    title: "Read for 15 minutes.",
    category: "chill",
    points: 200,
    allowedUsers: [],
    timeframe: "daily",
    frequency: 3,
  },

  // Outdoors
  {
    title: "Water the plants.",
    category: "outdoors",
    points: 150,
    allowedUsers: [],
    timeframe: "daily",
    frequency: 2,
  },
]

// Add a new resetAllTasks function to the TaskContextType interface
interface TaskContextType {
  tasks: Task[]
  taskUsage: TaskUsage[]
  addTask: (task: Omit<Task, "id">) => void
  completeTask: (taskId: string) => number
  removeTask: (taskId: string) => void
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
  updateTask: (taskId: string, updates: Partial<Omit<Task, "id" | "userId">>) => void
  deleteTask: (taskId: string) => void
  resetTaskUsage: () => void
  resetAllTasks: () => void
  removeAllAssignedTasks: () => void
  clearAllZadachiTemplates: () => void
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

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("zadachi-tasks")
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks))
      } catch (e) {
        console.error("Failed to parse saved tasks", e)
      }
    }
  }, [])

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

  const addTask = useCallback((task: Omit<Task, "id">) => {
    const newTask: Task = {
      ...task,
      id: `task-${Date.now()}`,
    }
    setTasks((prevTasks) => [...prevTasks, newTask])

    // Update task usage
    const taskTemplateId = getTaskTemplateId(task.title, task.category)
    const now = new Date()

    setTaskUsage((prevUsage) => {
      // Check if we already have usage for this task and user
      const existingUsageIndex = prevUsage.findIndex((u) => u.taskId === taskTemplateId && u.userId === task.userId)

      if (existingUsageIndex >= 0) {
        // Update existing usage
        const updatedUsage = [...prevUsage]
        updatedUsage[existingUsageIndex] = {
          ...updatedUsage[existingUsageIndex],
          lastUsedDate: now.toISOString(),
          usageCount: updatedUsage[existingUsageIndex].usageCount + 1,
          timeframe: task.timeframe, // Update timeframe in case it changed
        }
        return updatedUsage
      } else {
        // Add new usage
        return [
          ...prevUsage,
          {
            taskId: taskTemplateId,
            userId: task.userId,
            lastUsedDate: now.toISOString(),
            usageCount: 1,
            timeframe: task.timeframe,
          },
        ]
      }
    })
  }, [])

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

  const removeTask = useCallback((taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
  }, [])

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
  const resetAllTasks = useCallback(() => {
    // Clear all tasks
    setTasks([])
    localStorage.removeItem("zadachi-tasks")

    // Clear all task usage
    setTaskUsage([])
    localStorage.removeItem("zadachi-task-usage")
  }, [])

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

  const updateTask = useCallback((taskId: string, updates: Partial<Omit<Task, "id" | "userId">>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, ...updates }
        }
        return task
      }),
    )
  }, [])

  const deleteTask = useCallback(
    (taskId: string) => {
      // Remove from predefined tasks if it exists
      const taskToDelete = tasks.find((t) => t.id === taskId)
      if (taskToDelete) {
        const index = predefinedTasksTemplate.findIndex(
          (t) => t.title === taskToDelete.title && t.category === taskToDelete.category,
        )
        if (index !== -1) {
          predefinedTasksTemplate.splice(index, 1)

          // Also remove from custom tasks
          setCustomTasks((prevCustomTasks) =>
            prevCustomTasks.filter((t) => !(t.title === taskToDelete.title && t.category === taskToDelete.category)),
          )
        }
      }

      // Remove from tasks
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId))
    },
    [tasks],
  )

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
