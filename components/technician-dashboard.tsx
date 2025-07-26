"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import {
  Search,
  Filter,
  Eye,
  MessageSquare,
  Clock,
  AlertCircle,
  CheckCircle,
  Ticket,
  Send,
  Calendar,
  HardDrive,
  ComputerIcon as Software,
  Network,
  Mail,
  Shield,
  Key,
  Download,
  Printer,
  RefreshCw,
  TrendingUp,
  Users,
  Activity,
  Star,
  Award,
  Target,
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

const categoryLabels = {
  hardware: "سخت‌افزار",
  software: "نرم‌افزار",
  network: "شبکه",
  email: "ایمیل",
  security: "امنیت",
  access: "دسترسی",
}

interface TechnicianDashboardProps {
  tickets: any[]
  onTicketUpdate: (ticketId: string, updates: any) => void
  currentUser: any
}

export function TechnicianDashboard({ tickets, onTicketUpdate, currentUser }: TechnicianDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [responseDialogOpen, setResponseDialogOpen] = useState(false)
  const [responseMessage, setResponseMessage] = useState("")
  const [responseStatus, setResponseStatus] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Filter tickets assigned to current technician
  const technicianTickets = tickets.filter((ticket) => ticket.assignedTo === currentUser?.id)

  // Filter tickets based on search and filters
  const filteredTickets = technicianTickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.clientName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus
    const matchesPriority = filterPriority === "all" || ticket.priority === filterPriority

    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleViewTicket = (ticket: any) => {
    setSelectedTicket(ticket)
    setViewDialogOpen(true)
  }

  const handleResponseTicket = (ticket: any) => {
    setSelectedTicket(ticket)
    setResponseStatus(ticket.status)
    setResponseMessage("")
    setResponseDialogOpen(true)
  }

  const handleSubmitResponse = () => {
    if (!responseMessage.trim()) {
      toast({
        title: "خطا",
        description: "لطفاً پیام پاسخ را وارد کنید",
        variant: "destructive",
      })
      return
    }

    const response = {
      message: responseMessage,
      status: responseStatus,
      technicianName: currentUser?.name,
      timestamp: new Date().toISOString(),
    }

    const updatedResponses = selectedTicket?.responses ? [...selectedTicket.responses, response] : [response]

    onTicketUpdate(selectedTicket.id, {
      status: responseStatus,
      responses: updatedResponses,
      updatedAt: new Date().toISOString(),
    })

    toast({
      title: "پاسخ ارسال شد",
      description: "پاسخ شما با موفقیت ثبت شد",
    })

    setResponseDialogOpen(false)
    setResponseMessage("")
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
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
      ["شماره تیکت", "عنوان", "وضعیت", "اولویت", "دسته‌بندی", "درخواست‌کننده", "تاریخ ایجاد"],
      ...filteredTickets.map((ticket) => [
        ticket.id,
        ticket.title,
        statusLabels[ticket.status],
        priorityLabels[ticket.priority],
        categoryLabels[ticket.category],
        ticket.clientName,
        new Date(ticket.createdAt).toLocaleDateString("fa-IR"),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `my-assigned-tickets-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "فایل دانلود شد",
      description: "لیست تیکت‌های واگذار شده به صورت CSV دانلود شد",
    })
  }

  const handlePrintTickets = () => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
          <title>تیکت‌های واگذار شده</title>
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
            <h1>تیکت‌های واگذار شده به ${currentUser?.name}</h1>
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
                <th>درخواست‌کننده</th>
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
                  <td>${categoryLabels[ticket.category]}</td>
                  <td>${ticket.clientName}</td>
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

  // Calculate performance statistics
  const stats = {
    total: technicianTickets.length,
    open: technicianTickets.filter((t) => t.status === "open").length,
    inProgress: technicianTickets.filter((t) => t.status === "in-progress").length,
    resolved: technicianTickets.filter((t) => t.status === "resolved").length,
    closed: technicianTickets.filter((t) => t.status === "closed").length,
    urgent: technicianTickets.filter((t) => t.priority === "urgent").length,
    avgResponseTime: "2.1 ساعت",
    satisfactionRate: "4.8",
    completionRate:
      technicianTickets.length > 0
        ? Math.round((((stats?.resolved || 0) + (stats?.closed || 0)) / technicianTickets.length) * 100)
        : 0,
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div className="text-right">
          <h2 className="text-2xl font-bold">پنل تکنسین</h2>
          <p className="text-muted-foreground">مدیریت تیکت‌های واگذار شده</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing} className="gap-2 bg-transparent">
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            به‌روزرسانی
          </Button>
        </div>
      </div>

      {/* Enhanced Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">تیکت‌های من</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">{stats.total}</div>
            <p className="text-xs text-muted-foreground text-right">{stats.urgent > 0 && `${stats.urgent} فوری`}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">نیاز به پاسخ</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">{stats.open}</div>
            <p className="text-xs text-muted-foreground text-right">میانگین پاسخ: {stats.avgResponseTime}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">در حال انجام</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground text-right">در حال پردازش</p>
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

      {/* Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">عملکرد من</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Target className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{stats.completionRate}%</div>
              <div className="text-sm text-muted-foreground">نرخ تکمیل</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Clock className="w-6 h-6 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-green-600">{stats.avgResponseTime}</div>
              <div className="text-sm text-muted-foreground">میانگین پاسخ</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Star className="w-6 h-6 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-yellow-600">{stats.satisfactionRate}</div>
              <div className="text-sm text-muted-foreground">رضایت مشتری</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Award className="w-6 h-6 text-purple-500" />
              </div>
              <div className="text-2xl font-bold text-purple-600">A+</div>
              <div className="text-sm text-muted-foreground">رتبه عملکرد</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">عملیات سریع</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="gap-2 h-auto p-4 flex-col bg-transparent">
              <TrendingUp className="w-6 h-6 text-blue-500" />
              <span className="text-sm">گزارش عملکرد</span>
            </Button>
            <Button variant="outline" className="gap-2 h-auto p-4 flex-col bg-transparent">
              <Users className="w-6 h-6 text-green-500" />
              <span className="text-sm">تیم فنی</span>
            </Button>
            <Button variant="outline" className="gap-2 h-auto p-4 flex-col bg-transparent">
              <Activity className="w-6 h-6 text-purple-500" />
              <span className="text-sm">آمار سیستم</span>
            </Button>
            <Button variant="outline" className="gap-2 h-auto p-4 flex-col bg-transparent">
              <MessageSquare className="w-6 h-6 text-orange-500" />
              <span className="text-sm">پیام‌های جدید</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-right">تیکت‌های واگذار شده</CardTitle>
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
              نمایش {filteredTickets.length} از {technicianTickets.length} تیکت
            </p>
            {filteredTickets.length !== technicianTickets.length && (
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
                  <TableHead className="text-right">درخواست‌کننده</TableHead>
                  <TableHead className="text-right">تاریخ ایجاد</TableHead>
                  <TableHead className="text-right">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => {
                    const CategoryIcon = categoryIcons[ticket.category]

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
                            <span className="text-sm">{categoryLabels[ticket.category]}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">{ticket.clientName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{ticket.clientName}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(ticket.createdAt).toLocaleDateString("fa-IR")}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewTicket(ticket)}
                              className="gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              مشاهده
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleResponseTicket(ticket)}
                              className="gap-1"
                            >
                              <MessageSquare className="w-3 h-3" />
                              پاسخ
                            </Button>
                          </div>
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
                          <p className="text-sm text-muted-foreground">هیچ تیکتی به شما واگذار نشده است</p>
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
                        <span>{categoryLabels[selectedTicket.category]}</span>
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
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">اطلاعات درخواست‌کننده</h4>
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
                            <Badge className={statusColors[response.status]}>{statusLabels[response.status]}</Badge>
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

      {/* Response Dialog */}
      <Dialog open={responseDialogOpen} onOpenChange={setResponseDialogOpen}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">پاسخ به تیکت {selectedTicket?.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">{selectedTicket?.title}</h4>
              <p className="text-sm text-muted-foreground">درخواست‌کننده: {selectedTicket?.clientName}</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">وضعیت جدید</label>
              <Select value={responseStatus} onValueChange={setResponseStatus} dir="rtl">
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="انتخاب وضعیت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-progress">در حال انجام</SelectItem>
                  <SelectItem value="resolved">حل شده</SelectItem>
                  <SelectItem value="closed">بسته</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">پیام پاسخ</label>
              <Textarea
                placeholder="پاسخ خود را اینجا بنویسید..."
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                className="min-h-[120px] text-right"
                dir="rtl"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setResponseDialogOpen(false)}>
                انصراف
              </Button>
              <Button onClick={handleSubmitResponse} className="gap-2">
                <Send className="w-4 h-4" />
                ارسال پاسخ
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
