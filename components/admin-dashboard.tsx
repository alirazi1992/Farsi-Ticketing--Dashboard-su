"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminTicketManagement } from "@/components/admin-ticket-management"
import { AdminTechnicianAssignment } from "@/components/admin-technician-assignment"
import { CategoryManagement } from "@/components/category-management"
import { AutoAssignmentSettings } from "@/components/auto-assignment-settings"
import { EnhancedAutoAssignment } from "@/components/enhanced-auto-assignment"
import {
  BarChart3,
  Users,
  Ticket,
  Clock,
  CheckCircle,
  AlertTriangle,
  Settings,
  FolderOpen,
  UserCheck,
  Zap,
} from "lucide-react"

interface AdminDashboardProps {
  tickets: any[]
  technicians: any[]
  categories: any
  onTicketUpdate: (ticketId: string, updates: any) => void
  onCategoryUpdate: (categories: any) => void
}

export function AdminDashboard({
  tickets,
  technicians,
  categories,
  onTicketUpdate,
  onCategoryUpdate,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Calculate statistics
  const totalTickets = tickets.length
  const openTickets = tickets.filter((t) => t.status === "open").length
  const inProgressTickets = tickets.filter((t) => t.status === "in-progress").length
  const resolvedTickets = tickets.filter((t) => t.status === "resolved").length
  const urgentTickets = tickets.filter((t) => t.priority === "urgent").length

  const stats = [
    {
      title: "کل تیکت‌ها",
      value: totalTickets,
      icon: Ticket,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "تیکت‌های باز",
      value: openTickets,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "در حال بررسی",
      value: inProgressTickets,
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "حل شده",
      value: resolvedTickets,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "فوری",
      value: urgentTickets,
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ]

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-right">پنل مدیریت</h1>
          <p className="text-muted-foreground text-right">مدیریت تیکت‌ها، تکنسین‌ها و تنظیمات سیستم</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            آمار کلی
          </TabsTrigger>
          <TabsTrigger value="tickets" className="flex items-center gap-2">
            <Ticket className="w-4 h-4" />
            مدیریت تیکت‌ها
          </TabsTrigger>
          <TabsTrigger value="technicians" className="flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            تکنسین‌ها
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4" />
            دسته‌بندی‌ها
          </TabsTrigger>
          <TabsTrigger value="auto-assignment" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            تخصیص خودکار
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            تنظیمات
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground text-right">{stat.title}</p>
                      <p className="text-2xl font-bold text-right">{stat.value}</p>
                    </div>
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Tickets */}
          <Card>
            <CardHeader>
              <CardTitle className="text-right">آخرین تیکت‌ها</CardTitle>
              <CardDescription className="text-right">لیست آخرین تیکت‌های دریافت شده</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tickets.slice(0, 5).map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge
                        variant={
                          ticket.priority === "urgent"
                            ? "destructive"
                            : ticket.priority === "high"
                              ? "default"
                              : ticket.priority === "medium"
                                ? "secondary"
                                : "outline"
                        }
                      >
                        {ticket.priority === "urgent"
                          ? "فوری"
                          : ticket.priority === "high"
                            ? "بالا"
                            : ticket.priority === "medium"
                              ? "متوسط"
                              : "کم"}
                      </Badge>
                      <div className="text-right">
                        <p className="font-medium">{ticket.title}</p>
                        <p className="text-sm text-muted-foreground">{ticket.clientName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          ticket.status === "open"
                            ? "outline"
                            : ticket.status === "in-progress"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {ticket.status === "open" ? "باز" : ticket.status === "in-progress" ? "در حال بررسی" : "حل شده"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets">
          <AdminTicketManagement tickets={tickets} technicians={technicians} onTicketUpdate={onTicketUpdate} />
        </TabsContent>

        <TabsContent value="technicians">
          <AdminTechnicianAssignment tickets={tickets} technicians={technicians} onTicketUpdate={onTicketUpdate} />
        </TabsContent>

        <TabsContent value="categories">
          <CategoryManagement categories={categories} onCategoryUpdate={onCategoryUpdate} />
        </TabsContent>

        <TabsContent value="auto-assignment">
          <EnhancedAutoAssignment
            tickets={tickets}
            technicians={technicians}
            categories={categories}
            onTicketUpdate={onTicketUpdate}
          />
        </TabsContent>

        <TabsContent value="settings">
          <AutoAssignmentSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
