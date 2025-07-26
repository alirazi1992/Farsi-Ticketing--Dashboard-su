"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface Ticket {
  id: string
  title: string
  description: string
  category: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "open" | "in-progress" | "resolved" | "closed"
  clientName: string
  clientEmail: string
  clientPhone: string
  clientDepartment: string
  assignedTo?: string | null
  assignedTechnicianName?: string | null
  createdAt: string
  updatedAt: string
  responses: Array<{
    id: string
    text: string
    author: string
    timestamp: string
    type: "client" | "technician" | "admin"
  }>
  resolution?: string
  actualTime?: string
  estimatedTime?: string
  attachments?: any[]
}

interface TicketContextType {
  tickets: Ticket[]
  addTicket: (ticket: Omit<Ticket, "id" | "responses">) => void
  updateTicket: (ticketId: string, updates: Partial<Ticket>) => void
  assignTicket: (ticketId: string, technicianId: string, technicianName: string) => void
  addResponse: (ticketId: string, response: Omit<Ticket["responses"][0], "id" | "timestamp">) => void
  getTicketsByUser: (userEmail: string) => Ticket[]
  getTicketsByTechnician: (technicianId: string) => Ticket[]
}

const TicketContext = createContext<TicketContextType | undefined>(undefined)

// Mock tickets data
const initialTickets: Ticket[] = [
  {
    id: "TKT-001",
    title: "مشکل اتصال به اینترنت",
    description: "اینترنت در بخش حسابداری قطع شده و کارمندان نمی‌توانند به سیستم‌های آنلاین دسترسی داشته باشند.",
    category: "network",
    priority: "high",
    status: "open",
    clientName: "احمد محمدی",
    clientEmail: "ahmad@company.com",
    clientPhone: "09123456789",
    clientDepartment: "حسابداری",
    assignedTo: null,
    assignedTechnicianName: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    responses: [],
  },
  {
    id: "TKT-002",
    title: "چاپگر کار نمی‌کند",
    description: "چاپگر طبقه دوم هیچ خروجی نمی‌دهد و چراغ قرمز روشن است.",
    category: "hardware",
    priority: "medium",
    status: "in-progress",
    clientName: "احمد محمدی",
    clientEmail: "ahmad@company.com",
    clientPhone: "09123456789",
    clientDepartment: "فناوری اطلاعات",
    assignedTo: "tech-001",
    assignedTechnicianName: "علی احمدی",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
    responses: [
      {
        id: "resp-001",
        text: "تیکت شما دریافت شد و در حال بررسی است.",
        author: "علی احمدی",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        type: "technician",
      },
    ],
  },
]

export function TicketProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets)

  // Load tickets from localStorage on mount
  useEffect(() => {
    const savedTickets = localStorage.getItem("tickets")
    if (savedTickets) {
      try {
        setTickets(JSON.parse(savedTickets))
      } catch (error) {
        console.error("Error parsing saved tickets:", error)
      }
    }
  }, [])

  // Save tickets to localStorage whenever tickets change
  useEffect(() => {
    localStorage.setItem("tickets", JSON.stringify(tickets))
  }, [tickets])

  const addTicket = (ticketData: Omit<Ticket, "id" | "responses">) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: `TKT-${String(tickets.length + 1).padStart(3, "0")}`,
      responses: [],
    }
    setTickets((prev) => [newTicket, ...prev])
  }

  const updateTicket = (ticketId: string, updates: Partial<Ticket>) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
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

  const addResponse = (ticketId: string, response: Omit<Ticket["responses"][0], "id" | "timestamp">) => {
    const newResponse = {
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

  const value: TicketContextType = {
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
