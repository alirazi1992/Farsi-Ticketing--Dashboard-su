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
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    name: "مدیر سیستم",
    email: "admin@company.com",
    role: "admin",
    department: "IT",
    phone: "09123456789",
  },
  {
    id: "2",
    name: "علی احمدی",
    email: "ali@company.com",
    role: "technician",
    department: "IT Support",
    phone: "09123456788",
  },
  {
    id: "3",
    name: "احمد محمدی",
    email: "ahmad@company.com",
    role: "client",
    department: "حسابداری",
    phone: "09123456787",
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    setIsLoading(true)

    // Convert role from Persian to English
    const roleMap: { [key: string]: string } = {
      مدیر: "admin",
      تکنسین: "technician",
      کاربر: "client",
    }

    const englishRole = roleMap[role] || role

    // Find user by email and role
    const foundUser = mockUsers.find((u) => u.email === email && u.role === englishRole)

    // Simple password check (in real app, this would be hashed)
    if (foundUser && password === "123456") {
      setUser(foundUser)
      localStorage.setItem("currentUser", JSON.stringify(foundUser))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
