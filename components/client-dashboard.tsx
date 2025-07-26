"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TwoStepTicketForm } from "./two-step-ticket-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Plus, Ticket, Clock, CheckCircle, AlertCircle, Eye, MessageSquare } from "lucide-react"

interface ClientDashboardProps {
  tickets: any[]
  onTicketCreate: (ticket: any) => void
  currentUser: any
  categoriesData: any
}

export function ClientDashboard({ tickets, onTicketCreate, currentUser, categoriesData }: ClientDashboardProps) {
  const [activeTab, setActiveTab] = useState("my-tickets")
  const [newTicketDialog, setNewTicketDialog] = useState(false)
  const [previewTicket, setPreviewTicket] = useState<any>(null)

  // Filter tickets for current user
  const userTickets = tickets.filter((ticket) => ticket.clientEmail === currentUser.email)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-500"
      case "in-progress":
        return "bg-yellow-500"
      case "resolved":
        return "bg-green-500"
      case "closed":
        return "bg-gray-500"
      default:
        return "bg-gray-400"
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
        return "بسته"
      default:
        return status
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-400"
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
        return "کم"
      default:
        return priority
    }
  }

  const handleTicketSubmit = (ticketData: any) => {
    onTicketCreate(ticketData)
    setNewTicketDialog(false)
  }

  const stats = {
    total: userTickets.length,
    open: userTickets.filter((t) => t.status === "open").length,
    inProgress: userTickets.filter((t) => t.status === "in-progress").length,
    resolved: userTickets.filter((t) => t.status === "resolved").length,
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div className="text-right">
          <h1 className="text-3xl font-bold">پنل کاربری</h1>
          <p className="text-muted-foreground">مدیریت تیکت‌ها و درخواست‌های شما</p>
        </div>
        <Dialog open={newTicketDialog} onOpenChange={setNewTicketDialog}>
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
            <TwoStepTicketForm
              onSubmit={handleTicketSubmit}
              currentUser={currentUser}
              categoriesData={categoriesData}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-tickets" className="gap-2">
            <Ticket className="w-4 h-4" />
            تیکت‌های من
          </TabsTrigger>
          <TabsTrigger value="create-ticket" className="gap-2">
            <Plus className="w-4 h-4" />
            ایجاد تیکت
          </TabsTrigger>
        </TabsList>

        <TabsContent value="my-tickets" className="space-y-6">
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-right">کل تیکت‌ها</CardTitle>
                <Ticket className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-right">{stats.total}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-right">باز</CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-right text-blue-600">{stats.open}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-right">در حال انجام</CardTitle>
                <AlertCircle className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-right text-yellow-600">{stats.inProgress}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-right">حل شده</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-right text-green-600">{stats.resolved}</div>
              </CardContent>
            </Card>
          </div>

          {/* Tickets List */}
          <Card>
            <CardHeader>
              <CardTitle className="text-right">تیکت‌های شما</CardTitle>
            </CardHeader>
            <CardContent>
              {userTickets.length === 0 ? (
                <div className="text-center py-8">
                  <Ticket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">هنوز تیکتی ثبت نکرده‌اید</p>
                  <Button variant="outline" className="mt-4 bg-transparent" onClick={() => setNewTicketDialog(true)}>
                    ایجاد اولین تیکت
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userTickets.map((ticket) => (
                    <div key={ticket.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div className="text-right flex-1">
                          <h3 className="font-semibold text-lg">{ticket.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            تیکت #{ticket.id} • {new Date(ticket.createdAt).toLocaleDateString("fa-IR")}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={`${getPriorityColor(ticket.priority)} text-white`}>
                            {getPriorityLabel(ticket.priority)}
                          </Badge>
                          <Badge className={`${getStatusColor(ticket.status)} text-white`}>
                            {getStatusLabel(ticket.status)}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 text-right">
                        {ticket.description.length > 150
                          ? `${ticket.description.substring(0, 150)}...`
                          : ticket.description}
                      </p>

                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground text-right">
                          {ticket.assignedTechnicianName ? (
                            <span>تخصیص یافته به: {ticket.assignedTechnicianName}</span>
                          ) : (
                            <span>در انتظار تخصیص</span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPreviewTicket(ticket)}
                            className="gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            مشاهده
                          </Button>
                          {ticket.responses.length > 0 && (
                            <Badge variant="secondary" className="gap-1">
                              <MessageSquare className="w-3 h-3" />
                              {ticket.responses.length}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create-ticket">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">ایجاد تیکت جدید</CardTitle>
            </CardHeader>
            <CardContent>
              <TwoStepTicketForm
                onSubmit={handleTicketSubmit}
                currentUser={currentUser}
                categoriesData={categoriesData}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Ticket Preview Dialog */}
      <Dialog open={!!previewTicket} onOpenChange={() => setPreviewTicket(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">جزئیات تیکت #{previewTicket?.id}</DialogTitle>
          </DialogHeader>
          {previewTicket && (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="text-right">
                  <h2 className="text-xl font-bold">{previewTicket.title}</h2>
                  <p className="text-sm text-muted-foreground">
                    ایجاد شده در {new Date(previewTicket.createdAt).toLocaleDateString("fa-IR")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Badge className={`${getPriorityColor(previewTicket.priority)} text-white`}>
                    {getPriorityLabel(previewTicket.priority)}
                  </Badge>
                  <Badge className={`${getStatusColor(previewTicket.status)} text-white`}>
                    {getStatusLabel(previewTicket.status)}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 text-right">شرح مشکل</h3>
                  <p className="text-sm text-right bg-muted/50 p-3 rounded-lg">{previewTicket.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-right">
                    <h4 className="font-medium text-sm text-muted-foreground">دسته‌بندی</h4>
                    <p className="text-sm">{previewTicket.category}</p>
                  </div>
                  <div className="text-right">
                    <h4 className="font-medium text-sm text-muted-foreground">زیردسته</h4>
                    <p className="text-sm">{previewTicket.subcategory}</p>
                  </div>
                </div>

                {previewTicket.assignedTechnicianName && (
                  <div className="text-right">
                    <h4 className="font-medium text-sm text-muted-foreground">تکنسین مسئول</h4>
                    <p className="text-sm">{previewTicket.assignedTechnicianName}</p>
                  </div>
                )}

                {previewTicket.responses.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 text-right">پاسخ‌های تکنسین</h3>
                    <div className="space-y-3">
                      {previewTicket.responses.map((response: any, index: number) => (
                        <div key={index} className="bg-muted/50 p-3 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-sm font-medium text-right">{response.technicianName}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(response.timestamp).toLocaleDateString("fa-IR")}
                            </p>
                          </div>
                          <p className="text-sm text-right">{response.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
