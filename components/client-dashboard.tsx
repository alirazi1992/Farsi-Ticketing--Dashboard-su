"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TwoStepTicketForm } from "@/components/two-step-ticket-form"
import { useAuth } from "@/lib/auth-context"
import { useTickets } from "@/lib/ticket-context"
import { toast } from "@/hooks/use-toast"
import {
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Search,
  UserCheck,
  XCircle,
  Ticket,
  Eye,
  User,
  Calendar,
  Star,
} from "lucide-react"

interface ClientDashboardProps {
  onLogout: () => void
}

export function ClientDashboard({ onLogout }: ClientDashboardProps) {
  const { user } = useAuth()
  const { addTicket, getTicketsByUser } = useTickets()
  const [showTicketForm, setShowTicketForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [previewDialog, setPreviewDialog] = useState(false)

  // Get user's tickets
  const userTickets = getTicketsByUser(user?.email || "")

  const handleTicketSubmit = (ticketData: any) => {
    addTicket({
      ...ticketData,
      clientName: user?.name || "کاربر",
      clientEmail: user?.email || "",
      clientPhone: user?.phone || "",
      clientDepartment: user?.department || "نامشخص",
      status: "open",
      assignedTo: null,
      assignedTechnicianName: null,
    })
    setShowTicketForm(false)
    toast({
      title: "تیکت ثبت شد",
      description: "درخواست شما با موفقیت ثبت گردید و به زودی بررسی خواهد شد",
    })
  }

  const handleTicketPreview = (ticket: any) => {
    setSelectedTicket(ticket)
    setPreviewDialog(true)
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

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="destructive">فوری</Badge>
      case "high":
        return <Badge className="bg-orange-500 hover:bg-orange-600">بالا</Badge>
      case "medium":
        return <Badge variant="secondary">متوسط</Badge>
      case "low":
        return <Badge variant="outline">پایین</Badge>
      default:
        return <Badge variant="outline">نامشخص</Badge>
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

  const filteredTickets = userTickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: userTickets.length,
    open: userTickets.filter((t) => t.status === "open").length,
    inProgress: userTickets.filter((t) => t.status === "in-progress").length,
    resolved: userTickets.filter((t) => t.status === "resolved").length,
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-right flex items-center gap-2">
            <User className="w-8 h-8 text-blue-600" />
            پنل کاربری
          </h1>
          <p className="text-muted-foreground text-right">مدیریت درخواست‌های پشتیبانی شما</p>
        </div>
        <Button onClick={() => setShowTicketForm(true)} className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          ثبت تیکت جدید
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">کل تیکت‌ها</CardTitle>
            <Ticket className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">{stats.total}</div>
            <p className="text-xs opacity-80 text-right">تعداد کل درخواست‌ها</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">باز</CardTitle>
            <AlertTriangle className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">{stats.open}</div>
            <p className="text-xs opacity-80 text-right">در انتظار بررسی</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">در حال انجام</CardTitle>
            <Clock className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">{stats.inProgress}</div>
            <p className="text-xs opacity-80 text-right">در حال پردازش</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">حل شده</CardTitle>
            <CheckCircle className="h-5 w-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">{stats.resolved}</div>
            <p className="text-xs opacity-80 text-right">با موفقیت حل شده</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <Search className="w-5 h-5" />
            جستجو و فیلتر
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="جستجو در تیکت‌ها..."
                className="pr-10 text-right"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                dir="rtl"
              />
            </div>
            <select
              className="px-4 py-2 border rounded-md text-right bg-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              dir="rtl"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="open">باز</option>
              <option value="in-progress">در حال انجام</option>
              <option value="resolved">حل شده</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <Ticket className="w-5 h-5" />
            تیکت‌های من
          </CardTitle>
          <CardDescription className="text-right">لیست درخواست‌های پشتیبانی شما</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTickets.length === 0 ? (
              <div className="text-center py-12">
                <Ticket className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">هیچ تیکتی یافت نشد</h3>
                <p className="text-muted-foreground mb-4">
                  {userTickets.length === 0 ? "شما هنوز هیچ تیکتی ثبت نکرده‌اید" : "تیکتی با فیلترهای انتخابی یافت نشد"}
                </p>
                {userTickets.length === 0 && (
                  <Button onClick={() => setShowTicketForm(true)} className="gap-2">
                    <Plus className="w-4 h-4" />
                    ثبت اولین تیکت
                  </Button>
                )}
              </div>
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
                            <Badge variant="outline">{getCategoryLabel(ticket.category)}</Badge>
                          </div>
                          <span className="font-bold text-lg">{ticket.id}</span>
                        </div>
                        <h3 className="font-bold text-xl mb-2 text-right">{ticket.title}</h3>
                        <p className="text-muted-foreground text-right mb-4 line-clamp-2">{ticket.description}</p>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground justify-end mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(ticket.createdAt)}</span>
                          </div>
                          {ticket.responses.length > 0 && (
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              <span>{ticket.responses.length} پاسخ</span>
                            </div>
                          )}
                        </div>

                        {ticket.assignedTechnicianName && (
                          <div className="bg-blue-50 p-3 rounded-md mb-4">
                            <div className="flex items-center gap-2 justify-end">
                              <span className="text-sm font-medium">تکنسین مسئول:</span>
                              <UserCheck className="w-4 h-4 text-blue-600" />
                            </div>
                            <p className="text-sm font-semibold text-blue-800 text-right">
                              {ticket.assignedTechnicianName}
                            </p>
                          </div>
                        )}

                        {ticket.responses.length > 0 && (
                          <div className="bg-green-50 p-3 rounded-md">
                            <div className="flex items-center gap-2 justify-end mb-2">
                              <span className="text-sm font-medium">آخرین پاسخ:</span>
                              <MessageSquare className="w-4 h-4 text-green-600" />
                            </div>
                            <p className="text-sm text-green-800 text-right line-clamp-2">
                              {ticket.responses[ticket.responses.length - 1].text}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end border-t pt-4">
                      <Button variant="outline" size="sm" onClick={() => handleTicketPreview(ticket)} className="gap-2">
                        <Eye className="w-4 h-4" />
                        مشاهده جزئیات
                      </Button>
                      {ticket.status === "resolved" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 text-yellow-600 border-yellow-200 hover:bg-yellow-50 bg-transparent"
                        >
                          <Star className="w-4 h-4" />
                          امتیاز دهی
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Ticket Form Dialog */}
      {showTicketForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-right">ثبت تیکت جدید</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowTicketForm(false)}>
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
            <TwoStepTicketForm
              categories={[
                { id: "hardware", name: "سخت‌افزار" },
                { id: "software", name: "نرم‌افزار" },
                { id: "network", name: "شبکه" },
                { id: "email", name: "ایمیل" },
                { id: "access", name: "دسترسی" },
                { id: "security", name: "امنیت" },
              ]}
              onSubmit={handleTicketSubmit}
              onCancel={() => setShowTicketForm(false)}
            />
          </div>
        </div>
      )}

      {/* Ticket Preview Dialog */}
      <Dialog open={previewDialog} onOpenChange={setPreviewDialog}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right flex items-center gap-2">
              <Ticket className="w-5 h-5" />
              جزئیات تیکت {selectedTicket?.id}
            </DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-6">
              {/* Ticket Header */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 justify-end mb-3">
                  {getStatusBadge(selectedTicket.status)}
                  {getPriorityBadge(selectedTicket.priority)}
                  <Badge variant="outline">{getCategoryLabel(selectedTicket.category)}</Badge>
                </div>
                <h3 className="font-bold text-xl mb-2 text-right">{selectedTicket.title}</h3>
                <p className="text-muted-foreground text-right">{selectedTicket.description}</p>
              </div>

              {/* Ticket Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">تاریخ ایجاد:</span>
                  <p className="text-right">{formatDate(selectedTicket.createdAt)}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-sm font-medium text-muted-foreground">آخرین به‌روزرسانی:</span>
                  <p className="text-right">{formatDate(selectedTicket.updatedAt)}</p>
                </div>
              </div>

              {selectedTicket.assignedTechnicianName && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 justify-end mb-2">
                    <span className="font-medium">تکنسین مسئول:</span>
                    <UserCheck className="w-5 h-5 text-blue-600" />
                  </div>
                  <p className="font-semibold text-blue-800 text-right">{selectedTicket.assignedTechnicianName}</p>
                  {selectedTicket.estimatedTime && (
                    <p className="text-sm text-blue-600 text-right mt-1">زمان تخمینی: {selectedTicket.estimatedTime}</p>
                  )}
                </div>
              )}

              {/* Responses */}
              {selectedTicket.responses && selectedTicket.responses.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3 text-right flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    تاریخچه مکالمات ({selectedTicket.responses.length})
                  </h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {selectedTicket.responses.map((response: any) => (
                      <div
                        key={response.id}
                        className={`rounded-lg p-4 ${
                          response.type === "technician"
                            ? "bg-blue-50 border-r-4 border-r-blue-500"
                            : "bg-green-50 border-r-4 border-r-green-500"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-muted-foreground">{formatDate(response.timestamp)}</span>
                          <span className="font-semibold text-sm">{response.author}</span>
                        </div>
                        <p className="text-sm text-right">{response.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resolution */}
              {selectedTicket.resolution && (
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 justify-end mb-2">
                    <span className="font-medium text-green-800">راه‌حل نهایی:</span>
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <p className="text-green-800 text-right">{selectedTicket.resolution}</p>
                  {selectedTicket.actualTime && (
                    <p className="text-sm text-green-600 text-right mt-2">زمان صرف شده: {selectedTicket.actualTime}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
