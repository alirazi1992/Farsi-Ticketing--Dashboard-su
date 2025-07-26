"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Ticket {
  id: string
  title: string
  description: string
  category: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "open" | "in-progress" | "resolved" | "closed"
  clientId: string
  clientName: string
  clientEmail: string
  clientPhone: string
  clientDepartment: string
  assignedTo?: string
  assignedTechnicianName?: string
  createdAt: string
  updatedAt: string
  responses: TicketResponse[]
  resolution?: string
  actualTime?: string
  estimatedTime?: string
  attachments?: string[]
}

export interface TicketResponse {
  id: string
  ticketId: string
  text: string
  author: string
  type: "client" | "technician" | "admin"
  timestamp: string
}

interface TicketContextType {
  tickets: Ticket[]
  addTicket: (ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "responses">) => void
  updateTicket: (ticketId: string, updates: Partial<Ticket>) => void
  deleteTicket: (ticketId: string) => void
  getTicketById: (ticketId: string) => Ticket | undefined
  getTicketsByUser: (userEmail: string) => Ticket[]
  getTicketsByTechnician: (technicianId: string) => Ticket[]
  getTicketsByClient: (clientId: string) => Ticket[]
  assignTicket: (ticketId: string, technicianId: string, technicianName: string) => void
  addResponse: (ticketId: string, response: Omit<TicketResponse, "id" | "ticketId" | "timestamp">) => void
}

const TicketContext = createContext<TicketContextType | undefined>(undefined)

// Sample tickets for demonstration
const sampleTickets: Ticket[] = [
  {
    id: "TKT-001",
    title: "مشکل در اتصال به اینترنت",
    description: "اینترنت دفتر کار نمی‌کند و نمی‌توانم به سایت‌های مورد نیاز دسترسی پیدا کنم.",
    category: "network",
    priority: "high",
    status: "open",
    clientId: "3",
    clientName: "احمد محمدی",
    clientEmail: "ahmad@company.com",
    clientPhone: "09123456787",
    clientDepartment: "حسابداری",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    responses: [],
  },
  {
    id: "TKT-002",
    title: "نصب نرم‌افزار حسابداری",
    description: "نیاز به نصب نرم‌افزار حسابداری جدید روی سیستم دارم.",
    category: "software",
    priority: "medium",
    status: "in-progress",
    clientId: "3",
    clientName: "احمد محمدی",
    clientEmail: "ahmad@company.com",
    clientPhone: "09123456787",
    clientDepartment: "حسابداری",
    assignedTo: "2",
    assignedTechnicianName: "علی احمدی",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    responses: [
      {
        id: "RES-001",
        ticketId: "TKT-002",
        text: "سلام، نرم‌افزار مورد نظر شما را بررسی کردم. لطفاً زمان مناسب برای نصب را اعلام کنید.",
        author: "علی احمدی",
        type: "technician",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "TKT-003",
    title: "مشکل در پرینتر",
    description: "پرینتر اداری کاغذ گیر می‌کند و کیفیت چاپ مناسب نیست.",
    category: "hardware",
    priority: "low",
    status: "resolved",
    clientId: "3",
    clientName: "احمد محمدی",
    clientEmail: "ahmad@company.com",
    clientPhone: "09123456787",
    clientDepartment: "حسابداری",
    assignedTo: "2",
    assignedTechnicianName: "علی احمدی",
    resolution: "پرینتر تمیز شد و کارتریج جدید نصب گردید. مشکل برطرف شد.",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    responses: [
      {
        id: "RES-002",
        ticketId: "TKT-003",
        text: "مشکل پرینتر بررسی و برطرف شد. کارتریج جدید نصب گردید.",
        author: "علی احمدی",
        type: "technician",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
]

export function TicketProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([])

  useEffect(() => {
    // Load tickets from localStorage or use sample data
    const savedTickets = localStorage.getItem("tickets")
    if (savedTickets) {
      try {
        setTickets(JSON.parse(savedTickets))
      } catch (error) {
        setTickets(sampleTickets)
      }
    } else {
      setTickets(sampleTickets)
    }
  }, [])

  useEffect(() => {
    // Save tickets to localStorage whenever tickets change
    localStorage.setItem("tickets", JSON.stringify(tickets))
  }, [tickets])

  const addTicket = (ticketData: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "responses">) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: `TKT-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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

  const deleteTicket = (ticketId: string) => {
    setTickets((prev) => prev.filter((ticket) => ticket.id !== ticketId))
  }

  const getTicketById = (ticketId: string) => {
    return tickets.find((ticket) => ticket.id === ticketId)
  }

  const getTicketsByUser = (userEmail: string) => {
    return tickets.filter((ticket) => ticket.clientEmail === userEmail)
  }

  const getTicketsByTechnician = (technicianId: string) => {
    return tickets.filter((ticket) => ticket.assignedTo === technicianId)
  }

  const getTicketsByClient = (clientId: string) => {
    return tickets.filter((ticket) => ticket.clientId === clientId)
  }

  const assignTicket = (ticketId: string, technicianId: string, technicianName: string) => {
    updateTicket(ticketId, {
      assignedTo: technicianId,
      assignedTechnicianName: technicianName,
      status: "in-progress",
    })
  }

  const addResponse = (ticketId: string, responseData: Omit<TicketResponse, "id" | "ticketId" | "timestamp">) => {
    const newResponse: TicketResponse = {
      ...responseData,
      id: `RES-${Date.now()}`,
      ticketId,
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

  const value: TicketContextType = {
    tickets,
    addTicket,
    updateTicket,
    deleteTicket,
    getTicketById,
    getTicketsByUser,
    getTicketsByTechnician,
    getTicketsByClient,
    assignTicket,
    addResponse,
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
