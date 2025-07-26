"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TwoStepTicketForm } from "./two-step-ticket-form"
import { Plus, Search, Eye, Clock, CheckCircle, AlertCircle, XCircle, Phone, Mail, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { yupResolver } from "@hookform/resolvers/yup"
import { useForm } from "react-hook-form"
import { ticketAccessSchema } from "@/lib/validation-schemas"

interface Ticket {
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
  assignedTo?: string
  createdAt: string
  updatedAt: string
  responses: Array<{
    id: string
    message: string
    author: string
    timestamp: string
    isInternal: boolean
  }>
  attachments: Array<{
    id: string
    name: string
    url: string
    size: number
  }>
}

interface Category {
  id: string
  name: string
  label: string
  icon: string
  subcategories: Array<{
    id: string
    name: string
    label: string
  }>
}

interface ClientDashboardProps {
  tickets: Ticket[]
  categories: Category[]
  onTicketCreate: (data: any) => void
  onTicketUpdate: (ticketId: string, updates: Partial<Ticket>) => void
}

export function ClientDashboard({ tickets, categories, onTicketCreate, onTicketUpdate }: ClientDashboardProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showAccessForm, setShowAccessForm] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [accessedTickets, setAccessedTickets] = useState<Ticket[]>([])
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(ticketAccessSchema),
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low":
        return "bg-blue-500"
      case "medium":
        return "bg-orange-500"
      case "high":
        return "bg-red-500"
      case "urgent":
        return "bg-purple-500"
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <Clock className="w-4 h-4" />
      case "in-progress":
        return <AlertCircle className="w-4 h-4" />
      case "resolved":
        return <CheckCircle className="w-4 h-4" />
      case "closed":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open":
        return "باز"
      case "in-progress":
        return "در حال بررسی"
      case "resolved":
        return "حل شده"
      case "closed":
        return "بسته شده"
      default:
        return status
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-blue-100 text-blue-800"
      case "in-progress":
        return "bg-orange-100 text-orange-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryLabel = (categoryName: string) => {
    const category = categories.find((cat) => cat.name === categoryName)
    return category ? category.label : categoryName
  }

  const getSubcategoryLabel = (categoryName: string, subcategoryName: string) => {
    const category = categories.find((cat) => cat.name === categoryName)
    if (category) {
      const subcategory = category.subcategories.find((sub) => sub.name === subcategoryName)
      return subcategory ? subcategory.label : subcategoryName
    }
    return subcategoryName
  }

  const handleTicketAccess = (data: any) => {
    const ticket = tickets.find(
      (t) => t.id === data.ticketId && t.clientEmail === data.email && t.clientPhone === data.phone,
    )

    if (ticket) {
      setAccessedTickets((prev) => {
        const exists = prev.find((t) => t.id === ticket.id)
        if (!exists) {
          return [...prev, ticket]
        }
        return prev
      })
      setShowAccessForm(false)
      reset()
      toast({
        title: "تیکت پیدا شد",
        description: `تیکت ${ticket.id} با موفقیت یافت شد.`,
      })
    } else {
      toast({
        title: "تیکت یافت نشد",
        description: "اطلاعات وارد شده صحیح نیست یا تیکت وجود ندارد.",
        variant: "destructive",
      })
    }
  }

  const handleViewTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket)
    setViewDialogOpen(true)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "کپی شد",
      description: "متن در کلیپ‌بورد کپی شد.",
    })
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
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">پنل مشتری</h1>
          <p className="text-gray-600">مدیریت تیکت‌های پشتیبانی شما</p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 mb-6">
          <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            ایجاد تیکت جدید
          </Button>
          <Button variant="outline" onClick={() => setShowAccessForm(true)} className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            دسترسی به تیکت
          </Button>
        </div>

        {/* Tickets Display */}
        <Tabs defaultValue="accessed" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="accessed">تیکت‌های من ({accessedTickets.length})</TabsTrigger>
            <TabsTrigger value="all">همه تیکت‌ها ({tickets.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="accessed" className="space-y-4">
            {accessedTickets.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <p className="text-gray-500">هنوز تیکتی دسترسی پیدا نکرده‌اید.</p>
                  <p className="text-sm text-gray-400 mt-2">
                    برای دسترسی به تیکت‌های خود، از دکمه "دسترسی به تیکت" استفاده کنید.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {accessedTickets.map((ticket) => (
                  <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold">{ticket.title}</h3>
                            <Badge variant="outline" className="text-xs">
                              {ticket.id}
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm mb-2">{ticket.description.substring(0, 100)}...</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{getCategoryLabel(ticket.category)}</span>
                            <span>•</span>
                            <span>{getSubcategoryLabel(ticket.category, ticket.subcategory)}</span>
                            <span>•</span>
                            <span>{formatDate(ticket.createdAt)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(ticket.priority)}`}></div>
                          <Badge className={getStatusColor(ticket.status)}>
                            {getStatusIcon(ticket.status)}
                            <span className="mr-1">{getStatusLabel(ticket.status)}</span>
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewTicket(ticket)}
                            className="flex items-center gap-1 hover:bg-blue-50 hover:text-blue-600"
                          >
                            <Eye className="w-4 h-4" />
                            مشاهده
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4">
              {tickets.map((ticket) => (
                <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{ticket.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {ticket.id}
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{ticket.description.substring(0, 100)}...</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{getCategoryLabel(ticket.category)}</span>
                          <span>•</span>
                          <span>{getSubcategoryLabel(ticket.category, ticket.subcategory)}</span>
                          <span>•</span>
                          <span>{formatDate(ticket.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getPriorityColor(ticket.priority)}`}></div>
                        <Badge className={getStatusColor(ticket.status)}>
                          {getStatusIcon(ticket.status)}
                          <span className="mr-1">{getStatusLabel(ticket.status)}</span>
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewTicket(ticket)}
                          className="flex items-center gap-1 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye className="w-4 h-4" />
                          مشاهده
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Create Ticket Dialog */}
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <TwoStepTicketForm
              categories={categories}
              onSubmit={(data) => {
                onTicketCreate(data)
                setShowCreateForm(false)
              }}
              onCancel={() => setShowCreateForm(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Access Ticket Dialog */}
        <Dialog open={showAccessForm} onOpenChange={setShowAccessForm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-right">دسترسی به تیکت</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(handleTicketAccess)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="ticketId" className="text-right">
                  شماره تیکت
                </Label>
                <Input {...register("ticketId")} id="ticketId" placeholder="TK-2024-001" className="text-right" />
                {errors.ticketId && <p className="text-sm text-red-500 text-right">{errors.ticketId.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-right">
                  ایمیل
                </Label>
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="example@domain.com"
                  className="text-right"
                />
                {errors.email && <p className="text-sm text-red-500 text-right">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-right">
                  شماره تماس
                </Label>
                <Input {...register("phone")} id="phone" placeholder="09123456789" className="text-right" />
                {errors.phone && <p className="text-sm text-red-500 text-right">{errors.phone.message}</p>}
              </div>

              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={() => setShowAccessForm(false)}>
                  انصراف
                </Button>
                <Button type="submit">دسترسی به تیکت</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* View Ticket Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            {selectedTicket && (
              <div className="space-y-6" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="text-right text-xl">جزئیات تیکت</DialogTitle>
                </DialogHeader>

                {/* Ticket Header */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-bold mb-2">{selectedTicket.title}</h2>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">شماره تیکت:</span>
                          <Badge
                            variant="outline"
                            className="cursor-pointer"
                            onClick={() => copyToClipboard(selectedTicket.id)}
                          >
                            {selectedTicket.id}
                            <Copy className="w-3 h-3 mr-1" />
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>وضعیت:</span>
                          <Badge className={getStatusColor(selectedTicket.status)}>
                            {getStatusIcon(selectedTicket.status)}
                            <span className="mr-1">{getStatusLabel(selectedTicket.status)}</span>
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>اولویت:</span>
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(selectedTicket.priority)}`}></div>
                          <span>{getPriorityLabel(selectedTicket.priority)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ticket Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-right">اطلاعات تیکت</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-700">دسته‌بندی:</span>
                        <p className="text-gray-600">{getCategoryLabel(selectedTicket.category)}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">زیر دسته:</span>
                        <p className="text-gray-600">
                          {getSubcategoryLabel(selectedTicket.category, selectedTicket.subcategory)}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">تاریخ ایجاد:</span>
                        <p className="text-gray-600">{formatDate(selectedTicket.createdAt)}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">آخرین به‌روزرسانی:</span>
                        <p className="text-gray-600">{formatDate(selectedTicket.updatedAt)}</p>
                      </div>
                      {selectedTicket.assignedTo && (
                        <div>
                          <span className="font-medium text-gray-700">تکنسین مسئول:</span>
                          <p className="text-gray-600">{selectedTicket.assignedTo}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-right">اطلاعات تماس</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-700">نام:</span>
                        <p className="text-gray-600">{selectedTicket.clientName}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-gray-700">ایمیل:</span>
                          <p className="text-gray-600">{selectedTicket.clientEmail}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`mailto:${selectedTicket.clientEmail}`)}
                          className="flex items-center gap-1"
                        >
                          <Mail className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-gray-700">تلفن:</span>
                          <p className="text-gray-600">{selectedTicket.clientPhone}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`tel:${selectedTicket.clientPhone}`)}
                          className="flex items-center gap-1"
                        >
                          <Phone className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Description */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-right">شرح مشکل</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedTicket.description}</p>
                  </CardContent>
                </Card>

                {/* Responses */}
                {selectedTicket.responses.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-right">پاسخ‌ها و به‌روزرسانی‌ها</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedTicket.responses
                          .filter((response) => !response.isInternal)
                          .map((response) => (
                            <div key={response.id} className="border-r-4 border-blue-500 pr-4 py-2">
                              <div className="flex justify-between items-start mb-2">
                                <span className="font-medium text-gray-700">{response.author}</span>
                                <span className="text-sm text-gray-500">{formatDate(response.timestamp)}</span>
                              </div>
                              <p className="text-gray-600 leading-relaxed">{response.message}</p>
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Attachments */}
                {selectedTicket.attachments.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-right">فایل‌های پیوست</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {selectedTicket.attachments.map((attachment) => (
                          <div key={attachment.id} className="flex items-center justify-between p-2 border rounded">
                            <span className="text-sm">{attachment.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">{(attachment.size / 1024).toFixed(1)} KB</span>
                              <Button variant="outline" size="sm" onClick={() => window.open(attachment.url)}>
                                دانلود
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
