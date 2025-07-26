"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TwoStepTicketForm } from "@/components/two-step-ticket-form"
import { useTickets } from "@/lib/ticket-context"
import { useAuth } from "@/lib/auth-context"
import { toast } from "@/hooks/use-toast"
import {
  Plus,
  Search,
  Clock,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Calendar,
  User,
  Mail,
  Phone,
  Building,
  Ticket,
  Eye,
  LogOut,
} from "lucide-react"

interface ClientDashboardProps {
  onLogout: () => void
}

export function ClientDashboard({ onLogout }: ClientDashboardProps) {
  const { user } = useAuth()
  const { tickets, addTicket, getTicketsByUser } = useTickets()
  const [showNewTicketDialog, setShowNewTicketDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [showTicketDetails, setShowTicketDetails] = useState(false)

  // Get user's tickets
  const userTickets = user ? getTicketsByUser(user.email) : []

  // Filter tickets based on search and status
  const filteredTickets = userTickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || ticket.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  // Statistics
  const stats = {
    total: userTickets.length,
    open: userTickets.filter((t) => t.status === "open").length,
    inProgress: userTickets.filter((t) => t.status === "in-progress").length,
    resolved: userTickets.filter((t) => t.status === "resolved").length,
  }

  const handleNewTicket = (ticketData: any) => {
    if (!user) return

    const newTicket = {
      ...ticketData,
      category: ticketData.mainIssue,
      clientName: user.name,
      clientEmail: user.email,
      clientPhone: ticketData.clientPhone || user.phone || "",
      clientDepartment: user.department || "",
      assignedTo: null,
      assignedTechnicianName: null,
    }

    addTicket(newTicket)
    setShowNewTicketDialog(false)

    toast({
      title: "تیکت با موفقیت ثبت شد",
      description: `تیکت شما با شماره ${newTicket.id} ثبت گردید و به زودی بررسی خواهد شد.`,
    })
  }

  const handleViewTicket = (ticket: any) => {
    setSelectedTicket(ticket)
    setShowTicketDetails(true)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { label: "باز", color: "bg-blue-100 text-blue-800", icon: AlertCircle },
      "in-progress": { label: "در حال بررسی", color: "bg-yellow-100 text-yellow-800", icon: Clock },
      resolved: { label: "حل شده", color: "bg-green-100 text-green-800", icon: CheckCircle },
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    const IconComponent = config.icon
    return (
      <Badge className={`${config.color} gap-1 font-iran`}>
        <IconComponent className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { label: "کم", color: "bg-gray-100 text-gray-800" },
      medium: { label: "متوسط", color: "bg-yellow-100 text-yellow-800" },
      high: { label: "بالا", color: "bg-orange-100 text-orange-800" },
      urgent: { label: "فوری", color: "bg-red-100 text-red-800" },
    }
    const config = priorityConfig[priority as keyof typeof priorityConfig]
    return <Badge className={`${config.color} font-iran`}>{config.label}</Badge>
  }

  const getCategoryLabel = (category: string) => {
    const categories: { [key: string]: string } = {
      hardware: "سخت‌افزار",
      software: "نرم‌افزار",
      network: "شبکه",
      email: "ایمیل",
      security: "امنیت",
      access: "دسترسی",
      training: "آموزش",
      maintenance: "نگهداری",
    }
    return categories[category] || category
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-iran" dir="rtl">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <User className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-right font-iran">پنل کاربری</h1>
                  <p className="text-sm text-muted-foreground text-right font-iran">خوش آمدید، {user?.name}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowNewTicketDialog(true)}
                className="gap-2 bg-blue-600 hover:bg-blue-700 font-iran"
              >
                <Plus className="w-4 h-4" />
                تیکت جدید
              </Button>
              <Button variant="outline" size="sm" onClick={onLogout} className="gap-2 bg-transparent font-iran">
                <LogOut className="w-4 h-4" />
                خروج
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 space-y-6">
        {/* User Info Card */}
        {user && (
          <Card className="border-r-4 border-r-blue-500" dir="rtl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-xl text-gray-900 font-iran">{user.name}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mt-2">
                    <div className="flex items-center gap-2 justify-end">
                      <span className="font-iran">{user.email}</span>
                      <Mail className="w-4 h-4 text-blue-500" />
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2 justify-end">
                        <span className="font-iran">{user.phone}</span>
                        <Phone className="w-4 h-4 text-green-500" />
                      </div>
                    )}
                    {user.department && (
                      <div className="flex items-center gap-2 justify-end">
                        <span className="font-iran">{user.department}</span>
                        <Building className="w-4 h-4 text-purple-500" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 justify-end">
                <div className="text-right">
                  <p className="text-2xl font-bold font-iran">{stats.total}</p>
                  <p className="text-sm opacity-90 font-iran">کل تیکت‌ها</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Ticket className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 justify-end">
                <div className="text-right">
                  <p className="text-2xl font-bold font-iran">{stats.open}</p>
                  <p className="text-sm opacity-90 font-iran">باز</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 justify-end">
                <div className="text-right">
                  <p className="text-2xl font-bold font-iran">{stats.inProgress}</p>
                  <p className="text-sm opacity-90 font-iran">در حال بررسی</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 justify-end">
                <div className="text-right">
                  <p className="text-2xl font-bold font-iran">{stats.resolved}</p>
                  <p className="text-sm opacity-90 font-iran">حل شده</p>
                </div>
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card dir="rtl">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="جستجو در تیکت‌ها..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pr-10 text-right font-iran"
                    dir="rtl"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm text-right font-iran"
                  dir="rtl"
                >
                  <option value="all">همه وضعیت‌ها</option>
                  <option value="open">باز</option>
                  <option value="in-progress">در حال بررسی</option>
                  <option value="resolved">حل شده</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tickets List */}
        <Card dir="rtl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-right font-iran">
              <MessageSquare className="w-5 h-5" />
              تیکت‌های شما ({filteredTickets.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTickets.length === 0 ? (
              <div className="text-center py-12">
                <Ticket className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 font-iran">هیچ تیکتی یافت نشد</h3>
                <p className="text-gray-500 mb-4 font-iran">
                  {userTickets.length === 0 ? "شما هنوز هیچ تیکتی ثبت نکرده‌اید" : "تیکتی با فیلترهای انتخابی یافت نشد"}
                </p>
                {userTickets.length === 0 && (
                  <Button onClick={() => setShowNewTicketDialog(true)} variant="outline" className="gap-2 font-iran">
                    <Plus className="w-4 h-4" />
                    ایجاد اولین تیکت
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-all duration-200 bg-white"
                    dir="rtl"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 justify-end">
                          <Badge variant="outline" className="font-iran">
                            {getCategoryLabel(ticket.category)}
                          </Badge>
                          {getPriorityBadge(ticket.priority)}
                          {getStatusBadge(ticket.status)}
                          <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded font-iran">{ticket.id}</span>
                        </div>
                        <h3 className="font-bold text-lg mb-2 text-right font-iran">{ticket.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2 text-right font-iran">{ticket.description}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewTicket(ticket)}
                        className="gap-2 font-iran"
                      >
                        <Eye className="w-4 h-4" />
                        مشاهده جزئیات
                      </Button>
                      <div className="flex items-center gap-4">
                        {ticket.assignedTechnicianName && (
                          <div className="flex items-center gap-1">
                            <span className="font-iran">{ticket.assignedTechnicianName}</span>
                            <User className="w-4 h-4" />
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <span className="font-iran">{ticket.responses.length} پاسخ</span>
                          <MessageSquare className="w-4 h-4" />
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-iran">{formatDate(ticket.createdAt)}</span>
                          <Calendar className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* New Ticket Dialog */}
        <Dialog open={showNewTicketDialog} onOpenChange={setShowNewTicketDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto font-iran" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-right font-iran">ایجاد تیکت جدید</DialogTitle>
            </DialogHeader>
            <TwoStepTicketForm onSubmit={handleNewTicket} onCancel={() => setShowNewTicketDialog(false)} />
          </DialogContent>
        </Dialog>

        {/* Ticket Details Dialog */}
        <Dialog open={showTicketDetails} onOpenChange={setShowTicketDetails}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto font-iran" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-right flex items-center gap-2 font-iran">
                <Ticket className="w-5 h-5" />
                جزئیات تیکت {selectedTicket?.id}
              </DialogTitle>
            </DialogHeader>
            {selectedTicket && (
              <div className="space-y-6" dir="rtl">
                {/* Ticket Header */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 justify-end mb-3">
                    <Badge variant="outline" className="font-iran">
                      {getCategoryLabel(selectedTicket.category)}
                    </Badge>
                    {getPriorityBadge(selectedTicket.priority)}
                    {getStatusBadge(selectedTicket.status)}
                  </div>
                  <h3 className="font-bold text-xl mb-2 text-right font-iran">{selectedTicket.title}</h3>
                  <p className="text-gray-600 text-right font-iran">{selectedTicket.description}</p>
                </div>

                {/* Ticket Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-500 font-iran">تاریخ ایجاد:</span>
                    <p className="text-right font-iran">{formatDate(selectedTicket.createdAt)}</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-sm font-medium text-gray-500 font-iran">آخرین به‌روزرسانی:</span>
                    <p className="text-right font-iran">{formatDate(selectedTicket.updatedAt)}</p>
                  </div>
                </div>

                {selectedTicket.assignedTechnicianName && (
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 justify-end mb-2">
                      <span className="font-medium font-iran">تکنسین مسئول:</span>
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="font-semibold text-blue-800 text-right font-iran">
                      {selectedTicket.assignedTechnicianName}
                    </p>
                  </div>
                )}

                {/* Responses */}
                {selectedTicket.responses && selectedTicket.responses.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 text-right flex items-center gap-2 font-iran">
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
                            <span className="text-xs text-gray-500 font-iran">{formatDate(response.timestamp)}</span>
                            <span className="font-semibold text-sm font-iran">{response.author}</span>
                          </div>
                          <p className="text-sm text-right font-iran">{response.text}</p>
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
    </div>
  )
}
