"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminTicketManagement } from "@/components/admin-ticket-management"
import { CategoryManagement } from "@/components/category-management"
import { EnhancedAutoAssignment } from "@/components/enhanced-auto-assignment"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Ticket,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  FolderTree,
  Zap,
  BarChart3,
  UserCheck,
  Timer,
} from "lucide-react"

interface AdminDashboardProps {
  tickets: any[]
  onTicketUpdate: (ticketId: string, updates: any) => void
  categories: any
  onCategoryUpdate: (categories: any) => void
}

export function AdminDashboard({ tickets, onTicketUpdate, categories, onCategoryUpdate }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Calculate statistics
  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in-progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
    closed: tickets.filter((t) => t.status === "closed").length,
    urgent: tickets.filter((t) => t.priority === "urgent").length,
    unassigned: tickets.filter((t) => !t.assignedTo).length,
    avgResolutionTime: "4.2 ساعت",
    satisfactionRate: "4.7",
  }

  const technicians = [
    { id: "tech-001", name: "علی احمدی", activeTickets: 5, resolvedToday: 3 },
    { id: "tech-002", name: "سارا محمدی", activeTickets: 3, resolvedToday: 2 },
    { id: "tech-003", name: "حسن رضایی", activeTickets: 4, resolvedToday: 1 },
  ]

  return (
    <div className="space-y-6" dir="rtl">
      <div className="text-right">
        <h2 className="text-2xl font-bold">پنل مدیریت</h2>
        <p className="text-muted-foreground">مدیریت کامل سیستم خدمات IT</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            نمای کلی
          </TabsTrigger>
          <TabsTrigger value="tickets" className="gap-2">
            <Ticket className="w-4 h-4" />
            مدیریت تیکت‌ها
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2">
            <FolderTree className="w-4 h-4" />
            دسته‌بندی‌ها
          </TabsTrigger>
          <TabsTrigger value="assignment" className="gap-2">
            <Zap className="w-4 h-4" />
            تخصیص خودکار
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-right">کل تیکت‌ها</CardTitle>
                <Ticket className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-right">{stats.total}</div>
                <p className="text-xs text-muted-foreground text-right">{stats.urgent > 0 && `${stats.urgent} فوری`}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-right">در انتظار</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-right">{stats.open}</div>
                <p className="text-xs text-muted-foreground text-right">{stats.unassigned} تخصیص نیافته</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-right">در حال انجام</CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-right">{stats.inProgress}</div>
                <p className="text-xs text-muted-foreground text-right">میانگین: {stats.avgResolutionTime}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-right">حل شده</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-right">{stats.resolved + stats.closed}</div>
                <p className="text-xs text-muted-foreground text-right">رضایت: {stats.satisfactionRate}/5</p>
              </CardContent>
            </Card>
          </div>

          {/* Performance Overview */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-right flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  عملکرد تکنسین‌ها
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {technicians.map((tech) => (
                    <div key={tech.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="text-right">
                        <p className="font-medium">{tech.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {tech.activeTickets} تیکت فعال • {tech.resolvedToday} حل شده امروز
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">{tech.activeTickets} فعال</Badge>
                        <Badge className="bg-green-100 text-green-800">{tech.resolvedToday} حل شده</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-right flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  آمار سریع
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">میانگین زمان پاسخ</span>
                    <Badge variant="outline">1.2 ساعت</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">میانگین زمان حل</span>
                    <Badge variant="outline">{stats.avgResolutionTime}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">نرخ رضایت</span>
                    <Badge className="bg-green-100 text-green-800">{stats.satisfactionRate}/5</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">تیکت‌های امروز</span>
                    <Badge variant="outline">
                      {tickets.filter((t) => new Date(t.createdAt).toDateString() === new Date().toDateString()).length}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-right flex items-center gap-2">
                <Timer className="w-5 h-5" />
                فعالیت‌های اخیر
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tickets.slice(0, 5).map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-2 border-b last:border-b-0">
                    <div className="text-right">
                      <p className="font-medium text-sm">{ticket.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {ticket.clientName} • {new Date(ticket.updatedAt).toLocaleDateString("fa-IR")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          ticket.status === "open"
                            ? "bg-red-100 text-red-800"
                            : ticket.status === "in-progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : ticket.status === "resolved"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-800"
                        }
                      >
                        {ticket.status === "open"
                          ? "باز"
                          : ticket.status === "in-progress"
                            ? "در حال انجام"
                            : ticket.status === "resolved"
                              ? "حل شده"
                              : "بسته"}
                      </Badge>
                      {ticket.assignedTechnicianName && (
                        <div className="flex items-center gap-1">
                          <UserCheck className="w-3 h-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{ticket.assignedTechnicianName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets">
          <AdminTicketManagement tickets={tickets} onTicketUpdate={onTicketUpdate} categories={categories} />
        </TabsContent>

        <TabsContent value="categories">
          <CategoryManagement categories={categories} onCategoryUpdate={onCategoryUpdate} />
        </TabsContent>

        <TabsContent value="assignment">
          <EnhancedAutoAssignment tickets={tickets} onTicketUpdate={onTicketUpdate} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
