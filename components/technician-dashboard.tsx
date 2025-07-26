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
  Search,
  RefreshCw,
  PlayCircle,
  PauseCircle,
  Timer,
  User,
  Phone,
  Mail,
  Building,
  FileText,
  Settings,
  Activity,
  Filter,
  Flag,
  BookOpen,
  Wrench,
  Target,
  Briefcase,
  CheckSquare,
  Save,
  ArrowRight,
  LogOut,
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
  const [resolutionText, setResolutionText] = useState("")
  const [showResolutionDialog, setShowResolutionDialog] = useState(false)
  const [ticketToResolve, setTicketToResolve] = useState<any>(null)

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
    if (newStatus === "resolved") {
      const ticket = technicianTickets.find((t) => t.id === ticketId)
      setTicketToResolve(ticket)
      setShowResolutionDialog(true)
      return
    }

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

  const handleResolveTicket = () => {
    if (!ticketToResolve || !resolutionText.trim()) return

    updateTicket(ticketToResolve.id, {
      status: "resolved",
      resolution: resolutionText,
    })

    if (activeTimer === ticketToResolve.id) {
      setActiveTimer(null)
    }

    setShowResolutionDialog(false)
    setResolutionText("")
    setTicketToResolve(null)

    toast({
      title: "تیکت حل شد",
      description: "تیکت با موفقیت حل و بسته شد",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="destructive" className="gap-1 font-iran">
            <AlertTriangle className="w-3 h-3" />
            باز
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="default" className="gap-1 font-iran">
            <Clock className="w-3 h-3" />
            در حال انجام
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="outline" className="gap-1 bg-green-50 text-green-700 border-green-200 font-iran">
            <CheckCircle className="w-3 h-3" />
            حل شده
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="font-iran">
            {status}
          </Badge>
        )
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
          <Badge variant="destructive" className="gap-1 font-iran">
            <Flag className="w-3 h-3" />
            فوری
          </Badge>
        )
      case "high":
        return (
          <Badge className="bg-orange-500 hover:bg-orange-600 gap-1 font-iran">
            <Flag className="w-3 h-3" />
            بالا
          </Badge>
        )
      case "medium":
        return (
          <Badge variant="secondary" className="gap-1 font-iran">
            <Flag className="w-3 h-3" />
            متوسط
          </Badge>
        )
      case "low":
        return (
          <Badge variant="outline" className="gap-1 font-iran">
            <Flag className="w-3 h-3" />
            پایین
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="font-iran">
            {priority}
          </Badge>
        )
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-iran" dir="rtl">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Wrench className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-right font-iran">پنل تکنسین</h1>
                  <p className="text-sm text-muted-foreground text-right font-iran">خوش آمدید، {user?.name}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="gap-2 bg-transparent font-iran">
                <RefreshCw className="w-4 h-4" />
                به‌روزرسانی
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent font-iran">
                <Settings className="w-4 h-4" />
                تنظیمات
              </Button>
              <Button variant="outline" size="sm" onClick={onLogout} className="gap-2 bg-transparent font-iran">
                <LogOut className="w-4 h-4" />
                خروج
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 space-y-6">
        {/* Performance Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-right font-iran">تیکت‌های من</CardTitle>
              <Briefcase className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-right font-iran">{stats.total}</div>
              <p className="text-xs opacity-80 text-right font-iran">کل تیکت‌های واگذار شده</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-right font-iran">فوری</CardTitle>
              <AlertTriangle className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-right font-iran">{stats.urgent}</div>
              <p className="text-xs opacity-80 text-right font-iran">نیاز به اقدام فوری</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-right font-iran">در حال کار</CardTitle>
              <Activity className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-right font-iran">{stats.inProgress}</div>
              <p className="text-xs opacity-80 text-right font-iran">تیکت‌های در دست اقدام</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-right font-iran">حل شده</CardTitle>
              <CheckCircle className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-right font-iran">{stats.resolved}</div>
              <p className="text-xs opacity-80 text-right font-iran">تیکت‌های تکمیل شده</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-right font-iran">نرخ موفقیت</CardTitle>
              <Target className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-right font-iran">{stats.resolutionRate}%</div>
              <p className="text-xs opacity-80 text-right font-iran">درصد حل مسائل</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Timer Display */}
        {activeTimer && (
          <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Timer className="w-8 h-8" />
                  <div>
                    <h3 className="text-lg font-semibold text-right font-iran">در حال کار روی تیکت</h3>
                    <p className="text-sm opacity-90 text-right font-iran">
                      {filteredTickets.find((t) => t.id === activeTimer)?.title}
                    </p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-mono font-bold mb-2 font-iran">
                    {formatTime(timeSpent[activeTimer] || 0)}
                  </div>
                  <Button
                    onClick={() => stopTimer(activeTimer)}
                    variant="outline"
                    className="bg-white/20 border-white/30 text-white hover:bg-white/30 font-iran"
                  >
                    <PauseCircle className="w-4 h-4 mr-2" />
                    توقف تایمر
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Technician Interface */}
        <Tabs defaultValue="workqueue" className="space-y-4" dir="rtl">
          <TabsList className="grid w-full grid-cols-4 bg-white" dir="rtl">
            <TabsTrigger value="workqueue" className="gap-2 font-iran">
              <Briefcase className="w-4 h-4" />
              صف کاری
            </TabsTrigger>
            <TabsTrigger value="active" className="gap-2 font-iran">
              <Timer className="w-4 h-4" />
              کار فعال
            </TabsTrigger>
            <TabsTrigger value="completed" className="gap-2 font-iran">
              <CheckSquare className="w-4 h-4" />
              تکمیل شده
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="gap-2 font-iran">
              <BookOpen className="w-4 h-4" />
              دانش‌نامه
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workqueue" className="space-y-4">
            {/* Work Queue Filters */}
            <Card dir="rtl">
              <CardHeader>
                <CardTitle className="text-right flex items-center gap-2 font-iran">
                  <Filter className="w-5 h-5" />
                  مدیریت صف کاری
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="جستجو در تیکت‌ها..."
                      className="pr-10 text-right font-iran"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      dir="rtl"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter} dir="rtl">
                    <SelectTrigger className="text-right font-iran">
                      <SelectValue placeholder="وضعیت" />
                    </SelectTrigger>
                    <SelectContent dir="rtl">
                      <SelectItem value="all" className="text-right font-iran">
                        همه وضعیت‌ها
                      </SelectItem>
                      <SelectItem value="open" className="text-right font-iran">
                        باز
                      </SelectItem>
                      <SelectItem value="in-progress" className="text-right font-iran">
                        در حال انجام
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter} dir="rtl">
                    <SelectTrigger className="text-right font-iran">
                      <SelectValue placeholder="اولویت" />
                    </SelectTrigger>
                    <SelectContent dir="rtl">
                      <SelectItem value="all" className="text-right font-iran">
                        همه اولویت‌ها
                      </SelectItem>
                      <SelectItem value="urgent" className="text-right font-iran">
                        فوری
                      </SelectItem>
                      <SelectItem value="high" className="text-right font-iran">
                        بالا
                      </SelectItem>
                      <SelectItem value="medium" className="text-right font-iran">
                        متوسط
                      </SelectItem>
                      <SelectItem value="low" className="text-right font-iran">
                        پایین
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortBy} onValueChange={setSortBy} dir="rtl">
                    <SelectTrigger className="text-right font-iran">
                      <SelectValue placeholder="مرتب‌سازی" />
                    </SelectTrigger>
                    <SelectContent dir="rtl">
                      <SelectItem value="priority" className="text-right font-iran">
                        بر اساس اولویت
                      </SelectItem>
                      <SelectItem value="date" className="text-right font-iran">
                        بر اساس تاریخ
                      </SelectItem>
                      <SelectItem value="status" className="text-right font-iran">
                        بر اساس وضعیت
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Technician Work Queue */}
            <div className="space-y-4">
              {filteredTickets.filter((t) => t.status !== "resolved").length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                    <h3 className="text-lg font-semibold mb-2 font-iran">عالی! همه تیکت‌ها حل شده</h3>
                    <p className="text-muted-foreground font-iran">در حال حاضر هیچ تیکت فعالی برای کار ندارید</p>
                  </CardContent>
                </Card>
              ) : (
                filteredTickets
                  .filter((t) => t.status !== "resolved")
                  .map((ticket) => (
                    <Card
                      key={ticket.id}
                      className={`hover:shadow-lg transition-all duration-200 border-r-4 ${
                        activeTimer === ticket.id
                          ? "border-r-green-500 bg-green-50"
                          : ticket.priority === "urgent"
                            ? "border-r-red-500"
                            : "border-r-blue-500"
                      }`}
                      dir="rtl"
                    >
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3 justify-end">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="gap-1 font-iran">
                                  <FileText className="w-3 h-3" />
                                  {getCategoryLabel(ticket.category)}
                                </Badge>
                                {getPriorityBadge(ticket.priority)}
                                {getStatusBadge(ticket.status)}
                              </div>
                              <span className="font-bold text-lg font-iran">{ticket.id}</span>
                            </div>

                            <h3 className="font-bold text-xl mb-2 text-right font-iran">{ticket.title}</h3>
                            <p className="text-muted-foreground text-right mb-4 font-iran">{ticket.description}</p>

                            {/* Client Information Panel */}
                            <div className="bg-gray-50 rounded-lg p-4 mb-4">
                              <h4 className="font-semibold mb-3 text-right flex items-center gap-2 font-iran">
                                <User className="w-4 h-4" />
                                اطلاعات مشتری
                              </h4>
                              <div className="grid grid-cols-2 gap-3 text-sm">
                                <div className="flex items-center gap-2 justify-end">
                                  <span className="font-medium font-iran">{ticket.clientName}</span>
                                  <User className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div className="flex items-center gap-2 justify-end">
                                  <span className="font-iran">{ticket.clientDepartment}</span>
                                  <Building className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div className="flex items-center gap-2 justify-end">
                                  <span className="font-iran">{ticket.clientEmail}</span>
                                  <Mail className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div className="flex items-center gap-2 justify-end">
                                  <span className="font-iran">{ticket.clientPhone}</span>
                                  <Phone className="w-4 h-4 text-muted-foreground" />
                                </div>
                              </div>
                            </div>

                            {/* Time Tracking Display */}
                            <div className="bg-blue-50 rounded-lg p-3 mb-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Timer className="w-4 h-4 text-blue-600" />
                                  <span className="text-sm font-medium font-iran">زمان کار:</span>
                                </div>
                                <span className="font-mono text-lg font-bold text-blue-800 font-iran">
                                  {activeTimer === ticket.id
                                    ? formatTime(timeSpent[ticket.id] || 0)
                                    : ticket.actualTime || "00:00:00"}
                                </span>
                              </div>
                            </div>

                            {/* Recent Activity */}
                            {ticket.responses.length > 0 && (
                              <div className="bg-yellow-50 rounded-lg p-3 mb-4">
                                <div className="flex items-center gap-2 mb-2 justify-end">
                                  <span className="text-sm font-medium font-iran">آخرین فعالیت:</span>
                                  <MessageSquare className="w-4 h-4 text-yellow-600" />
                                </div>
                                <p className="text-sm text-yellow-800 text-right font-iran">
                                  {ticket.responses[ticket.responses.length - 1].text.substring(0, 100)}...
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Technician Action Panel */}
                        <div className="border-t pt-4">
                          <div className="flex gap-2 justify-end mb-3">
                            {/* Timer Controls */}
                            {activeTimer === ticket.id ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => stopTimer(ticket.id)}
                                className="gap-2 bg-red-50 border-red-200 text-red-700 hover:bg-red-100 font-iran"
                              >
                                <PauseCircle className="w-4 h-4" />
                                توقف کار
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => startTimer(ticket.id)}
                                className="gap-2 bg-green-600 hover:bg-green-700 font-iran"
                              >
                                <PlayCircle className="w-4 h-4" />
                                شروع کار
                              </Button>
                            )}

                            {/* Quick Status Actions */}
                            {ticket.status === "open" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(ticket.id, "in-progress")}
                                className="gap-2 font-iran"
                              >
                                <ArrowRight className="w-4 h-4" />
                                شروع بررسی
                              </Button>
                            )}

                            {ticket.status === "in-progress" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleStatusChange(ticket.id, "resolved")}
                                className="gap-2 bg-green-50 border-green-200 text-green-700 hover:bg-green-100 font-iran"
                              >
                                <CheckCircle className="w-4 h-4" />
                                حل مسئله
                              </Button>
                            )}
                          </div>

                          <div className="flex gap-2 justify-end">
                            {/* Communication */}
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline" className="gap-2 bg-transparent font-iran">
                                  <MessageSquare className="w-4 h-4" />
                                  ارتباط ({ticket.responses.length})
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto font-iran" dir="rtl">
                                <DialogHeader>
                                  <DialogTitle className="text-right flex items-center gap-2 font-iran">
                                    <MessageSquare className="w-5 h-5" />
                                    ارتباط با مشتری - تیکت {ticket.id}
                                  </DialogTitle>
                                  <DialogDescription className="text-right font-iran">{ticket.title}</DialogDescription>
                                </DialogHeader>

                                <div className="space-y-4">
                                  {/* Original Request */}
                                  <div className="bg-gray-100 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2 justify-end">
                                      <span className="font-semibold font-iran">{ticket.clientName}</span>
                                      <span className="text-sm text-muted-foreground font-iran">
                                        {formatDate(ticket.createdAt)}
                                      </span>
                                    </div>
                                    <p className="text-right font-medium font-iran">{ticket.description}</p>
                                  </div>

                                  {/* Conversation History */}
                                  <div className="space-y-3 max-h-60 overflow-y-auto">
                                    {ticket.responses.map((response: any) => (
                                      <div
                                        key={response.id}
                                        className={`rounded-lg p-4 ${
                                          response.type === "technician"
                                            ? "bg-blue-50 border-r-4 border-r-blue-500 mr-8"
                                            : "bg-green-50 border-r-4 border-r-green-500 ml-8"
                                        }`}
                                      >
                                        <div className="flex items-center gap-2 mb-2 justify-end">
                                          <span className="font-semibold font-iran">{response.author}</span>
                                          <span className="text-sm text-muted-foreground font-iran">
                                            {formatDate(response.timestamp)}
                                          </span>
                                        </div>
                                        <p className="text-right font-iran">{response.text}</p>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Response Form */}
                                  <div className="border-t pt-4">
                                    <Textarea
                                      placeholder="پاسخ خود را به مشتری بنویسید..."
                                      value={responseText}
                                      onChange={(e) => setResponseText(e.target.value)}
                                      className="text-right mb-3 font-iran"
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
                                        className="gap-2 font-iran"
                                      >
                                        <Send className="w-4 h-4" />
                                        ارسال پاسخ
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>

                            {/* Ticket Details */}
                            <Button size="sm" variant="ghost" className="gap-2 font-iran">
                              <Eye className="w-4 h-4" />
                              جزئیات کامل
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <Card dir="rtl">
              <CardHeader>
                <CardTitle className="text-right flex items-center gap-2 font-iran">
                  <Timer className="w-5 h-5" />
                  تیکت‌های در حال کار
                </CardTitle>
                <CardDescription className="text-right font-iran">
                  تیکت‌هایی که در حال حاضر روی آن‌ها کار می‌کنید
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeTimer ? (
                  <div className="text-center py-8">
                    <Timer className="w-16 h-16 mx-auto mb-4 text-blue-600" />
                    <h3 className="text-lg font-semibold mb-2 font-iran">در حال کار روی تیکت</h3>
                    <p className="text-muted-foreground mb-4 font-iran">
                      {filteredTickets.find((t) => t.id === activeTimer)?.title}
                    </p>
                    <div className="text-3xl font-mono font-bold text-blue-600 mb-4 font-iran">
                      {formatTime(timeSpent[activeTimer] || 0)}
                    </div>
                    <Button onClick={() => stopTimer(activeTimer)} variant="outline" className="font-iran">
                      توقف تایمر
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2 font-iran">هیچ تیکت فعالی ندارید</h3>
                    <p className="text-muted-foreground font-iran">برای شروع کار روی یک تیکت، تایمر آن را فعال کنید</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <Card dir="rtl">
              <CardHeader>
                <CardTitle className="text-right flex items-center gap-2 font-iran">
                  <CheckSquare className="w-5 h-5" />
                  تیکت‌های تکمیل شده
                </CardTitle>
                <CardDescription className="text-right font-iran">تیکت‌هایی که با موفقیت حل کرده‌اید</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredTickets
                    .filter((t) => t.status === "resolved")
                    .map((ticket) => (
                      <Card key={ticket.id} className="border-r-4 border-r-green-500 bg-green-50" dir="rtl">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2 justify-end">
                                {getStatusBadge(ticket.status)}
                                <span className="font-bold font-iran">{ticket.id}</span>
                              </div>
                              <h3 className="font-semibold mb-1 text-right font-iran">{ticket.title}</h3>
                              <p className="text-sm text-muted-foreground text-right mb-2 font-iran">
                                {ticket.clientName}
                              </p>
                              {ticket.resolution && (
                                <div className="bg-white rounded p-2">
                                  <p className="text-sm text-right font-iran">
                                    <strong>راه‌حل:</strong> {ticket.resolution}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="knowledge" className="space-y-4">
            <Card dir="rtl">
              <CardHeader>
                <CardTitle className="text-right flex items-center gap-2 font-iran">
                  <BookOpen className="w-5 h-5" />
                  دانش‌نامه فنی
                </CardTitle>
                <CardDescription className="text-right font-iran">
                  راهنماها و مستندات فنی برای حل مسائل رایج
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 text-right font-iran">مشکلات شبکه</h3>
                      <p className="text-sm text-muted-foreground text-right font-iran">
                        راهنمای حل مشکلات رایج شبکه و اتصال اینترنت
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 text-right font-iran">مسائل ایمیل</h3>
                      <p className="text-sm text-muted-foreground text-right font-iran">
                        تنظیمات و عیب‌یابی سیستم‌های ایمیل سازمانی
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 text-right font-iran">نصب نرم‌افزار</h3>
                      <p className="text-sm text-muted-foreground text-right font-iran">
                        مراحل نصب و پیکربندی نرم‌افزارهای مختلف
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2 text-right font-iran">امنیت سیستم</h3>
                      <p className="text-sm text-muted-foreground text-right font-iran">
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

      {/* Resolution Dialog */}
      <Dialog open={showResolutionDialog} onOpenChange={setShowResolutionDialog}>
        <DialogContent className="sm:max-w-[600px] font-iran" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right flex items-center gap-2 font-iran">
              <CheckCircle className="w-5 h-5 text-green-600" />
              حل تیکت {ticketToResolve?.id}
            </DialogTitle>
            <DialogDescription className="text-right font-iran">
              لطفاً راه‌حل نهایی و جزئیات حل مسئله را وارد کنید
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-right block mb-2 font-iran">شرح راه‌حل:</label>
              <Textarea
                placeholder="توضیح دهید که چگونه این مسئله حل شد..."
                value={resolutionText}
                onChange={(e) => setResolutionText(e.target.value)}
                className="text-right font-iran"
                dir="rtl"
                rows={4}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowResolutionDialog(false)} className="font-iran">
                انصراف
              </Button>
              <Button onClick={handleResolveTicket} disabled={!resolutionText.trim()} className="gap-2 font-iran">
                <Save className="w-4 h-4" />
                ثبت و حل تیکت
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
