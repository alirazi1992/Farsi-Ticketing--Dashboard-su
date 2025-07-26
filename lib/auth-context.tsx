"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "technician" | "client"
  phone?: string
  department?: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role?: string) => Promise<boolean>
  register: (userData: any) => Promise<boolean>
  logout: () => void
  updateProfile: (updates: Partial<User>) => Promise<boolean>
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Mock users database
  const mockUsers: User[] = [
    {
      id: "admin-001",
      name: "مدیر سیستم",
      email: "admin@company.com",
      role: "admin",
      phone: "09121234567",
      department: "IT",
    },
    {
      id: "tech-001",
      name: "علی احمدی",
      email: "ali@company.com",
      role: "technician",
      phone: "09123456789",
      department: "IT",
    },
    {
      id: "client-001",
      name: "احمد محمدی",
      email: "ahmad@company.com",
      role: "client",
      phone: "09987654321",
      department: "HR",
    },
  ]

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("currentUser")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem("currentUser")
      }
    }
  }, [])

  const login = async (email: string, password: string, role?: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Find user by email and validate password (in real app, this would be server-side)
      const foundUser = mockUsers.find((u) => u.email === email)

      if (foundUser && password === "123456") {
        // If role is specified, validate it matches
        if (role && foundUser.role !== role) {
          return false
        }

        setUser(foundUser)
        localStorage.setItem("currentUser", JSON.stringify(foundUser))
        return true
      }

      return false
    } catch (error) {
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: any): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Check if user already exists
      const existingUser = mockUsers.find((u) => u.email === userData.email)
      if (existingUser) {
        return false
      }

      // Create new user
      const newUser: User = {
        id: `${userData.role}-${Date.now()}`,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        phone: userData.phone,
        department: userData.department,
      }

      // In a real app, this would be stored on the server
      mockUsers.push(newUser)
      setUser(newUser)
      localStorage.setItem("currentUser", JSON.stringify(newUser))

      return true
    } catch (error) {
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("currentUser")
  }

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false

    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))

      return true
    } catch (error) {
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // In real app, validate current password with server
      if (currentPassword === "123456") {
        // Password would be updated on server
        return true
      }

      return false
    } catch (error) {
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
