"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  name: string
  email: string
  role: "client" | "engineer" | "admin"
  phone?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock users database with proper IDs for technician assignment
const mockUsers: User[] = [
  {
    id: "1",
    name: "احمد رضایی",
    email: "ahmad@company.com",
    role: "client",
    phone: "09123456789",
  },
  {
    id: "2",
    name: "علی تکنسین",
    email: "ali@company.com",
    role: "engineer",
    phone: "09123456790",
  },
  {
    id: "3",
    name: "مدیر سیستم",
    email: "admin@company.com",
    role: "admin",
    phone: "09123456791",
  },
  {
    id: "4",
    name: "فاطمه احمدی",
    email: "fateme@company.com",
    role: "client",
    phone: "09123456788",
  },
  {
    id: "5",
    name: "محمد کریمی",
    email: "mohammad@company.com",
    role: "client",
    phone: "09123456787",
  },
  {
    id: "6",
    name: "زهرا نوری",
    email: "zahra@company.com",
    role: "client",
    phone: "09123456786",
  },
  {
    id: "7",
    name: "علی حسینی",
    email: "ali@company.com",
    role: "client",
    phone: "09123456785",
  },
  {
    id: "8",
    name: "سارا محمدی",
    email: "sara@company.com",
    role: "client",
    phone: "09123456784",
  },
  {
    id: "9",
    name: "رضا احمدی",
    email: "reza@company.com",
    role: "client",
    phone: "09123456783",
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

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simple mock authentication - in real app, this would be an API call
    const foundUser = mockUsers.find((u) => u.email === email)

    if (foundUser && password === "123456") {
      setUser(foundUser)
      localStorage.setItem("user", JSON.stringify(foundUser))
      return true
    }

    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
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
