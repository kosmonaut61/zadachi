'use client'

import { X } from 'lucide-react'
import { ClockFacePreview, availableFaces, type ClockFace } from './clock-faces'
import { palettes, type Palette, type PaletteColors } from '@/lib/palettes'
import { getAccessibleTextColor } from '@/lib/contrast'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
  selectedFace: ClockFace
  onFaceChange: (face: ClockFace) => void
  selectedPalette: Palette
  onPaletteChange: (palette: Palette) => void
  workDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  sessionsBeforeLongBreak: number
  onWorkDurationChange: (minutes: number) => void
  onShortBreakDurationChange: (minutes: number) => void
  onLongBreakDurationChange: (minutes: number) => void
  onSessionsBeforeLongBreakChange: (count: number) => void
  colors: PaletteColors
}

// Donut segment renderer
function PaletteDonut({ colors, strokeColor }: { colors: string[]; strokeColor: string }) {
  const segmentAngle = 360 / colors.length
  return (
    <svg viewBox="0 0 100 100" className="w-16 h-16 mx-auto">
      {colors.map((color, i) => {
        const startAngle = i * segmentAngle
        const endAngle = startAngle + segmentAngle
        const innerR = 28
        const outerR = 46
        const startRad = (startAngle * Math.PI) / 180
        const endRad = (endAngle * Math.PI) / 180
        const x1 = 50 + innerR * Math.cos(startRad)
        const y1 = 50 + innerR * Math.sin(startRad)
        const x2 = 50 + outerR * Math.cos(startRad)
        const y2 = 50 + outerR * Math.sin(startRad)
        const x3 = 50 + outerR * Math.cos(endRad)
        const y3 = 50 + outerR * Math.sin(endRad)
        const x4 = 50 + innerR * Math.cos(endRad)
        const y4 = 50 + innerR * Math.sin(endRad)
        const largeArc = segmentAngle > 180 ? 1 : 0
        return (
          <path
            key={i}
            d={`M ${x1} ${y1} L ${x2} ${y2} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x3} ${y3} L ${x4} ${y4} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x1} ${y1}`}
            fill={color}
            stroke={strokeColor}
            strokeWidth="0.5"
          />
        )
      })}
    </svg>
  )
}

const paletteConfigs: { key: Palette; label: string }[] = [
  { key: 'zadachi', label: 'Zadachi' },
  { key: 'highlighter', label: 'Highlighter' },
  { key: 'stoplight', label: 'Stoplight' },
  { key: 'neon', label: 'Neon' },
  { key: 'garden', label: 'Garden' },
]

export function SettingsPanel({
  isOpen,
  onClose,
  selectedFace,
  onFaceChange,
  selectedPalette,
  onPaletteChange,
  workDuration,
  shortBreakDuration,
  longBreakDuration,
  sessionsBeforeLongBreak,
  onWorkDurationChange,
  onShortBreakDurationChange,
  onLongBreakDurationChange,
  onSessionsBeforeLongBreakChange,
  colors: c,
}: SettingsPanelProps) {
  if (!isOpen) return null

  // Calculate accessible text colors
  const faceTextColor = getAccessibleTextColor(c.face, c.light, c.dark)

  // Generate slider styles dynamically based on palette
  const sliderClass = "w-full h-2 rounded-lg appearance-none cursor-pointer " +
    "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 " +
    "[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer " +
    "[&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 " +
    "[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"

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
        className="fixed right-0 top-0 bottom-0 w-full max-w-md border-l-2 z-50 overflow-y-auto"
        style={{ backgroundColor: c.face, borderColor: c.accent1 }}
      >
        <div className="p-6 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="font-mono text-xl font-bold" style={{ color: faceTextColor }}>Settings</h2>
            <button
              onClick={onClose}
              className="transition-colors"
              style={{ color: faceTextColor }}
              onMouseEnter={(e) => e.currentTarget.style.color = c.accent1}
              onMouseLeave={(e) => e.currentTarget.style.color = faceTextColor}
              aria-label="Close settings"
            >
              <X size={24} />
            </button>
          </div>

          {/* Clock Face Section */}
          <section>
            <h3 className="font-mono text-sm uppercase tracking-wide mb-4" style={{ color: c.accent1 }}>
              Clock Face
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {availableFaces.map((face) => (
                <div key={face} className="relative group">
                  <ClockFacePreview
                    face={face}
                    selected={selectedFace === face}
                    onClick={() => onFaceChange(face)}
                    colors={c}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Palette Section */}
          <section>
            <h3 className="font-mono text-sm uppercase tracking-wide mb-4" style={{ color: c.accent1 }}>
              Palette
            </h3>
            <div className="space-y-3">
              {paletteConfigs.map(({ key, label }) => {
                const p = palettes[key]
                const isSelected = selectedPalette === key
                const donutColors = [p.bg, p.face, p.accent1, p.accent2, p.light]
                return (
                  <button
                    key={key}
                    onClick={() => onPaletteChange(key)}
                    className="w-full p-4 border-2 transition-all duration-200"
                    style={{
                      borderColor: isSelected ? c.accent2 : `${c.accent1}50`,
                      boxShadow: isSelected ? `0 0 0 2px ${c.accent2}80` : 'none',
                      backgroundColor: isSelected ? `${c.bg}20` : 'transparent',
                    }}
                    onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.borderColor = c.accent1 }}
                    onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.borderColor = `${c.accent1}50` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-sm font-bold" style={{ color: faceTextColor }}>
                        {label}
                      </span>
                      {isSelected && (
                        <span className="text-xs font-bold" style={{ color: c.accent2 }}>&#10003;</span>
                      )}
                    </div>
                    <PaletteDonut colors={donutColors} strokeColor={p.dark} />
                  </button>
                )
              })}
            </div>
          </section>

          {/* Focus Timer Settings Section */}
          <section>
            <h3 className="font-mono text-sm uppercase tracking-wide mb-4" style={{ color: c.accent1 }}>
              Focus Timer
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Focus Time', value: workDuration, min: 1, max: 60, unit: 'min', onChange: onWorkDurationChange },
                { label: 'Short Break', value: shortBreakDuration, min: 1, max: 30, unit: 'min', onChange: onShortBreakDurationChange },
                { label: 'Long Break', value: longBreakDuration, min: 5, max: 60, unit: 'min', onChange: onLongBreakDurationChange },
                { label: 'Sessions Before Long Break', value: sessionsBeforeLongBreak, min: 2, max: 8, unit: '', onChange: onSessionsBeforeLongBreakChange },
              ].map(({ label, value, min, max, unit, onChange }) => (
                <div key={label} className="space-y-2">
                  <label className="flex items-center justify-between font-mono text-sm">
                    <span style={{ color: faceTextColor }}>{label}</span>
                    <span style={{ color: c.accent1 }}>{value}{unit ? ` ${unit}` : ''}</span>
                  </label>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    className={sliderClass}
                    style={{
                      backgroundColor: c.bg,
                      // @ts-expect-error css custom properties for slider thumb
                      '--slider-thumb-color': c.accent1,
                    }}
                  />
                  <style>{`
                    input[type="range"]::-webkit-slider-thumb {
                      background-color: ${c.accent1} !important;
                    }
                    input[type="range"]::-moz-range-thumb {
                      background-color: ${c.accent1} !important;
                    }
                  `}</style>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  )
}
