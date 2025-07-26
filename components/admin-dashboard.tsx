"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/hooks/use-toast"
import { CategoryManagement } from "./category-management"
import { AutoAssignmentSettings } from "./auto-assignment-settings"
import { AdminTicketManagement } from "./admin-ticket-management"
import { AdminTechnicianAssignment } from "./admin-technician-assignment"
import { BarChart3, Users, Ticket, Clock, CheckCircle, AlertTriangle, UserPlus } from "lucide-react"

interface AdminDashboardProps {
  tickets: any[]
  onTicketUpdate: (ticketId: string, updates: any) => void
  categories: any[]
  onCategoryUpdate: (categories: any[]) => void
}

// Mock technicians data
const mockTechnicians = [
  {
    id: "tech-001",
    name: "علی احمدی",
    email: "ali@company.com",
    specialties: ["network", "hardware"],
    workload: 3,
    isActive: true,
    skills: ["شبکه", "سخت‌افزار", "ویندوز"],
    experience: "5 سال",
  },
  {
    id: "tech-002",
    name: "سارا محمدی",
    email: "sara@company.com",
    specialties: ["software", "email"],
    workload: 2,
    isActive: true,
    skills: ["نرم‌افزار", "ایمیل", "آفیس"],
    experience: "3 سال",
  },
  {
    id: "tech-003",
    name: "حسن رضایی",
    email: "hassan@company.com",
    specialties: ["security", "access"],
    workload: 1,
    isActive: false,
    skills: ["امنیت", "دسترسی", "فایروال"],
    experience: "7 سال",
  },
]

export function AdminDashboard({
  tickets = [],
  onTicketUpdate,
  categories = [],
  onCategoryUpdate,
}: AdminDashboardProps) {
  const [technicians, setTechnicians] = useState(mockTechnicians)
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [newTechnicianDialog, setNewTechnicianDialog] = useState(false)

  // Safe array operations
  const safeTickets = Array.isArray(tickets) ? tickets : []
  const safeCategories = Array.isArray(categories) ? categories : []

  // Calculate statistics
  const stats = {
    total: safeTickets.length,
    open: safeTickets.filter((t) => t.status === "open").length,
    inProgress: safeTickets.filter((t) => t.status === "in-progress").length,
    resolved: safeTickets.filter((t) => t.status === "resolved").length,
    urgent: safeTickets.filter((t) => t.priority === "urgent").length,
    high: safeTickets.filter((t) => t.priority === "high").length,
    medium: safeTickets.filter((t) => t.priority === "medium").length,
    low: safeTickets.filter((t) => t.priority === "low").length,
  }

  const handleTicketPreview = (ticket: any) => {
    setSelectedTicket(ticket)
    setPreviewDialogOpen(true)
  }

  const handleAddTechnician = (formData: FormData) => {
    const newTechnician = {
      id: `tech-${Date.now()}`,
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      specialties: (formData.get("specialties") as string).split(",").map((s) => s.trim()),
      workload: 0,
      isActive: true,
      skills: (formData.get("skills") as string).split(",").map((s) => s.trim()),
      experience: formData.get("experience") as string,
    }

    setTechnicians([...technicians, newTechnician])
    setNewTechnicianDialog(false)

    toast({
      title: "تکنسین اضافه شد",
      description: `تکنسین "${newTechnician.name}" با موفقیت اضافه شد`,
    })
  }

  const handleTechnicianUpdate = (technicianId: string, updates: any) => {
    setTechnicians(technicians.map((tech) => (tech.id === technicianId ? { ...tech, ...updates } : tech)))
  }

  const handleTechnicianDelete = (technicianId: string) => {
    setTechnicians(technicians.filter((tech) => tech.id !== technicianId))
    toast({
      title: "تکنسین حذف شد",
      description: "تکنسین با موفقیت حذف شد",
    })
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">کل تیکت‌ها</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Ticket className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">باز</p>
                <p className="text-2xl font-bold text-red-600">{stats.open}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">در حال انجام</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">حل شده</p>
                <p className="text-2xl font-bold text-green-600">{stats.resolved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Priority Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            آمار اولویت‌ها
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{stats.urgent}</div>
              <div className="text-sm text-muted-foreground">فوری</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.high}</div>
              <div className="text-sm text-muted-foreground">بالا</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{stats.medium}</div>
              <div className="text-sm text-muted-foreground">متوسط</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.low}</div>
              <div className="text-sm text-muted-foreground">پایین</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="tickets" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="tickets">مدیریت تیکت‌ها</TabsTrigger>
          <TabsTrigger value="technicians">تکنسین‌ها</TabsTrigger>
          <TabsTrigger value="categories">دسته‌بندی‌ها</TabsTrigger>
          <TabsTrigger value="assignment">تخصیص خودکار</TabsTrigger>
          <TabsTrigger value="analytics">گزارشات</TabsTrigger>
        </TabsList>

        <TabsContent value="tickets">
          <AdminTicketManagement
            tickets={safeTickets}
            onTicketUpdate={onTicketUpdate}
            onTicketPreview={handleTicketPreview}
          />
        </TabsContent>

        <TabsContent value="technicians">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-right flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  مدیریت تکنسین‌ها
                </CardTitle>
                <Dialog open={newTechnicianDialog} onOpenChange={setNewTechnicianDialog}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <UserPlus className="w-4 h-4" />
                      تکنسین جدید
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]" dir="rtl">
                    <form action={handleAddTechnician}>
                      <DialogHeader>
                        <DialogTitle className="text-right">افزودن تکنسین جدید</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">نام و نام خانوادگی</Label>
                          <Input id="name" name="name" placeholder="نام تکنسین" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">ایمیل</Label>
                          <Input id="email" name="email" type="email" placeholder="email@company.com" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="specialties">تخصص‌ها (با کاما جدا کنید)</Label>
                          <Input
                            id="specialties"
                            name="specialties"
                            placeholder="network, hardware, software"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="skills">مهارت‌ها (با کاما جدا کنید)</Label>
                          <Input id="skills" name="skills" placeholder="شبکه, سخت‌افزار, ویندوز" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="experience">سابقه کار</Label>
                          <Input id="experience" name="experience" placeholder="5 سال" required />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setNewTechnicianDialog(false)}>
                          انصراف
                        </Button>
                        <Button type="submit">افزودن</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <AdminTechnicianAssignment
                technicians={technicians}
                tickets={safeTickets}
                onTechnicianUpdate={handleTechnicianUpdate}
                onTechnicianDelete={handleTechnicianDelete}
                onTicketUpdate={onTicketUpdate}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <CategoryManagement categories={safeCategories} onCategoriesUpdate={onCategoryUpdate} />
        </TabsContent>

        <TabsContent value="assignment">
          <AutoAssignmentSettings categories={safeCategories} technicians={technicians} />
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="text-right flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                گزارشات و آمار
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-right">آمار کلی</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>میانگین زمان حل مسئله:</span>
                      <span className="font-semibold">2.5 روز</span>
                    </div>
                    <div className="flex justify-between">
                      <span>نرخ رضایت کاربران:</span>
                      <span className="font-semibold">85%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>تیکت‌های حل شده امروز:</span>
                      <span className="font-semibold">{Math.floor(stats.resolved * 0.1)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-right">عملکرد تکنسین‌ها</h3>
                  <div className="space-y-2">
                    {technicians
                      .filter((t) => t.isActive)
                      .map((tech) => (
                        <div key={tech.id} className="flex justify-between items-center">
                          <span>{tech.name}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{tech.workload} تیکت</Badge>
                            <Badge variant={tech.workload > 2 ? "destructive" : "default"}>
                              {tech.workload > 2 ? "پرکار" : "عادی"}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Ticket Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">پیش‌نمایش تیکت</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>شماره تیکت</Label>
                  <p className="font-semibold">{selectedTicket.id}</p>
                </div>
                <div>
                  <Label>وضعیت</Label>
                  <Badge
                    variant={
                      selectedTicket.status === "resolved"
                        ? "default"
                        : selectedTicket.status === "in-progress"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {selectedTicket.status === "open"
                      ? "باز"
                      : selectedTicket.status === "in-progress"
                        ? "در حال انجام"
                        : "حل شده"}
                  </Badge>
                </div>
              </div>

              <div>
                <Label>عنوان</Label>
                <p className="font-semibold">{selectedTicket.title}</p>
              </div>

              <div>
                <Label>توضیحات</Label>
                <p className="text-sm text-muted-foreground">{selectedTicket.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>اولویت</Label>
                  <Badge
                    variant={
                      selectedTicket.priority === "urgent"
                        ? "destructive"
                        : selectedTicket.priority === "high"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {selectedTicket.priority === "urgent"
                      ? "فوری"
                      : selectedTicket.priority === "high"
                        ? "بالا"
                        : selectedTicket.priority === "medium"
                          ? "متوسط"
                          : "پایین"}
                  </Badge>
                </div>
                <div>
                  <Label>دسته‌بندی</Label>
                  <p>{selectedTicket.category}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>درخواست‌کننده</Label>
                  <p>{selectedTicket.clientName}</p>
                </div>
                <div>
                  <Label>تکنسین مسئول</Label>
                  <p>{selectedTicket.assignedTechnicianName || "تخصیص نیافته"}</p>
                </div>
              </div>

              <div>
                <Label>تاریخ ایجاد</Label>
                <p>{new Date(selectedTicket.createdAt).toLocaleDateString("fa-IR")}</p>
              </div>

              {selectedTicket.responses && selectedTicket.responses.length > 0 && (
                <div>
                  <Label>پاسخ‌ها</Label>
                  <div className="space-y-2 mt-2">
                    {selectedTicket.responses.map((response: any) => (
                      <div key={response.id} className="p-3 bg-muted rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold">{response.author}</span>
                          <span className="text-sm text-muted-foreground">
                            {new Date(response.timestamp).toLocaleDateString("fa-IR")}
                          </span>
                        </div>
                        <p className="text-sm">{response.text}</p>
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
