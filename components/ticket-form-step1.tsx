"use client"

import { useState, useEffect } from "react"
import { Controller } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, FolderOpen } from "lucide-react"

interface TicketFormStep1Props {
  control: any
  errors: any
  categories?: any // Add categories prop
}

export function TicketFormStep1({ control, errors, categories }: TicketFormStep1Props) {
  // Use categories from props if available, otherwise fall back to hardcoded data
  const issuesData = categories || {
    hardware: {
      label: "مشکلات سخت‌افزاری",
      icon: "💻",
      subIssues: {
        "computer-not-working": "رایانه کار نمی‌کند",
        "printer-issues": "مشکلات چاپگر",
        "monitor-problems": "مشکلات مانیتور",
        "keyboard-mouse": "مشکلات کیبورد و ماوس",
        "network-hardware": "مشکلات سخت‌افزار شبکه",
        "ups-power": "مشکلات برق و UPS",
        "other-hardware": "سایر مشکلات سخت‌افزاری",
      },
    },
    software: {
      label: "مشکلات نرم‌افزاری",
      icon: "🖥️",
      subIssues: {
        "os-issues": "مشکلات سیستم عامل",
        "application-problems": "مشکلات نرم‌افزارهای کاربردی",
        "software-installation": "نصب و حذف نرم‌افزار",
        "license-activation": "مشکلات لایسنس و فعال‌سازی",
        "updates-patches": "به‌روزرسانی‌ها و وصله‌ها",
        "performance-issues": "مشکلات عملکرد نرم‌افزار",
        "other-software": "سایر مشکلات نرم‌افزاری",
      },
    },
    network: {
      label: "مشکلات شبکه و اینترنت",
      icon: "🌐",
      subIssues: {
        "internet-connection": "مشکل اتصال اینترنت",
        "wifi-problems": "مشکلات Wi-Fi",
        "network-speed": "کندی شبکه",
        "vpn-issues": "مشکلات VPN",
        "network-sharing": "مشکلات اشتراک‌گذاری شبکه",
        "firewall-security": "مشکلات فایروال و امنیت",
        "other-network": "سایر مشکلات شبکه",
      },
    },
    email: {
      label: "مشکلات ایمیل",
      icon: "📧",
      subIssues: {
        "cannot-send": "نمی‌توانم ایمیل ارسال کنم",
        "cannot-receive": "ایمیل دریافت نمی‌کنم",
        "login-problems": "مشکل ورود به ایمیل",
        "sync-issues": "مشکلات همگام‌سازی",
        "attachment-problems": "مشکلات پیوست",
        "spam-issues": "مشکلات اسپم",
        "other-email": "سایر مشکلات ایمیل",
      },
    },
    security: {
      label: "مشکلات امنیتی",
      icon: "🔒",
      subIssues: {
        "virus-malware": "ویروس و بدافزار",
        "suspicious-activity": "فعالیت مشکوک",
        "data-breach": "نقض امنیت داده‌ها",
        "phishing-attempt": "تلاش فیشینگ",
        "unauthorized-access": "دسترسی غیرمجاز",
        "password-issues": "مشکلات رمز عبور",
        "other-security": "سایر مشکلات امنیتی",
      },
    },
    access: {
      label: "درخواست‌های دسترسی",
      icon: "🔑",
      subIssues: {
        "new-account": "ایجاد حساب کاربری جدید",
        "permission-change": "تغییر مجوزهای دسترسی",
        "system-access": "دسترسی به سیستم‌ها",
        "application-access": "دسترسی به نرم‌افزارها",
        "network-access": "دسترسی شبکه",
        "file-access": "دسترسی به فایل‌ها",
        "other-access": "سایر درخواست‌های دسترسی",
      },
    },
    training: {
      label: "آموزش و راهنمایی",
      icon: "📚",
      subIssues: {
        "software-training": "آموزش نرم‌افزار",
        "hardware-guidance": "راهنمایی سخت‌افزار",
        "security-awareness": "آگاهی امنیتی",
        "best-practices": "بهترین روش‌های کاری",
        troubleshooting: "آموزش عیب‌یابی",
        documentation: "درخواست مستندات",
        "other-training": "سایر آموزش‌ها",
      },
    },
    maintenance: {
      label: "نگهداری و تعمیرات",
      icon: "🔧",
      subIssues: {
        "preventive-maintenance": "نگهداری پیشگیرانه",
        "repair-request": "درخواست تعمیر",
        "replacement-request": "درخواست تعویض",
        "upgrade-request": "درخواست ارتقاء",
        "cleaning-service": "خدمات نظافت تجهیزات",
        calibration: "کالیبراسیون تجهیزات",
        "other-maintenance": "سایر خدمات نگهداری",
      },
    },
  }

  const [selectedMainIssue, setSelectedMainIssue] = useState("")
  const [availableSubIssues, setAvailableSubIssues] = useState<Record<string, string>>({})

  // Update sub-issues when main issue changes
  useEffect(() => {
    if (selectedMainIssue && issuesData[selectedMainIssue]) {
      setAvailableSubIssues(issuesData[selectedMainIssue].subIssues)
    } else {
      setAvailableSubIssues({})
    }
  }, [selectedMainIssue])

  return (
    <div className="space-y-6" dir="rtl">
      {/* Priority Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right">
            <AlertTriangle className="w-5 h-5" />
            اولویت مشکل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="priority" className="text-right">
              میزان فوریت مشکل شما چقدر است؟ *
            </Label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="انتخاب اولویت" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">
                      <div className="flex items-center gap-2 text-right">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>کم - می‌توانم صبر کنم</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2 text-right">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span>متوسط - در چند روز آینده</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center gap-2 text-right">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>بالا - امروز یا فردا</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="urgent">
                      <div className="flex items-center gap-2 text-right">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span>فوری - الان نیاز دارم</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.priority && <p className="text-sm text-red-500 text-right">{errors.priority.message}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Issue Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right">
            <FolderOpen className="w-5 h-5" />
            انتخاب نوع مشکل
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Issue Selection */}
          <div className="space-y-2">
            <Label htmlFor="mainIssue" className="text-right">
              مشکل شما در کدام دسته قرار می‌گیرد؟ *
            </Label>
            <Controller
              name="mainIssue"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    setSelectedMainIssue(value)
                  }}
                  value={field.value}
                  dir="rtl"
                >
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="انتخاب دسته اصلی مشکل" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(issuesData).map(([key, issue]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2 text-right">
                          <span className="text-lg">{issue.icon}</span>
                          <span>{issue.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.mainIssue && <p className="text-sm text-red-500 text-right">{errors.mainIssue.message}</p>}
          </div>

          {/* Sub Issue Selection */}
          {selectedMainIssue && Object.keys(availableSubIssues).length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="subIssue" className="text-right">
                مشکل دقیق شما چیست؟ *
              </Label>
              <Controller
                name="subIssue"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                    <SelectTrigger className="text-right">
                      <SelectValue placeholder="انتخاب مشکل دقیق" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(availableSubIssues).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          <span className="text-right">{label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.subIssue && <p className="text-sm text-red-500 text-right">{errors.subIssue.message}</p>}
            </div>
          )}

          {/* Help Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 text-right">
              <strong>راهنما:</strong> ابتدا دسته اصلی مشکل خود را انتخاب کنید، سپس از فهرست دوم مشکل دقیق خود را مشخص
              کنید. این کار به ما کمک می‌کند تا بهترین راه‌حل را برای شما پیدا کنیم.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
