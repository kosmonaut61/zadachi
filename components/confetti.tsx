'use client'

import { useEffect, useRef } from 'react'
import { getPaletteArray, type Palette } from '@/lib/palettes'

interface ConfettiProps {
  active: boolean
  palette?: Palette
}

export function Confetti({ active, palette = 'zadachi' }: ConfettiProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!active) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const colors = getPaletteArray(palette)

    interface Particle {
      x: number
      y: number
      size: number
      color: string
      speedY: number
      speedX: number
      rotation: number
      rotationSpeed: number
    }

    const particles: Particle[] = []

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: Math.random() * 2 + 1,
        speedX: Math.random() * 2 - 1,
        rotation: Math.random() * 360,
        rotationSpeed: Math.random() * 4 - 2,
      })
    }

    let animationFrameId: number

    function animate() {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.y += particle.speedY
        particle.x += particle.speedX
        particle.rotation += particle.rotationSpeed

        if (particle.y > canvas.height) {
          particle.y = -10
          particle.x = Math.random() * canvas.width
        }

        if (particle.x > canvas.width) particle.x = 0
        else if (particle.x < 0) particle.x = canvas.width

        ctx.save()
        ctx.translate(particle.x, particle.y)
        ctx.rotate((particle.rotation * Math.PI) / 180)
        ctx.fillStyle = particle.color
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size)
        ctx.restore()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
    }
  }, [active, palette])

  if (!active) return null

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ width: '100%', height: '100%' }}
    />
  )
}
