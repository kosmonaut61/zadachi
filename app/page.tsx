"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

// Disable static generation for this page
export const dynamic = "force-dynamic"
export const runtime = "edge"

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()

  console.log("[Root] Current state:", {
    user: user?.email,
    authState: user ? "authenticated" : "not authenticated"
  })

  useEffect(() => {
    console.log("[Root] Effect triggered:", {
      user: user?.email,
      authState: user ? "authenticated" : "not authenticated"
    })

    if (user) {
      console.log("[Root] User authenticated, redirecting to welcome")
      router.replace("/welcome")
    } else {
      console.log("[Root] No user, redirecting to login")
      router.replace("/login")
    }
  }, [user, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Loading...</p>
    </div>
  )
}
