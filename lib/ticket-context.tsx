"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Ticket {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "open" | "in-progress" | "resolved" | "closed"
  category: string
  subcategory?: string
  clientId: string
  clientName: string
  clientEmail: string
  clientPhone: string
  clientDepartment?: string
  assignedTo?: string
  assignedTechnicianName?: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  attachments?: string[]
  responses: TicketResponse[]
  estimatedTime?: number
  actualTime?: number
}

export interface TicketResponse {
  id: string
  ticketId: string
  author: string
  authorId: string
  type: "client" | "technician" | "admin"
  text: string
  timestamp: string
  isInternal?: boolean
}

interface TicketContextType {
  tickets: Ticket[]
  addTicket: (ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "responses">) => void
  updateTicket: (id: string, updates: Partial<Ticket>) => void
  deleteTicket: (id: string) => void
  getTicketsByClient: (clientId: string) => Ticket[]
  getTicketsByUser: (userEmail: string) => Ticket[]
  getTicketsByTechnician: (technicianId: string) => Ticket[]
  addResponse: (ticketId: string, response: Omit<TicketResponse, "id" | "timestamp">) => void
}

const TicketContext = createContext<TicketContextType | undefined>(undefined)

export function TicketProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([])

  useEffect(() => {
    const savedTickets = localStorage.getItem("tickets")
    if (savedTickets) {
      const parsedTickets = JSON.parse(savedTickets)
      setTickets(parsedTickets)
    } else {
      // Initialize with sample data
      const sampleTickets: Ticket[] = [
        {
          id: "1",
          title: "مشکل در اتصال به اینترنت",
          description: "کامپیوتر من نمی‌تواند به اینترنت متصل شود. لطفاً کمک کنید.",
          priority: "high",
          status: "open",
          category: "network",
          subcategory: "اتصال اینترنت",
          clientId: "3",
          clientName: "احمد محمدی",
          clientEmail: "ahmad@company.com",
          clientPhone: "09123456787",
          clientDepartment: "حسابداری",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          responses: [],
        },
        {
          id: "2",
          title: "نصب نرم‌افزار جدید",
          description: "نیاز به نصب نرم‌افزار حسابداری جدید دارم.",
          priority: "medium",
          status: "in-progress",
          category: "software",
          subcategory: "نصب",
          clientId: "3",
          clientName: "احمد محمدی",
          clientEmail: "ahmad@company.com",
          clientPhone: "09123456787",
          clientDepartment: "حسابداری",
          assignedTo: "2",
          assignedTechnicianName: "علی احمدی",
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          updatedAt: new Date().toISOString(),
          responses: [
            {
              id: "1",
              ticketId: "2",
              author: "علی احمدی",
              authorId: "2",
              type: "technician",
              text: "سلام، تیکت شما را بررسی کردم. نرم‌افزار مورد نظر را آماده نصب می‌کنم.",
              timestamp: new Date(Date.now() - 3600000).toISOString(),
            },
          ],
        },
      ]
      setTickets(sampleTickets)
      localStorage.setItem("tickets", JSON.stringify(sampleTickets))
    }
  }, [])

  const saveTickets = (newTickets: Ticket[]) => {
    setTickets(newTickets)
    localStorage.setItem("tickets", JSON.stringify(newTickets))
  }

  const addTicket = (ticketData: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "responses">) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responses: [],
    }
    const newTickets = [...tickets, newTicket]
    saveTickets(newTickets)
  }

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    const newTickets = tickets.map((ticket) =>
      ticket.id === id ? { ...ticket, ...updates, updatedAt: new Date().toISOString() } : ticket,
    )
    saveTickets(newTickets)
  }

  const deleteTicket = (id: string) => {
    const newTickets = tickets.filter((ticket) => ticket.id !== id)
    saveTickets(newTickets)
  }

  const getTicketsByClient = (clientId: string) => {
    return tickets.filter((ticket) => ticket.clientId === clientId)
  }

  const getTicketsByUser = (userEmail: string) => {
    return tickets.filter((ticket) => ticket.clientEmail === userEmail)
  }

  const getTicketsByTechnician = (technicianId: string) => {
    return tickets.filter((ticket) => ticket.assignedTo === technicianId)
  }

  const addResponse = (ticketId: string, responseData: Omit<TicketResponse, "id" | "timestamp">) => {
    const newResponse: TicketResponse = {
      ...responseData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    }

    const newTickets = tickets.map((ticket) =>
      ticket.id === ticketId
        ? {
            ...ticket,
            responses: [...ticket.responses, newResponse],
            updatedAt: new Date().toISOString(),
          }
        : ticket,
    )
    saveTickets(newTickets)
  }

  return (
    <TicketContext.Provider
      value={{
        tickets,
        addTicket,
        updateTicket,
        deleteTicket,
        getTicketsByClient,
        getTicketsByUser,
        getTicketsByTechnician,
        addResponse,
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
