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
import { useRouter } from "next/navigation"
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
  const { toast } = useToast()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
      setLoading(false)
      if (user) {
        // User is signed in
        router.push("/")
      } else {
        // User is signed out
        router.push("/login")
      }
    })

    return () => unsubscribe()
  }, [router])

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
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
      const result = await signInWithPopup(auth, googleProvider)
      if (result.user) {
        toast({
          title: "Success",
          description: "Successfully signed in with Google",
        })
      }
    } catch (error: any) {
      console.error("Error signing in with Google:", error)
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
      await firebaseSignOut(auth)
      toast({
        title: "Success",
        description: "Successfully signed out",
      })
    } catch (error: any) {
      console.error("Error signing out:", error)
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