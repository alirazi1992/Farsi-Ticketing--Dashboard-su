"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Ticket {
  id: string
  title: string
  description: string
  category: string
  subcategory?: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "open" | "in-progress" | "resolved" | "closed"
  clientId: string
  clientName: string
  clientEmail: string
  clientPhone: string
  clientDepartment: string
  assignedTechnicianId?: string
  assignedTechnicianName?: string
  createdAt: string
  updatedAt: string
  resolution?: string
  responses: Response[]
  attachments?: Attachment[]
}

export interface Response {
  id: string
  text: string
  author: string
  timestamp: string
  type: "client" | "technician" | "admin"
}

export interface Attachment {
  name: string
  size: number
  type: string
  url: string
}

export const ticketCategories = {
  سخت‌افزار: ["کامپیوتر", "پرینتر", "تجهیزات شبکه", "مانیتور", "کیبورد و ماوس", "سایر"],
  نرم‌افزار: ["نصب", "به‌روزرسانی", "خطا", "آموزش", "مجوز", "سایر"],
  شبکه: ["اتصال اینترنت", "شبکه داخلی", "VPN", "وای‌فای", "سرعت", "سایر"],
  ایمیل: ["دسترسی", "تنظیمات", "ارسال", "دریافت", "اسپم", "سایر"],
  امنیت: ["ویروس", "دسترسی", "رمز عبور", "فایروال", "بک‌آپ", "سایر"],
  دسترسی: ["حساب کاربری", "مجوزها", "سیستم‌ها", "فایل‌ها", "پایگاه داده", "سایر"],
}

interface TicketContextType {
  tickets: Ticket[]
  addTicket: (ticket: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "responses">) => void
  updateTicket: (id: string, updates: Partial<Ticket>) => void
  getTicketById: (id: string) => Ticket | undefined
  getTicketsByUser: (userEmail: string) => Ticket[]
  getTicketsByTechnician: (technicianId: string) => Ticket[]
  assignTicket: (ticketId: string, technicianId: string, technicianName: string) => void
  addResponse: (ticketId: string, response: Omit<Response, "id" | "timestamp">) => void
  resolveTicket: (ticketId: string, resolution: string) => void
}

const TicketContext = createContext<TicketContextType | undefined>(undefined)

export function TicketProvider({ children }: { children: React.ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([])

  // Initialize with mock data
  useEffect(() => {
    const mockTickets: Ticket[] = [
      {
        id: "T-001",
        title: "مشکل در اتصال به اینترنت",
        description: "اینترنت در بخش حسابداری قطع است و کارمندان نمی‌توانند به سیستم‌های آنلاین دسترسی پیدا کنند.",
        category: "شبکه",
        subcategory: "اتصال اینترنت",
        priority: "high",
        status: "in-progress",
        clientId: "1",
        clientName: "احمد محمدی",
        clientEmail: "ahmad@company.com",
        clientPhone: "09123456789",
        clientDepartment: "حسابداری",
        assignedTechnicianId: "2",
        assignedTechnicianName: "علی احمدی",
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        responses: [
          {
            id: "R-001",
            text: "در حال بررسی مشکل شبکه هستم. لطفاً صبر کنید.",
            author: "علی احمدی",
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            type: "technician",
          },
        ],
      },
      {
        id: "T-002",
        title: "پرینتر کار نمی‌کند",
        description: "پرینتر HP LaserJet در اتاق 205 کاغذ گیر کرده و پیام خطا نمایش می‌دهد.",
        category: "سخت‌افزار",
        subcategory: "پرینتر",
        priority: "medium",
        status: "open",
        clientId: "1",
        clientName: "احمد محمدی",
        clientEmail: "ahmad@company.com",
        clientPhone: "09123456789",
        clientDepartment: "حسابداری",
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        responses: [],
      },
      {
        id: "T-003",
        title: "نصب نرم‌افزار Office",
        description: "نیاز به نصب Microsoft Office 2021 روی کامپیوتر جدید در بخش فروش دارم.",
        category: "نرم‌افزار",
        subcategory: "نصب",
        priority: "low",
        status: "resolved",
        clientId: "1",
        clientName: "احمد محمدی",
        clientEmail: "ahmad@company.com",
        clientPhone: "09123456789",
        clientDepartment: "حسابداری",
        assignedTechnicianId: "2",
        assignedTechnicianName: "علی احمدی",
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        resolution: "نرم‌افزار Microsoft Office 2021 با موفقیت نصب شد و فعال‌سازی انجام گرفت.",
        responses: [
          {
            id: "R-002",
            text: "نرم‌افزار نصب شد. لطفاً تست کنید.",
            author: "علی احمدی",
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            type: "technician",
          },
          {
            id: "R-003",
            text: "ممنون، همه چیز درست کار می‌کند.",
            author: "احمد محمدی",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            type: "client",
          },
        ],
      },
      // Additional mock tickets for technician dashboard
      {
        id: "T-004",
        title: "مشکل در سیستم ایمیل",
        description: "نمی‌توانم ایمیل‌های جدید دریافت کنم. پیام‌ها در صندوق ورودی نمایش داده نمی‌شوند.",
        category: "ایمیل",
        subcategory: "دریافت",
        priority: "urgent",
        status: "open",
        clientId: "3",
        clientName: "فاطمه کریمی",
        clientEmail: "fateme@company.com",
        clientPhone: "09187654321",
        clientDepartment: "منابع انسانی",
        assignedTechnicianId: "2",
        assignedTechnicianName: "علی احمدی",
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        responses: [],
      },
      {
        id: "T-005",
        title: "کامپیوتر خاموش نمی‌شود",
        description: "کامپیوتر من بعد از کلیک روی Shutdown خاموش نمی‌شود و در حالت آماده باش می‌ماند.",
        category: "سخت‌افزار",
        subcategory: "کامپیوتر",
        priority: "low",
        status: "in-progress",
        clientId: "4",
        clientName: "محمد رضایی",
        clientEmail: "mohammad@company.com",
        clientPhone: "09198765432",
        clientDepartment: "فروش",
        assignedTechnicianId: "2",
        assignedTechnicianName: "علی احمدی",
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        responses: [
          {
            id: "R-004",
            text: "لطفاً کامپیوتر را restart کنید و مجدداً تست کنید.",
            author: "علی احمدی",
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            type: "technician",
          },
        ],
      },
      {
        id: "T-006",
        title: "فراموشی رمز عبور سیستم",
        description: "رمز عبور سیستم CRM را فراموش کرده‌ام و نمی‌توانم وارد شوم.",
        category: "دسترسی",
        subcategory: "رمز عبور",
        priority: "medium",
        status: "resolved",
        clientId: "5",
        clientName: "زهرا احمدی",
        clientEmail: "zahra@company.com",
        clientPhone: "09176543210",
        clientDepartment: "بازاریابی",
        assignedTechnicianId: "2",
        assignedTechnicianName: "علی احمدی",
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        resolution: "رمز عبور بازنشانی شد و رمز جدید از طریق ایمیل ارسال گردید.",
        responses: [
          {
            id: "R-005",
            text: "رمز عبور جدید ارسال شد. لطفاً چک کنید.",
            author: "علی احمدی",
            timestamp: new Date(Date.now() - 9 * 60 * 60 * 1000).toISOString(),
            type: "technician",
          },
          {
            id: "R-006",
            text: "دریافت کردم و مشکل حل شد. متشکرم.",
            author: "زهرا احمدی",
            timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
            type: "client",
          },
        ],
      },
      {
        id: "T-007",
        title: "ویروس در سیستم",
        description: "کامپیوتر من بسیار کند شده و پیام‌های مشکوک نمایش می‌دهد. احتمال آلودگی به ویروس وجود دارد.",
        category: "امنیت",
        subcategory: "ویروس",
        priority: "high",
        status: "open",
        clientId: "6",
        clientName: "حسن موسوی",
        clientEmail: "hassan@company.com",
        clientPhone: "09165432109",
        clientDepartment: "IT",
        assignedTechnicianId: "2",
        assignedTechnicianName: "علی احمدی",
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        responses: [],
      },
      {
        id: "T-008",
        title: "به‌روزرسانی نرم‌افزار حسابداری",
        description: "نرم‌افزار حسابداری نیاز به به‌روزرسانی دارد. نسخه فعلی قدیمی است و برخی ویژگی‌ها کار نمی‌کند.",
        category: "نرم‌افزار",
        subcategory: "به‌روزرسانی",
        priority: "medium",
        status: "in-progress",
        clientId: "7",
        clientName: "مریم صادقی",
        clientEmail: "maryam@company.com",
        clientPhone: "09154321098",
        clientDepartment: "حسابداری",
        assignedTechnicianId: "2",
        assignedTechnicianName: "علی احمدی",
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        responses: [
          {
            id: "R-007",
            text: "در حال دانلود نسخه جدید هستم. به زودی نصب خواهم کرد.",
            author: "علی احمدی",
            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            type: "technician",
          },
        ],
      },
    ]

    setTickets(mockTickets)
  }, [])

  const addTicket = (ticketData: Omit<Ticket, "id" | "createdAt" | "updatedAt" | "responses">) => {
    const newTicket: Ticket = {
      ...ticketData,
      id: `T-${String(tickets.length + 1).padStart(3, "0")}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responses: [],
    }
    setTickets((prev) => [newTicket, ...prev])
  }

  const updateTicket = (id: string, updates: Partial<Ticket>) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === id ? { ...ticket, ...updates, updatedAt: new Date().toISOString() } : ticket,
      ),
    )
  }

  const getTicketById = (id: string) => {
    return tickets.find((ticket) => ticket.id === id)
  }

  const getTicketsByUser = (userEmail: string) => {
    return tickets.filter((ticket) => ticket.clientEmail === userEmail)
  }

  const getTicketsByTechnician = (technicianId: string) => {
    return tickets.filter((ticket) => ticket.assignedTechnicianId === technicianId)
  }

  const assignTicket = (ticketId: string, technicianId: string, technicianName: string) => {
    updateTicket(ticketId, {
      assignedTechnicianId: technicianId,
      assignedTechnicianName: technicianName,
      status: "in-progress",
    })
  }

  const addResponse = (ticketId: string, responseData: Omit<Response, "id" | "timestamp">) => {
    const ticket = getTicketById(ticketId)
    if (!ticket) return

    const newResponse: Response = {
      ...responseData,
      id: `R-${Date.now()}`,
      timestamp: new Date().toISOString(),
    }

    updateTicket(ticketId, {
      responses: [...ticket.responses, newResponse],
    })
  }

  const resolveTicket = (ticketId: string, resolution: string) => {
    updateTicket(ticketId, {
      status: "resolved",
      resolution,
    })
  }

  return {
    tickets,
    addTicket,
    updateTicket,
    getTicketById,
    getTicketsByUser,
    getTicketsByTechnician,
    assignTicket,
    addResponse,
    resolveTicket,
  }
}

export function useTickets() {
  const context = useContext(TicketContext)
  if (context === undefined) {
    throw new Error("useTickets must be used within a TicketProvider")
  }
  return context
}
