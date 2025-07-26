"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminTicketManagement } from "@/components/admin-ticket-management"
import { CategoryManagement } from "@/components/category-management"
import { AdminTechnicianAssignment } from "@/components/admin-technician-assignment"
import { EnhancedAutoAssignment } from "@/components/enhanced-auto-assignment"

interface AdminDashboardProps {
  tickets: any[]
  onTicketUpdate: (ticketId: string, updates: any) => void
  categories: any
  onCategoriesUpdate: (categories: any) => void
}

export function AdminDashboard({ tickets, onTicketUpdate, categories, onCategoriesUpdate }: AdminDashboardProps) {
  return (
    <div className="space-y-6" dir="rtl">
      <div className="text-right">
        <h2 className="text-2xl font-bold">پنل مدیریت</h2>
        <p className="text-muted-foreground">مدیریت کامل سیستم تیکتینگ</p>
      </div>

      <Tabs defaultValue="tickets" className="w-full" dir="rtl">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tickets" className="text-right">
            مدیریت تیکت‌ها
          </TabsTrigger>
          <TabsTrigger value="categories" className="text-right">
            دسته‌بندی‌ها
          </TabsTrigger>
          <TabsTrigger value="assignment" className="text-right">
            تخصیص تکنسین‌ها
          </TabsTrigger>
          <TabsTrigger value="auto-assignment" className="text-right">
            تخصیص خودکار
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          <AdminTicketManagement tickets={tickets} onTicketUpdate={onTicketUpdate} />
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <CategoryManagement categories={categories} onCategoriesUpdate={onCategoriesUpdate} />
        </TabsContent>

        <TabsContent value="assignment" className="space-y-4">
          <AdminTechnicianAssignment tickets={tickets} onTicketUpdate={onTicketUpdate} />
        </TabsContent>

        <TabsContent value="auto-assignment" className="space-y-4">
          <EnhancedAutoAssignment />
        </TabsContent>
      </Tabs>
    </div>
  )
}
