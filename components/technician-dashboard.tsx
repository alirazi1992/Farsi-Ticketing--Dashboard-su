"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import {
  Clock,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Calendar,
  User,
  Wrench,
  TrendingUp,
  Star,
  Target,
  Send,
} from "lucide-react"

interface TechnicianDashboardProps {
  tickets: any[]
  onTicketUpdate: (ticketId: string, updates: any) => void
}

export function TechnicianDashboard({ tickets = [], onTicketUpdate }: TechnicianDashboardProps) {
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [responseDialogOpen, setResponseDialogOpen] = useState(false)
  const [responseText, setResponseText] = useState("")
  const [newStatus, setNewStatus] = useState("")

  // Safe array operations
  const safeTickets = Array.isArray(tickets) ? tickets : []

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

  // Group tickets by status
  const ticketsByStatus = {
    all: safeTickets,
    open: safeTickets.filter((t) => t.status === "open"),
    "in-progress": safeTickets.filter((t) => t.status === "in-progress"),
    resolved: safeTickets.filter((t) => t.status === "resolved"),
  }

  const handleOpenResponse = (ticket: any) => {
    setSelectedTicket(ticket)
    setNewStatus(ticket.status)
    setResponseText("")
    setResponseDialogOpen(true)
  }

  const handleSendResponse = () => {
    if (!selectedTicket || !responseText.trim()) return

    const response = {
      id: Date.now().toString(),
      text: responseText,
      author: "تکنسین سیستم", // In real app, get from auth context
      timestamp: new Date().toISOString(),
      type: "technician",
    }

    const updatedTicket = {
      ...selectedTicket,
      responses: [...(selectedTicket.responses || []), response],
      status: newStatus,
      updatedAt: new Date().toISOString(),
    }

    onTicketUpdate(selectedTicket.id, updatedTicket)

    toast({
      title: "پاسخ ارسال شد",
      description: `پاسخ شما به تیکت ${selectedTicket.id} ارسال شد`,
    })

    setResponseDialogOpen(false)
    setResponseText("")
    setSelectedTicket(null)
  }

  const handleStatusChange = (ticketId: string, status: string) => {
    onTicketUpdate(ticketId, {
      status,
      updatedAt: new Date().toISOString(),
    })

    toast({
      title: "وضعیت تغییر کرد",
      description: `وضعیت تیکت ${ticketId} به ${getStatusLabel(status)} تغییر یافت`,
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
    avgResponseTime: "2.4 ساعت", // Mock data
    satisfaction: 4.8, // Mock data
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="text-right">
        <h2 className="text-2xl font-bold">پنل تکنسین</h2>
        <p className="text-muted-foreground">مدیریت و پاسخ‌دهی به تیکت‌های واگذار شده</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">کل تیکت‌ها</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Wrench className="w-8 h-8 text-blue-500" />
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

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">زمان پاسخ</p>
                <p className="text-lg font-bold">{stats.avgResponseTime}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">رضایت</p>
                <p className="text-lg font-bold">{stats.satisfaction}/5</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tickets Tabs */}
      <Tabs defaultValue="all" className="space-y-4" dir="rtl">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">همه ({ticketsByStatus.all.length})</TabsTrigger>
          <TabsTrigger value="open">باز ({ticketsByStatus.open.length})</TabsTrigger>
          <TabsTrigger value="in-progress">در حال انجام ({ticketsByStatus["in-progress"].length})</TabsTrigger>
          <TabsTrigger value="resolved">حل شده ({ticketsByStatus.resolved.length})</TabsTrigger>
        </TabsList>

        {Object.entries(ticketsByStatus).map(([status, statusTickets]) => (
          <TabsContent key={status} value={status}>
            <div className="space-y-4">
              {statusTickets.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Target className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-600 mb-2">تیکتی یافت نشد</p>
                    <p className="text-gray-500">
                      {status === "all"
                        ? "هیچ تیکتی به شما واگذار نشده است"
                        : `تیکتی در وضعیت ${getStatusLabel(status)} وجود ندارد`}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                statusTickets.map((ticket) => (
                  <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 text-right">
                          <div className="flex items-center gap-3 mb-3 justify-end">
                            <Badge className={getPriorityColor(ticket.priority)}>
                              {getPriorityLabel(ticket.priority)}
                            </Badge>
                            <Badge className={getStatusColor(ticket.status)}>{getStatusLabel(ticket.status)}</Badge>
                            <h3 className="text-lg font-semibold">{safeString(ticket.title) || "عنوان نامشخص"}</h3>
                            {getStatusIcon(ticket.status)}
                          </div>

                          <p className="text-gray-600 mb-4 line-clamp-2 text-right">
                            {safeString(ticket.description) || "توضیحات موجود نیست"}
                          </p>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2 justify-end">
                              <span className="font-medium">{getDisplayName(ticket.clientName)}</span>
                              <span className="text-gray-600">:درخواست‌کننده</span>
                              <User className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="flex items-center gap-2 justify-end">
                              <span>{formatDate(ticket.createdAt)}</span>
                              <span className="text-gray-600">:تاریخ</span>
                              <Calendar className="w-4 h-4 text-gray-400" />
                            </div>
                            <div className="flex items-center gap-2 justify-end">
                              <span className="font-mono">{safeString(ticket.id)}</span>
                              <span className="text-gray-600">:شناسه</span>
                              <MessageSquare className="w-4 h-4 text-gray-400" />
                            </div>
                          </div>

                          {ticket.responses && ticket.responses.length > 0 && (
                            <div className="mt-3 text-sm text-muted-foreground text-right">
                              {ticket.responses.length} پاسخ ارسال شده
                              <MessageSquare className="w-4 h-4 inline mr-1" />
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Status Change */}
                          <Select value={ticket.status} onValueChange={(value) => handleStatusChange(ticket.id, value)}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="open">باز</SelectItem>
                              <SelectItem value="in-progress">در حال انجام</SelectItem>
                              <SelectItem value="resolved">حل شده</SelectItem>
                            </SelectContent>
                          </Select>

                          {/* Response Button */}
                          <Button onClick={() => handleOpenResponse(ticket)} className="gap-2">
                            <MessageSquare className="w-4 h-4" />
                            پاسخ
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

      {/* Response Dialog */}
      <Dialog open={responseDialogOpen} onOpenChange={setResponseDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              پاسخ به تیکت {selectedTicket?.id}
            </DialogTitle>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-6">
              {/* Ticket Summary */}
              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="text-left">
                      <p className="text-sm text-muted-foreground">درخواست‌کننده</p>
                      <p className="font-medium">{getDisplayName(selectedTicket.clientName)}</p>
                    </div>
                    <div className="flex-1 text-right">
                      <h4 className="font-medium mb-2">{safeString(selectedTicket.title)}</h4>
                      <p className="text-sm text-muted-foreground mb-2">{safeString(selectedTicket.description)}</p>
                      <div className="flex items-center gap-2 justify-end">
                        <Badge className={getPriorityColor(selectedTicket.priority)}>
                          {getPriorityLabel(selectedTicket.priority)}
                        </Badge>
                        <Badge className={getStatusColor(selectedTicket.status)}>
                          {getStatusLabel(selectedTicket.status)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Previous Responses */}
              {selectedTicket.responses && selectedTicket.responses.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3 text-right">پاسخ‌های قبلی</h4>
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {selectedTicket.responses.map((response: any, index: number) => (
                      <div key={response.id || index} className="bg-muted/30 p-3 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs text-muted-foreground">{formatDate(response.timestamp)}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{getDisplayName(response.author)}</span>
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">{response.author?.charAt(0) || "T"}</AvatarFallback>
                            </Avatar>
                            {response.type === "technician" && (
                              <Badge variant="secondary" className="text-xs">
                                تکنسین
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-right">
                          {safeString(response.text) || safeString(response.message)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              {/* New Response Form */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="status" className="text-right">
                    تغییر وضعیت
                  </Label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">باز</SelectItem>
                      <SelectItem value="in-progress">در حال انجام</SelectItem>
                      <SelectItem value="resolved">حل شده</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="response" className="text-right">
                    پاسخ شما
                  </Label>
                  <Textarea
                    id="response"
                    placeholder="پاسخ خود را اینجا بنویسید..."
                    value={responseText}
                    onChange={(e) => setResponseText(e.target.value)}
                    className="min-h-32 mt-2 text-right"
                    dir="rtl"
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setResponseDialogOpen(false)}>
              انصراف
            </Button>
            <Button onClick={handleSendResponse} disabled={!responseText.trim()} className="gap-2">
              <Send className="w-4 h-4" />
              ارسال پاسخ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
