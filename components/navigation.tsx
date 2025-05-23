"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useUser } from "@/contexts/user-context"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

export function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { users, currentUser, setCurrentUser } = useUser()
  const pathname = usePathname()
  const router = useRouter()

  const handleUserChange = (user: typeof currentUser) => {
    setCurrentUser(user)
    setIsMenuOpen(false)

    // If we're not on the home page, navigate there
    if (pathname !== "/") {
      router.push("/")
    }
  }

  return (
    <header className="border-b p-4 flex justify-between items-center relative">
      <h1 className="text-xl font-bold">
        {pathname === "/manage-users" ? "Manage Users" : pathname === "/manage-zadachi" ? "Manage Zadachi" : "Zadachi"}
      </h1>
      <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        <span className="sr-only">Menu</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-menu"
        >
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      </Button>

      {isMenuOpen && (
        <div className="absolute top-full right-0 mt-1 w-64 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="border-b">
            {users.map((user) => (
              <button
                key={user.id}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 flex items-center"
                onClick={() => handleUserChange(user)}
              >
                <span className="mr-2">{pathname === "/" && currentUser.id === user.id ? "•" : ""}</span>
                {user.firstName} {user.lastName}'s Zadachi
              </button>
            ))}
          </div>
          <div>
            <Link
              href="/manage-users"
              className="block px-4 py-3 hover:bg-gray-100 flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="mr-2">{pathname === "/manage-users" ? "•" : ""}</span>
              Manage Users
            </Link>
            <Link
              href="/manage-zadachi"
              className="block px-4 py-3 hover:bg-gray-100 flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="mr-2">{pathname === "/manage-zadachi" ? "•" : ""}</span>
              Manage Zadachi
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
