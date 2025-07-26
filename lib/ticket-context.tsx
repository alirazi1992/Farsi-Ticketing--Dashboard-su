"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

interface TicketResponse {
  id: string
  text: string
  author: string
  timestamp: string
  type: "client" | "technician" | "admin"
}

interface Ticket {
  id: string
  title: string
  description: string
  category: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "open" | "in-progress" | "resolved"
  clientName: string
  clientEmail: string
  clientPhone: string
  clientDepartment: string
  assignedTo: string | null
  assignedTechnicianName: string | null
  createdAt: string
  updatedAt: string
  responses: TicketResponse[]
  resolution?: string
  estimatedTime?: string
  actualTime?: string
}

interface TicketContextType {
  tickets: Ticket[]
  addTicket: (ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "responses">) => void
  updateTicket: (id: string, updates: Partial<Ticket>) => void
  assignTicket: (ticketId: string, technicianId: string, technicianName: string) => void
  addResponse: (ticketId: string, response: Omit<TicketResponse, "id" | "timestamp">) => void
  getTicketsByUser: (userEmail: string) => Ticket[]
  getTicketsByTechnician: (technicianId: string) => Ticket[]
}

const TicketContext = createContext<TicketContextType | undefined>(undefined)

// Mock initial tickets
const initialTickets: Ticket[] = [
  {
    id: "TKT-001",
    title: "مشکل در سیستم ایمیل",
    description: "کاربران قادر به دریافت ایمیل نیستند و پیام‌های خطا دریافت می‌کنند",
    category: "email",
    priority: "high",
    status: "open",
    clientName: "احمد محمدی",
    clientEmail: "ahmad@company.com",
    clientPhone: "09123456789",
    clientDepartment: "IT",
    assignedTo: null,
    assignedTechnicianName: null,
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    responses: [],
  },
  {
    id: "TKT-002",
    title: "خرابی پرینتر اداری",
    description: "پرینتر طبقه دوم کار نمی‌کند و کاغذ گیر می‌کند",
    category: "hardware",
    priority: "medium",
    status: "in-progress",
    clientName: "سارا احمدی",
    clientEmail: "sara@company.com",
    clientPhone: "09987654321",
    clientDepartment: "HR",
    assignedTo: "tech-001",
    assignedTechnicianName: "علی تکنسین",
    createdAt: "2024-01-15T09:15:00Z",
    updatedAt: "2024-01-15T11:20:00Z",
    responses: [
      {
        id: "resp-001",
        text: "مشکل بررسی شد. قطعه جدید سفارش داده شده است.",
        author: "علی تکنسین",
        timestamp: "2024-01-15T11:20:00Z",
        type: "technician",
      },
    ],
  },
  {
    id: "TKT-003",
    title: "مشکل دسترسی به سیستم",
    description: "کاربر نمی‌تواند وارد سیستم شود و پیام خطای احراز هویت دریافت می‌کند",
    category: "access",
    priority: "urgent",
    status: "resolved",
    clientName: "فاطمه کریمی",
    clientEmail: "fateme@company.com",
    clientPhone: "09112233445",
    clientDepartment: "Finance",
    assignedTo: "tech-002",
    assignedTechnicianName: "محمد حسینی",
    createdAt: "2024-01-15T08:45:00Z",
    updatedAt: "2024-01-15T12:30:00Z",
    responses: [
      {
        id: "resp-002",
        text: "رمز عبور ریست شد و دسترسی بازیابی گردید.",
        author: "محمد حسینی",
        timestamp: "2024-01-15T12:30:00Z",
        type: "technician",
      },
    ],
    resolution: "رمز عبور کاربر ریست شد و مشکل دسترسی حل گردید.",
    actualTime: "45 دقیقه",
  },
]

export function TicketProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets)

  const addTicket = (ticketData: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "responses">) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: `TKT-${String(tickets.length + 1).padStart(3, "0")}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responses: [],
    }
    setTickets((prev) => [newTicket, ...prev])
  }

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id
          ? {
              ...ticket,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : ticket,
      ),
    )
  }

  const assignTicket = (ticketId: string, technicianId: string, technicianName: string) => {
    updateTicket(ticketId, {
      assignedTo: technicianId,
      assignedTechnicianName: technicianName,
      status: "in-progress",
    })
  }

  const addResponse = (ticketId: string, response: Omit<TicketResponse, "id" | "timestamp">) => {
    const newResponse: TicketResponse = {
      ...response,
      id: `resp-${Date.now()}`,
      timestamp: new Date().toISOString(),
    }

    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              responses: [...ticket.responses, newResponse],
              updatedAt: new Date().toISOString(),
            }
          : ticket,
      ),
    )
  }

  const getTicketsByUser = (userEmail: string) => {
    return tickets.filter((ticket) => ticket.clientEmail === userEmail)
  }

  const getTicketsByTechnician = (technicianId: string) => {
    return tickets.filter((ticket) => ticket.assignedTo === technicianId)
  }

  const value = {
    tickets,
    addTicket,
    updateTicket,
    assignTicket,
    addResponse,
    getTicketsByUser,
    getTicketsByTechnician,
  }

  return <TicketContext.Provider value={value}>{children}</TicketContext.Provider>
}

export function useTickets() {
  const context = useContext(TicketContext)
  if (context === undefined) {
    throw new Error("useTickets must be used within a TicketProvider")
  }
  return context
}
