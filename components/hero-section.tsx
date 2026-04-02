"use client"

import React from "react"

import { useEffect, useRef, useState } from "react"
import { ScrambleTextOnHover } from "@/components/scramble-text"
import { SplitFlapText, SplitFlapMuteToggle, SplitFlapAudioProvider } from "@/components/split-flap-text"
import { AnimatedNoise } from "@/components/animated-noise"
import { BitmapChevron } from "@/components/bitmap-chevron"
import { usePrismEffect, PrismLayers } from "@/components/prism-effect"
import { cn } from "@/lib/utils"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isButtonHovered, setIsButtonHovered] = useState(false)
  const { elementRef: prismRef, prismStyles } = usePrismEffect()

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return

    const ctx = gsap.context(() => {
      gsap.to(contentRef.current, {
        y: -100,
        opacity: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="hero" className="relative min-h-screen flex items-center pl-6 md:pl-28 pr-6 md:pr-12">
      <AnimatedNoise opacity={0.03} />

      {/* Left vertical labels */}
      <div className="hidden md:block absolute left-4 md:left-6 top-1/2 -translate-y-1/2">
        <span className="font-[DotGothic16] text-[12px] uppercase tracking-[0.3em] text-muted-foreground -rotate-90 origin-left block whitespace-nowrap">
          SIGNAL
        </span>
      </div>

      {/* Main content */}
      <div ref={contentRef} className="flex-1 w-full">
        {/* Commented out flipboard animation - keep for potential future use */}
        {/* <SplitFlapAudioProvider>
          <div className="relative">
            <SplitFlapText text="INTERFACE" speed={80} />
            <div className="mt-4">
              <SplitFlapMuteToggle />
            </div>
          </div>
        </SplitFlapAudioProvider> */}

        <h1 className="font-[DotGothic16] text-white text-[clamp(3rem,12vw,8rem)] leading-none tracking-tight">
          HOLDEN HAYS
        </h1>

        <h2 className="font-sans text-white/70 text-[clamp(1rem,3vw,2rem)] mt-4 tracking-wide font-light">
          Product Focused Leader based in Phoenix, AZ
        </h2>

        <p className="mt-12 max-w-md font-[DotGothic16] text-lg text-white/50 leading-relaxed">
          My background is in product design, my current focus is leading product marketing and design @<a href="https://www.emergemarket.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-accent transition-colors duration-200">emerge</a>.
        </p>

        <div className="mt-16 flex items-center gap-8">
          <a
            ref={prismRef as React.RefObject<HTMLAnchorElement>}
            href="#work"
            className={cn(
              "group relative inline-flex items-center gap-3 border px-6 py-3 font-[DotGothic16] text-sm uppercase tracking-widest transition-all duration-200 rounded-sm overflow-hidden",
              isButtonHovered ? "border-white/30 text-white bg-white/5" : "border-foreground/20 text-foreground"
            )}
            style={isButtonHovered ? prismStyles : {}}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            {isButtonHovered && <PrismLayers intensity="normal" />}
            <span className="relative z-10">
              <ScrambleTextOnHover text="VIEW WORK" as="span" duration={0.6} />
            </span>
            <BitmapChevron className="relative z-10 transition-transform duration-[400ms] ease-in-out group-hover:rotate-45" />
          </a>
          <a
            href="/about"
            className="font-[DotGothic16] text-sm uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-200"
          >
            About Me
          </a>
        </div>
      </div>

      {/* Floating info tag */}
      <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12">
        <a 
          href="/projects" 
          className="border border-border px-4 py-2 font-[DotGothic16] text-[12px] uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors duration-200"
        >
          View my personal projects
        </a>
      </div>
    </section>
  )
}
