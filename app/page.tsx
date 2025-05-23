"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useUser } from "@/contexts/user-context"
import { useTask } from "@/contexts/task-context-new"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import type { Task } from "@/contexts/task-context-new"

export default function Home() {
  const { user } = useAuth()
  const { users, loading: usersLoading } = useUser()
  const { tasks, loading: tasksLoading, updateTask } = useTask()
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const { toast } = useToast()

  if (usersLoading || tasksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please sign in to view tasks</p>
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please add family members to view tasks</p>
      </div>
    )
  }

  if (!selectedUserId && users.length > 0) {
    setSelectedUserId(users[0].id)
  }

  const selectedUser = users.find(u => u.id === selectedUserId)
  const userTasks = tasks.filter((t: Task) => t.userId === selectedUserId)

  const handleTaskComplete = async (taskId: string) => {
    try {
      await updateTask(taskId, { completed: true })
      toast({
        title: "Task completed!",
        description: "Great job! Keep up the good work.",
      })
    } catch (error) {
      console.error("Error completing task:", error)
      toast({
        title: "Error",
        description: "Failed to complete task. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Tabs value={selectedUserId || undefined} onValueChange={setSelectedUserId}>
          <TabsList>
            {users.map((user) => (
              <TabsTrigger key={user.id} value={user.id}>
                {user.name}
              </TabsTrigger>
            ))}
          </TabsList>
          {users.map((user) => (
            <TabsContent key={user.id} value={user.id}>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{user.name}'s Tasks</CardTitle>
                    <CardDescription>
                      {user.points} points earned
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {userTasks.map((task: Task) => (
                        <Card key={task.id}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium">{task.title}</h3>
                                <p className="text-sm text-muted-foreground">
                                  {task.points} points
                                </p>
                              </div>
                              <Button
                                variant={task.completed ? "secondary" : "default"}
                                onClick={() => handleTaskComplete(task.id)}
                                disabled={task.completed}
                              >
                                {task.completed ? "Completed" : "Complete"}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
