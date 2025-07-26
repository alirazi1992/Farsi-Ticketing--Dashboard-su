"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminTicketManagement } from "./admin-ticket-management"
import { CategoryManagement } from "./category-management"
import { AdminTechnicianAssignment } from "./admin-technician-assignment"
import { EnhancedAutoAssignment } from "./enhanced-auto-assignment"
import { Ticket, Settings, BarChart3, Clock, CheckCircle, AlertCircle, FolderOpen, UserCheck, Zap } from "lucide-react"

interface AdminDashboardProps {
  tickets: any[]
  onTicketUpdate: (ticketId: string, updates: any) => void
  categoriesData: any
  onCategoryUpdate: (updatedCategories: any) => void
}

export function AdminDashboard({ tickets, onTicketUpdate, categoriesData, onCategoryUpdate }: AdminDashboardProps) {
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
        return "bg-gray-400"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-500"
      case "high":
        return "bg-orange-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-400"
    }
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="text-right">
        <h1 className="text-3xl font-bold">پنل مدیریت</h1>
        <p className="text-muted-foreground">مدیریت تیکت‌ها، دسته‌بندی‌ها و تنظیمات سیستم</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            آمار کلی
          </TabsTrigger>
          <TabsTrigger value="tickets" className="gap-2">
            <Ticket className="w-4 h-4" />
            مدیریت تیکت‌ها
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2">
            <FolderOpen className="w-4 h-4" />
            مدیریت دسته‌بندی‌ها
          </TabsTrigger>
          <TabsTrigger value="assignment" className="gap-2">
            <UserCheck className="w-4 h-4" />
            تخصیص تکنسین
          </TabsTrigger>
          <TabsTrigger value="auto-assignment" className="gap-2">
            <Zap className="w-4 h-4" />
            تخصیص خودکار
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-right">کل تیکت‌ها</CardTitle>
                <Ticket className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-right">{stats.total}</div>
                <p className="text-xs text-muted-foreground text-right">تمام تیکت‌های ثبت شده</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-right">باز</CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-right text-blue-600">{stats.open}</div>
                <p className="text-xs text-muted-foreground text-right">تیکت‌های جدید</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-right">در حال انجام</CardTitle>
                <Settings className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-right text-yellow-600">{stats.inProgress}</div>
                <p className="text-xs text-muted-foreground text-right">در دست بررسی</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-right">حل شده</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-right text-green-600">{stats.resolved}</div>
                <p className="text-xs text-muted-foreground text-right">مشکل برطرف شده</p>
              </CardContent>
            </Card>
          </div>

          {/* Priority and Assignment Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-right flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  وضعیت اولویت
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <Badge variant="destructive" className="gap-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    فوری
                  </Badge>
                  <span className="font-bold">{stats.urgent}</span>
                </div>
                <div className="flex justify-between items-center">
                  <Badge variant="secondary" className="gap-1">
                    <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                    تخصیص نیافته
                  </Badge>
                  <span className="font-bold">{stats.unassigned}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-right flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  توزیع وضعیت
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { status: "open", label: "باز", count: stats.open, color: "bg-blue-500" },
                  { status: "in-progress", label: "در حال انجام", count: stats.inProgress, color: "bg-yellow-500" },
                  { status: "resolved", label: "حل شده", count: stats.resolved, color: "bg-green-500" },
                  { status: "closed", label: "بسته", count: stats.closed, color: "bg-gray-500" },
                ].map((item) => (
                  <div key={item.status} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <span className="text-sm">{item.label}</span>
                    </div>
                    <span className="font-medium">{item.count}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-right">فعالیت‌های اخیر</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tickets.slice(0, 5).map((ticket) => (
                  <div key={ticket.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-right">
                      <p className="font-medium">{ticket.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {ticket.clientName} • {new Date(ticket.createdAt).toLocaleDateString("fa-IR")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`${getPriorityColor(ticket.priority)} text-white`}>
                        {ticket.priority}
                      </Badge>
                      <Badge variant="outline" className={`${getStatusColor(ticket.status)} text-white`}>
                        {ticket.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets">
          <AdminTicketManagement tickets={tickets} onTicketUpdate={onTicketUpdate} />
        </TabsContent>

        <TabsContent value="categories">
          <CategoryManagement categoriesData={categoriesData} onCategoryUpdate={onCategoryUpdate} />
        </TabsContent>

        <TabsContent value="assignment">
          <AdminTechnicianAssignment tickets={tickets} onTicketUpdate={onTicketUpdate} />
        </TabsContent>

        <TabsContent value="auto-assignment">
          <EnhancedAutoAssignment tickets={tickets} onTicketUpdate={onTicketUpdate} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
