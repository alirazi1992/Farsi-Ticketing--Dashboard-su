"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminDashboard } from "@/components/admin-dashboard"
import { ClientDashboard } from "@/components/client-dashboard"
import { TechnicianDashboard } from "@/components/technician-dashboard"
import { LoginDialog } from "@/components/login-dialog"
import { UserMenu } from "@/components/user-menu"
import { useAuth } from "@/lib/auth-context"
import { toast } from "@/hooks/use-toast"
import { Settings, Bell } from "lucide-react"

// Initial categories data
const initialCategories = {
  hardware: {
    label: "سخت‌افزار",
    subcategories: ["تعمیر رایانه", "تعویض قطعات", "نصب تجهیزات", "مشکلات چاپگر"],
  },
  software: {
    label: "نرم‌افزار",
    subcategories: ["نصب نرم‌افزار", "به‌روزرسانی", "مشکلات عملکرد", "مجوز نرم‌افزار"],
  },
  network: {
    label: "شبکه",
    subcategories: ["قطعی اینترنت", "مشکلات Wi-Fi", "پیکربندی شبکه", "امنیت شبکه"],
  },
  email: {
    label: "ایمیل",
    subcategories: ["مشکلات ارسال", "پیکربندی ایمیل", "هرزنامه", "بازیابی ایمیل"],
  },
  security: {
    label: "امنیت",
    subcategories: ["ویروس و بدافزار", "تنظیمات فایروال", "نقض امنیت", "رمزعبور"],
  },
  access: {
    label: "دسترسی",
    subcategories: ["مشکلات ورود", "درخواست دسترسی", "تغییر سطح دسترسی", "قفل حساب کاربری"],
  },
}

// Sample tickets data
const initialTickets = [
  {
    id: "TKT-001",
    title: "مشکل در اتصال به اینترنت",
    description: "اینترنت در بخش حسابداری قطع است و کارمندان نمی‌توانند به سیستم‌های آنلاین دسترسی پیدا کنند.",
    category: "network",
    subcategory: "قطعی اینترنت",
    priority: "high",
    status: "open",
    clientName: "احمد محمدی",
    clientEmail: "ahmad@company.com",
    clientPhone: "09123456789",
    department: "حسابداری",
    createdAt: new Date("2024-01-15T09:30:00"),
    updatedAt: new Date("2024-01-15T09:30:00"),
    assignedTo: null,
    assignedTechnicianName: null,
  },
  {
    id: "TKT-002",
    title: "درخواست نصب نرم‌افزار Adobe Photoshop",
    description: "نیاز به نصب نرم‌افزار Adobe Photoshop برای پروژه‌های طراحی جدید.",
    category: "software",
    subcategory: "نصب نرم‌افزار",
    priority: "medium",
    status: "in-progress",
    clientName: "سارا احمدی",
    clientEmail: "sara@company.com",
    clientPhone: "09123456788",
    department: "طراحی",
    createdAt: new Date("2024-01-14T14:20:00"),
    updatedAt: new Date("2024-01-15T10:15:00"),
    assignedTo: "tech-002",
    assignedTechnicianName: "سارا محمدی",
  },
  {
    id: "TKT-003",
    title: "چاپگر اداری کار نمی‌کند",
    description: "چاپگر HP LaserJet در طبقه دوم هیچ خروجی نمی‌دهد و چراغ قرمز روشن است.",
    category: "hardware",
    subcategory: "مشکلات چاپگر",
    priority: "medium",
    status: "resolved",
    clientName: "علی رضایی",
    clientEmail: "ali@company.com",
    clientPhone: "09123456787",
    department: "اداری",
    createdAt: new Date("2024-01-13T11:45:00"),
    updatedAt: new Date("2024-01-14T16:30:00"),
    assignedTo: "tech-001",
    assignedTechnicianName: "علی احمدی",
  },
  {
    id: "TKT-004",
    title: "مشکل در دریافت ایمیل‌ها",
    description: "از دیروز ایمیل‌های جدید دریافت نمی‌شوند و صندوق ورودی به‌روزرسانی نمی‌شود.",
    category: "email",
    subcategory: "مشکلات ارسال",
    priority: "high",
    status: "open",
    clientName: "فاطمه کریمی",
    clientEmail: "fateme@company.com",
    clientPhone: "09123456786",
    department: "فروش",
    createdAt: new Date("2024-01-15T08:15:00"),
    updatedAt: new Date("2024-01-15T08:15:00"),
    assignedTo: null,
    assignedTechnicianName: null,
  },
  {
    id: "TKT-005",
    title: "درخواست دسترسی به سیستم CRM",
    description: "کارمند جدید نیاز به دسترسی کامل به سیستم مدیریت ارتباط با مشتریان دارد.",
    category: "access",
    subcategory: "درخواست دسترسی",
    priority: "low",
    status: "closed",
    clientName: "حسن نوری",
    clientEmail: "hassan@company.com",
    clientPhone: "09123456785",
    department: "فروش",
    createdAt: new Date("2024-01-12T13:20:00"),
    updatedAt: new Date("2024-01-13T09:45:00"),
    assignedTo: "tech-003",
    assignedTechnicianName: "حسن رضایی",
  },
]

export default function ITServiceDashboard() {
  const { user, login, logout } = useAuth()
  const [tickets, setTickets] = useState(initialTickets)
  const [categories, setCategories] = useState(initialCategories)
  const [stats, setStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    closedTickets: 0,
    avgResolutionTime: 0,
  })

  // Calculate statistics
  useEffect(() => {
    const totalTickets = tickets.length
    const openTickets = tickets.filter((t) => t.status === "open").length
    const inProgressTickets = tickets.filter((t) => t.status === "in-progress").length
    const resolvedTickets = tickets.filter((t) => t.status === "resolved").length
    const closedTickets = tickets.filter((t) => t.status === "closed").length

    // Calculate average resolution time (mock calculation)
    const resolvedTicketsList = tickets.filter((t) => t.status === "resolved" || t.status === "closed")
    const avgResolutionTime =
      resolvedTicketsList.length > 0
        ? resolvedTicketsList.reduce((sum, ticket) => {
            const resolutionTime = (ticket.updatedAt.getTime() - ticket.createdAt.getTime()) / (1000 * 60 * 60) // hours
            return sum + resolutionTime
          }, 0) / resolvedTicketsList.length
        : 0

    setStats({
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      closedTickets,
      avgResolutionTime: Math.round(avgResolutionTime * 10) / 10,
    })
  }, [tickets])

  // Handle ticket updates
  const handleTicketUpdate = (ticketId: string, updates: any) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) => (ticket.id === ticketId ? { ...ticket, ...updates, updatedAt: new Date() } : ticket)),
    )
  }

  // Handle new ticket creation
  const handleTicketCreate = (newTicket: any) => {
    const ticketWithId = {
      ...newTicket,
      id: `TKT-${String(tickets.length + 1).padStart(3, "0")}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      assignedTo: null,
      assignedTechnicianName: null,
    }
    setTickets((prevTickets) => [ticketWithId, ...prevTickets])

    toast({
      title: "تیکت جدید ایجاد شد",
      description: `تیکت ${ticketWithId.id} با موفقیت ثبت شد`,
    })
  }

  // Handle category updates
  const handleCategoryUpdate = (newCategories: any) => {
    setCategories(newCategories)
    toast({
      title: "دسته‌بندی‌ها به‌روزرسانی شد",
      description: "تغییرات با موفقیت اعمال شد",
    })
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-4">
              <Settings className="w-8 h-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl">سیستم مدیریت خدمات IT</CardTitle>
            <p className="text-muted-foreground">برای ادامه وارد شوید</p>
          </CardHeader>
          <CardContent>
            <LoginDialog />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">سیستم مدیریت خدمات IT</h1>
                <p className="text-sm text-muted-foreground">
                  {user.role === "admin" && "پنل مدیریت"}
                  {user.role === "client" && "پنل کاربری"}
                  {user.role === "technician" && "پنل تکنسین"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" className="gap-2">
                <Bell className="w-4 h-4" />
                <Badge variant="destructive" className="text-xs">
                  {stats.openTickets}
                </Badge>
              </Button>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {user.role === "admin" && (
          <AdminDashboard
            tickets={tickets}
            categories={categories}
            onTicketUpdate={handleTicketUpdate}
            onCategoryUpdate={handleCategoryUpdate}
            stats={stats}
          />
        )}

        {user.role === "client" && (
          <ClientDashboard
            tickets={tickets.filter((ticket) => ticket.clientEmail === user.email)}
            categories={categories}
            onTicketCreate={handleTicketCreate}
            stats={stats}
          />
        )}

        {user.role === "technician" && (
          <TechnicianDashboard
            tickets={tickets.filter((ticket) => ticket.assignedTo === user.id)}
            onTicketUpdate={handleTicketUpdate}
            stats={stats}
          />
        )}
      </main>
    </div>
  )
}
