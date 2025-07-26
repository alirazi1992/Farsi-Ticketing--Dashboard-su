"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginDialog } from "@/components/login-dialog"
import { AdminDashboard } from "@/components/admin-dashboard"
import { ClientDashboard } from "@/components/client-dashboard"
import { TechnicianDashboard } from "@/components/technician-dashboard"
import { UserMenu } from "@/components/user-menu"
import { useAuth } from "@/lib/auth-context"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {
  LogIn,
  Ticket,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  BarChart3,
  Shield,
  Wrench,
  User,
  HelpCircle,
  Phone,
  Mail,
  MapPin,
} from "lucide-react"

// Mock data
const initialTickets = [
  {
    id: "TK-001",
    title: "مشکل در اتصال به اینترنت",
    description: "اینترنت در بخش حسابداری قطع است و کارمندان نمی‌توانند به سیستم‌های آنلاین دسترسی داشته باشند.",
    category: "network",
    subcategory: "internet",
    priority: "urgent",
    status: "open",
    clientName: "احمد محمدی",
    clientEmail: "ahmad@company.com",
    clientPhone: "09123456789",
    department: "حسابداری",
    createdAt: "2024-01-15T09:00:00Z",
    updatedAt: "2024-01-15T09:00:00Z",
    assignedTo: null,
    assignedTechnicianName: null,
    responses: [],
  },
  {
    id: "TK-002",
    title: "نصب نرم‌افزار آفیس",
    description: "نیاز به نصب Microsoft Office روی کامپیوتر جدید در بخش فروش",
    category: "software",
    subcategory: "installation",
    priority: "medium",
    status: "in-progress",
    clientName: "فاطمه احمدی",
    clientEmail: "fateme@company.com",
    clientPhone: "09123456788",
    department: "فروش",
    createdAt: "2024-01-14T14:30:00Z",
    updatedAt: "2024-01-15T10:15:00Z",
    assignedTo: "tech-002",
    assignedTechnicianName: "سارا محمدی",
    responses: [
      {
        id: "resp-001",
        text: "نرم‌افزار در حال دانلود است. تا ساعت 16 نصب خواهد شد.",
        author: "سارا محمدی",
        timestamp: "2024-01-15T10:15:00Z",
        type: "technician",
      },
    ],
  },
  {
    id: "TK-003",
    title: "مشکل در پرینتر",
    description: "پرینتر HP در اتاق مدیریت کاغذ گیر می‌کند",
    category: "hardware",
    subcategory: "printer",
    priority: "low",
    status: "resolved",
    clientName: "علی رضایی",
    clientEmail: "ali@company.com",
    clientPhone: "09123456787",
    department: "مدیریت",
    createdAt: "2024-01-13T11:00:00Z",
    updatedAt: "2024-01-14T16:45:00Z",
    assignedTo: "tech-001",
    assignedTechnicianName: "علی احمدی",
    responses: [
      {
        id: "resp-002",
        text: "مشکل بررسی شد. کاغذ گیر کرده پاک شد و پرینتر تست شد.",
        author: "علی احمدی",
        timestamp: "2024-01-14T16:45:00Z",
        type: "technician",
      },
    ],
  },
]

const initialCategories = [
  {
    id: "cat-001",
    name: "سخت‌افزار",
    description: "مسائل مربوط به تجهیزات سخت‌افزاری",
    subcategories: [
      { id: "sub-001", name: "کامپیوتر" },
      { id: "sub-002", name: "پرینتر" },
      { id: "sub-003", name: "مانیتور" },
      { id: "sub-004", name: "کیبورد و ماوس" },
    ],
  },
  {
    id: "cat-002",
    name: "نرم‌افزار",
    description: "مسائل مربوط به نرم‌افزارها و برنامه‌ها",
    subcategories: [
      { id: "sub-005", name: "نصب نرم‌افزار" },
      { id: "sub-006", name: "به‌روزرسانی" },
      { id: "sub-007", name: "خطای نرم‌افزار" },
      { id: "sub-008", name: "آموزش" },
    ],
  },
  {
    id: "cat-003",
    name: "شبکه",
    description: "مسائل مربوط به شبکه و اینترنت",
    subcategories: [
      { id: "sub-009", name: "اتصال اینترنت" },
      { id: "sub-010", name: "شبکه داخلی" },
      { id: "sub-011", name: "وای‌فای" },
      { id: "sub-012", name: "VPN" },
    ],
  },
]

export default function Home() {
  const { user, isLoading } = useAuth()
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)
  const [tickets, setTickets] = useState(initialTickets)
  const [categories, setCategories] = useState(initialCategories)

  const handleTicketAdd = (newTicket: any) => {
    setTickets([...tickets, newTicket])
    toast({
      title: "تیکت جدید ایجاد شد",
      description: `تیکت ${newTicket.id} با موفقیت ثبت شد`,
    })
  }

  const handleTicketUpdate = (ticketId: string, updates: any) => {
    setTickets(tickets.map((ticket) => (ticket.id === ticketId ? { ...ticket, ...updates } : ticket)))
  }

  const handleCategoryUpdate = (newCategories: any[]) => {
    setCategories(newCategories)
  }

  // Filter tickets based on user role
  const getUserTickets = () => {
    if (!user) return []

    switch (user.role) {
      case "admin":
        return tickets
      case "engineer":
        return tickets.filter((ticket) => ticket.assignedTo === user.id || !ticket.assignedTo)
      case "client":
        return tickets.filter((ticket) => ticket.clientEmail === user.email)
      default:
        return []
    }
  }

  const userTickets = getUserTickets()

  // Statistics for landing page
  const stats = {
    totalTickets: tickets.length,
    openTickets: tickets.filter((t) => t.status === "open").length,
    inProgressTickets: tickets.filter((t) => t.status === "in-progress").length,
    resolvedTickets: tickets.filter((t) => t.status === "resolved").length,
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">در حال بارگذاری...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        {/* Header */}
        <header className="border-b bg-card sticky top-0 z-50">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  {user.role === "admin" ? (
                    <Shield className="w-4 h-4 text-primary-foreground" />
                  ) : user.role === "engineer" ? (
                    <Wrench className="w-4 h-4 text-primary-foreground" />
                  ) : (
                    <User className="w-4 h-4 text-primary-foreground" />
                  )}
                </div>
                <div className="text-right">
                  <h1 className="text-lg font-semibold">
                    {user.role === "admin" ? "پنل مدیریت" : user.role === "engineer" ? "پنل تکنسین" : "پنل کاربر"}
                  </h1>
                  <p className="text-xs text-muted-foreground">سیستم مدیریت خدمات IT</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">
                  {user.role === "admin" ? "مدیر سیستم" : user.role === "engineer" ? "تکنسین" : "کاربر"}
                </p>
              </div>
              <UserMenu />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {user.role === "admin" && (
            <AdminDashboard
              tickets={userTickets}
              onTicketUpdate={handleTicketUpdate}
              categories={categories}
              onCategoryUpdate={handleCategoryUpdate}
            />
          )}
          {user.role === "engineer" && (
            <TechnicianDashboard tickets={userTickets} onTicketUpdate={handleTicketUpdate} />
          )}
          {user.role === "client" && (
            <ClientDashboard tickets={userTickets} onTicketAdd={handleTicketAdd} categories={categories} />
          )}
        </main>

        <Toaster />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" dir="rtl">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="text-right">
                <h1 className="text-xl font-bold text-gray-900">سیستم مدیریت خدمات IT</h1>
                <p className="text-sm text-gray-600">پلتفرم جامع پشتیبانی فنی</p>
              </div>
            </div>
            <Button onClick={() => setLoginDialogOpen(true)} className="gap-2">
              <LogIn className="w-4 h-4" />
              ورود به سیستم
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">مدیریت حرفه‌ای خدمات IT</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            سیستم جامع مدیریت تیکت‌های پشتیبانی فنی با قابلیت‌های پیشرفته و رابط کاربری ساده
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" onClick={() => setLoginDialogOpen(true)} className="gap-2">
              <LogIn className="w-5 h-5" />
              شروع کنید
            </Button>
            <Button size="lg" variant="outline" className="gap-2 bg-transparent">
              <HelpCircle className="w-5 h-5" />
              راهنما
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">{stats.totalTickets}</div>
              <div className="text-sm text-gray-600">کل تیکت‌ها</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">{stats.openTickets}</div>
              <div className="text-sm text-gray-600">تیکت‌های باز</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">{stats.inProgressTickets}</div>
              <div className="text-sm text-gray-600">در حال انجام</div>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-2">{stats.resolvedTickets}</div>
              <div className="text-sm text-gray-600">حل شده</div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-right">مدیریت کاربران</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-right">
                مدیریت کامل کاربران، تکنسین‌ها و سطوح دسترسی با امکان تخصیص خودکار تیکت‌ها
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-right">گزارش‌گیری پیشرفته</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-right">
                تولید گزارش‌های تفصیلی از عملکرد تیم، زمان پاسخ‌گویی و رضایت مشتریان
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-right">پیگیری هوشمند</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-right">
                سیستم پیگیری خودکار تیکت‌ها با اعلان‌های بلادرنگ و به‌روزرسانی وضعیت
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">نیاز به پشتیبانی دارید؟</h3>
            <p className="text-lg mb-6 opacity-90">تیم پشتیبانی ما آماده کمک به شما است</p>
            <div className="flex justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>021-12345678</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@company.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>تهران، ایران</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold">سیستم مدیریت خدمات IT</span>
          </div>
          <p className="text-gray-400">© 2024 تمامی حقوق محفوظ است. طراحی و توسعه با ❤️ برای بهبود خدمات IT</p>
        </div>
      </footer>

      <LoginDialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen} />
      <Toaster />
    </div>
  )
}
