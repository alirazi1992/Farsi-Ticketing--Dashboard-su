"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminTicketManagement } from "@/components/admin-ticket-management"
import { CategoryManagement } from "@/components/category-management"
import { EnhancedAutoAssignment } from "@/components/enhanced-auto-assignment"
import { Ticket, Clock, CheckCircle, AlertTriangle, BarChart3, Bot, FolderTree } from "lucide-react"

interface AdminDashboardProps {
  tickets: any[]
  categories: any
  onTicketUpdate: (ticketId: string, updates: any) => void
  onCategoryUpdate: (categories: any) => void
  stats: any
}

export function AdminDashboard({ tickets, categories, onTicketUpdate, onCategoryUpdate, stats }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Sample technicians data
  const technicians = [
    {
      id: "tech-001",
      name: "علی احمدی",
      email: "ali@company.com",
      specialties: ["network", "hardware"],
      activeTickets: 3,
      status: "available",
      rating: 4.8,
      completedTickets: 45,
      avgResponseTime: "2.1",
    },
    {
      id: "tech-002",
      name: "سارا محمدی",
      email: "sara@company.com",
      specialties: ["software", "email"],
      activeTickets: 2,
      status: "available",
      rating: 4.9,
      completedTickets: 62,
      avgResponseTime: "1.8",
    },
    {
      id: "tech-003",
      name: "حسن رضایی",
      email: "hassan@company.com",
      specialties: ["security", "access"],
      activeTickets: 1,
      status: "available",
      rating: 4.7,
      completedTickets: 38,
      avgResponseTime: "3.2",
    },
  ]

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">پنل مدیریت</h2>
          <p className="text-muted-foreground">مدیریت کامل سیستم خدمات IT</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
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
          <TabsTrigger value="auto-assign" className="gap-2">
            <Bot className="w-4 h-4" />
            تعیین خودکار
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">کل تیکت‌ها</CardTitle>
                <Ticket className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalTickets}</div>
                <p className="text-xs text-muted-foreground">+12% نسبت به ماه گذشته</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">تیکت‌های باز</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{stats.openTickets}</div>
                <p className="text-xs text-muted-foreground">نیاز به توجه فوری</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">در حال انجام</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.inProgressTickets}</div>
                <p className="text-xs text-muted-foreground">در دست بررسی</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">حل شده</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.resolvedTickets}</div>
                <p className="text-xs text-muted-foreground">میانگین حل: {stats.avgResolutionTime}h</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>فعالیت‌های اخیر</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tickets.slice(0, 5).map((ticket) => (
                    <div key={ticket.id} className="flex items-center gap-4">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <div className="flex-1 text-right">
                        <p className="text-sm font-medium">{ticket.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {ticket.clientName} - {new Date(ticket.createdAt).toLocaleDateString("fa-IR")}
                        </p>
                      </div>
                      <Badge variant={ticket.status === "open" ? "destructive" : "default"}>
                        {ticket.status === "open"
                          ? "باز"
                          : ticket.status === "in-progress"
                            ? "در حال انجام"
                            : ticket.status === "resolved"
                              ? "حل شده"
                              : "بسته"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>عملکرد تکنسین‌ها</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {technicians.map((tech) => (
                    <div key={tech.id} className="flex items-center justify-between">
                      <div className="text-right">
                        <p className="text-sm font-medium">{tech.name}</p>
                        <p className="text-xs text-muted-foreground">{tech.activeTickets} تیکت فعال</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={tech.status === "available" ? "default" : "secondary"}>
                          {tech.status === "available" ? "آزاد" : "مشغول"}
                        </Badge>
                        <div className="text-xs text-muted-foreground">⭐ {tech.rating}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tickets">
          <AdminTicketManagement tickets={tickets} onTicketUpdate={onTicketUpdate} />
        </TabsContent>

        <TabsContent value="categories">
          <CategoryManagement categories={categories} onCategoryUpdate={onCategoryUpdate} />
        </TabsContent>

        <TabsContent value="auto-assign">
          <EnhancedAutoAssignment tickets={tickets} technicians={technicians} onTicketUpdate={onTicketUpdate} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
