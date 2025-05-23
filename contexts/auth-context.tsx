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
      console.log("Starting sign in process...")
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log("Sign in successful:", userCredential.user.email)
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      })
      router.push("/welcome")
    } catch (error) {
      console.error("Sign in error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to sign in",
        variant: "destructive",
      })
      throw error
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      console.log("Starting sign up process...")
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      console.log("Sign up successful:", userCredential.user.email)
      toast({
        title: "Welcome!",
        description: "Your account has been created successfully.",
      })
      router.push("/welcome")
    } catch (error) {
      console.error("Sign up error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create account",
        variant: "destructive",
      })
      throw error
    }
  }

  const signInWithGoogle = async () => {
    try {
      console.log("Starting Google sign in process...")
      const result = await signInWithPopup(auth, googleProvider)
      console.log("Google sign in successful:", result.user.email)
      toast({
        title: "Welcome!",
        description: "You have successfully signed in with Google.",
      })
      router.push("/welcome")
    } catch (error) {
      console.error("Google sign in error:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to sign in with Google",
        variant: "destructive",
      })
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