"use client"

import React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { TwoStepTicketForm } from "./two-step-ticket-form"
import {
  Plus,
  Search,
  Eye,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  MessageSquare,
  Calendar,
  User,
  Mail,
  HardDrive,
  ComputerIcon as Software,
  Network,
  Shield,
  Key,
  FileText,
} from "lucide-react"

const statusColors = {
  open: "bg-red-100 text-red-800 border-red-200",
  "in-progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
  resolved: "bg-green-100 text-green-800 border-green-200",
  closed: "bg-gray-100 text-gray-800 border-gray-200",
}

const statusLabels = {
  open: "باز",
  "in-progress": "در حال انجام",
  resolved: "حل شده",
  closed: "بسته",
}

const statusIcons = {
  open: AlertCircle,
  "in-progress": Clock,
  resolved: CheckCircle,
  closed: XCircle,
}

const priorityColors = {
  low: "bg-blue-100 text-blue-800 border-blue-200",
  medium: "bg-orange-100 text-orange-800 border-orange-200",
  high: "bg-red-100 text-red-800 border-red-200",
  urgent: "bg-purple-100 text-purple-800 border-purple-200",
}

const priorityLabels = {
  low: "کم",
  medium: "متوسط",
  high: "بالا",
  urgent: "فوری",
}

const categoryIcons = {
  hardware: HardDrive,
  software: Software,
  network: Network,
  email: Mail,
  security: Shield,
  access: Key,
}

const categoryLabels = {
  hardware: "سخت‌افزار",
  software: "نرم‌افزار",
  network: "شبکه",
  email: "ایمیل",
  security: "امنیت",
  access: "دسترسی",
}

interface ClientDashboardProps {
  tickets: any[]
  onTicketCreate: (ticket: any) => void
  currentUser: any
  categories: any
}

export function ClientDashboard({ tickets, onTicketCreate, currentUser, categories }: ClientDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [createTicketDialogOpen, setCreateTicketDialogOpen] = useState(false)

  // Filter user's tickets
  const userTickets = tickets.filter((ticket) => ticket.clientEmail === currentUser?.email)

  // Apply search and filters
  const filteredTickets = userTickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus
    const matchesPriority = filterPriority === "all" || ticket.priority === filterPriority

    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleViewTicket = (ticket: any) => {
    setSelectedTicket(ticket)
    setViewDialogOpen(true)
  }

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString("fa-IR"),
      time: date.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" }),
    }
  }

  const getStatusStats = () => {
    return {
      total: userTickets.length,
      open: userTickets.filter((t) => t.status === "open").length,
      inProgress: userTickets.filter((t) => t.status === "in-progress").length,
      resolved: userTickets.filter((t) => t.status === "resolved").length,
      closed: userTickets.filter((t) => t.status === "closed").length,
    }
  }

  const stats = getStatusStats()

  return (
    <div className="space-y-6 font-iran" dir="rtl">
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="text-right">
              <CardTitle className="text-2xl font-iran text-blue-900">خوش آمدید، {currentUser?.name}</CardTitle>
              <p className="text-blue-700 font-iran mt-2">پنل مدیریت درخواست‌های شما</p>
            </div>
            <Dialog open={createTicketDialogOpen} onOpenChange={setCreateTicketDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 font-iran bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                  ایجاد تیکت جدید
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto font-iran" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="text-right font-iran text-xl">ایجاد تیکت جدید</DialogTitle>
                </DialogHeader>
                <TwoStepTicketForm
                  onSubmit={(ticket) => {
                    onTicketCreate(ticket)
                    setCreateTicketDialogOpen(false)
                  }}
                  categories={categories}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600 font-iran">{stats.total}</div>
            <div className="text-sm text-muted-foreground font-iran">کل تیکت‌ها</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600 font-iran">{stats.open}</div>
            <div className="text-sm text-muted-foreground font-iran">باز</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600 font-iran">{stats.inProgress}</div>
            <div className="text-sm text-muted-foreground font-iran">در حال انجام</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600 font-iran">{stats.resolved}</div>
            <div className="text-sm text-muted-foreground font-iran">حل شده</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600 font-iran">{stats.closed}</div>
            <div className="text-sm text-muted-foreground font-iran">بسته</div>
          </CardContent>
        </Card>
      </div>

      {/* Tickets List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-right font-iran">تیکت‌های شما</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="جستجو در تیکت‌ها..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 text-right font-iran w-64"
                  dir="rtl"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus} dir="rtl">
                <SelectTrigger className="w-32 text-right font-iran">
                  <SelectValue placeholder="وضعیت" />
                </SelectTrigger>
                <SelectContent className="font-iran">
                  <SelectItem value="all">همه</SelectItem>
                  <SelectItem value="open">باز</SelectItem>
                  <SelectItem value="in-progress">در حال انجام</SelectItem>
                  <SelectItem value="resolved">حل شده</SelectItem>
                  <SelectItem value="closed">بسته</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterPriority} onValueChange={setFilterPriority} dir="rtl">
                <SelectTrigger className="w-32 text-right font-iran">
                  <SelectValue placeholder="اولویت" />
                </SelectTrigger>
                <SelectContent className="font-iran">
                  <SelectItem value="all">همه</SelectItem>
                  <SelectItem value="urgent">فوری</SelectItem>
                  <SelectItem value="high">بالا</SelectItem>
                  <SelectItem value="medium">متوسط</SelectItem>
                  <SelectItem value="low">کم</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTickets.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium font-iran mb-2">هیچ تیکتی یافت نشد</h3>
              <p className="text-muted-foreground font-iran mb-4">
                {userTickets.length === 0 ? "شما هنوز هیچ تیکتی ایجاد نکرده‌اید" : "تیکتی با این فیلترها یافت نشد"}
              </p>
              <Dialog open={createTicketDialogOpen} onOpenChange={setCreateTicketDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 font-iran">
                    <Plus className="w-4 h-4" />
                    ایجاد اولین تیکت
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto font-iran" dir="rtl">
                  <DialogHeader>
                    <DialogTitle className="text-right font-iran text-xl">ایجاد تیکت جدید</DialogTitle>
                  </DialogHeader>
                  <TwoStepTicketForm
                    onSubmit={(ticket) => {
                      onTicketCreate(ticket)
                      setCreateTicketDialogOpen(false)
                    }}
                    categories={categories}
                  />
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTickets.map((ticket) => {
                const CategoryIcon = categoryIcons[ticket.category]
                const StatusIcon = statusIcons[ticket.status]
                const createdDate = formatDateTime(ticket.createdAt)

                return (
                  <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 text-right">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg font-iran">{ticket.title}</h3>
                            <Badge className={`${statusColors[ticket.status]} font-iran text-xs`}>
                              <StatusIcon className="w-3 h-3 ml-1" />
                              {statusLabels[ticket.status]}
                            </Badge>
                            <Badge className={`${priorityColors[ticket.priority]} font-iran text-xs`}>
                              {priorityLabels[ticket.priority]}
                            </Badge>
                          </div>
                          <p className="text-muted-foreground text-sm font-iran mb-3 line-clamp-2">
                            {ticket.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              <span className="font-iran">{ticket.id}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CategoryIcon className="w-3 h-3" />
                              <span className="font-iran">{categoryLabels[ticket.category]}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span className="font-iran">{createdDate.date}</span>
                            </div>
                            {ticket.assignedTechnicianName && (
                              <div className="flex items-center gap-1">
                                <User className="w-3 h-3" />
                                <span className="font-iran">{ticket.assignedTechnicianName}</span>
                              </div>
                            )}
                            {ticket.responses && ticket.responses.length > 0 && (
                              <div className="flex items-center gap-1">
                                <MessageSquare className="w-3 h-3" />
                                <span className="font-iran">{ticket.responses.length} پاسخ</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewTicket(ticket)}
                            className="gap-1 font-iran hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye className="w-3 h-3" />
                            مشاهده
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Ticket Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto font-iran" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right font-iran text-xl">جزئیات تیکت {selectedTicket?.id}</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-6">
              {/* Ticket Header */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="text-right">
                    <h2 className="text-xl font-bold font-iran text-gray-900 mb-2">{selectedTicket.title}</h2>
                    <div className="flex gap-2 items-center">
                      <Badge className={`${statusColors[selectedTicket.status]} font-iran`}>
                        {React.createElement(statusIcons[selectedTicket.status], { className: "w-4 h-4 ml-1" })}
                        {statusLabels[selectedTicket.status]}
                      </Badge>
                      <Badge className={`${priorityColors[selectedTicket.priority]} font-iran`}>
                        {priorityLabels[selectedTicket.priority]}
                      </Badge>
                      <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border">
                        {React.createElement(categoryIcons[selectedTicket.category], { className: "w-4 h-4" })}
                        <span className="text-sm font-iran">{categoryLabels[selectedTicket.category]}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-left bg-white p-3 rounded border shadow-sm">
                    <p className="text-xs text-muted-foreground font-iran">شماره تیکت</p>
                    <p className="font-mono text-lg font-bold text-blue-600">{selectedTicket.id}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-right font-iran">شرح مشکل</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 border rounded p-3">
                    <p className="whitespace-pre-wrap text-right font-iran">{selectedTicket.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Responses */}
              {selectedTicket.responses && selectedTicket.responses.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-right font-iran">پاسخ‌ها و به‌روزرسانی‌ها</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedTicket.responses.map((response: any, index: number) => {
                        const responseDateTime = formatDateTime(response.timestamp)
                        const StatusIcon = statusIcons[response.status]

                        return (
                          <div key={index} className="border rounded p-4 bg-white">
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-2">
                                <Avatar className="w-8 h-8">
                                  <AvatarFallback className="text-sm font-iran">
                                    {response.technicianName?.charAt(0) || "T"}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="text-right">
                                  <p className="font-medium text-sm font-iran">{response.technicianName}</p>
                                  <p className="text-xs text-muted-foreground font-iran">تکنسین</p>
                                </div>
                              </div>
                              <div className="text-left">
                                <Badge className={`${statusColors[response.status]} font-iran text-xs`}>
                                  <StatusIcon className="w-3 h-3 ml-1" />
                                  {statusLabels[response.status]}
                                </Badge>
                                <div className="text-xs text-muted-foreground font-iran mt-1">
                                  <div>{responseDateTime.date}</div>
                                  <div>{responseDateTime.time}</div>
                                </div>
                              </div>
                            </div>
                            <div className="bg-blue-50 border border-blue-200 rounded p-3">
                              <p className="whitespace-pre-wrap text-right font-iran text-sm">{response.message}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Ticket Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-right font-iran">اطلاعات تیکت</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-iran">دسته‌بندی:</span>
                      <span className="font-iran">{categoryLabels[selectedTicket.category]}</span>
                    </div>
                    {selectedTicket.subcategory && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground font-iran">زیر دسته:</span>
                        <span className="font-iran">{selectedTicket.subcategory}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-iran">تاریخ ایجاد:</span>
                      <span className="font-iran">{formatDateTime(selectedTicket.createdAt).date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-iran">آخرین به‌روزرسانی:</span>
                      <span className="font-iran">{formatDateTime(selectedTicket.updatedAt).date}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-right font-iran">تکنسین مسئول</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedTicket.assignedTechnicianName ? (
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="font-iran">
                            {selectedTicket.assignedTechnicianName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-right">
                          <p className="font-medium font-iran">{selectedTicket.assignedTechnicianName}</p>
                          <p className="text-sm text-muted-foreground font-iran">تکنسین مسئول</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <User className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground font-iran">تکنسین تعیین نشده</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
