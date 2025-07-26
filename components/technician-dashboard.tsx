"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth-context"
import { toast } from "@/hooks/use-toast"
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  MessageSquare,
  Eye,
  Send,
  BarChart3,
  Search,
  RefreshCw,
  Download,
  PlayCircle,
  ComputerIcon as Office,
  SpaceIcon as Room,
  SpaceIcon as Room,
  SpaceIcon as Room,
  SpaceIcon as Room,
  SpaceIcon as Room,
  SpaceIcon as Room,
  BedIcon as Bedroom,
  CloverIcon as Closet,
  SpaceIcon as Room,
  LightbulbIcon as Light,
  AirVentIcon as Vent,
  ComputerIcon as Desktop,
  MedalIcon as Medicine,
  LightbulbIcon as Light,
  SpadeIcon as Spa,
  SunSnowIcon as Spring,
  FuelIcon as Gas,
  MonitorIcon as Mirror,
  EyeIcon as Optic,
} from "lucide-react"

interface TechnicianDashboardProps {
  onLogout: () => void
}

export function TechnicianDashboard({ onLogout }: TechnicianDashboardProps) {
  const { user } = useAuth()
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [response, setResponse] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("assigned")

  // Mock tickets data - assigned to current technician
  const [tickets, setTickets] = useState([
    {
      id: "1",
      title: "مشکل در سیستم ایمیل",
      category: "email",
      priority: "high",
      status: "assigned",
      assignedTo: user?.id,
      createdAt: "2024-01-15T10:30:00Z",
      description: "کاربران قادر به دریافت ایمیل نیستند",
      clientName: "احمد رضایی",
      clientEmail: "ahmad@company.com",
      clientPhone: "09123456789",
      clientDepartment: "IT",
      responses: [],
    },
    {
      id: "2",
      title: "خرابی پرینتر اداری",
      category: "hardware",
      priority: "medium",
      status: "in-progress",
      assignedTo: user?.id,
      createdAt: "2024-01-15T09:15:00Z",
      description: "پرینتر طبقه دوم کار نمی‌کند",
      clientName: "سارا محمدی",
      clientEmail: "sara@company.com",
      clientPhone: "09987654321",
      clientDepartment: "HR",
      responses: [
        {
          id: "1",
          message: "در حال بررسی مشکل هستم",
          timestamp: "2024-01-15T11:00:00Z",
          technician: user?.name,
        },
      ],
    },
    {
      id: "3",
      title: "درخواست نصب نرم‌افزار",
      category: "software",
      priority: "low",
      status: "resolved",
      assignedTo: user?.id,
      createdAt: "2024-01-14T14:20:00Z",
      description: "نیاز به نصب Adobe Photoshop دارم",
      clientName: "فاطمه کریمی",
      clientEmail: "fateme@company.com",
      clientPhone: "09112233445",
      clientDepartment: "Finance",
      responses: [
        {
          id: "1",
          message: "نرم‌افزار با موفقیت نصب شد",
          timestamp: "2024-01-14T16:00:00Z",
          technician: user?.name,
        },
      ],
    },
  ])

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    setTickets((prev) => prev.map((ticket) => (ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket)))
    toast({
      title: "وضعیت تیکت به‌روزرسانی شد",
      description: `وضعیت تیکت به "${getStatusLabel(newStatus)}" تغییر یافت`,
    })
  }

  const handleAddResponse = (ticketId: string, message: string) => {
    const newResponse = {
      id: Date.now().toString(),
      message,
      timestamp: new Date().toISOString(),
      technician: user?.name || "تکنسین",
    }

    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.id === ticketId
          ? {
              ...ticket,
              responses: [...ticket.responses, newResponse],
              status: ticket.status === "assigned" ? "in-progress" : ticket.status,
            }
          : ticket,
      ),
    )

    setResponse("")
    setSelectedTicket(null)
    toast({
      title: "پاسخ ارسال شد",
      description: "پاسخ شما با موفقیت ثبت گردید",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "assigned":
        return <Badge variant="secondary">تعیین شده</Badge>
      case "in-progress":
        return <Badge variant="default">در حال انجام</Badge>
      case "resolved":
        return <Badge variant="outline">حل شده</Badge>
      default:
        return <Badge variant="outline">نامشخص</Badge>
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "assigned":
        return "تعیین شده"
      case "in-progress":
        return "در حال انجام"
      case "resolved":
        return "حل شده"
      default:
        return "نامشخص"
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="destructive">فوری</Badge>
      case "high":
        return <Badge variant="destructive">بالا</Badge>
      case "medium":
        return <Badge variant="secondary">متوسط</Badge>
      case "low":
        return <Badge variant="outline">پایین</Badge>
      default:
        return <Badge variant="outline">نامشخص</Badge>
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "hardware":
        return "سخت‌افزار"
      case "software":
        return "نرم‌افزار"
      case "network":
        return "شبکه"
      case "email":
        return "ایمیل"
      case "access":
        return "دسترسی"
      case "security":
        return "امنیت"
      default:
        return "سایر"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    assigned: tickets.filter((t) => t.status === "assigned").length,
    inProgress: tickets.filter((t) => t.status === "in-progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
    total: tickets.length,
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-right">پنل تکنسین</h1>
          <p className="text-muted-foreground text-right">مدیریت تیکت‌های واگذار شده</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 ml-2" />
            به‌روزرسانی
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 ml-2" />
            گزارش
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">تعیین شده</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">{stats.assigned}</div>
            <p className="text-xs text-muted-foreground text-right">نیاز به شروع کار</p>
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
            <div className="text-2xl font-bold text-right">{stats.resolved}</div>
            <p className="text-xs text-muted-foreground text-right">تکمیل شده</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">کل تیکت‌ها</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">{stats.total}</div>
            <p className="text-xs text-muted-foreground text-right">همه تیکت‌ها</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">جستجو و فیلتر</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="جستجو در تیکت‌ها..."
                className="w-full pr-10 pl-4 py-2 border rounded-md text-right"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                dir="rtl"
              />
            </div>
            <select
              className="px-4 py-2 border rounded-md text-right"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              dir="rtl"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="assigned">تعیین شده</option>
              <option value="in-progress">در حال انجام</option>
              <option value="resolved">حل شده</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">تیکت‌های من</CardTitle>
          <CardDescription className="text-right">لیست تیکت‌های واگذار شده به شما</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTickets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>هیچ تیکتی یافت نشد</p>
                <p className="text-sm">تیکت جدیدی برای شما تعیین نشده است</p>
              </div>
            ) : (
              filteredTickets.map((ticket) => (
                <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-right mb-1">{ticket.title}</h3>
                        <p className="text-sm text-muted-foreground text-right mb-2">{ticket.description}</p>
                        <div className="flex gap-2 justify-end">
                          <Badge variant="outline">{getCategoryLabel(ticket.category)}</Badge>
                          {getPriorityBadge(ticket.priority)}
                          {getStatusBadge(ticket.status)}
                        </div>
                      </div>
                      <div className="text-left mr-4">
                        <p className="text-xs text-muted-foreground mb-1">تاریخ ثبت: {formatDate(ticket.createdAt)}</p>
                        <p className="text-xs text-muted-foreground">شماره تیکت: #{ticket.id}</p>
                      </div>
                    </div>

                    {/* Client Info */}
                    <div className="bg-gray-50 p-3 rounded-md mb-4">
                      <h4 className="font-medium text-sm mb-2 text-right">اطلاعات درخواست کننده:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-right">
                          <span className="text-muted-foreground">نام: </span>
                          <span>{ticket.clientName}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-muted-foreground">بخش: </span>
                          <span>{ticket.clientDepartment}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-muted-foreground">ایمیل: </span>
                          <span>{ticket.clientEmail}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-muted-foreground">تلفن: </span>
                          <span>{ticket.clientPhone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Previous Responses */}
                    {ticket.responses.length > 0 && (
                      <div className="space-y-2 mb-4">
                        <h4 className="font-medium text-sm text-right">پاسخ‌های قبلی:</h4>
                        {ticket.responses.map((response) => (
                          <div key={response.id} className="bg-blue-50 p-3 rounded-md">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-muted-foreground">{formatDate(response.timestamp)}</span>
                              <span className="text-sm font-medium">{response.technician}</span>
                            </div>
                            <p className="text-sm text-right">{response.message}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 justify-end">
                      {ticket.status === "assigned" && (
                        <Button size="sm" onClick={() => handleStatusChange(ticket.id, "in-progress")}>
                          <PlayCircle className="w-4 h-4 ml-2" />
                          شروع کار
                        </Button>
                      )}

                      {ticket.status === "in-progress" && (
                        <Button size="sm" variant="outline" onClick={() => handleStatusChange(ticket.id, "resolved")}>
                          <CheckCircle className="w-4 h-4 ml-2" />
                          حل شده
                        </Button>
                      )}

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <MessageSquare className="w-4 h-4 ml-2" />
                            پاسخ
                          </Button>
                        </DialogTrigger>
                        <DialogContent dir="rtl">
                          <DialogHeader>
                            <DialogTitle className="text-right">ارسال پاسخ</DialogTitle>
                            <DialogDescription className="text-right">
                              پاسخ خود را برای تیکت "{ticket.title}" وارد کنید
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Textarea
                              placeholder="متن پاسخ خود را اینجا وارد کنید..."
                              value={response}
                              onChange={(e) => setResponse(e.target.value)}
                              className="text-right"
                              dir="rtl"
                              rows={4}
                            />
                            <div className="flex gap-2 justify-end">
                              <Button
                                onClick={() => {
                                  if (response.trim()) {
                                    handleAddResponse(ticket.id, response)
                                  }
                                }}
                                disabled={!response.trim()}
                              >
                                <Send className="w-4 h-4 ml-2" />
                                ارسال پاسخ
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <Button size="sm" variant="ghost">
                        <Eye className="w-4 h-4 ml-2" />
                        مشاهده
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
