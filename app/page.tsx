"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider, useAuth } from "@/lib/auth-context"
import { LoginDialog } from "@/components/login-dialog"
import { UserMenu } from "@/components/user-menu"
import { ClientDashboard } from "@/components/client-dashboard"
import { AdminDashboard } from "@/components/admin-dashboard"
import { TechnicianDashboard } from "@/components/technician-dashboard"
import { Ticket, Clock, CheckCircle, AlertCircle, Shield, LogIn } from "lucide-react"

// Initial categories data
const initialCategories = [
  {
    id: "hardware",
    name: "سخت‌افزار",
    subcategories: [
      { id: "computer-repair", name: "تعمیر رایانه" },
      { id: "printer-issues", name: "مشکلات چاپگر" },
      { id: "network-hardware", name: "تجهیزات شبکه" },
      { id: "monitor-problems", name: "مشکلات مانیتور" },
    ],
  },
  {
    id: "software",
    name: "نرم‌افزار",
    subcategories: [
      { id: "os-issues", name: "مشکلات سیستم عامل" },
      { id: "application-install", name: "نصب نرم‌افزار" },
      { id: "software-bugs", name: "باگ‌های نرم‌افزاری" },
      { id: "license-issues", name: "مشکلات لایسنس" },
    ],
  },
  {
    id: "network",
    name: "شبکه",
    subcategories: [
      { id: "internet-connection", name: "اتصال اینترنت" },
      { id: "wifi-problems", name: "مشکلات وای‌فای" },
      { id: "network-speed", name: "سرعت شبکه" },
      { id: "vpn-issues", name: "مشکلات VPN" },
    ],
  },
  {
    id: "email",
    name: "ایمیل",
    subcategories: [
      { id: "email-setup", name: "راه‌اندازی ایمیل" },
      { id: "email-sync", name: "همگام‌سازی ایمیل" },
      { id: "spam-issues", name: "مشکلات اسپم" },
      { id: "email-recovery", name: "بازیابی ایمیل" },
    ],
  },
  {
    id: "security",
    name: "امنیت",
    subcategories: [
      { id: "virus-malware", name: "ویروس و بدافزار" },
      { id: "firewall-config", name: "پیکربندی فایروال" },
      { id: "security-updates", name: "به‌روزرسانی‌های امنیتی" },
      { id: "data-breach", name: "نقض امنیت داده" },
    ],
  },
  {
    id: "access",
    name: "دسترسی",
    subcategories: [
      { id: "password-reset", name: "بازنشانی رمز عبور" },
      { id: "account-lockout", name: "قفل شدن حساب کاربری" },
      { id: "permission-issues", name: "مشکلات مجوز" },
      { id: "new-user-setup", name: "راه‌اندازی کاربر جدید" },
    ],
  },
]

// Sample tickets data
const initialTickets = [
  {
    id: "TKT-001",
    title: "مشکل در اتصال به اینترنت",
    description: "اینترنت در بخش حسابداری قطع شده و کارمندان نمی‌توانند به سیستم‌های آنلاین دسترسی پیدا کنند.",
    category: "network",
    subcategory: "internet-connection",
    priority: "high",
    status: "open",
    submittedBy: "احمد محمدی",
    email: "ahmad@company.com",
    submittedAt: new Date("2024-01-15T09:30:00").toISOString(),
    assignedTo: null,
    assignedTechnicianName: null,
  },
  {
    id: "TKT-002",
    title: "نصب نرم‌افزار حسابداری",
    description: "نیاز به نصب نرم‌افزار حسابداری جدید روی 5 دستگاه در بخش مالی",
    category: "software",
    subcategory: "application-install",
    priority: "medium",
    status: "in-progress",
    submittedBy: "فاطمه احمدی",
    email: "fateme@company.com",
    submittedAt: new Date("2024-01-14T14:20:00").toISOString(),
    assignedTo: "tech-002",
    assignedTechnicianName: "سارا محمدی",
  },
  {
    id: "TKT-003",
    title: "چاپگر کار نمی‌کند",
    description: "چاپگر اصلی دفتر از صبح کار نمی‌کند و پیغام خطا می‌دهد",
    category: "hardware",
    subcategory: "printer-issues",
    priority: "urgent",
    status: "resolved",
    submittedBy: "علی رضایی",
    email: "ali@company.com",
    submittedAt: new Date("2024-01-13T08:45:00").toISOString(),
    assignedTo: "tech-001",
    assignedTechnicianName: "علی احمدی",
  },
]

function DashboardContent() {
  const { user, logout } = useAuth()
  const [tickets, setTickets] = useState(initialTickets)
  const [categories, setCategories] = useState(initialCategories)
  const [dashboardStats, setDashboardStats] = useState({
    totalTickets: 0,
    openTickets: 0,
    inProgressTickets: 0,
    resolvedTickets: 0,
    avgResolutionTime: 0,
  })

  // Calculate dashboard statistics
  useEffect(() => {
    const totalTickets = tickets.length
    const openTickets = tickets.filter((t) => t.status === "open").length
    const inProgressTickets = tickets.filter((t) => t.status === "in-progress").length
    const resolvedTickets = tickets.filter((t) => t.status === "resolved" || t.status === "closed").length

    setDashboardStats({
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      avgResolutionTime: 2.5, // Mock data - in real app, calculate from actual resolution times
    })
  }, [tickets])

  // Handle ticket updates
  const handleTicketUpdate = (ticketId: string, updates: any) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
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

  // Handle new ticket submission
  const handleTicketSubmit = (ticketData: any) => {
    const newTicket = {
      id: `TKT-${String(tickets.length + 1).padStart(3, "0")}`,
      ...ticketData,
      status: "open",
      submittedAt: new Date().toISOString(),
      assignedTo: null,
      assignedTechnicianName: null,
    }

    setTickets((prevTickets) => [newTicket, ...prevTickets])

    toast({
      title: "تیکت با موفقیت ثبت شد",
      description: `شماره تیکت شما: ${newTicket.id}`,
    })

    return newTicket.id
  }

  // Handle category updates
  const handleCategoryUpdate = (updatedCategories: any[]) => {
    setCategories(updatedCategories)
  }

  if (!user) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center"
        dir="rtl"
      >
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">سیستم مدیریت خدمات IT</CardTitle>
            <p className="text-muted-foreground">برای ادامه وارد شوید</p>
          </CardHeader>
          <CardContent>
            <LoginDialog>
              <Button className="w-full gap-2">
                <LogIn className="w-4 h-4" />
                ورود به سیستم
              </Button>
            </LoginDialog>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">سیستم مدیریت خدمات IT</h1>
              <p className="text-sm text-gray-500">مدیریت تیکت‌ها و درخواست‌های فنی</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-sm">{user.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="text-right">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-gray-500">
                  {user.role === "admin" ? "مدیر سیستم" : user.role === "technician" ? "تکنسین" : "کاربر"}
                </p>
              </div>
            </div>
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">کل تیکت‌ها</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalTickets}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Ticket className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">تیکت‌های باز</p>
                  <p className="text-2xl font-bold text-red-600">{dashboardStats.openTickets}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">در حال انجام</p>
                  <p className="text-2xl font-bold text-yellow-600">{dashboardStats.inProgressTickets}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">حل شده</p>
                  <p className="text-2xl font-bold text-green-600">{dashboardStats.resolvedTickets}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Role-based Dashboard */}
        {user.role === "admin" && (
          <AdminDashboard
            tickets={tickets}
            categories={categories}
            onTicketUpdate={handleTicketUpdate}
            onCategoryUpdate={handleCategoryUpdate}
          />
        )}

        {user.role === "technician" && (
          <TechnicianDashboard
            tickets={tickets.filter((ticket) => ticket.assignedTo === user.id)}
            onTicketUpdate={handleTicketUpdate}
          />
        )}

        {user.role === "client" && (
          <ClientDashboard
            tickets={tickets.filter((ticket) => ticket.submittedBy === user.name || ticket.email === user.email)}
            categories={categories}
            onTicketSubmit={handleTicketSubmit}
          />
        )}
      </main>

      <Toaster />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  )
}
