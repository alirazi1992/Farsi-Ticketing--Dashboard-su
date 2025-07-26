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
  register: (userData: {
    name: string
    email: string
    phone?: string
    department?: string
    role: string
    password: string
  }) => Promise<boolean>
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
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem("currentUser")
      }
    }
  }, [])

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      // Convert role from Persian to English if needed
      const roleMap: { [key: string]: string } = {
        مدیر: "admin",
        تکنسین: "technician",
        کاربر: "client",
        admin: "admin",
        technician: "technician",
        client: "client",
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
    } catch (error) {
      setIsLoading(false)
      return false
    }
  }

  const register = async (userData: {
    name: string
    email: string
    phone?: string
    department?: string
    role: string
    password: string
  }): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      // Check if user already exists
      const existingUser = mockUsers.find((u) => u.email === userData.email)
      if (existingUser) {
        setIsLoading(false)
        return false
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        role: userData.role as "admin" | "technician" | "client",
        department: userData.department,
        phone: userData.phone,
      }

      // Add to mock users (in real app, this would be API call)
      mockUsers.push(newUser)

      setUser(newUser)
      localStorage.setItem("currentUser", JSON.stringify(newUser))
      setIsLoading(false)
      return true
    } catch (error) {
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
  }

  return <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
