"use client"

import { useRef } from "react"
import { AnimatedNoise } from "@/components/animated-noise"
import Link from "next/link"

export default function AboutPage() {
  const sectionRef = useRef<HTMLElement>(null)

  return (
    <main className="relative min-h-screen">
      <div className="grid-bg fixed inset-0 opacity-30" aria-hidden="true" />
      <AnimatedNoise opacity={0.03} />

      <section
        ref={sectionRef}
        className="relative z-10 min-h-screen flex items-center justify-center py-32 pl-6 md:pl-28 pr-6 md:pr-12"
      >
        <div className="w-full">
          {/* Back button */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-[DotGothic16] text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 mb-12"
          >
            <span>←</span> BACK TO HOME
          </Link>

          {/* Header */}
          <div className="mb-16">
            <span className="font-[DotGothic16] text-[12px] uppercase tracking-[0.3em] text-accent">
              ABOUT
            </span>
            <h1 className="mt-4 font-[DotGothic16] text-5xl md:text-7xl tracking-tight">HOLDEN HAYS</h1>
          </div>

          <div className="grid md:grid-cols-[300px,1fr] gap-12">
            {/* Profile Image */}
            <div className="relative">
              <div className="aspect-square w-full max-w-[300px] border border-border/40 rounded-sm overflow-hidden bg-card">
                <div className="w-full h-full flex items-center justify-center font-[DotGothic16] text-muted-foreground text-sm">
                  Profile Image
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="space-y-8">
              {/* Bio */}
              <div>
                <h2 className="font-[DotGothic16] text-2xl mb-4">About Me</h2>
                <p className="font-[DotGothic16] text-lg text-white/70 leading-relaxed mb-4">
                  I'm a designer at heart, taking problems and breaking them down into solvable pieces.{" "}
                  <span className="text-white">I use my powers for business</span>, aligning company goals with
                  customer needs to deliver great product experiences.
                </p>
                <p className="font-[DotGothic16] text-lg text-white/70 leading-relaxed">
                  My background is in product design, and my current focus is leading product marketing and design
                  at{" "}
                  <a
                    href="https://www.emergemarket.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-accent transition-colors duration-200"
                  >
                    Emerge
                  </a>
                  . I've worked across many industries and bring that curiosity into every project.
                </p>
              </div>

              {/* Resume Section */}
              <div className="border-t border-border/40 pt-8">
                <h2 className="font-[DotGothic16] text-2xl mb-4">Resume</h2>
                <div className="space-y-4">
                  <div className="border border-border/40 rounded-sm p-6 bg-card">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-[DotGothic16] text-lg mb-2">Holden_Hays_Resume.pdf</h3>
                        <p className="font-[DotGothic16] text-sm text-muted-foreground">
                          View or download my full resume
                        </p>
                      </div>
                    </div>
                  </div>

                  <a
                    href="#"
                    download
                    className="inline-flex items-center gap-3 border border-foreground/20 px-6 py-3 font-[DotGothic16] text-sm uppercase tracking-widest transition-all duration-200 rounded-sm hover:border-white/30 hover:bg-white/5"
                  >
                    DOWNLOAD RESUME
                    <span>↓</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
