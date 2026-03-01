'use client'

import { useEffect, useState, useRef } from 'react'
import { CheckSquare, Settings } from 'lucide-react'
import { ClockFaceRenderer, type ClockFace } from '@/components/clock-faces'
import { SettingsPanel } from '@/components/settings-panel'
import { TasksPanel, type Task } from '@/components/tasks-panel'
import { TaskMarquee } from '@/components/task-marquee'
import { Confetti } from '@/components/confetti'
import { Onboarding } from '@/components/onboarding'
import { palettes, type Palette } from '@/lib/palettes'

type FocusPhase = 'idle' | 'work' | 'shortBreak' | 'longBreak'

export default function Page() {
  const [time, setTime] = useState<Date | null>(null)
  const [showUI, setShowUI] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showTasks, setShowTasks] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [selectedFace, setSelectedFace] = useState<ClockFace>('Blind')
  const [selectedPalette, setSelectedPalette] = useState<Palette>('halio')
  const [tasks, setTasks] = useState<Task[]>([])
  const hideTimeoutRef = useRef<NodeJS.Timeout>()
  
  // Focus state
  const [focusPhase, setFocusPhase] = useState<FocusPhase>('idle')
  const [focusTimeLeft, setFocusTimeLeft] = useState(0)
  const [focusSessionCount, setFocusSessionCount] = useState(0)
  const [showPhaseTransition, setShowPhaseTransition] = useState(false)
  const [nextPhase, setNextPhase] = useState<FocusPhase>('idle')
  const focusTimerRef = useRef<NodeJS.Timeout>()
  
  // Focus settings
  const [workDuration, setWorkDuration] = useState(25)
  const [shortBreakDuration, setShortBreakDuration] = useState(5)
  const [longBreakDuration, setLongBreakDuration] = useState(15)
  const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(4)

  const c = palettes[selectedPalette]

  useEffect(() => {
    setTime(new Date())
    const timer = setInterval(() => setTime(new Date()), 1000)
    
    // Check if user has completed onboarding
    const hasCompletedOnboarding = localStorage.getItem('halio-onboarding-complete')
    if (!hasCompletedOnboarding) {
      setShowOnboarding(true)
    }
    
    return () => clearInterval(timer)
  }, [])

  const handleUserActivity = () => {
    setShowUI(true)
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    hideTimeoutRef.current = setTimeout(() => setShowUI(false), 3000)
  }

  const handleOnboardingComplete = (settings: {
    palette: Palette
    face: ClockFace
    workDuration: number
    shortBreakDuration: number
    longBreakDuration: number
    sessionsBeforeLongBreak: number
  }) => {
    setSelectedPalette(settings.palette)
    setSelectedFace(settings.face)
    setWorkDuration(settings.workDuration)
    setShortBreakDuration(settings.shortBreakDuration)
    setLongBreakDuration(settings.longBreakDuration)
    setSessionsBeforeLongBreak(settings.sessionsBeforeLongBreak)
    localStorage.setItem('halio-onboarding-complete', 'true')
    setShowOnboarding(false)
  }

  useEffect(() => {
    return () => { if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current) }
  }, [])
  
  useEffect(() => {
    if (focusPhase === 'idle' || focusTimeLeft <= 0 || showPhaseTransition) return
    focusTimerRef.current = setInterval(() => {
      setFocusTimeLeft((prev) => {
        if (prev <= 1) { preparePhaseTransition(); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => { if (focusTimerRef.current) clearInterval(focusTimerRef.current) }
  }, [focusPhase, focusTimeLeft, showPhaseTransition])
  
  const startFocus = () => {
    setFocusPhase('work')
    setFocusTimeLeft(workDuration * 60)
    setFocusSessionCount(0)
    setShowPhaseTransition(false)
  }
  
  const preparePhaseTransition = () => {
    let upcomingPhase: FocusPhase = 'idle'
    if (focusPhase === 'work') {
      upcomingPhase = (focusSessionCount + 1) >= sessionsBeforeLongBreak ? 'longBreak' : 'shortBreak'
    } else {
      upcomingPhase = 'work'
    }
    setNextPhase(upcomingPhase)
    setShowPhaseTransition(true)
  }
  
  const confirmPhaseTransition = () => {
    if (focusPhase === 'work') {
      const newCount = focusSessionCount + 1
      setFocusSessionCount(newCount)
      if (newCount >= sessionsBeforeLongBreak) {
        setFocusPhase('longBreak')
        setFocusTimeLeft(longBreakDuration * 60)
        setFocusSessionCount(0)
      } else {
        setFocusPhase('shortBreak')
        setFocusTimeLeft(shortBreakDuration * 60)
      }
    } else {
      setFocusPhase('work')
      setFocusTimeLeft(workDuration * 60)
    }
    setShowPhaseTransition(false)
  }
  
  const stopFocus = () => {
    setFocusPhase('idle')
    setFocusTimeLeft(0)
    setFocusSessionCount(0)
    if (focusTimerRef.current) clearInterval(focusTimerRef.current)
  }
  
  const formatFocusTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  const getFocusLabel = () => {
    switch (focusPhase) {
      case 'work': return 'Focus Time'
      case 'shortBreak': return 'Short Break'
      case 'longBreak': return 'Long Break'
      default: return ''
    }
  }

  if (!time) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: c.bg }}>
        <div className="text-2xl font-mono" style={{ color: c.accent1 }}>Loading...</div>
      </div>
    )
  }

  const hours = time.getHours()
  const minutes = time.getMinutes()
  const seconds = time.getSeconds()
  const hourAngle = (hours % 24) * 15 + minutes * 0.25 + 90
  const minuteAngle = minutes * 6 + seconds * 0.1 + 90
  const secondAngle = seconds * 6 + 90

  const getFocusProgress = () => {
    if (focusPhase === 'idle' || focusTimeLeft === 0) return 0
    let total = 0
    if (focusPhase === 'work') total = workDuration * 60
    else if (focusPhase === 'shortBreak') total = shortBreakDuration * 60
    else if (focusPhase === 'longBreak') total = longBreakDuration * 60
    return (total - focusTimeLeft) / total
  }

  // Task handlers
  const handleAddTask = (text: string, fields?: Record<string, string>) => {
    const newTask: Task = {
      id: `${Date.now()}-${Math.random()}`,
      text,
      focusEnabled: true,
      completed: false,
      pinned: false,
      fields,
    }
    setTasks(prevTasks => [...prevTasks, newTask])
  }

  const handleToggleFocus = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, focusEnabled: !task.focusEnabled } : task
    ))
  }

  const handleTogglePin = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        // Toggle pin for this task
        const newPinState = !task.pinned
        // If pinning, ensure focus is enabled
        return { ...task, pinned: newPinState, focusEnabled: newPinState ? true : task.focusEnabled }
      } else {
        // Unpin all other tasks (radio behavior - only one can be pinned)
        return { ...task, pinned: false }
      }
    }))
  }

  const handleMarkComplete = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative cursor-pointer"
      style={{ backgroundColor: c.bg }}
      onClick={handleUserActivity}
      onMouseMove={handleUserActivity}
      onTouchStart={handleUserActivity}
    >
      {/* Top Left - Digital Time */}
      <div className={`absolute top-8 left-8 transition-opacity duration-500 z-20 ${showUI ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="font-mono text-sm tracking-wide tabular-nums" style={{ color: c.light }}>
          {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </div>
      </div>

      {/* Top Right - Tasks & Settings Buttons */}
      <div className={`absolute top-8 right-8 flex gap-4 transition-opacity duration-500 z-20 ${showUI ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <button 
          onClick={(e) => {
            e.stopPropagation()
            setShowTasks(true)
            setShowUI(false)
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
          }}
          className="transition-colors"
          style={{ color: c.light }}
          onMouseEnter={(e) => e.currentTarget.style.color = c.accent1}
          onMouseLeave={(e) => e.currentTarget.style.color = c.light}
          aria-label="Open tasks"
        >
          <CheckSquare size={24} />
        </button>
        <button 
          onClick={(e) => {
            e.stopPropagation()
            setShowSettings(true)
            setShowUI(false)
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
          }}
          className="transition-colors"
          style={{ color: c.light }}
          onMouseEnter={(e) => e.currentTarget.style.color = c.accent1}
          onMouseLeave={(e) => e.currentTarget.style.color = c.light}
          aria-label="Open settings"
        >
          <Settings size={24} />
        </button>
      </div>

      {/* Onboarding */}
      <Onboarding
        isOpen={showOnboarding}
        onComplete={handleOnboardingComplete}
        colors={c}
        onPaletteChange={setSelectedPalette}
        onFaceChange={setSelectedFace}
      />

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => { setShowSettings(false); handleUserActivity() }}
        selectedFace={selectedFace}
        onFaceChange={setSelectedFace}
        selectedPalette={selectedPalette}
        onPaletteChange={setSelectedPalette}
        workDuration={workDuration}
        shortBreakDuration={shortBreakDuration}
        longBreakDuration={longBreakDuration}
        sessionsBeforeLongBreak={sessionsBeforeLongBreak}
        onWorkDurationChange={setWorkDuration}
        onShortBreakDurationChange={setShortBreakDuration}
        onLongBreakDurationChange={setLongBreakDuration}
        onSessionsBeforeLongBreakChange={setSessionsBeforeLongBreak}
        colors={c}
      />

      {/* Tasks Panel */}
      <TasksPanel
        isOpen={showTasks}
        onClose={() => { setShowTasks(false); handleUserActivity() }}
        tasks={tasks}
        onAddTask={handleAddTask}
        onToggleFocus={handleToggleFocus}
        onTogglePin={handleTogglePin}
        onMarkComplete={handleMarkComplete}
        onDeleteTask={handleDeleteTask}
        colors={c}
      />

      {/* Phase Transition Prompt */}
      {showPhaseTransition && (
        <>
          <Confetti active={showPhaseTransition} palette={selectedPalette} />
          <div className="fixed inset-0 backdrop-blur-sm z-40 flex items-center justify-center"
            style={{ backgroundColor: `${c.bg}E6` }}>
            <div className="border-2 p-8 max-w-md mx-4" style={{ backgroundColor: c.face, borderColor: c.accent2 }}>
              <h3 className="font-mono text-2xl mb-2" style={{ color: c.light }}>
                {focusPhase === 'work' ? 'Work Complete!' : 'Break Over!'}
              </h3>
              <p className="font-mono text-sm mb-6" style={{ color: c.light, opacity: 0.8 }}>
                {nextPhase === 'work' && 'Ready to start your next focus session?'}
                {nextPhase === 'shortBreak' && 'Time for a short break. Step away and recharge.'}
                {nextPhase === 'longBreak' && 'Great work! Time for a longer break.'}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={(e) => { e.stopPropagation(); confirmPhaseTransition() }}
                  className="flex-1 px-6 py-3 font-mono text-sm transition-colors"
                  style={{ backgroundColor: c.accent1, color: c.bg }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = c.accent2}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = c.accent1}
                >
                  {nextPhase === 'work' ? 'Start Working' : 'Start Break'}
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); stopFocus(); setShowPhaseTransition(false) }}
                  className="px-6 py-3 font-mono text-sm transition-colors border"
                  style={{ backgroundColor: c.face, color: c.light, borderColor: c.accent1 }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = c.accent2}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = c.face}
                >
                  End Session
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Bottom UI - Focus Controls */}
      <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 transition-opacity duration-500 ${showUI ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {focusPhase === 'idle' ? (
          <button
            onClick={(e) => { e.stopPropagation(); startFocus() }}
            className="px-5 py-2 font-mono text-sm transition-colors"
            style={{ backgroundColor: c.accent1, color: c.bg }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = c.accent2}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = c.accent1}
          >
            Start Focus
          </button>
        ) : (
          <div className="flex flex-col items-center gap-1">
            <div className="font-mono text-xs tracking-wide" style={{ color: c.accent1 }}>
              {getFocusLabel()} · {focusSessionCount}/{sessionsBeforeLongBreak}
            </div>
            <div className="font-mono text-3xl tabular-nums" style={{ color: c.light }}>
              {formatFocusTime(focusTimeLeft)}
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); stopFocus() }}
              className="px-4 py-1 font-mono text-xs transition-colors border"
              style={{ backgroundColor: c.face, color: c.light, borderColor: c.accent1 }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = c.accent2}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = c.face}
            >
              Stop
            </button>
          </div>
        )}
      </div>

      {/* Task Marquee - shows during focus sessions or when pinned */}
      <TaskMarquee 
        tasks={tasks}
        colors={c}
        isActive={focusPhase === 'work'}
        onTogglePin={handleTogglePin}
      />

      {/* 24-Hour Clock */}
      <div className="relative w-[90vw] max-w-[500px] aspect-square">
        <ClockFaceRenderer
          hourAngle={hourAngle}
          minuteAngle={minuteAngle}
          secondAngle={secondAngle}
          face={selectedFace}
          focusProgress={getFocusProgress()}
          colors={c}
        />
      </div>
    </div>
  )
}
