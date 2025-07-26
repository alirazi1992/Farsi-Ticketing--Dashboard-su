"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminTicketManagement } from "@/components/admin-ticket-management"
import { AdminTechnicianAssignment } from "@/components/admin-technician-assignment"
import { CategoryManagement } from "@/components/category-management"
import { EnhancedAutoAssignment } from "@/components/enhanced-auto-assignment"
import { AutoAssignmentSettings } from "@/components/auto-assignment-settings"
import { useAuth } from "@/lib/auth-context"
import { useTickets } from "@/lib/ticket-context"
import { toast } from "@/hooks/use-toast"
import {
  BarChart3,
  Users,
  Ticket,
  Clock,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  Settings,
  Target,
  Brain,
} from "lucide-react"

interface AdminDashboardProps {
  onLogout: () => void
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const { user } = useAuth()
  const { tickets, updateTicket, assignTicket } = useTickets()
  const [activeTab, setActiveTab] = useState("overview")
  const [autoAssignmentEnabled, setAutoAssignmentEnabled] = useState(true)
  const [smartAssignmentEnabled, setSmartAssignmentEnabled] = useState(true)

  const handleTicketUpdate = (ticketId: string, updates: any) => {
    updateTicket(ticketId, updates)
  }

  const handleAutoAssignment = () => {
    const unassignedTickets = tickets.filter((ticket) => !ticket.assignedTo)
    let assignedCount = 0

    unassignedTickets.forEach((ticket) => {
      // Simple auto-assignment logic
      const availableTechnicians = [
        { id: "tech-001", name: "علی احمدی", specialty: "hardware" },
        { id: "tech-002", name: "محمد حسینی", specialty: "software" },
        { id: "tech-003", name: "سارا قاسمی", specialty: "network" },
      ]

      const suitable = availableTechnicians.find(
        (tech) => tech.specialty === ticket.category || (ticket.category === "email" && tech.specialty === "software"),
      )

      if (suitable) {
        assignTicket(ticket.id, suitable.id, suitable.name)
        assignedCount++
      }
    })

    toast({
      title: "تعیین خودکار انجام شد",
      description: `${assignedCount} تیکت به صورت خودکار تعیین شد`,
    })
  }

  const handleSmartAssignment = () => {
    const unassignedTickets = tickets.filter((ticket) => !ticket.assignedTo)
    let assignedCount = 0

    unassignedTickets.forEach((ticket) => {
      // Smart assignment with AI-like logic
      const technicians = [
        { id: "tech-001", name: "علی احمدی", score: 95, workload: 3 },
        { id: "tech-002", name: "محمد حسینی", score: 88, workload: 2 },
        { id: "tech-003", name: "سارا قاسمی", score: 92, workload: 1 },
      ]

      // Sort by score and workload
      const bestTechnician = technicians.sort((a, b) => b.score - a.score || a.workload - b.workload)[0]

      if (bestTechnician) {
        assignTicket(ticket.id, bestTechnician.id, bestTechnician.name)
        assignedCount++
      }
    })

    toast({
      title: "تعیین هوشمند انجام شد",
      description: `${assignedCount} تیکت با استفاده از الگوریتم هوشمند تعیین شد`,
    })
  }

  // Statistics calculations
  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in-progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
    unassigned: tickets.filter((t) => !t.assignedTo).length,
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-right">پنل مدیریت</h1>
            <p className="text-muted-foreground text-right">مدیریت تیکت‌ها و تکنسین‌ها</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={handleAutoAssignment}
              disabled={!autoAssignmentEnabled}
              className="flex items-center gap-2 bg-transparent"
            >
              <Target className="w-4 h-4" />
              تعیین خودکار
            </Button>
            <Button
              variant="outline"
              onClick={handleSmartAssignment}
              disabled={!smartAssignmentEnabled}
              className="flex items-center gap-2 bg-transparent"
            >
              <Brain className="w-4 h-4" />
              تعیین هوشمند
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-right">کل تیکت‌ها</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-right">{stats.total}</div>
              <p className="text-xs text-muted-foreground text-right">تعداد کل تیکت‌های سیستم</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-right">باز</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-right">{stats.open}</div>
              <p className="text-xs text-muted-foreground text-right">تیکت‌های باز</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-right">در حال انجام</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-right">{stats.inProgress}</div>
              <p className="text-xs text-muted-foreground text-right">تیکت‌های در حال پردازش</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-right">حل شده</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-right">{stats.resolved}</div>
              <p className="text-xs text-muted-foreground text-right">تیکت‌های حل شده</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-right">بدون تعیین</CardTitle>
              <UserCheck className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-right">{stats.unassigned}</div>
              <p className="text-xs text-muted-foreground text-right">تیکت‌های بدون تکنسین</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4" dir="rtl">
          <TabsList className="grid w-full grid-cols-6" dir="rtl">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              نمای کلی
            </TabsTrigger>
            <TabsTrigger value="tickets" className="flex items-center gap-2">
              <Ticket className="w-4 h-4" />
              مدیریت تیکت‌ها
            </TabsTrigger>
            <TabsTrigger value="assignment" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              تعیین تکنسین
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              دسته‌بندی‌ها
            </TabsTrigger>
            <TabsTrigger value="smart-assignment" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              تعیین هوشمند
            </TabsTrigger>
            <TabsTrigger value="auto-settings" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              تنظیمات خودکار
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-right">آمار عملکرد</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">نرخ حل مسئله</span>
                      <span className="text-sm font-medium">85%</span>
                    </div>
                    <Progress value={85} className="h-2" />

                    <div className="flex justify-between items-center">
                      <span className="text-sm">رضایت مشتری</span>
                      <span className="text-sm font-medium">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />

                    <div className="flex justify-between items-center">
                      <span className="text-sm">زمان پاسخ متوسط</span>
                      <span className="text-sm font-medium">2.3 ساعت</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-right">تکنسین‌های فعال</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">علی احمدی</span>
                      </div>
                      <Badge variant="secondary">3 تیکت</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">محمد حسینی</span>
                      </div>
                      <Badge variant="secondary">2 تیکت</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm">سارا قاسمی</span>
                      </div>
                      <Badge variant="secondary">1 تیکت</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tickets">
            <AdminTicketManagement tickets={tickets} onTicketUpdate={handleTicketUpdate} />
          </TabsContent>

          <TabsContent value="assignment">
            <AdminTechnicianAssignment tickets={tickets} onTicketUpdate={handleTicketUpdate} />
          </TabsContent>

          <TabsContent value="categories">
            <CategoryManagement />
          </TabsContent>

          <TabsContent value="smart-assignment">
            <EnhancedAutoAssignment tickets={tickets} onTicketUpdate={handleTicketUpdate} />
          </TabsContent>

          <TabsContent value="auto-settings">
            <AutoAssignmentSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
