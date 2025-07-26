"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "technician" | "client"
  department?: string
  phone?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demonstration
const mockUsers: Record<string, User> = {
  admin: {
    id: "1",
    name: "مدیر سیستم",
    email: "admin@company.com",
    role: "admin",
    phone: "09123456789",
  },
  tech1: {
    id: "2",
    name: "علی احمدی",
    email: "ali.ahmadi@company.com",
    role: "technician",
    department: "پشتیبانی فنی",
    phone: "09123456788",
  },
  user1: {
    id: "3",
    name: "سارا محمدی",
    email: "sara.mohammadi@company.com",
    role: "client",
    department: "حسابداری",
    phone: "09123456787",
  },
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = (username: string, password: string): boolean => {
    const mockCredentials: Record<string, string> = {
      admin: "admin123",
      tech1: "tech123",
      user1: "user123",
    }

    if (mockCredentials[username] === password) {
      const userData = mockUsers[username]
      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
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
