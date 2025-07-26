"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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
import { SimpleTicketForm } from "@/components/simple-ticket-form"
import { SettingsDialog } from "@/components/settings-dialog"
import { toast } from "@/hooks/use-toast"
import {
  Plus,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Send,
  Search,
  Filter,
  RefreshCw,
  User,
  Calendar,
  FileText,
  Settings,
  LogOut,
  Flag,
  Ticket,
  Activity,
  ChevronDown,
} from "lucide-react"

interface ClientDashboardProps {
  onLogout: () => void
}

export function ClientDashboard({ onLogout }: ClientDashboardProps) {
  const { user } = useAuth()
  const { getTicketsByUser, addResponse } = useTickets()
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [responseText, setResponseText] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [showTicketForm, setShowTicketForm] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [activeTab, setActiveTab] = useState("tickets")

  // Get user's tickets
  const userTickets = getTicketsByUser(user?.email || "")

  const handleAddResponse = () => {
    if (!selectedTicket || !responseText.trim()) return

    addResponse(selectedTicket.id, {
      text: responseText,
      author: user?.name || "کاربر",
      type: "client",
    })

    setResponseText("")
    toast({
      title: "پیام ارسال شد",
      description: "پیام شما با موفقیت ثبت گردید",
    })
  }

  const handleRefresh = () => {
    toast({
      title: "به‌روزرسانی انجام شد",
      description: "اطلاعات با موفقیت به‌روزرسانی شد",
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
            در حال بررسی
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
  const filteredTickets = userTickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Statistics
  const stats = {
    total: userTickets.length,
    open: userTickets.filter((t) => t.status === "open").length,
    inProgress: userTickets.filter((t) => t.status === "in-progress").length,
    resolved: userTickets.filter((t) => t.status === "resolved").length,
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-iran" dir="rtl">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-right font-iran">پنل کاربری</h1>
                  <p className="text-sm text-muted-foreground text-right font-iran">خوش آمدید</p>
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
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-iran">
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

                  <DropdownMenuItem className="text-right font-iran cursor-pointer">
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
              <Ticket className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-right font-iran">{stats.total}</div>
              <p className="text-xs opacity-80 text-right font-iran">تیکت‌های ثبت شده</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-right font-iran">باز</CardTitle>
              <AlertTriangle className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-right font-iran">{stats.open}</div>
              <p className="text-xs opacity-80 text-right font-iran">در انتظار بررسی</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-right font-iran">در حال بررسی</CardTitle>
              <Activity className="h-5 w-5" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-right font-iran">{stats.inProgress}</div>
              <p className="text-xs opacity-80 text-right font-iran">در دست اقدام</p>
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
              <Ticket className="w-4 h-4" />
              تیکت‌های من
            </TabsTrigger>
            <TabsTrigger value="new-ticket" className="gap-2 font-iran">
              <Plus className="w-4 h-4" />
              تیکت جدید
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tickets" className="space-y-4">
            {/* Filters */}
            <Card dir="rtl">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-right flex items-center gap-2 font-iran">
                    <Filter className="w-5 h-5" />
                    فیلتر و جستجو
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  <select
                    className="px-3 py-2 border rounded-md text-right font-iran"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    dir="rtl"
                  >
                    <option value="all">همه وضعیت‌ها</option>
                    <option value="open">باز</option>
                    <option value="in-progress">در حال بررسی</option>
                    <option value="resolved">حل شده</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Tickets List */}
            <div className="space-y-4">
              {filteredTickets.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Ticket className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                    <h3 className="text-lg font-semibold mb-2 font-iran">هیچ تیکتی یافت نشد</h3>
                    <p className="text-muted-foreground mb-4 font-iran">
                      {searchTerm || statusFilter !== "all"
                        ? "نتیجه‌ای برای جستجوی شما یافت نشد"
                        : "شما هنوز هیچ تیکتی ثبت نکرده‌اید"}
                    </p>
                    <Button onClick={() => setActiveTab("new-ticket")} className="gap-2 font-iran">
                      <Plus className="w-4 h-4" />
                      ایجاد تیکت جدید
                    </Button>
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

                          <div className="flex items-center gap-4 text-sm text-muted-foreground justify-end">
                            <div className="flex items-center gap-1">
                              <span className="font-iran">{formatDate(ticket.createdAt)}</span>
                              <Calendar className="w-4 h-4" />
                            </div>
                            {ticket.assignedTechnicianName && (
                              <div className="flex items-center gap-1">
                                <span className="font-iran">{ticket.assignedTechnicianName}</span>
                                <User className="w-4 h-4" />
                              </div>
                            )}
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
                                پیام‌ها - تیکت {ticket.id}
                              </DialogTitle>
                              <DialogDescription className="text-right font-iran">{ticket.title}</DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                              {/* Original Request */}
                              <div className="bg-blue-50 rounded-lg p-4 border-r-4 border-r-blue-500">
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
                                <div className="border-t pt-4">
                                  <Textarea
                                    placeholder="پیام خود را بنویسید..."
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
                                      ارسال پیام
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

          <TabsContent value="new-ticket">
            <SimpleTicketForm onCancel={() => setActiveTab("tickets")} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Settings Dialog */}
      <SettingsDialog open={showSettings} onOpenChange={setShowSettings} />
    </div>
  )
}
