"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  phone?: string
  department?: string
  role: "client" | "technician" | "admin"
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role?: string) => Promise<boolean>
  register: (userData: any) => Promise<boolean>
  logout: () => void
  updateProfile: (data: any) => Promise<boolean>
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users database
const mockUsers: User[] = [
  {
    id: "user-001",
    name: "احمد محمدی",
    email: "ahmad@company.com",
    phone: "09123456789",
    department: "فناوری اطلاعات",
    role: "client",
  },
  {
    id: "tech-001",
    name: "علی احمدی",
    email: "ali@company.com",
    phone: "09123456788",
    department: "پشتیبانی فنی",
    role: "technician",
  },
  {
    id: "admin-001",
    name: "مدیر سیستم",
    email: "admin@company.com",
    phone: "09123456787",
    department: "مدیریت",
    role: "admin",
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("currentUser")
      }
    }
  }, [])

  const login = async (email: string, password: string, role?: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      // Find user by email and role
      const foundUser = mockUsers.find((u) => {
        const emailMatch = u.email.toLowerCase() === email.toLowerCase()
        const roleMatch = !role || u.role === role
        return emailMatch && roleMatch
      })

      if (foundUser && password === "123456") {
        setUser(foundUser)
        localStorage.setItem("currentUser", JSON.stringify(foundUser))
        return true
      }
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: any): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      // Check if user already exists
      const existingUser = mockUsers.find((u) => u.email.toLowerCase() === userData.email.toLowerCase())
      if (existingUser) {
        return false
      }

      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        department: userData.department,
        role: userData.role,
      }

      mockUsers.push(newUser)
      setUser(newUser)
      localStorage.setItem("currentUser", JSON.stringify(newUser))
      return true
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
  }

  const updateProfile = async (data: any): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    try {
      if (!user) return false

      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))

      // Update in mock database
      const userIndex = mockUsers.findIndex((u) => u.id === user.id)
      if (userIndex !== -1) {
        mockUsers[userIndex] = updatedUser
      }

      return true
    } finally {
      setIsLoading(false)
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      // In a real app, you would verify the current password
      if (currentPassword === "123456") {
        // Password would be updated in the backend
        return true
      }
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
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
