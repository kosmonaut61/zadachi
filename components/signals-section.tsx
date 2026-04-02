"use client"

import React from "react"

import { useRef, useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { usePrismEffect, PrismLayers } from "./prism-effect"

gsap.registerPlugin(ScrollTrigger)

const signals = [
  {
    title: "Logistics & Transportation",
    note: "Solving route optimization, fleet tracking, and supply chain visibility through real-time data integration and intelligent dispatching systems.",
  },
  {
    title: "Maintenance & Repair",
    note: "Streamlining service scheduling, asset management, and predictive maintenance workflows to reduce downtime and improve operational efficiency.",
  },
  {
    title: "Finance",
    note: "Building secure platforms for transaction processing, portfolio management, and compliance automation that drive growth and mitigate risk.",
  },
  {
    title: "Retail",
    note: "Creating seamless inventory management, point-of-sale systems, and customer engagement tools that drive sales and customer loyalty.",
  },
  {
    title: "Healthcare",
    note: "Developing patient management systems, appointment scheduling, and health data integration that improve care delivery and operational workflows.",
  },
]

export function SignalsSection() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const cursorRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const { elementRef: prismRef, prismStyles } = usePrismEffect()

  useEffect(() => {
    if (!sectionRef.current || !cursorRef.current) return

    const section = sectionRef.current
    const cursor = cursorRef.current

    const handleMouseMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      gsap.to(cursor, {
        x: x,
        y: y,
        duration: 0.5,
        ease: "power3.out",
      })
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    section.addEventListener("mousemove", handleMouseMove)
    section.addEventListener("mouseenter", handleMouseEnter)
    section.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      section.removeEventListener("mousemove", handleMouseMove)
      section.removeEventListener("mouseenter", handleMouseEnter)
      section.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])

  useEffect(() => {
    if (!sectionRef.current || !headerRef.current || !cardsRef.current) return

    const ctx = gsap.context(() => {
      // Header slide in from left
      gsap.fromTo(
        headerRef.current,
        { x: -60, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        },
      )

      const cards = cardsRef.current?.querySelectorAll("article")
      if (cards) {
        gsap.fromTo(
          cards,
          { x: -100, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          },
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section id="signals" ref={sectionRef} className="relative py-32 pl-6 md:pl-28">
      <div
        ref={(el) => {
          cursorRef.current = el
          if (isHovering && el) {
            ;(prismRef as React.MutableRefObject<HTMLElement | null>).current = el
          }
        }}
        className={cn(
          "pointer-events-none absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 z-50",
          "w-12 h-12 rounded-full border-2 border-white/30 bg-white/10 overflow-hidden",
          "transition-opacity duration-300",
          isHovering ? "opacity-100" : "opacity-0",
        )}
        style={isHovering ? prismStyles : {}}
      >
        {isHovering && <PrismLayers intensity="strong" />}
      </div>

      {/* Section header */}
      <div ref={headerRef} className="mb-16 pr-6 md:pr-12">
        <span className="font-[DotGothic16] text-[12px] uppercase tracking-[0.3em] text-accent">01 / INTRO</span>
        <h2 className="mt-4 font-[DotGothic16] text-5xl md:text-7xl tracking-tight">WHO AM I?</h2>
        <p className="mt-8 max-w-2xl font-[DotGothic16] text-lg text-white/50 leading-relaxed">
          I'm a designer at heart, taking problems and breaking them down into solvable pieces. <span className="text-white">I use my powers for business</span>, aligning company goals with customer needs to deliver great product experiences. I've worked across many industries and bring that curiosity into every project.
        </p>
      </div>

      {/* Horizontal scroll container */}
      <div
        ref={(el) => {
          scrollRef.current = el
          cardsRef.current = el
        }}
        className="flex gap-8 overflow-x-auto pb-8 pr-12 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {signals.map((signal, index) => (
          <SignalCard key={index} signal={signal} index={index} />
        ))}
      </div>
    </section>
  )
}

function SignalCard({
  signal,
  index,
}: {
  signal: { title: string; note: string }
  index: number
}) {
  const [isHovered, setIsHovered] = useState(false)
  const { elementRef: prismRef, prismStyles } = usePrismEffect()
  
  return (
    <article
      ref={prismRef as React.RefObject<HTMLElement>}
      className={cn(
        "group relative flex-shrink-0 w-80 border p-8 rounded-sm overflow-hidden",
        "transition-all duration-500 ease-out cursor-pointer",
        isHovered ? "border-white/20 bg-white/5 -translate-y-2" : "border-border/40 bg-card",
      )}
      style={isHovered ? prismStyles : {}}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && <PrismLayers intensity="subtle" />}
      
      {/* Background layer */}
      <div
        className={cn(
          "absolute inset-0 bg-white/5 transition-opacity duration-500",
          isHovered ? "opacity-100" : "opacity-0",
        )}
      />

      {/* Title */}
      <h3 className={cn(
        "relative font-[var(--font-bebas)] text-4xl tracking-tight mb-6 transition-colors duration-300",
        isHovered ? "text-white" : "text-foreground"
      )}>
        {signal.title}
      </h3>

      {/* Description */}
      <p className="relative font-[DotGothic16] text-sm text-muted-foreground leading-relaxed">{signal.note}</p>

      {/* Index marker */}
      <span
        className={cn(
          "absolute bottom-8 right-8 font-[DotGothic16] text-[12px] transition-colors duration-300",
          isHovered ? "text-white" : "text-muted-foreground/40",
        )}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
    </article>
  )
}
