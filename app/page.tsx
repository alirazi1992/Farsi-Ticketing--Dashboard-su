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
import { UserIcon, Wrench, Shield, LogIn } from "lucide-react"

// Types
interface Ticket {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "open" | "in-progress" | "resolved" | "closed"
  category: string
  subcategory: string
  clientName: string
  clientEmail: string
  clientPhone: string
  assignedTo?: string
  createdAt: string
  updatedAt: string
  responses: Array<{
    id: string
    message: string
    author: string
    timestamp: string
    isInternal: boolean
  }>
  attachments: Array<{
    id: string
    name: string
    url: string
    size: number
  }>
  dynamicFields?: Record<string, any>
}

interface Category {
  id: string
  name: string
  label: string
  icon: string
  subcategories: Array<{
    id: string
    name: string
    label: string
  }>
  dynamicFields?: Array<{
    id: string
    name: string
    label: string
    type: string
    required: boolean
    options?: string[]
  }>
}

interface Technician {
  id: string
  name: string
  email: string
  specialties: string[]
  workload: number
  isAvailable: boolean
}

export default function ITServiceDashboard() {
  const { user, logout } = useAuth()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [categories, setCategories] = useState<Category[]>([
    {
      id: "hardware",
      name: "hardware",
      label: "مشکلات سخت‌افزاری",
      icon: "💻",
      subcategories: [
        { id: "computer-not-working", name: "computer-not-working", label: "رایانه کار نمی‌کند" },
        { id: "printer-issues", name: "printer-issues", label: "مشکلات چاپگر" },
        { id: "monitor-problems", name: "monitor-problems", label: "مشکلات مانیتور" },
        { id: "keyboard-mouse", name: "keyboard-mouse", label: "مشکلات کیبورد و ماوس" },
        { id: "network-hardware", name: "network-hardware", label: "مشکلات سخت‌افزار شبکه" },
        { id: "ups-power", name: "ups-power", label: "مشکلات برق و UPS" },
        { id: "other-hardware", name: "other-hardware", label: "سایر مشکلات سخت‌افزاری" },
      ],
    },
    {
      id: "software",
      name: "software",
      label: "مشکلات نرم‌افزاری",
      icon: "🖥️",
      subcategories: [
        { id: "os-issues", name: "os-issues", label: "مشکلات سیستم عامل" },
        { id: "application-problems", name: "application-problems", label: "مشکلات نرم‌افزارهای کاربردی" },
        { id: "software-installation", name: "software-installation", label: "نصب و حذف نرم‌افزار" },
        { id: "license-activation", name: "license-activation", label: "مشکلات لایسنس و فعال‌سازی" },
        { id: "updates-patches", name: "updates-patches", label: "به‌روزرسانی‌ها و وصله‌ها" },
        { id: "performance-issues", name: "performance-issues", label: "مشکلات عملکرد نرم‌افزار" },
        { id: "other-software", name: "other-software", label: "سایر مشکلات نرم‌افزاری" },
      ],
    },
    {
      id: "network",
      name: "network",
      label: "مشکلات شبکه و اینترنت",
      icon: "🌐",
      subcategories: [
        { id: "internet-connection", name: "internet-connection", label: "مشکل اتصال اینترنت" },
        { id: "wifi-problems", name: "wifi-problems", label: "مشکلات Wi-Fi" },
        { id: "network-speed", name: "network-speed", label: "کندی شبکه" },
        { id: "vpn-issues", name: "vpn-issues", label: "مشکلات VPN" },
        { id: "network-sharing", name: "network-sharing", label: "مشکلات اشتراک‌گذاری شبکه" },
        { id: "firewall-security", name: "firewall-security", label: "مشکلات فایروال و امنیت" },
        { id: "other-network", name: "other-network", label: "سایر مشکلات شبکه" },
      ],
    },
    {
      id: "email",
      name: "email",
      label: "مشکلات ایمیل",
      icon: "📧",
      subcategories: [
        { id: "cannot-send", name: "cannot-send", label: "نمی‌توانم ایمیل ارسال کنم" },
        { id: "cannot-receive", name: "cannot-receive", label: "ایمیل دریافت نمی‌کنم" },
        { id: "login-problems", name: "login-problems", label: "مشکل ورود به ایمیل" },
        { id: "sync-issues", name: "sync-issues", label: "مشکلات همگام‌سازی" },
        { id: "attachment-problems", name: "attachment-problems", label: "مشکلات پیوست" },
        { id: "spam-issues", name: "spam-issues", label: "مشکلات اسپم" },
        { id: "other-email", name: "other-email", label: "سایر مشکلات ایمیل" },
      ],
    },
    {
      id: "security",
      name: "security",
      label: "مشکلات امنیتی",
      icon: "🔒",
      subcategories: [
        { id: "virus-malware", name: "virus-malware", label: "ویروس و بدافزار" },
        { id: "suspicious-activity", name: "suspicious-activity", label: "فعالیت مشکوک" },
        { id: "data-breach", name: "data-breach", label: "نقض امنیت داده‌ها" },
        { id: "phishing-attempt", name: "phishing-attempt", label: "تلاش فیشینگ" },
        { id: "unauthorized-access", name: "unauthorized-access", label: "دسترسی غیرمجاز" },
        { id: "password-issues", name: "password-issues", label: "مشکلات رمز عبور" },
        { id: "other-security", name: "other-security", label: "سایر مشکلات امنیتی" },
      ],
    },
    {
      id: "access",
      name: "access",
      label: "درخواست‌های دسترسی",
      icon: "🔑",
      subcategories: [
        { id: "new-account", name: "new-account", label: "ایجاد حساب کاربری جدید" },
        { id: "permission-change", name: "permission-change", label: "تغییر مجوزهای دسترسی" },
        { id: "system-access", name: "system-access", label: "دسترسی به سیستم‌ها" },
        { id: "application-access", name: "application-access", label: "دسترسی به نرم‌افزارها" },
        { id: "network-access", name: "network-access", label: "دسترسی شبکه" },
        { id: "file-access", name: "file-access", label: "دسترسی به فایل‌ها" },
        { id: "other-access", name: "other-access", label: "سایر درخواست‌های دسترسی" },
      ],
    },
    {
      id: "training",
      name: "training",
      label: "آموزش و راهنمایی",
      icon: "📚",
      subcategories: [
        { id: "software-training", name: "software-training", label: "آموزش نرم‌افزار" },
        { id: "hardware-guidance", name: "hardware-guidance", label: "راهنمایی سخت‌افزار" },
        { id: "security-awareness", name: "security-awareness", label: "آگاهی امنیتی" },
        { id: "best-practices", name: "best-practices", label: "بهترین روش‌های کاری" },
        { id: "troubleshooting", name: "troubleshooting", label: "آموزش عیب‌یابی" },
        { id: "documentation", name: "documentation", label: "درخواست مستندات" },
        { id: "other-training", name: "other-training", label: "سایر آموزش‌ها" },
      ],
    },
    {
      id: "maintenance",
      name: "maintenance",
      label: "نگهداری و تعمیرات",
      icon: "🔧",
      subcategories: [
        { id: "preventive-maintenance", name: "preventive-maintenance", label: "نگهداری پیشگیرانه" },
        { id: "repair-request", name: "repair-request", label: "درخواست تعمیر" },
        { id: "replacement-request", name: "replacement-request", label: "درخواست تعویض" },
        { id: "upgrade-request", name: "upgrade-request", label: "درخواست ارتقاء" },
        { id: "cleaning-service", name: "cleaning-service", label: "خدمات نظافت تجهیزات" },
        { id: "calibration", name: "calibration", label: "کالیبراسیون تجهیزات" },
        { id: "other-maintenance", name: "other-maintenance", label: "سایر خدمات نگهداری" },
      ],
    },
  ])

  const [technicians, setTechnicians] = useState<Technician[]>([
    {
      id: "tech1",
      name: "احمد محمدی",
      email: "ahmad@company.com",
      specialties: ["hardware", "network"],
      workload: 3,
      isAvailable: true,
    },
    {
      id: "tech2",
      name: "فاطمه احمدی",
      email: "fateme@company.com",
      specialties: ["software", "email"],
      workload: 2,
      isAvailable: true,
    },
    {
      id: "tech3",
      name: "علی رضایی",
      email: "ali@company.com",
      specialties: ["security", "access"],
      workload: 1,
      isAvailable: true,
    },
  ])

  // Generate unique ticket ID
  const generateTicketId = (): string => {
    const year = new Date().getFullYear()
    const ticketNumber = (tickets.length + 1).toString().padStart(3, "0")
    return `TK-${year}-${ticketNumber}`
  }

  // Handle ticket creation (Client Dashboard → Admin Dashboard sync)
  const handleTicketCreate = (ticketData: any) => {
    const newTicket: Ticket = {
      id: generateTicketId(),
      title: ticketData.title,
      description: ticketData.description,
      priority: ticketData.priority,
      status: "open",
      category: ticketData.mainIssue,
      subcategory: ticketData.subIssue,
      clientName: ticketData.clientName,
      clientEmail: ticketData.clientEmail,
      clientPhone: ticketData.clientPhone,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responses: [],
      attachments: ticketData.attachments || [],
      dynamicFields: ticketData.dynamicFields || {},
    }

    // Add ticket to state (syncs to Admin Dashboard)
    setTickets((prev) => [...prev, newTicket])

    toast({
      title: "تیکت ایجاد شد",
      description: `تیکت شما با شماره ${newTicket.id} ثبت شد و به زودی بررسی خواهد شد.`,
    })

    return newTicket
  }

  // Handle ticket assignment (Admin Dashboard → Technician Dashboard sync)
  const handleTicketAssignment = (ticketId: string, technicianId: string) => {
    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === ticketId) {
          const updatedTicket = {
            ...ticket,
            assignedTo: technicianId,
            status: "in-progress" as const,
            updatedAt: new Date().toISOString(),
          }

          // Update technician workload
          setTechnicians((prevTechs) =>
            prevTechs.map((tech) => (tech.id === technicianId ? { ...tech, workload: tech.workload + 1 } : tech)),
          )

          toast({
            title: "تیکت تخصیص داده شد",
            description: `تیکت ${ticketId} به تکنسین تخصیص داده شد.`,
          })

          return updatedTicket
        }
        return ticket
      }),
    )
  }

  // Handle ticket updates (Technician Dashboard → Client & Admin Dashboard sync)
  const handleTicketUpdate = (ticketId: string, updates: Partial<Ticket>) => {
    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === ticketId) {
          const updatedTicket = {
            ...ticket,
            ...updates,
            updatedAt: new Date().toISOString(),
          }

          toast({
            title: "تیکت به‌روزرسانی شد",
            description: `تیکت ${ticketId} با موفقیت به‌روزرسانی شد.`,
          })

          return updatedTicket
        }
        return ticket
      }),
    )
  }

  // Handle adding response to ticket (Technician Dashboard → Client & Admin Dashboard sync)
  const handleAddResponse = (
    ticketId: string,
    response: {
      message: string
      author: string
      isInternal: boolean
    },
  ) => {
    const newResponse = {
      id: Date.now().toString(),
      message: response.message,
      author: response.author,
      timestamp: new Date().toISOString(),
      isInternal: response.isInternal,
    }

    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id === ticketId) {
          return {
            ...ticket,
            responses: [...ticket.responses, newResponse],
            updatedAt: new Date().toISOString(),
          }
        }
        return ticket
      }),
    )

    toast({
      title: "پاسخ اضافه شد",
      description: "پاسخ شما با موفقیت ثبت شد.",
    })
  }

  // Handle category management (Admin Dashboard → Client Dashboard sync)
  const handleCategoryCreate = (category: Omit<Category, "id">) => {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
    }

    setCategories((prev) => [...prev, newCategory])

    toast({
      title: "دسته‌بندی ایجاد شد",
      description: `دسته‌بندی "${category.label}" با موفقیت ایجاد شد.`,
    })
  }

  const handleCategoryUpdate = (categoryId: string, updates: Partial<Category>) => {
    setCategories((prev) => prev.map((cat) => (cat.id === categoryId ? { ...cat, ...updates } : cat)))

    toast({
      title: "دسته‌بندی به‌روزرسانی شد",
      description: "تغییرات با موفقیت ذخیره شد.",
    })
  }

  const handleCategoryDelete = (categoryId: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== categoryId))

    toast({
      title: "دسته‌بندی حذف شد",
      description: "دسته‌بندی با موفقیت حذف شد.",
    })
  }

  // Handle technician management
  const handleTechnicianCreate = (technician: Omit<Technician, "id">) => {
    const newTechnician: Technician = {
      ...technician,
      id: Date.now().toString(),
    }

    setTechnicians((prev) => [...prev, newTechnician])

    toast({
      title: "تکنسین اضافه شد",
      description: `تکنسین "${technician.name}" با موفقیت اضافه شد.`,
    })
  }

  const handleTechnicianUpdate = (technicianId: string, updates: Partial<Technician>) => {
    setTechnicians((prev) => prev.map((tech) => (tech.id === technicianId ? { ...tech, ...updates } : tech)))

    toast({
      title: "تکنسین به‌روزرسانی شد",
      description: "اطلاعات تکنسین با موفقیت به‌روزرسانی شد.",
    })
  }

  const handleTechnicianDelete = (technicianId: string) => {
    setTechnicians((prev) => prev.filter((tech) => tech.id !== technicianId))

    toast({
      title: "تکنسین حذف شد",
      description: "تکنسین با موفقیت حذف شد.",
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
                <UserIcon className="w-8 h-8 text-primary" />
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
                    <UserIcon className="w-3 h-3 text-blue-500" />
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
            categories={categories}
            technicians={technicians}
            onTicketUpdate={handleTicketUpdate}
            onTicketAssignment={handleTicketAssignment}
            onAddResponse={handleAddResponse}
            onCategoryCreate={handleCategoryCreate}
            onCategoryUpdate={handleCategoryUpdate}
            onCategoryDelete={handleCategoryDelete}
            onTechnicianCreate={handleTechnicianCreate}
            onTechnicianUpdate={handleTechnicianUpdate}
            onTechnicianDelete={handleTechnicianDelete}
          />
        )
      case "engineer":
        return (
          <TechnicianDashboard
            tickets={tickets}
            technicians={technicians}
            onTicketUpdate={handleTicketUpdate}
            onAddResponse={handleAddResponse}
            currentUser={user}
          />
        )
      default:
        return (
          <ClientDashboard
            tickets={tickets}
            categories={categories}
            onTicketCreate={handleTicketCreate}
            onTicketUpdate={handleTicketUpdate}
            currentUser={user}
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
        return <UserIcon className="w-4 h-4" />
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

  const [loginDialogOpen, setLoginDialogOpen] = useState(false)

  return (
    <AuthProvider>
      <div className="min-h-screen bg-background" dir="rtl">
        {/* Header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                    <UserIcon className="w-6 h-6 text-primary-foreground" />
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
    </AuthProvider>
  )
}
