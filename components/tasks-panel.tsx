'use client'

import { useState, useRef, useEffect } from 'react'
import { Eye, EyeOff, Pin, MoreVertical, X } from 'lucide-react'
import type { PaletteColors } from '@/lib/palettes'
import { getAccessibleTextColor } from '@/lib/contrast'

export interface Task {
  id: string
  text: string
  focusEnabled: boolean
  completed: boolean
  pinned: boolean
  fields?: Record<string, string> // Dynamic fields from CSV import
}

interface TasksPanelProps {
  isOpen: boolean
  onClose: () => void
  tasks: Task[]
  onAddTask: (text: string, fields?: Record<string, string>) => void
  onToggleFocus: (id: string) => void
  onTogglePin: (id: string) => void
  onMarkComplete: (id: string) => void
  onDeleteTask: (id: string) => void
  colors: PaletteColors
}

export function TasksPanel({
  isOpen,
  onClose,
  tasks,
  onAddTask,
  onToggleFocus,
  onTogglePin,
  onMarkComplete,
  onDeleteTask,
  colors: c,
}: TasksPanelProps) {
  const [newTaskText, setNewTaskText] = useState('')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set())
  const [expandableTasks, setExpandableTasks] = useState<Set<string>>(new Set())
  const contentRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // Calculate accessible text colors for different backgrounds
  const panelTextColor = getAccessibleTextColor(c.bg, c.light, c.dark)
  const taskBgColor = `${c.face}80`
  const taskTextColor = getAccessibleTextColor(c.face, c.light, c.dark)

  // Check which tasks need expand/collapse functionality
  useEffect(() => {
    const newExpandableTasks = new Set<string>()
    tasks.forEach(task => {
      const contentEl = contentRefs.current[task.id]
      if (contentEl && contentEl.scrollHeight > 400) {
        newExpandableTasks.add(task.id)
      }
    })
    setExpandableTasks(newExpandableTasks)
  }, [tasks])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTaskText.trim()) {
      const text = newTaskText.trim()
      
      // Check if it's CSV format with headers (has comma and newline)
      if (text.includes(',') && text.includes('\n')) {
        const lines = text.split('\n').filter(line => line.trim())
        
        if (lines.length === 0) return
        
        // Parse first line as potential headers
        const firstLineValues = lines[0].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)?.map(v => v.replace(/^"|"$/g, '').trim()) || []
        
        // Check if first line has "Title" (case insensitive) - if so, it's a header row
        const titleIndex = firstLineValues.findIndex(h => h.toLowerCase() === 'title')
        
        if (titleIndex !== -1) {
          // Has headers with Title column
          const headers = firstLineValues
          const dataLines = lines.slice(1)
          
          dataLines.forEach((line) => {
            const values = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)?.map(v => v.replace(/^"|"$/g, '').trim()) || []
            const title = values[titleIndex]
            
            if (title) {
              // Build fields object with all other columns
              const fields: Record<string, string> = {}
              headers.forEach((header, idx) => {
                if (idx !== titleIndex && values[idx]) {
                  fields[header] = values[idx]
                }
              })
              
              onAddTask(title, Object.keys(fields).length > 0 ? fields : undefined)
            }
          })
        } else {
          // CSV without Title header - treat first column as titles
          lines.forEach(line => {
            const values = line.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g)?.map(v => v.replace(/^"|"$/g, '').trim()) || []
            if (values.length > 0 && values[0]) {
              onAddTask(values[0])
            }
          })
        }
      } else if (text.includes(',')) {
        // Simple comma-separated list: "Task A, Task B, Task C"
        const tasks = text.split(',').map(t => t.trim()).filter(t => t.length > 0)
        tasks.forEach(task => onAddTask(task))
      } else {
        // Newline-separated list or single task
        const tasks = text.split('\n').map(t => t.trim()).filter(t => t.length > 0)
        tasks.forEach(task => onAddTask(task))
      }
      
      setNewTaskText('')
    }
  }

  const handleDelete = (id: string) => {
    setDeleteConfirmId(id)
    setOpenMenuId(null)
  }

  const confirmDelete = (id: string) => {
    onDeleteTask(id)
    setDeleteConfirmId(null)
  }

  const activeTasks = tasks.filter(t => !t.completed)

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 backdrop-blur-sm z-40 transition-opacity duration-300"
        style={{ backgroundColor: `${c.bg}E6` }}
        onClick={onClose}
      />
      
      {/* Side Panel */}
      <div 
        className="fixed right-0 top-0 bottom-0 w-full max-w-md border-l-2 z-50 flex flex-col"
        style={{ backgroundColor: c.face, borderColor: c.accent1 }}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b-2" style={{ borderColor: `${c.accent1}30` }}>
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xl font-bold" style={{ color: panelTextColor }}>Tasks</h2>
            <button
              onClick={onClose}
              className="transition-colors"
              style={{ color: panelTextColor }}
              onMouseEnter={(e) => e.currentTarget.style.color = c.accent1}
              onMouseLeave={(e) => e.currentTarget.style.color = panelTextColor}
              aria-label="Close tasks"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Tasks List - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {activeTasks.length === 0 ? (
            <div className="text-center py-12">
              <p className="font-mono text-sm" style={{ color: `${c.dark}80` }}>
                No tasks yet. Add one below!
              </p>
            </div>
          ) : (
            activeTasks.map((task) => (
              <div
                key={task.id}
                className="border-2 transition-all duration-200 flex flex-col"
                style={{ 
                  borderColor: `${c.accent1}50`,
                  backgroundColor: 'transparent',
                  maxHeight: expandedTasks.has(task.id) ? 'none' : '460px'
                }}
              >
                {/* Task Content - scrollable if expanded, hidden overflow if collapsed */}
                <div 
                  className="flex-1 p-4"
                  style={{
                    maxHeight: expandedTasks.has(task.id) ? 'none' : '400px',
                    overflowY: expandedTasks.has(task.id) ? 'auto' : 'hidden'
                  }}
                >
                  <div 
                    ref={(el) => {
                      contentRefs.current[task.id] = el
                    }}
                    className="space-y-2"
                  >
                    <p className="font-mono text-sm font-semibold break-words" style={{ color: taskTextColor }}>
                      {task.text}
                    </p>
                    {/* Dynamic imported fields */}
                    {task.fields && Object.keys(task.fields).length > 0 && (
                      <div className="space-y-1">
                        {Object.entries(task.fields).map(([label, value]) => (
                          <div key={label} className="font-mono text-xs flex gap-2">
                            <span style={{ color: `${taskTextColor}80` }}>{label}:</span>
                            <span style={{ color: taskTextColor }}>{value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer with Actions */}
                <div 
                  className="flex items-center justify-between px-4 py-2 border-t"
                  style={{ borderColor: `${c.accent1}30` }}
                >
                  {/* Left: Expand/Collapse button (shown only if content exceeds height) */}
                  <div>
                    {expandableTasks.has(task.id) && (
                      <button
                        onClick={() => {
                          const newExpanded = new Set(expandedTasks)
                          if (expandedTasks.has(task.id)) {
                            newExpanded.delete(task.id)
                          } else {
                            newExpanded.add(task.id)
                          }
                          setExpandedTasks(newExpanded)
                        }}
                        className="text-xs font-mono transition-colors"
                        style={{ color: `${taskTextColor}80` }}
                        onMouseEnter={(e) => e.currentTarget.style.color = c.accent1}
                        onMouseLeave={(e) => e.currentTarget.style.color = `${taskTextColor}80`}
                      >
                        {expandedTasks.has(task.id) ? '▲ Collapse' : '▼ Expand'}
                      </button>
                    )}
                  </div>

                  {/* Right: Action Icons */}
                  <div className="flex items-center gap-2">
                  {/* Pin Toggle */}
                    <button
                      onClick={() => onTogglePin(task.id)}
                      className="transition-colors p-1"
                      style={{
                        color: task.pinned ? c.accent2 : `${taskTextColor}60`,
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = task.pinned ? c.accent2 : c.accent1}
                      onMouseLeave={(e) => e.currentTarget.style.color = task.pinned ? c.accent2 : `${taskTextColor}60`}
                      aria-label={task.pinned ? 'Pinned' : 'Not pinned'}
                      title={task.pinned ? 'Pinned' : 'Pin this task'}
                    >
                      <Pin size={18} className={task.pinned ? 'fill-current' : ''} />
                    </button>

                    {/* Focus Toggle */}
                    <button
                      onClick={() => onToggleFocus(task.id)}
                      className="transition-colors p-1"
                      style={{
                        color: task.focusEnabled ? c.accent1 : `${taskTextColor}60`,
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.color = c.accent1}
                      onMouseLeave={(e) => e.currentTarget.style.color = task.focusEnabled ? c.accent1 : `${taskTextColor}60`}
                      aria-label={task.focusEnabled ? 'Focus enabled' : 'Focus disabled'}
                      title={task.focusEnabled ? 'Focus enabled' : 'Focus disabled'}
                    >
                      {task.focusEnabled ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>

                    {/* Menu Button */}
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === task.id ? null : task.id)}
                        className="transition-colors p-1"
                        style={{ color: taskTextColor }}
                        onMouseEnter={(e) => e.currentTarget.style.color = c.accent1}
                        onMouseLeave={(e) => e.currentTarget.style.color = taskTextColor}
                        aria-label="Task options"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {/* Dropdown Menu */}
                      {openMenuId === task.id && (
                        <div
                          className="absolute right-0 top-full mt-1 w-40 border-2 shadow-lg z-10"
                          style={{ 
                            backgroundColor: c.face,
                            borderColor: c.accent1
                          }}
                        >
                          <button
                            onClick={() => {
                              onMarkComplete(task.id)
                              setOpenMenuId(null)
                            }}
                            className="w-full px-4 py-2 text-left font-mono text-sm transition-colors"
                            style={{ color: taskTextColor }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = `${c.accent1}20`
                              e.currentTarget.style.color = c.accent1
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent'
                              e.currentTarget.style.color = taskTextColor
                            }}
                          >
                            Mark Complete
                          </button>
                          <button
                            onClick={() => handleDelete(task.id)}
                            className="w-full px-4 py-2 text-left font-mono text-sm transition-colors border-t"
                            style={{ 
                              color: taskTextColor,
                              borderColor: `${c.accent1}30`
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = `${c.accent1}20`
                              e.currentTarget.style.color = c.accent1
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent'
                              e.currentTarget.style.color = taskTextColor
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sticky Footer - Add Task */}
        <div 
          className="p-6 pt-4 border-t-2"
          style={{ borderColor: c.accent1 }}
        >
          <form onSubmit={handleSubmit} className="flex gap-2">
            <textarea
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="Paste CSV or add tasks (Title required)..."
              className="flex-1 px-4 py-3 font-mono text-sm border-2 outline-none transition-colors resize-none"
              rows={2}
              style={{
                backgroundColor: c.light,
                borderColor: `${c.accent1}50`,
                color: c.dark,
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = c.accent1}
              onBlur={(e) => e.currentTarget.style.borderColor = `${c.accent1}50`}
              onKeyDown={(e) => {
                // Submit on Enter (without Shift)
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            <button
              type="submit"
              className="px-6 py-3 font-mono text-sm font-bold transition-opacity disabled:opacity-50"
              style={{
                backgroundColor: c.accent1,
                color: c.dark,
              }}
              disabled={!newTaskText.trim()}
            >
              Add
            </button>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <>
          <div 
            className="fixed inset-0 z-50 backdrop-blur-sm"
            style={{ backgroundColor: `${c.bg}CC` }}
            onClick={() => setDeleteConfirmId(null)}
          />
          <div 
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm p-6 border-2"
            style={{ 
              backgroundColor: c.face,
              borderColor: c.accent1
            }}
          >
            <h3 className="font-mono text-lg font-bold mb-3" style={{ color: c.dark }}>
              Delete Task?
            </h3>
            <p className="font-mono text-sm mb-6" style={{ color: `${c.dark}80` }}>
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-3 font-mono text-sm font-bold border-2 transition-colors"
                style={{
                  borderColor: c.accent1,
                  color: c.dark,
                  backgroundColor: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = `${c.accent1}20`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => confirmDelete(deleteConfirmId)}
                className="flex-1 py-3 font-mono text-sm font-bold"
                style={{
                  backgroundColor: c.accent1,
                  color: c.dark,
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
