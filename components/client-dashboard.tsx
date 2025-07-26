"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth-context"
import { useTickets } from "@/lib/ticket-context"
import { TwoStepTicketForm } from "./two-step-ticket-form"
import { toast } from "@/hooks/use-toast"
import { Plus, Search, Clock, CheckCircle, AlertCircle, Ticket, Calendar, User, Eye, LogOut } from "lucide-react"

interface ClientDashboardProps {
  onLogout: () => void
}

const priorityColors = {
  low: "bg-green-100 text-green-800 border-green-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  high: "bg-orange-100 text-orange-800 border-orange-200",
  urgent: "bg-red-100 text-red-800 border-red-200",
}

const statusColors = {
  open: "bg-blue-100 text-blue-800 border-blue-200",
  "in-progress": "bg-purple-100 text-purple-800 border-purple-200",
  resolved: "bg-green-100 text-green-800 border-green-200",
  closed: "bg-gray-100 text-gray-800 border-gray-200",
}

const priorityLabels = {
  low: "کم",
  medium: "متوسط",
  high: "بالا",
  urgent: "فوری",
}

const statusLabels = {
  open: "باز",
  "in-progress": "در حال انجام",
  resolved: "حل شده",
  closed: "بسته",
}

const categoryLabels = {
  hardware: "سخت‌افزار",
  software: "نرم‌افزار",
  network: "شبکه",
  email: "ایمیل",
  security: "امنیت",
  access: "دسترسی",
}

export function ClientDashboard({ onLogout }: ClientDashboardProps) {
  const { user } = useAuth()
  const { tickets, getTicketsByUser, addTicket } = useTickets()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)

  // Get user's tickets
  const userTickets = user ? getTicketsByUser(user.email) : []

  // Filter tickets based on search and filters
  const filteredTickets = userTickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  // Calculate statistics
  const stats = {
    total: userTickets.length,
    open: userTickets.filter((t) => t.status === "open").length,
    inProgress: userTickets.filter((t) => t.status === "in-progress").length,
    resolved: userTickets.filter((t) => t.status === "resolved").length,
  }

  const handleCreateTicket = (ticketData: any) => {
    if (!user) return

    const newTicket = {
      title: ticketData.title,
      description: ticketData.description,
      category: ticketData.category,
      priority: ticketData.priority,
      status: "open" as const,
      clientId: user.id,
      clientName: user.name,
      clientEmail: user.email,
      clientPhone: ticketData.clientPhone || user.phone || "",
      clientDepartment: user.department || "",
    }

    addTicket(newTicket)
    setShowCreateForm(false)

    toast({
      title: "تیکت با موفقیت ایجاد شد",
      description: "تیکت شما ثبت شد و به زودی بررسی خواهد شد.",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 font-iran" dir="rtl">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="text-right">
            <h1 className="text-3xl font-bold text-gray-900 font-iran">داشبورد کاربر</h1>
            <p className="text-gray-600 mt-2 font-iran">مدیریت تیکت‌های پشتیبانی شما</p>
          </div>

          <div className="flex items-center gap-3">
            <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-iran"
                >
                  <Plus className="ml-2 h-5 w-5" />
                  ایجاد تیکت جدید
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto font-iran" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="text-right font-iran">ایجاد تیکت جدید</DialogTitle>
                </DialogHeader>
                <TwoStepTicketForm onSubmit={handleCreateTicket} onCancel={() => setShowCreateForm(false)} />
              </DialogContent>
            </Dialog>

            <Button variant="outline" onClick={onLogout} className="gap-2 font-iran bg-transparent">
              <LogOut className="w-4 h-4" />
              خروج
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-blue-100 text-sm font-iran">کل تیکت‌ها</p>
                  <p className="text-3xl font-bold font-iran">{stats.total}</p>
                </div>
                <Ticket className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-orange-100 text-sm font-iran">باز</p>
                  <p className="text-3xl font-bold font-iran">{stats.open}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-purple-100 text-sm font-iran">در حال انجام</p>
                  <p className="text-3xl font-bold font-iran">{stats.inProgress}</p>
                </div>
                <Clock className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-green-100 text-sm font-iran">حل شده</p>
                  <p className="text-3xl font-bold font-iran">{stats.resolved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="جستجو در تیکت‌ها..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 text-right font-iran"
                  dir="rtl"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter} dir="rtl">
                <SelectTrigger className="w-full md:w-48 text-right font-iran" dir="rtl">
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
                  <SelectItem value="closed" className="text-right font-iran">
                    بسته
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter} dir="rtl">
                <SelectTrigger className="w-full md:w-48 text-right font-iran" dir="rtl">
                  <SelectValue placeholder="اولویت" />
                </SelectTrigger>
                <SelectContent dir="rtl" className="font-iran">
                  <SelectItem value="all" className="text-right font-iran">
                    همه اولویت‌ها
                  </SelectItem>
                  <SelectItem value="low" className="text-right font-iran">
                    کم
                  </SelectItem>
                  <SelectItem value="medium" className="text-right font-iran">
                    متوسط
                  </SelectItem>
                  <SelectItem value="high" className="text-right font-iran">
                    بالا
                  </SelectItem>
                  <SelectItem value="urgent" className="text-right font-iran">
                    فوری
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tickets List */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="text-right font-iran">تیکت‌های شما</CardTitle>
            <CardDescription className="text-right font-iran">لیست تمام تیکت‌های ارسال شده توسط شما</CardDescription>
          </CardHeader>
          <CardContent>
            {filteredTickets.length === 0 ? (
              <div className="text-center py-12">
                <Ticket className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2 font-iran">هیچ تیکتی یافت نشد</h3>
                <p className="text-gray-600 font-iran">
                  {userTickets.length === 0
                    ? "شما هنوز هیچ تیکتی ایجاد نکرده‌اید"
                    : "هیچ تیکتی با فیلترهای انتخابی یافت نشد"}
                </p>
                {userTickets.length === 0 && (
                  <Button
                    onClick={() => setShowCreateForm(true)}
                    className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 font-iran"
                  >
                    <Plus className="ml-2 h-4 w-4" />
                    ایجاد اولین تیکت
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <Card key={ticket.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                        <div className="flex-1 text-right">
                          <div className="flex items-center gap-3 mb-2 justify-end">
                            <Badge className={`${priorityColors[ticket.priority]} font-iran`}>
                              {priorityLabels[ticket.priority]}
                            </Badge>
                            <Badge className={`${statusColors[ticket.status]} font-iran`}>
                              {statusLabels[ticket.status]}
                            </Badge>
                            <h3 className="text-lg font-semibold text-gray-900 font-iran">{ticket.title}</h3>
                          </div>

                          <p className="text-gray-600 mb-3 line-clamp-2 font-iran">{ticket.description}</p>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span className="font-iran">
                                {new Date(ticket.createdAt).toLocaleDateString("fa-IR")}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span className="font-iran">{categoryLabels[ticket.category] || ticket.category}</span>
                            </div>

                            {ticket.assignedTechnicianName && (
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                <span className="font-iran">تکنسین: {ticket.assignedTechnicianName}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="font-iran bg-transparent">
                                <Eye className="ml-1 h-4 w-4" />
                                مشاهده
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl font-iran" dir="rtl">
                              <DialogHeader>
                                <DialogTitle className="text-right font-iran">جزئیات تیکت</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-6" dir="rtl">
                                <div>
                                  <h3 className="text-lg font-semibold mb-2 font-iran">{ticket.title}</h3>
                                  <div className="flex gap-2 mb-4">
                                    <Badge className={`${priorityColors[ticket.priority]} font-iran`}>
                                      {priorityLabels[ticket.priority]}
                                    </Badge>
                                    <Badge className={`${statusColors[ticket.status]} font-iran`}>
                                      {statusLabels[ticket.status]}
                                    </Badge>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-semibold mb-2 font-iran">توضیحات:</h4>
                                  <p className="text-gray-700 font-iran">{ticket.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-semibold mb-1 font-iran">دسته‌بندی:</h4>
                                    <p className="text-gray-700 font-iran">
                                      {categoryLabels[ticket.category] || ticket.category}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold mb-1 font-iran">تاریخ ایجاد:</h4>
                                    <p className="text-gray-700 font-iran">
                                      {new Date(ticket.createdAt).toLocaleDateString("fa-IR")}
                                    </p>
                                  </div>
                                </div>

                                {ticket.assignedTechnicianName && (
                                  <div>
                                    <h4 className="font-semibold mb-1 font-iran">تکنسین مسئول:</h4>
                                    <p className="text-gray-700 font-iran">{ticket.assignedTechnicianName}</p>
                                  </div>
                                )}

                                {ticket.resolution && (
                                  <div>
                                    <h4 className="font-semibold mb-1 font-iran">راه‌حل:</h4>
                                    <p className="text-gray-700 font-iran">{ticket.resolution}</p>
                                  </div>
                                )}

                                {ticket.responses && ticket.responses.length > 0 && (
                                  <div>
                                    <h4 className="font-semibold mb-2 font-iran">پاسخ‌ها:</h4>
                                    <div className="space-y-3">
                                      {ticket.responses.map((response) => (
                                        <div key={response.id} className="bg-gray-50 p-3 rounded-lg">
                                          <div className="flex justify-between items-center mb-2">
                                            <span className="text-xs text-gray-500 font-iran">
                                              {new Date(response.timestamp).toLocaleDateString("fa-IR")}
                                            </span>
                                            <span className="font-semibold text-sm font-iran">{response.author}</span>
                                          </div>
                                          <p className="text-gray-700 font-iran">{response.text}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
