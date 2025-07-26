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
import { Plus, Search, Clock, CheckCircle, AlertCircle, MessageSquare, Calendar, User, Mail } from "lucide-react"

export function ClientDashboard() {
  const { user } = useAuth()
  const { tickets, addTicket, getTicketsByUser } = useTickets()
  const [showNewTicketDialog, setShowNewTicketDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")

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
      clientPhone: ticketData.clientPhone || "",
      clientDepartment: user.department || "",
      assignedTo: null,
      assignedTechnicianName: null,
    }

    addTicket(newTicket)
    setShowNewTicketDialog(false)
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { label: "باز", color: "bg-blue-100 text-blue-800" },
      "in-progress": { label: "در حال بررسی", color: "bg-yellow-100 text-yellow-800" },
      resolved: { label: "حل شده", color: "bg-green-100 text-green-800" },
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      low: { label: "کم", color: "bg-gray-100 text-gray-800" },
      medium: { label: "متوسط", color: "bg-yellow-100 text-yellow-800" },
      high: { label: "بالا", color: "bg-orange-100 text-orange-800" },
      urgent: { label: "فوری", color: "bg-red-100 text-red-800" },
    }
    const config = priorityConfig[priority as keyof typeof priorityConfig]
    return <Badge className={config.color}>{config.label}</Badge>
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">پنل کاربری</h1>
            <p className="text-gray-600 mt-1">مدیریت تیکت‌های پشتیبانی</p>
          </div>
          <Button onClick={() => setShowNewTicketDialog(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            تیکت جدید
          </Button>
        </div>

        {/* User Info Card */}
        {user && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{user.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                    <div className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {user.email}
                    </div>
                    {user.department && (
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {user.department}
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
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-gray-600">کل تیکت‌ها</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.open}</p>
                  <p className="text-sm text-gray-600">باز</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.inProgress}</p>
                  <p className="text-sm text-gray-600">در حال بررسی</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.resolved}</p>
                  <p className="text-sm text-gray-600">حل شده</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
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
              <div className="flex gap-2">
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
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
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              تیکت‌های شما ({filteredTickets.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTickets.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">هیچ تیکتی یافت نشد</p>
                <Button onClick={() => setShowNewTicketDialog(true)} variant="outline" className="mt-4">
                  ایجاد اولین تیکت
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{ticket.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{ticket.description}</p>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        {getStatusBadge(ticket.status)}
                        {getPriorityBadge(ticket.priority)}
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(ticket.createdAt)}
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {ticket.responses.length} پاسخ
                        </div>
                        {ticket.assignedTechnicianName && (
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {ticket.assignedTechnicianName}
                          </div>
                        )}
                      </div>
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{ticket.id}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* New Ticket Dialog */}
        <Dialog open={showNewTicketDialog} onOpenChange={setShowNewTicketDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-right">ایجاد تیکت جدید</DialogTitle>
            </DialogHeader>
            <TwoStepTicketForm onSubmit={handleNewTicket} onCancel={() => setShowNewTicketDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
