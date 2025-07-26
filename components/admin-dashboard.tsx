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
  Shield,
  LogOut,
  RefreshCw,
  TrendingUp,
  Activity,
  Award,
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
    avgResolutionTime: "2.3 ساعت",
    customerSatisfaction: 92,
    resolutionRate: Math.round((tickets.filter((t) => t.status === "resolved").length / tickets.length) * 100) || 0,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-iran" dir="rtl">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Shield className="w-8 h-8 text-blue-600" />
                <div>
                  <h1 className="text-xl font-bold text-right font-iran">پنل مدیریت</h1>
                  <p className="text-sm text-muted-foreground text-right font-iran">خوش آمدید، {user?.name}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleAutoAssignment}
                disabled={!autoAssignmentEnabled}
                className="flex items-center gap-2 bg-transparent font-iran"
              >
                <Target className="w-4 h-4" />
                تعیین خودکار
              </Button>
              <Button
                variant="outline"
                onClick={handleSmartAssignment}
                disabled={!smartAssignmentEnabled}
                className="flex items-center gap-2 bg-transparent font-iran"
              >
                <Brain className="w-4 h-4" />
                تعیین هوشمند
              </Button>
              <Button variant="outline" size="sm" className="gap-2 bg-transparent font-iran">
                <RefreshCw className="w-4 h-4" />
                به‌روزرسانی
              </Button>
              <Button variant="outline" size="sm" onClick={onLogout} className="gap-2 bg-transparent font-iran">
                <LogOut className="w-4 h-4" />
                خروج
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-right font-iran">کل تیکت‌ها</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-right font-iran">{stats.total}</div>
              <p className="text-xs text-blue-100 text-right font-iran">تعداد کل تیکت‌های سیستم</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-right font-iran">باز</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-right font-iran">{stats.open}</div>
              <p className="text-xs text-red-100 text-right font-iran">تیکت‌های باز</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-right font-iran">در حال انجام</CardTitle>
              <Clock className="h-4 w-4 text-yellow-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-right font-iran">{stats.inProgress}</div>
              <p className="text-xs text-yellow-100 text-right font-iran">تیکت‌های در حال پردازش</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-right font-iran">حل شده</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-right font-iran">{stats.resolved}</div>
              <p className="text-xs text-green-100 text-right font-iran">تیکت‌های حل شده</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-right font-iran">بدون تعیین</CardTitle>
              <UserCheck className="h-4 w-4 text-purple-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-right font-iran">{stats.unassigned}</div>
              <p className="text-xs text-purple-100 text-right font-iran">تیکت‌های بدون تکنسین</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-right font-iran">نرخ حل</CardTitle>
              <Award className="h-4 w-4 text-indigo-100" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-right font-iran">{stats.resolutionRate}%</div>
              <p className="text-xs text-indigo-100 text-right font-iran">درصد حل مسائل</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4" dir="rtl">
          <TabsList className="grid w-full grid-cols-6 bg-white" dir="rtl">
            <TabsTrigger value="overview" className="flex items-center gap-2 font-iran">
              <BarChart3 className="w-4 h-4" />
              نمای کلی
            </TabsTrigger>
            <TabsTrigger value="tickets" className="flex items-center gap-2 font-iran">
              <Ticket className="w-4 h-4" />
              مدیریت تیکت‌ها
            </TabsTrigger>
            <TabsTrigger value="assignment" className="flex items-center gap-2 font-iran">
              <Users className="w-4 h-4" />
              تعیین تکنسین
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2 font-iran">
              <Settings className="w-4 h-4" />
              دسته‌بندی‌ها
            </TabsTrigger>
            <TabsTrigger value="smart-assignment" className="flex items-center gap-2 font-iran">
              <Brain className="w-4 h-4" />
              تعیین هوشمند
            </TabsTrigger>
            <TabsTrigger value="auto-settings" className="flex items-center gap-2 font-iran">
              <Target className="w-4 h-4" />
              تنظیمات خودکار
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Performance Metrics */}
              <Card dir="rtl">
                <CardHeader>
                  <CardTitle className="text-right flex items-center gap-2 font-iran">
                    <TrendingUp className="w-5 h-5" />
                    آمار عملکرد
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-iran">نرخ حل مسئله</span>
                      <span className="text-sm font-medium font-iran">{stats.resolutionRate}%</span>
                    </div>
                    <Progress value={stats.resolutionRate} className="h-2" />

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-iran">رضایت مشتری</span>
                      <span className="text-sm font-medium font-iran">{stats.customerSatisfaction}%</span>
                    </div>
                    <Progress value={stats.customerSatisfaction} className="h-2" />

                    <div className="flex justify-between items-center">
                      <span className="text-sm font-iran">زمان پاسخ متوسط</span>
                      <span className="text-sm font-medium font-iran">{stats.avgResolutionTime}</span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Active Technicians */}
              <Card dir="rtl">
                <CardHeader>
                  <CardTitle className="text-right flex items-center gap-2 font-iran">
                    <Activity className="w-5 h-5" />
                    تکنسین‌های فعال
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-iran">علی احمدی</span>
                      </div>
                      <Badge variant="secondary" className="font-iran">
                        3 تیکت
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm font-iran">محمد حسینی</span>
                      </div>
                      <Badge variant="secondary" className="font-iran">
                        2 تیکت
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm font-iran">سارا قاسمی</span>
                      </div>
                      <Badge variant="secondary" className="font-iran">
                        1 تیکت
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card dir="rtl">
                <CardHeader>
                  <CardTitle className="text-right flex items-center gap-2 font-iran">
                    <Clock className="w-5 h-5" />
                    فعالیت‌های اخیر
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-iran">تیکت جدید از احمد محمدی</p>
                        <p className="text-xs text-muted-foreground font-iran">5 دقیقه پیش</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-iran">تیکت #1234 حل شد</p>
                        <p className="text-xs text-muted-foreground font-iran">15 دقیقه پیش</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-iran">تعیین خودکار انجام شد</p>
                        <p className="text-xs text-muted-foreground font-iran">30 دقیقه پیش</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* System Health */}
            <Card dir="rtl">
              <CardHeader>
                <CardTitle className="text-right flex items-center gap-2 font-iran">
                  <Activity className="w-5 h-5" />
                  وضعیت سیستم
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 font-iran">99.9%</div>
                    <div className="text-sm text-green-700 font-iran">آپتایم سیستم</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 font-iran">1.2s</div>
                    <div className="text-sm text-blue-700 font-iran">زمان پاسخ متوسط</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600 font-iran">156</div>
                    <div className="text-sm text-purple-700 font-iran">تیکت‌های امروز</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600 font-iran">8</div>
                    <div className="text-sm text-orange-700 font-iran">تکنسین‌های آنلاین</div>
                  </div>
                </div>
              </CardContent>
            </Card>
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
