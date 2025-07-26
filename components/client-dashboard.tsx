"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { TwoStepTicketForm } from "@/components/two-step-ticket-form"
import { toast } from "@/hooks/use-toast"
import {
  Plus,
  Search,
  Filter,
  Eye,
  Clock,
  AlertCircle,
  CheckCircle,
  Ticket,
  HardDrive,
  ComputerIcon as Software,
  Network,
  Mail,
  Shield,
  Key,
  MessageSquare,
  Calendar,
  Download,
  Printer,
  RefreshCw,
  TrendingUp,
  Users,
  Activity,
} from "lucide-react"

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

interface ClientDashboardProps {
  tickets: any[]
  onTicketCreate: (ticket: any) => void
  currentUser: any
  categories: any
}

export function ClientDashboard({ tickets, onTicketCreate, currentUser, categories }: ClientDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [performanceReportOpen, setPerformanceReportOpen] = useState(false)
  const [supportTeamOpen, setSupportTeamOpen] = useState(false)
  const [systemStatusOpen, setSystemStatusOpen] = useState(false)
  const [messagesOpen, setMessagesOpen] = useState(false)

  // Create category labels from dynamic categories
  const categoryLabels = Object.fromEntries(
    Object.entries(categories).map(([key, category]: [string, any]) => [key, category.label]),
  )

  // Filter tickets for current user
  const userTickets = tickets.filter((ticket) => ticket.clientEmail === currentUser?.email)

  // Filter tickets based on search and filters
  const filteredTickets = userTickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus
    const matchesPriority = filterPriority === "all" || ticket.priority === filterPriority

    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleViewTicket = (ticket: any) => {
    setSelectedTicket(ticket)
    setViewDialogOpen(true)
  }

  const handleCreateTicket = (ticketData: any) => {
    onTicketCreate(ticketData)
    setCreateDialogOpen(false)
    toast({
      title: "تیکت ایجاد شد",
      description: "درخواست شما با موفقیت ثبت شد و به زودی بررسی خواهد شد",
    })
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    // Simulate refresh
    setTimeout(() => {
      setIsRefreshing(false)
      toast({
        title: "به‌روزرسانی انجام شد",
        description: "اطلاعات تیکت‌ها به‌روزرسانی شد",
      })
    }, 1000)
  }

  const handleExportTickets = () => {
    const csvContent = [
      ["شماره تیکت", "عنوان", "وضعیت", "اولویت", "دسته‌بندی", "تاریخ ایجاد", "آخرین به‌روزرسانی"],
      ...filteredTickets.map((ticket) => [
        ticket.id,
        ticket.title,
        statusLabels[ticket.status],
        priorityLabels[ticket.priority],
        categoryLabels[ticket.category] || ticket.category,
        new Date(ticket.createdAt).toLocaleDateString("fa-IR"),
        new Date(ticket.updatedAt).toLocaleDateString("fa-IR"),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `my-tickets-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "فایل دانلود شد",
      description: "لیست تیکت‌های شما به صورت CSV دانلود شد",
    })
  }

  const handlePrintTickets = () => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
          <title>تیکت‌های من</title>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Tahoma', Arial, sans-serif; direction: rtl; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .header { text-align: center; margin-bottom: 30px; }
            .status-open { background-color: #fee2e2; color: #991b1b; }
            .status-in-progress { background-color: #fef3c7; color: #92400e; }
            .status-resolved { background-color: #d1fae5; color: #065f46; }
            .status-closed { background-color: #f3f4f6; color: #374151; }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>تیکت‌های ${currentUser?.name}</h1>
            <p>تاریخ تولید گزارش: ${new Date().toLocaleDateString("fa-IR")}</p>
            <p>تعداد تیکت‌ها: ${filteredTickets.length}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>شماره تیکت</th>
                <th>عنوان</th>
                <th>وضعیت</th>
                <th>اولویت</th>
                <th>دسته‌بندی</th>
                <th>تکنسین</th>
                <th>تاریخ ایجاد</th>
              </tr>
            </thead>
            <tbody>
              ${filteredTickets
                .map(
                  (ticket) => `
                <tr>
                  <td>${ticket.id}</td>
                  <td>${ticket.title}</td>
                  <td class="status-${ticket.status}">${statusLabels[ticket.status]}</td>
                  <td>${priorityLabels[ticket.priority]}</td>
                  <td>${categoryLabels[ticket.category] || ticket.category}</td>
                  <td>${ticket.assignedTechnicianName || "تعیین نشده"}</td>
                  <td>${new Date(ticket.createdAt).toLocaleDateString("fa-IR")}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
        </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  // Calculate statistics
  const stats = {
    total: userTickets.length,
    open: userTickets.filter((t) => t.status === "open").length,
    inProgress: userTickets.filter((t) => t.status === "in-progress").length,
    resolved: userTickets.filter((t) => t.status === "resolved").length,
    closed: userTickets.filter((t) => t.status === "closed").length,
    urgent: userTickets.filter((t) => t.priority === "urgent").length,
    avgResponseTime: userTickets.length > 0 ? "2.3 ساعت" : "0",
    satisfactionRate: userTickets.length > 0 ? "4.6" : "0",
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div className="text-right">
          <h2 className="text-2xl font-bold">پنل کاربری</h2>
          <p className="text-muted-foreground">مدیریت درخواست‌های خدمات IT</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing} className="gap-2 bg-transparent">
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            به‌روزرسانی
          </Button>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                ایجاد تیکت جدید
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
              <DialogHeader>
                <DialogTitle className="text-right">ایجاد درخواست جدید</DialogTitle>
              </DialogHeader>
              <TwoStepTicketForm
                onSubmit={handleCreateTicket}
                onClose={() => setCreateDialogOpen(false)}
                categories={categories}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">کل تیکت‌ها</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">{stats.total}</div>
            <p className="text-xs text-muted-foreground text-right">{stats.urgent > 0 && `${stats.urgent} فوری`}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">در انتظار پاسخ</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">{stats.open}</div>
            <p className="text-xs text-muted-foreground text-right">
              {stats.open > 0 ? "نیاز به پیگیری" : "همه پاسخ داده شده"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">در حال انجام</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground text-right">میانگین پاسخ: {stats.avgResponseTime}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">حل شده</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">{stats.resolved + stats.closed}</div>
            <p className="text-xs text-muted-foreground text-right">رضایت: {stats.satisfactionRate}/5</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">عملیات سریع</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Dialog open={performanceReportOpen} onOpenChange={setPerformanceReportOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 h-auto p-4 flex-col bg-transparent">
                  <TrendingUp className="w-6 h-6 text-blue-500" />
                  <span className="text-sm">گزارش عملکرد</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="text-right">گزارش عملکرد</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                          <div className="text-sm text-muted-foreground">کل تیکت‌ها</div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">{stats.resolved + stats.closed}</div>
                          <div className="text-sm text-muted-foreground">حل شده</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>میانگین زمان پاسخ:</span>
                      <span className="font-medium">{stats.avgResponseTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>نرخ رضایت:</span>
                      <span className="font-medium">{stats.satisfactionRate}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>تیکت‌های فوری:</span>
                      <span className="font-medium">{stats.urgent}</span>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={supportTeamOpen} onOpenChange={setSupportTeamOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 h-auto p-4 flex-col bg-transparent">
                  <Users className="w-6 h-6 text-green-500" />
                  <span className="text-sm">تیم پشتیبانی</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="text-right">تیم پشتیبانی</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>ع.ا</AvatarFallback>
                          </Avatar>
                          <div className="text-right">
                            <div className="font-medium">علی احمدی</div>
                            <div className="text-sm text-muted-foreground">تکنسین ارشد - سخت‌افزار</div>
                            <div className="text-sm text-green-600">آنلاین</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>م.ر</AvatarFallback>
                          </Avatar>
                          <div className="text-right">
                            <div className="font-medium">مریم رضایی</div>
                            <div className="text-sm text-muted-foreground">تکنسین - نرم‌افزار</div>
                            <div className="text-sm text-yellow-600">مشغول</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>ح.م</AvatarFallback>
                          </Avatar>
                          <div className="text-right">
                            <div className="font-medium">حسن محمدی</div>
                            <div className="text-sm text-muted-foreground">تکنسین - شبکه</div>
                            <div className="text-sm text-green-600">آنلاین</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-sm text-blue-800 text-right">برای تماس فوری با تیم پشتیبانی: داخلی 1234</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={systemStatusOpen} onOpenChange={setSystemStatusOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 h-auto p-4 flex-col bg-transparent">
                  <Activity className="w-6 h-6 text-purple-500" />
                  <span className="text-sm">وضعیت سیستم</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="text-right">وضعیت سیستم‌ها</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>سرور اصلی</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">عملیاتی</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>شبکه داخلی</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">عملیاتی</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span>سرور ایمیل</span>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">نگهداری</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>پایگاه داده</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">عملیاتی</Badge>
                    </div>
                  </div>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800 text-right">
                      <strong>اطلاعیه:</strong> نگهداری برنامه‌ریزی شده سرور ایمیل تا ساعت 14:00 ادامه دارد.
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={messagesOpen} onOpenChange={setMessagesOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 h-auto p-4 flex-col bg-transparent">
                  <MessageSquare className="w-6 h-6 text-orange-500" />
                  <span className="text-sm">پیام‌های جدید</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="text-right">پیام‌های جدید</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>ع.ا</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 text-right">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium">علی احمدی</div>
                                <div className="text-sm text-muted-foreground">تکنسین</div>
                              </div>
                              <div className="text-xs text-muted-foreground">2 ساعت پیش</div>
                            </div>
                            <div className="mt-2 text-sm">تیکت شما بررسی شد و در حال انجام است. لطفاً صبور باشید.</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback>سیس</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 text-right">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="font-medium">سیستم</div>
                                <div className="text-sm text-muted-foreground">اطلاعیه</div>
                              </div>
                              <div className="text-xs text-muted-foreground">1 روز پیش</div>
                            </div>
                            <div className="mt-2 text-sm">به‌روزرسانی سیستم تیکتینگ با موفقیت انجام شد.</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="text-center">
                    <Button variant="outline" className="gap-2 bg-transparent">
                      <MessageSquare className="w-4 h-4" />
                      مشاهده همه پیام‌ها
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-right">تیکت‌های من</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handlePrintTickets} className="gap-2 bg-transparent">
                <Printer className="w-4 h-4" />
                چاپ
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportTickets} className="gap-2 bg-transparent">
                <Download className="w-4 h-4" />
                دانلود
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Enhanced Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="جستجو در تیکت‌ها..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 text-right"
                dir="rtl"
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus} dir="rtl">
              <SelectTrigger className="text-right">
                <SelectValue placeholder="وضعیت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                <SelectItem value="open">باز</SelectItem>
                <SelectItem value="in-progress">در حال انجام</SelectItem>
                <SelectItem value="resolved">حل شده</SelectItem>
                <SelectItem value="closed">بسته</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={setFilterPriority} dir="rtl">
              <SelectTrigger className="text-right">
                <SelectValue placeholder="اولویت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه اولویت‌ها</SelectItem>
                <SelectItem value="low">کم</SelectItem>
                <SelectItem value="medium">متوسط</SelectItem>
                <SelectItem value="high">بالا</SelectItem>
                <SelectItem value="urgent">فوری</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setFilterStatus("all")
                setFilterPriority("all")
              }}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              پاک کردن فیلترها
            </Button>
          </div>

          {/* Results Summary */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground text-right">
              نمایش {filteredTickets.length} از {userTickets.length} تیکت
            </p>
            {filteredTickets.length !== userTickets.length && (
              <Badge variant="secondary">{filteredTickets.length} فیلتر شده</Badge>
            )}
          </div>

          {/* Tickets Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">شماره تیکت</TableHead>
                  <TableHead className="text-right">عنوان</TableHead>
                  <TableHead className="text-right">وضعیت</TableHead>
                  <TableHead className="text-right">اولویت</TableHead>
                  <TableHead className="text-right">دسته‌بندی</TableHead>
                  <TableHead className="text-right">تکنسین</TableHead>
                  <TableHead className="text-right">تاریخ ایجاد</TableHead>
                  <TableHead className="text-right">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => {
                    const CategoryIcon = categoryIcons[ticket.category] || HardDrive

                    return (
                      <TableRow key={ticket.id}>
                        <TableCell className="font-mono text-sm">{ticket.id}</TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={ticket.title}>
                            {ticket.title}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[ticket.status]}>{statusLabels[ticket.status]}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={priorityColors[ticket.priority]}>{priorityLabels[ticket.priority]}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CategoryIcon className="w-4 h-4" />
                            <span className="text-sm">{categoryLabels[ticket.category] || ticket.category}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {ticket.assignedTechnicianName ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-xs">
                                  {ticket.assignedTechnicianName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{ticket.assignedTechnicianName}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">تعیین نشده</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(ticket.createdAt).toLocaleDateString("fa-IR")}
                        </TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" onClick={() => handleViewTicket(ticket)} className="gap-1">
                            <Eye className="w-3 h-3" />
                            مشاهده
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="w-8 h-8 text-muted-foreground" />
                        <p className="text-muted-foreground">تیکتی یافت نشد</p>
                        {searchQuery || filterStatus !== "all" || filterPriority !== "all" ? (
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSearchQuery("")
                              setFilterStatus("all")
                              setFilterPriority("all")
                            }}
                            className="gap-2"
                          >
                            <Filter className="w-4 h-4" />
                            پاک کردن فیلترها
                          </Button>
                        ) : (
                          <Button onClick={() => setCreateDialogOpen(true)} className="gap-2">
                            <Plus className="w-4 h-4" />
                            ایجاد اولین تیکت
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* View Ticket Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">جزئیات تیکت {selectedTicket?.id}</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-6">
              {/* Ticket Header */}
              <div className="flex justify-between items-start">
                <div className="text-right space-y-2">
                  <h3 className="text-xl font-semibold">{selectedTicket.title}</h3>
                  <div className="flex gap-2">
                    <Badge className={statusColors[selectedTicket.status]}>{statusLabels[selectedTicket.status]}</Badge>
                    <Badge className={priorityColors[selectedTicket.priority]}>
                      {priorityLabels[selectedTicket.priority]}
                    </Badge>
                  </div>
                </div>
                <div className="text-left space-y-1">
                  <p className="text-sm text-muted-foreground">شماره تیکت</p>
                  <p className="font-mono text-lg">{selectedTicket.id}</p>
                </div>
              </div>

              <Separator />

              {/* Ticket Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">اطلاعات کلی</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">دسته‌بندی:</span>
                        <span>{categoryLabels[selectedTicket.category] || selectedTicket.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">زیر دسته:</span>
                        <span>{selectedTicket.subcategory}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">تاریخ ایجاد:</span>
                        <span>{new Date(selectedTicket.createdAt).toLocaleDateString("fa-IR")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">آخرین به‌روزرسانی:</span>
                        <span>{new Date(selectedTicket.updatedAt).toLocaleDateString("fa-IR")}</span>
                      </div>
                    </div>
                  </div>

                  {selectedTicket.assignedTechnicianName && (
                    <div>
                      <h4 className="font-medium mb-2">تکنسین مسئول</h4>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>{selectedTicket.assignedTechnicianName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{selectedTicket.assignedTechnicianName}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">اطلاعات تماس</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">نام:</span>
                        <span>{selectedTicket.clientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ایمیل:</span>
                        <span>{selectedTicket.clientEmail}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">تلفن:</span>
                        <span>{selectedTicket.clientPhone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">بخش:</span>
                        <span>{selectedTicket.department}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h4 className="font-medium mb-2">شرح مشکل</h4>
                <div className="bg-muted p-4 rounded-lg text-right">
                  <p className="whitespace-pre-wrap">{selectedTicket.description}</p>
                </div>
              </div>

              {/* Responses */}
              {selectedTicket.responses && selectedTicket.responses.length > 0 && (
                <div>
                  <h4 className="font-medium mb-4 flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    پاسخ‌ها و به‌روزرسانی‌ها
                  </h4>
                  <div className="space-y-4">
                    {selectedTicket.responses.map((response: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">
                                {response.technicianName?.charAt(0) || "T"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm">{response.technicianName}</span>
                          </div>
                          <div className="text-left">
                            <Badge className={statusColors[response.status]} className="mb-1">
                              {statusLabels[response.status]}
                            </Badge>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {new Date(response.timestamp).toLocaleDateString("fa-IR")} -
                              {new Date(response.timestamp).toLocaleTimeString("fa-IR")}
                            </p>
                          </div>
                        </div>
                        <div className="bg-muted/50 p-3 rounded text-right">
                          <p className="whitespace-pre-wrap">{response.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
