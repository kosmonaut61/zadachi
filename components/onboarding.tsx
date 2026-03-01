'use client'

import { useState, useRef, useEffect } from 'react'
import { ClockFaceRenderer, availableFaces, type ClockFace } from './clock-faces'
import { palettes, type Palette } from '@/lib/palettes'
import type { ColorScheme } from '@/lib/palettes'

interface OnboardingProps {
  isOpen: boolean
  onComplete: (settings: {
    palette: Palette
    face: ClockFace
    workDuration: number
    shortBreakDuration: number
    longBreakDuration: number
    sessionsBeforeLongBreak: number
  }) => void
  colors: ColorScheme
  onPaletteChange?: (palette: Palette) => void
  onFaceChange?: (face: ClockFace) => void
}

const paletteConfigs: { key: Palette; label: string }[] = [
  { key: 'zadachi', label: 'Zadachi' },
  { key: 'highlighter', label: 'Highlighter' },
  { key: 'stoplight', label: 'Stoplight' },
  { key: 'neon', label: 'Neon' },
  { key: 'garden', label: 'Garden' },
]

export function Onboarding({ isOpen, onComplete, colors: c, onPaletteChange, onFaceChange }: OnboardingProps) {
  const [step, setStep] = useState(1)
  const [selectedPalette, setSelectedPalette] = useState<Palette>('zadachi')
  const [selectedFace, setSelectedFace] = useState<ClockFace>('Blind')
  const [workDuration, setWorkDuration] = useState(25)
  const [shortBreakDuration, setShortBreakDuration] = useState(5)
  const [longBreakDuration, setLongBreakDuration] = useState(15)
  const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(4)

  // Carousel state
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [dragStart, setDragStart] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Update selected face when carousel changes
  useEffect(() => {
    const newFace = availableFaces[carouselIndex]
    setSelectedFace(newFace)
    onFaceChange?.(newFace)
  }, [carouselIndex, onFaceChange])

  if (!isOpen) return null

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1)
    } else {
      onComplete({
        palette: selectedPalette,
        face: selectedFace,
        workDuration,
        shortBreakDuration,
        longBreakDuration,
        sessionsBeforeLongBreak,
      })
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  // Carousel drag handlers
  const handleDragStart = (clientX: number) => {
    setIsDragging(true)
    setDragStart(clientX)
    setDragOffset(0)
  }

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return
    const offset = clientX - dragStart
    setDragOffset(offset)
  }

  const handleDragEnd = () => {
    if (!isDragging) return
    setIsDragging(false)

    const threshold = 100
    if (dragOffset > threshold && carouselIndex > 0) {
      setCarouselIndex(carouselIndex - 1)
    } else if (dragOffset < -threshold && carouselIndex < availableFaces.length - 1) {
      setCarouselIndex(carouselIndex + 1)
    }
    setDragOffset(0)
  }

  const sliderClass = "w-full h-2 rounded-lg appearance-none cursor-pointer " +
    "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 " +
    "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer " +
    "[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 " +
    "[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"

  return (
    <div className="fixed inset-0 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: `${c.bg}F0` }}>
      <div className="border-2 p-8 w-full max-w-2xl" 
        style={{ backgroundColor: c.face, borderColor: c.accent2 }}>
        
        {/* Step 1: Carousel & Palette Selection */}
        {step === 1 && (
          <>
            <h2 className="font-mono text-3xl font-bold mb-3" style={{ color: c.light }}>
              Welcome to Zadachi
            </h2>
            <p className="font-mono text-sm mb-6" style={{ color: c.light, opacity: 0.8 }}>
              All clock faces display time in 24-hour format. Swipe to explore:
            </p>
            
            {/* Swipeable Clock Carousel */}
            <div className="mb-8 relative">
              {/* Left Arrow */}
              {carouselIndex > 0 && (
                <button
                  onClick={() => setCarouselIndex(carouselIndex - 1)}
                  className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center transition-opacity hover:opacity-100"
                  style={{ color: c.accent1, opacity: 0.5 }}
                  aria-label="Previous clock face"
                >
                  ‹
                </button>
              )}
              
              {/* Right Arrow */}
              {carouselIndex < availableFaces.length - 1 && (
                <button
                  onClick={() => setCarouselIndex(carouselIndex + 1)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center transition-opacity hover:opacity-100"
                  style={{ color: c.accent1, opacity: 0.5 }}
                  aria-label="Next clock face"
                >
                  ›
                </button>
              )}
              
              <div className="overflow-hidden" style={{ maxWidth: '500px', margin: '0 auto' }}>
                <div
                  ref={carouselRef}
                  className="flex transition-transform duration-300 ease-out cursor-grab active:cursor-grabbing"
                  style={{
                    transform: `translateX(calc(${-carouselIndex * 100}% + ${dragOffset}px))`,
                    touchAction: 'pan-y',
                  }}
                  onMouseDown={(e) => handleDragStart(e.clientX)}
                  onMouseMove={(e) => handleDragMove(e.clientX)}
                  onMouseUp={handleDragEnd}
                  onMouseLeave={handleDragEnd}
                  onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
                  onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
                  onTouchEnd={handleDragEnd}
                >
                  {availableFaces.map((face, index) => {
                    const offset = Math.abs(index - carouselIndex)
                    const opacity = offset === 0 ? 1 : offset === 1 ? 0.5 : 0.15
                    const scale = offset === 0 ? 1 : 0.7
                    
                    return (
                      <div key={face} className="flex-shrink-0 w-full flex justify-center items-center pointer-events-none">
                        <div 
                          className="w-64 h-64 transition-all duration-300"
                          style={{
                            opacity,
                            transform: `scale(${scale})`,
                          }}
                        >
                          <ClockFaceRenderer
                            hourAngle={(new Date().getHours() % 24) * 15 + new Date().getMinutes() * 0.25 + 90}
                            minuteAngle={new Date().getMinutes() * 6 + new Date().getSeconds() * 0.1 + 90}
                            secondAngle={new Date().getSeconds() * 6 + 90}
                            face={face}
                            focusProgress={0}
                            colors={c}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
              
              {/* Carousel Indicators */}
              <div className="flex justify-center gap-2 mt-4">
                {availableFaces.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCarouselIndex(index)}
                    className="w-2 h-2 rounded-full transition-all"
                    style={{ 
                      backgroundColor: index === carouselIndex ? c.accent2 : `${c.accent1}50`,
                      width: index === carouselIndex ? '12px' : '8px',
                    }}
                  />
                ))}
              </div>
            </div>

            <h3 className="font-mono text-lg font-bold mb-4" style={{ color: c.accent1 }}>
              Choose Your Color Palette
            </h3>
            <div className="flex gap-4 justify-center mb-6">
              {paletteConfigs.map(({ key }) => {
                const p = palettes[key]
                const isSelected = selectedPalette === key
                const donutColors = [p.bg, p.face, p.accent1, p.accent2, p.light]
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedPalette(key)
                      onPaletteChange?.(key)
                    }}
                    className="transition-all duration-200 relative"
                    style={{
                      width: '64px',
                      height: '64px',
                    }}
                  >
                    <svg viewBox="0 0 100 100" className="w-full h-full">
                      {donutColors.map((color, i) => {
                        const offset = i * 72
                        const startAngle = offset
                        const endAngle = offset + 72
                        const innerRadius = 28
                        const outerRadius = 48
                        const startRad = (startAngle * Math.PI) / 180
                        const endRad = (endAngle * Math.PI) / 180
                        const x1 = 50 + innerRadius * Math.cos(startRad)
                        const y1 = 50 + innerRadius * Math.sin(startRad)
                        const x2 = 50 + outerRadius * Math.cos(startRad)
                        const y2 = 50 + outerRadius * Math.sin(startRad)
                        const x3 = 50 + outerRadius * Math.cos(endRad)
                        const y3 = 50 + outerRadius * Math.sin(endRad)
                        const x4 = 50 + innerRadius * Math.cos(endRad)
                        const y4 = 50 + innerRadius * Math.sin(endRad)
                        return (
                          <path
                            key={i}
                            d={`M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1}`}
                            fill={color}
                            stroke={p.dark}
                            strokeWidth="0.5"
                          />
                        )
                      })}
                      {/* Selection indicator */}
                      {isSelected && (
                        <circle cx="50" cy="50" r="50" fill="none" stroke={c.accent2} strokeWidth="3" />
                      )}
                    </svg>
                  </button>
                )
              })}
            </div>
          </>
        )}

        {/* Step 2: Focus Timer Settings */}
        {step === 2 && (
          <>
            <h2 className="font-mono text-3xl font-bold mb-3" style={{ color: c.light }}>
              Configure Focus Timer
            </h2>
            <p className="font-mono text-sm mb-6" style={{ color: c.light, opacity: 0.8 }}>
              Set your focus and break durations:
            </p>

            <div className="space-y-6 mb-6">
              {/* Work Duration */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-mono text-sm" style={{ color: c.accent1 }}>Work Duration</label>
                  <span className="font-mono text-sm" style={{ color: c.light }}>{workDuration} min</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={workDuration}
                  onChange={(e) => setWorkDuration(Number(e.target.value))}
                  className={sliderClass}
                  style={{
                    background: `linear-gradient(to right, ${c.accent1} 0%, ${c.accent1} ${((workDuration - 5) / 55) * 100}%, ${c.dark} ${((workDuration - 5) / 55) * 100}%, ${c.dark} 100%)`
                  }}
                />
              </div>

              {/* Short Break */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-mono text-sm" style={{ color: c.accent1 }}>Short Break</label>
                  <span className="font-mono text-sm" style={{ color: c.light }}>{shortBreakDuration} min</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  step="1"
                  value={shortBreakDuration}
                  onChange={(e) => setShortBreakDuration(Number(e.target.value))}
                  className={sliderClass}
                  style={{
                    background: `linear-gradient(to right, ${c.accent1} 0%, ${c.accent1} ${((shortBreakDuration - 1) / 14) * 100}%, ${c.dark} ${((shortBreakDuration - 1) / 14) * 100}%, ${c.dark} 100%)`
                  }}
                />
              </div>

              {/* Long Break */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-mono text-sm" style={{ color: c.accent1 }}>Long Break</label>
                  <span className="font-mono text-sm" style={{ color: c.light }}>{longBreakDuration} min</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="45"
                  step="5"
                  value={longBreakDuration}
                  onChange={(e) => setLongBreakDuration(Number(e.target.value))}
                  className={sliderClass}
                  style={{
                    background: `linear-gradient(to right, ${c.accent1} 0%, ${c.accent1} ${((longBreakDuration - 10) / 35) * 100}%, ${c.dark} ${((longBreakDuration - 10) / 35) * 100}%, ${c.dark} 100%)`
                  }}
                />
              </div>

              {/* Sessions Before Long Break */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="font-mono text-sm" style={{ color: c.accent1 }}>Sessions Before Long Break</label>
                  <span className="font-mono text-sm" style={{ color: c.light }}>{sessionsBeforeLongBreak}</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="8"
                  step="1"
                  value={sessionsBeforeLongBreak}
                  onChange={(e) => setSessionsBeforeLongBreak(Number(e.target.value))}
                  className={sliderClass}
                  style={{
                    background: `linear-gradient(to right, ${c.accent1} 0%, ${c.accent1} ${((sessionsBeforeLongBreak - 2) / 6) * 100}%, ${c.dark} ${((sessionsBeforeLongBreak - 2) / 6) * 100}%, ${c.dark} 100%)`
                  }}
                />
              </div>
            </div>
          </>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-8">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-6 py-3 font-mono text-sm transition-colors border"
              style={{ backgroundColor: c.face, color: c.light, borderColor: c.accent1 }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = c.accent2}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = c.face}
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 px-6 py-3 font-mono text-sm transition-colors"
            style={{ backgroundColor: c.accent1, color: c.bg }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = c.accent2}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = c.accent1}
          >
            {step === 2 ? 'Get Started' : 'Next'}
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-center gap-2 mt-6">
          {[1, 2].map((s) => (
            <div
              key={s}
              className="w-2 h-2 rounded-full transition-all"
              style={{ backgroundColor: s === step ? c.accent2 : `${c.accent1}50` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
