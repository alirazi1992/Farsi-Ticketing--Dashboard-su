"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AdminTicketManagement } from "./admin-ticket-management"
import { CategoryManagement } from "./category-management"
import { AdminTechnicianAssignment } from "./admin-technician-assignment"
import {
  Users,
  FolderOpen,
  TicketIcon,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Phone,
  Mail,
  Copy,
} from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { LoginDialog } from "./login-dialog"
import { useToast } from "@/hooks/use-toast"

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

interface Technician {
  id: string
  name: string
  email: string
  specialties: string[]
  workload: number
  isAvailable: boolean
}

interface AdminDashboardProps {
  tickets: Ticket[]
  categories: Category[]
  technicians: Technician[]
  onTicketUpdate: (ticketId: string, updates: Partial<Ticket>) => void
  onTicketAssignment: (ticketId: string, technicianId: string) => void
  onAddResponse: (ticketId: string, response: { message: string; author: string; isInternal: boolean }) => void
  onCategoryCreate: (category: Omit<Category, "id">) => void
  onCategoryUpdate: (categoryId: string, updates: Partial<Category>) => void
  onCategoryDelete: (categoryId: string) => void
  onTechnicianCreate: (technician: Omit<Technician, "id">) => void
  onTechnicianUpdate: (technicianId: string, updates: Partial<Technician>) => void
  onTechnicianDelete: (technicianId: string) => void
}

export function AdminDashboard({
  tickets,
  categories,
  technicians,
  onTicketUpdate,
  onTicketAssignment,
  onAddResponse,
  onCategoryCreate,
  onCategoryUpdate,
  onCategoryDelete,
  onTechnicianCreate,
  onTechnicianUpdate,
  onTechnicianDelete,
}: AdminDashboardProps) {
  const { user, isAdmin } = useAuth()
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const { toast } = useToast()

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" dir="rtl">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">پنل مدیریت</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">برای دسترسی به پنل مدیریت وارد شوید</p>
            <Button onClick={() => setShowLoginDialog(true)} className="w-full">
              ورود به سیستم
            </Button>
          </CardContent>
        </Card>
        <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
      </div>
    )
  }

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

  // Statistics
  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in-progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
    closed: tickets.filter((t) => t.status === "closed").length,
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">پنل مدیریت</h1>
          <p className="text-gray-600">مدیریت تیکت‌ها، دسته‌بندی‌ها و تکنسین‌ها</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-600">کل تیکت‌ها</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.open}</div>
                <div className="text-sm text-gray-600">باز</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.inProgress}</div>
                <div className="text-sm text-gray-600">در حال بررسی</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
                <div className="text-sm text-gray-600">حل شده</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{stats.closed}</div>
                <div className="text-sm text-gray-600">بسته شده</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="tickets" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tickets" className="flex items-center gap-2">
              <TicketIcon className="w-4 h-4" />
              مدیریت تیکت‌ها
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              دسته‌بندی‌ها
            </TabsTrigger>
            <TabsTrigger value="technicians" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              تکنسین‌ها
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tickets" className="space-y-4">
            <AdminTicketManagement
              tickets={tickets}
              technicians={technicians}
              categories={categories}
              onTicketUpdate={onTicketUpdate}
              onTicketAssignment={onTicketAssignment}
              onAddResponse={onAddResponse}
              onViewTicket={handleViewTicket}
            />
          </TabsContent>

          <TabsContent value="categories" className="space-y-4">
            <CategoryManagement
              categories={categories}
              onCategoryCreate={onCategoryCreate}
              onCategoryUpdate={onCategoryUpdate}
              onCategoryDelete={onCategoryDelete}
            />
          </TabsContent>

          <TabsContent value="technicians" className="space-y-4">
            <AdminTechnicianAssignment
              technicians={technicians}
              tickets={tickets}
              onTechnicianCreate={onTechnicianCreate}
              onTechnicianUpdate={onTechnicianUpdate}
              onTechnicianDelete={onTechnicianDelete}
            />
          </TabsContent>
        </Tabs>

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
                      <CardTitle className="text-right">اطلاعات مشتری</CardTitle>
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
                        {selectedTicket.responses.map((response) => (
                          <div
                            key={response.id}
                            className={`border-r-4 pr-4 py-2 ${response.isInternal ? "border-red-500 bg-red-50" : "border-blue-500"}`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-700">{response.author}</span>
                                {response.isInternal && (
                                  <Badge variant="secondary" className="text-xs">
                                    داخلی
                                  </Badge>
                                )}
                              </div>
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
