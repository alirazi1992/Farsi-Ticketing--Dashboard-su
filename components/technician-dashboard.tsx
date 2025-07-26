"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import { useTickets } from "@/lib/ticket-context"
import { SettingsDialog } from "@/components/settings-dialog"
import { toast } from "@/hooks/use-toast"
import {
  Clock,
  Play,
  Pause,
  Square,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Send,
  User,
  Calendar,
  FileText,
  Settings,
  LogOut,
  ChevronDown,
  Timer,
  Activity,
  Wrench,
  Flag,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Phone,
  Mail,
  Building,
} from "lucide-react"

interface TechnicianDashboardProps {
  onLogout: () => void
}

interface WorkTimer {
  ticketId: string
  startTime: number
  totalTime: number
  isRunning: boolean
}

export function TechnicianDashboard({ onLogout }: TechnicianDashboardProps) {
  const { user } = useAuth()
  const { getTicketsByTechnician, updateTicket, addResponse, resolveTicket } = useTickets()
  const [workTimers, setWorkTimers] = useState<Record<string, WorkTimer>>({})
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [responseText, setResponseText] = useState("")
  const [resolutionText, setResolutionText] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [showSettings, setShowSettings] = useState(false)
  const [activeTab, setActiveTab] = useState("tickets")

  // Get technician's assigned tickets
  const assignedTickets = getTicketsByTechnician(user?.id || "")

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setWorkTimers((prev) => {
        const updated = { ...prev }
        Object.keys(updated).forEach((ticketId) => {
          if (updated[ticketId].isRunning) {
            const elapsed = Date.now() - updated[ticketId].startTime
            updated[ticketId].totalTime = updated[ticketId].totalTime + elapsed
            updated[ticketId].startTime = Date.now()
          }
        })
        return updated
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const startTimer = (ticketId: string) => {
    setWorkTimers((prev) => ({
      ...prev,
      [ticketId]: {
        ticketId,
        startTime: Date.now(),
        totalTime: prev[ticketId]?.totalTime || 0,
        isRunning: true,
      },
    }))

    updateTicket(ticketId, { status: "in-progress" })

    toast({
      title: "تایمر شروع شد",
      description: "زمان کار روی این تیکت شروع به ثبت شد",
    })
  }

  const pauseTimer = (ticketId: string) => {
    setWorkTimers((prev) => {
      if (!prev[ticketId]) return prev

      const elapsed = Date.now() - prev[ticketId].startTime
      return {
        ...prev,
        [ticketId]: {
          ...prev[ticketId],
          totalTime: prev[ticketId].totalTime + elapsed,
          isRunning: false,
        },
      }
    })

    toast({
      title: "تایمر متوقف شد",
      description: "زمان کار ثبت و ذخیره شد",
    })
  }

  const resetTimer = (ticketId: string) => {
    setWorkTimers((prev) => ({
      ...prev,
      [ticketId]: {
        ticketId,
        startTime: Date.now(),
        totalTime: 0,
        isRunning: false,
      },
    }))

    toast({
      title: "تایمر بازنشانی شد",
      description: "زمان کار به صفر بازگشت",
    })
  }

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
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
      description: "پاسخ شما برای کاربر ارسال شد",
    })
  }

  const handleResolveTicket = () => {
    if (!selectedTicket || !resolutionText.trim()) return

    resolveTicket(selectedTicket.id, resolutionText)
    setResolutionText("")

    // Stop timer if running
    if (workTimers[selectedTicket.id]?.isRunning) {
      pauseTimer(selectedTicket.id)
    }

    toast({
      title: "تیکت حل شد",
      description: "تیکت با موفقیت حل شد و به کاربر اطلاع داده شد",
    })
  }

  const handleRefresh = () => {
    toast({
      title: "به‌روزرسانی انجام شد",
      description: "لیست تیکت‌ها به‌روزرسانی شد",
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Filter tickets
  const filteredTickets = assignedTickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter
    return matchesSearch && matchesStatus && matchesPriority
  })

  // Statistics
  const stats = {
    total: assignedTickets.length,
    open: assignedTickets.filter((t) => t.status === "open").length,
    inProgress: assignedTickets.filter((t) => t.status === "in-progress").length,
    resolved: assignedTickets.filter((t) => t.status === "resolved").length,
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 font-iran" dir="rtl">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Wrench className="w-8 h-8 text-green-600" />
                <div>
                  <h1 className="text-xl font-bold text-right font-iran">پنل تکنسین</h1>
                  <p className="text-sm text-muted-foreground text-right font-iran">مدیریت تیکت‌ها</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2 bg-transparent font-iran">
                <RefreshCw className="w-4 h-4" />
                به‌روزرسانی
              </Button>

              {/* User Profile Dropdown */}
              <DropdownMenu dir="rtl">
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 h-auto p-2 font-iran">
                    <ChevronDown className="h-4 w-4" />
                    <div className="text-right">
                      <div className="text-sm font-medium font-iran">{user?.name}</div>
                      <div className="text-xs text-muted-foreground font-iran">تکنسین</div>
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                      <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-600 text-white text-xs font-iran">
                        {getUserInitials(user?.name || "")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 font-iran" align="end" dir="rtl">
                  <DropdownMenuLabel className="text-right font-iran">حساب کاربری</DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    <div className="font-medium text-foreground font-iran">{user?.name}</div>
                    <div className="text-xs font-iran">{user?.email}</div>
                    {user?.department && <div className="text-xs font-iran">{user?.department}</div>}
                  </div>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="text-right font-iran cursor-pointer"
                    onClick={() => setActiveTab("profile")}
                  >
                    <User className="ml-2 h-4 w-4" />
                    پروفایل
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="text-right font-iran cursor-pointer"
                    onClick={() => setShowSettings(true)}
                  >
                    <Settings className="ml-2 h-4 w-4" />
                    تنظیمات
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    className="text-right font-iran cursor-pointer text-red-600 focus:text-red-600"
                    onClick={onLogout}
                  >
                    <LogOut className="ml-2 h-4 w-4" />
                    خروج از سیستم
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-right font-iran">کل تیکت‌ها</CardTitle>
              <FileText className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-right font-iran">{stats.total}</div>
              <p className="text-xs opacity-80 text-right font-iran">تیکت‌های اختصاص یافته</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-right font-iran">باز</CardTitle>
              <AlertTriangle className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-right font-iran">{stats.open}</div>
              <p className="text-xs opacity-80 text-right font-iran">نیاز به شروع کار</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-right font-iran">در حال انجام</CardTitle>
              <Activity className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-right font-iran">{stats.inProgress}</div>
              <p className="text-xs opacity-80 text-right font-iran">در دست کار</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-right font-iran">حل شده</CardTitle>
              <CheckCircle className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-right font-iran">{stats.resolved}</div>
              <p className="text-xs opacity-80 text-right font-iran">تکمیل شده</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4" dir="rtl">
          <TabsList className="grid w-full grid-cols-2 bg-white" dir="rtl">
            <TabsTrigger value="tickets" className="gap-2 font-iran">
              <FileText className="w-4 h-4" />
              تیکت‌های من
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2 font-iran">
              <User className="w-4 h-4" />
              پروفایل
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tickets" className="space-y-4">
            {/* Filters */}
            <Card dir="rtl">
              <CardHeader>
                <CardTitle className="text-right flex items-center gap-2 font-iran">
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
                      className="pr-10 text-right font-iran"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      dir="rtl"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter} dir="rtl">
                    <SelectTrigger className="text-right font-iran" dir="rtl">
                      <SelectValue placeholder="وضعیت" />
                    </SelectTrigger>
                    <SelectContent dir="rtl" className="font-iran">
                      <SelectItem value="all" className="text-right font-iran">
                        همه وضعیت‌ها
                      </SelectItem>
                      <SelectItem value="open" className="text-right font-iran">
                        باز
                      </SelectItem>
                      <SelectItem value="in-progress" className="text-right font-iran">
                        در حال انجام
                      </SelectItem>
                      <SelectItem value="resolved" className="text-right font-iran">
                        حل شده
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={priorityFilter} onValueChange={setPriorityFilter} dir="rtl">
                    <SelectTrigger className="text-right font-iran" dir="rtl">
                      <SelectValue placeholder="اولویت" />
                    </SelectTrigger>
                    <SelectContent dir="rtl" className="font-iran">
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
                </div>
              </CardContent>
            </Card>

            {/* Tickets List */}
            <div className="space-y-4">
              {filteredTickets.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2 font-iran">هیچ تیکتی یافت نشد</h3>
                    <p className="text-muted-foreground font-iran">
                      {searchTerm || statusFilter !== "all" || priorityFilter !== "all"
                        ? "نتیجه‌ای برای فیلترهای انتخابی یافت نشد"
                        : "هیچ تیکتی به شما اختصاص داده نشده است"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredTickets.map((ticket) => (
                  <Card key={ticket.id} className="hover:shadow-lg transition-shadow" dir="rtl">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3 justify-end">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="gap-1 font-iran">
                                <FileText className="w-3 h-3" />
                                {ticket.category}
                              </Badge>
                              {ticket.subcategory && (
                                <Badge variant="outline" className="gap-1 font-iran">
                                  {ticket.subcategory}
                                </Badge>
                              )}
                              {getPriorityBadge(ticket.priority)}
                              {getStatusBadge(ticket.status)}
                            </div>
                            <span className="font-bold text-lg font-iran">{ticket.id}</span>
                          </div>

                          <h3 className="font-bold text-xl mb-2 text-right font-iran">{ticket.title}</h3>
                          <p className="text-muted-foreground text-right mb-4 font-iran">{ticket.description}</p>

                          <div className="flex items-center gap-4 text-sm text-muted-foreground justify-end mb-4">
                            <div className="flex items-center gap-1">
                              <span className="font-iran">{formatDate(ticket.createdAt)}</span>
                              <Calendar className="w-4 h-4" />
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="font-iran">{ticket.clientName}</span>
                              <User className="w-4 h-4" />
                            </div>
                          </div>

                          {/* Work Timer */}
                          <div className="bg-gray-50 rounded-lg p-3 mb-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => resetTimer(ticket.id)}
                                  className="gap-1 bg-transparent font-iran"
                                >
                                  <Square className="w-3 h-3" />
                                  ریست
                                </Button>
                                <Button
                                  size="sm"
                                  variant={workTimers[ticket.id]?.isRunning ? "destructive" : "default"}
                                  onClick={() =>
                                    workTimers[ticket.id]?.isRunning ? pauseTimer(ticket.id) : startTimer(ticket.id)
                                  }
                                  className="gap-1 font-iran"
                                >
                                  {workTimers[ticket.id]?.isRunning ? (
                                    <>
                                      <Pause className="w-3 h-3" />
                                      توقف
                                    </>
                                  ) : (
                                    <>
                                      <Play className="w-3 h-3" />
                                      شروع
                                    </>
                                  )}
                                </Button>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-mono font-bold">
                                  {formatTime(
                                    workTimers[ticket.id]?.isRunning
                                      ? workTimers[ticket.id].totalTime + (Date.now() - workTimers[ticket.id].startTime)
                                      : workTimers[ticket.id]?.totalTime || 0,
                                  )}
                                </span>
                                <Timer className="w-4 h-4 text-blue-600" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 justify-end">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="gap-2 bg-transparent font-iran">
                              <MessageSquare className="w-4 h-4" />
                              پیام‌ها ({ticket.responses.length})
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto font-iran" dir="rtl">
                            <DialogHeader>
                              <DialogTitle className="text-right flex items-center gap-2 font-iran">
                                <MessageSquare className="w-5 h-5" />
                                مکالمه - تیکت {ticket.id}
                              </DialogTitle>
                              <DialogDescription className="text-right font-iran">{ticket.title}</DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                              {/* Client Info */}
                              <div className="bg-blue-50 rounded-lg p-4 border-r-4 border-r-blue-500">
                                <h4 className="font-semibold mb-2 text-right font-iran">اطلاعات کاربر:</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div className="text-right font-iran">
                                    <span className="font-medium">نام:</span> {ticket.clientName}
                                  </div>
                                  <div className="text-right font-iran">
                                    <span className="font-medium">ایمیل:</span> {ticket.clientEmail}
                                  </div>
                                  <div className="text-right font-iran">
                                    <span className="font-medium">تلفن:</span> {ticket.clientPhone}
                                  </div>
                                  <div className="text-right font-iran">
                                    <span className="font-medium">بخش:</span> {ticket.clientDepartment}
                                  </div>
                                </div>
                              </div>

                              {/* Original Request */}
                              <div className="bg-gray-50 rounded-lg p-4 border-r-4 border-r-gray-400">
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
                                      response.type === "client"
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
                              {ticket.status !== "resolved" && (
                                <div className="border-t pt-4 space-y-4">
                                  <div>
                                    <label className="block text-sm font-medium mb-2 text-right font-iran">
                                      پاسخ به کاربر:
                                    </label>
                                    <Textarea
                                      placeholder="پاسخ خود را بنویسید..."
                                      value={responseText}
                                      onChange={(e) => setResponseText(e.target.value)}
                                      className="text-right font-iran"
                                      dir="rtl"
                                      rows={3}
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-sm font-medium mb-2 text-right font-iran">
                                      راه‌حل نهایی (در صورت حل مشکل):
                                    </label>
                                    <Textarea
                                      placeholder="راه‌حل نهایی را شرح دهید..."
                                      value={resolutionText}
                                      onChange={(e) => setResolutionText(e.target.value)}
                                      className="text-right font-iran"
                                      dir="rtl"
                                      rows={3}
                                    />
                                  </div>

                                  <div className="flex gap-2 justify-end">
                                    <Button
                                      onClick={() => {
                                        setSelectedTicket(ticket)
                                        handleAddResponse()
                                      }}
                                      disabled={!responseText.trim()}
                                      variant="outline"
                                      className="gap-2 bg-transparent font-iran"
                                    >
                                      <Send className="w-4 h-4" />
                                      ارسال پاسخ
                                    </Button>

                                    <Button
                                      onClick={() => {
                                        setSelectedTicket(ticket)
                                        handleResolveTicket()
                                      }}
                                      disabled={!resolutionText.trim()}
                                      className="gap-2 bg-green-600 hover:bg-green-700 font-iran"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                      حل تیکت
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {/* Resolution Display */}
                              {ticket.status === "resolved" && ticket.resolution && (
                                <div className="bg-green-50 rounded-lg p-4 border-r-4 border-r-green-500">
                                  <h4 className="font-semibold mb-2 text-right font-iran">راه‌حل:</h4>
                                  <p className="text-right font-iran">{ticket.resolution}</p>
                                </div>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Button size="sm" variant="ghost" className="gap-2 font-iran">
                          <Eye className="w-4 h-4" />
                          جزئیات
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4" dir="rtl">
            <Card dir="rtl">
              <CardHeader>
                <CardTitle className="text-right flex items-center gap-2 font-iran">
                  <User className="w-5 h-5" />
                  اطلاعات تکنسین
                </CardTitle>
              </CardHeader>
              <CardContent dir="rtl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 justify-end">
                      <div className="text-right">
                        <p className="font-semibold font-iran">{user?.name}</p>
                        <p className="text-sm text-muted-foreground font-iran">نام کامل</p>
                      </div>
                      <User className="w-8 h-8 text-green-600" />
                    </div>

                    <div className="flex items-center gap-3 justify-end">
                      <div className="text-right">
                        <p className="font-semibold font-iran">{user?.email}</p>
                        <p className="text-sm text-muted-foreground font-iran">ایمیل</p>
                      </div>
                      <Mail className="w-8 h-8 text-green-600" />
                    </div>

                    <div className="flex items-center gap-3 justify-end">
                      <div className="text-right">
                        <p className="font-semibold font-iran">{user?.phone}</p>
                        <p className="text-sm text-muted-foreground font-iran">تلفن</p>
                      </div>
                      <Phone className="w-8 h-8 text-green-600" />
                    </div>

                    <div className="flex items-center gap-3 justify-end">
                      <div className="text-right">
                        <p className="font-semibold font-iran">{user?.department}</p>
                        <p className="text-sm text-muted-foreground font-iran">بخش</p>
                      </div>
                      <Building className="w-8 h-8 text-green-600" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-right font-iran">آمار کاری</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-iran">{stats.total}</span>
                        <span className="text-muted-foreground font-iran">کل تیکت‌ها</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-iran">{stats.resolved}</span>
                        <span className="text-muted-foreground font-iran">حل شده</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-iran">{stats.inProgress}</span>
                        <span className="text-muted-foreground font-iran">در حال انجام</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-iran">{stats.open}</span>
                        <span className="text-muted-foreground font-iran">باز</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Settings Dialog */}
      <SettingsDialog open={showSettings} onOpenChange={setShowSettings} />
    </div>
  )
}
