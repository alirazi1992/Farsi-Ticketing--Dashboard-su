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
import { AuthProvider, useAuth } from "@/lib/auth-context"
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

// Initial categories data - moved from category-management component for global access
const initialCategoriesData = {
  hardware: {
    id: "hardware",
    label: "مشکلات سخت‌افزاری",
    description: "مشکلات مربوط به تجهیزات سخت‌افزاری",
    icon: "hardware",
    subIssues: {
      "computer-not-working": {
        id: "computer-not-working",
        label: "رایانه کار نمی‌کند",
        description: "مشکلات روشن نشدن یا خاموش شدن رایانه",
      },
      "printer-issues": { id: "printer-issues", label: "مشکلات چاپگر", description: "مشکلات چاپ، کاغذ گیر کردن و..." },
      "monitor-problems": {
        id: "monitor-problems",
        label: "مشکلات مانیتور",
        description: "مشکلات نمایش، رنگ و روشنایی",
      },
      "keyboard-mouse": { id: "keyboard-mouse", label: "مشکلات کیبورد و ماوس", description: "مشکلات ورودی" },
      "network-hardware": {
        id: "network-hardware",
        label: "مشکلات سخت‌افزار شبکه",
        description: "مشکلات سوئیچ، روتر و کابل",
      },
      "ups-power": { id: "ups-power", label: "مشکلات برق و UPS", description: "مشکلات تغذیه و پایداری برق" },
      "other-hardware": { id: "other-hardware", label: "سایر مشکلات سخت‌افزاری", description: "سایر مشکلات سخت‌افزاری" },
    },
  },
  software: {
    id: "software",
    label: "مشکلات نرم‌افزاری",
    description: "مشکلات مربوط به نرم‌افزارها و سیستم عامل",
    icon: "software",
    subIssues: {
      "os-issues": { id: "os-issues", label: "مشکلات سیستم عامل", description: "مشکلات ویندوز، لینوکس و..." },
      "application-problems": {
        id: "application-problems",
        label: "مشکلات نرم‌افزارهای کاربردی",
        description: "مشکلات اپلیکیشن‌ها",
      },
      "software-installation": {
        id: "software-installation",
        label: "نصب و حذف نرم‌افزار",
        description: "درخواست نصب یا حذف نرم‌افزار",
      },
      "license-activation": {
        id: "license-activation",
        label: "مشکلات لایسنس و فعال‌سازی",
        description: "مشکلات مجوز استفاده",
      },
      "updates-patches": { id: "updates-patches", label: "به‌روزرسانی‌ها و وصله‌ها", description: "مشکلات آپدیت" },
      "performance-issues": {
        id: "performance-issues",
        label: "مشکلات عملکرد نرم‌افزار",
        description: "کندی و مشکلات عملکرد",
      },
      "other-software": { id: "other-software", label: "سایر مشکلات نرم‌افزاری", description: "سایر مشکلات نرم‌افزاری" },
    },
  },
  network: {
    id: "network",
    label: "مشکلات شبکه و اینترنت",
    description: "مشکلات مربوط به اتصال شبکه و اینترنت",
    icon: "network",
    subIssues: {
      "internet-connection": {
        id: "internet-connection",
        label: "مشکل اتصال اینترنت",
        description: "عدم دسترسی به اینترنت",
      },
      "wifi-problems": { id: "wifi-problems", label: "مشکلات Wi-Fi", description: "مشکلات اتصال بی‌سیم" },
      "network-speed": { id: "network-speed", label: "کندی شبکه", description: "سرعت پایین اینترنت" },
      "vpn-issues": { id: "vpn-issues", label: "مشکلات VPN", description: "مشکلات اتصال VPN" },
      "network-sharing": {
        id: "network-sharing",
        label: "مشکلات اشتراک‌گذاری شبکه",
        description: "مشکلات دسترسی به منابع مشترک",
      },
      "firewall-security": {
        id: "firewall-security",
        label: "مشکلات فایروال و امنیت",
        description: "مشکلات امنیت شبکه",
      },
      "other-network": { id: "other-network", label: "سایر مشکلات شبکه", description: "سایر مشکلات شبکه" },
    },
  },
  email: {
    id: "email",
    label: "مشکلات ایمیل",
    description: "مشکلات مربوط به سیستم ایمیل",
    icon: "email",
    subIssues: {
      "cannot-send": { id: "cannot-send", label: "نمی‌توانم ایمیل ارسال کنم", description: "مشکل در ارسال ایمیل" },
      "cannot-receive": { id: "cannot-receive", label: "ایمیل دریافت نمی‌کنم", description: "مشکل در دریافت ایمیل" },
      "login-problems": { id: "login-problems", label: "مشکل ورود به ایمیل", description: "مشکل احراز هویت" },
      "sync-issues": { id: "sync-issues", label: "مشکلات همگام‌سازی", description: "مشکل همگام‌سازی ایمیل‌ها" },
      "attachment-problems": {
        id: "attachment-problems",
        label: "مشکلات پیوست",
        description: "مشکل در ارسال یا دریافت پیوست",
      },
      "spam-issues": { id: "spam-issues", label: "مشکلات اسپم", description: "مشکلات فیلتر اسپم" },
      "other-email": { id: "other-email", label: "سایر مشکلات ایمیل", description: "سایر مشکلات ایمیل" },
    },
  },
  security: {
    id: "security",
    label: "مشکلات امنیتی",
    description: "مشکلات مربوط به امنیت سیستم",
    icon: "security",
    subIssues: {
      "virus-malware": { id: "virus-malware", label: "ویروس و بدافزار", description: "آلودگی به ویروس یا بدافزار" },
      "suspicious-activity": { id: "suspicious-activity", label: "فعالیت مشکوک", description: "مشاهده فعالیت غیرعادی" },
      "data-breach": { id: "data-breach", label: "نقض امنیت داده‌ها", description: "نشت یا سرقت اطلاعات" },
      "phishing-attempt": { id: "phishing-attempt", label: "تلاش فیشینگ", description: "دریافت ایمیل یا پیام مشکوک" },
      "unauthorized-access": {
        id: "unauthorized-access",
        label: "دسترسی غیرمجاز",
        description: "دسترسی غیرمجاز به سیستم",
      },
      "password-issues": { id: "password-issues", label: "مشکلات رمز عبور", description: "فراموشی یا تغییر رمز عبور" },
      "other-security": { id: "other-security", label: "سایر مشکلات امنیتی", description: "سایر مشکلات امنیتی" },
    },
  },
  access: {
    id: "access",
    label: "درخواست‌های دسترسی",
    description: "درخواست‌های دسترسی به سیستم‌ها و منابع",
    icon: "access",
    subIssues: {
      "new-account": { id: "new-account", label: "ایجاد حساب کاربری جدید", description: "درخواست حساب کاربری جدید" },
      "permission-change": { id: "permission-change", label: "تغییر مجوزهای دسترسی", description: "تغییر سطح دسترسی" },
      "system-access": { id: "system-access", label: "دسترسی به سیستم‌ها", description: "درخواست دسترسی به سیستم خاص" },
      "application-access": {
        id: "application-access",
        label: "دسترسی به نرم‌افزارها",
        description: "درخواست دسترسی به اپلیکیشن",
      },
      "network-access": { id: "network-access", label: "دسترسی شبکه", description: "درخواست دسترسی شبکه" },
      "file-access": { id: "file-access", label: "دسترسی به فایل‌ها", description: "درخواست دسترسی به فایل یا پوشه" },
      "other-access": { id: "other-access", label: "سایر درخواست‌های دسترسی", description: "سایر درخواست‌های دسترسی" },
    },
  },
}

function ITServiceDashboardContent() {
  const { user, logout } = useAuth()
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)

  // ✅ CENTRALIZED STATE MANAGEMENT FOR DATA SYNC
  const [tickets, setTickets] = useState(initialTickets)
  const [categories, setCategories] = useState(initialCategoriesData)

  // ✅ SYNC FUNCTION 1: Client creates ticket → appears in Admin Dashboard
  const handleTicketCreate = (newTicket: any) => {
    const ticketId = `TK-${new Date().getFullYear()}-${String(tickets.length + 1).padStart(3, "0")}`
    const ticket = {
      ...newTicket,
      id: ticketId,
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedTo: null,
      assignedTechnicianName: null,
      responses: [],
    }

    // Update centralized state - this syncs to Admin Dashboard immediately
    setTickets((prev) => [ticket, ...prev])

    toast({
      title: "تیکت ایجاد شد",
      description: `تیکت ${ticketId} با موفقیت ثبت شد و به مدیر سیستم ارسال شد`,
    })
  }

  // ✅ SYNC FUNCTION 2: Admin assigns technician → appears in Technician Dashboard
  // ✅ SYNC FUNCTION 3: Technician updates ticket → syncs to Client & Admin Dashboards
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

    // Show appropriate toast based on update type
    if (updates.assignedTo && updates.assignedTechnicianName) {
      toast({
        title: "تکنسین تعیین شد",
        description: `تیکت ${ticketId} به ${updates.assignedTechnicianName} واگذار شد`,
      })
    } else if (updates.status) {
      const statusLabels = {
        open: "باز",
        "in-progress": "در حال انجام",
        resolved: "حل شده",
        closed: "بسته",
      }
      toast({
        title: "وضعیت تیکت به‌روزرسانی شد",
        description: `وضعیت تیکت ${ticketId} به "${statusLabels[updates.status]}" تغییر کرد`,
      })
    } else if (updates.responses) {
      toast({
        title: "پاسخ جدید",
        description: `پاسخ جدیدی برای تیکت ${ticketId} ثبت شد`,
      })
    }
  }

  // ✅ SYNC FUNCTION 4: Admin manages categories → syncs to Client Dashboard ticket form
  const handleCategoryUpdate = (updatedCategories: any) => {
    setCategories(updatedCategories)
    toast({
      title: "دسته‌بندی‌ها به‌روزرسانی شد",
      description: "تغییرات در فرم ایجاد تیکت اعمال شد",
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
            onCategoryUpdate={handleCategoryUpdate}
          />
        )
      case "engineer":
        return <TechnicianDashboard tickets={tickets} onTicketUpdate={handleTicketUpdate} currentUser={user} />
      default:
        return (
          <ClientDashboard
            tickets={tickets}
            onTicketCreate={handleTicketCreate}
            currentUser={user}
            categories={categories}
          />
        )
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

export default function ITServiceDashboard() {
  return (
    <AuthProvider>
      <ITServiceDashboardContent />
    </AuthProvider>
  )
}
