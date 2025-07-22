"use client"

import { useState, useCallback } from "react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {
  Ticket,
  Plus,
  Search,
  Filter,
  Clock,
  AlertCircle,
  CheckCircle,
  User,
  Settings,
  Send,
  Eye,
  MessageSquare,
  Shield,
  Network,
  Mail,
  HardDrive,
  ComputerIcon as Software,
  Key,
  LogIn,
  FilterX,
} from "lucide-react"

import { TwoStepTicketForm } from "@/components/two-step-ticket-form"
import { LoginDialog } from "@/components/login-dialog"
import { UserMenu } from "@/components/user-menu"
import { useAuth } from "@/lib/auth-context"
import { ticketAccessSchema } from "@/lib/validation-schemas"

// Mock data for demonstration
const mockTickets = [
  {
    id: "TK-2024-001",
    title: "مشکل در اتصال به شبکه",
    description: "نمی‌توانم به شبکه شرکت متصل شوم",
    status: "open",
    priority: "high",
    category: "network",
    clientName: "احمد محمدی",
    clientEmail: "ahmad@company.com",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    responses: [],
  },
  {
    id: "TK-2024-002",
    title: "درخواست نصب نرم‌افزار",
    description: "نیاز به نصب Adobe Photoshop دارم",
    status: "in-progress",
    priority: "medium",
    category: "software",
    clientName: "فاطمه احمدی",
    clientEmail: "fateme@company.com",
    createdAt: "2024-01-14T14:20:00Z",
    updatedAt: "2024-01-15T09:15:00Z",
    responses: [
      {
        id: 1,
        author: "تکنسین علی",
        message: "درخواست شما در حال بررسی است",
        timestamp: "2024-01-15T09:15:00Z",
        isAdmin: true,
      },
    ],
  },
  {
    id: "TK-2024-003",
    title: "مشکل در ایمیل",
    description: "ایمیل‌های ارسالی به اسپم می‌روند",
    status: "resolved",
    priority: "low",
    category: "email",
    clientName: "محمد رضایی",
    clientEmail: "mohammad@company.com",
    createdAt: "2024-01-13T11:00:00Z",
    updatedAt: "2024-01-14T16:30:00Z",
    responses: [
      {
        id: 1,
        author: "تکنسین سارا",
        message: "مشکل حل شد. تنظیمات SPF و DKIM اصلاح شدند",
        timestamp: "2024-01-14T16:30:00Z",
        isAdmin: true,
      },
    ],
  },
  {
    id: "TK-2024-004",
    title: "درخواست تعمیر پرینتر",
    description: "پرینتر طبقه دوم کار نمی‌کند",
    status: "closed",
    priority: "urgent",
    category: "hardware",
    clientName: "زهرا کریمی",
    clientEmail: "zahra@company.com",
    createdAt: "2024-01-12T09:15:00Z",
    updatedAt: "2024-01-13T14:45:00Z",
    responses: [
      {
        id: 1,
        author: "تکنسین حسن",
        message: "پرینتر تعمیر شد و مشکل برطرف گردید",
        timestamp: "2024-01-13T14:45:00Z",
        isAdmin: true,
      },
    ],
  },
]

const statusColors = {
  open: "bg-red-100 text-red-800 border-red-200",
  "in-progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
  resolved: "bg-green-100 text-green-800 border-green-200",
  closed: "bg-gray-100 text-gray-800 border-gray-200",
}

const statusLabels = {
  open: "باز",
  "in-progress": "در حال انجام",
  resolved: "حل شده",
  closed: "بسته",
}

const priorityColors = {
  low: "bg-blue-100 text-blue-800 border-blue-200",
  medium: "bg-orange-100 text-orange-800 border-orange-200",
  high: "bg-red-100 text-red-800 border-red-200",
  urgent: "bg-purple-100 text-purple-800 border-purple-200",
}

const priorityLabels = {
  low: "کم",
  medium: "متوسط",
  high: "بالا",
  urgent: "فوری",
}

const categoryIcons = {
  hardware: HardDrive,
  software: Software,
  network: Network,
  email: Mail,
  security: Shield,
  access: Key,
}

const categoryLabels = {
  hardware: "سخت‌افزار",
  software: "نرم‌افزار",
  network: "شبکه",
  email: "ایمیل",
  security: "امنیت",
  access: "دسترسی",
}

export default function ITServiceDashboard() {
  const { user } = useAuth()
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [newTicketDialog, setNewTicketDialog] = useState(false)
  const [accessTicketDialog, setAccessTicketDialog] = useState(false)
  const [loginDialog, setLoginDialog] = useState(false)
  const [systemSettingsDialog, setSystemSettingsDialog] = useState(false)

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  // System settings states
  const [systemSettings, setSystemSettings] = useState({
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      newTicketAlert: true,
      urgentTicketAlert: true,
      dailyReport: false,
    },
    ticketSettings: {
      autoAssignment: true,
      defaultPriority: "medium",
      maxTicketsPerUser: "10",
      autoCloseResolved: false,
      responseTimeLimit: "24",
    },
    systemSettings: {
      maintenanceMode: false,
      allowGuestAccess: true,
      requireApproval: false,
      backupFrequency: "daily",
      logRetention: "30",
    },
    appearance: {
      theme: "light",
      language: "fa",
      dateFormat: "persian",
      timezone: "Asia/Tehran",
    },
  })

  // Filter and search tickets
  const filteredTickets = mockTickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.clientName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus
    const matchesPriority = filterPriority === "all" || ticket.priority === filterPriority
    const matchesCategory = filterCategory === "all" || ticket.category === filterCategory

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory
  })

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setFilterStatus("all")
    setFilterPriority("all")
    setFilterCategory("all")
    setShowFilters(false)
  }

  // Check if any filters are active
  const hasActiveFilters = searchQuery || filterStatus !== "all" || filterPriority !== "all" || filterCategory !== "all"

  // Handle system settings save
  const handleSaveSettings = useCallback(() => {
    // Here you would typically save to backend
    toast({
      title: "تنظیمات ذخیره شد",
      description: "تنظیمات سیستم با موفقیت به‌روزرسانی شد",
    })
    setSystemSettingsDialog(false)
  }, [])

  // Update system settings
  const updateSystemSettings = useCallback((category: string, key: string, value: any) => {
    setSystemSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }))
  }, [])

  // Determine which view to show based on user role
  const getActiveView = () => {
    if (!user) return "guest"
    if (user.role === "client") return "client"
    if (user.role === "engineer" || user.role === "admin") return "admin"
    return "guest"
  }

  const handleTicketSubmit = (ticketData: any) => {
    console.log("New ticket submitted:", ticketData)
    // Here you would typically send the data to your backend
    // For now, we'll just add it to the mock data
    mockTickets.unshift({
      ...ticketData,
      responses: [],
      updatedAt: ticketData.createdAt,
    })
  }

  const ClientDashboard = () => (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div className="text-right">
          <h2 className="text-2xl font-bold">پنل کاربری</h2>
          <p className="text-muted-foreground">مدیریت تیکت‌های پشتیبانی</p>
        </div>
        <Dialog open={newTicketDialog} onOpenChange={setNewTicketDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4" />
              تیکت جدید
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-right">ایجاد تیکت جدید</DialogTitle>
              <DialogDescription className="text-right">
                لطفاً اطلاعات مربوط به مشکل خود را در دو مرحله وارد کنید
              </DialogDescription>
            </DialogHeader>
            <TwoStepTicketForm onClose={() => setNewTicketDialog(false)} onSubmit={handleTicketSubmit} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">کل تیکت‌ها</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">{mockTickets.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">باز</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">{mockTickets.filter((t) => t.status === "open").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">در حال انجام</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">
              {mockTickets.filter((t) => t.status === "in-progress").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">حل شده</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">
              {mockTickets.filter((t) => t.status === "resolved").length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-right">تیکت‌های من</CardTitle>
            <div className="flex gap-2">
              <Dialog open={accessTicketDialog} onOpenChange={setAccessTicketDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Eye className="w-4 h-4" />
                    دسترسی به تیکت
                  </Button>
                </DialogTrigger>
                <DialogContent dir="rtl">
                  <DialogHeader>
                    <DialogTitle className="text-right">دسترسی به تیکت</DialogTitle>
                    <DialogDescription className="text-right">
                      برای دسترسی به تیکت، اطلاعات زیر را وارد کنید
                    </DialogDescription>
                  </DialogHeader>
                  <TicketAccessForm onClose={() => setAccessTicketDialog(false)} />
                </DialogContent>
              </Dialog>

              {/* Search Input */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="جستجو در تیکت‌ها..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 w-64 text-right"
                  dir="rtl"
                />
              </div>

              {/* Filter Popover */}
              <Popover open={showFilters} onOpenChange={setShowFilters}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={hasActiveFilters ? "bg-primary text-primary-foreground" : ""}
                  >
                    <Filter className="w-4 h-4" />
                    {hasActiveFilters && <span className="mr-1">({filteredTickets.length})</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" dir="rtl" align="end">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-right">فیلتر تیکت‌ها</h4>
                      {hasActiveFilters && (
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                          <FilterX className="w-3 h-3" />
                          پاک کردن
                        </Button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label className="text-right text-sm font-medium">وضعیت</Label>
                        <Select value={filterStatus} onValueChange={setFilterStatus} dir="rtl">
                          <SelectTrigger className="text-right">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                            <SelectItem value="open">باز</SelectItem>
                            <SelectItem value="in-progress">در حال انجام</SelectItem>
                            <SelectItem value="resolved">حل شده</SelectItem>
                            <SelectItem value="closed">بسته</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-right text-sm font-medium">اولویت</Label>
                        <Select value={filterPriority} onValueChange={setFilterPriority} dir="rtl">
                          <SelectTrigger className="text-right">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">همه اولویت‌ها</SelectItem>
                            <SelectItem value="low">کم</SelectItem>
                            <SelectItem value="medium">متوسط</SelectItem>
                            <SelectItem value="high">بالا</SelectItem>
                            <SelectItem value="urgent">فوری</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-right text-sm font-medium">دسته‌بندی</Label>
                        <Select value={filterCategory} onValueChange={setFilterCategory} dir="rtl">
                          <SelectTrigger className="text-right">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">همه دسته‌ها</SelectItem>
                            <SelectItem value="hardware">سخت‌افزار</SelectItem>
                            <SelectItem value="software">نرم‌افزار</SelectItem>
                            <SelectItem value="network">شبکه</SelectItem>
                            <SelectItem value="email">ایمیل</SelectItem>
                            <SelectItem value="security">امنیت</SelectItem>
                            <SelectItem value="access">دسترسی</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground text-right">
                        نمایش {filteredTickets.length} از {mockTickets.length} تیکت
                      </p>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => {
                const CategoryIcon = categoryIcons[ticket.category] || Ticket
                return (
                  <div
                    key={ticket.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedTicket(ticket)}
                    dir="rtl"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-2 items-center">
                        <Badge variant="outline" className="font-mono text-xs">
                          {ticket.id}
                        </Badge>
                        <Badge className={statusColors[ticket.status]}>{statusLabels[ticket.status]}</Badge>
                        <Badge className={priorityColors[ticket.priority]}>{priorityLabels[ticket.priority]}</Badge>
                        <div className="flex items-center gap-1">
                          <CategoryIcon className="w-3 h-3" />
                          <span className="text-xs text-muted-foreground">{categoryLabels[ticket.category]}</span>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(ticket.createdAt).toLocaleDateString("fa-IR")}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-1 text-right">{ticket.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 text-right">{ticket.description}</p>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{ticket.responses.length} پاسخ</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        مشاهده جزئیات
                      </Button>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-8">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">تیکتی یافت نشد</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {hasActiveFilters ? "فیلترهای خود را تغییر دهید" : "هنوز تیکتی ثبت نشده است"}
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters} className="mt-3 gap-2 bg-transparent">
                    <FilterX className="w-4 h-4" />
                    پاک کردن فیلترها
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const AdminDashboard = () => (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div className="text-right">
          <h2 className="text-2xl font-bold">پنل مدیریت</h2>
          <p className="text-muted-foreground">مدیریت تیکت‌های پشتیبانی</p>
        </div>
        <div className="flex gap-2">{/* System settings button removed */}</div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">کل تیکت‌ها</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">{mockTickets.length}</div>
            <p className="text-xs text-muted-foreground text-right">+12% از ماه گذشته</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">در انتظار پاسخ</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">{mockTickets.filter((t) => t.status === "open").length}</div>
            <p className="text-xs text-muted-foreground text-right">نیاز به توجه فوری</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">میانگین زمان پاسخ</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">2.4 ساعت</div>
            <p className="text-xs text-muted-foreground text-right">-15% بهبود</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">رضایت مشتری</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">94%</div>
            <p className="text-xs text-muted-foreground text-right">+2% بهبود</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-right">تیکت‌های اخیر</CardTitle>
            <div className="flex gap-2">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="جستجو در تیکت‌ها..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 w-64 text-right"
                  dir="rtl"
                />
              </div>

              {/* Filter Popover */}
              <Popover open={showFilters} onOpenChange={setShowFilters}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={hasActiveFilters ? "bg-primary text-primary-foreground" : ""}
                  >
                    <Filter className="w-4 h-4" />
                    {hasActiveFilters && <span className="mr-1">({filteredTickets.length})</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" dir="rtl" align="end">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-right">فیلتر تیکت‌ها</h4>
                      {hasActiveFilters && (
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1">
                          <FilterX className="w-3 h-3" />
                          پاک کردن
                        </Button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label className="text-right text-sm font-medium">وضعیت</Label>
                        <Select value={filterStatus} onValueChange={setFilterStatus} dir="rtl">
                          <SelectTrigger className="text-right">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                            <SelectItem value="open">باز</SelectItem>
                            <SelectItem value="in-progress">در حال انجام</SelectItem>
                            <SelectItem value="resolved">حل شده</SelectItem>
                            <SelectItem value="closed">بسته</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-right text-sm font-medium">اولویت</Label>
                        <Select value={filterPriority} onValueChange={setFilterPriority} dir="rtl">
                          <SelectTrigger className="text-right">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">همه اولویت‌ها</SelectItem>
                            <SelectItem value="low">کم</SelectItem>
                            <SelectItem value="medium">متوسط</SelectItem>
                            <SelectItem value="high">بالا</SelectItem>
                            <SelectItem value="urgent">فوری</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-right text-sm font-medium">دسته‌بندی</Label>
                        <Select value={filterCategory} onValueChange={setFilterCategory} dir="rtl">
                          <SelectTrigger className="text-right">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">همه دسته‌ها</SelectItem>
                            <SelectItem value="hardware">سخت‌افزار</SelectItem>
                            <SelectItem value="software">نرم‌افزار</SelectItem>
                            <SelectItem value="network">شبکه</SelectItem>
                            <SelectItem value="email">ایمیل</SelectItem>
                            <SelectItem value="security">امنیت</SelectItem>
                            <SelectItem value="access">دسترسی</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground text-right">
                        نمایش {filteredTickets.length} از {mockTickets.length} تیکت
                      </p>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTickets.length > 0 ? (
              filteredTickets.map((ticket) => {
                const CategoryIcon = categoryIcons[ticket.category] || Ticket
                return (
                  <div
                    key={ticket.id}
                    className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => setSelectedTicket(ticket)}
                    dir="rtl"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-2 items-center">
                        <Badge variant="outline" className="font-mono text-xs">
                          {ticket.id}
                        </Badge>
                        <Badge className={statusColors[ticket.status]}>{statusLabels[ticket.status]}</Badge>
                        <Badge className={priorityColors[ticket.priority]}>{priorityLabels[ticket.priority]}</Badge>
                        <div className="flex items-center gap-1">
                          <CategoryIcon className="w-3 h-3" />
                          <span className="text-xs text-muted-foreground">{categoryLabels[ticket.category]}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">{ticket.clientName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">{ticket.clientName}</span>
                      </div>
                    </div>
                    <h3 className="font-semibold mb-1 text-right">{ticket.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 text-right">{ticket.description}</p>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{ticket.responses.length}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {new Date(ticket.updatedAt).toLocaleDateString("fa-IR")}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm">
                        پاسخ دادن
                      </Button>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-8">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">تیکتی یافت نشد</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {hasActiveFilters ? "فیلترهای خود را تغییر دهید" : "هنوز تیکتی ثبت نشده است"}
                </p>
                {hasActiveFilters && (
                  <Button variant="outline" onClick={clearFilters} className="mt-3 gap-2 bg-transparent">
                    <FilterX className="w-4 h-4" />
                    پاک کردن فیلترها
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const GuestView = () => (
    <div className="min-h-[60vh] flex items-center justify-center" dir="rtl">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Ticket className="w-6 h-6" />
            سیستم مدیریت خدمات IT
          </CardTitle>
          <p className="text-muted-foreground">برای دسترسی به سیستم وارد شوید</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={() => setLoginDialog(true)} className="w-full gap-2">
            <LogIn className="w-4 h-4" />
            ورود به سیستم
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">یا</p>
            <Dialog open={accessTicketDialog} onOpenChange={setAccessTicketDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full gap-2 bg-transparent">
                  <Eye className="w-4 h-4" />
                  دسترسی به تیکت موجود
                </Button>
              </DialogTrigger>
              <DialogContent dir="rtl">
                <DialogHeader>
                  <DialogTitle className="text-right">دسترسی به تیکت</DialogTitle>
                  <DialogDescription className="text-right">
                    برای دسترسی به تیکت، اطلاعات زیر را وارد کنید
                  </DialogDescription>
                </DialogHeader>
                <TicketAccessForm onClose={() => setAccessTicketDialog(false)} />
              </DialogContent>
            </Dialog>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground text-center">حساب‌های نمونه برای تست:</p>
            <div className="mt-2 space-y-1 text-xs text-muted-foreground text-right">
              <p>کاربر: ahmad@company.com / 123456</p>
              <p>تکنسین: ali@company.com / 123456</p>
              <p>مدیر: admin@company.com / 123456</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const TicketAccessForm = ({ onClose }) => {
    const {
      control,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm({
      resolver: yupResolver(ticketAccessSchema),
      defaultValues: {
        ticketId: "",
        email: "",
        phone: "",
      },
    })

    const onSubmit = async (data) => {
      try {
        console.log("Access Data:", data)

        toast({
          title: "دسترسی تأیید شد",
          description: "به تیکت مورد نظر دسترسی پیدا کردید",
        })

        onClose()
      } catch (error) {
        toast({
          title: "خطا در دسترسی",
          description: "اطلاعات وارد شده صحیح نیست",
          variant: "destructive",
        })
      }
    }

    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" dir="rtl">
        <div className="space-y-2">
          <Label htmlFor="ticketId" className="text-right">
            شماره تیکت *
          </Label>
          <Controller
            name="ticketId"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="مثال: TK-2024-001" className="text-right" dir="rtl" />
            )}
          />
          {errors.ticketId && <p className="text-sm text-red-500 text-right">{errors.ticketId.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-right">
            ایمیل *
          </Label>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input {...field} type="email" placeholder="ایمیل ثبت شده در تیکت" className="text-right" dir="rtl" />
            )}
          />
          {errors.email && <p className="text-sm text-red-500 text-right">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-right">
            شماره تماس *
          </Label>
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="شماره تماس ثبت شده" className="text-right" dir="rtl" />
            )}
          />
          {errors.phone && <p className="text-sm text-red-500 text-right">{errors.phone.message}</p>}
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            انصراف
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "در حال بررسی..." : "دسترسی به تیکت"}
          </Button>
        </div>
      </form>
    )
  }

  const activeView = getActiveView()

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Ticket className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">سیستم مدیریت خدمات IT</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {user ? (
                <UserMenu />
              ) : (
                <Button variant="outline" onClick={() => setLoginDialog(true)} className="gap-2">
                  <LogIn className="w-4 h-4" />
                  ورود
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {activeView === "guest" && <GuestView />}

        {activeView === "client" && (
          <Tabs value="client" className="w-full" dir="rtl">
            <TabsList className="grid w-full grid-cols-1 max-w-md mx-auto mb-6">
              <TabsTrigger value="client" className="gap-2">
                <User className="w-4 h-4" />
                پنل کاربری
              </TabsTrigger>
            </TabsList>
            <TabsContent value="client">
              <ClientDashboard />
            </TabsContent>
          </Tabs>
        )}

        {activeView === "admin" && (
          <Tabs value="admin" className="w-full" dir="rtl">
            <TabsList className="grid w-full grid-cols-1 max-w-md mx-auto mb-6">
              <TabsTrigger value="admin" className="gap-2">
                <Settings className="w-4 h-4" />
                {user?.role === "admin" ? "پنل مدیریت" : "پنل تکنسین"}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="admin">
              <AdminDashboard />
            </TabsContent>
          </Tabs>
        )}
      </div>

      {selectedTicket && (
        <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" dir="rtl">
            <DialogHeader>
              <div className="flex justify-between items-start">
                <div className="text-right">
                  <DialogTitle className="flex items-center gap-2 text-right">
                    <Badge variant="outline" className="font-mono">
                      {selectedTicket.id}
                    </Badge>
                    {selectedTicket.title}
                  </DialogTitle>
                  <DialogDescription className="mt-2 text-right">
                    ایجاد شده توسط {selectedTicket.clientName} در{" "}
                    {new Date(selectedTicket.createdAt).toLocaleDateString("fa-IR")}
                  </DialogDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={statusColors[selectedTicket.status]}>{statusLabels[selectedTicket.status]}</Badge>
                  <Badge className={priorityColors[selectedTicket.priority]}>
                    {priorityLabels[selectedTicket.priority]}
                  </Badge>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-right">شرح مشکل:</h4>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg text-right">
                  {selectedTicket.description}
                </p>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3 text-right">پاسخ‌ها و گفتگو:</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {selectedTicket.responses.length > 0 ? (
                    selectedTicket.responses.map((response) => (
                      <div
                        key={response.id}
                        className={`p-3 rounded-lg ${
                          response.isAdmin ? "bg-blue-50 border-r-4 border-blue-500" : "bg-gray-50"
                        }`}
                        dir="rtl"
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-sm">{response.author}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(response.timestamp).toLocaleDateString("fa-IR")}
                          </span>
                        </div>
                        <p className="text-sm text-right">{response.message}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">هنوز پاسخی ثبت نشده است</p>
                  )}
                </div>
              </div>

              {activeView === "admin" && (
                <div className="space-y-3">
                  <Separator />
                  <div className="flex gap-2" dir="rtl">
                    <Select defaultValue={selectedTicket.status} dir="rtl">
                      <SelectTrigger className="w-40 text-right">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">باز</SelectItem>
                        <SelectItem value="in-progress">در حال انجام</SelectItem>
                        <SelectItem value="resolved">حل شده</SelectItem>
                        <SelectItem value="closed">بسته</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      به‌روزرسانی وضعیت
                    </Button>
                  </div>

                  <div className="flex gap-2" dir="rtl">
                    <Textarea
                      placeholder="پاسخ خود را اینجا بنویسید..."
                      className="flex-1 text-right"
                      rows={3}
                      dir="rtl"
                    />
                    <Button className="self-end">
                      <Send className="w-4 h-4 ml-2" />
                      ارسال پاسخ
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      <LoginDialog open={loginDialog} onOpenChange={setLoginDialog} />
      <Toaster />
    </div>
  )
}
