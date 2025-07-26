"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface Response {
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
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  category: string
  clientName: string
  clientEmail: string
  clientPhone?: string
  clientDepartment?: string
  assignedTo: string | null
  assignedTechnicianName: string | null
  createdAt: string
  updatedAt: string
  responses: Response[]
  attachments?: string[]
  estimatedTime?: string
  actualTime?: string
  resolution?: string
}

interface TicketContextType {
  tickets: Ticket[]
  addTicket: (ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "responses">) => void
  updateTicket: (ticketId: string, updates: Partial<Ticket>) => void
  addResponse: (ticketId: string, response: Omit<Response, "id" | "timestamp">) => void
  assignTicket: (ticketId: string, technicianId: string, technicianName: string) => void
  getTicketsByUser: (userEmail: string) => Ticket[]
  getTicketsByTechnician: (technicianId: string) => Ticket[]
}

const TicketContext = createContext<TicketContextType | undefined>(undefined)

// Mock initial data
const initialTickets: Ticket[] = [
  {
    id: "TK-001",
    title: "مشکل در سیستم ایمیل سازمانی",
    description: "کاربران قادر به دریافت ایمیل نیستند. پیغام خطای Authentication Failed نمایش داده می‌شود.",
    status: "in-progress",
    priority: "high",
    category: "email",
    clientName: "احمد رضایی",
    clientEmail: "ahmad@company.com",
    clientPhone: "09123456789",
    clientDepartment: "IT",
    assignedTo: "tech-001",
    assignedTechnicianName: "علی احمدی",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T11:00:00Z",
    responses: [
      {
        id: "resp-001",
        text: "مشکل بررسی شد. در حال تست تنظیمات سرور ایمیل هستم.",
        author: "علی احمدی",
        timestamp: "2024-01-15T11:00:00Z",
        type: "technician",
      },
    ],
    estimatedTime: "2 ساعت",
  },
  {
    id: "TK-002",
    title: "خرابی پرینتر اداری طبقه دوم",
    description: "پرینتر HP LaserJet کاغذ گیر می‌کند و کیفیت چاپ پایین است.",
    status: "open",
    priority: "medium",
    category: "hardware",
    clientName: "سارا محمدی",
    clientEmail: "sara@company.com",
    clientPhone: "09987654321",
    clientDepartment: "HR",
    assignedTo: "tech-001",
    assignedTechnicianName: "علی احمدی",
    createdAt: "2024-01-15T09:15:00Z",
    updatedAt: "2024-01-15T09:15:00Z",
    responses: [],
  },
  {
    id: "TK-003",
    title: "درخواست نصب نرم‌افزار Adobe Creative Suite",
    description: "نیاز به نصب مجموعه نرم‌افزارهای Adobe برای بخش طراحی دارم.",
    status: "resolved",
    priority: "low",
    category: "software",
    clientName: "فاطمه کریمی",
    clientEmail: "fateme@company.com",
    clientPhone: "09112233445",
    clientDepartment: "Design",
    assignedTo: "tech-002",
    assignedTechnicianName: "محمد حسینی",
    createdAt: "2024-01-14T14:20:00Z",
    updatedAt: "2024-01-14T16:30:00Z",
    responses: [
      {
        id: "resp-002",
        text: "نرم‌افزار با موفقیت نصب شد. لطفاً تست کنید.",
        author: "محمد حسینی",
        timestamp: "2024-01-14T16:30:00Z",
        type: "technician",
      },
    ],
    resolution: "نرم‌افزار Adobe Creative Suite نصب و فعال‌سازی شد.",
    actualTime: "1.5 ساعت",
  },
]

export function TicketProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets)

  const addTicket = (ticketData: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "responses">) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: `TK-${String(Date.now()).slice(-6)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responses: [],
    }
    setTickets((prev) => [newTicket, ...prev])
  }

  const updateTicket = (ticketId: string, updates: Partial<Ticket>) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId ? { ...ticket, ...updates, updatedAt: new Date().toISOString() } : ticket,
      ),
    )
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
              status: ticket.status === "open" ? "in-progress" : ticket.status,
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

  const getTicketsByUser = (userEmail: string) => {
    return tickets.filter((ticket) => ticket.clientEmail === userEmail)
  }

  const getTicketsByTechnician = (technicianId: string) => {
    return tickets.filter((ticket) => ticket.assignedTo === technicianId)
  }

  return (
    <TicketContext.Provider
      value={{
        tickets,
        addTicket,
        updateTicket,
        addResponse,
        assignTicket,
        getTicketsByUser,
        getTicketsByTechnician,
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
