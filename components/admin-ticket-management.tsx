"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  Calendar,
  MessageSquare,
} from "lucide-react"

interface AdminTicketManagementProps {
  tickets: any[]
  onTicketUpdate: (ticketId: string, updates: any) => void
}

// Helper functions for safe operations
const safeString = (value: any): string => {
  return value && typeof value === "string" ? value : ""
}

const getDisplayName = (name: any): string => {
  const safeName = safeString(name)
  return safeName || "نام نامشخص"
}

const getAvatarFallback = (name: any): string => {
  const safeName = safeString(name)
  return safeName && safeName.length > 0 ? safeName.charAt(0) : "N"
}

const formatDate = (dateString: any): string => {
  if (!dateString) return "تاریخ نامشخص"
  try {
    return new Date(dateString).toLocaleDateString("fa-IR")
  } catch {
    return "تاریخ نامعتبر"
  }
}

export function AdminTicketManagement({ tickets = [], onTicketUpdate }: AdminTicketManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)

  // Safe array access
  const safeTickets = Array.isArray(tickets) ? tickets : []

  // Filter tickets based on search and filters
  const filteredTickets = safeTickets.filter((ticket) => {
    const matchesSearch =
      safeString(ticket.title).toLowerCase().includes(searchTerm.toLowerCase()) ||
      safeString(ticket.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      getDisplayName(ticket.clientName).toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    onTicketUpdate(ticketId, { status: newStatus })
    toast({
      title: "وضعیت تیکت تغییر کرد",
      description: `وضعیت تیکت به ${getStatusLabel(newStatus)} تغییر یافت`,
    })
  }

  const handlePriorityChange = (ticketId: string, newPriority: string) => {
    onTicketUpdate(ticketId, { priority: newPriority })
    toast({
      title: "اولویت تیکت تغییر کرد",
      description: `اولویت تیکت به ${getPriorityLabel(newPriority)} تغییر یافت`,
    })
  }

  const handlePreviewTicket = (ticket: any) => {
    setSelectedTicket(ticket)
    setPreviewDialogOpen(true)
  }

  const handleDeleteTicket = (ticketId: string) => {
    // In a real app, you would call an API to delete the ticket
    toast({
      title: "تیکت حذف شد",
      description: "تیکت با موفقیت حذف شد",
    })
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

  // Group tickets by status for tabs
  const ticketsByStatus = {
    all: filteredTickets,
    open: filteredTickets.filter((t) => t.status === "open"),
    "in-progress": filteredTickets.filter((t) => t.status === "in-progress"),
    resolved: filteredTickets.filter((t) => t.status === "resolved"),
    closed: filteredTickets.filter((t) => t.status === "closed"),
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header and Filters */}
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold">مدیریت تیکت‌ها</h2>
          <p className="text-muted-foreground">مشاهده و مدیریت تمامی تیکت‌های سیستم</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="جستجو در تیکت‌ها..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pr-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="فیلتر وضعیت" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه وضعیت‌ها</SelectItem>
              <SelectItem value="open">باز</SelectItem>
              <SelectItem value="in-progress">در حال انجام</SelectItem>
              <SelectItem value="resolved">حل شده</SelectItem>
              <SelectItem value="closed">بسته شده</SelectItem>
            </SelectContent>
          </Select>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="فیلتر اولویت" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">همه اولویت‌ها</SelectItem>
              <SelectItem value="urgent">فوری</SelectItem>
              <SelectItem value="high">بالا</SelectItem>
              <SelectItem value="medium">متوسط</SelectItem>
              <SelectItem value="low">پایین</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
                    <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
                    <p className="text-lg font-medium text-gray-600 mb-2">تیکتی یافت نشد</p>
                    <p className="text-gray-500">
                      {searchTerm ? "نتیجه‌ای برای جستجوی شما یافت نشد" : "هیچ تیکتی در این وضعیت وجود ندارد"}
                    </p>
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

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">ارسال‌کننده:</span>
                              <span className="font-medium">{getDisplayName(ticket.clientName)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">تاریخ:</span>
                              <span>{formatDate(ticket.createdAt)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MessageSquare className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-600">شناسه:</span>
                              <span className="font-mono">{safeString(ticket.id)}</span>
                            </div>
                            {ticket.assignedTechnicianName && (
                              <div className="flex items-center gap-2">
                                <Avatar className="w-5 h-5">
                                  <AvatarFallback className="text-xs">
                                    {getAvatarFallback(ticket.assignedTechnicianName)}
                                  </AvatarFallback>
                                </Avatar>
                                <span className="text-gray-600">تکنسین:</span>
                                <span className="font-medium">{getDisplayName(ticket.assignedTechnicianName)}</span>
                              </div>
                            )}
                          </div>
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
                              <SelectItem value="closed">بسته شده</SelectItem>
                            </SelectContent>
                          </Select>

                          {/* Priority Change */}
                          <Select
                            value={ticket.priority}
                            onValueChange={(value) => handlePriorityChange(ticket.id, value)}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="urgent">فوری</SelectItem>
                              <SelectItem value="high">بالا</SelectItem>
                              <SelectItem value="medium">متوسط</SelectItem>
                              <SelectItem value="low">پایین</SelectItem>
                            </SelectContent>
                          </Select>

                          {/* Actions Menu */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handlePreviewTicket(ticket)}>
                                <Eye className="w-4 h-4 ml-2" />
                                مشاهده جزئیات
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 ml-2" />
                                ویرایش
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteTicket(ticket.id)} className="text-red-600">
                                <Trash2 className="w-4 h-4 ml-2" />
                                حذف
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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
              {/* Basic Info */}
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
                    <h4 className="font-medium mb-2">اطلاعات ارسال‌کننده:</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="text-gray-600">نام:</span> {getDisplayName(selectedTicket.clientName)}
                      </p>
                      <p>
                        <span className="text-gray-600">ایمیل:</span>{" "}
                        {safeString(selectedTicket.clientEmail) || "نامشخص"}
                      </p>
                      <p>
                        <span className="text-gray-600">تاریخ ارسال:</span> {formatDate(selectedTicket.createdAt)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">اطلاعات واگذاری:</h4>
                    <div className="space-y-1 text-sm">
                      {selectedTicket.assignedTechnicianName ? (
                        <>
                          <p>
                            <span className="text-gray-600">تکنسین:</span>{" "}
                            {getDisplayName(selectedTicket.assignedTechnicianName)}
                          </p>
                          <p>
                            <span className="text-gray-600">وضعیت:</span> {getStatusLabel(selectedTicket.status)}
                          </p>
                        </>
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
                              <AvatarFallback className="text-xs">{getAvatarFallback(response.author)}</AvatarFallback>
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

          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewDialogOpen(false)}>
              بستن
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
