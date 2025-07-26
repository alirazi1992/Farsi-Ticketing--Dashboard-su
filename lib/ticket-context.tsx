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
  responses: Response[]
  resolution?: string
  estimatedTime?: string
  actualTime?: string
  attachments?: any[]
}

interface Response {
  id: string
  text: string
  author: string
  timestamp: string
  type: "client" | "technician" | "admin"
}

interface TicketContextType {
  tickets: Ticket[]
  addTicket: (ticket: Omit<Ticket, "id" | "responses">) => void
  updateTicket: (ticketId: string, updates: Partial<Ticket>) => void
  deleteTicket: (ticketId: string) => void
  getTicketsByUser: (userEmail: string) => Ticket[]
  getTicketsByTechnician: (technicianId: string) => Ticket[]
  assignTicket: (ticketId: string, technicianId: string, technicianName: string) => void
  addResponse: (ticketId: string, response: Omit<Response, "id" | "timestamp">) => void
}

const TicketContext = createContext<TicketContextType | undefined>(undefined)

export function useTickets() {
  const context = useContext(TicketContext)
  if (context === undefined) {
    throw new Error("useTickets must be used within a TicketProvider")
  }
  return context
}

export function TicketProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([])

  // Load tickets from localStorage on mount
  useEffect(() => {
    const savedTickets = localStorage.getItem("tickets")
    if (savedTickets) {
      try {
        setTickets(JSON.parse(savedTickets))
      } catch (error) {
        console.error("Error loading tickets:", error)
      }
    } else {
      // Initialize with sample tickets
      const sampleTickets: Ticket[] = [
        {
          id: "TCK-001",
          title: "مشکل اتصال اینترنت",
          description: "اینترنت دفتر کار نمی‌کند و نمی‌توانم به سیستم‌های شرکت دسترسی داشته باشم",
          category: "network",
          priority: "high",
          status: "open",
          clientName: "احمد محمدی",
          clientEmail: "ahmad@company.com",
          clientPhone: "09987654321",
          clientDepartment: "HR",
          assignedTo: null,
          assignedTechnicianName: null,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          responses: [],
        },
        {
          id: "TCK-002",
          title: "چاپگر کار نمی‌کند",
          description: "چاپگر طبقه دوم اصلاً چاپ نمی‌کند و پیام خطا می‌دهد",
          category: "hardware",
          priority: "medium",
          status: "in-progress",
          clientName: "سارا حسینی",
          clientEmail: "sara@company.com",
          clientPhone: "09123456789",
          clientDepartment: "Finance",
          assignedTo: "tech-001",
          assignedTechnicianName: "علی احمدی",
          createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          updatedAt: new Date().toISOString(),
          responses: [
            {
              id: "resp-001",
              text: "تیکت شما دریافت شد. در حال بررسی مشکل چاپگر هستیم.",
              author: "علی احمدی",
              timestamp: new Date().toISOString(),
              type: "technician",
            },
          ],
        },
      ]
      setTickets(sampleTickets)
    }
  }, [])

  // Save tickets to localStorage whenever tickets change
  useEffect(() => {
    localStorage.setItem("tickets", JSON.stringify(tickets))
  }, [tickets])

  const generateTicketId = (): string => {
    const ticketNumber = tickets.length + 1
    return `TCK-${ticketNumber.toString().padStart(3, "0")}`
  }

  const addTicket = (ticketData: Omit<Ticket, "id" | "responses">) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: generateTicketId(),
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

  const getTicketsByUser = (userEmail: string): Ticket[] => {
    return tickets.filter((ticket) => ticket.clientEmail === userEmail)
  }

  const getTicketsByTechnician = (technicianId: string): Ticket[] => {
    return tickets.filter((ticket) => ticket.assignedTo === technicianId)
  }

  const assignTicket = (ticketId: string, technicianId: string, technicianName: string) => {
    updateTicket(ticketId, {
      assignedTo: technicianId,
      assignedTechnicianName: technicianName,
      status: "in-progress",
    })
  }

  const addResponse = (ticketId: string, responseData: Omit<Response, "id" | "timestamp">) => {
    const newResponse: Response = {
      ...responseData,
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

  return (
    <TicketContext.Provider
      value={{
        tickets,
        addTicket,
        updateTicket,
        deleteTicket,
        getTicketsByUser,
        getTicketsByTechnician,
        assignTicket,
        addResponse,
      }}
    >
      {children}
    </TicketContext.Provider>
  )
}
