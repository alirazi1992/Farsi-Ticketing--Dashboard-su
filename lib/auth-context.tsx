"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface User {
  id: string
  name: string
  email: string
  role: "client" | "engineer" | "admin"
  avatar?: string
  phone?: string
  department?: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string, role?: "client" | "engineer") => Promise<boolean>
  register: (userData: RegisterData) => Promise<boolean>
  logout: () => void
  updateProfile: (data: Partial<User>) => Promise<boolean>
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>
  isLoading: boolean
}

interface RegisterData {
  name: string
  email: string
  password: string
  phone: string
  department?: string
  role: "client"
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users database
const mockUsers: (User & { password: string })[] = [
  {
    id: "1",
    name: "احمد محمدی",
    email: "ahmad@company.com",
    password: "123456",
    role: "client",
    phone: "09123456789",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    name: "علی تکنسین",
    email: "ali@company.com",
    password: "123456",
    role: "engineer",
    department: "IT Support",
    phone: "09123456788",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    name: "مدیر سیستم",
    email: "admin@company.com",
    password: "123456",
    role: "admin",
    department: "IT Management",
    phone: "09123456787",
    createdAt: "2024-01-01T00:00:00Z",
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
      } catch (error) {
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string, role?: "client" | "engineer"): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = mockUsers.find((u) => {
      if (role) {
        return (
          u.email === email &&
          u.password === password &&
          (role === "engineer" ? u.role === "engineer" || u.role === "admin" : u.role === "client")
        )
      }
      return u.email === email && u.password === password
    })

    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const register = async (userData: RegisterData): Promise<boolean> => {
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
    const newUser: User & { password: string } = {
      id: (mockUsers.length + 1).toString(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: userData.role,
      phone: userData.phone,
      department: userData.department,
      createdAt: new Date().toISOString(),
    }

    // Add to mock database
    mockUsers.push(newUser)

    setIsLoading(false)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    if (!user) return false

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const updatedUser = { ...user, ...data }
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))

    setIsLoading(false)
    return true
  }

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) return false

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    const foundUser = mockUsers.find((u) => u.id === user.id)
    if (foundUser && foundUser.password === currentPassword) {
      foundUser.password = newPassword
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
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

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
