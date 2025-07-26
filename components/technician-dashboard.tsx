"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { Ticket, Clock, CheckCircle, MessageSquare, Eye, Send, Search } from "lucide-react"

interface TechnicianDashboardProps {
  tickets: any[]
  onTicketUpdate: (ticketId: string, updates: any) => void
}

export function TechnicianDashboard({ tickets = [], onTicketUpdate }: TechnicianDashboardProps) {
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [responseDialog, setResponseDialog] = useState<any>(null)
  const [previewDialog, setPreviewDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Safe array access
  const safeTickets = Array.isArray(tickets) ? tickets : []

  // Filter tickets
  const filteredTickets = safeTickets.filter((ticket) => {
    const matchesSearch =
      (ticket.title && ticket.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ticket.id && ticket.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ticket.clientName && ticket.clientName.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Calculate statistics
  const stats = {
    total: safeTickets.length,
    open: safeTickets.filter((t) => t.status === "open").length,
    inProgress: safeTickets.filter((t) => t.status === "in-progress").length,
    resolved: safeTickets.filter((t) => t.status === "resolved").length,
  }

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    onTicketUpdate(ticketId, { status: newStatus })
    toast({
      title: "وضعیت تیکت تغییر کرد",
      description: `وضعیت تیکت به "${newStatus === "open" ? "باز" : newStatus === "in-progress" ? "در حال انجام" : "حل شده"}" تغییر یافت`,
    })
  }

  const handleAddResponse = (formData: FormData) => {
    if (!responseDialog) return

    const newResponse = {
      id: `resp-${Date.now()}`,
      text: formData.get("response") as string,
      author: "تکنسین",
      timestamp: new Date().toISOString(),
      type: "technician",
    }

    const updatedResponses = [...(responseDialog.responses || []), newResponse]
    onTicketUpdate(responseDialog.id, {
      responses: updatedResponses,
      status: "in-progress",
    })
    setResponseDialog(null)

    toast({
      title: "پاسخ ارسال شد",
      description: "پاسخ شما با موفقیت ثبت شد",
    })
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
              <Ticket className="h-8 w-8 text-red-600" />
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
          <CardTitle className="text-right">تیکت‌های من</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="وضعیت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                <SelectItem value="open">باز</SelectItem>
                <SelectItem value="in-progress">در حال انجام</SelectItem>
                <SelectItem value="resolved">حل شده</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tickets List */}
          <div className="space-y-4">
            {filteredTickets.length === 0 ? (
              <div className="text-center py-8">
                <Ticket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  {safeTickets.length === 0
                    ? "هیچ تیکتی به شما تخصیص نیافته است"
                    : "هیچ تیکتی با فیلترهای انتخابی یافت نشد"}
                </p>
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
                          <span>درخواست‌کننده: {ticket.clientName || "نامشخص"}</span>
                          <span>دسته‌بندی: {ticket.category || "نامشخص"}</span>
                          <span>
                            تاریخ:{" "}
                            {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString("fa-IR") : "نامشخص"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {ticket.responses && ticket.responses.length > 0 && (
                          <Badge variant="outline" className="gap-1">
                            <MessageSquare className="w-3 h-3" />
                            {ticket.responses.length}
                          </Badge>
                        )}
                        <Select
                          value={ticket.status || "open"}
                          onValueChange={(value) => handleStatusChange(ticket.id, value)}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">باز</SelectItem>
                            <SelectItem value="in-progress">در حال انجام</SelectItem>
                            <SelectItem value="resolved">حل شده</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" size="sm" onClick={() => handleTicketPreview(ticket)}>
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Dialog
                          open={responseDialog?.id === ticket.id}
                          onOpenChange={(open) => setResponseDialog(open ? ticket : null)}
                        >
                          <DialogTrigger asChild>
                            <Button size="sm">
                              <Send className="w-3 h-3 mr-1" />
                              پاسخ
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[500px]" dir="rtl">
                            <form action={handleAddResponse}>
                              <DialogHeader>
                                <DialogTitle className="text-right">ارسال پاسخ</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                  <Label>تیکت: {ticket.title}</Label>
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="response">پاسخ شما</Label>
                                  <Textarea
                                    id="response"
                                    name="response"
                                    placeholder="پاسخ خود را وارد کنید..."
                                    rows={4}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setResponseDialog(null)}>
                                  انصراف
                                </Button>
                                <Button type="submit">ارسال پاسخ</Button>
                              </div>
                            </form>
                          </DialogContent>
                        </Dialog>
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
                <span className="text-sm font-medium text-muted-foreground">درخواست‌کننده:</span>
                <p className="mt-1">{selectedTicket.clientName || "نامشخص"}</p>
              </div>

              <div>
                <span className="text-sm font-medium text-muted-foreground">تاریخ ایجاد:</span>
                <p className="mt-1">
                  {selectedTicket.createdAt ? new Date(selectedTicket.createdAt).toLocaleDateString("fa-IR") : "نامشخص"}
                </p>
              </div>

              {selectedTicket.responses && selectedTicket.responses.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">تاریخچه پاسخ‌ها:</span>
                  <div className="space-y-3 mt-2 max-h-60 overflow-y-auto">
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
