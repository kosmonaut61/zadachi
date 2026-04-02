"use client"

import React from "react"

import { useRef, useEffect, type ReactNode, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { usePrismEffect, PrismLayers } from "./prism-effect"

gsap.registerPlugin(ScrollTrigger)

interface HighlightTextProps {
  children: ReactNode
  className?: string
  parallaxSpeed?: number
}

export function HighlightText({ children, className = "", parallaxSpeed = 0.3 }: HighlightTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null)
  const highlightRef = useRef<HTMLSpanElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const [isHighlighted, setIsHighlighted] = useState(false)
  const { elementRef: prismRef, prismStyles } = usePrismEffect()

  useEffect(() => {
    if (!containerRef.current || !highlightRef.current || !textRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "top -20%",
          toggleActions: "play reverse play reverse",
        },
      })

      // Animate highlight in from scaleX 0 to 1
      tl.fromTo(
        highlightRef.current,
        {
          scaleX: 0,
          transformOrigin: "left center",
        },
        {
          scaleX: 1,
          duration: 1.2,
          ease: "power3.out",
          onStart: () => setIsHighlighted(false),
          onComplete: () => setIsHighlighted(true),
        },
      )

      tl.fromTo(
        textRef.current,
        {
          color: "rgb(250, 250, 250)", // foreground color
        },
        {
          color: "#ffffff",
          duration: 0.6,
          ease: "power2.out",
        },
        0.5,
      )

      // Parallax effect
      gsap.to(highlightRef.current, {
        yPercent: -20 * parallaxSpeed,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      })
    }, containerRef)

    return () => ctx.revert()
  }, [parallaxSpeed])

  return (
    <span ref={containerRef} className={`relative inline-block ${className}`}>
      <span
        ref={(el) => {
          highlightRef.current = el
          if (isHighlighted && el) {
            ;(prismRef as React.MutableRefObject<HTMLElement | null>).current = el
          }
        }}
        className="absolute inset-0 bg-white/10 rounded-sm overflow-hidden"
        style={{
          ...( isHighlighted ? prismStyles : {}),
          left: "-0.1em",
          right: "-0.1em",
          top: "0.15em",
          bottom: "0.1em",
          transform: "scaleX(0)",
          transformOrigin: "left center",
        }}
      >
        {isHighlighted && <PrismLayers intensity="normal" />}
      </span>
      <span ref={textRef} className="relative z-10">
        {children}
      </span>
    </span>
  )
}
