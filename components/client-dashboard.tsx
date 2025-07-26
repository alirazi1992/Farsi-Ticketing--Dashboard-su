"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { TwoStepTicketForm } from "./two-step-ticket-form"
import { Plus, Ticket, Clock, CheckCircle, AlertTriangle, MessageSquare, Eye, Search } from "lucide-react"

interface ClientDashboardProps {
  tickets: any[]
  onTicketAdd: (ticket: any) => void
  categories: any[]
}

export function ClientDashboard({ tickets = [], onTicketAdd, categories = [] }: ClientDashboardProps) {
  const [newTicketDialog, setNewTicketDialog] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [previewDialog, setPreviewDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Safe array access
  const safeTickets = Array.isArray(tickets) ? tickets : []
  const safeCategories = Array.isArray(categories) ? categories : []

  // Filter tickets based on search
  const filteredTickets = safeTickets.filter(
    (ticket) =>
      (ticket.title && ticket.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ticket.id && ticket.id.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Calculate statistics
  const stats = {
    total: safeTickets.length,
    open: safeTickets.filter((t) => t.status === "open").length,
    inProgress: safeTickets.filter((t) => t.status === "in-progress").length,
    resolved: safeTickets.filter((t) => t.status === "resolved").length,
  }

  const handleTicketSubmit = (ticketData: any) => {
    const newTicket = {
      id: `TK-${Date.now()}`,
      ...ticketData,
      status: "open",
      createdAt: new Date().toISOString(),
      responses: [],
      assignedTo: null,
      assignedTechnicianName: null,
    }

    onTicketAdd(newTicket)
    setNewTicketDialog(false)
  }

  const handleTicketPreview = (ticket: any) => {
    setSelectedTicket(ticket)
    setPreviewDialog(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="destructive">باز</Badge>
      case "in-progress":
        return <Badge variant="secondary">در حال انجام</Badge>
      case "resolved":
        return <Badge variant="default">حل شده</Badge>
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
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">کل تیکت‌ها</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Ticket className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">باز</p>
                <p className="text-2xl font-bold text-red-600">{stats.open}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">در حال انجام</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">حل شده</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-right">تیکت‌های من</CardTitle>
            <Dialog open={newTicketDialog} onOpenChange={setNewTicketDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  تیکت جدید
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="text-right">ایجاد تیکت جدید</DialogTitle>
                </DialogHeader>
                <TwoStepTicketForm
                  categories={safeCategories}
                  onSubmit={handleTicketSubmit}
                  onCancel={() => setNewTicketDialog(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="جستجو در تیکت‌ها..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>

          {/* Tickets List */}
          <div className="space-y-4">
            {filteredTickets.length === 0 ? (
              <div className="text-center py-8">
                <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {safeTickets.length === 0 ? "هیچ تیکتی ندارید" : "هیچ تیکتی با جستجوی شما یافت نشد"}
                </p>
                {safeTickets.length === 0 && (
                  <p className="text-sm text-gray-400 mt-2">برای شروع، تیکت جدید ایجاد کنید</p>
                )}
              </div>
            ) : (
              filteredTickets.map((ticket) => (
                <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">{ticket.id}</span>
                          {getStatusBadge(ticket.status)}
                          {getPriorityBadge(ticket.priority)}
                        </div>
                        <h3 className="font-medium text-lg mb-2">{ticket.title || "بدون عنوان"}</h3>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {ticket.description || "توضیحات موجود نیست"}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>دسته‌بندی: {ticket.category || "نامشخص"}</span>
                          <span>
                            تاریخ:{" "}
                            {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString("fa-IR") : "نامشخص"}
                          </span>
                          {ticket.assignedTechnicianName && <span>تکنسین: {ticket.assignedTechnicianName}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {ticket.responses && ticket.responses.length > 0 && (
                          <Badge variant="outline" className="gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {ticket.responses.length}
                          </Badge>
                        )}
                        <Button variant="outline" size="sm" onClick={() => handleTicketPreview(ticket)}>
                          <Eye className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Ticket Preview Dialog */}
      <Dialog open={previewDialog} onOpenChange={setPreviewDialog}>
        <DialogContent className="sm:max-w-[600px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">جزئیات تیکت</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">شماره تیکت:</span>
                  <p className="font-semibold">{selectedTicket.id}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">وضعیت:</span>
                  <div className="mt-1">{getStatusBadge(selectedTicket.status)}</div>
                </div>
              </div>

              <div>
                <span className="text-sm font-medium text-muted-foreground">عنوان:</span>
                <p className="font-semibold mt-1">{selectedTicket.title || "بدون عنوان"}</p>
              </div>

              <div>
                <span className="text-sm font-medium text-muted-foreground">توضیحات:</span>
                <p className="mt-1 text-sm">{selectedTicket.description || "توضیحات موجود نیست"}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-muted-foreground">اولویت:</span>
                  <div className="mt-1">{getPriorityBadge(selectedTicket.priority)}</div>
                </div>
                <div>
                  <span className="text-sm font-medium text-muted-foreground">دسته‌بندی:</span>
                  <p className="mt-1">{selectedTicket.category || "نامشخص"}</p>
                </div>
              </div>

              <div>
                <span className="text-sm font-medium text-muted-foreground">تکنسین مسئول:</span>
                <p className="mt-1">{selectedTicket.assignedTechnicianName || "تخصیص نیافته"}</p>
              </div>

              <div>
                <span className="text-sm font-medium text-muted-foreground">تاریخ ایجاد:</span>
                <p className="mt-1">
                  {selectedTicket.createdAt ? new Date(selectedTicket.createdAt).toLocaleDateString("fa-IR") : "نامشخص"}
                </p>
              </div>

              {selectedTicket.responses && selectedTicket.responses.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">پاسخ‌ها:</span>
                  <div className="space-y-3 mt-2">
                    {selectedTicket.responses.map((response: any) => (
                      <div key={response.id} className="p-3 bg-muted rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-sm">{response.author || "نامشخص"}</span>
                          <span className="text-xs text-muted-foreground">
                            {response.timestamp ? new Date(response.timestamp).toLocaleDateString("fa-IR") : "نامشخص"}
                          </span>
                        </div>
                        <p className="text-sm">{response.text || "متن پاسخ موجود نیست"}</p>
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
