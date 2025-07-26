"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginDialog } from "@/components/login-dialog"
import { ClientDashboard } from "@/components/client-dashboard"
import { TechnicianDashboard } from "@/components/technician-dashboard"
import { AdminDashboard } from "@/components/admin-dashboard"
import { UserMenu } from "@/components/user-menu"
import { useAuth } from "@/lib/auth-context"
import { TicketProvider } from "@/lib/ticket-context"
import { Ticket, Users, LogIn, Shield, Wrench, User, Target, Brain } from "lucide-react"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const [loginOpen, setLoginOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" dir="rtl">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" dir="rtl">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Ticket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">سیستم مدیریت خدمات IT</h1>
                  <p className="text-sm text-gray-600">مدیریت تیکت‌های پشتیبانی فنی</p>
                </div>
              </div>
              <Button onClick={() => setLoginOpen(true)} className="gap-2">
                <LogIn className="w-4 h-4" />
                ورود به سیستم
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">مدیریت حرفه‌ای خدمات IT</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              سیستم جامع مدیریت تیکت‌های پشتیبانی با قابلیت تعیین هوشمند و خودکار تکنسین‌ها
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-right">مدیریت کاربران</CardTitle>
                <CardDescription className="text-right">مدیریت کاربران، تکنسین‌ها و مدیران سیستم</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-right">تعیین خودکار</CardTitle>
                <CardDescription className="text-right">تعیین خودکار تکنسین‌ها بر اساس تخصص و بار کاری</CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-right">تعیین هوشمند</CardTitle>
                <CardDescription className="text-right">استفاده از هوش مصنوعی برای تعیین بهترین تکنسین</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* User Types */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-center mb-8">انواع کاربران سیستم</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-gray-600" />
                </div>
                <h4 className="text-lg font-semibold mb-2">کاربر</h4>
                <p className="text-gray-600 text-sm">ثبت تیکت و پیگیری درخواست‌های پشتیبانی</p>
              </div>

              <div className="text-center p-6 bg-green-50 rounded-lg">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wrench className="w-8 h-8 text-green-600" />
                </div>
                <h4 className="text-lg font-semibold mb-2">تکنسین</h4>
                <p className="text-gray-600 text-sm">پردازش و حل تیکت‌های واگذار شده</p>
              </div>

              <div className="text-center p-6 bg-blue-50 rounded-lg">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-lg font-semibold mb-2">مدیر</h4>
                <p className="text-gray-600 text-sm">مدیریت کل سیستم و نظارت بر عملکرد</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-12">
            <p className="text-lg text-gray-600 mb-6">آماده شروع هستید؟</p>
            <Button size="lg" onClick={() => setLoginOpen(true)} className="gap-2">
              <LogIn className="w-5 h-5" />
              ورود به سیستم
            </Button>
          </div>
        </main>

        <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
      </div>
    )
  }

  // Show appropriate dashboard based on user role
  const renderDashboard = () => {
    switch (user.role) {
      case "admin":
        return <AdminDashboard onLogout={() => window.location.reload()} />
      case "engineer":
        return <TechnicianDashboard onLogout={() => window.location.reload()} />
      case "client":
      default:
        return <ClientDashboard onLogout={() => window.location.reload()} />
    }
  }

  return (
    <TicketProvider>
      <div className="min-h-screen bg-gray-50" dir="rtl">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Ticket className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">سیستم مدیریت خدمات IT</h1>
                  <p className="text-sm text-gray-600">
                    خوش آمدید، {user.name} -{" "}
                    {user.role === "admin" ? "مدیر" : user.role === "engineer" ? "تکنسین" : "کاربر"}
                  </p>
                </div>
              </div>
              <UserMenu />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>{renderDashboard()}</main>
      </div>
    </TicketProvider>
  )
}
