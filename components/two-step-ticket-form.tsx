"use client"

import { Separator } from "@/components/ui/separator"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import { TicketFormStep1 } from "./ticket-form-step1"
import { TicketFormStep2 } from "./ticket-form-step2"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import type { UploadedFile } from "@/lib/file-upload"
import { ChevronLeft, ChevronRight, CheckCircle, User, FolderOpen, FileText } from "lucide-react"

// Issues data for display labels
const issuesData = {
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

const priorityLabels = {
  low: "کم",
  medium: "متوسط",
  high: "بالا",
  urgent: "فوری",
}

interface TwoStepTicketFormProps {
  onTicketSubmit: (ticketData: any) => void
  categories: any
}

export function TwoStepTicketForm({ onTicketSubmit, categories }: TwoStepTicketFormProps) {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [step1Data, setStep1Data] = useState<any>(null)
  const [attachedFiles, setAttachedFiles] = useState<UploadedFile[]>([])

  const handleStep1Complete = (data: any) => {
    setStep1Data(data)
    setCurrentStep(2)
  }

  const handleStep2Complete = (step2Data: any) => {
    const completeTicketData = {
      ...step1Data,
      ...step2Data,
      id: Date.now().toString(),
      status: "open",
      createdAt: new Date().toISOString(),
      responses: [],
      attachments: attachedFiles,
    }
    onTicketSubmit(completeTicketData)

    // Reset form
    setCurrentStep(1)
    setStep1Data(null)
    setAttachedFiles([])
  }

  const handleBackToStep1 = () => {
    setCurrentStep(1)
  }

  const renderContactInfo = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-right">
          <User className="w-5 h-5" />
          اطلاعات تماس
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="clientName" className="text-right">
            نام و نام خانوادگی *
          </Label>
          <input
            type="text"
            id="clientName"
            defaultValue={user?.name || ""}
            placeholder="نام کامل خود را وارد کنید"
            className="text-right"
            dir="rtl"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="clientEmail" className="text-right">
              ایمیل *
            </Label>
            <input
              type="email"
              id="clientEmail"
              defaultValue={user?.email || ""}
              placeholder="email@example.com"
              className="text-right"
              dir="rtl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientPhone" className="text-right">
              شماره تماس *
            </Label>
            <input
              type="text"
              id="clientPhone"
              defaultValue={user?.phone || ""}
              placeholder="09123456789"
              className="text-right"
              dir="rtl"
            />
          </div>
        </div>

        {user && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800 text-right">
              <strong>توجه:</strong> اطلاعات تماس از پروفایل شما تکمیل شده است. در صورت نیاز می‌توانید آن‌ها را ویرایش
              کنید.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )

  const renderSummary = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-right">
          <CheckCircle className="w-5 h-5" />
          خلاصه انتخاب‌های شما
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Contact Information */}
        <div className="space-y-2">
          <h4 className="font-medium text-right flex items-center gap-2">
            <User className="w-4 h-4" />
            اطلاعات تماس
          </h4>
          <div className="bg-gray-50 rounded-lg p-3 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">نام:</span>
              <span className="text-sm font-medium">{step1Data?.clientName || "وارد نشده"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">تلفن:</span>
              <span className="text-sm font-medium">{step1Data?.clientPhone || "وارد نشده"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">ایمیل:</span>
              <span className="text-sm font-medium">{step1Data?.clientEmail || "وارد نشده"}</span>
            </div>
          </div>
        </div>

        <Separator />

        {/* Issue Information */}
        <div className="space-y-2">
          <h4 className="font-medium text-right flex items-center gap-2">
            <FolderOpen className="w-4 h-4" />
            اطلاعات مشکل
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">اولویت:</span>
              <span className="text-sm font-medium">
                {step1Data?.priority ? priorityLabels[step1Data.priority] : "انتخاب نشده"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">مشکل اصلی:</span>
              <span className="text-sm font-medium">
                {step1Data?.mainIssue && issuesData[step1Data.mainIssue]
                  ? issuesData[step1Data.mainIssue].label
                  : "انتخاب نشده"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">زیر دسته:</span>
              <span className="text-sm font-medium">
                {step1Data?.mainIssue &&
                step1Data?.subIssue &&
                issuesData[step1Data.mainIssue]?.subIssues[step1Data.subIssue]
                  ? issuesData[step1Data.mainIssue].subIssues[step1Data.subIssue]
                  : "انتخاب نشده"}
              </span>
            </div>
          </div>
        </div>

        {currentStep === 2 && step1Data?.title && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium text-right flex items-center gap-2">
                <FileText className="w-4 h-4" />
                جزئیات تیکت
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <span className="text-sm text-muted-foreground">عنوان:</span>
                  <span className="text-sm font-medium text-right max-w-xs">{step1Data.title}</span>
                </div>
                {step1Data.description && (
                  <div className="flex justify-between items-start">
                    <span className="text-sm text-muted-foreground">شرح:</span>
                    <span className="text-sm text-right max-w-xs line-clamp-3">{step1Data.description}</span>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {attachedFiles.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <h4 className="font-medium text-right">فایل‌های پیوست</h4>
              <div className="space-y-1">
                {attachedFiles.map((file, index) => (
                  <div key={index} className="text-sm text-muted-foreground text-right">
                    • {file.name}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )

  return (
    <Card className="w-full max-w-2xl mx-auto" dir="rtl">
      <CardHeader>
        <CardTitle className="text-center">ثبت تیکت جدید</CardTitle>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>مرحله {currentStep} از 2</span>
            <span>{currentStep === 1 ? "اطلاعات اولیه" : "جزئیات تیکت"}</span>
          </div>
          <Progress value={currentStep * 50} className="w-full" />
        </div>
      </CardHeader>
      <CardContent>
        {currentStep === 1 ? (
          <TicketFormStep1 onNext={handleStep1Complete} initialData={step1Data} categories={categories} />
        ) : (
          <TicketFormStep2
            onSubmit={handleStep2Complete}
            onBack={handleBackToStep1}
            step1Data={step1Data}
            onFilesChange={setAttachedFiles}
          />
        )}
      </CardContent>
      <div className="flex justify-between items-center pt-6 border-t">
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={handleBackToStep1}>
            انصراف
          </Button>
          {currentStep === 2 && (
            <Button type="button" variant="outline" onClick={handleBackToStep1}>
              <ChevronRight className="w-4 h-4 ml-1" />
              مرحله قبل
            </Button>
          )}
        </div>

        <div>
          {currentStep === 1 ? (
            <Button type="button" onClick={handleStep1Complete}>
              مرحله بعد
              <ChevronLeft className="w-4 h-4 mr-1" />
            </Button>
          ) : (
            <Button type="button" onClick={() => handleStep2Complete({})}>
              ثبت تیکت
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}
