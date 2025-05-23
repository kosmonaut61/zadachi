"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { 
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth"
import { auth, googleProvider } from "@/lib/firebase"
import { useRouter, usePathname } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isNavigating, setIsNavigating] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  useEffect(() => {
    console.log("[Auth] Setting up auth state listener")
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("[Auth] Auth state changed:", user ? "User signed in" : "No user")
      setUser(user)
      setLoading(false)
      
      // Only redirect if necessary and not already navigating
      if (!isNavigating) {
        if (user && pathname === "/login") {
          console.log("[Auth] User is signed in, redirecting to manage zadachi")
          setIsNavigating(true)
          router.push("/manage-zadachi")
        } else if (!user && pathname !== "/login") {
          console.log("[Auth] No user, redirecting to login")
          setIsNavigating(true)
          router.push("/login")
        } else {
          console.log("[Auth] No redirect needed, current path:", pathname)
        }
      }
    })

    return () => {
      console.log("[Auth] Cleaning up auth state listener")
      unsubscribe()
    }
  }, [pathname, isNavigating])

  // Reset navigation state when pathname changes
  useEffect(() => {
    setIsNavigating(false)
  }, [pathname])

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
      setIsNavigating(true)
      router.push("/manage-zadachi")
    } catch (error: any) {
      console.error("Error signing in:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to sign in",
        variant: "destructive",
      })
      throw error
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      setIsNavigating(true)
      router.push("/manage-zadachi")
    } catch (error: any) {
      console.error("Error signing up:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
        variant: "destructive",
      })
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      console.log("[Auth] Starting Google sign in")
      const result = await signInWithPopup(auth, googleProvider)
      console.log("[Auth] Sign in successful:", result.user.email)
      toast({
        title: "Success",
        description: "Successfully signed in with Google",
      })
      setIsNavigating(true)
      router.push("/manage-zadachi")
    } catch (error: any) {
      console.error("[Auth] Sign in error:", error)
      if (error.code === 'auth/popup-closed-by-user') {
        toast({
          title: "Sign in cancelled",
          description: "You closed the sign-in window",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: error.message || "Failed to sign in with Google",
          variant: "destructive",
        })
      }
      throw error
    }
  }

  const signOut = async () => {
    try {
      console.log("[Auth] Starting sign out")
      await firebaseSignOut(auth)
      console.log("[Auth] Sign out successful")
      toast({
        title: "Success",
        description: "Successfully signed out",
      })
      setIsNavigating(true)
      router.push("/login")
    } catch (error: any) {
      console.error("[Auth] Sign out error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to sign out",
        variant: "destructive",
      })
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signInWithGoogle, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 