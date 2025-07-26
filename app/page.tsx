"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"
import { LoginDialog } from "@/components/login-dialog"
import { ClientDashboard } from "@/components/client-dashboard"
import { AdminDashboard } from "@/components/admin-dashboard"
import { TechnicianDashboard } from "@/components/technician-dashboard"
import { UserMenu } from "@/components/user-menu"
import { SettingsDialog } from "@/components/settings-dialog"
import { TicketIcon, Users, Settings, BarChart3, HelpCircle, Shield, Zap } from "lucide-react"

// Mock data for demonstration
const mockTickets = [
  {
    id: "TK-001",
    title: "مشکل در اتصال به شبکه",
    description: "نمی‌توانم به شبکه شرکت متصل شوم",
    status: "open",
    priority: "high",
    category: "network",
    clientName: "احمد محمدی",
    clientEmail: "ahmad@company.com",
    assignedTo: null,
    assignedTechnicianName: null,
    createdAt: "2024-01-15T10:30:00Z",
    responses: [],
  },
  {
    id: "TK-002",
    title: "نصب نرم‌افزار جدید",
    description: "نیاز به نصب نرم‌افزار حسابداری دارم",
    status: "in-progress",
    priority: "medium",
    category: "software",
    clientName: "فاطمه کریمی",
    clientEmail: "fateme@company.com",
    assignedTo: "tech-001",
    assignedTechnicianName: "علی احمدی",
    createdAt: "2024-01-14T14:20:00Z",
    responses: [
      {
        id: "resp-001",
        text: "درخواست شما در حال بررسی است",
        author: "علی احمدی",
        timestamp: "2024-01-14T15:00:00Z",
        type: "technician",
      },
    ],
  },
  {
    id: "TK-003",
    title: "مشکل در دسترسی به ایمیل",
    description: "نمی‌توانم به ایمیل سازمانی خود دسترسی پیدا کنم",
    status: "resolved",
    priority: "urgent",
    category: "email",
    clientName: "حسن رضایی",
    clientEmail: "hassan@company.com",
    assignedTo: "tech-002",
    assignedTechnicianName: "سارا محمدی",
    createdAt: "2024-01-13T09:15:00Z",
    responses: [
      {
        id: "resp-002",
        text: "مشکل شما حل شد. لطفاً تست کنید",
        author: "سارا محمدی",
        timestamp: "2024-01-13T11:30:00Z",
        type: "technician",
      },
    ],
  },
]

// Categories data that will be shared between components
const initialCategories = [
  {
    id: "hardware",
    name: "سخت‌افزار",
    description: "مشکلات مربوط به تجهیزات سخت‌افزاری",
    color: "bg-blue-100 text-blue-800",
    icon: "HardDrive",
    isActive: true,
    fields: [
      {
        id: "device_type",
        label: "نوع دستگاه",
        type: "select",
        required: true,
        options: ["کامپیوتر", "پرینتر", "مانیتور", "کیبورد", "ماوس"],
      },
      { id: "device_model", label: "مدل دستگاه", type: "text", required: false },
      { id: "error_message", label: "پیام خطا", type: "textarea", required: false },
    ],
  },
  {
    id: "software",
    name: "نرم‌افزار",
    description: "مشکلات مربوط به نرم‌افزارها و برنامه‌ها",
    color: "bg-green-100 text-green-800",
    icon: "Software",
    isActive: true,
    fields: [
      { id: "software_name", label: "نام نرم‌افزار", type: "text", required: true },
      { id: "software_version", label: "نسخه نرم‌افزار", type: "text", required: false },
      { id: "error_description", label: "شرح خطا", type: "textarea", required: true },
    ],
  },
  {
    id: "network",
    name: "شبکه",
    description: "مشکلات مربوط به شبکه و اتصال اینترنت",
    color: "bg-purple-100 text-purple-800",
    icon: "Network",
    isActive: true,
    fields: [
      { id: "connection_type", label: "نوع اتصال", type: "select", required: true, options: ["WiFi", "کابلی", "VPN"] },
      { id: "network_name", label: "نام شبکه", type: "text", required: false },
      { id: "speed_issue", label: "مشکل سرعت", type: "checkbox", required: false },
    ],
  },
  {
    id: "email",
    name: "ایمیل",
    description: "مشکلات مربوط به ایمیل و پیام‌رسانی",
    color: "bg-orange-100 text-orange-800",
    icon: "Mail",
    isActive: true,
    fields: [
      {
        id: "email_client",
        label: "نرم‌افزار ایمیل",
        type: "select",
        required: true,
        options: ["Outlook", "Gmail", "Thunderbird", "سایر"],
      },
      { id: "email_address", label: "آدرس ایمیل", type: "email", required: true },
      {
        id: "issue_type",
        label: "نوع مشکل",
        type: "select",
        required: true,
        options: ["ارسال", "دریافت", "تنظیمات", "سایر"],
      },
    ],
  },
  {
    id: "security",
    name: "امنیت",
    description: "مشکلات مربوط به امنیت و حریم خصوصی",
    color: "bg-red-100 text-red-800",
    icon: "Shield",
    isActive: true,
    fields: [
      {
        id: "security_type",
        label: "نوع مشکل امنیتی",
        type: "select",
        required: true,
        options: ["ویروس", "هک", "فیشینگ", "سایر"],
      },
      { id: "affected_system", label: "سیستم آسیب‌دیده", type: "text", required: true },
      { id: "incident_time", label: "زمان وقوع", type: "datetime-local", required: false },
    ],
  },
  {
    id: "access",
    name: "دسترسی",
    description: "مشکلات مربوط به دسترسی‌ها و مجوزها",
    color: "bg-yellow-100 text-yellow-800",
    icon: "Key",
    isActive: true,
    fields: [
      {
        id: "access_type",
        label: "نوع دسترسی",
        type: "select",
        required: true,
        options: ["فایل", "پوشه", "نرم‌افزار", "سیستم"],
      },
      { id: "resource_name", label: "نام منبع", type: "text", required: true },
      {
        id: "permission_level",
        label: "سطح دسترسی مورد نیاز",
        type: "select",
        required: true,
        options: ["خواندن", "نوشتن", "اجرا", "مدیریت"],
      },
    ],
  },
]

export default function Home() {
  const { user, login, logout } = useAuth()
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)
  const [tickets, setTickets] = useState(mockTickets)
  const [categories, setCategories] = useState(initialCategories)

  // Handle ticket updates
  const handleTicketUpdate = (ticketId: string, updates: any) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) => (ticket.id === ticketId ? { ...ticket, ...updates } : ticket)),
    )
  }

  // Handle adding new tickets
  const handleAddTicket = (newTicket: any) => {
    setTickets((prevTickets) => [newTicket, ...prevTickets])
  }

  // Handle category updates
  const handleCategoryUpdate = (updatedCategories: any[]) => {
    setCategories(updatedCategories)
  }

  // Stats calculations
  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in-progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
    urgent: tickets.filter((t) => t.priority === "urgent").length,
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" dir="rtl">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <TicketIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">سامانه مدیریت تیکت</h1>
                <p className="text-gray-600">پشتیبانی فناوری اطلاعات</p>
              </div>
            </div>
            <Button onClick={() => setLoginDialogOpen(true)} className="gap-2">
              <Shield className="w-4 h-4" />
              ورود به سیستم
            </Button>
          </div>

          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">به سامانه پشتیبانی خوش آمدید</h2>
            <p className="text-xl text-gray-600 mb-8">برای دریافت پشتیبانی فنی و ارسال درخواست، لطفاً وارد سیستم شوید</p>
            <div className="flex justify-center gap-4">
              <Button onClick={() => setLoginDialogOpen(true)} size="lg" className="gap-2">
                <Users className="w-5 h-5" />
                ورود کاربران
              </Button>
              <Button variant="outline" size="lg" className="gap-2 bg-transparent">
                <HelpCircle className="w-5 h-5" />
                راهنمای استفاده
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-right">
                  <Zap className="w-5 h-5 text-blue-600" />
                  پشتیبانی سریع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-right">
                  تیم پشتیبانی ما آماده ارائه خدمات سریع و کارآمد در تمامی ساعات کاری است
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-right">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  پیگیری آسان
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-right">
                  وضعیت درخواست‌های خود را به راحتی پیگیری کنید و از آخرین تغییرات مطلع شوید
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-right">
                  <Shield className="w-5 h-5 text-purple-600" />
                  امنیت بالا
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-right">اطلاعات شما با بالاترین استانداردهای امنیتی محافظت می‌شود</p>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-gray-600">کل تیکت‌ها</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{stats.open}</div>
                <div className="text-sm text-gray-600">باز</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
                <div className="text-sm text-gray-600">در حال انجام</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
                <div className="text-sm text-gray-600">حل شده</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.urgent}</div>
                <div className="text-sm text-gray-600">فوری</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <LoginDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} onLogin={login} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <TicketIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">سامانه مدیریت تیکت</h1>
              <p className="text-gray-600">پشتیبانی فناوری اطلاعات</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setSettingsDialogOpen(true)} className="gap-2">
              <Settings className="w-4 h-4" />
              تنظیمات
            </Button>
            <UserMenu user={user} onLogout={logout} />
          </div>
        </div>

        {/* Dashboard Content */}
        <Tabs defaultValue={user.role} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="client" disabled={user.role !== "client"}>
              پنل کاربر
            </TabsTrigger>
            <TabsTrigger value="technician" disabled={user.role !== "technician"}>
              پنل تکنسین
            </TabsTrigger>
            <TabsTrigger value="admin" disabled={user.role !== "admin"}>
              پنل مدیریت
            </TabsTrigger>
          </TabsList>

          <TabsContent value="client">
            <ClientDashboard
              tickets={tickets.filter((t) => t.clientEmail === user.email)}
              onTicketAdd={handleAddTicket}
              categories={categories}
            />
          </TabsContent>

          <TabsContent value="technician">
            <TechnicianDashboard
              tickets={tickets.filter((t) => t.assignedTo === user.id)}
              onTicketUpdate={handleTicketUpdate}
            />
          </TabsContent>

          <TabsContent value="admin">
            <AdminDashboard
              tickets={tickets}
              onTicketUpdate={handleTicketUpdate}
              categories={categories}
              onCategoryUpdate={handleCategoryUpdate}
            />
          </TabsContent>
        </Tabs>

        <SettingsDialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen} />
      </div>
    </div>
  )
}
