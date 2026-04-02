"use client"

import React from "react"

import { useEffect, useRef, useState, useCallback } from "react"
import { gsap } from "gsap"
import { usePrismEffect } from "./prism-effect"

interface DrawTextProps {
  text: string
  className?: string
  duration?: number
  delay?: number
  stagger?: number
}

export function DrawText({ text, className = "", duration = 0.08, delay = 0.5, stagger = 0.08 }: DrawTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { elementRef: prismRef, prismStyles } = usePrismEffect()
  const [displayChars, setDisplayChars] = useState<string[]>(text.split("").map(() => ""))
  const [activeIndices, setActiveIndices] = useState<boolean[]>(text.split("").map(() => false))
  const [flippingIndices, setFlippingIndices] = useState<boolean[]>(text.split("").map(() => false))
  const [hasAnimated, setHasAnimated] = useState(false)
  const intervalsRef = useRef<NodeJS.Timeout[]>([])

  const characters = text.split("")
  const flipChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-+#@$%"

  const runTickerAnimation = useCallback(
    (animationDelay = 0) => {
      // Clear any existing intervals
      intervalsRef.current.forEach(clearInterval)
      intervalsRef.current = []

      // Reset states
      setDisplayChars(text.split("").map(() => ""))
      setActiveIndices(text.split("").map(() => false))
      setFlippingIndices(text.split("").map(() => false))

      characters.forEach((targetChar, index) => {
        const letterDelay = animationDelay + index * stagger

        gsap.delayedCall(letterDelay, () => {
          setFlippingIndices((prev) => {
            const next = [...prev]
            next[index] = true
            return next
          })

          let flipCount = 0
          const maxFlips = 8 + Math.floor(Math.random() * 6)

          const flipInterval = setInterval(() => {
            flipCount++

            if (flipCount >= maxFlips) {
              clearInterval(flipInterval)
              setDisplayChars((prev) => {
                const next = [...prev]
                next[index] = targetChar
                return next
              })
              setActiveIndices((prev) => {
                const next = [...prev]
                next[index] = true
                return next
              })
              setFlippingIndices((prev) => {
                const next = [...prev]
                next[index] = false
                return next
              })
            } else {
              setDisplayChars((prev) => {
                const next = [...prev]
                next[index] = flipChars[Math.floor(Math.random() * flipChars.length)]
                return next
              })
            }
          }, duration * 1000)

          intervalsRef.current.push(flipInterval)
        })
      })
    },
    [text, duration, stagger, characters],
  )

  useEffect(() => {
    if (!containerRef.current || hasAnimated) return

    const ctx = gsap.context(() => {
      runTickerAnimation(delay)
      setHasAnimated(true)
    }, containerRef)

    return () => {
      ctx.revert()
      intervalsRef.current.forEach(clearInterval)
    }
  }, [delay, hasAnimated, runTickerAnimation])

  const handleMouseEnter = () => {
    if (hasAnimated) {
      runTickerAnimation(0)
    }
  }

  return (
    <h1
      ref={containerRef}
      className={className}
      onMouseEnter={handleMouseEnter}
      style={{
        fontSize: "clamp(5rem, 18vw, 18rem)",
        lineHeight: 0.9,
        letterSpacing: "0.02em",
        fontFamily: "'Bebas Neue', sans-serif",
        display: "flex",
        cursor: "pointer",
      }}
    >
      {characters.map((char, index) => (
        <span
          key={index}
          ref={activeIndices[index] ? (prismRef as React.RefObject<HTMLSpanElement>) : null}
          className="relative inline-block transition-colors duration-100 overflow-hidden rounded-sm"
          style={{
            ...(activeIndices[index] ? prismStyles : {}),
            backgroundColor: activeIndices[index] ? "rgba(255, 255, 255, 0.05)" : "transparent",
            color: activeIndices[index] ? "#ffffff" : flippingIndices[index] ? "rgba(170, 120, 255, 0.9)" : "transparent",
            padding: "0.08em 0.05em",
            marginRight: "0.06em",
            minWidth: char === " " ? "0.3em" : undefined,
            border: activeIndices[index] ? "1px solid rgba(255, 255, 255, 0.1)" : "none",
          }}
        >
          {activeIndices[index] && (
            <>
              <span
                className="prism-border pointer-events-none absolute inset-0 rounded-[inherit] transition-all duration-150"
                style={{
                  opacity: 1,
                  background: `conic-gradient(
                    from calc(var(--prism-angle, 0deg) + 180deg),
                    transparent 0deg, transparent 100deg,
                    rgba(95, 55, 245, 0.88) 122deg,
                    rgba(151, 102, 255, 0.88) 148deg,
                    rgba(133, 212, 241, 0.85) 176deg,
                    rgba(134, 255, 88, 0.82) 206deg,
                    rgba(151, 102, 255, 0.88) 236deg,
                    transparent 260deg, transparent 360deg
                  )`,
                  padding: '1.5px',
                  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  maskComposite: 'exclude',
                  WebkitMaskComposite: 'xor',
                  filter: 'blur(3px)',
                }}
              />
              <span
                className="prism-reflection pointer-events-none absolute inset-0 rounded-[inherit] transition-all duration-150"
                style={{
                  opacity: 0.3,
                  background: `conic-gradient(
                    from calc(var(--prism-angle, 0deg) + 180deg),
                    transparent 0deg, transparent 110deg,
                    rgba(95, 55, 245, 0.2) 126deg,
                    rgba(151, 102, 255, 0.2) 156deg,
                    rgba(133, 212, 241, 0.18) 186deg,
                    rgba(134, 255, 88, 0.16) 214deg,
                    rgba(151, 102, 255, 0.2) 242deg,
                    transparent 265deg, transparent 360deg
                  )`,
                  filter: 'blur(15px)',
                }}
              />
            </>
          )}
          <span className="relative z-10">{displayChars[index] || (char === " " ? "\u00A0" : "")}</span>
        </span>
      ))}
    </h1>
  )
}
