"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { categories } from "@/contexts/task-context"

interface TaskOption {
  title: string
  category: keyof typeof categories
  points: number
  allowedUsers: string[]
  timeframe: keyof typeof import("@/contexts/task-context").timeframes
  frequency: keyof typeof import("@/contexts/task-context").frequencies
}

interface ZadachiSelectionGameProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  availableTasks: TaskOption[]
  onSelectTask: (task: TaskOption) => void
  userName: string
}

export function ZadachiSelectionGame({
  open,
  onOpenChange,
  availableTasks,
  onSelectTask,
  userName,
}: ZadachiSelectionGameProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | null>(null)

  // Minimum swipe distance to trigger card change (in pixels)
  const minSwipeDistance = 50

  // Select 3 random tasks with weighted selection based on frequency and timeframe
  const selectedTasks = useMemo(() => {
    if (availableTasks.length === 0) return []

    // Create weighted array based on frequency (higher frequency = more likely to appear)
    const weightedTasks: TaskOption[] = []
    availableTasks.forEach((task) => {
      // Weight by frequency (1-10 times) and timeframe (daily gets higher weight)
      let weight = task.frequency
      if (task.timeframe === "daily") weight *= 2
      else if (task.timeframe === "weekly") weight *= 1.5

      // Add task multiple times based on weight
      for (let i = 0; i < weight; i++) {
        weightedTasks.push(task)
      }
    })

    // Shuffle and select unique tasks
    const shuffled = [...weightedTasks].sort(() => Math.random() - 0.5)
    const uniqueTasks: TaskOption[] = []
    const seenTasks = new Set<string>()

    for (const task of shuffled) {
      const taskKey = `${task.title}-${task.category}`
      if (!seenTasks.has(taskKey) && uniqueTasks.length < 3) {
        uniqueTasks.push(task)
        seenTasks.add(taskKey)
      }
    }

    return uniqueTasks
  }, [availableTasks])

  // Reset selection when modal opens
  useEffect(() => {
    if (open) {
      setCurrentCardIndex(0)
      setIsAnimating(true)
      // Remove animation class after animation completes
      const timer = setTimeout(() => setIsAnimating(false), 500)
      return () => clearTimeout(timer)
    }
  }, [open])

  // Handle infinite card navigation
  const goToNextCard = () => {
    if (selectedTasks.length === 0) return

    setSwipeDirection("left")
    setIsAnimating(true)
    setTimeout(() => {
      // Infinite cycling: go to first card if we're at the last one
      setCurrentCardIndex((prev) => (prev + 1) % selectedTasks.length)
      setSwipeDirection(null)
      setTimeout(() => setIsAnimating(false), 50)
    }, 200)
  }

  const goToPrevCard = () => {
    if (selectedTasks.length === 0) return

    setSwipeDirection("right")
    setIsAnimating(true)
    setTimeout(() => {
      // Infinite cycling: go to last card if we're at the first one
      setCurrentCardIndex((prev) => (prev - 1 + selectedTasks.length) % selectedTasks.length)
      setSwipeDirection(null)
      setTimeout(() => setIsAnimating(false), 50)
    }, 200)
  }

  // Touch event handlers for swipe
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      goToNextCard()
    } else if (isRightSwipe) {
      goToPrevCard()
    }
  }

  // Handle keyboard navigation for accessibility
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault()
      goToPrevCard()
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      goToNextCard()
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleSelectCard()
    }
  }

  const handleSelectCard = () => {
    if (selectedTasks.length > 0) {
      onSelectTask(selectedTasks[currentCardIndex])
      onOpenChange(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
  }

  // Handle clicking on card indicators to jump to specific card
  const goToCard = (index: number) => {
    if (index === currentCardIndex || isAnimating) return

    // Determine the shortest path (considering infinite cycling)
    const totalCards = selectedTasks.length
    const forward = (index - currentCardIndex + totalCards) % totalCards
    const backward = (currentCardIndex - index + totalCards) % totalCards

    if (forward <= backward) {
      setSwipeDirection("left")
    } else {
      setSwipeDirection("right")
    }

    setIsAnimating(true)
    setTimeout(() => {
      setCurrentCardIndex(index)
      setSwipeDirection(null)
      setTimeout(() => setIsAnimating(false), 50)
    }, 200)
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="w-full h-full flex flex-col relative">
        {/* Header */}
        <div className="flex justify-between items-center p-4 text-white">
          <div>
            <h2 className="text-xl font-semibold">Choose Your Zadachi</h2>
            <p className="text-sm text-gray-300">{userName}</p>
          </div>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/10" onClick={handleClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Card Swiper */}
        <div
          className="flex-1 relative overflow-hidden flex items-center justify-center px-4"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {selectedTasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-300">No available zadachi at the moment. Check back later!</p>
            </div>
          ) : (
            <div className="relative w-full max-w-sm h-[450px]">
              {selectedTasks.map((task, index) => (
                <div
                  key={`${task.title}-${task.category}-${index}`}
                  className={cn(
                    "absolute top-0 left-0 w-full h-full transition-all duration-300",
                    index === currentCardIndex
                      ? "z-10 opacity-100 scale-100"
                      : "opacity-0 scale-95 pointer-events-none",
                    swipeDirection === "left" && index === currentCardIndex && "animate-slide-left",
                    swipeDirection === "right" && index === currentCardIndex && "animate-slide-right",
                    isAnimating && index === currentCardIndex && "transition-none",
                  )}
                >
                  <Card
                    className={cn(
                      "w-full h-full flex flex-col border-2 shadow-xl cursor-pointer",
                      categories[task.category].color,
                    )}
                    onClick={handleSelectCard}
                  >
                    <div className="p-6 h-full flex flex-col">
                      {/* Category Icon */}
                      <div className="flex justify-center mb-4">
                        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl bg-white shadow-md">
                          {categories[task.category].icon}
                        </div>
                      </div>

                      {/* Category & Points */}
                      <div className="text-center mb-4">
                        <div className="text-xl font-semibold">
                          {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                        </div>
                        <div className="text-3xl font-bold">+{task.points}</div>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-gray-200 my-4"></div>

                      {/* Task Title */}
                      <div className="flex-1 flex items-center justify-center">
                        <h3 className="text-2xl font-bold text-center">{task.title}</h3>
                      </div>

                      {/* Tap to Select Hint */}
                      <div className="mt-4 flex justify-center">
                        <div className="text-sm text-gray-600 bg-white/80 px-3 py-1 rounded-full">Tap to select</div>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}

              {/* Swipe Hint Overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center pointer-events-none">
                <div className="text-white/60 text-sm">← Swipe</div>
                <div className="text-white/60 text-sm">Swipe →</div>
              </div>
            </div>
          )}
        </div>

        {/* Card Indicators */}
        {selectedTasks.length > 0 && (
          <div className="flex justify-center gap-3 py-4">
            {selectedTasks.map((_, index) => (
              <button
                key={index}
                onClick={() => goToCard(index)}
                className={cn(
                  "w-3 h-3 rounded-full transition-all duration-200",
                  index === currentCardIndex ? "bg-white scale-125" : "bg-white/30 hover:bg-white/50",
                )}
                aria-label={`Go to card ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        {selectedTasks.length > 0 && (
          <div className="p-4 flex justify-center">
            <Button className="w-48 h-12 text-lg" onClick={handleSelectCard}>
              Select
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
