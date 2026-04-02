"use client"

import { useRef, useEffect } from "react"
import Link from "next/link"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export function ColophonSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Header slide in
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          x: -60,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        })
      }

      // Grid columns fade up with stagger
      if (gridRef.current) {
        const columns = gridRef.current.querySelectorAll(":scope > div")
        gsap.from(columns, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: gridRef.current,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        })
      }

      // Footer fade in
      if (footerRef.current) {
        gsap.from(footerRef.current, {
          y: 20,
          opacity: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 95%",
            toggleActions: "play none none reverse",
          },
        })
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="colophon"
      className="relative py-32 pl-6 md:pl-28 pr-6 md:pr-12 border-t border-border/30"
    >
      {/* Section header */}
      <div ref={headerRef} className="mb-16">
        <span className="font-[DotGothic16] text-[12px] uppercase tracking-[0.3em] text-accent">03 / Footer</span>
        <h2 className="mt-4 font-[DotGothic16] text-5xl md:text-7xl tracking-tight">THANK YOU!</h2>
      </div>

      {/* Footer navigation aligned to actual site structure */}
      <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-5xl">
        {/* Site */}
        <div className="col-span-1">
          <h4 className="font-[DotGothic16] text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Site</h4>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="font-[DotGothic16] text-sm text-foreground/80 hover:text-accent transition-colors duration-200">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="font-[DotGothic16] text-sm text-foreground/80 hover:text-accent transition-colors duration-200">
                About
              </Link>
            </li>
            <li>
              <Link href="/projects" className="font-[DotGothic16] text-sm text-foreground/80 hover:text-accent transition-colors duration-200">
                Projects
              </Link>
            </li>
          </ul>
        </div>

        {/* On this page */}
        <div className="col-span-1">
          <h4 className="font-[DotGothic16] text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-4">On this page</h4>
          <ul className="space-y-2">
            <li>
              <a href="#hero" className="font-[DotGothic16] text-sm text-foreground/80 hover:text-accent transition-colors duration-200">
                Hero
              </a>
            </li>
            <li>
              <a href="#signals" className="font-[DotGothic16] text-sm text-foreground/80 hover:text-accent transition-colors duration-200">
                Intro
              </a>
            </li>
            <li>
              <a href="#work" className="font-[DotGothic16] text-sm text-foreground/80 hover:text-accent transition-colors duration-200">
                Selected Work
              </a>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="col-span-1">
          <h4 className="font-[DotGothic16] text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Connect</h4>
          <ul className="space-y-2">
            <li>
              <a href="mailto:hello@holdenhays.com" className="font-[DotGothic16] text-sm text-foreground/80 hover:text-accent transition-colors duration-200">
                hello@holdenhays.com
              </a>
            </li>
            <li>
              <a href="https://www.emergemarket.com" target="_blank" rel="noopener noreferrer" className="font-[DotGothic16] text-sm text-foreground/80 hover:text-accent transition-colors duration-200">
                Emerge
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom copyright */}
      <div
        ref={footerRef}
        className="mt-24 pt-8 border-t border-border/20 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <p className="font-[DotGothic16] text-[12px] text-muted-foreground uppercase tracking-widest">
          © 2026 Holden Hays. All rights reserved.
        </p>
        <p className="font-[DotGothic16] text-[12px] text-muted-foreground">Designed with intention. Built with precision.</p>
      </div>
    </section>
  )
}
