"use client"
import { LoginDialog } from "@/components/login-dialog"
import { ClientDashboard } from "@/components/client-dashboard"
import { TechnicianDashboard } from "@/components/technician-dashboard"
import { AdminDashboard } from "@/components/admin-dashboard"
import { UserMenu } from "@/components/user-menu"
import { useAuth } from "@/lib/auth-context"
import { TicketProvider } from "@/lib/ticket-context"
import { Shield, Wrench, User, Headphones } from "lucide-react"

export default function HomePage() {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center font-iran"
        dir="rtl"
      >
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900 font-iran">سیستم مدیریت خدمات IT</h1>
            <p className="text-xl text-gray-600 font-iran">سامانه مدیریت تیکت‌های پشتیبانی فنی</p>
          </div>
          <LoginDialog />
        </div>
      </div>
    )
  }

  return (
    <TicketProvider>
      <div className="min-h-screen bg-gray-50 font-iran" dir="rtl">
        {/* Top Navigation */}
        <nav className="bg-white shadow-sm border-b" dir="rtl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Headphones className="w-8 h-8 text-blue-600" />
                  <div className="text-right">
                    <h1 className="text-lg font-bold text-gray-900">سیستم مدیریت خدمات IT</h1>
                    <p className="text-xs text-gray-500">
                      {user?.role === "admin" && "پنل مدیریت"}
                      {user?.role === "technician" && "پنل تکنسین"}
                      {user?.role === "client" && "پنل کاربری"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    {user?.role === "admin" && <Shield className="w-3 h-3" />}
                    {user?.role === "technician" && <Wrench className="w-3 h-3" />}
                    {user?.role === "client" && <User className="w-3 h-3" />}
                    {user?.role === "admin" && "مدیر سیستم"}
                    {user?.role === "technician" && "تکنسین"}
                    {user?.role === "client" && "کاربر"}
                  </p>
                </div>
                <UserMenu />
              </div>
            </div>
          </div>
        </nav>

        {/* Dashboard Content */}
        <main dir="rtl">
          {user?.role === "admin" && <AdminDashboard />}
          {user?.role === "technician" && <TechnicianDashboard />}
          {user?.role === "client" && <ClientDashboard />}
        </main>
      </div>
    </TicketProvider>
  )
}
