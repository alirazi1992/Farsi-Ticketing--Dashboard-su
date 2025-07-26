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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AdminTicketList } from "./admin-ticket-list"
import { AdminTicketManagement } from "./admin-ticket-management"
import { CategoryManagement } from "./category-management"
import { AdminTechnicianAssignment } from "./admin-technician-assignment"
import { EnhancedAutoAssignment } from "./enhanced-auto-assignment"
import { BarChart3, Plus, Edit, Trash2, Shield } from "lucide-react"
import { toast } from "sonner"

interface AdminDashboardProps {
  tickets: any[]
  technicians: any[]
  categoriesData: any[]
  onTicketUpdate: (tickets: any[]) => void
  onTechnicianUpdate: (technicians: any[]) => void
  onCategoriesUpdate: (categories: any[]) => void
}

export function AdminDashboard({
  tickets,
  technicians,
  categoriesData,
  onTicketUpdate,
  onTechnicianUpdate,
  onCategoriesUpdate,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")
  const [isAddTechnicianOpen, setIsAddTechnicianOpen] = useState(false)
  const [isEditTechnicianOpen, setIsEditTechnicianOpen] = useState(false)
  const [editingTechnician, setEditingTechnician] = useState<any | null>(null)
  const [previewTicket, setPreviewTicket] = useState<any | null>(null)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  const [newTechnicianForm, setNewTechnicianForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    specialties: [] as string[],
    maxCapacity: 10,
  })

  // Statistics
  const totalTickets = tickets.length
  const openTickets = tickets.filter((t) => t.status === "open").length
  const inProgressTickets = tickets.filter((t) => t.status === "in-progress").length
  const resolvedTickets = tickets.filter((t) => t.status === "resolved").length
  const closedTickets = tickets.filter((t) => t.status === "closed").length

  const activeTechnicians = technicians.filter((t) => t.isActive).length
  const totalWorkload = technicians.reduce((sum, t) => sum + t.workload, 0)
  const avgWorkload = activeTechnicians > 0 ? Math.round(totalWorkload / activeTechnicians) : 0

  const handleAddTechnician = () => {
    if (!newTechnicianForm.name.trim() || !newTechnicianForm.email.trim()) {
      toast.error("نام و ایمیل تکنسین الزامی است")
      return
    }

    const newTechnician = {
      id: `tech-${Date.now()}`,
      name: newTechnicianForm.name,
      email: newTechnicianForm.email,
      phone: newTechnicianForm.phone,
      department: newTechnicianForm.department,
      specialties: newTechnicianForm.specialties,
      workload: 0,
      maxCapacity: newTechnicianForm.maxCapacity,
      isActive: true,
      createdAt: new Date().toISOString(),
    }

    const updatedTechnicians = [...technicians, newTechnician]
    onTechnicianUpdate(updatedTechnicians)

    setNewTechnicianForm({
      name: "",
      email: "",
      phone: "",
      department: "",
      specialties: [],
      maxCapacity: 10,
    })
    setIsAddTechnicianOpen(false)
    toast.success("تکنسین جدید اضافه شد")
  }

  const handleEditTechnician = () => {
    if (!editingTechnician || !newTechnicianForm.name.trim() || !newTechnicianForm.email.trim()) {
      toast.error("نام و ایمیل تکنسین الزامی است")
      return
    }

    const updatedTechnicians = technicians.map((tech) =>
      tech.id === editingTechnician.id
        ? {
            ...tech,
            name: newTechnicianForm.name,
            email: newTechnicianForm.email,
            phone: newTechnicianForm.phone,
            department: newTechnicianForm.department,
            specialties: newTechnicianForm.specialties,
            maxCapacity: newTechnicianForm.maxCapacity,
          }
        : tech,
    )

    onTechnicianUpdate(updatedTechnicians)
    setEditingTechnician(null)
    setNewTechnicianForm({
      name: "",
      email: "",
      phone: "",
      department: "",
      specialties: [],
      maxCapacity: 10,
    })
    setIsEditTechnicianOpen(false)
    toast.success("اطلاعات تکنسین ویرایش شد")
  }

  const handleDeleteTechnician = (technicianId: string) => {
    const updatedTechnicians = technicians.filter((tech) => tech.id !== technicianId)
    onTechnicianUpdate(updatedTechnicians)
    toast.success("تکنسین حذف شد")
  }

  const handleToggleTechnicianStatus = (technicianId: string) => {
    const updatedTechnicians = technicians.map((tech) =>
      tech.id === technicianId ? { ...tech, isActive: !tech.isActive } : tech,
    )
    onTechnicianUpdate(updatedTechnicians)
    toast.success("وضعیت تکنسین تغییر کرد")
  }

  const openEditTechnician = (technician: any) => {
    setEditingTechnician(technician)
    setNewTechnicianForm({
      name: technician.name,
      email: technician.email,
      phone: technician.phone,
      department: technician.department,
      specialties: technician.specialties,
      maxCapacity: technician.maxCapacity,
    })
    setIsEditTechnicianOpen(true)
  }

  const handlePreviewTicket = (ticket: any) => {
    setPreviewTicket(ticket)
    setIsPreviewOpen(true)
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
          <h1 className="text-3xl font-bold">پنل مدیریت</h1>
          <p className="text-muted-foreground">مدیریت تیکت‌ها، تکنسین‌ها و تنظیمات سیستم</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            آمار کلی
          </TabsTrigger>
          <TabsTrigger value="tickets" className="gap-2">
            تیکت‌ها
          </TabsTrigger>
          <TabsTrigger value="ticket-management" className="gap-2">
            مدیریت تیکت‌ها
          </TabsTrigger>
          <TabsTrigger value="technicians" className="gap-2">
            تکنسین‌ها
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2">
            دسته‌بندی‌ها
          </TabsTrigger>
          <TabsTrigger value="assignment" className="gap-2">
            تخصیص
          </TabsTrigger>
          <TabsTrigger value="auto-assignment" className="gap-2">
            تخصیص خودکار
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">کل تیکت‌ها</CardTitle>
                <div className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalTickets}</div>
                <p className="text-xs text-muted-foreground">تعداد کل تیکت‌های ثبت شده</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">تیکت‌های باز</CardTitle>
                <div className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{openTickets}</div>
                <p className="text-xs text-muted-foreground">تیکت‌های در انتظار بررسی</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">در حال انجام</CardTitle>
                <div className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inProgressTickets}</div>
                <p className="text-xs text-muted-foreground">تیکت‌های در حال بررسی</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">حل شده</CardTitle>
                <div className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{resolvedTickets}</div>
                <p className="text-xs text-muted-foreground">تیکت‌های حل شده</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>آمار تکنسین‌ها</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>تکنسین‌های فعال:</span>
                  <span className="font-bold">{activeTechnicians}</span>
                </div>
                <div className="flex justify-between">
                  <span>میانگین بار کاری:</span>
                  <span className="font-bold">{avgWorkload}%</span>
                </div>
                <div className="flex justify-between">
                  <span>کل تکنسین‌ها:</span>
                  <span className="font-bold">{technicians.length}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>تیکت‌های اخیر</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tickets.slice(0, 5).map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{ticket.title}</div>
                        <div className="text-xs text-muted-foreground">{ticket.clientName}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {getStatusLabel(ticket.status)}
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => handlePreviewTicket(ticket)} className="gap-1">
                          <div className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tickets">
          <AdminTicketList tickets={tickets} onTicketUpdate={onTicketUpdate} />
        </TabsContent>

        <TabsContent value="ticket-management">
          <AdminTicketManagement tickets={tickets} onTicketUpdate={onTicketUpdate} />
        </TabsContent>

        <TabsContent value="technicians" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">مدیریت تکنسین‌ها</h2>
              <p className="text-muted-foreground">مدیریت تکنسین‌ها و تخصص‌های آن‌ها</p>
            </div>
            <Dialog open={isAddTechnicianOpen} onOpenChange={setIsAddTechnicianOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  افزودن تکنسین
                </Button>
              </DialogTrigger>
              <DialogContent dir="rtl">
                <DialogHeader>
                  <DialogTitle>افزودن تکنسین جدید</DialogTitle>
                  <DialogDescription>اطلاعات تکنسین جدید را وارد کنید</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="tech-name">نام و نام خانوادگی</Label>
                    <Input
                      id="tech-name"
                      value={newTechnicianForm.name}
                      onChange={(e) => setNewTechnicianForm({ ...newTechnicianForm, name: e.target.value })}
                      placeholder="نام تکنسین"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tech-email">ایمیل</Label>
                    <Input
                      id="tech-email"
                      type="email"
                      value={newTechnicianForm.email}
                      onChange={(e) => setNewTechnicianForm({ ...newTechnicianForm, email: e.target.value })}
                      placeholder="ایمیل تکنسین"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tech-phone">شماره تماس</Label>
                    <Input
                      id="tech-phone"
                      value={newTechnicianForm.phone}
                      onChange={(e) => setNewTechnicianForm({ ...newTechnicianForm, phone: e.target.value })}
                      placeholder="شماره تماس"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tech-department">بخش</Label>
                    <Input
                      id="tech-department"
                      value={newTechnicianForm.department}
                      onChange={(e) => setNewTechnicianForm({ ...newTechnicianForm, department: e.target.value })}
                      placeholder="بخش کاری"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tech-capacity">حداکثر ظرفیت</Label>
                    <Input
                      id="tech-capacity"
                      type="number"
                      value={newTechnicianForm.maxCapacity}
                      onChange={(e) =>
                        setNewTechnicianForm({
                          ...newTechnicianForm,
                          maxCapacity: Number.parseInt(e.target.value) || 10,
                        })
                      }
                      placeholder="حداکثر تعداد تیکت همزمان"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddTechnicianOpen(false)}>
                    انصراف
                  </Button>
                  <Button onClick={handleAddTechnician}>افزودن تکنسین</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {technicians.map((technician) => (
              <Card key={technician.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${technician.isActive ? "bg-green-500" : "bg-red-500"}`} />
                      <div>
                        <CardTitle className="text-lg">{technician.name}</CardTitle>
                        <CardDescription>{technician.email}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={technician.isActive ? "default" : "secondary"}>
                        {technician.isActive ? "فعال" : "غیرفعال"}
                      </Badge>
                      <Badge variant="outline">
                        {technician.workload}/{technician.maxCapacity}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditTechnician(technician)}
                        className="gap-1"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleTechnicianStatus(technician.id)}
                        className="gap-1"
                      >
                        <Shield className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="gap-1 text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent dir="rtl">
                          <AlertDialogHeader>
                            <AlertDialogTitle>حذف تکنسین</AlertDialogTitle>
                            <AlertDialogDescription>
                              آیا از حذف این تکنسین اطمینان دارید؟ این عمل قابل بازگشت نیست.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>انصراف</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteTechnician(technician.id)}>
                              حذف
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">شماره تماس:</span>
                      <div>{technician.phone || "وارد نشده"}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">بخش:</span>
                      <div>{technician.department || "وارد نشده"}</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">بار کاری:</span>
                      <div>
                        {technician.workload} از {technician.maxCapacity}
                      </div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">تاریخ عضویت:</span>
                      <div>{new Date(technician.createdAt).toLocaleDateString("fa-IR")}</div>
                    </div>
                  </div>
                  {technician.specialties.length > 0 && (
                    <div className="mt-4">
                      <span className="text-sm text-muted-foreground">تخصص‌ها:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {technician.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <CategoryManagement categoriesData={categoriesData} onCategoriesUpdate={onCategoriesUpdate} />
        </TabsContent>

        <TabsContent value="assignment">
          <AdminTechnicianAssignment
            tickets={tickets}
            technicians={technicians}
            onTicketUpdate={onTicketUpdate}
            onTechnicianUpdate={onTechnicianUpdate}
          />
        </TabsContent>

        <TabsContent value="auto-assignment">
          <EnhancedAutoAssignment
            tickets={tickets}
            technicians={technicians}
            categoriesData={categoriesData}
            onTicketUpdate={onTicketUpdate}
            onTechnicianUpdate={onTechnicianUpdate}
          />
        </TabsContent>
      </Tabs>

      {/* Edit Technician Dialog */}
      <Dialog open={isEditTechnicianOpen} onOpenChange={setIsEditTechnicianOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>ویرایش تکنسین</DialogTitle>
            <DialogDescription>اطلاعات تکنسین را ویرایش کنید</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-tech-name">نام و نام خانوادگی</Label>
              <Input
                id="edit-tech-name"
                value={newTechnicianForm.name}
                onChange={(e) => setNewTechnicianForm({ ...newTechnicianForm, name: e.target.value })}
                placeholder="نام تکنسین"
              />
            </div>
            <div>
              <Label htmlFor="edit-tech-email">ایمیل</Label>
              <Input
                id="edit-tech-email"
                type="email"
                value={newTechnicianForm.email}
                onChange={(e) => setNewTechnicianForm({ ...newTechnicianForm, email: e.target.value })}
                placeholder="ایمیل تکنسین"
              />
            </div>
            <div>
              <Label htmlFor="edit-tech-phone">شماره تماس</Label>
              <Input
                id="edit-tech-phone"
                value={newTechnicianForm.phone}
                onChange={(e) => setNewTechnicianForm({ ...newTechnicianForm, phone: e.target.value })}
                placeholder="شماره تماس"
              />
            </div>
            <div>
              <Label htmlFor="edit-tech-department">بخش</Label>
              <Input
                id="edit-tech-department"
                value={newTechnicianForm.department}
                onChange={(e) => setNewTechnicianForm({ ...newTechnicianForm, department: e.target.value })}
                placeholder="بخش کاری"
              />
            </div>
            <div>
              <Label htmlFor="edit-tech-capacity">حداکثر ظرفیت</Label>
              <Input
                id="edit-tech-capacity"
                type="number"
                value={newTechnicianForm.maxCapacity}
                onChange={(e) =>
                  setNewTechnicianForm({ ...newTechnicianForm, maxCapacity: Number.parseInt(e.target.value) || 10 })
                }
                placeholder="حداکثر تعداد تیکت همزمان"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditTechnicianOpen(false)}>
              انصراف
            </Button>
            <Button onClick={handleEditTechnician}>ذخیره تغییرات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Ticket Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle>پیش‌نمایش تیکت</DialogTitle>
            <DialogDescription>جزئیات کامل تیکت</DialogDescription>
          </DialogHeader>
          {previewTicket && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">شماره تیکت</Label>
                  <div className="text-sm">{previewTicket.id}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">وضعیت</Label>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(previewTicket.status)}`} />
                    <span className="text-sm">{getStatusLabel(previewTicket.status)}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">اولویت</Label>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(previewTicket.priority)}`} />
                    <span className="text-sm">{getPriorityLabel(previewTicket.priority)}</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium">دسته‌بندی</Label>
                  <div className="text-sm">
                    {previewTicket.category} / {previewTicket.subcategory}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">عنوان</Label>
                <div className="text-sm mt-1">{previewTicket.title}</div>
              </div>

              <div>
                <Label className="text-sm font-medium">شرح مشکل</Label>
                <div className="text-sm mt-1 p-3 bg-muted rounded-md">{previewTicket.description}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">نام درخواست‌کننده</Label>
                  <div className="text-sm">{previewTicket.clientName}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">ایمیل</Label>
                  <div className="text-sm">{previewTicket.clientEmail}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">شماره تماس</Label>
                  <div className="text-sm">{previewTicket.clientPhone}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">بخش</Label>
                  <div className="text-sm">{previewTicket.department || "وارد نشده"}</div>
                </div>
              </div>

              {previewTicket.assignedTo && (
                <div>
                  <Label className="text-sm font-medium">تخصیص یافته به</Label>
                  <div className="text-sm">{previewTicket.assignedTo}</div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">تاریخ ایجاد</Label>
                  <div className="text-sm">{new Date(previewTicket.createdAt).toLocaleDateString("fa-IR")}</div>
                </div>
                <div>
                  <Label className="text-sm font-medium">آخرین بروزرسانی</Label>
                  <div className="text-sm">{new Date(previewTicket.updatedAt).toLocaleDateString("fa-IR")}</div>
                </div>
              </div>

              {previewTicket.attachedFiles && previewTicket.attachedFiles.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">فایل‌های پیوست</Label>
                  <div className="space-y-2 mt-1">
                    {previewTicket.attachedFiles.map((file, index) => (
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPreviewOpen(false)}>
              بستن
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
