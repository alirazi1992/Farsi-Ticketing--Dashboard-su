"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Plus,
  Search,
  Filter,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Settings,
  LogOut,
  Send,
  Paperclip,
} from "lucide-react"
import { TwoStepTicketForm } from "./two-step-ticket-form"

interface Ticket {
  id: string
  title: string
  description: string
  status: "open" | "in-progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  category: string
  createdAt: string
  updatedAt: string
  assignedTo?: string
  messages: Array<{
    id: string
    sender: string
    message: string
    timestamp: string
    isUser: boolean
  }>
}

const mockTickets: Ticket[] = [
  {
    id: "1",
    title: "مشکل در اتصال به اینترنت",
    description: "اینترنت دفتر کار نمی‌کند",
    status: "open",
    priority: "high",
    category: "شبکه",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    assignedTo: "احمد محمدی",
    messages: [
      {
        id: "1",
        sender: "شما",
        message: "سلام، اینترنت دفتر از صبح قطع است",
        timestamp: "2024-01-15T10:30:00Z",
        isUser: true,
      },
      {
        id: "2",
        sender: "احمد محمدی",
        message: "سلام، در حال بررسی مشکل هستیم",
        timestamp: "2024-01-15T11:00:00Z",
        isUser: false,
      },
    ],
  },
  {
    id: "2",
    title: "درخواست نصب نرم‌افزار",
    description: "نیاز به نصب Adobe Photoshop",
    status: "in-progress",
    priority: "medium",
    category: "نرم‌افزار",
    createdAt: "2024-01-14T14:20:00Z",
    updatedAt: "2024-01-15T09:15:00Z",
    assignedTo: "مریم احمدی",
    messages: [
      {
        id: "1",
        sender: "شما",
        message: "لطفاً Adobe Photoshop را روی سیستم من نصب کنید",
        timestamp: "2024-01-14T14:20:00Z",
        isUser: true,
      },
    ],
  },
]

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
      return "bg-red-500 text-white"
    case "high":
      return "bg-orange-500 text-white"
    case "medium":
      return "bg-yellow-500 text-white"
    case "low":
      return "bg-green-500 text-white"
    default:
      return "bg-gray-500 text-white"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "open":
      return <AlertCircle className="h-4 w-4" />
    case "in-progress":
      return <Clock className="h-4 w-4" />
    case "resolved":
      return <CheckCircle className="h-4 w-4" />
    case "closed":
      return <CheckCircle className="h-4 w-4" />
    default:
      return <AlertCircle className="h-4 w-4" />
  }
}

export function ClientDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>(mockTickets)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false)

  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedTicket) return

    const updatedTicket = {
      ...selectedTicket,
      messages: [
        ...selectedTicket.messages,
        {
          id: Date.now().toString(),
          sender: "شما",
          message: newMessage,
          timestamp: new Date().toISOString(),
          isUser: true,
        },
      ],
    }

    setTickets(tickets.map((t) => (t.id === selectedTicket.id ? updatedTicket : t)))
    setSelectedTicket(updatedTicket)
    setNewMessage("")
  }

  const handleTicketCreate = (ticketData: any) => {
    const newTicket: Ticket = {
      id: Date.now().toString(),
      title: ticketData.title,
      description: ticketData.description,
      status: "open",
      priority: ticketData.priority,
      category: ticketData.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [],
    }

    setTickets([newTicket, ...tickets])
    setTicketDialogOpen(false)
  }

  const handleCancelTicketForm = () => {
    setTicketDialogOpen(false)
  }

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in-progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-iran" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4 space-x-reverse">
              <img src="/placeholder-logo.svg" alt="Logo" className="h-8 w-8" />
              <h1 className="text-xl font-semibold text-gray-900">پنل کاربری</h1>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" alt="کاربر" />
                    <AvatarFallback>ک</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>پروفایل</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>تنظیمات</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>خروج</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">کل تیکت‌ها</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">باز</CardTitle>
              <AlertCircle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.open}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">در حال انجام</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">حل شده</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="tickets" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tickets">تیکت‌های من</TabsTrigger>
            <TabsTrigger value="new-ticket">تیکت جدید</TabsTrigger>
          </TabsList>

          <TabsContent value="tickets" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="جستجو در تیکت‌ها..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                فیلتر
              </Button>
            </div>

            {/* Tickets List */}
            <div className="grid gap-4">
              {filteredTickets.map((ticket) => (
                <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-lg">{ticket.title}</CardTitle>
                        <CardDescription>{ticket.description}</CardDescription>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority === "urgent" && "فوری"}
                          {ticket.priority === "high" && "بالا"}
                          {ticket.priority === "medium" && "متوسط"}
                          {ticket.priority === "low" && "پایین"}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(ticket.status)}>
                          {getStatusIcon(ticket.status)}
                          <span className="mr-1">
                            {ticket.status === "open" && "باز"}
                            {ticket.status === "in-progress" && "در حال انجام"}
                            {ticket.status === "resolved" && "حل شده"}
                            {ticket.status === "closed" && "بسته"}
                          </span>
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>دسته‌بندی: {ticket.category}</span>
                      <span>ایجاد شده: {new Date(ticket.createdAt).toLocaleDateString("fa-IR")}</span>
                      {ticket.assignedTo && <span>تخصیص یافته به: {ticket.assignedTo}</span>}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedTicket(ticket)}>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            مشاهده گفتگو
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh]">
                          <DialogHeader>
                            <DialogTitle>{selectedTicket?.title}</DialogTitle>
                          </DialogHeader>
                          {selectedTicket && (
                            <div className="space-y-4">
                              <div className="flex items-center space-x-4 space-x-reverse">
                                <Badge className={getPriorityColor(selectedTicket.priority)}>
                                  {selectedTicket.priority === "urgent" && "فوری"}
                                  {selectedTicket.priority === "high" && "بالا"}
                                  {selectedTicket.priority === "medium" && "متوسط"}
                                  {selectedTicket.priority === "low" && "پایین"}
                                </Badge>
                                <Badge variant="outline" className={getStatusColor(selectedTicket.status)}>
                                  {getStatusIcon(selectedTicket.status)}
                                  <span className="mr-1">
                                    {selectedTicket.status === "open" && "باز"}
                                    {selectedTicket.status === "in-progress" && "در حال انجام"}
                                    {selectedTicket.status === "resolved" && "حل شده"}
                                    {selectedTicket.status === "closed" && "بسته"}
                                  </span>
                                </Badge>
                              </div>

                              <Separator />

                              <ScrollArea className="h-96">
                                <div className="space-y-4">
                                  {selectedTicket.messages.map((message) => (
                                    <div
                                      key={message.id}
                                      className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                                    >
                                      <div
                                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                          message.isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
                                        }`}
                                      >
                                        <div className="text-sm font-medium mb-1">{message.sender}</div>
                                        <div>{message.message}</div>
                                        <div className="text-xs mt-1 opacity-70">
                                          {new Date(message.timestamp).toLocaleString("fa-IR")}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </ScrollArea>

                              <div className="flex space-x-2 space-x-reverse">
                                <Textarea
                                  placeholder="پیام خود را بنویسید..."
                                  value={newMessage}
                                  onChange={(e) => setNewMessage(e.target.value)}
                                  className="flex-1"
                                  rows={2}
                                />
                                <div className="flex flex-col space-y-2">
                                  <Button size="sm" variant="outline">
                                    <Paperclip className="h-4 w-4" />
                                  </Button>
                                  <Button size="sm" onClick={handleSendMessage}>
                                    <Send className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="new-ticket">
            <Card>
              <CardHeader>
                <CardTitle>ایجاد تیکت جدید</CardTitle>
                <CardDescription>برای دریافت پشتیبانی فنی، تیکت جدید ایجاد کنید</CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog open={ticketDialogOpen} onOpenChange={setTicketDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="w-full">
                      <Plus className="mr-2 h-4 w-4" />
                      ایجاد تیکت جدید
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>ایجاد تیکت جدید</DialogTitle>
                    </DialogHeader>
                    <TwoStepTicketForm onSubmit={handleTicketCreate} onClose={handleCancelTicketForm} />
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
