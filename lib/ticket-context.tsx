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
  assignedTo?: string
  assignedTechnicianName?: string
  createdAt: Date
  updatedAt: Date
  resolvedAt?: Date
  attachments?: string[]
  comments?: TicketComment[]
  estimatedTime?: number
  actualTime?: number
}

export interface TicketComment {
  id: string
  ticketId: string
  authorId: string
  authorName: string
  content: string
  createdAt: Date
  isInternal: boolean
}

interface TicketContextType {
  tickets: Ticket[]
  addTicket: (ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt">) => void
  updateTicket: (id: string, updates: Partial<Ticket>) => void
  deleteTicket: (id: string) => void
  getTicketsByClient: (clientId: string) => Ticket[]
  getTicketsByTechnician: (technicianId: string) => Ticket[]
  addComment: (ticketId: string, comment: Omit<TicketComment, "id" | "createdAt">) => void
}

const TicketContext = createContext<TicketContextType | undefined>(undefined)

export function TicketProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([])

  useEffect(() => {
    const savedTickets = localStorage.getItem("tickets")
    if (savedTickets) {
      const parsedTickets = JSON.parse(savedTickets).map((ticket: any) => ({
        ...ticket,
        createdAt: new Date(ticket.createdAt),
        updatedAt: new Date(ticket.updatedAt),
        resolvedAt: ticket.resolvedAt ? new Date(ticket.resolvedAt) : undefined,
        comments:
          ticket.comments?.map((comment: any) => ({
            ...comment,
            createdAt: new Date(comment.createdAt),
          })) || [],
      }))
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
          category: "شبکه",
          subcategory: "اتصال اینترنت",
          clientId: "3",
          clientName: "سارا محمدی",
          clientEmail: "sara.mohammadi@company.com",
          clientPhone: "09123456787",
          createdAt: new Date(),
          updatedAt: new Date(),
          comments: [],
        },
        {
          id: "2",
          title: "نصب نرم‌افزار جدید",
          description: "نیاز به نصب نرم‌افزار حسابداری جدید دارم.",
          priority: "medium",
          status: "in-progress",
          category: "نرم‌افزار",
          subcategory: "نصب",
          clientId: "3",
          clientName: "سارا محمدی",
          clientEmail: "sara.mohammadi@company.com",
          clientPhone: "09123456787",
          assignedTo: "2",
          assignedTechnicianName: "علی احمدی",
          createdAt: new Date(Date.now() - 86400000),
          updatedAt: new Date(),
          comments: [],
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

  const addTicket = (ticketData: Omit<Ticket, "id" | "createdAt" | "updatedAt">) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
    }
    const newTickets = [...tickets, newTicket]
    saveTickets(newTickets)
  }

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    const newTickets = tickets.map((ticket) =>
      ticket.id === id ? { ...ticket, ...updates, updatedAt: new Date() } : ticket,
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

  const getTicketsByTechnician = (technicianId: string) => {
    return tickets.filter((ticket) => ticket.assignedTo === technicianId)
  }

  const addComment = (ticketId: string, commentData: Omit<TicketComment, "id" | "createdAt">) => {
    const newComment: TicketComment = {
      ...commentData,
      id: Date.now().toString(),
      createdAt: new Date(),
    }

    const newTickets = tickets.map((ticket) =>
      ticket.id === ticketId
        ? {
            ...ticket,
            comments: [...(ticket.comments || []), newComment],
            updatedAt: new Date(),
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
        getTicketsByTechnician,
        addComment,
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
