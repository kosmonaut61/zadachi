'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export function usePrismEffect() {
  const elementRef = React.useRef<HTMLElement>(null)
  const [prismAngle, setPrismAngle] = React.useState(0)
  const [mouseRelativePos, setMouseRelativePos] = React.useState({ x: 0, y: 0 })

  React.useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!elementRef.current) return

      const rect = elementRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX)
      const degrees = ((angle * 180) / Math.PI + 360) % 360

      setPrismAngle(degrees)

      const relX = e.clientX - rect.left
      const relY = e.clientY - rect.top
      setMouseRelativePos({ x: relX, y: relY })
    }

    window.addEventListener('mousemove', handleGlobalMouseMove)
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove)
  }, [])

  const prismStyles = {
    '--prism-angle': `${prismAngle}deg`,
    '--mouse-x': `${mouseRelativePos.x}px`,
    '--mouse-y': `${mouseRelativePos.y}px`,
  } as React.CSSProperties

  return { elementRef, prismStyles }
}

interface PrismLayersProps {
  intensity?: 'subtle' | 'normal' | 'strong'
  className?: string
}

export function PrismLayers({ intensity = 'normal', className = '' }: PrismLayersProps) {
  const intensityConfig = {
    subtle: { borderOpacity: 0.5, borderBlur: 4, reflectionOpacity: 0.2, reflectionBlur: 15, borderColors: 0.5 },
    normal: { borderOpacity: 1, borderBlur: 6, reflectionOpacity: 0.4, reflectionBlur: 20, borderColors: 0.8 },
    strong: { borderOpacity: 1, borderBlur: 8, reflectionOpacity: 0.6, reflectionBlur: 25, borderColors: 1 },
  }

  const config = intensityConfig[intensity]

  return (
    <>
      <span
        className={`prism-border pointer-events-none absolute inset-0 rounded-[inherit] transition-all duration-150 ${className}`}
        style={{
          opacity: config.borderOpacity,
          background: `conic-gradient(
            from calc(var(--prism-angle, 0deg) + 180deg),
            transparent 0deg, transparent 100deg,
            rgba(255, 0, 0, ${config.borderColors}) 120deg,
            rgba(255, 127, 0, ${config.borderColors}) 140deg,
            rgba(255, 255, 0, ${config.borderColors}) 160deg,
            rgba(0, 255, 0, ${config.borderColors}) 180deg,
            rgba(0, 127, 255, ${config.borderColors}) 200deg,
            rgba(139, 0, 255, ${config.borderColors}) 220deg,
            rgba(255, 0, 255, ${config.borderColors}) 240deg,
            transparent 260deg, transparent 360deg
          )`,
          padding: '1.5px',
          mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          maskComposite: 'exclude',
          WebkitMaskComposite: 'xor',
          filter: `blur(${config.borderBlur}px)`,
        }}
      />
      <span
        className={`prism-reflection pointer-events-none absolute inset-0 rounded-[inherit] transition-all duration-150 ${className}`}
        style={{
          opacity: config.reflectionOpacity,
          background: `conic-gradient(
            from calc(var(--prism-angle, 0deg) + 180deg),
            transparent 0deg, transparent 110deg,
            rgba(255, 0, 0, 0.15) 125deg,
            rgba(255, 127, 0, 0.15) 145deg,
            rgba(255, 255, 0, 0.15) 165deg,
            rgba(0, 255, 0, 0.15) 185deg,
            rgba(0, 127, 255, 0.15) 205deg,
            rgba(139, 0, 255, 0.15) 225deg,
            rgba(255, 0, 255, 0.15) 245deg,
            transparent 265deg, transparent 360deg
          )`,
          filter: `blur(${config.reflectionBlur}px)`,
        }}
      />
    </>
  )
}

export interface PrismButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost'
  size?: 'default' | 'sm' | 'lg'
}

const PrismButton = React.forwardRef<HTMLButtonElement, PrismButtonProps>(
  ({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
    const buttonRef = React.useRef<HTMLButtonElement>(null)
    const [prismAngle, setPrismAngle] = React.useState(0)
    const [mouseRelativePos, setMouseRelativePos] = React.useState({ x: 0, y: 0 })

    React.useImperativeHandle(ref, () => buttonRef.current!)

    // Track global mouse movement continuously
    React.useEffect(() => {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        if (!buttonRef.current) return

        const rect = buttonRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        // Calculate angle from button center to global mouse position
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX)
        
        // Convert to degrees and normalize
        const degrees = ((angle * 180) / Math.PI + 360) % 360

        setPrismAngle(degrees)

        // Store mouse position relative to button for glow effect
        const relX = e.clientX - rect.left
        const relY = e.clientY - rect.top
        setMouseRelativePos({ x: relX, y: relY })
      }

      window.addEventListener('mousemove', handleGlobalMouseMove)
      
      return () => {
        window.removeEventListener('mousemove', handleGlobalMouseMove)
      }
    }, [])

    const prismStyles = {
      '--prism-angle': `${prismAngle}deg`,
      '--mouse-x': `${mouseRelativePos.x}px`,
      '--mouse-y': `${mouseRelativePos.y}px`,
    } as React.CSSProperties

    return (
      <button
        ref={buttonRef}
        className={cn(
          'prism-button group relative overflow-hidden transition-all duration-300',
          'backdrop-blur-xl font-medium',
          variant === 'default' && [
            'bg-white/5 text-white',
            'border border-white/10',
            'hover:bg-white/8',
          ],
          variant === 'ghost' && [
            'bg-transparent text-white',
            'border border-white/10',
            'hover:bg-white/5',
          ],
          size === 'default' && 'h-11 px-6 py-2 text-sm rounded-xl',
          size === 'sm' && 'h-9 px-4 py-1.5 text-xs rounded-lg',
          size === 'lg' && 'h-14 px-8 py-3 text-base rounded-2xl',
          className
        )}
        style={prismStyles}
        {...props}
      >
        {/* Border prism glow effect */}
        <span
          className="prism-border pointer-events-none absolute inset-0 rounded-[inherit] opacity-100 transition-all duration-150"
          style={{
            background: `conic-gradient(
              from calc(var(--prism-angle, 0deg) + 180deg),
              transparent 0deg, transparent 100deg,
              rgba(255, 0, 0, 0.8) 120deg,
              rgba(255, 127, 0, 0.8) 140deg,
              rgba(255, 255, 0, 0.8) 160deg,
              rgba(0, 255, 0, 0.8) 180deg,
              rgba(0, 127, 255, 0.8) 200deg,
              rgba(139, 0, 255, 0.8) 220deg,
              rgba(255, 0, 255, 0.8) 240deg,
              transparent 260deg, transparent 360deg
            )`,
            padding: '1.5px',
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMaskComposite: 'xor',
            filter: 'blur(6px)',
          }}
        />

        {/* Prism reflection inside */}
        <span
          className="prism-reflection pointer-events-none absolute inset-0 rounded-[inherit] opacity-40 transition-all duration-150"
          style={{
            background: `conic-gradient(
              from calc(var(--prism-angle, 0deg) + 180deg),
              transparent 0deg, transparent 110deg,
              rgba(255, 0, 0, 0.15) 125deg,
              rgba(255, 127, 0, 0.15) 145deg,
              rgba(255, 255, 0, 0.15) 165deg,
              rgba(0, 255, 0, 0.15) 185deg,
              rgba(0, 127, 255, 0.15) 205deg,
              rgba(139, 0, 255, 0.15) 225deg,
              rgba(255, 0, 255, 0.15) 245deg,
              transparent 265deg, transparent 360deg
            )`,
            filter: 'blur(20px)',
          }}
        />

        {/* Content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </button>
    )
  }
)

PrismButton.displayName = 'PrismButton'
export { PrismButton }

// Apply to any element:
export function ExampleCard() {
  const { elementRef, prismStyles } = usePrismEffect()

  return (
    <div
      ref={elementRef as React.RefObject<HTMLDivElement>}
      style={prismStyles}
      className="relative overflow-hidden rounded-2xl bg-black/40 p-8 backdrop-blur-xl border border-white/10"
    >
      <PrismLayers intensity="normal" />
      <div className="relative z-10">
        <h3 className="text-xl font-semibold text-white mb-2">Card Title</h3>
        <p className="text-white/70">Card content</p>
      </div>
    </div>
  )
}
