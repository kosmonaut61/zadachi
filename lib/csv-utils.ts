import { categories, timeframes, frequencies } from "@/contexts/task-context"
import type { User } from "@/contexts/user-context"

export interface CSVTaskRow {
  title: string
  points: number
  category: keyof typeof categories
  users: string // "All" or pipe-separated user names
  timeframe: keyof typeof timeframes
  frequency: keyof typeof frequencies
}

export function generateCSVTemplate(): string {
  const headers = ["Title", "Points", "Category", "Users", "Timeframe", "Frequency"]

  // Create one example for each category
  const exampleRows = [
    ["Go for a run", "300", "exercise", "All", "daily", "1"],
    ["Drink 8 glasses of water", "100", "water", "All", "daily", "3"],
    ["Clean bedroom", "250", "cleaning", "All", "daily", "2"],
    ["Fix something around the house", "200", "home", "All", "weekly", "2"],
    ["Call grandparents", "150", "family", "User One | User Two", "weekly", "1"],
    ["Practice piano", "300", "creativity", "User One", "weekly", "3"],
    ["Meditate for 10 minutes", "100", "meditation", "All", "daily", "5"],
    ["Complete homework assignment", "250", "general", "All", "daily", "3"],
    ["Read a book for fun", "200", "chill", "All", "daily", "2"],
    ["Play outside for 30 minutes", "150", "outdoors", "All", "daily", "3"],
  ]

  const csvContent = [headers.join(","), ...exampleRows.map((row) => row.join(","))].join("\n")

  return csvContent
}

export function downloadCSVTemplate(): void {
  const csvContent = generateCSVTemplate()
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "zadachi-template.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

export function parseCSV(csvText: string): CSVTaskRow[] {
  const lines = csvText.trim().split("\n")
  if (lines.length < 2) return []

  const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())
  const tasks: CSVTaskRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(",").map((v) => v.trim())

    if (values.length !== headers.length) continue

    const task: any = {}
    headers.forEach((header, index) => {
      task[header] = values[index]
    })

    // Validate and convert the task
    try {
      const validatedTask: CSVTaskRow = {
        title: task.title || "",
        points: Number.parseInt(task.points) || 0,
        category: task.category as keyof typeof categories,
        users: task.users || "All",
        timeframe: task.timeframe as keyof typeof timeframes,
        frequency: Number.parseInt(task.frequency) as keyof typeof frequencies,
      }

      // Validate category
      if (!categories[validatedTask.category]) {
        console.warn(`Invalid category: ${validatedTask.category}`)
        continue
      }

      // Validate timeframe
      if (!timeframes[validatedTask.timeframe]) {
        console.warn(`Invalid timeframe: ${validatedTask.timeframe}`)
        continue
      }

      // Validate frequency
      if (!frequencies[validatedTask.frequency]) {
        console.warn(`Invalid frequency: ${validatedTask.frequency}`)
        continue
      }

      if (validatedTask.title && validatedTask.points > 0) {
        tasks.push(validatedTask)
      }
    } catch (error) {
      console.warn(`Error parsing row ${i + 1}:`, error)
    }
  }

  return tasks
}

export function convertCSVTasksToZadachi(csvTasks: CSVTaskRow[], users: User[]) {
  return csvTasks.map((csvTask) => {
    let allowedUsers: string[] = []

    if (csvTask.users.toLowerCase() !== "all") {
      // Parse user names separated by pipes and convert to user IDs
      const userNames = csvTask.users.split("|").map((name) => name.trim())
      allowedUsers = userNames
        .map((name) => {
          const user = users.find(
            (u) =>
              `${u.firstName} ${u.lastName}`.toLowerCase() === name.toLowerCase() ||
              u.firstName.toLowerCase() === name.toLowerCase(),
          )
          return user?.id
        })
        .filter(Boolean) as string[]
    }

    return {
      title: csvTask.title,
      category: csvTask.category,
      points: csvTask.points,
      allowedUsers,
      timeframe: csvTask.timeframe,
      frequency: csvTask.frequency,
    }
  })
}
