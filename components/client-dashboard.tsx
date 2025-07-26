"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { TwoStepTicketForm } from "./two-step-ticket-form"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Search, Clock, CheckCircle, AlertCircle, MessageSquare, Calendar, User, Eye } from "lucide-react"

interface ClientDashboardProps {
  tickets: any[]
  categories: any[]
  onTicketSubmit: (ticketData: any) => string
}

// Helper functions for safe operations
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

export function ClientDashboard({ tickets = [], categories = [], onTicketSubmit }: ClientDashboardProps) {
  const [newTicketDialogOpen, setNewTicketDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)

  // Safe array access
  const safeTickets = Array.isArray(tickets) ? tickets : []
  const safeCategories = Array.isArray(categories) ? categories : []

  // Filter tickets based on search
  const filteredTickets = safeTickets.filter(
    (ticket) =>
      safeString(ticket.title).toLowerCase().includes(searchTerm.toLowerCase()) ||
      safeString(ticket.id).toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleTicketSubmit = (ticketData: any) => {
    const ticketId = onTicketSubmit(ticketData)
    setNewTicketDialogOpen(false)
    return ticketId
  }

  const handlePreviewTicket = (ticket: any) => {
    setSelectedTicket(ticket)
    setPreviewDialogOpen(true)
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="w-4 h-4" />
      case "in-progress":
        return <Clock className="w-4 h-4" />
      case "resolved":
        return <CheckCircle className="w-4 h-4" />
      case "closed":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  // Group tickets by status
  const ticketsByStatus = {
    all: filteredTickets,
    open: filteredTickets.filter((t) => t.status === "open"),
    "in-progress": filteredTickets.filter((t) => t.status === "in-progress"),
    resolved: filteredTickets.filter((t) => t.status === "resolved"),
    closed: filteredTickets.filter((t) => t.status === "closed"),
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">پنل کاربر</h2>
          <p className="text-muted-foreground">مدیریت تیکت‌ها و درخواست‌های شما</p>
        </div>
        <Dialog open={newTicketDialogOpen} onOpenChange={setNewTicketDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              تیکت جدید
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <DialogHeader>
              <DialogTitle>ارسال تیکت جدید</DialogTitle>
              <DialogDescription>لطفاً اطلاعات مربوط به مشکل یا درخواست خود را وارد کنید</DialogDescription>
            </DialogHeader>
            <TwoStepTicketForm
              categories={safeCategories}
              onSubmit={handleTicketSubmit}
              onCancel={() => setNewTicketDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="جستجو در تیکت‌های شما..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
                    <MessageSquare className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-600 mb-2">تیکتی یافت نشد</p>
                    <p className="text-gray-500 mb-4">
                      {searchTerm ? "نتیجه‌ای برای جستجوی شما یافت نشد" : "شما هنوز تیکتی ارسال نکرده‌اید"}
                    </p>
                    {!searchTerm && (
                      <Button onClick={() => setNewTicketDialogOpen(true)} className="gap-2">
                        <Plus className="w-4 h-4" />
                        ارسال اولین تیکت
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

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">تاریخ ارسال:</span>
                              <span>{formatDate(ticket.submittedAt)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MessageSquare className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">شناسه:</span>
                              <span className="font-mono">{safeString(ticket.id)}</span>
                            </div>
                            {ticket.assignedTechnicianName && (
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-600">تکنسین:</span>
                                <span className="font-medium">{getDisplayName(ticket.assignedTechnicianName)}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handlePreviewTicket(ticket)}
                          className="gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          مشاهده
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Ticket Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              جزئیات تیکت
            </DialogTitle>
            <DialogDescription>مشاهده کامل اطلاعات تیکت {selectedTicket?.id}</DialogDescription>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{safeString(selectedTicket.title)}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className={getStatusColor(selectedTicket.status)}>
                      {getStatusLabel(selectedTicket.status)}
                    </Badge>
                    <Badge className={getPriorityColor(selectedTicket.priority)}>
                      {getPriorityLabel(selectedTicket.priority)}
                    </Badge>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">شرح مشکل:</h4>
                  <p className="text-gray-700 leading-relaxed">
                    {safeString(selectedTicket.description) || "توضیحات موجود نیست"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">اطلاعات تیکت:</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-gray-600">شناسه:</span> {safeString(selectedTicket.id)}
                      </p>
                      <p>
                        <span className="text-gray-600">دسته‌بندی:</span>{" "}
                        {safeString(selectedTicket.category) || "نامشخص"}
                      </p>
                      <p>
                        <span className="text-gray-600">تاریخ ارسال:</span> {formatDate(selectedTicket.submittedAt)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">وضعیت پردازش:</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-gray-600">وضعیت:</span> {getStatusLabel(selectedTicket.status)}
                      </p>
                      <p>
                        <span className="text-gray-600">اولویت:</span> {getPriorityLabel(selectedTicket.priority)}
                      </p>
                      {selectedTicket.assignedTechnicianName ? (
                        <p>
                          <span className="text-gray-600">تکنسین:</span>{" "}
                          {getDisplayName(selectedTicket.assignedTechnicianName)}
                        </p>
                      ) : (
                        <p className="text-gray-500">هنوز واگذار نشده</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Responses */}
                {selectedTicket.responses && selectedTicket.responses.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-3">پاسخ‌ها و تعاملات:</h4>
                    <div className="space-y-3">
                      {selectedTicket.responses.map((response: any) => (
                        <div key={response.id} className="bg-blue-50 p-3 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">
                                {response.author && response.author.length > 0 ? response.author.charAt(0) : "N"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm">{getDisplayName(response.author)}</span>
                            <span className="text-xs text-gray-500">{formatDate(response.timestamp)}</span>
                          </div>
                          <p className="text-sm text-gray-700">{safeString(response.text)}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>
              بستن
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
