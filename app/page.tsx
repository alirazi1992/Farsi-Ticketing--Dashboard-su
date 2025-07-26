"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginDialog } from "@/components/login-dialog"
import { ClientDashboard } from "@/components/client-dashboard"
import { TechnicianDashboard } from "@/components/technician-dashboard"
import { AdminDashboard } from "@/components/admin-dashboard"
import { UserMenu } from "@/components/user-menu"
import { useAuth } from "@/lib/auth-context"
import { TicketProvider } from "@/lib/ticket-context"
import { LogIn, Shield, Wrench, User, Ticket, Clock, CheckCircle } from "lucide-react"

export default function HomePage() {
  const { user, logout } = useAuth()
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  const handleLogin = () => {
    setShowLoginDialog(true)
  }

  const handleLogout = () => {
    logout()
  }

  // If user is logged in, show appropriate dashboard
  if (user) {
    return (
      <TicketProvider>
        <div className="min-h-screen" dir="rtl">
          {/* Top Navigation */}
          <nav className="bg-white shadow-sm border-b" dir="rtl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <UserMenu />
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <h1 className="text-lg font-semibold">سیستم مدیریت خدمات IT</h1>
                    <p className="text-sm text-gray-600">خوش آمدید، {user.name}</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    {user.role === "admin" && <Shield className="w-5 h-5 text-blue-600" />}
                    {user.role === "technician" && <Wrench className="w-5 h-5 text-green-600" />}
                    {user.role === "client" && <User className="w-5 h-5 text-gray-600" />}
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Dashboard Content */}
          {user.role === "client" && <ClientDashboard />}
          {user.role === "technician" && <TechnicianDashboard onLogout={handleLogout} />}
          {user.role === "admin" && <AdminDashboard onLogout={handleLogout} />}
        </div>
      </TicketProvider>
    )
  }

  // Landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100" dir="rtl">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
              <Ticket className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">سیستم مدیریت خدمات IT</h1>
          <p className="text-xl text-gray-600 mb-8">پلتفرم جامع مدیریت تیکت‌های پشتیبانی فنی</p>
          <Button onClick={handleLogin} size="lg" className="gap-2 bg-blue-600 hover:bg-blue-700">
            <LogIn className="w-5 h-5" />
            ورود به سیستم
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center" dir="rtl">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle className="text-right">پنل کاربری</CardTitle>
              <CardDescription className="text-right">
                ثبت و پیگیری تیکت‌های پشتیبانی با رابط کاربری ساده و کاربردی
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2 text-right">
                <li>• ثبت تیکت جدید</li>
                <li>• پیگیری وضعیت درخواست‌ها</li>
                <li>• ارتباط با تکنسین‌ها</li>
                <li>• مشاهده تاریخچه تیکت‌ها</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center" dir="rtl">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Wrench className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle className="text-right">پنل تکنسین</CardTitle>
              <CardDescription className="text-right">
                ابزارهای حرفه‌ای برای مدیریت و حل تیکت‌های واگذار شده
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2 text-right">
                <li>• مدیریت صف کاری</li>
                <li>• ردیابی زمان کار</li>
                <li>• ارتباط با مشتریان</li>
                <li>• گزارش‌گیری عملکرد</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center" dir="rtl">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle className="text-right">پنل مدیریت</CardTitle>
              <CardDescription className="text-right">نظارت کامل بر سیستم و مدیریت تیم پشتیبانی</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-gray-600 space-y-2 text-right">
                <li>• تخصیص هوشمند تیکت‌ها</li>
                <li>• آمار و گزارش‌های جامع</li>
                <li>• مدیریت تکنسین‌ها</li>
                <li>• تنظیمات سیستم</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-16" dir="rtl">
          <h2 className="text-2xl font-bold text-center mb-8">آمار سیستم</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Ticket className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-2">1,247</div>
              <div className="text-gray-600">تیکت‌های پردازش شده</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">94%</div>
              <div className="text-gray-600">نرخ رضایت مشتریان</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-orange-600 mb-2">2.3</div>
              <div className="text-gray-600">ساعت متوسط پاسخ</div>
            </div>
          </div>
        </div>

        {/* Demo Accounts */}
        <Card className="max-w-2xl mx-auto" dir="rtl">
          <CardHeader className="text-center">
            <CardTitle>حساب‌های نمونه برای تست</CardTitle>
            <CardDescription>برای آشنایی با سیستم، از حساب‌های زیر استفاده کنید</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg text-center">
                <User className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <h3 className="font-semibold">کاربر</h3>
                <p className="text-sm text-gray-600 mb-2">ahmad@company.com</p>
                <p className="text-xs text-gray-500">رمز: 123456</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <Wrench className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold">تکنسین</h3>
                <p className="text-sm text-gray-600 mb-2">ali@company.com</p>
                <p className="text-xs text-gray-500">رمز: 123456</p>
              </div>
              <div className="p-4 border rounded-lg text-center">
                <Shield className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold">مدیر</h3>
                <p className="text-sm text-gray-600 mb-2">admin@company.com</p>
                <p className="text-xs text-gray-500">رمز: 123456</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </div>
  )
}
