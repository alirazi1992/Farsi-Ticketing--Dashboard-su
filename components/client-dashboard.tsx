"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { TwoStepTicketForm } from "./two-step-ticket-form"
import { Plus, Ticket, Clock, CheckCircle, AlertCircle, Eye, Search } from "lucide-react"
import { toast } from "sonner"

interface ClientTicket {
  id: string
  title: string
  description: string
  priority: "low" | "medium" | "high" | "urgent"
  status: "open" | "in-progress" | "resolved" | "closed"
  category: string
  subcategory: string
  clientName: string
  clientEmail: string
  clientPhone: string
  department?: string
  assignedTo?: string
  createdAt: string
  updatedAt: string
  attachedFiles?: any[]
}

interface ClientDashboardProps {
  currentUser: any
  tickets: ClientTicket[]
  categoriesData: any[]
  onTicketSubmit: (ticketData: any) => void
}

export function ClientDashboard({ currentUser, tickets, categoriesData, onTicketSubmit }: ClientDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTicket, setSelectedTicket] = useState<ClientTicket | null>(null)
  const [isTicketDetailOpen, setIsTicketDetailOpen] = useState(false)

  // Filter tickets for current user
  const userTickets = tickets.filter((ticket) => ticket.clientEmail === currentUser?.email)

  // Filter tickets based on search term
  const filteredTickets = userTickets.filter(
    (ticket) =>
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Statistics
  const totalTickets = userTickets.length
  const openTickets = userTickets.filter((t) => t.status === "open").length
  const inProgressTickets = userTickets.filter((t) => t.status === "in-progress").length
  const resolvedTickets = userTickets.filter((t) => t.status === "resolved").length

  const handleTicketSubmit = (ticketData: any) => {
    onTicketSubmit(ticketData)
    setIsCreateTicketOpen(false)
    toast.success("تیکت شما با موفقیت ثبت شد")
  }

  const handleViewTicket = (ticket: ClientTicket) => {
    setSelectedTicket(ticket)
    setIsTicketDetailOpen(true)
  }

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
        return "bg-gray-500"
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
      case "low":
        return "bg-green-500"
      case "medium":
        return "bg-yellow-500"
      case "high":
        return "bg-orange-500"
      case "urgent":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "low":
        return "کم"
      case "medium":
        return "متوسط"
      case "high":
        return "بالا"
      case "urgent":
        return "فوری"
      default:
        return priority
    }
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">پنل کاربری</h1>
          <p className="text-muted-foreground">مدیریت تیکت‌ها و درخواست‌های پشتیبانی</p>
        </div>
        <Dialog open={isCreateTicketOpen} onOpenChange={setIsCreateTicketOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              ثبت تیکت جدید
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <DialogHeader>
              <DialogTitle>ثبت تیکت جدید</DialogTitle>
              <DialogDescription>لطفاً اطلاعات مربوط به مشکل خود را با دقت وارد کنید</DialogDescription>
            </DialogHeader>
            <TwoStepTicketForm
              onSubmit={handleTicketSubmit}
              currentUser={currentUser}
              categoriesData={categoriesData}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="gap-2">
            <AlertCircle className="w-4 h-4" />
            آمار کلی
          </TabsTrigger>
          <TabsTrigger value="tickets" className="gap-2">
            <Ticket className="w-4 h-4" />
            تیکت‌های من
          </TabsTrigger>
          <TabsTrigger value="create" className="gap-2">
            <Plus className="w-4 h-4" />
            ثبت تیکت
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">کل تیکت‌ها</CardTitle>
                <Ticket className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTickets}</div>
                <p className="text-xs text-muted-foreground">تعداد کل تیکت‌های شما</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">تیکت‌های باز</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{openTickets}</div>
                <p className="text-xs text-muted-foreground">در انتظار بررسی</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">در حال انجام</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inProgressTickets}</div>
                <p className="text-xs text-muted-foreground">در حال بررسی</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">حل شده</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{resolvedTickets}</div>
                <p className="text-xs text-muted-foreground">تیکت‌های حل شده</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>تیکت‌های اخیر</CardTitle>
              <CardDescription>آخرین تیکت‌های ثبت شده توسط شما</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {userTickets.slice(0, 5).map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{ticket.title}</div>
                      <div className="text-sm text-muted-foreground">{ticket.id}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(ticket.status)}`} />
                        <span className="text-sm">{getStatusLabel(ticket.status)}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleViewTicket(ticket)} className="gap-1">
                        <Eye className="w-3 h-3" />
                        مشاهده
                      </Button>
                    </div>
                  </div>
                ))}
                {userTickets.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">هنوز تیکتی ثبت نکرده‌اید</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="جستجو در تیکت‌ها..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {filteredTickets.map((ticket) => (
              <Card key={ticket.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{ticket.title}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {ticket.id}
                        </Badge>
                      </div>
                      <CardDescription className="mt-1">
                        {ticket.category} / {ticket.subcategory}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(ticket.priority)}`} />
                        <span className="text-sm">{getPriorityLabel(ticket.priority)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(ticket.status)}`} />
                        <span className="text-sm">{getStatusLabel(ticket.status)}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleViewTicket(ticket)} className="gap-1">
                        <Eye className="w-4 h-4" />
                        مشاهده
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{ticket.description}</p>
                  <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
                    <span>ایجاد شده: {new Date(ticket.createdAt).toLocaleDateString("fa-IR")}</span>
                    {ticket.assignedTo && <span>تخصیص یافته به: {ticket.assignedTo}</span>}
                  </div>
                </CardContent>
              </Card>
            ))}
            {filteredTickets.length === 0 && (
              <Card>
                <CardContent className="text-center py-8">
                  <div className="text-muted-foreground">
                    {searchTerm ? "تیکتی با این مشخصات یافت نشد" : "هنوز تیکتی ثبت نکرده‌اید"}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>ثبت تیکت جدید</CardTitle>
              <CardDescription>لطفاً اطلاعات مربوط به مشکل خود را با دقت وارد کنید</CardDescription>
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

      {/* Ticket Detail Dialog */}
      <Dialog open={isTicketDetailOpen} onOpenChange={setIsTicketDetailOpen}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>جزئیات تیکت</DialogTitle>
            <DialogDescription>اطلاعات کامل تیکت شما</DialogDescription>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">شماره تیکت</Label>
                  <div className="text-sm">{selectedTicket.id}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">وضعیت</Label>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedTicket.status)}`} />
                    <span className="text-sm">{getStatusLabel(selectedTicket.status)}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">اولویت</Label>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(selectedTicket.priority)}`} />
                    <span className="text-sm">{getPriorityLabel(selectedTicket.priority)}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">دسته‌بندی</Label>
                  <div className="text-sm">
                    {selectedTicket.category} / {selectedTicket.subcategory}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">عنوان</Label>
                <div className="text-sm mt-1">{selectedTicket.title}</div>
              </div>

              <div>
                <Label className="text-sm font-medium">شرح مشکل</Label>
                <div className="text-sm mt-1 p-3 bg-muted rounded-md">{selectedTicket.description}</div>
              </div>

              {selectedTicket.assignedTo && (
                <div>
                  <Label className="text-sm font-medium">تخصیص یافته به</Label>
                  <div className="text-sm">{selectedTicket.assignedTo}</div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">تاریخ ایجاد</Label>
                  <div className="text-sm">{new Date(selectedTicket.createdAt).toLocaleDateString("fa-IR")}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">آخرین بروزرسانی</Label>
                  <div className="text-sm">{new Date(selectedTicket.updatedAt).toLocaleDateString("fa-IR")}</div>
                </div>
              </div>

              {selectedTicket.attachedFiles && selectedTicket.attachedFiles.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">فایل‌های پیوست</Label>
                  <div className="space-y-2 mt-1">
                    {selectedTicket.attachedFiles.map((file, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-muted rounded">
                        <div className="text-sm">{file.name}</div>
                        <Badge variant="outline" className="text-xs">
                          {file.size}
                        </Badge>
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
