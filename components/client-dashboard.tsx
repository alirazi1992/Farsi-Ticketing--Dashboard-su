"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserMenu } from "@/components/user-menu"
import { TwoStepTicketForm } from "@/components/two-step-ticket-form"
import { useAuth } from "@/lib/auth-context"
import { useTickets } from "@/lib/ticket-context"
import { Plus, Ticket, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function ClientDashboard() {
  const { user } = useAuth()
  const { tickets, getTicketsByClient } = useTickets()
  const [showTicketForm, setShowTicketForm] = useState(false)

  const userTickets = user ? getTicketsByClient(user.id) : []

  const getStatusBadge = (status: string) => {
    const statusMap = {
      open: { label: "باز", variant: "destructive" as const },
      "in-progress": { label: "در حال انجام", variant: "default" as const },
      resolved: { label: "حل شده", variant: "secondary" as const },
      closed: { label: "بسته", variant: "outline" as const },
    }
    return statusMap[status as keyof typeof statusMap] || { label: status, variant: "default" as const }
  }

  const getPriorityBadge = (priority: string) => {
    const priorityMap = {
      low: { label: "کم", variant: "outline" as const },
      medium: { label: "متوسط", variant: "secondary" as const },
      high: { label: "بالا", variant: "destructive" as const },
      urgent: { label: "فوری", variant: "destructive" as const },
    }
    return priorityMap[priority as keyof typeof priorityMap] || { label: priority, variant: "default" as const }
  }

  const stats = {
    total: userTickets.length,
    open: userTickets.filter((t) => t.status === "open").length,
    inProgress: userTickets.filter((t) => t.status === "in-progress").length,
    resolved: userTickets.filter((t) => t.status === "resolved").length,
  }

  return (
    <div className="min-h-screen bg-gray-50 font-iran" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4 space-x-reverse">
              <h1 className="text-xl font-semibold text-gray-900 font-iran">داشبورد کاربر</h1>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <Dialog open={showTicketForm} onOpenChange={setShowTicketForm}>
                <DialogTrigger asChild>
                  <Button className="font-iran">
                    <Plus className="ml-2 h-4 w-4" />
                    تیکت جدید
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto font-iran" dir="rtl">
                  <DialogHeader>
                    <DialogTitle className="font-iran text-right">ایجاد تیکت جدید</DialogTitle>
                  </DialogHeader>
                  <TwoStepTicketForm onClose={() => setShowTicketForm(false)} />
                </DialogContent>
              </Dialog>
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-iran">کل تیکت‌ها</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-iran">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-iran">باز</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 font-iran">{stats.open}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-iran">در حال انجام</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 font-iran">{stats.inProgress}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium font-iran">حل شده</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 font-iran">{stats.resolved}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tickets List */}
        <Card>
          <CardHeader>
            <CardTitle className="font-iran">تیکت‌های من</CardTitle>
            <CardDescription className="font-iran">لیست تمام تیکت‌های شما</CardDescription>
          </CardHeader>
          <CardContent>
            {userTickets.length === 0 ? (
              <div className="text-center py-8">
                <Ticket className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 font-iran">هیچ تیکتی وجود ندارد</h3>
                <p className="mt-1 text-sm text-gray-500 font-iran">برای شروع، تیکت جدیدی ایجاد کنید</p>
                <div className="mt-6">
                  <Button onClick={() => setShowTicketForm(true)} className="font-iran">
                    <Plus className="ml-2 h-4 w-4" />
                    تیکت جدید
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {userTickets.map((ticket) => (
                  <div key={ticket.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 space-x-reverse mb-2">
                          <h3 className="text-lg font-medium text-gray-900 font-iran">{ticket.title}</h3>
                          <Badge variant={getStatusBadge(ticket.status).variant} className="font-iran">
                            {getStatusBadge(ticket.status).label}
                          </Badge>
                          <Badge variant={getPriorityBadge(ticket.priority).variant} className="font-iran">
                            {getPriorityBadge(ticket.priority).label}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-2 font-iran">{ticket.description}</p>
                        <div className="flex items-center space-x-4 space-x-reverse text-sm text-gray-500">
                          <span className="font-iran">دسته‌بندی: {ticket.category}</span>
                          {ticket.assignedTechnicianName && (
                            <span className="font-iran">تکنسین: {ticket.assignedTechnicianName}</span>
                          )}
                          <span className="font-iran">ایجاد شده: {ticket.createdAt.toLocaleDateString("fa-IR")}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
