"use client"

import React from "react"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { usePrismEffect, PrismLayers } from "./prism-effect"
import { projects } from "@/lib/projects"

gsap.registerPlugin(ScrollTrigger)

const projectOrder = [
  "project-lattice",
  "silent-agent",
  "noir-grid",
  "freight-spend-optimization",
  "inventory-part-management",
]

const experiments = projectOrder
  .map((slug) => projects.find((project) => project.slug === slug))
  .filter((project): project is NonNullable<typeof project> => Boolean(project))

export function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !headerRef.current || !gridRef.current) return

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
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        },
      )

      const cards = gridRef.current?.querySelectorAll("article")
      if (cards && cards.length > 0) {
        gsap.set(cards, { y: 60, opacity: 0 })
        gsap.to(cards, {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="work" className="relative py-32 pl-6 md:pl-28 pr-6 md:pr-12">
      {/* Section header */}
      <div ref={headerRef} className="mb-16 flex items-end justify-between">
        <div>
          <span className="font-[DotGothic16] text-[12px] uppercase tracking-[0.3em] text-accent">02 / Projects</span>
          <h2 className="mt-4 font-[DotGothic16] text-5xl md:text-7xl tracking-tight">SELECTED WORK</h2>
        </div>
        <p className="hidden md:block max-w-xs font-[DotGothic16] text-sm text-muted-foreground text-right leading-relaxed">
          Studies across interface design, agent systems, and visual computation.
        </p>
      </div>

      {/* Asymmetric grid */}
      <div
        ref={gridRef}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[205px] md:auto-rows-[220px]"
      >
        {experiments.map((experiment, index) => (
          <WorkCard key={index} experiment={experiment} index={index} persistHover={index === 0} />
        ))}
      </div>
    </section>
  )
}

function WorkCard({
  experiment,
  index,
  persistHover = false,
}: {
  experiment: {
    title: string
    medium: string
    description: string
    span: string
    slug: string
  }
  index: number
  persistHover?: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLElement>(null)
  const [isScrollActive, setIsScrollActive] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const [autoAngle, setAutoAngle] = useState<number | null>(null)
  const { elementRef: prismRef, prismStyles } = usePrismEffect()

  useEffect(() => {
    if (typeof window === "undefined") return
    setIsTouchDevice(window.matchMedia("(hover: none)").matches)
  }, [])

  useEffect(() => {
    if (!cardRef.current) return

    const shouldEnableScrollActivation = persistHover || isTouchDevice

    if (!shouldEnableScrollActivation) return

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: cardRef.current,
        start: "top 85%",
        end: "bottom 25%",
        onEnter: () => setIsScrollActive(true),
        onEnterBack: () => setIsScrollActive(true),
        onLeave: () => setIsScrollActive(false),
        onLeaveBack: () => setIsScrollActive(false),
      })
    }, cardRef)

    return () => ctx.revert()
  }, [persistHover, isTouchDevice])

  const isActive = isHovered || isScrollActive

  useEffect(() => {
    if (!isTouchDevice || !isActive) {
      setAutoAngle(null)
      return
    }

    let rafId = 0
    let angle = 0

    const tick = () => {
      angle = (angle + 1.2) % 360
      setAutoAngle(angle)
      rafId = window.requestAnimationFrame(tick)
    }

    rafId = window.requestAnimationFrame(tick)
    return () => window.cancelAnimationFrame(rafId)
  }, [isTouchDevice, isActive])
  const isTall = experiment.span.includes("row-span-2")

  const card = (
    <article
      ref={(el) => {
        cardRef.current = el
        if (isActive && el) {
          ;(prismRef as React.MutableRefObject<HTMLElement | null>).current = el
        }
      }}
      className={cn(
        "group relative border border-border/40 p-5 flex flex-col justify-between transition-all duration-500 cursor-pointer overflow-hidden rounded-sm h-full",
        isActive && "border-white/20",
      )}
      style={
        isActive
          ? {
              ...prismStyles,
              ...(autoAngle !== null ? ({ "--prism-angle": `${autoAngle}deg` } as React.CSSProperties) : {}),
            }
          : {}
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isActive && <PrismLayers intensity="subtle" />}

      <div
        className={cn(
          "absolute inset-0 bg-white/5 transition-opacity duration-500",
          isActive ? "opacity-100" : "opacity-0",
        )}
      />

      <div className="relative z-10">
        <span className="font-[DotGothic16] text-[12px] uppercase tracking-widest text-muted-foreground">
          {experiment.medium}
        </span>
        <h3
          className={cn(
            "mt-3 font-[var(--font-bebas)] text-2xl md:text-4xl tracking-tight transition-colors duration-300",
            isActive ? "text-white" : "text-foreground",
          )}
        >
          {experiment.title}
        </h3>
      </div>

      <div className="relative z-10">
        <p
          className={cn(
            "font-[DotGothic16] text-sm text-muted-foreground leading-relaxed transition-all duration-500 max-w-[280px]",
            isTall || isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
          )}
        >
          {experiment.description}
        </p>

        <span
          className={cn(
            "mt-5 inline-flex text-[10px] font-[DotGothic16] uppercase tracking-[0.22em] text-white/70 transition-opacity duration-500",
            isTall || isActive ? "opacity-100" : "opacity-0",
          )}
        >
          View more info →
        </span>
      </div>

      <span
        className={cn(
          "absolute bottom-4 right-4 font-[DotGothic16] text-[12px] transition-colors duration-300",
          isActive ? "text-white" : "text-muted-foreground/40",
        )}
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div
        className={cn(
          "absolute top-0 right-0 w-12 h-12 transition-all duration-500",
          isActive ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="absolute top-0 right-0 w-full h-[1px] bg-white/60" />
        <div className="absolute top-0 right-0 w-[1px] h-full bg-white/60" />
      </div>
    </article>
  )

  return (
    <Link href={`/projects/${experiment.slug}`} className={experiment.span}>
      {card}
    </Link>
  )
}
