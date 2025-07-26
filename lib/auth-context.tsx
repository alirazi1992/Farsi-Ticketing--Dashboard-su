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
  isLoading: boolean
  login: (email: string, password: string, role?: string) => Promise<boolean>
  register: (userData: {
    name: string
    email: string
    phone?: string
    department?: string
    role: string
    password: string
  }) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users for demonstration with email/password/role
const mockUsers: User[] = [
  {
    id: "1",
    name: "احمد محمدی",
    email: "ahmad@company.com",
    role: "client",
    department: "حسابداری",
    phone: "09123456789",
  },
  {
    id: "2",
    name: "علی تکنسین",
    email: "ali@company.com",
    role: "technician",
    department: "پشتیبانی فنی",
    phone: "09123456788",
  },
  {
    id: "3",
    name: "مدیر سیستم",
    email: "admin@company.com",
    role: "admin",
    department: "مدیریت",
    phone: "09123456787",
  },
]

// Mock credentials
const mockCredentials: Record<string, { password: string; role: string }> = {
  "ahmad@company.com": { password: "123456", role: "client" },
  "ali@company.com": { password: "123456", role: "technician" },
  "admin@company.com": { password: "123456", role: "admin" },
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem("user")
      }
    }
  }, [])

  const login = async (email: string, password: string, role?: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      const credentials = mockCredentials[email]

      if (credentials && credentials.password === password) {
        // If role is provided, check if it matches
        if (role && credentials.role !== role) {
          setIsLoading(false)
          return false
        }

        const userData = mockUsers.find((u) => u.email === email)
        if (userData) {
          setUser(userData)
          localStorage.setItem("user", JSON.stringify(userData))
          setIsLoading(false)
          return true
        }
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

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    try {
      // Check if user already exists
      if (mockCredentials[userData.email]) {
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

      // Add to mock data (in real app, this would be API call)
      mockUsers.push(newUser)
      mockCredentials[userData.email] = {
        password: userData.password,
        role: userData.role,
      }

      setUser(newUser)
      localStorage.setItem("user", JSON.stringify(newUser))
      setIsLoading(false)
      return true
    } catch (error) {
      setIsLoading(false)
      return false
    }
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
        isLoading,
        login,
        register,
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
