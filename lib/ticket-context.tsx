"use client"

import type React from "react"
import { createContext, useContext, useState } from "react"

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
  clientPhone?: string
  assignedTo?: string
  assignedTechnicianName?: string
  createdAt: Date
  updatedAt: Date
  attachments?: string[]
  comments?: TicketComment[]
  estimatedTime?: number
  actualTime?: number
}

export interface TicketComment {
  id: string
  ticketId: string
  userId: string
  userName: string
  userRole: "client" | "technician" | "admin"
  message: string
  createdAt: Date
  isInternal?: boolean
}

interface TicketContextType {
  tickets: Ticket[]
  addTicket: (ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt">) => void
  updateTicket: (id: string, updates: Partial<Ticket>) => void
  deleteTicket: (id: string) => void
  getTicketById: (id: string) => Ticket | undefined
  getTicketsByUser: (userEmail: string) => Ticket[]
  getTicketsByTechnician: (technicianId: string) => Ticket[]
  addComment: (ticketId: string, comment: Omit<TicketComment, "id" | "createdAt">) => void
  assignTicket: (ticketId: string, technicianId: string, technicianName: string) => void
}

const TicketContext = createContext<TicketContextType | undefined>(undefined)

// Sample tickets for demonstration
const sampleTickets: Ticket[] = [
  {
    id: "1",
    title: "مشکل در اتصال به اینترنت",
    description: "اینترنت دفتر کار نمی‌کند و نمی‌توانم به سیستم‌های داخلی دسترسی داشته باشم",
    category: "شبکه",
    priority: "high",
    status: "open",
    clientId: "3",
    clientName: "احمد محمدی",
    clientEmail: "ahmad@company.com",
    clientPhone: "09123456787",
    createdAt: new Date(2024, 0, 15, 9, 30),
    updatedAt: new Date(2024, 0, 15, 9, 30),
    comments: [],
  },
  {
    id: "2",
    title: "نصب نرم‌افزار حسابداری",
    description: "نیاز به نصب نرم‌افزار حسابداری جدید روی سیستم دارم",
    category: "نرم‌افزار",
    priority: "medium",
    status: "in-progress",
    clientId: "3",
    clientName: "احمد محمدی",
    clientEmail: "ahmad@company.com",
    clientPhone: "09123456787",
    assignedTo: "2",
    assignedTechnicianName: "علی احمدی",
    createdAt: new Date(2024, 0, 14, 14, 15),
    updatedAt: new Date(2024, 0, 15, 10, 0),
    comments: [
      {
        id: "c1",
        ticketId: "2",
        userId: "2",
        userName: "علی احمدی",
        userRole: "technician",
        message: "در حال بررسی نیازمندی‌های سیستم هستم",
        createdAt: new Date(2024, 0, 15, 10, 0),
      },
    ],
  },
  {
    id: "3",
    title: "تعمیر پرینتر",
    description: "پرینتر اداری کاغذ گیر می‌کند و نیاز به تعمیر دارد",
    category: "سخت‌افزار",
    priority: "low",
    status: "resolved",
    clientId: "3",
    clientName: "احمد محمدی",
    clientEmail: "ahmad@company.com",
    clientPhone: "09123456787",
    assignedTo: "2",
    assignedTechnicianName: "علی احمدی",
    createdAt: new Date(2024, 0, 12, 11, 0),
    updatedAt: new Date(2024, 0, 13, 16, 30),
    comments: [],
  },
]

export function TicketProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>(sampleTickets)

  const addTicket = (ticketData: Omit<Ticket, "id" | "createdAt" | "updatedAt">) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
    }
    setTickets((prev) => [newTicket, ...prev])
  }

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    setTickets((prev) =>
      prev.map((ticket) => (ticket.id === id ? { ...ticket, ...updates, updatedAt: new Date() } : ticket)),
    )
  }

  const deleteTicket = (id: string) => {
    setTickets((prev) => prev.filter((ticket) => ticket.id !== id))
  }

  const getTicketById = (id: string) => {
    return tickets.find((ticket) => ticket.id === id)
  }

  const getTicketsByUser = (userEmail: string) => {
    return tickets.filter((ticket) => ticket.clientEmail === userEmail)
  }

  const getTicketsByTechnician = (technicianId: string) => {
    return tickets.filter((ticket) => ticket.assignedTo === technicianId)
  }

  const addComment = (ticketId: string, commentData: Omit<TicketComment, "id" | "createdAt">) => {
    const newComment: TicketComment = {
      ...commentData,
      id: Date.now().toString(),
      createdAt: new Date(),
    }

    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              comments: [...(ticket.comments || []), newComment],
              updatedAt: new Date(),
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

  return (
    <TicketContext.Provider
      value={{
        tickets,
        addTicket,
        updateTicket,
        deleteTicket,
        getTicketById,
        getTicketsByUser,
        getTicketsByTechnician,
        addComment,
        assignTicket,
      }}
    >
      {children}
    </TicketContext.Provider>
  )
}

export function useTickets() {
  const context = useContext(TicketContext)
  if (context === undefined) {
    throw new Error("useTickets must be used within a TicketProvider")
  }
  return context
}
