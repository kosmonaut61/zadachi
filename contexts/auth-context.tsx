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
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  console.log("[AuthProvider] Current state:", { 
    user: user?.email, 
    loading, 
    pathname,
    authState: auth.currentUser?.email 
  })

  useEffect(() => {
    console.log("[AuthProvider] Setting up auth state listener")
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("[AuthProvider] Auth state changed:", {
        user: user?.email,
        currentPath: pathname,
        authState: auth.currentUser?.email
      })

      setUser(user)
      setLoading(false)

      // Only redirect if we're not already on the correct page
      if (user && pathname === "/login") {
        console.log("[AuthProvider] User on login page, redirecting to welcome")
        router.push("/welcome")
      } else if (!user && pathname !== "/login") {
        console.log("[AuthProvider] User not on login page, redirecting to login")
        router.push("/login")
      } else {
        console.log("[AuthProvider] User already on correct page:", pathname)
      }
    })

    return () => {
      console.log("[AuthProvider] Cleaning up auth state listener")
      unsubscribe()
    }
  }, [pathname, router])

  const signIn = async (email: string, password: string) => {
    try {
      console.log("[AuthProvider] Starting email sign in process...", { email })
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      console.log("[AuthProvider] Email sign in successful:", {
        email: userCredential.user.email,
        authState: auth.currentUser?.email
      })
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      })
      router.push("/welcome")
    } catch (error) {
      console.error("[AuthProvider] Email sign in error:", error)
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
      console.log("[AuthProvider] Starting sign up process...", { email })
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      console.log("[AuthProvider] Sign up successful:", {
        email: userCredential.user.email,
        authState: auth.currentUser?.email
      })
      toast({
        title: "Welcome!",
        description: "Your account has been created successfully.",
      })
      router.push("/welcome")
    } catch (error) {
      console.error("[AuthProvider] Sign up error:", error)
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
      console.log("[AuthProvider] Starting Google sign in process...")
      const result = await signInWithPopup(auth, googleProvider)
      console.log("[AuthProvider] Google sign in successful:", {
        email: result.user.email,
        authState: auth.currentUser?.email,
        currentPath: pathname
      })
      toast({
        title: "Welcome!",
        description: "You have successfully signed in with Google.",
      })
      router.push("/welcome")
    } catch (error) {
      console.error("[AuthProvider] Google sign in error:", error)
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
      console.log("[AuthProvider] Starting sign out process")
      await firebaseSignOut(auth)
      console.log("[AuthProvider] Sign out successful:", {
        previousUser: user?.email,
        authState: auth.currentUser?.email
      })
      toast({
        title: "Success",
        description: "Successfully signed out",
      })
      router.push("/login")
    } catch (error: any) {
      console.error("[AuthProvider] Sign out error:", error)
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