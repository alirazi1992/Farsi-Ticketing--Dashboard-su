"use client"

import { useState } from "react"
import { AdminDashboard } from "@/components/admin-dashboard"
import { ClientDashboard } from "@/components/client-dashboard"
import { TechnicianDashboard } from "@/components/technician-dashboard"
import { LoginDialog } from "@/components/login-dialog"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { Toaster } from "@/components/ui/toaster"

// Initial categories data
const initialCategories = [
  {
    id: "hardware",
    name: "سخت‌افزار",
    description: "مسائل مربوط به سخت‌افزار کامپیوتر",
    subcategories: [
      { id: "desktop", name: "کامپیوتر رومیزی" },
      { id: "laptop", name: "لپ‌تاپ" },
      { id: "printer", name: "چاپگر" },
      { id: "monitor", name: "مانیتور" },
    ],
  },
  {
    id: "software",
    name: "نرم‌افزار",
    description: "مسائل مربوط به نرم‌افزارها",
    subcategories: [
      { id: "os", name: "سیستم عامل" },
      { id: "office", name: "آفیس" },
      { id: "antivirus", name: "آنتی‌ویروس" },
      { id: "browser", name: "مرورگر" },
    ],
  },
  {
    id: "network",
    name: "شبکه",
    description: "مسائل مربوط به شبکه و اتصال",
    subcategories: [
      { id: "internet", name: "اینترنت" },
      { id: "wifi", name: "وای‌فای" },
      { id: "vpn", name: "VPN" },
      { id: "lan", name: "شبکه محلی" },
    ],
  },
  {
    id: "email",
    name: "پست الکترونیک",
    description: "مسائل مربوط به ایمیل",
    subcategories: [
      { id: "outlook", name: "Outlook" },
      { id: "gmail", name: "Gmail" },
      { id: "thunderbird", name: "Thunderbird" },
      { id: "webmail", name: "وب‌میل" },
    ],
  },
  {
    id: "security",
    name: "امنیت",
    description: "مسائل امنیتی",
    subcategories: [
      { id: "password", name: "رمز عبور" },
      { id: "malware", name: "بدافزار" },
      { id: "firewall", name: "فایروال" },
      { id: "backup", name: "پشتیبان‌گیری" },
    ],
  },
  {
    id: "access",
    name: "دسترسی",
    description: "مسائل مربوط به دسترسی‌ها",
    subcategories: [
      { id: "login", name: "ورود به سیستم" },
      { id: "permissions", name: "مجوزها" },
      { id: "account", name: "حساب کاربری" },
      { id: "remote", name: "دسترسی از راه دور" },
    ],
  },
]

// Sample tickets data
const initialTickets = [
  {
    id: "T001",
    title: "مشکل در اتصال به اینترنت",
    description: "نمی‌توانم به اینترنت متصل شوم",
    category: "network",
    subcategory: "internet",
    priority: "high",
    status: "open",
    submittedBy: "احمد محمدی",
    submittedAt: new Date().toISOString(),
    assignedTo: null,
    assignedTechnicianName: null,
  },
  {
    id: "T002",
    title: "چاپگر کار نمی‌کند",
    description: "چاپگر روشن نمی‌شود و صدای عجیبی می‌دهد",
    category: "hardware",
    subcategory: "printer",
    priority: "medium",
    status: "in-progress",
    submittedBy: "فاطمه احمدی",
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
    assignedTo: "tech-001",
    assignedTechnicianName: "علی احمدی",
  },
  {
    id: "T003",
    title: "فراموشی رمز عبور",
    description: "رمز عبور خود را فراموش کرده‌ام",
    category: "security",
    subcategory: "password",
    priority: "low",
    status: "resolved",
    submittedBy: "حسن رضایی",
    submittedAt: new Date(Date.now() - 172800000).toISOString(),
    assignedTo: "tech-002",
    assignedTechnicianName: "سارا محمدی",
  },
]

function AppContent() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState(initialTickets)
  const [categories, setCategories] = useState(initialCategories)

  const handleTicketSubmit = (ticketData: any) => {
    const newTicket = {
      id: `T${String(tickets.length + 1).padStart(3, "0")}`,
      ...ticketData,
      status: "open",
      submittedAt: new Date().toISOString(),
      assignedTo: null,
      assignedTechnicianName: null,
    }
    setTickets([...tickets, newTicket])
  }

  const handleTicketUpdate = (ticketId: string, updates: any) => {
    setTickets(tickets.map((ticket) => (ticket.id === ticketId ? { ...ticket, ...updates } : ticket)))
  }

  const handleCategoriesUpdate = (newCategories: any[]) => {
    setCategories(newCategories)
  }

  if (!user) {
    return <LoginDialog />
  }

  return (
    <div className="min-h-screen bg-background">
      {user.role === "admin" && (
        <AdminDashboard
          tickets={tickets}
          categories={categories}
          onTicketUpdate={handleTicketUpdate}
          onCategoriesUpdate={handleCategoriesUpdate}
        />
      )}
      {user.role === "client" && (
        <ClientDashboard
          tickets={tickets.filter((ticket) => ticket.submittedBy === user.name)}
          categories={categories}
          onTicketSubmit={handleTicketSubmit}
        />
      )}
      {user.role === "technician" && (
        <TechnicianDashboard
          tickets={tickets.filter((ticket) => ticket.assignedTo === user.id)}
          onTicketUpdate={handleTicketUpdate}
        />
      )}
    </div>
  )
}

export default function Home() {
  return (
    <AuthProvider>
      <AppContent />
      <Toaster />
    </AuthProvider>
  )
}
