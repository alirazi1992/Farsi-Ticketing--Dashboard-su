"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { TwoStepTicketForm } from "@/components/two-step-ticket-form"
import { toast } from "@/hooks/use-toast"
import {
  Plus,
  Search,
  Eye,
  Clock,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Calendar,
  User,
  Ticket,
} from "lucide-react"

interface ClientDashboardProps {
  tickets: any[]
  onTicketAdd: (ticket: any) => void
  categories: any[]
}

export function ClientDashboard({ tickets = [], onTicketAdd, categories = [] }: ClientDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [newTicketDialogOpen, setNewTicketDialogOpen] = useState(false)

  // Safe array operations
  const safeTickets = Array.isArray(tickets) ? tickets : []
  const safeCategories = Array.isArray(categories) ? categories : []

  // Helper functions
  const safeString = (value: any): string => {
    return value && typeof value === "string" ? value : ""
  }

  const getDisplayName = (name: any): string => {
    const safeName = safeString(name)
    return safeName || "نام نامشخص"
  }

  const formatDate = (dateString: any): string => {
    if (!dateString) return "تاریخ نامشخص"
    try {
      return new Date(dateString).toLocaleDateString("fa-IR")
    } catch {
      return "تاریخ نامعتبر"
    }
  }

  // Filter tickets based on search
  const filteredTickets = safeTickets.filter((ticket) => {
    const searchableText = [safeString(ticket.title), safeString(ticket.description), safeString(ticket.id)]
      .join(" ")
      .toLowerCase()

    return searchableText.includes(searchQuery.toLowerCase())
  })

  // Group tickets by status
  const ticketsByStatus = {
    all: filteredTickets,
    open: filteredTickets.filter((t) => t.status === "open"),
    "in-progress": filteredTickets.filter((t) => t.status === "in-progress"),
    resolved: filteredTickets.filter((t) => t.status === "resolved"),
    closed: filteredTickets.filter((t) => t.status === "closed"),
  }

  const handleViewTicket = (ticket: any) => {
    setSelectedTicket(ticket)
    setViewDialogOpen(true)
  }

  const handleNewTicket = (ticketData: any) => {
    const newTicket = {
      id: `TK-${Date.now()}`,
      ...ticketData,
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      responses: [],
    }

    onTicketAdd(newTicket)
    setNewTicketDialogOpen(false)

    toast({
      title: "تیکت ایجاد شد",
      description: `تیکت ${newTicket.id} با موفقیت ثبت شد`,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
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
      case "closed":
        return "بسته شده"
      default:
        return "نامشخص"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case "in-progress":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "closed":
        return <CheckCircle className="w-4 h-4 text-gray-500" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "فوری"
      case "high":
        return "بالا"
      case "medium":
        return "متوسط"
      case "low":
        return "پایین"
      default:
        return "نامشخص"
    }
  }

  // Calculate statistics
  const stats = {
    total: safeTickets.length,
    open: safeTickets.filter((t) => t.status === "open").length,
    inProgress: safeTickets.filter((t) => t.status === "in-progress").length,
    resolved: safeTickets.filter((t) => t.status === "resolved").length,
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">پنل کاربر</h2>
          <p className="text-muted-foreground">مدیریت تیکت‌ها و درخواست‌های پشتیبانی</p>
        </div>
        <Button onClick={() => setNewTicketDialogOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          تیکت جدید
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">کل تیکت‌ها</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Ticket className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">باز</p>
                <p className="text-2xl font-bold text-red-600">{stats.open}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">در حال انجام</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">حل شده</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="جستجو در تیکت‌ها..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-10"
        />
      </div>

      {/* Tickets Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">همه ({ticketsByStatus.all.length})</TabsTrigger>
          <TabsTrigger value="open">باز ({ticketsByStatus.open.length})</TabsTrigger>
          <TabsTrigger value="in-progress">در حال انجام ({ticketsByStatus["in-progress"].length})</TabsTrigger>
          <TabsTrigger value="resolved">حل شده ({ticketsByStatus.resolved.length})</TabsTrigger>
          <TabsTrigger value="closed">بسته ({ticketsByStatus.closed.length})</TabsTrigger>
        </TabsList>

        {Object.entries(ticketsByStatus).map(([status, statusTickets]) => (
          <TabsContent key={status} value={status}>
            <div className="space-y-4">
              {statusTickets.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Ticket className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-600 mb-2">تیکتی یافت نشد</p>
                    <p className="text-gray-500 mb-4">
                      {searchQuery ? "نتیجه‌ای برای جستجوی شما یافت نشد" : "هنوز تیکتی ثبت نکرده‌اید"}
                    </p>
                    {!searchQuery && (
                      <Button onClick={() => setNewTicketDialogOpen(true)} className="gap-2">
                        <Plus className="w-4 h-4" />
                        ایجاد اولین تیکت
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                statusTickets.map((ticket) => (
                  <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            {getStatusIcon(ticket.status)}
                            <h3 className="text-lg font-semibold">{safeString(ticket.title) || "عنوان نامشخص"}</h3>
                            <Badge className={getStatusColor(ticket.status)}>{getStatusLabel(ticket.status)}</Badge>
                            <Badge className={getPriorityColor(ticket.priority)}>
                              {getPriorityLabel(ticket.priority)}
                            </Badge>
                          </div>

                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {safeString(ticket.description) || "توضیحات موجود نیست"}
                          </p>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">تاریخ ایجاد:</span>
                              <span>{formatDate(ticket.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">شناسه:</span>
                              <span className="font-mono">{safeString(ticket.id)}</span>
                            </div>
                            {ticket.assignedTechnicianName && (
                              <div className="flex items-center gap-2">
                                <Avatar className="w-5 h-5">
                                  <AvatarFallback className="text-xs">
                                    {ticket.assignedTechnicianName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-gray-600">تکنسین:</span>
                                <span className="font-medium">{getDisplayName(ticket.assignedTechnicianName)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewTicket(ticket)}>
                            <Eye className="w-4 h-4 ml-2" />
                            مشاهده
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* New Ticket Dialog */}
      <Dialog open={newTicketDialogOpen} onOpenChange={setNewTicketDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              ایجاد تیکت جدید
            </DialogTitle>
          </DialogHeader>
          <TwoStepTicketForm
            categories={safeCategories}
            onSubmit={handleNewTicket}
            onCancel={() => setNewTicketDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* View Ticket Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              جزئیات تیکت {selectedTicket?.id}
            </DialogTitle>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-6">
              {/* Ticket Header */}
              <div className="flex justify-between items-start">
                <div className="text-right space-y-2">
                  <h3 className="text-xl font-semibold">{safeString(selectedTicket.title)}</h3>
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(selectedTicket.status)}>
                      {getStatusLabel(selectedTicket.status)}
                    </Badge>
                    <Badge className={getPriorityColor(selectedTicket.priority)}>
                      {getPriorityLabel(selectedTicket.priority)}
                    </Badge>
                  </div>
                </div>
                <div className="text-left space-y-1">
                  <p className="text-sm text-muted-foreground">شماره تیکت</p>
                  <p className="font-mono text-lg">{safeString(selectedTicket.id)}</p>
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
                        <span>{safeString(selectedTicket.category) || "نامشخص"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">تاریخ ایجاد:</span>
                        <span>{formatDate(selectedTicket.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">آخرین به‌روزرسانی:</span>
                        <span>{formatDate(selectedTicket.updatedAt)}</span>
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
                        <span>{getDisplayName(selectedTicket.assignedTechnicianName)}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">وضعیت پیگیری</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(selectedTicket.status)}
                        <span>{getStatusLabel(selectedTicket.status)}</span>
                      </div>
                      {selectedTicket.responses && selectedTicket.responses.length > 0 && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MessageSquare className="w-4 h-4" />
                          <span>{selectedTicket.responses.length} پاسخ دریافت شده</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h4 className="font-medium mb-2">شرح مشکل</h4>
                <div className="bg-muted p-4 rounded-lg text-right">
                  <p className="whitespace-pre-wrap">
                    {safeString(selectedTicket.description) || "توضیحات موجود نیست"}
                  </p>
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
                      <div key={response.id || index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">{response.author?.charAt(0) || "T"}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm">{getDisplayName(response.author)}</span>
                            {response.type === "admin" && (
                              <Badge variant="secondary" className="text-xs">
                                مدیر
                              </Badge>
                            )}
                          </div>
                          <div className="text-left">
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(response.timestamp)}
                            </p>
                          </div>
                        </div>
                        <div className="bg-muted/50 p-3 rounded text-right">
                          <p className="whitespace-pre-wrap">
                            {safeString(response.text) || safeString(response.message)}
                          </p>
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
