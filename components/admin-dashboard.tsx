"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminTicketList } from "@/components/admin-ticket-list"
import { AdminTicketManagement } from "@/components/admin-ticket-management"
import { CategoryManagement } from "@/components/category-management"
import { AdminTechnicianAssignment } from "@/components/admin-technician-assignment"
import { EnhancedAutoAssignment } from "@/components/enhanced-auto-assignment"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import {
  Ticket,
  Clock,
  CheckCircle,
  AlertTriangle,
  Settings,
  UserCheck,
  Zap,
  BarChart3,
  List,
  FolderTree,
} from "lucide-react"

const statusColors = {
  open: "#ef4444",
  "in-progress": "#f59e0b",
  resolved: "#10b981",
  closed: "#6b7280",
}

const priorityColors = {
  low: "#3b82f6",
  medium: "#f59e0b",
  high: "#ef4444",
  urgent: "#8b5cf6",
}

interface AdminDashboardProps {
  tickets: any[]
  onTicketUpdate: (ticketId: string, updates: any) => void
  categories: any
  onCategoryUpdate: (categories: any) => void
}

export function AdminDashboard({ tickets, onTicketUpdate, categories, onCategoryUpdate }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Calculate statistics
  const totalTickets = tickets.length
  const openTickets = tickets.filter((t) => t.status === "open").length
  const inProgressTickets = tickets.filter((t) => t.status === "in-progress").length
  const resolvedTickets = tickets.filter((t) => t.status === "resolved").length
  const closedTickets = tickets.filter((t) => t.status === "closed").length
  const unassignedTickets = tickets.filter((t) => !t.assignedTo).length

  // Priority distribution
  const priorityData = [
    { name: "کم", value: tickets.filter((t) => t.priority === "low").length, color: priorityColors.low },
    { name: "متوسط", value: tickets.filter((t) => t.priority === "medium").length, color: priorityColors.medium },
    { name: "بالا", value: tickets.filter((t) => t.priority === "high").length, color: priorityColors.high },
    { name: "فوری", value: tickets.filter((t) => t.priority === "urgent").length, color: priorityColors.urgent },
  ]

  // Status distribution
  const statusData = [
    { name: "باز", value: openTickets, color: statusColors.open },
    { name: "در حال انجام", value: inProgressTickets, color: statusColors["in-progress"] },
    { name: "حل شده", value: resolvedTickets, color: statusColors.resolved },
    { name: "بسته", value: closedTickets, color: statusColors.closed },
  ]

  // Category distribution
  const categoryLabels = {
    hardware: "سخت‌افزار",
    software: "نرم‌افزار",
    network: "شبکه",
    email: "ایمیل",
    security: "امنیت",
    access: "دسترسی",
  }

  const categoryData = Object.keys(categoryLabels).map((key) => ({
    name: categoryLabels[key],
    value: tickets.filter((t) => t.category === key).length,
  }))

  // Weekly trend data (mock data for demonstration)
  const weeklyData = [
    { name: "شنبه", tickets: 12 },
    { name: "یکشنبه", tickets: 19 },
    { name: "دوشنبه", tickets: 15 },
    { name: "سه‌شنبه", tickets: 22 },
    { name: "چهارشنبه", tickets: 18 },
    { name: "پنج‌شنبه", tickets: 25 },
    { name: "جمعه", tickets: 8 },
  ]

  return (
    <div className="space-y-6 font-iran" dir="rtl">
      <div className="flex justify-between items-center">
        <div className="text-right">
          <h2 className="text-2xl font-bold font-iran">پنل مدیریت</h2>
          <p className="text-muted-foreground font-iran">مدیریت کامل سیستم تیکتینگ</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6 font-iran">
          <TabsTrigger value="overview" className="gap-2 font-iran">
            <BarChart3 className="w-4 h-4" />
            آمار کلی
          </TabsTrigger>
          <TabsTrigger value="tickets" className="gap-2 font-iran">
            <List className="w-4 h-4" />
            لیست تیکت‌ها
          </TabsTrigger>
          <TabsTrigger value="management" className="gap-2 font-iran">
            <Settings className="w-4 h-4" />
            مدیریت کامل
          </TabsTrigger>
          <TabsTrigger value="assignment" className="gap-2 font-iran">
            <UserCheck className="w-4 h-4" />
            تخصیص تکنسین
          </TabsTrigger>
          <TabsTrigger value="auto-assignment" className="gap-2 font-iran">
            <Zap className="w-4 h-4" />
            تخصیص خودکار
          </TabsTrigger>
          <TabsTrigger value="categories" className="gap-2 font-iran">
            <FolderTree className="w-4 h-4" />
            دسته‌بندی‌ها
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-right font-iran">کل تیکت‌ها</CardTitle>
                <Ticket className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-right font-iran">{totalTickets}</div>
                <p className="text-xs text-muted-foreground text-right font-iran">
                  +{Math.floor(totalTickets * 0.1)} از ماه گذشته
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-right font-iran">نیاز به توجه</CardTitle>
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-right font-iran">{openTickets + unassignedTickets}</div>
                <p className="text-xs text-muted-foreground text-right font-iran">
                  {unassignedTickets} تیکت تخصیص نیافته
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-right font-iran">در حال انجام</CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-right font-iran">{inProgressTickets}</div>
                <p className="text-xs text-muted-foreground text-right font-iran">
                  {Math.round((inProgressTickets / totalTickets) * 100)}% از کل
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-right font-iran">حل شده</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-right font-iran">{resolvedTickets}</div>
                <p className="text-xs text-muted-foreground text-right font-iran">
                  {Math.round((resolvedTickets / totalTickets) * 100)}% نرخ حل
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-right font-iran">توزیع وضعیت تیکت‌ها</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Priority Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-right font-iran">توزیع اولویت</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={priorityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8">
                      {priorityData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Weekly Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-right font-iran">روند هفتگی</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="tickets" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-right font-iran">توزیع دسته‌بندی تیکت‌ها</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets">
          <AdminTicketList tickets={tickets} onTicketUpdate={onTicketUpdate} />
        </TabsContent>

        <TabsContent value="management">
          <AdminTicketManagement tickets={tickets} onTicketUpdate={onTicketUpdate} />
        </TabsContent>

        <TabsContent value="assignment">
          <AdminTechnicianAssignment tickets={tickets} onTicketUpdate={onTicketUpdate} />
        </TabsContent>

        <TabsContent value="auto-assignment">
          <EnhancedAutoAssignment tickets={tickets} onTicketUpdate={onTicketUpdate} />
        </TabsContent>

        <TabsContent value="categories">
          <CategoryManagement categories={categories} onCategoryUpdate={onCategoryUpdate} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
