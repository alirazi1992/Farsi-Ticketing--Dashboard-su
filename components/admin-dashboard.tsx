"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CategoryManagement } from "@/components/category-management"
import { AdminTechnicianAssignment } from "@/components/admin-technician-assignment"
import { AutoAssignmentSettings } from "@/components/auto-assignment-settings"
import { EnhancedAutoAssignment } from "@/components/enhanced-auto-assignment"
import { AdminTicketManagement } from "@/components/admin-ticket-management"
import { UserMenu } from "@/components/user-menu"
import { SettingsDialog } from "@/components/settings-dialog"
import {
  Users,
  Ticket,
  Settings,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Activity,
  Zap,
  Target,
  Brain,
  Layers,
} from "lucide-react"

interface AdminDashboardProps {
  tickets: any[]
  categories: any[]
  onTicketUpdate: (ticketId: string, updates: any) => void
  onCategoriesUpdate: (categories: any[]) => void
}

export function AdminDashboard({
  tickets = [],
  categories = [],
  onTicketUpdate,
  onCategoriesUpdate,
}: AdminDashboardProps) {
  const [settingsOpen, setSettingsOpen] = useState(false)

  // Safe array operations
  const safeTickets = Array.isArray(tickets) ? tickets : []
  const safeCategories = Array.isArray(categories) ? categories : []

  // Calculate statistics
  const totalTickets = safeTickets.length
  const openTickets = safeTickets.filter((t) => t?.status === "open").length
  const inProgressTickets = safeTickets.filter((t) => t?.status === "in-progress").length
  const resolvedTickets = safeTickets.filter((t) => t?.status === "resolved").length
  const urgentTickets = safeTickets.filter((t) => t?.priority === "urgent").length

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Settings className="w-4 h-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-semibold">پنل مدیریت</h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => setSettingsOpen(true)}>
              <Settings className="w-4 h-4 ml-2" />
              تنظیمات
            </Button>
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">کل تیکت‌ها</p>
                  <p className="text-2xl font-bold">{totalTickets}</p>
                </div>
                <Ticket className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">باز</p>
                  <p className="text-2xl font-bold text-orange-600">{openTickets}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">در حال انجام</p>
                  <p className="text-2xl font-bold text-blue-600">{inProgressTickets}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">حل شده</p>
                  <p className="text-2xl font-bold text-green-600">{resolvedTickets}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">فوری</p>
                  <p className="text-2xl font-bold text-red-600">{urgentTickets}</p>
                </div>
                <Zap className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="tickets" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="tickets" className="flex items-center gap-2">
              <Ticket className="w-4 h-4" />
              مدیریت تیکت‌ها
            </TabsTrigger>
            <TabsTrigger value="categories" className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              دسته‌بندی‌ها
            </TabsTrigger>
            <TabsTrigger value="assignment" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              تعیین تکنسین
            </TabsTrigger>
            <TabsTrigger value="auto-assignment" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              تعیین خودکار
            </TabsTrigger>
            <TabsTrigger value="enhanced-auto" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              تعیین هوشمند
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              گزارشات
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tickets" className="mt-6">
            <AdminTicketManagement tickets={safeTickets} onTicketUpdate={onTicketUpdate} />
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
            <CategoryManagement categories={safeCategories} onCategoriesUpdate={onCategoriesUpdate} />
          </TabsContent>

          <TabsContent value="assignment" className="mt-6">
            <AdminTechnicianAssignment tickets={safeTickets} onTicketUpdate={onTicketUpdate} />
          </TabsContent>

          <TabsContent value="auto-assignment" className="mt-6">
            <AutoAssignmentSettings tickets={safeTickets} onTicketUpdate={onTicketUpdate} />
          </TabsContent>

          <TabsContent value="enhanced-auto" className="mt-6">
            <EnhancedAutoAssignment tickets={safeTickets} onTicketUpdate={onTicketUpdate} />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-right flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    روند تیکت‌ها
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>امروز</span>
                      <Badge variant="outline">+{Math.floor(Math.random() * 10) + 1}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>این هفته</span>
                      <Badge variant="outline">+{Math.floor(Math.random() * 50) + 20}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>این ماه</span>
                      <Badge variant="outline">+{Math.floor(Math.random() * 200) + 100}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-right flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    عملکرد سیستم
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>میانگین زمان پاسخ</span>
                      <Badge variant="secondary">2.3 ساعت</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>نرخ حل مسئله</span>
                      <Badge variant="secondary">94.2%</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>رضایت مشتریان</span>
                      <Badge variant="secondary">4.7/5</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
    </div>
  )
}
