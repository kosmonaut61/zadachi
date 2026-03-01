'use client'

import { useState, useEffect } from 'react'
import type { Task } from './tasks-panel'
import type { ColorScheme } from '@/lib/palettes'
import { getAccessibleTextColor } from '@/lib/contrast'

interface TaskMarqueeProps {
  tasks: Task[]
  colors: ColorScheme
  isActive: boolean
  onTogglePin: (id: string) => void
}

export function TaskMarquee({ tasks, colors: c, isActive, onTogglePin }: TaskMarqueeProps) {
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  const focusTasks = tasks.filter(task => task.focusEnabled && !task.completed)
  const pinnedTask = tasks.find(task => task.pinned && !task.completed)
  const tooltipTextColor = getAccessibleTextColor(c.face, c.light, c.dark)

  // Display pinned task if available, otherwise cycle through focus tasks during work phase
  const displayTask = pinnedTask || (isActive && focusTasks.length > 0 ? focusTasks[currentTaskIndex] : null)
  const isPinned = !!pinnedTask

  useEffect(() => {
    // If task is pinned, always show it
    if (pinnedTask) {
      setIsAnimating(true)
      return
    }

    if (!isActive || focusTasks.length === 0) return

    // Start animation after mount
    setIsAnimating(true)

    // If there are multiple tasks, cycle through them
    if (focusTasks.length > 1) {
      const interval = setInterval(() => {
        setIsAnimating(false)
        setTimeout(() => {
          setCurrentTaskIndex((prev) => (prev + 1) % focusTasks.length)
          setTimeout(() => {
            setIsAnimating(true)
          }, 50) // Brief delay before fading in next task
        }, 500) // Wait for fade-out to complete
      }, 8000) // Show each task for 8 seconds

      return () => clearInterval(interval)
    }
  }, [isActive, focusTasks.length, currentTaskIndex])

  if (!displayTask) return null

  return (
    <div 
      className="fixed top-6 left-0 right-0 z-10 flex justify-center"
      style={{ 
        height: '40px',
      }}
    >
      <div
        className={`relative transition-opacity ease-in-out ${
          isAnimating ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          transitionDuration: '500ms',
          maxWidth: '60%',
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {/* Task text with optional pinned badge background */}
        <div
          className="font-mono text-base md:text-lg font-medium text-center px-8 whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer relative"
          style={{ 
            color: c.accent1,
            textShadow: `0 0 10px ${c.accent1}30`,
          }}
        >
          {isPinned && (
            <div 
              className="absolute inset-0 rounded"
              style={{ 
                backgroundColor: `${c.accent1}1A`, // 10% opacity
              }}
            />
          )}
          <span className="relative z-10">{displayTask.text}</span>
        </div>

        {/* Tooltip Card */}
        {showTooltip && displayTask && (
          <div
            className="absolute top-full pt-2 left-1/2 -translate-x-1/2 min-w-[300px] max-w-[400px]"
          >
            <div 
              className="border-2 shadow-lg flex flex-col"
              style={{
                backgroundColor: c.face,
                borderColor: c.accent1,
                maxHeight: '460px',
              }}
            >
            {/* Scrollable Content */}
            <div className="overflow-y-auto p-4" style={{ maxHeight: '400px' }}>
              {/* Task Title */}
              <div className="mb-3">
                <p className="font-mono text-sm font-semibold break-words" style={{ color: tooltipTextColor }}>
                  {displayTask.text}
                </p>
              </div>

              {/* Dynamic Fields */}
              {displayTask.fields && Object.keys(displayTask.fields).length > 0 && (
                <div className="space-y-2 border-t pt-3" style={{ borderColor: `${c.accent1}30` }}>
                  {Object.entries(displayTask.fields).map(([label, value]) => (
                    <div key={label} className="font-mono text-xs flex flex-col gap-1">
                      <span className="font-semibold" style={{ color: `${tooltipTextColor}80` }}>{label}:</span>
                      <span style={{ color: tooltipTextColor }}>{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

              {/* Pin/Unpin Button - Fixed at bottom */}
              <button
                onClick={() => onTogglePin(displayTask.id)}
                className="w-full py-2 text-xs font-mono font-medium border-t transition-colors flex-shrink-0"
                style={{
                  borderColor: `${c.accent1}30`,
                  color: tooltipTextColor,
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = c.accent2}
                onMouseLeave={(e) => e.currentTarget.style.color = tooltipTextColor}
              >
                {displayTask.pinned ? 'Tap to unpin' : 'Tap to pin'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
