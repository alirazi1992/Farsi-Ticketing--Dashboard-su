"use client"

import { useState } from "react"
import { LoginDialog } from "@/components/login-dialog"
import { ClientDashboard } from "@/components/client-dashboard"
import { TechnicianDashboard } from "@/components/technician-dashboard"
import { AdminDashboard } from "@/components/admin-dashboard"
import { UserMenu } from "@/components/user-menu"
import { useAuth } from "@/lib/auth-context"
import { TicketProvider } from "@/lib/ticket-context"
import { Shield, Wrench, User, Headphones } from "lucide-react"

export default function HomePage() {
  const { user, logout } = useAuth()
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  const handleLogout = () => {
    logout()
    setShowLoginDialog(false)
  }

  // Show login dialog if user is not authenticated
  if (!user) {
    return (
      <div
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center font-iran"
        dir="rtl"
      >
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <Headphones className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 font-iran">سیستم مدیریت خدمات IT</h1>
            <p className="text-xl text-gray-600 font-iran">سامانه مدیریت تیکت‌های پشتیبانی فنی</p>
            <div className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg max-w-md mx-auto">
              <p className="text-gray-700 mb-4 font-iran">برای ورود به سیستم، از اطلاعات زیر استفاده کنید:</p>
              <div className="text-sm text-gray-600 space-y-2 font-iran">
                <div className="flex items-center justify-between">
                  <span>کاربر:</span>
                  <span>ahmad@company.com</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>تکنسین:</span>
                  <span>ali@company.com</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>مدیر:</span>
                  <span>admin@company.com</span>
                </div>
                <div className="flex items-center justify-between border-t pt-2 mt-2">
                  <span>رمز عبور:</span>
                  <span>123456</span>
                </div>
              </div>
            </div>
          </div>
          <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 font-iran">
              ورود به سیستم
            </button>
          </LoginDialog>
        </div>
      </div>
    )
  }

  // Show appropriate dashboard based on user role
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
                    <h1 className="text-lg font-bold text-gray-900 font-iran">سیستم مدیریت خدمات IT</h1>
                    <p className="text-xs text-gray-500 font-iran">
                      {user?.role === "admin" && "پنل مدیریت"}
                      {user?.role === "technician" && "پنل تکنسین"}
                      {user?.role === "client" && "پنل کاربری"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 font-iran">{user?.name}</p>
                  <p className="text-xs text-gray-500 flex items-center gap-1 font-iran">
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
          {user?.role === "admin" && <AdminDashboard onLogout={handleLogout} />}
          {user?.role === "technician" && <TechnicianDashboard onLogout={handleLogout} />}
          {user?.role === "client" && <ClientDashboard onLogout={handleLogout} />}
        </main>
      </div>
    </TicketProvider>
  )
}
