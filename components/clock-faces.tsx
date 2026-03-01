import type { PaletteColors } from '@/lib/palettes'
import { palettes } from '@/lib/palettes'

export type ClockFace = 'Alpha' | 'Atomic' | 'Mono' | 'Flip' | 'All' | 'Chunky' | 'Blind' | 'Rays'

interface ClockFaceProps {
  hourAngle: number
  minuteAngle: number
  secondAngle: number
  face: ClockFace
  focusProgress?: number
  colors: PaletteColors
}

export function ClockFaceRenderer({ hourAngle, minuteAngle, secondAngle, face, focusProgress = 0, colors: c }: ClockFaceProps) {
  if (face === 'Rays') {
    return (
      <svg viewBox="0 0 400 400" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="200" cy="200" r="190" fill="none" stroke={c.accent1} strokeWidth="6" />
        <circle cx="200" cy="200" r="184" fill={c.accent2} />
        {focusProgress > 0 && (
          <circle cx="200" cy="200" r="197" fill="none" stroke={c.light} strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 197}`}
            strokeDashoffset={`${2 * Math.PI * 197 * (1 - focusProgress)}`}
            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear' }} />
        )}
        {Array.from({ length: 6 }, (_, i) => {
          const angle = ((i * 60 + 30) * Math.PI) / 180
          const x1 = 200, y1 = 200
          const x2 = 200 + Math.cos(angle) * 184
          const y2 = 200 + Math.sin(angle) * 184
          return <line key={`segment-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={c.dark} strokeWidth="2.5" />
        })}
        {Array.from({ length: 24 }, (_, i) => {
          if ([2, 6, 10, 14, 18, 22].includes(i)) return null
          const angle = (i * 15 * Math.PI) / 180
          const x1 = 200, y1 = 200
          const x2 = 200 + Math.cos(angle) * 184
          const y2 = 200 + Math.sin(angle) * 184
          return <line key={`ray-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={c.dark} strokeWidth="1" opacity="0.3" />
        })}
        {Array.from({ length: 96 }, (_, i) => {
          const angle = (i * 3.75 * Math.PI) / 180
          const x1 = 200 + Math.cos(angle) * 174
          const y1 = 200 + Math.sin(angle) * 174
          const x2 = 200 + Math.cos(angle) * 182
          const y2 = 200 + Math.sin(angle) * 182
          return <line key={`tick-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={c.dark} strokeWidth="1" />
        })}
        {[0, 4, 8, 12, 16, 20].map((hour) => {
          const angle = hour * 15
          const radian = (angle * Math.PI) / 180
          const x = 200 + Math.cos(radian) * 145
          const y = 200 + Math.sin(radian) * 145
          return (
            <text key={`num-${hour}`} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
              style={{ fontSize: '42px', fontWeight: 700, fill: c.dark, transform: `rotate(${90 + angle}deg)`, transformOrigin: `${x}px ${y}px` }}>
              {hour}
            </text>
          )
        })}
        <line x1="200" y1="200" x2="200" y2="90" stroke={c.dark} strokeWidth="10" strokeLinecap="round"
          style={{ transform: `rotate(${hourAngle}deg)`, transformOrigin: '200px 200px' }} />
        <line x1="200" y1="200" x2="200" y2="60" stroke={c.dark} strokeWidth="8" strokeLinecap="round"
          style={{ transform: `rotate(${minuteAngle}deg)`, transformOrigin: '200px 200px' }} />
        <line x1="200" y1="210" x2="200" y2="50" stroke={c.face} strokeWidth="2"
          style={{ transform: `rotate(${secondAngle}deg)`, transformOrigin: '200px 200px' }} />
        <circle cx="200" cy="200" r="8" fill={c.dark} />
      </svg>
    )
  }

  if (face === 'Blind') {
    return (
      <svg viewBox="0 0 400 400" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="200" cy="200" r="170" fill="none" stroke={c.accent2} strokeWidth="30" />
        {focusProgress > 0 && (
          <circle cx="200" cy="200" r="170" fill="none" stroke={c.light} strokeWidth="30"
            strokeDasharray={`${2 * Math.PI * 170}`}
            strokeDashoffset={`${2 * Math.PI * 170 * (1 - focusProgress)}`}
            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear' }} />
        )}
        <circle cx="200" cy="200" r="155" fill={c.face} />
        {Array.from({ length: 24 }, (_, i) => {
          const angle = (i * 15 * Math.PI) / 180
          const x = 200 + Math.cos(angle) * 135
          const y = 200 + Math.sin(angle) * 135
          return <circle key={`dot-${i}`} cx={x} cy={y} r="6" fill={c.light} />
        })}
        <circle cx="200" cy="200" r="15" fill={c.accent2} />
        <line x1="200" y1="200" x2="200" y2="100" stroke={c.accent1} strokeWidth="12" strokeLinecap="round"
          style={{ transform: `rotate(${hourAngle}deg)`, transformOrigin: '200px 200px' }} />
        <line x1="200" y1="200" x2="200" y2="70" stroke={c.accent1} strokeWidth="10" strokeLinecap="round"
          style={{ transform: `rotate(${minuteAngle}deg)`, transformOrigin: '200px 200px' }} />
        <circle cx="200" cy="200" r="8" fill={c.dark} />
        <circle cx="200" cy="65" r="10" fill={c.accent1}
          style={{ transform: `rotate(${secondAngle}deg)`, transformOrigin: '200px 200px' }} />
      </svg>
    )
  }

  if (face === 'Chunky') {
    return (
      <svg viewBox="0 0 400 400" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="200" cy="200" r="190" fill={c.face} stroke={c.dark} strokeWidth="3" />
        
        {/* Focus progress ring */}
        {focusProgress > 0 && (
          <circle cx="200" cy="200" r="195" fill="none" stroke={c.light} strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 195}`}
            strokeDashoffset={`${2 * Math.PI * 195 * (1 - focusProgress)}`}
            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear' }} />
        )}
        {Array.from({ length: 24 }, (_, i) => {
          const angle = (i * 15 * Math.PI) / 180
          const x = 200 + Math.cos(angle) * 170
          const y = 200 + Math.sin(angle) * 170
          if (i % 6 === 0) return null
          return <circle key={`dot-${i}`} cx={x} cy={y} r="4" fill={c.light} />
        })}
        {[0, 6, 12, 18].map((hour) => {
          const angle = (hour * 15 * Math.PI) / 180
          const x = 200 + Math.cos(angle) * 155
          const y = 200 + Math.sin(angle) * 155
          return (
            <text key={hour} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
              style={{ fontSize: '36px', fontWeight: 700, fill: c.light, transform: 'rotate(90deg)', transformOrigin: `${x}px ${y}px` }}>
              {hour}
            </text>
          )
        })}
        {Array.from({ length: 60 }, (_, i) => {
          const angle = (i * 6 * Math.PI) / 180
          const x1 = 200 + Math.cos(angle) * 52
          const y1 = 200 + Math.sin(angle) * 52
          const x2 = 200 + Math.cos(angle) * 62
          const y2 = 200 + Math.sin(angle) * 62
          return <line key={`center-tick-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={c.light} strokeWidth="1" opacity="0.5" />
        })}
        <circle cx="200" cy="200" r="50" fill={c.accent2} />
        <rect x="185" y="100" width="30" height="100" rx="15" fill={c.dark}
          style={{ transform: `rotate(${hourAngle}deg)`, transformOrigin: '200px 200px' }} />
        <rect x="187.5" y="80" width="25" height="120" rx="12.5" fill={c.light}
          style={{ transform: `rotate(${minuteAngle}deg)`, transformOrigin: '200px 200px' }} />
        <circle cx="200" cy="200" r="18" fill={c.accent2} />
        <circle cx="200" cy="200" r="8" fill={c.dark} />
      </svg>
    )
  }

  if (face === 'All') {
    return (
      <svg viewBox="0 0 400 400" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="200" cy="200" r="190" fill={c.face} stroke={c.dark} strokeWidth="3" />
        {focusProgress > 0 && (
          <circle cx="200" cy="200" r="195" fill="none" stroke={c.light} strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 195}`}
            strokeDashoffset={`${2 * Math.PI * 195 * (1 - focusProgress)}`}
            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear' }} />
        )}
        {Array.from({ length: 24 }, (_, i) => {
          const angle = (i * 15 * Math.PI) / 180
          const x = 200 + Math.cos(angle) * 155
          const y = 200 + Math.sin(angle) * 155
          return (
            <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
              style={{ fontSize: '20px', fontWeight: 700, fill: c.light, transform: 'rotate(90deg)', transformOrigin: `${x}px ${y}px` }}>
              {i}
            </text>
          )
        })}
        {Array.from({ length: 24 }, (_, i) => {
          const angle = (i * 15 * Math.PI) / 180
          const x1 = 200 + Math.cos(angle) * 175
          const y1 = 200 + Math.sin(angle) * 175
          const x2 = 200 + Math.cos(angle) * 185
          const y2 = 200 + Math.sin(angle) * 185
          return <line key={`tick-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={c.light} strokeWidth="2" />
        })}
        <circle cx="200" cy="200" r="12" fill={c.accent1} />
        <line x1="200" y1="200" x2="200" y2="90" stroke={c.accent1} strokeWidth="8" strokeLinecap="round"
          style={{ transform: `rotate(${hourAngle}deg)`, transformOrigin: '200px 200px' }} />
        <line x1="200" y1="200" x2="200" y2="60" stroke={c.accent1} strokeWidth="6" strokeLinecap="round"
          style={{ transform: `rotate(${minuteAngle}deg)`, transformOrigin: '200px 200px' }} />
        <line x1="200" y1="210" x2="200" y2="50" stroke={c.light} strokeWidth="2"
          style={{ transform: `rotate(${secondAngle}deg)`, transformOrigin: '200px 200px' }} />
        <circle cx="200" cy="200" r="5" fill={c.dark} />
      </svg>
    )
  }

  if (face === 'Flip') {
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')
    
    const FlipCard = ({ digit, x, y }: { digit: string; x: number; y: number }) => (
      <g transform={`translate(${x}, ${y})`}>
        <rect width="70" height="100" rx="6" fill={c.light} stroke={c.face} strokeWidth="3" />
        <line x1="0" y1="50" x2="70" y2="50" stroke={c.face} strokeWidth="2" />
        <text x="35" y="62" textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: '64px', fill: c.dark, fontWeight: 900 }}>
          {digit}
        </text>
        <rect y="98" width="70" height="6" rx="3" fill={c.face} opacity="0.25" />
      </g>
    )
    
    return (
      <svg viewBox="0 0 400 400" className="w-full h-full">
        {/* Focus progress - follows rectangle outline */}
        {focusProgress > 0 && (
          <rect 
            x="18" 
            y="115" 
            width="364" 
            height="170" 
            rx="14" 
            fill="none" 
            stroke={c.accent2} 
            strokeWidth="8"
            strokeDasharray={`${2 * (364 + 170)}`}
            strokeDashoffset={`${2 * (364 + 170) * (1 - focusProgress)}`}
            strokeLinecap="round" 
            style={{ transition: 'stroke-dashoffset 1s linear' }} 
          />
        )}
        <rect x="23" y="120" width="354" height="160" rx="12" fill={c.accent1} />
        <rect x="35" y="132" width="330" height="136" rx="8" fill={c.light} stroke={c.face} strokeWidth="2" />
        <FlipCard digit={hours[0]} x={47} y={150} />
        <FlipCard digit={hours[1]} x={122} y={150} />
        <circle cx="200" cy="185" r="5" fill={c.accent2} />
        <circle cx="200" cy="215" r="5" fill={c.accent2} />
        <FlipCard digit={minutes[0]} x={208} y={150} />
        <FlipCard digit={minutes[1]} x={283} y={150} />
      </svg>
    )
  }
  
  if (face === 'Alpha') {
    return (
      <svg viewBox="0 0 400 400" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="200" cy="200" r="190" fill={c.light} stroke={c.dark} strokeWidth="3" />
        
        {/* Focus progress ring */}
        {focusProgress > 0 && (
          <circle cx="200" cy="200" r="195" fill="none" stroke={c.light} strokeWidth="8"
            strokeDasharray={`${2 * Math.PI * 195}`}
            strokeDashoffset={`${2 * Math.PI * 195 * (1 - focusProgress)}`}
            strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s linear' }} />
        )}
        {Array.from({ length: 24 }, (_, i) => {
          const angle = (i * 15 * Math.PI) / 180
          const isMajor = i % 6 === 0
          const innerRadius = isMajor ? 155 : 170
          const x1 = 200 + Math.cos(angle) * innerRadius
          const y1 = 200 + Math.sin(angle) * innerRadius
          const x2 = 200 + Math.cos(angle) * 185
          const y2 = 200 + Math.sin(angle) * 185
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={c.dark} strokeWidth={isMajor ? '3' : '2'} />
        })}
        {[0, 6, 12, 18].map((hour) => {
          const angle = (hour * 15 * Math.PI) / 180
          const x = 200 + Math.cos(angle) * 135
          const y = 200 + Math.sin(angle) * 135
          return (
            <text key={hour} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
              style={{ fontSize: '36px', fontWeight: 700, fill: c.dark, transform: 'rotate(90deg)', transformOrigin: `${x}px ${y}px` }}>
              {hour}
            </text>
          )
        })}
        <circle cx="200" cy="200" r="45" fill={c.accent1} />
        <line x1="200" y1="200" x2="200" y2="100" stroke={c.dark} strokeWidth="10" strokeLinecap="round"
          style={{ transform: `rotate(${hourAngle}deg)`, transformOrigin: '200px 200px' }} />
        <line x1="200" y1="200" x2="200" y2="70" stroke={c.dark} strokeWidth="8" strokeLinecap="round"
          style={{ transform: `rotate(${minuteAngle}deg)`, transformOrigin: '200px 200px' }} />
        <line x1="200" y1="220" x2="200" y2="60" stroke={c.accent2} strokeWidth="3" strokeLinecap="round"
          style={{ transform: `rotate(${secondAngle}deg)`, transformOrigin: '200px 200px' }} />
        <circle cx="200" cy="200" r="8" fill={c.face} />
      </svg>
    )
  }

  if (face === 'Mono') {
    return (
      <svg viewBox="0 0 400 400" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
        <rect x="10" y="10" width="380" height="380" rx="5" fill={c.light} stroke={c.dark} strokeWidth="5" />
        
        {/* Focus progress - follows square outline */}
        {focusProgress > 0 && (
          <rect 
            x="5" 
            y="5" 
            width="390" 
            height="390" 
            rx="8" 
            fill="none" 
            stroke={c.accent2} 
            strokeWidth="8"
            strokeDasharray={`${2 * (390 + 390)}`}
            strokeDashoffset={`${2 * (390 + 390) * (1 - focusProgress)}`}
            strokeLinecap="round" 
            style={{ transition: 'stroke-dashoffset 1s linear' }} 
          />
        )}
        {[0, 6, 12, 18].map((hour) => {
          const angle = (hour * 15 * Math.PI) / 180
          const x1 = 200 + Math.cos(angle) * 140
          const y1 = 200 + Math.sin(angle) * 140
          const x2 = 200 + Math.cos(angle) * 175
          const y2 = 200 + Math.sin(angle) * 175
          const textX = 200 + Math.cos(angle) * 120
          const textY = 200 + Math.sin(angle) * 120
          return (
            <g key={`major-${hour}`}>
              <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c.dark} strokeWidth="8" strokeLinecap="butt" />
              <text x={textX} y={textY} textAnchor="middle" dominantBaseline="middle"
                style={{ fontSize: '14px', fontWeight: 500, fill: c.dark, fontFamily: 'monospace', transform: 'rotate(90deg)', transformOrigin: `${textX}px ${textY}px` }}>
                {hour}
              </text>
            </g>
          )
        })}
        {Array.from({ length: 24 }, (_, i) => {
          if (i % 6 === 0) return null
          const angle = (i * 15 * Math.PI) / 180
          const x1 = 200 + Math.cos(angle) * 160
          const y1 = 200 + Math.sin(angle) * 160
          const x2 = 200 + Math.cos(angle) * 175
          const y2 = 200 + Math.sin(angle) * 175
          return <line key={`tick-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={c.dark} strokeWidth="2" />
        })}
        <circle cx="200" cy="200" r="8" fill={c.accent2} />
        <rect x="195" y="95" width="10" height="105" fill={c.accent2}
          style={{ transform: `rotate(${hourAngle}deg)`, transformOrigin: '200px 200px' }} />
        <rect x="196" y="70" width="8" height="130" fill={c.accent2}
          style={{ transform: `rotate(${minuteAngle}deg)`, transformOrigin: '200px 200px' }} />
        <line x1="200" y1="210" x2="200" y2="55" stroke={c.dark} strokeWidth="2"
          style={{ transform: `rotate(${secondAngle}deg)`, transformOrigin: '200px 200px' }} />
      </svg>
    )
  }

  // Atomic face (default)
  return (
    <svg viewBox="0 0 400 400" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="200" cy="200" r="190" fill={c.light} stroke={c.face} strokeWidth="4" />
      {Array.from({ length: 24 }, (_, i) => {
        const angle = (i * 15 * Math.PI) / 180
        const x1 = 200 + Math.cos(angle) * 40
        const y1 = 200 + Math.sin(angle) * 40
        const x2 = 200 + Math.cos(angle) * 175
        const y2 = 200 + Math.sin(angle) * 175
        let strokeColor = c.dark
        let strokeWidth = '2.5'
        let dasharray = '0'
        if (i % 3 === 1) { strokeColor = c.accent1; strokeWidth = '2'; dasharray = '3,3' }
        else if (i % 3 === 2) { strokeColor = c.accent2; strokeWidth = '1.5'; dasharray = '2,4' }
        return <line key={`spoke-${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={strokeColor} strokeWidth={strokeWidth} strokeDasharray={dasharray} />
      })}
      {Array.from({ length: 24 }, (_, i) => {
        const angle = (i * 15 * Math.PI) / 180
        const x = 200 + Math.cos(angle) * 160
        const y = 200 + Math.sin(angle) * 160
        if (i % 6 === 0) return null
        const dotColor = i % 2 === 0 ? c.face : c.accent1
        return <circle key={`dot-${i}`} cx={x} cy={y} r="5" fill={dotColor} />
      })}
      {[0, 6, 12, 18].map((hour) => {
        const angle = (hour * 15 * Math.PI) / 180
        const x = 200 + Math.cos(angle) * 125
        const y = 200 + Math.sin(angle) * 125
        return (
          <g key={hour}>
            <circle cx={x} cy={y} r="32" fill={c.light} opacity="0.9"
              style={{ transform: 'rotate(90deg)', transformOrigin: `${x}px ${y}px` }} />
            <text x={x} y={y} textAnchor="middle" dominantBaseline="middle"
              style={{ fontSize: '48px', fontWeight: 900, fill: c.dark, transform: 'rotate(90deg)', transformOrigin: `${x}px ${y}px`, letterSpacing: '-0.05em' }}>
              {hour}
            </text>
          </g>
        )
      })}
      <circle cx="200" cy="200" r="18" fill={c.accent1} />
      <circle cx="200" cy="200" r="12" fill={c.face} />
      <g style={{ transform: `rotate(${hourAngle}deg)`, transformOrigin: '200px 200px' }}>
        <polygon points="200,200 195,110 200,85 205,110" fill={c.dark} />
      </g>
      <g style={{ transform: `rotate(${minuteAngle}deg)`, transformOrigin: '200px 200px' }}>
        <polygon points="200,200 196,65 200,40 204,65" fill={c.dark} />
      </g>
      <line x1="200" y1="225" x2="200" y2="45" stroke={c.accent2} strokeWidth="3"
        style={{ transform: `rotate(${secondAngle}deg)`, transformOrigin: '200px 200px' }} />
    </svg>
  )
}

interface ClockFacePreviewProps {
  face: ClockFace
  selected: boolean
  onClick: () => void
  colors?: PaletteColors
}

export function ClockFacePreview({ face, selected, onClick, colors }: ClockFacePreviewProps) {
  const c = colors || palettes.halio
  const hourAngle = 10 * 15 + 10 * 0.25 + 90
  const minuteAngle = 10 * 6 + 90
  const secondAngle = 0 + 90

  return (
    <button
      onClick={onClick}
      className="relative aspect-square border-2 transition-all"
      style={{
        borderColor: selected ? c.accent1 : c.face,
      }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = c.accent2}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = selected ? c.accent1 : c.face}
    >
      <ClockFaceRenderer 
        hourAngle={hourAngle}
        minuteAngle={minuteAngle}
        secondAngle={secondAngle}
        face={face}
        colors={c}
      />
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 font-mono text-xs px-2 py-1"
        style={{ color: c.light, backgroundColor: c.bg }}>
        {face}
      </div>
    </button>
  )
}

export const availableFaces: ClockFace[] = ['All', 'Alpha', 'Atomic', 'Mono', 'Flip', 'Chunky', 'Blind', 'Rays']
