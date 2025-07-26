"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TwoStepTicketForm } from "./two-step-ticket-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { Plus, Clock, CheckCircle, XCircle, AlertCircle, MessageSquare, Calendar, User, Eye } from "lucide-react"

interface ClientDashboardProps {
  tickets: any[]
  onTicketCreate: (ticket: any) => void
  currentUser: any
  categoriesData: any
}

export function ClientDashboard({ tickets, onTicketCreate, currentUser, categoriesData }: ClientDashboardProps) {
  const [createTicketOpen, setCreateTicketOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  // Filter tickets for current user
  const userTickets = tickets.filter((ticket) => ticket.clientEmail === currentUser.email)

  // Get status info
  const getStatusInfo = (status: string) => {
    switch (status) {
      case "open":
        return { label: "باز", color: "bg-blue-500", icon: Clock }
      case "in-progress":
        return { label: "در حال انجام", color: "bg-yellow-500", icon: AlertCircle }
      case "resolved":
        return { label: "حل شده", color: "bg-green-500", icon: CheckCircle }
      case "closed":
        return { label: "بسته شده", color: "bg-gray-500", icon: XCircle }
      default:
        return { label: "نامشخص", color: "bg-gray-400", icon: Clock }
    }
  }

  // Get priority info
  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case "urgent":
        return { label: "فوری", color: "destructive" }
      case "high":
        return { label: "بالا", color: "destructive" }
      case "medium":
        return { label: "متوسط", color: "default" }
      case "low":
        return { label: "پایین", color: "secondary" }
      default:
        return { label: "نامشخص", color: "outline" }
    }
  }

  // Handle ticket creation
  const handleTicketSubmit = (ticketData: any) => {
    onTicketCreate({
      ...ticketData,
      clientName: currentUser.name,
      clientEmail: currentUser.email,
      clientPhone: currentUser.phone || "تعریف نشده",
      department: currentUser.department || "تعریف نشده",
    })
    setCreateTicketOpen(false)
    toast({
      title: "تیکت ایجاد شد",
      description: "تیکت شما با موفقیت ثبت شد و به زودی بررسی خواهد شد",
    })
  }

  // Handle ticket preview
  const handlePreview = (ticket: any) => {
    setSelectedTicket(ticket)
    setPreviewOpen(true)
  }

  // Get ticket stats
  const ticketStats = {
    total: userTickets.length,
    open: userTickets.filter((t) => t.status === "open").length,
    inProgress: userTickets.filter((t) => t.status === "in-progress").length,
    resolved: userTickets.filter((t) => t.status === "resolved").length,
    closed: userTickets.filter((t) => t.status === "closed").length,
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-right">داشبورد کاربر</h2>
          <p className="text-muted-foreground text-right">مدیریت تیکت‌ها و درخواست‌های پشتیبانی</p>
        </div>
        <Dialog open={createTicketOpen} onOpenChange={setCreateTicketOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              تیکت جدید
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-right">ایجاد تیکت جدید</DialogTitle>
            </DialogHeader>
            <TwoStepTicketForm onSubmit={handleTicketSubmit} categoriesData={categoriesData} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{ticketStats.total}</div>
              <div className="text-sm text-muted-foreground">کل تیکت‌ها</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{ticketStats.open}</div>
              <div className="text-sm text-muted-foreground">باز</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">{ticketStats.inProgress}</div>
              <div className="text-sm text-muted-foreground">در حال انجام</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{ticketStats.resolved}</div>
              <div className="text-sm text-muted-foreground">حل شده</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-500">{ticketStats.closed}</div>
              <div className="text-sm text-muted-foreground">بسته شده</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tickets List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">تیکت‌های من</CardTitle>
        </CardHeader>
        <CardContent>
          {userTickets.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground">تیکتی وجود ندارد</h3>
              <p className="text-sm text-muted-foreground mt-1">برای شروع، تیکت جدیدی ایجاد کنید</p>
              <Button className="mt-4 gap-2" onClick={() => setCreateTicketOpen(true)}>
                <Plus className="w-4 h-4" />
                تیکت جدید
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {userTickets.map((ticket) => {
                const statusInfo = getStatusInfo(ticket.status)
                const priorityInfo = getPriorityInfo(ticket.priority)
                const StatusIcon = statusInfo.icon

                return (
                  <div key={ticket.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-right">{ticket.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {ticket.id}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground text-right mb-3 line-clamp-2">
                          {ticket.description}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(ticket.createdAt).toLocaleDateString("fa-IR")}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Badge variant={priorityInfo.color as any} className="text-xs">
                              {priorityInfo.label}
                            </Badge>
                          </div>
                          {ticket.assignedTechnicianName && (
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>{ticket.assignedTechnicianName}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs text-white ${statusInfo.color}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          <span>{statusInfo.label}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => handlePreview(ticket)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {ticket.responses && ticket.responses.length > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <MessageSquare className="w-3 h-3" />
                          <span>آخرین پاسخ: {ticket.responses[ticket.responses.length - 1].message}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ticket Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">جزئیات تیکت</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">شماره تیکت</Label>
                  <p className="text-sm text-muted-foreground">{selectedTicket.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">وضعیت</Label>
                  <div className="flex items-center gap-2 mt-1">
                    {(() => {
                      const statusInfo = getStatusInfo(selectedTicket.status)
                      const StatusIcon = statusInfo.icon
                      return (
                        <div
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs text-white ${statusInfo.color}`}
                        >
                          <StatusIcon className="w-3 h-3" />
                          <span>{statusInfo.label}</span>
                        </div>
                      )
                    })()}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">عنوان</Label>
                <p className="text-sm text-muted-foreground mt-1">{selectedTicket.title}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">توضیحات</Label>
                <p className="text-sm text-muted-foreground mt-1 whitespace-pre-wrap">{selectedTicket.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">اولویت</Label>
                  <div className="mt-1">
                    {(() => {
                      const priorityInfo = getPriorityInfo(selectedTicket.priority)
                      return (
                        <Badge variant={priorityInfo.color as any} className="text-xs">
                          {priorityInfo.label}
                        </Badge>
                      )
                    })()}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">تکنسین مسئول</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedTicket.assignedTechnicianName || "تعیین نشده"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">تاریخ ایجاد</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(selectedTicket.createdAt).toLocaleDateString("fa-IR")}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">آخرین به‌روزرسانی</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    {new Date(selectedTicket.updatedAt).toLocaleDateString("fa-IR")}
                  </p>
                </div>
              </div>

              {selectedTicket.responses && selectedTicket.responses.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">پاسخ‌ها</Label>
                  <div className="space-y-3 mt-2">
                    {selectedTicket.responses.map((response: any, index: number) => (
                      <div key={index} className="border rounded-lg p-3 bg-muted/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{response.technicianName}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(response.timestamp).toLocaleDateString("fa-IR")}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{response.message}</p>
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
