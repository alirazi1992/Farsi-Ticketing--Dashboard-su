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
import { Shield, Wrench, User, Headphones, LogIn, Globe } from "lucide-react"

export default function HomePage() {
  const { user, logout } = useAuth()
  const [showLoginDialog, setShowLoginDialog] = useState(false)

  if (user) {
    return (
      <TicketProvider>
        <div dir="rtl" className="min-h-screen bg-gray-50">
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
                        {user.role === "admin" && "پنل مدیریت"}
                        {user.role === "technician" && "پنل تکنسین"}
                        {user.role === "client" && "پنل کاربری"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      {user.role === "admin" && <Shield className="w-3 h-3" />}
                      {user.role === "technician" && <Wrench className="w-3 h-3" />}
                      {user.role === "client" && <User className="w-3 h-3" />}
                      {user.role === "admin" && "مدیر سیستم"}
                      {user.role === "technician" && "تکنسین"}
                      {user.role === "client" && "کاربر"}
                    </p>
                  </div>
                  <UserMenu />
                </div>
              </div>
            </div>
          </nav>

          {/* Dashboard Content */}
          <main dir="rtl">
            {user.role === "admin" && <AdminDashboard onLogout={logout} />}
            {user.role === "technician" && <TechnicianDashboard onLogout={logout} />}
            {user.role === "client" && <ClientDashboard />}
          </main>
        </div>
      </TicketProvider>
    )
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Headphones className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <h1 className="text-xl font-bold text-gray-900">سیستم مدیریت خدمات IT</h1>
                <p className="text-sm text-gray-600">پلتفرم جامع پشتیبانی فنی</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Globe className="w-4 h-4" />
                <span>فارسی</span>
              </div>
              <Button onClick={() => setShowLoginDialog(true)} className="gap-2">
                <LogIn className="w-4 h-4" />
                ورود به سیستم
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" dir="rtl">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Headphones className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">به سیستم مدیریت خدمات IT خوش آمدید</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            پلتفرم جامع برای مدیریت تیکت‌های پشتیبانی، ارتباط با تکنسین‌ها و پیگیری درخواست‌های فنی
          </p>
          <Button onClick={() => setShowLoginDialog(true)} size="lg" className="gap-2">
            <LogIn className="w-5 h-5" />
            شروع کار با سیستم
          </Button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow" dir="rtl">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-right">پنل کاربری</CardTitle>
              <CardDescription className="text-right">
                ثبت تیکت، پیگیری درخواست‌ها و ارتباط با تیم پشتیبانی
              </CardDescription>
            </CardHeader>
            <CardContent className="text-right">
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2 justify-end">
                  <span>ثبت تیکت‌های پشتیبانی</span>
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </li>
                <li className="flex items-center gap-2 justify-end">
                  <span>پیگیری وضعیت درخواست‌ها</span>
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </li>
                <li className="flex items-center gap-2 justify-end">
                  <span>ارتباط مستقیم با تکنسین‌ها</span>
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow" dir="rtl">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wrench className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-right">پنل تکنسین</CardTitle>
              <CardDescription className="text-right">مدیریت تیکت‌های واگذار شده و ارائه پشتیبانی فنی</CardDescription>
            </CardHeader>
            <CardContent className="text-right">
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2 justify-end">
                  <span>صف کاری هوشمند</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </li>
                <li className="flex items-center gap-2 justify-end">
                  <span>سیستم زمان‌سنجی</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </li>
                <li className="flex items-center gap-2 justify-end">
                  <span>دانش‌نامه فنی</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow" dir="rtl">
            <CardHeader>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-right">پنل مدیریت</CardTitle>
              <CardDescription className="text-right">نظارت بر سیستم، تحلیل عملکرد و مدیریت تیم</CardDescription>
            </CardHeader>
            <CardContent className="text-right">
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2 justify-end">
                  <span>داشبورد تحلیلی</span>
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                </li>
                <li className="flex items-center gap-2 justify-end">
                  <span>تعیین خودکار تکنسین</span>
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                </li>
                <li className="flex items-center gap-2 justify-end">
                  <span>گزارش‌گیری پیشرفته</span>
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Demo Information */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200" dir="rtl">
          <CardHeader>
            <CardTitle className="text-center text-blue-900">حساب‌های نمونه برای تست سیستم</CardTitle>
            <CardDescription className="text-center text-blue-700">
              برای آشنایی با امکانات سیستم، از حساب‌های زیر استفاده کنید
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200 text-right">
                <div className="flex items-center gap-2 justify-end mb-2">
                  <span className="font-semibold text-gray-900">کاربر عادی</span>
                  <User className="w-5 h-5 text-gray-600" />
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <strong>ایمیل:</strong> ahmad@company.com
                  </p>
                  <p>
                    <strong>رمز عبور:</strong> 123456
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200 text-right">
                <div className="flex items-center gap-2 justify-end mb-2">
                  <span className="font-semibold text-gray-900">تکنسین</span>
                  <Wrench className="w-5 h-5 text-green-600" />
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <strong>ایمیل:</strong> ali@company.com
                  </p>
                  <p>
                    <strong>رمز عبور:</strong> 123456
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200 text-right">
                <div className="flex items-center gap-2 justify-end mb-2">
                  <span className="font-semibold text-gray-900">مدیر سیستم</span>
                  <Shield className="w-5 h-5 text-blue-600" />
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <p>
                    <strong>ایمیل:</strong> admin@company.com
                  </p>
                  <p>
                    <strong>رمز عبور:</strong> 123456
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Login Dialog */}
      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} />
    </div>
  )
}
