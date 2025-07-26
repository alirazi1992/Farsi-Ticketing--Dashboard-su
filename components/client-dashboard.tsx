"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TwoStepTicketForm } from "@/components/two-step-ticket-form"
import { UserMenu } from "@/components/user-menu"
import { SettingsDialog } from "@/components/settings-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Plus,
  Ticket,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  Calendar,
  BarChart3,
  Users,
  Activity,
  Mail,
} from "lucide-react"

interface ClientDashboardProps {
  tickets: any[]
  categories: any[]
  onTicketSubmit: (ticketData: any) => void
}

export function ClientDashboard({ tickets, categories, onTicketSubmit }: ClientDashboardProps) {
  const [newTicketDialog, setNewTicketDialog] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [performanceDialog, setPerformanceDialog] = useState(false)
  const [supportTeamDialog, setSupportTeamDialog] = useState(false)
  const [systemStatusDialog, setSystemStatusDialog] = useState(false)
  const [messagesDialog, setMessagesDialog] = useState(false)

  // Calculate statistics
  const totalTickets = tickets.length
  const openTickets = tickets.filter((t) => t.status === "open").length
  const inProgressTickets = tickets.filter((t) => t.status === "in-progress").length
  const resolvedTickets = tickets.filter((t) => t.status === "resolved").length

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="destructive">باز</Badge>
      case "in-progress":
        return <Badge variant="default">در حال انجام</Badge>
      case "resolved":
        return <Badge variant="secondary">حل شده</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="destructive">فوری</Badge>
      case "high":
        return <Badge variant="destructive">بالا</Badge>
      case "medium":
        return <Badge variant="default">متوسط</Badge>
      case "low":
        return <Badge variant="secondary">کم</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId)
    return category ? category.name : categoryId
  }

  const getSubcategoryName = (categoryId: string, subcategoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId)
    if (category) {
      const subcategory = category.subcategories.find((sub: any) => sub.id === subcategoryId)
      return subcategory ? subcategory.name : subcategoryId
    }
    return subcategoryId
  }

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <User className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold">پنل کاربری</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Dialog open={newTicketDialog} onOpenChange={setNewTicketDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  تیکت جدید
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="text-right">ارسال تیکت جدید</DialogTitle>
                  <DialogDescription className="text-right">
                    لطفاً اطلاعات مربوط به مشکل خود را وارد کنید
                  </DialogDescription>
                </DialogHeader>
                <TwoStepTicketForm
                  categories={categories}
                  onSubmit={(data) => {
                    onTicketSubmit(data)
                    setNewTicketDialog(false)
                  }}
                  onCancel={() => setNewTicketDialog(false)}
                />
              </DialogContent>
            </Dialog>
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">کل تیکت‌ها</p>
                  <p className="text-2xl font-bold">{totalTickets}</p>
                </div>
                <Ticket className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">باز</p>
                  <p className="text-2xl font-bold text-orange-600">{openTickets}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">در حال انجام</p>
                  <p className="text-2xl font-bold text-blue-600">{inProgressTickets}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">حل شده</p>
                  <p className="text-2xl font-bold text-green-600">{resolvedTickets}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-right">عملیات سریع</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2 bg-transparent"
                onClick={() => setPerformanceDialog(true)}
              >
                <BarChart3 className="w-6 h-6" />
                <span>گزارش عملکرد</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2 bg-transparent"
                onClick={() => setSupportTeamDialog(true)}
              >
                <Users className="w-6 h-6" />
                <span>تیم پشتیبانی</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2 bg-transparent"
                onClick={() => setSystemStatusDialog(true)}
              >
                <Activity className="w-6 h-6" />
                <span>وضعیت سیستم</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col gap-2 bg-transparent"
                onClick={() => setMessagesDialog(true)}
              >
                <Mail className="w-6 h-6" />
                <span>پیام‌های جدید</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs defaultValue="tickets" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tickets" className="flex items-center gap-2">
              <Ticket className="w-4 h-4" />
              تیکت‌های من
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              تاریخچه
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tickets" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">تیکت‌های فعال</CardTitle>
              </CardHeader>
              <CardContent>
                {tickets.length > 0 ? (
                  <div className="space-y-4">
                    {tickets.map((ticket) => (
                      <Card key={ticket.id} className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div className="text-right">
                            <h3 className="font-semibold">{ticket.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{ticket.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusBadge(ticket.status)}
                            {getPriorityBadge(ticket.priority)}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">شناسه:</span>
                            <p className="font-medium">{ticket.id}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">دسته‌بندی:</span>
                            <p className="font-medium">{getCategoryName(ticket.category)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">زیردسته:</span>
                            <p className="font-medium">{getSubcategoryName(ticket.category, ticket.subcategory)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">تاریخ ارسال:</span>
                            <p className="font-medium">{new Date(ticket.submittedAt).toLocaleDateString("fa-IR")}</p>
                          </div>
                        </div>
                        {ticket.assignedTechnicianName && (
                          <div className="mt-3 p-2 bg-muted rounded-md">
                            <p className="text-sm">
                              <span className="text-muted-foreground">تکنسین مسئول:</span>{" "}
                              <span className="font-medium">{ticket.assignedTechnicianName}</span>
                            </p>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Ticket className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground">هیچ تیکتی وجود ندارد</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      برای ارسال تیکت جدید روی دکمه "تیکت جدید" کلیک کنید
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-right">تاریخچه تیکت‌ها</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tickets
                    .filter((ticket) => ticket.status === "resolved")
                    .map((ticket) => (
                      <Card key={ticket.id} className="p-4 opacity-75">
                        <div className="flex justify-between items-start mb-3">
                          <div className="text-right">
                            <h3 className="font-semibold">{ticket.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">{ticket.description}</p>
                          </div>
                          <Badge variant="secondary">حل شده</Badge>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">شناسه:</span>
                            <p className="font-medium">{ticket.id}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">دسته‌بندی:</span>
                            <p className="font-medium">{getCategoryName(ticket.category)}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">تکنسین:</span>
                            <p className="font-medium">{ticket.assignedTechnicianName || "تعیین نشده"}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">تاریخ حل:</span>
                            <p className="font-medium">{new Date(ticket.submittedAt).toLocaleDateString("fa-IR")}</p>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Quick Action Dialogs */}
      <Dialog open={performanceDialog} onOpenChange={setPerformanceDialog}>
        <DialogContent className="sm:max-w-[425px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">گزارش عملکرد</DialogTitle>
            <DialogDescription className="text-right">آمار و گزارش عملکرد تیکت‌های شما</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{totalTickets}</p>
                <p className="text-sm text-muted-foreground">کل تیکت‌ها</p>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <p className="text-2xl font-bold text-green-600">{resolvedTickets}</p>
                <p className="text-sm text-muted-foreground">حل شده</p>
              </div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {totalTickets > 0 ? Math.round((resolvedTickets / totalTickets) * 100) : 0}%
              </p>
              <p className="text-sm text-muted-foreground">نرخ حل مسئله</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={supportTeamDialog} onOpenChange={setSupportTeamDialog}>
        <DialogContent className="sm:max-w-[425px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">تیم پشتیبانی</DialogTitle>
            <DialogDescription className="text-right">اطلاعات تماس با تیم پشتیبانی</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">ساعات کاری</h4>
              <p className="text-sm">شنبه تا چهارشنبه: 8:00 - 17:00</p>
              <p className="text-sm">پنج‌شنبه: 8:00 - 13:00</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">راه‌های تماس</h4>
              <p className="text-sm">تلفن: 021-12345678</p>
              <p className="text-sm">ایمیل: support@company.com</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={systemStatusDialog} onOpenChange={setSystemStatusDialog}>
        <DialogContent className="sm:max-w-[425px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">وضعیت سیستم</DialogTitle>
            <DialogDescription className="text-right">وضعیت فعلی سیستم‌های IT</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span>سرور اصلی</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                فعال
              </Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span>شبکه</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                فعال
              </Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
              <span>سیستم ایمیل</span>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                تعمیر
              </Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span>VPN</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                فعال
              </Badge>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={messagesDialog} onOpenChange={setMessagesDialog}>
        <DialogContent className="sm:max-w-[425px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">پیام‌های جدید</DialogTitle>
            <DialogDescription className="text-right">آخرین اطلاعیه‌ها و پیام‌ها</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold">به‌روزرسانی سیستم</h4>
                <span className="text-xs text-muted-foreground">2 ساعت پیش</span>
              </div>
              <p className="text-sm">سیستم ایمیل فردا از ساعت 2 تا 4 صبح در دسترس نخواهد بود.</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-semibold">تغییر رمز عبور</h4>
                <span className="text-xs text-muted-foreground">1 روز پیش</span>
              </div>
              <p className="text-sm">لطفاً رمز عبور خود را هر 3 ماه یکبار تغییر دهید.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  )
}
