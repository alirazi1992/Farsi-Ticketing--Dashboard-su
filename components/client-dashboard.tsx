"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { TwoStepTicketForm } from "@/components/two-step-ticket-form"
import { useAuth } from "@/lib/auth-context"
import {
  Plus,
  Search,
  Clock,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Eye,
  Calendar,
  User,
  Mail,
  Phone,
} from "lucide-react"

interface ClientDashboardProps {
  tickets: any[]
  categories: any
  onTicketSubmit: (ticketData: any) => void
}

export function ClientDashboard({ tickets, categories, onTicketSubmit }: ClientDashboardProps) {
  const { user } = useAuth()
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [isTicketDetailOpen, setIsTicketDetailOpen] = useState(false)

  // Filter tickets based on search and status
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Get user's tickets (if logged in)
  const userTickets = user ? filteredTickets.filter((ticket) => ticket.clientEmail === user.email) : filteredTickets

  const handleTicketSubmit = (ticketData: any) => {
    onTicketSubmit(ticketData)
    setIsNewTicketOpen(false)
  }

  const handleViewTicket = (ticket: any) => {
    setSelectedTicket(ticket)
    setIsTicketDetailOpen(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge variant="outline" className="gap-1">
            <Clock className="w-3 h-3" />
            باز
          </Badge>
        )
      case "in-progress":
        return (
          <Badge variant="default" className="gap-1">
            <AlertTriangle className="w-3 h-3" />
            در حال بررسی
          </Badge>
        )
      case "resolved":
        return (
          <Badge variant="secondary" className="gap-1">
            <CheckCircle className="w-3 h-3" />
            حل شده
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="destructive">فوری</Badge>
      case "high":
        return <Badge variant="default">بالا</Badge>
      case "medium":
        return <Badge variant="secondary">متوسط</Badge>
      case "low":
        return <Badge variant="outline">کم</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-right">پنل کاربری</h1>
          <p className="text-muted-foreground text-right">{user ? `خوش آمدید ${user.name}` : "مدیریت تیکت‌های شما"}</p>
        </div>
        <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              تیکت جدید
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-right">ثبت تیکت جدید</DialogTitle>
            </DialogHeader>
            <TwoStepTicketForm onTicketSubmit={handleTicketSubmit} categories={categories} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="my-tickets" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-tickets">تیکت‌های من</TabsTrigger>
          <TabsTrigger value="search">جستجو تیکت</TabsTrigger>
        </TabsList>

        <TabsContent value="my-tickets" className="space-y-6">
          {/* Search and Filter */}
          <Card>
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="جستجو در تیکت‌ها..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pr-10 text-right"
                      dir="rtl"
                    />
                  </div>
                </div>
                <div className="w-48">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full p-2 border rounded-md text-right"
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
          <div className="grid gap-4">
            {userTickets.length > 0 ? (
              userTickets.map((ticket) => (
                <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-right">{ticket.title}</h3>
                          {getStatusBadge(ticket.status)}
                          {getPriorityBadge(ticket.priority)}
                        </div>
                        <p className="text-sm text-muted-foreground text-right">شماره تیکت: {ticket.id}</p>
                        <p className="text-sm text-right line-clamp-2">{ticket.description}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(ticket.createdAt).toLocaleDateString("fa-IR")}
                          </div>
                          {ticket.assignedTo && (
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              تخصیص داده شده به: {ticket.assignedTo}
                            </div>
                          )}
                          {ticket.responses && ticket.responses.length > 0 && (
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" />
                              {ticket.responses.length} پاسخ
                            </div>
                          )}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleViewTicket(ticket)} className="gap-2">
                        <Eye className="w-4 h-4" />
                        مشاهده
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">هیچ تیکتی یافت نشد</h3>
                  <p className="text-muted-foreground mb-4">
                    {user ? "شما هنوز هیچ تیکتی ثبت نکرده‌اید" : "برای مشاهده تیکت‌ها وارد شوید"}
                  </p>
                  <Button onClick={() => setIsNewTicketOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    ثبت اولین تیکت
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="search" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">جستجو و پیگیری تیکت</CardTitle>
              <CardDescription className="text-right">
                با شماره تیکت و اطلاعات تماس خود، وضعیت تیکت را پیگیری کنید
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ticketId" className="text-right">
                    شماره تیکت
                  </Label>
                  <Input id="ticketId" placeholder="TK-2024-001" className="text-right" dir="rtl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-right">
                    ایمیل
                  </Label>
                  <Input id="email" type="email" placeholder="example@company.com" className="text-right" dir="rtl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-right">
                    شماره تماس
                  </Label>
                  <Input id="phone" placeholder="09123456789" className="text-right" dir="rtl" />
                </div>
              </div>
              <Button className="w-full">
                <Search className="w-4 h-4 mr-2" />
                جستجو
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Ticket Detail Dialog */}
      <Dialog open={isTicketDetailOpen} onOpenChange={setIsTicketDetailOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-right">جزئیات تیکت</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-6" dir="rtl">
              {/* Ticket Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h2 className="text-xl font-bold text-right">{selectedTicket.title}</h2>
                  <p className="text-muted-foreground text-right">شماره تیکت: {selectedTicket.id}</p>
                  <div className="flex gap-2">
                    {getStatusBadge(selectedTicket.status)}
                    {getPriorityBadge(selectedTicket.priority)}
                  </div>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <div className="flex items-center gap-1 mb-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(selectedTicket.createdAt).toLocaleDateString("fa-IR")}
                  </div>
                  {selectedTicket.assignedTo && (
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      تکنسین: {selectedTicket.assignedTo}
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Ticket Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-right">اطلاعات درخواست‌کننده</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>{selectedTicket.clientName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{selectedTicket.clientEmail}</span>
                    </div>
                    {selectedTicket.clientPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{selectedTicket.clientPhone}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-right">دسته‌بندی</h3>
                  <div className="space-y-2">
                    <p>
                      <strong>دسته اصلی:</strong> {selectedTicket.category}
                    </p>
                    <p>
                      <strong>زیردسته:</strong> {selectedTicket.subCategory}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div className="space-y-4">
                <h3 className="font-semibold text-right">شرح مشکل</h3>
                <p className="text-right whitespace-pre-wrap">{selectedTicket.description}</p>
              </div>

              {/* Attachments */}
              {selectedTicket.attachments && selectedTicket.attachments.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="font-semibold text-right">فایل‌های پیوست</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {selectedTicket.attachments.map((file: any, index: number) => (
                        <div key={index} className="flex items-center gap-2 p-2 border rounded">
                          <span className="text-sm">{file.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Responses */}
              {selectedTicket.responses && selectedTicket.responses.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h3 className="font-semibold text-right">پاسخ‌ها و به‌روزرسانی‌ها</h3>
                    <div className="space-y-4">
                      {selectedTicket.responses.map((response: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{response.author}</span>
                            <span className="text-sm text-muted-foreground">
                              {new Date(response.timestamp).toLocaleDateString("fa-IR")}
                            </span>
                          </div>
                          <p className="text-right whitespace-pre-wrap">{response.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
