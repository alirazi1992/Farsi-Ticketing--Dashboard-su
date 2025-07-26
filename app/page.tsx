"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { LoginDialog } from "@/components/login-dialog"
import { UserMenu } from "@/components/user-menu"
import { ClientDashboard } from "@/components/client-dashboard"
import { TechnicianDashboard } from "@/components/technician-dashboard"
import { AdminDashboard } from "@/components/admin-dashboard"
import { useAuth } from "@/lib/auth-context"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Ticket, User, Wrench, Shield, LogIn } from "lucide-react"

// Sample initial tickets data
const initialTickets = [
  {
    id: "TK-2024-001",
    title: "مشکل در اتصال به اینترنت",
    description: "اینترنت در بخش حسابداری قطع شده و کارمندان نمی‌توانند به سیستم‌های آنلاین دسترسی داشته باشند.",
    category: "network",
    subcategory: "اتصال اینترنت",
    priority: "high",
    status: "open",
    clientName: "احمد رضایی",
    clientEmail: "ahmad@company.com",
    clientPhone: "09123456789",
    department: "حسابداری",
    createdAt: "2024-01-15T09:30:00Z",
    updatedAt: "2024-01-15T09:30:00Z",
    submittedAt: "2024-01-15T09:30:00Z",
    submittedBy: "احمد رضایی",
    assignedTo: "tech-001",
    assignedTechnicianName: "علی احمدی",
    responses: [
      {
        message: "تیکت دریافت شد. در حال بررسی مشکل هستیم.",
        status: "in-progress",
        technicianName: "علی احمدی",
        timestamp: "2024-01-15T10:00:00Z",
      },
    ],
  },
  {
    id: "TK-2024-002",
    title: "نصب نرم‌افزار حسابداری",
    description: "نیاز به نصب نرم‌افزار حسابداری جدید روی 5 دستگاه در بخش مالی",
    category: "software",
    subcategory: "نصب نرم‌افزار",
    priority: "medium",
    status: "resolved",
    clientName: "فاطمه احمدی",
    clientEmail: "fateme@company.com",
    clientPhone: "09123456788",
    department: "مالی",
    createdAt: "2024-01-14T14:20:00Z",
    updatedAt: "2024-01-15T16:45:00Z",
    submittedAt: "2024-01-14T14:20:00Z",
    submittedBy: "فاطمه احمدی",
    assignedTo: "tech-002",
    assignedTechnicianName: "سارا محمدی",
    responses: [
      {
        message: "نرم‌افزار با موفقیت نصب شد. لطفاً تست کنید.",
        status: "resolved",
        technicianName: "سارا محمدی",
        timestamp: "2024-01-15T16:45:00Z",
      },
    ],
  },
  {
    id: "TK-2024-003",
    title: "تعمیر پرینتر",
    description: "پرینتر اپسون در اتاق 205 کاغذ گیر می‌کند",
    category: "hardware",
    subcategory: "پرینتر",
    priority: "low",
    status: "in-progress",
    clientName: "محمد کریمی",
    clientEmail: "mohammad@company.com",
    clientPhone: "09123456787",
    department: "اداری",
    createdAt: "2024-01-13T11:15:00Z",
    updatedAt: "2024-01-14T09:20:00Z",
    submittedAt: "2024-01-13T11:15:00Z",
    submittedBy: "محمد کریمی",
    assignedTo: "tech-001",
    assignedTechnicianName: "علی احمدی",
    responses: [],
  },
  {
    id: "TK-2024-004",
    title: "مشکل در دسترسی به ایمیل",
    description: "نمی‌توانم به ایمیل سازمانی خود دسترسی داشته باشم",
    category: "email",
    subcategory: "مشکل دسترسی",
    priority: "urgent",
    status: "open",
    clientName: "زهرا نوری",
    clientEmail: "zahra@company.com",
    clientPhone: "09123456786",
    department: "فروش",
    createdAt: "2024-01-15T08:45:00Z",
    updatedAt: "2024-01-15T08:45:00Z",
    submittedAt: "2024-01-15T08:45:00Z",
    submittedBy: "زهرا نوری",
    assignedTo: null,
    assignedTechnicianName: null,
    responses: [],
  },
  {
    id: "TK-2024-005",
    title: "بروزرسانی آنتی‌ویروس",
    description: "آنتی‌ویروس روی تمام سیستم‌ها نیاز به بروزرسانی دارد",
    category: "security",
    subcategory: "آنتی‌ویروس",
    priority: "medium",
    status: "closed",
    clientName: "علی حسینی",
    clientEmail: "ali@company.com",
    clientPhone: "09123456785",
    department: "IT",
    createdAt: "2024-01-12T13:30:00Z",
    updatedAt: "2024-01-13T17:00:00Z",
    submittedAt: "2024-01-12T13:30:00Z",
    submittedBy: "علی حسینی",
    assignedTo: "tech-003",
    assignedTechnicianName: "حسن رضایی",
    responses: [
      {
        message: "آنتی‌ویروس روی تمام سیستم‌ها بروزرسانی شد.",
        status: "resolved",
        technicianName: "حسن رضایی",
        timestamp: "2024-01-13T16:30:00Z",
      },
      {
        message: "تیکت بسته شد. مشکل حل شده است.",
        status: "closed",
        technicianName: "حسن رضایی",
        timestamp: "2024-01-13T17:00:00Z",
      },
    ],
  },
]

// Initial categories data
const initialCategoriesData = [
  {
    id: "hardware",
    name: "سخت‌افزار",
    description: "مشکلات مربوط به تجهیزات سخت‌افزاری",
    subcategories: [
      { id: "computer-not-working", name: "رایانه کار نمی‌کند" },
      { id: "printer-issues", name: "مشکلات چاپگر" },
      { id: "monitor-problems", name: "مشکلات مانیتور" },
      { id: "keyboard-mouse", name: "مشکلات کیبورد و ماوس" },
      { id: "network-hardware", name: "مشکلات سخت‌افزار شبکه" },
      { id: "ups-power", name: "مشکلات برق و UPS" },
      { id: "other-hardware", name: "سایر مشکلات سخت‌افزاری" },
    ],
  },
  {
    id: "software",
    name: "نرم‌افزار",
    description: "مشکلات مربوط به نرم‌افزارها و سیستم عامل",
    subcategories: [
      { id: "os-issues", name: "مشکلات سیستم عامل" },
      { id: "application-problems", name: "مشکلات نرم‌افزارهای کاربردی" },
      { id: "software-installation", name: "نصب و حذف نرم‌افزار" },
      { id: "license-activation", name: "مشکلات لایسنس و فعال‌سازی" },
      { id: "updates-patches", name: "به‌روزرسانی‌ها و وصله‌ها" },
      { id: "performance-issues", name: "مشکلات عملکرد نرم‌افزار" },
      { id: "other-software", name: "سایر مشکلات نرم‌افزاری" },
    ],
  },
  {
    id: "network",
    name: "شبکه",
    description: "مشکلات مربوط به اتصال شبکه و اینترنت",
    subcategories: [
      { id: "internet-connection", name: "مشکل اتصال اینترنت" },
      { id: "wifi-problems", name: "مشکلات Wi-Fi" },
      { id: "network-speed", name: "کندی شبکه" },
      { id: "vpn-issues", name: "مشکلات VPN" },
      { id: "network-sharing", name: "مشکلات اشتراک‌گذاری شبکه" },
      { id: "firewall-security", name: "مشکلات فایروال و امنیت" },
      { id: "other-network", name: "سایر مشکلات شبکه" },
    ],
  },
  {
    id: "email",
    name: "ایمیل",
    description: "مشکلات مربوط به سیستم ایمیل",
    subcategories: [
      { id: "cannot-send", name: "نمی‌توانم ایمیل ارسال کنم" },
      { id: "cannot-receive", name: "ایمیل دریافت نمی‌کنم" },
      { id: "login-problems", name: "مشکل ورود به ایمیل" },
      { id: "sync-issues", name: "مشکلات همگام‌سازی" },
      { id: "attachment-problems", name: "مشکلات پیوست" },
      { id: "spam-issues", name: "مشکلات اسپم" },
      { id: "other-email", name: "سایر مشکلات ایمیل" },
    ],
  },
  {
    id: "security",
    name: "امنیت",
    description: "مشکلات مربوط به امنیت سیستم",
    subcategories: [
      { id: "virus-malware", name: "ویروس و بدافزار" },
      { id: "suspicious-activity", name: "فعالیت مشکوک" },
      { id: "data-breach", name: "نقض امنیت داده‌ها" },
      { id: "phishing-attempt", name: "تلاش فیشینگ" },
      { id: "unauthorized-access", name: "دسترسی غیرمجاز" },
      { id: "password-issues", name: "مشکلات رمز عبور" },
      { id: "other-security", name: "سایر مشکلات امنیتی" },
    ],
  },
  {
    id: "access",
    name: "دسترسی",
    description: "درخواست‌های دسترسی به سیستم‌ها و منابع",
    subcategories: [
      { id: "new-account", name: "ایجاد حساب کاربری جدید" },
      { id: "permission-change", name: "تغییر مجوزهای دسترسی" },
      { id: "system-access", name: "دسترسی به سیستم‌ها" },
      { id: "application-access", name: "دسترسی به نرم‌افزارها" },
      { id: "network-access", name: "دسترسی شبکه" },
      { id: "file-access", name: "دسترسی به فایل‌ها" },
      { id: "other-access", name: "سایر درخواست‌های دسترسی" },
    ],
  },
]

export default function ITServiceDashboard() {
  const { user, logout } = useAuth()
  const [tickets, setTickets] = useState(initialTickets)
  const [categories, setCategories] = useState(initialCategoriesData)
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)

  // Handle ticket creation
  const handleTicketCreate = (newTicket: any) => {
    const ticketId = `TK-${new Date().getFullYear()}-${String(tickets.length + 1).padStart(3, "0")}`
    const ticket = {
      ...newTicket,
      id: ticketId,
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      submittedAt: new Date().toISOString(),
      assignedTo: null,
      assignedTechnicianName: null,
      responses: [],
    }

    setTickets((prev) => [ticket, ...prev])
    toast({
      title: "تیکت ایجاد شد",
      description: `تیکت ${ticketId} با موفقیت ثبت شد`,
    })
  }

  // Handle ticket updates
  const handleTicketUpdate = (ticketId: string, updates: any) => {
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

  // Handle categories update
  const handleCategoriesUpdate = (newCategories: any) => {
    setCategories(newCategories)
    toast({
      title: "دسته‌بندی‌ها به‌روزرسانی شد",
      description: "تغییرات دسته‌بندی‌ها در تمام بخش‌ها اعمال شد",
    })
  }

  // Get dashboard content based on user role
  const getDashboardContent = () => {
    if (!user) {
      return (
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-right text-xl">سیستم مدیریت خدمات IT</CardTitle>
              <p className="text-muted-foreground text-right">برای دسترسی به سیستم وارد شوید</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={() => setLoginDialogOpen(true)} className="w-full gap-2" size="lg">
                <LogIn className="w-4 h-4" />
                ورود به سیستم
              </Button>

              <div className="pt-4 border-t">
                <p className="text-xs text-muted-foreground text-center mb-3">حساب‌های نمونه برای تست:</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <span className="text-right">کاربر: ahmad@company.com / 123456</span>
                    <User className="w-3 h-3 text-blue-500" />
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <span className="text-right">تکنسین: ali@company.com / 123456</span>
                    <Wrench className="w-3 h-3 text-green-500" />
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <span className="text-right">مدیر: admin@company.com / 123456</span>
                    <Shield className="w-3 h-3 text-purple-500" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )
    }

    switch (user.role) {
      case "admin":
        return (
          <AdminDashboard
            tickets={tickets}
            onTicketUpdate={handleTicketUpdate}
            categories={categories}
            onCategoriesUpdate={handleCategoriesUpdate}
          />
        )
      case "engineer":
        return <TechnicianDashboard tickets={tickets} onTicketUpdate={handleTicketUpdate} currentUser={user} />
      default:
        return <ClientDashboard tickets={tickets} onTicketSubmit={handleTicketCreate} categories={categories} />
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="w-4 h-4" />
      case "engineer":
        return <Wrench className="w-4 h-4" />
      default:
        return <User className="w-4 h-4" />
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "admin":
        return "مدیر سیستم"
      case "engineer":
        return "تکنسین"
      default:
        return "کاربر"
    }
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Ticket className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-right">
                  <h1 className="text-xl font-bold">سیستم مدیریت خدمات IT</h1>
                  <p className="text-sm text-muted-foreground">مدیریت درخواست‌های فنی و پشتیبانی</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        {getRoleIcon(user.role)}
                        <span>{getRoleLabel(user.role)}</span>
                      </div>
                    </div>
                    <Avatar className="w-9 h-9">
                      <AvatarFallback className="text-sm">{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <Separator orientation="vertical" className="h-8" />
                  <UserMenu user={user} onLogout={logout} />
                </>
              ) : (
                <Button variant="outline" onClick={() => setLoginDialogOpen(true)} className="gap-2">
                  <LogIn className="w-4 h-4" />
                  ورود
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">{getDashboardContent()}</main>

      {/* Login Dialog */}
      <LoginDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />

      <Toaster />
    </div>
  )
}
