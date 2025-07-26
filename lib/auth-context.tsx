"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  phone?: string
  department?: string
  role: "client" | "engineer" | "admin"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role?: string) => Promise<boolean>
  register: (userData: {
    name: string
    email: string
    phone: string
    department: string
    role: string
    password: string
  }) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users database with all three roles
const mockUsers: (User & { password: string })[] = [
  // Client Users
  {
    id: "client-001",
    name: "احمد محمدی",
    email: "ahmad@company.com",
    phone: "09123456789",
    department: "IT",
    role: "client",
    password: "123456",
  },
  {
    id: "client-002",
    name: "سارا احمدی",
    email: "sara@company.com",
    phone: "09123456788",
    department: "HR",
    role: "client",
    password: "123456",
  },
  // Technician/Engineer Users
  {
    id: "tech-001",
    name: "علی تکنسین",
    email: "ali@company.com",
    phone: "09123456787",
    department: "IT",
    role: "engineer",
    password: "123456",
  },
  {
    id: "tech-002",
    name: "محمد حسینی",
    email: "mohammad@company.com",
    phone: "09123456786",
    department: "IT",
    role: "engineer",
    password: "123456",
  },
  {
    id: "tech-003",
    name: "سارا قاسمی",
    email: "sara.ghasemi@company.com",
    phone: "09123456785",
    department: "IT",
    role: "engineer",
    password: "123456",
  },
  // Admin Users
  {
    id: "admin-001",
    name: "مدیر سیستم",
    email: "admin@company.com",
    phone: "09123456784",
    department: "IT",
    role: "admin",
    password: "123456",
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, role?: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = mockUsers.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      // If role is specified, check if it matches
      if (role && role === "technician" && foundUser.role !== "engineer") {
        setIsLoading(false)
        return false
      }
      if (role && role === "client" && foundUser.role !== "client") {
        setIsLoading(false)
        return false
      }
      if (role && role === "admin" && foundUser.role !== "admin") {
        setIsLoading(false)
        return false
      }

      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const register = async (userData: {
    name: string
    email: string
    phone: string
    department: string
    role: string
    password: string
  }): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === userData.email)
    if (existingUser) {
      setIsLoading(false)
      return false
    }

    // Create new user
    const newUser = {
      id: `${userData.role}-${mockUsers.length + 1}`.padStart(3, "0"),
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      department: userData.department,
      role: userData.role as "client" | "engineer" | "admin",
      password: userData.password,
    }

    // Add to mock database
    mockUsers.push(newUser)

    // Auto-login the new user
    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    localStorage.setItem("user", JSON.stringify(userWithoutPassword))

    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
