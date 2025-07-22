"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Ticket,
  Plus,
  Search,
  Filter,
  Clock,
  AlertCircle,
  CheckCircle,
  User,
  Settings,
  Paperclip,
  Send,
  Eye,
  MessageSquare,
} from "lucide-react"

// Mock data for demonstration
const mockTickets = [
  {
    id: "TK-2024-001",
    title: "مشکل در اتصال به شبکه",
    description: "نمی‌توانم به شبکه شرکت متصل شوم",
    status: "open",
    priority: "high",
    category: "network",
    clientName: "احمد محمدی",
    clientEmail: "ahmad@company.com",
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-15T10:30:00Z",
    responses: [],
  },
  {
    id: "TK-2024-002",
    title: "درخواست نصب نرم‌افزار",
    description: "نیاز به نصب Adobe Photoshop دارم",
    status: "in-progress",
    priority: "medium",
    category: "software",
    clientName: "فاطمه احمدی",
    clientEmail: "fateme@company.com",
    createdAt: "2024-01-14T14:20:00Z",
    updatedAt: "2024-01-15T09:15:00Z",
    responses: [
      {
        id: 1,
        author: "تکنسین علی",
        message: "درخواست شما در حال بررسی است",
        timestamp: "2024-01-15T09:15:00Z",
        isAdmin: true,
      },
    ],
  },
]

const statusColors = {
  open: "bg-red-100 text-red-800 border-red-200",
  "in-progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
  resolved: "bg-green-100 text-green-800 border-green-200",
  closed: "bg-gray-100 text-gray-800 border-gray-200",
}

const statusLabels = {
  open: "باز",
  "in-progress": "در حال انجام",
  resolved: "حل شده",
  closed: "بسته",
}

const priorityColors = {
  low: "bg-blue-100 text-blue-800 border-blue-200",
  medium: "bg-orange-100 text-orange-800 border-orange-200",
  high: "bg-red-100 text-red-800 border-red-200",
  urgent: "bg-purple-100 text-purple-800 border-purple-200",
}

const priorityLabels = {
  low: "کم",
  medium: "متوسط",
  high: "بالا",
  urgent: "فوری",
}

export default function ITServiceDashboard() {
  const [activeTab, setActiveTab] = useState("client")
  const [selectedTicket, setSelectedTicket] = useState(null)
  const [newTicketDialog, setNewTicketDialog] = useState(false)
  const [accessTicketDialog, setAccessTicketDialog] = useState(false)

  const ClientDashboard = () => (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">پنل کاربری</h2>
          <p className="text-muted-foreground">مدیریت تیکت‌های پشتیبانی</p>
        </div>
        <Dialog open={newTicketDialog} onOpenChange={setNewTicketDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              تیکت جدید
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl" dir="rtl">
            <DialogHeader>
              <DialogTitle>ایجاد تیکت جدید</DialogTitle>
              <DialogDescription>لطفاً اطلاعات مربوط به مشکل خود را وارد کنید</DialogDescription>
            </DialogHeader>
            <NewTicketForm onClose={() => setNewTicketDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">کل تیکت‌ها</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">باز</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">در حال انجام</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">حل شده</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>تیکت‌های من</CardTitle>
            <div className="flex gap-2">
              <Dialog open={accessTicketDialog} onOpenChange={setAccessTicketDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Eye className="w-4 h-4" />
                    دسترسی به تیکت
                  </Button>
                </DialogTrigger>
                <DialogContent dir="rtl">
                  <DialogHeader>
                    <DialogTitle>دسترسی به تیکت</DialogTitle>
                    <DialogDescription>برای دسترسی به تیکت، اطلاعات زیر را وارد کنید</DialogDescription>
                  </DialogHeader>
                  <TicketAccessForm onClose={() => setAccessTicketDialog(false)} />
                </DialogContent>
              </Dialog>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer"
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-2 items-center">
                    <Badge variant="outline" className="font-mono text-xs">
                      {ticket.id}
                    </Badge>
                    <Badge className={statusColors[ticket.status]}>{statusLabels[ticket.status]}</Badge>
                    <Badge className={priorityColors[ticket.priority]}>{priorityLabels[ticket.priority]}</Badge>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {new Date(ticket.createdAt).toLocaleDateString("fa-IR")}
                  </span>
                </div>
                <h3 className="font-semibold mb-1">{ticket.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{ticket.description}</p>
                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{ticket.responses.length} پاسخ</span>
                  </div>
                  <Button variant="ghost" size="sm">
                    مشاهده جزئیات
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const AdminDashboard = () => (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">پنل مدیریت</h2>
          <p className="text-muted-foreground">مدیریت تیکت‌های پشتیبانی</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            تنظیمات
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">کل تیکت‌ها</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">+12% از ماه گذشته</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">در انتظار پاسخ</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">نیاز به توجه فوری</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">میانگین زمان پاسخ</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4 ساعت</div>
            <p className="text-xs text-muted-foreground">-15% بهبود</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">رضایت مشتری</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">+2% بهبود</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>تیکت‌های اخیر</CardTitle>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">همه</SelectItem>
                  <SelectItem value="open">باز</SelectItem>
                  <SelectItem value="in-progress">در حال انجام</SelectItem>
                  <SelectItem value="resolved">حل شده</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer"
                onClick={() => setSelectedTicket(ticket)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex gap-2 items-center">
                    <Badge variant="outline" className="font-mono text-xs">
                      {ticket.id}
                    </Badge>
                    <Badge className={statusColors[ticket.status]}>{statusLabels[ticket.status]}</Badge>
                    <Badge className={priorityColors[ticket.priority]}>{priorityLabels[ticket.priority]}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarFallback className="text-xs">{ticket.clientName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{ticket.clientName}</span>
                  </div>
                </div>
                <h3 className="font-semibold mb-1">{ticket.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{ticket.description}</p>
                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{ticket.responses.length}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(ticket.updatedAt).toLocaleDateString("fa-IR")}
                    </span>
                  </div>
                  <Button variant="ghost" size="sm">
                    پاسخ دادن
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const NewTicketForm = ({ onClose }) => (
    <form className="space-y-4" dir="rtl">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">دسته‌بندی</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="انتخاب دسته‌بندی" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="hardware">سخت‌افزار</SelectItem>
              <SelectItem value="software">نرم‌افزار</SelectItem>
              <SelectItem value="network">شبکه</SelectItem>
              <SelectItem value="email">ایمیل</SelectItem>
              <SelectItem value="other">سایر</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="priority">اولویت</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="انتخاب اولویت" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">کم</SelectItem>
              <SelectItem value="medium">متوسط</SelectItem>
              <SelectItem value="high">بالا</SelectItem>
              <SelectItem value="urgent">فوری</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">عنوان مشکل</Label>
        <Input id="title" placeholder="عنوان کوتاه و واضح از مشکل" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">شرح مشکل</Label>
        <Textarea id="description" placeholder="لطفاً مشکل خود را به تفصیل شرح دهید..." rows={4} />
      </div>

      <div className="space-y-2">
        <Label>سوالات تکمیلی</Label>
        <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
          <div className="space-y-2">
            <Label htmlFor="os">سیستم عامل</Label>
            <Input id="os" placeholder="مثال: Windows 11, macOS, Ubuntu" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="browser">مرورگر (در صورت نیاز)</Label>
            <Input id="browser" placeholder="مثال: Chrome, Firefox, Safari" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="steps">مراحل بازتولید مشکل</Label>
            <Textarea id="steps" placeholder="مراحلی که منجر به بروز مشکل شده..." rows={3} />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="attachment">پیوست فایل</Label>
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
          <Paperclip className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">فایل‌های مربوط به مشکل را اینجا بکشید یا کلیک کنید</p>
          <Button variant="outline" size="sm" className="mt-2 bg-transparent">
            انتخاب فایل
          </Button>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          انصراف
        </Button>
        <Button type="submit">ایجاد تیکت</Button>
      </div>
    </form>
  )

  const TicketAccessForm = ({ onClose }) => (
    <form className="space-y-4" dir="rtl">
      <div className="space-y-2">
        <Label htmlFor="ticketId">شماره تیکت</Label>
        <Input id="ticketId" placeholder="مثال: TK-2024-001" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">ایمیل</Label>
        <Input id="email" type="email" placeholder="ایمیل ثبت شده در تیکت" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">شماره تماس</Label>
        <Input id="phone" placeholder="شماره تماس ثبت شده" />
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          انصراف
        </Button>
        <Button type="submit">دسترسی به تیکت</Button>
      </div>
    </form>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Ticket className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="font-bold text-lg">سیستم مدیریت خدمات IT</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback>
                  <User className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-6">
            <TabsTrigger value="client" className="gap-2">
              <User className="w-4 h-4" />
              پنل کاربری
            </TabsTrigger>
            <TabsTrigger value="admin" className="gap-2">
              <Settings className="w-4 h-4" />
              پنل مدیریت
            </TabsTrigger>
          </TabsList>

          <TabsContent value="client">
            <ClientDashboard />
          </TabsContent>

          <TabsContent value="admin">
            <AdminDashboard />
          </TabsContent>
        </Tabs>
      </div>

      {selectedTicket && (
        <Dialog open={!!selectedTicket} onOpenChange={() => setSelectedTicket(null)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" dir="rtl">
            <DialogHeader>
              <div className="flex justify-between items-start">
                <div>
                  <DialogTitle className="flex items-center gap-2">
                    <Badge variant="outline" className="font-mono">
                      {selectedTicket.id}
                    </Badge>
                    {selectedTicket.title}
                  </DialogTitle>
                  <DialogDescription className="mt-2">
                    ایجاد شده توسط {selectedTicket.clientName} در{" "}
                    {new Date(selectedTicket.createdAt).toLocaleDateString("fa-IR")}
                  </DialogDescription>
                </div>
                <div className="flex gap-2">
                  <Badge className={statusColors[selectedTicket.status]}>{statusLabels[selectedTicket.status]}</Badge>
                  <Badge className={priorityColors[selectedTicket.priority]}>
                    {priorityLabels[selectedTicket.priority]}
                  </Badge>
                </div>
              </div>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">شرح مشکل:</h4>
                <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">{selectedTicket.description}</p>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">پاسخ‌ها و گفتگو:</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {selectedTicket.responses.length > 0 ? (
                    selectedTicket.responses.map((response) => (
                      <div
                        key={response.id}
                        className={`p-3 rounded-lg ${
                          response.isAdmin ? "bg-blue-50 border-r-4 border-blue-500" : "bg-gray-50"
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-medium text-sm">{response.author}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(response.timestamp).toLocaleDateString("fa-IR")}
                          </span>
                        </div>
                        <p className="text-sm">{response.message}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">هنوز پاسخی ثبت نشده است</p>
                  )}
                </div>
              </div>

              {activeTab === "admin" && (
                <div className="space-y-3">
                  <Separator />
                  <div className="flex gap-2">
                    <Select defaultValue={selectedTicket.status}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">باز</SelectItem>
                        <SelectItem value="in-progress">در حال انجام</SelectItem>
                        <SelectItem value="resolved">حل شده</SelectItem>
                        <SelectItem value="closed">بسته</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm">
                      به‌روزرسانی وضعیت
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Textarea placeholder="پاسخ خود را اینجا بنویسید..." className="flex-1" rows={3} />
                    <Button className="self-end">
                      <Send className="w-4 h-4 mr-2" />
                      ارسال پاسخ
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
