"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth-context"
import { useTickets } from "@/lib/ticket-context"
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
  PauseCircle,
  Timer,
  User,
  Phone,
  Mail,
  Building,
  FileText,
  Settings,
  TrendingUp,
  Award,
  Zap,
  Activity,
  Ticket,
  Filter,
  MoreHorizontal,
  Flag,
  Star,
  BookOpen,
  Wrench,
} from "lucide-react"

interface TechnicianDashboardProps {
  onLogout: () => void
}

export function TechnicianDashboard({ onLogout }: TechnicianDashboardProps) {
  const { user } = useAuth()
  const { tickets, updateTicket, addResponse, getTicketsByTechnician } = useTickets()
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [responseText, setResponseText] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [activeTimer, setActiveTimer] = useState<string | null>(null)
  const [timeSpent, setTimeSpent] = useState<{ [key: string]: number }>({})
  const [sortBy, setSortBy] = useState("priority")

  // Get technician's tickets
  const technicianTickets = getTicketsByTechnician(user?.id || "tech-001")

  // Timer functionality
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (activeTimer) {
      interval = setInterval(() => {
        setTimeSpent((prev) => ({
          ...prev,
          [activeTimer]: (prev[activeTimer] || 0) + 1,
        }))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [activeTimer])

  const startTimer = (ticketId: string) => {
    setActiveTimer(ticketId)
    updateTicket(ticketId, { status: "in-progress" })
    toast({
      title: "تایمر شروع شد",
      description: "زمان کار روی این تیکت شروع شد",
    })
  }

  const stopTimer = (ticketId: string) => {
    setActiveTimer(null)
    const totalTime = Math.floor((timeSpent[ticketId] || 0) / 60)
    updateTicket(ticketId, {
      actualTime: `${totalTime} دقیقه`,
    })
    toast({
      title: "تایمر متوقف شد",
      description: `زمان صرف شده: ${totalTime} دقیقه`,
    })
  }

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    updateTicket(ticketId, { status: newStatus as any })
    if (newStatus === "resolved") {
      setActiveTimer(null)
    }
    toast({
      title: "وضعیت تیکت تغییر کرد",
      description: `وضعیت به "${getStatusLabel(newStatus)}" تغییر یافت`,
    })
  }

  const handleAddResponse = () => {
    if (!selectedTicket || !responseText.trim()) return

    addResponse(selectedTicket.id, {
      text: responseText,
      author: user?.name || "تکنسین",
      type: "technician",
    })

    setResponseText("")
    toast({
      title: "پاسخ ارسال شد",
      description: "پاسخ شما با موفقیت ثبت گردید",
    })
  }

  const handleResolveTicket = (ticketId: string, resolution: string) => {
    updateTicket(ticketId, {
      status: "resolved",
      resolution: resolution,
    })
    setActiveTimer(null)
    toast({
      title: "تیکت حل شد",
      description: "تیکت با موفقیت حل و بسته شد",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertTriangle className="w-3 h-3" />
            باز
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="default" className="gap-1">
            <Clock className="w-3 h-3" />
            در حال انجام
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline" className="gap-1 bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3" />
            حل شده
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open":
        return "باز"
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
        return (
          <Badge variant="destructive" className="gap-1">
            <Flag className="w-3 h-3" />
            فوری
          </Badge>
        )
      case "high":
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600 gap-1">
            <Flag className="w-3 h-3" />
            بالا
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="secondary" className="gap-1">
            <Flag className="w-3 h-3" />
            متوسط
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="gap-1">
            <Flag className="w-3 h-3" />
            پایین
          </Badge>
        )
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const getCategoryLabel = (category: string) => {
    const categories: { [key: string]: string } = {
      hardware: "سخت‌افزار",
      software: "نرم‌افزار",
      network: "شبکه",
      email: "ایمیل",
      access: "دسترسی",
      security: "امنیت",
    }
    return categories[category] || "سایر"
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

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Filter and sort tickets
  const filteredTickets = technicianTickets
    .filter((ticket) => {
      const matchesSearch =
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.clientName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
      const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter
      return matchesSearch && matchesStatus && matchesPriority
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "priority":
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
          return (
            (priorityOrder[b.priority as keyof typeof priorityOrder] || 0) -
            (priorityOrder[a.priority as keyof typeof priorityOrder] || 0)
          )
        case "date":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "status":
          return a.status.localeCompare(b.status)
        default:
          return 0
      }
    })

  // Statistics
  const stats = {
    total: technicianTickets.length,
    open: technicianTickets.filter((t) => t.status === "open").length,
    inProgress: technicianTickets.filter((t) => t.status === "in-progress").length,
    resolved: technicianTickets.filter((t) => t.status === "resolved").length,
    urgent: technicianTickets.filter((t) => t.priority === "urgent").length,
    avgResponseTime: "1.2 ساعت",
    resolutionRate:
      Math.round((technicianTickets.filter((t) => t.status === "resolved").length / technicianTickets.length) * 100) ||
      0,
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-right flex items-center gap-2">
              <Wrench className="w-8 h-8 text-blue-600" />
              پنل تکنسین
            </h1>
            <p className="text-muted-foreground text-right">مدیریت حرفه‌ای تیکت‌های پشتیبانی</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <RefreshCw className="w-4 h-4" />
              به‌روزرسانی
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Download className="w-4 h-4" />
              گزارش عملکرد
            </Button>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Settings className="w-4 h-4" />
              تنظیمات
            </Button>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-right">کل تیکت‌ها</CardTitle>
              <Ticket className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-right">{stats.total}</div>
              <p className="text-xs opacity-80 text-right">تیکت‌های واگذار شده</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-right">فوری</CardTitle>
              <AlertTriangle className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-right">{stats.urgent}</div>
              <p className="text-xs opacity-80 text-right">نیاز به توجه فوری</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-right">نرخ حل</CardTitle>
              <TrendingUp className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-right">{stats.resolutionRate}%</div>
              <p className="text-xs opacity-80 text-right">تیکت‌های حل شده</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-right">زمان پاسخ</CardTitle>
              <Timer className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-right">{stats.avgResponseTime}</div>
              <p className="text-xs opacity-80 text-right">میانگین پاسخ‌دهی</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="tickets" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tickets" className="gap-2">
              <Ticket className="w-4 h-4" />
              تیکت‌های من
            </TabsTrigger>
            <TabsTrigger value="active" className="gap-2">
              <Activity className="w-4 h-4" />
              در حال کار
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              آمار عملکرد
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="gap-2">
              <BookOpen className="w-4 h-4" />
              دانش‌نامه
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tickets" className="space-y-4">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-right flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  فیلتر و جستجو
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="جستجو در تیکت‌ها..."
                      className="pr-10 text-right"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      dir="rtl"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="وضعیت" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                      <SelectItem value="open">باز</SelectItem>
                      <SelectItem value="in-progress">در حال انجام</SelectItem>
                      <SelectItem value="resolved">حل شده</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="اولویت" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">همه اولویت‌ها</SelectItem>
                      <SelectItem value="urgent">فوری</SelectItem>
                      <SelectItem value="high">بالا</SelectItem>
                      <SelectItem value="medium">متوسط</SelectItem>
                      <SelectItem value="low">پایین</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="مرتب‌سازی" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="priority">بر اساس اولویت</SelectItem>
                      <SelectItem value="date">بر اساس تاریخ</SelectItem>
                      <SelectItem value="status">بر اساس وضعیت</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Tickets List */}
            <div className="space-y-4">
              {filteredTickets.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Ticket className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">هیچ تیکتی یافت نشد</h3>
                    <p className="text-muted-foreground">
                      {technicianTickets.length === 0
                        ? "هیچ تیکتی به شما تخصیص نیافته است"
                        : "تیکتی با فیلترهای انتخابی یافت نشد"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredTickets.map((ticket) => (
                  <Card
                    key={ticket.id}
                    className="hover:shadow-lg transition-all duration-200 border-r-4 border-r-blue-500"
                  >
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 justify-end">
                            <div className="flex items-center gap-2">
                              {getStatusBadge(ticket.status)}
                              {getPriorityBadge(ticket.priority)}
                              <Badge variant="outline" className="gap-1">
                                <FileText className="w-3 h-3" />
                                {getCategoryLabel(ticket.category)}
                              </Badge>
                            </div>
                            <span className="font-bold text-lg">{ticket.id}</span>
                          </div>
                          <h3 className="font-bold text-xl mb-2 text-right">{ticket.title}</h3>
                          <p className="text-muted-foreground text-right mb-4 line-clamp-2">{ticket.description}</p>

                          {/* Client Info */}
                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <h4 className="font-semibold mb-2 text-right flex items-center gap-2">
                              <User className="w-4 h-4" />
                              اطلاعات درخواست‌کننده
                            </h4>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div className="flex items-center gap-2 justify-end">
                                <span>{ticket.clientName}</span>
                                <User className="w-4 h-4 text-muted-foreground" />
                              </div>
                              <div className="flex items-center gap-2 justify-end">
                                <span>{ticket.clientDepartment}</span>
                                <Building className="w-4 h-4 text-muted-foreground" />
                              </div>
                              <div className="flex items-center gap-2 justify-end">
                                <span>{ticket.clientEmail}</span>
                                <Mail className="w-4 h-4 text-muted-foreground" />
                              </div>
                              <div className="flex items-center gap-2 justify-end">
                                <span>{ticket.clientPhone}</span>
                                <Phone className="w-4 h-4 text-muted-foreground" />
                              </div>
                            </div>
                          </div>

                          {/* Time Tracking */}
                          <div className="flex items-center gap-4 mb-4 justify-end">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">زمان صرف شده:</span>
                              <span className="font-mono text-sm">
                                {activeTimer === ticket.id
                                  ? formatTime(timeSpent[ticket.id] || 0)
                                  : ticket.actualTime || "00:00:00"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">تاریخ:</span>
                              <span className="text-sm">{formatDate(ticket.createdAt)}</span>
                            </div>
                          </div>

                          {/* Responses Preview */}
                          {ticket.responses.length > 0 && (
                            <div className="bg-blue-50 rounded-lg p-3 mb-4">
                              <div className="flex items-center gap-2 mb-2 justify-end">
                                <span className="text-sm font-medium">آخرین پاسخ:</span>
                                <MessageSquare className="w-4 h-4 text-blue-600" />
                              </div>
                              <p className="text-sm text-right line-clamp-2">
                                {ticket.responses[ticket.responses.length - 1].text}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 justify-end border-t pt-4">
                        {/* Timer Controls */}
                        {ticket.status !== "resolved" && (
                          <>
                            {activeTimer === ticket.id ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => stopTimer(ticket.id)}
                                className="gap-2"
                              >
                                <PauseCircle className="w-4 h-4" />
                                توقف تایمر
                              </Button>
                            ) : (
                              <Button size="sm" onClick={() => startTimer(ticket.id)} className="gap-2">
                                <PlayCircle className="w-4 h-4" />
                                شروع کار
                              </Button>
                            )}
                          </>
                        )}

                        {/* Status Change */}
                        <Select value={ticket.status} onValueChange={(value) => handleStatusChange(ticket.id, value)}>
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">باز</SelectItem>
                            <SelectItem value="in-progress">در حال انجام</SelectItem>
                            <SelectItem value="resolved">حل شده</SelectItem>
                          </SelectContent>
                        </Select>

                        {/* Response Dialog */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                              <MessageSquare className="w-4 h-4" />
                              پاسخ ({ticket.responses.length})
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" dir="rtl">
                            <DialogHeader>
                              <DialogTitle className="text-right flex items-center gap-2">
                                <MessageSquare className="w-5 h-5" />
                                مکالمه تیکت {ticket.id}
                              </DialogTitle>
                              <DialogDescription className="text-right">{ticket.title}</DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                              {/* Original Ticket */}
                              <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2 justify-end">
                                  <span className="font-semibold">{ticket.clientName}</span>
                                  <span className="text-sm text-muted-foreground">{formatDate(ticket.createdAt)}</span>
                                </div>
                                <p className="text-right">{ticket.description}</p>
                              </div>

                              {/* Responses */}
                              <div className="space-y-3 max-h-60 overflow-y-auto">
                                {ticket.responses.map((response: any) => (
                                  <div
                                    key={response.id}
                                    className={`rounded-lg p-4 ${
                                      response.type === "technician"
                                        ? "bg-blue-50 border-r-4 border-r-blue-500"
                                        : "bg-green-50 border-r-4 border-r-green-500"
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 mb-2 justify-end">
                                      <span className="font-semibold">{response.author}</span>
                                      <span className="text-sm text-muted-foreground">
                                        {formatDate(response.timestamp)}
                                      </span>
                                    </div>
                                    <p className="text-right">{response.text}</p>
                                  </div>
                                ))}
                              </div>

                              {/* New Response */}
                              <div className="border-t pt-4">
                                <Textarea
                                  placeholder="پاسخ خود را اینجا بنویسید..."
                                  value={responseText}
                                  onChange={(e) => setResponseText(e.target.value)}
                                  className="text-right mb-3"
                                  dir="rtl"
                                  rows={4}
                                />
                                <div className="flex gap-2 justify-end">
                                  <Button
                                    onClick={() => {
                                      setSelectedTicket(ticket)
                                      handleAddResponse()
                                    }}
                                    disabled={!responseText.trim()}
                                    className="gap-2"
                                  >
                                    <Send className="w-4 h-4" />
                                    ارسال پاسخ
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        {/* View Details */}
                        <Button size="sm" variant="ghost" className="gap-2">
                          <Eye className="w-4 h-4" />
                          جزئیات
                        </Button>

                        {/* More Actions */}
                        <Button size="sm" variant="ghost" className="gap-2">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-right flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  تیکت‌های فعال
                </CardTitle>
                <CardDescription className="text-right">تیکت‌هایی که در حال حاضر روی آن‌ها کار می‌کنید</CardDescription>
              </CardHeader>
              <CardContent>
                {activeTimer ? (
                  <div className="text-center py-8">
                    <Timer className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                    <h3 className="text-lg font-semibold mb-2">در حال کار روی تیکت</h3>
                    <p className="text-muted-foreground mb-4">
                      {filteredTickets.find((t) => t.id === activeTimer)?.title}
                    </p>
                    <div className="text-3xl font-mono font-bold text-blue-600 mb-4">
                      {formatTime(timeSpent[activeTimer] || 0)}
                    </div>
                    <Button onClick={() => stopTimer(activeTimer)} variant="outline">
                      توقف تایمر
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">هیچ تیکت فعالی ندارید</h3>
                    <p className="text-muted-foreground">برای شروع کار روی یک تیکت، تایمر آن را فعال کنید</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-right">عملکرد هفتگی</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">تیکت‌های حل شده</span>
                      <span className="font-semibold">{stats.resolved}</span>
                    </div>
                    <Progress value={(stats.resolved / stats.total) * 100} className="h-2" />

                    <div className="flex justify-between items-center">
                      <span className="text-sm">نرخ پاسخ‌دهی</span>
                      <span className="font-semibold">95%</span>
                    </div>
                    <Progress value={95} className="h-2" />

                    <div className="flex justify-between items-center">
                      <span className="text-sm">رضایت مشتری</span>
                      <span className="font-semibold">4.8/5</span>
                    </div>
                    <Progress value={96} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-right">دستاوردها</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 justify-end">
                      <div className="text-right">
                        <p className="font-semibold">حل‌کننده سریع</p>
                        <p className="text-sm text-muted-foreground">10 تیکت در یک روز</p>
                      </div>
                      <Award className="w-8 h-8 text-yellow-500" />
                    </div>
                    <Separator />
                    <div className="flex items-center gap-3 justify-end">
                      <div className="text-right">
                        <p className="font-semibold">متخصص شبکه</p>
                        <p className="text-sm text-muted-foreground">50 تیکت شبکه حل شده</p>
                      </div>
                      <Star className="w-8 h-8 text-blue-500" />
                    </div>
                    <Separator />
                    <div className="flex items-center gap-3 justify-end">
                      <div className="text-right">
                        <p className="font-semibold">پاسخ‌دهی عالی</p>
                        <p className="text-sm text-muted-foreground">زمان پاسخ زیر 30 دقیقه</p>
                      </div>
                      <Zap className="w-8 h-8 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="knowledge" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-right flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  دانش‌نامه فنی
                </CardTitle>
                <CardDescription className="text-right">راهنماها و مستندات فنی برای حل مسائل رایج</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 text-right">مشکلات شبکه</h3>
                      <p className="text-sm text-muted-foreground text-right">
                        راهنمای حل مشکلات رایج شبکه و اتصال اینترنت
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 text-right">مسائل ایمیل</h3>
                      <p className="text-sm text-muted-foreground text-right">
                        تنظیمات و عیب‌یابی سیستم‌های ایمیل سازمانی
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 text-right">نصب نرم‌افزار</h3>
                      <p className="text-sm text-muted-foreground text-right">مراحل نصب و پیکربندی نرم‌افزارهای مختلف</p>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 text-right">امنیت سیستم</h3>
                      <p className="text-sm text-muted-foreground text-right">
                        بهترین روش‌های امنیتی و محافظت از سیستم‌ها
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
