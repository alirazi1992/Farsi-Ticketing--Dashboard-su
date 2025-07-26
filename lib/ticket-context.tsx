"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Ticket {
  id: string
  title: string
  description: string
  category: string
  subcategory: string
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

// Categories with subcategories
export const ticketCategories = {
  سخت‌افزار: ["کامپیوتر", "پرینتر", "تجهیزات شبکه", "مانیتور", "کیبورد و ماوس", "سایر"],
  نرم‌افزار: ["نصب", "به‌روزرسانی", "خطا", "آموزش", "مجوز", "سایر"],
  شبکه: ["اتصال اینترنت", "شبکه داخلی", "VPN", "وای‌فای", "سرعت", "سایر"],
  ایمیل: ["دسترسی", "تنظیمات", "ارسال", "دریافت", "اسپم", "سایر"],
  امنیت: ["ویروس", "دسترسی", "رمز عبور", "فایروال", "بک‌آپ", "سایر"],
  دسترسی: ["حساب کاربری", "مجوزها", "سیستم‌ها", "فایل‌ها", "پایگاه داده", "سایر"],
}

// Sample tickets for demonstration
const sampleTickets: Ticket[] = [
  {
    id: "TKT-001",
    title: "مشکل در اتصال به اینترنت",
    description:
      "اینترنت دفتر کار نمی‌کند و نمی‌توانم به سایت‌های مورد نیاز دسترسی پیدا کنم. مشکل از صبح امروز شروع شده است.",
    category: "شبکه",
    subcategory: "اتصال اینترنت",
    priority: "high",
    status: "open",
    clientId: "3",
    clientName: "احمد محمدی",
    clientEmail: "ahmad@company.com",
    clientPhone: "09123456787",
    clientDepartment: "حسابداری",
    assignedTo: "2",
    assignedTechnicianName: "علی احمدی",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    responses: [],
  },
  {
    id: "TKT-002",
    title: "نصب نرم‌افزار حسابداری",
    description: "نیاز به نصب نرم‌افزار حسابداری جدید روی سیستم دارم. نسخه قبلی مشکل دارد و نیاز به به‌روزرسانی است.",
    category: "نرم‌افزار",
    subcategory: "نصب",
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
    description: "پرینتر اداری کاغذ گیر می‌کند و کیفیت چاپ مناسب نیست. همچنین گاهی اوقات کاغذ را نمی‌کشد.",
    category: "سخت‌افزار",
    subcategory: "پرینتر",
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
  {
    id: "TKT-004",
    title: "مشکل در دسترسی به ایمیل",
    description: "نمی‌توانم به ایمیل سازمانی خود دسترسی پیدا کنم. پیغام خطای رمز عبور نادرست می‌دهد.",
    category: "ایمیل",
    subcategory: "دسترسی",
    priority: "high",
    status: "open",
    clientId: "4",
    clientName: "فاطمه کریمی",
    clientEmail: "fateme@company.com",
    clientPhone: "09123456788",
    clientDepartment: "منابع انسانی",
    assignedTo: "2",
    assignedTechnicianName: "علی احمدی",
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    responses: [],
  },
  {
    id: "TKT-005",
    title: "ویروس در سیستم",
    description: "سیستم کامپیوتر من آلوده به ویروس شده و کند کار می‌کند. پاپ‌آپ‌های مزاحم زیادی ظاهر می‌شود.",
    category: "امنیت",
    subcategory: "ویروس",
    priority: "urgent",
    status: "in-progress",
    clientId: "5",
    clientName: "محمد رضایی",
    clientEmail: "mohammad@company.com",
    clientPhone: "09123456789",
    clientDepartment: "فروش",
    assignedTo: "2",
    assignedTechnicianName: "علی احمدی",
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    responses: [
      {
        id: "RES-003",
        ticketId: "TKT-005",
        text: "در حال اسکن کامل سیستم هستم. لطفاً سیستم را خاموش نکنید.",
        author: "علی احمدی",
        type: "technician",
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "TKT-006",
    title: "مشکل در کیبورد",
    description: "چند کلید از کیبورد کار نمی‌کند. کلیدهای A، S، D کار نمی‌کنند.",
    category: "سخت‌افزار",
    subcategory: "کیبورد و ماوس",
    priority: "medium",
    status: "open",
    clientId: "6",
    clientName: "سارا احمدی",
    clientEmail: "sara@company.com",
    clientPhone: "09123456790",
    clientDepartment: "بازاریابی",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    responses: [],
  },
  {
    id: "TKT-007",
    title: "کندی شبکه داخلی",
    description: "دسترسی به سرور داخلی بسیار کند است و فایل‌ها با تأخیر زیاد باز می‌شوند.",
    category: "شبکه",
    subcategory: "شبکه داخلی",
    priority: "medium",
    status: "open",
    clientId: "7",
    clientName: "علی موسوی",
    clientEmail: "ali.mousavi@company.com",
    clientPhone: "09123456791",
    clientDepartment: "IT",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    responses: [],
  },
  {
    id: "TKT-008",
    title: "درخواست نصب نرم‌افزار طراحی",
    description: "نیاز به نصب نرم‌افزار Adobe Photoshop برای کار طراحی دارم.",
    category: "نرم‌افزار",
    subcategory: "نصب",
    priority: "low",
    status: "resolved",
    clientId: "8",
    clientName: "مریم حسینی",
    clientEmail: "maryam@company.com",
    clientPhone: "09123456792",
    clientDepartment: "طراحی",
    assignedTo: "2",
    assignedTechnicianName: "علی احمدی",
    resolution: "نرم‌افزار Adobe Photoshop نصب شد و مجوز فعال گردید.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    responses: [
      {
        id: "RES-004",
        ticketId: "TKT-008",
        text: "نرم‌افزار با موفقیت نصب شد. مجوز نیز فعال است.",
        author: "علی احمدی",
        type: "technician",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
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
