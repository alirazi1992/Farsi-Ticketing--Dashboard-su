"use client"

import { Controller } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUpload } from "@/components/file-upload"
import { FileText, Paperclip, HardDrive, Monitor, Wifi, Mail, Shield, Key } from "lucide-react"
import type { UploadedFile } from "@/lib/file-upload"

interface TicketFormStep2Props {
  control: any
  errors: any
  category: string
  attachedFiles: UploadedFile[]
  onFilesChange: (files: UploadedFile[]) => void
}

export function TicketFormStep2({ control, errors, category, attachedFiles, onFilesChange }: TicketFormStep2Props) {
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "hardware":
        return <HardDrive className="w-5 h-5" />
      case "software":
        return <Monitor className="w-5 h-5" />
      case "network":
        return <Wifi className="w-5 h-5" />
      case "email":
        return <Mail className="w-5 h-5" />
      case "security":
        return <Shield className="w-5 h-5" />
      case "access":
        return <Key className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  const getCategoryTitle = (cat: string) => {
    switch (cat) {
      case "hardware":
        return "مشکلات سخت‌افزاری"
      case "software":
        return "مشکلات نرم‌افزاری"
      case "network":
        return "مشکلات شبکه"
      case "email":
        return "مشکلات ایمیل"
      case "security":
        return "حوادث امنیتی"
      case "access":
        return "درخواست دسترسی"
      default:
        return "جزئیات تیکت"
    }
  }

  const renderHardwareFields = () => (
    <div className="space-y-4" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="deviceType" className="text-right">
            نوع دستگاه *
          </Label>
          <Controller
            name="deviceType"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="انتخاب نوع دستگاه" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desktop">رایانه رومیزی</SelectItem>
                  <SelectItem value="laptop">لپ‌تاپ</SelectItem>
                  <SelectItem value="printer">چاپگر</SelectItem>
                  <SelectItem value="scanner">اسکنر</SelectItem>
                  <SelectItem value="monitor">مانیتور</SelectItem>
                  <SelectItem value="keyboard">کیبورد</SelectItem>
                  <SelectItem value="mouse">ماوس</SelectItem>
                  <SelectItem value="ups">یو پی اس</SelectItem>
                  <SelectItem value="other">سایر</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.deviceType && <p className="text-sm text-red-500 text-right">{errors.deviceType.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="deviceBrand" className="text-right">
            برند دستگاه *
          </Label>
          <Controller
            name="deviceBrand"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="انتخاب برند" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dell">Dell</SelectItem>
                  <SelectItem value="hp">HP</SelectItem>
                  <SelectItem value="lenovo">Lenovo</SelectItem>
                  <SelectItem value="asus">ASUS</SelectItem>
                  <SelectItem value="acer">Acer</SelectItem>
                  <SelectItem value="apple">Apple</SelectItem>
                  <SelectItem value="samsung">Samsung</SelectItem>
                  <SelectItem value="lg">LG</SelectItem>
                  <SelectItem value="other">سایر</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.deviceBrand && <p className="text-sm text-red-500 text-right">{errors.deviceBrand.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="deviceModel" className="text-right">
            مدل دستگاه *
          </Label>
          <Controller
            name="deviceModel"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="مثال: OptiPlex 7090" className="text-right" dir="rtl" />
            )}
          />
          {errors.deviceModel && <p className="text-sm text-red-500 text-right">{errors.deviceModel.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="serialNumber" className="text-right">
            شماره سریال
          </Label>
          <Controller
            name="serialNumber"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="شماره سریال دستگاه (اختیاری)" className="text-right" dir="rtl" />
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="purchaseDate" className="text-right">
            تاریخ خرید
          </Label>
          <Controller
            name="purchaseDate"
            control={control}
            render={({ field }) => <Input {...field} type="date" className="text-right" dir="rtl" />}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="warrantyStatus" className="text-right">
            وضعیت گارانتی *
          </Label>
          <Controller
            name="warrantyStatus"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="وضعیت گارانتی" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-warranty">تحت گارانتی</SelectItem>
                  <SelectItem value="expired">گارانتی منقضی</SelectItem>
                  <SelectItem value="unknown">نامشخص</SelectItem>
                  <SelectItem value="no-warranty">بدون گارانتی</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.warrantyStatus && <p className="text-sm text-red-500 text-right">{errors.warrantyStatus.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="problemType" className="text-right">
            نوع مشکل *
          </Label>
          <Controller
            name="problemType"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="نوع مشکل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-turning-on">روشن نمی‌شود</SelectItem>
                  <SelectItem value="slow-performance">عملکرد کند</SelectItem>
                  <SelectItem value="hardware-failure">خرابی سخت‌افزار</SelectItem>
                  <SelectItem value="overheating">گرم شدن بیش از حد</SelectItem>
                  <SelectItem value="noise">صدای غیرعادی</SelectItem>
                  <SelectItem value="display-issue">مشکل نمایش</SelectItem>
                  <SelectItem value="connectivity">مشکل اتصال</SelectItem>
                  <SelectItem value="other">سایر</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.problemType && <p className="text-sm text-red-500 text-right">{errors.problemType.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="problemFrequency" className="text-right">
            تکرار مشکل *
          </Label>
          <Controller
            name="problemFrequency"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="تکرار مشکل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="always">همیشه</SelectItem>
                  <SelectItem value="frequently">اغلب اوقات</SelectItem>
                  <SelectItem value="sometimes">گاهی اوقات</SelectItem>
                  <SelectItem value="rarely">به ندرت</SelectItem>
                  <SelectItem value="first-time">اولین بار</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.problemFrequency && (
            <p className="text-sm text-red-500 text-right">{errors.problemFrequency.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="lastWorkingDate" className="text-right">
            آخرین زمان کارکرد صحیح
          </Label>
          <Controller
            name="lastWorkingDate"
            control={control}
            render={({ field }) => <Input {...field} type="date" className="text-right" dir="rtl" />}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="errorCodes" className="text-right">
            کدهای خطا
          </Label>
          <Controller
            name="errorCodes"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="کدهای خطای نمایش داده شده (اختیاری)" className="text-right" dir="rtl" />
            )}
          />
        </div>
      </div>
    </div>
  )

  const renderSoftwareFields = () => (
    <div className="space-y-4" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="softwareName" className="text-right">
            نام نرم‌افزار *
          </Label>
          <Controller
            name="softwareName"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="مثال: Microsoft Office" className="text-right" dir="rtl" />
            )}
          />
          {errors.softwareName && <p className="text-sm text-red-500 text-right">{errors.softwareName.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="softwareVersion" className="text-right">
            نسخه نرم‌افزار
          </Label>
          <Controller
            name="softwareVersion"
            control={control}
            render={({ field }) => <Input {...field} placeholder="مثال: 2021" className="text-right" dir="rtl" />}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="operatingSystem" className="text-right">
            سیستم عامل *
          </Label>
          <Controller
            name="operatingSystem"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="انتخاب سیستم عامل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="windows-11">Windows 11</SelectItem>
                  <SelectItem value="windows-10">Windows 10</SelectItem>
                  <SelectItem value="windows-8">Windows 8</SelectItem>
                  <SelectItem value="windows-7">Windows 7</SelectItem>
                  <SelectItem value="macos">macOS</SelectItem>
                  <SelectItem value="linux">Linux</SelectItem>
                  <SelectItem value="other">سایر</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.operatingSystem && (
            <p className="text-sm text-red-500 text-right">{errors.operatingSystem.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="osVersion" className="text-right">
            نسخه سیستم عامل *
          </Label>
          <Controller
            name="osVersion"
            control={control}
            render={({ field }) => <Input {...field} placeholder="مثال: 22H2" className="text-right" dir="rtl" />}
          />
          {errors.osVersion && <p className="text-sm text-red-500 text-right">{errors.osVersion.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="installationType" className="text-right">
            نوع نصب *
          </Label>
          <Controller
            name="installationType"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="نوع نصب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new-install">نصب جدید</SelectItem>
                  <SelectItem value="update">به‌روزرسانی</SelectItem>
                  <SelectItem value="reinstall">نصب مجدد</SelectItem>
                  <SelectItem value="repair">تعمیر نصب</SelectItem>
                  <SelectItem value="upgrade">ارتقاء</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.installationType && (
            <p className="text-sm text-red-500 text-right">{errors.installationType.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="licenseType" className="text-right">
            نوع لایسنس *
          </Label>
          <Controller
            name="licenseType"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="نوع لایسنس" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="original">اصل</SelectItem>
                  <SelectItem value="trial">آزمایشی</SelectItem>
                  <SelectItem value="free">رایگان</SelectItem>
                  <SelectItem value="educational">آموزشی</SelectItem>
                  <SelectItem value="unknown">نامشخص</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.licenseType && <p className="text-sm text-red-500 text-right">{errors.licenseType.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="problemOccurrence" className="text-right">
          زمان بروز مشکل *
        </Label>
        <Controller
          name="problemOccurrence"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value} dir="rtl">
              <SelectTrigger className="text-right">
                <SelectValue placeholder="زمان بروز مشکل" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="startup">هنگام راه‌اندازی</SelectItem>
                <SelectItem value="during-use">حین استفاده</SelectItem>
                <SelectItem value="shutdown">هنگام خاموش کردن</SelectItem>
                <SelectItem value="specific-function">عملکرد خاص</SelectItem>
                <SelectItem value="random">تصادفی</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.problemOccurrence && (
          <p className="text-sm text-red-500 text-right">{errors.problemOccurrence.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="errorMessage" className="text-right">
          پیام خطا
        </Label>
        <Controller
          name="errorMessage"
          control={control}
          render={({ field }) => (
            <Textarea {...field} placeholder="متن کامل پیام خطا (اختیاری)" rows={3} className="text-right" dir="rtl" />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="affectedFeatures" className="text-right">
          قابلیت‌های تحت تأثیر
        </Label>
        <Controller
          name="affectedFeatures"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder="کدام قابلیت‌ها کار نمی‌کنند؟ (اختیاری)"
              rows={2}
              className="text-right"
              dir="rtl"
            />
          )}
        />
      </div>
    </div>
  )

  const renderNetworkFields = () => (
    <div className="space-y-4" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="connectionType" className="text-right">
            نوع اتصال *
          </Label>
          <Controller
            name="connectionType"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="نوع اتصال" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ethernet">اترنت (کابلی)</SelectItem>
                  <SelectItem value="wifi">Wi-Fi (بی‌سیم)</SelectItem>
                  <SelectItem value="mobile">موبایل</SelectItem>
                  <SelectItem value="vpn">VPN</SelectItem>
                  <SelectItem value="dial-up">Dial-up</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.connectionType && <p className="text-sm text-red-500 text-right">{errors.connectionType.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="networkLocation" className="text-right">
            محل شبکه *
          </Label>
          <Controller
            name="networkLocation"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="مثال: طبقه دوم، اتاق 205" className="text-right" dir="rtl" />
            )}
          />
          {errors.networkLocation && (
            <p className="text-sm text-red-500 text-right">{errors.networkLocation.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="deviceCount" className="text-right">
            تعداد دستگاه‌های متصل *
          </Label>
          <Controller
            name="deviceCount"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="تعداد دستگاه" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">۱ دستگاه</SelectItem>
                  <SelectItem value="2-5">۲ تا ۵ دستگاه</SelectItem>
                  <SelectItem value="6-10">۶ تا ۱۰ دستگاه</SelectItem>
                  <SelectItem value="11-20">۱۱ تا ۲۰ دستگاه</SelectItem>
                  <SelectItem value="20+">بیش از ۲۰ دستگاه</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.deviceCount && <p className="text-sm text-red-500 text-right">{errors.deviceCount.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="internetProvider" className="text-right">
            ارائه‌دهنده اینترنت *
          </Label>
          <Controller
            name="internetProvider"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="ارائه‌دهنده اینترنت" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="irancell">ایرانسل</SelectItem>
                  <SelectItem value="hamrah-e-avval">همراه اول</SelectItem>
                  <SelectItem value="rightel">رایتل</SelectItem>
                  <SelectItem value="shatel">شاتل</SelectItem>
                  <SelectItem value="pishgaman">پیشگامان</SelectItem>
                  <SelectItem value="other">سایر</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.internetProvider && (
            <p className="text-sm text-red-500 text-right">{errors.internetProvider.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="connectionSpeed" className="text-right">
            سرعت اتصال
          </Label>
          <Controller
            name="connectionSpeed"
            control={control}
            render={({ field }) => <Input {...field} placeholder="مثال: 100 Mbps" className="text-right" dir="rtl" />}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ipConfiguration" className="text-right">
            تنظیمات IP *
          </Label>
          <Controller
            name="ipConfiguration"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="تنظیمات IP" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dhcp">خودکار (DHCP)</SelectItem>
                  <SelectItem value="static">دستی (Static)</SelectItem>
                  <SelectItem value="unknown">نامشخص</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.ipConfiguration && (
            <p className="text-sm text-red-500 text-right">{errors.ipConfiguration.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="affectedServices" className="text-right">
          سرویس‌های تحت تأثیر *
        </Label>
        <Controller
          name="affectedServices"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder="مثال: ایمیل، مرورگر وب، فایل سرور، ..."
              rows={2}
              className="text-right"
              dir="rtl"
            />
          )}
        />
        {errors.affectedServices && (
          <p className="text-sm text-red-500 text-right">{errors.affectedServices.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="outageStartTime" className="text-right">
            زمان شروع قطعی
          </Label>
          <Controller
            name="outageStartTime"
            control={control}
            render={({ field }) => <Input {...field} type="datetime-local" className="text-right" dir="rtl" />}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="troubleshootingSteps" className="text-right">
            اقدامات انجام شده
          </Label>
          <Controller
            name="troubleshootingSteps"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="مثال: ریستارت مودم، تغییر کابل" className="text-right" dir="rtl" />
            )}
          />
        </div>
      </div>
    </div>
  )

  const renderEmailFields = () => (
    <div className="space-y-4" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="emailProvider" className="text-right">
            ارائه‌دهنده ایمیل *
          </Label>
          <Controller
            name="emailProvider"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="ارائه‌دهنده ایمیل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="outlook">Outlook</SelectItem>
                  <SelectItem value="gmail">Gmail</SelectItem>
                  <SelectItem value="yahoo">Yahoo</SelectItem>
                  <SelectItem value="exchange">Exchange Server</SelectItem>
                  <SelectItem value="company">ایمیل شرکت</SelectItem>
                  <SelectItem value="other">سایر</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.emailProvider && <p className="text-sm text-red-500 text-right">{errors.emailProvider.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="emailAddress" className="text-right">
            آدرس ایمیل *
          </Label>
          <Controller
            name="emailAddress"
            control={control}
            render={({ field }) => (
              <Input {...field} type="email" placeholder="user@company.com" className="text-right" dir="rtl" />
            )}
          />
          {errors.emailAddress && <p className="text-sm text-red-500 text-right">{errors.emailAddress.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="emailClient" className="text-right">
            کلاینت ایمیل *
          </Label>
          <Controller
            name="emailClient"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="کلاینت ایمیل" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="outlook-app">Outlook App</SelectItem>
                  <SelectItem value="web-browser">مرورگر وب</SelectItem>
                  <SelectItem value="thunderbird">Thunderbird</SelectItem>
                  <SelectItem value="apple-mail">Apple Mail</SelectItem>
                  <SelectItem value="mobile-app">اپلیکیشن موبایل</SelectItem>
                  <SelectItem value="other">سایر</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.emailClient && <p className="text-sm text-red-500 text-right">{errors.emailClient.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="accountType" className="text-right">
            نوع حساب *
          </Label>
          <Controller
            name="accountType"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="نوع حساب" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">شخصی</SelectItem>
                  <SelectItem value="business">کسب‌وکار</SelectItem>
                  <SelectItem value="educational">آموزشی</SelectItem>
                  <SelectItem value="government">دولتی</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.accountType && <p className="text-sm text-red-500 text-right">{errors.accountType.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="problemType" className="text-right">
          نوع مشکل *
        </Label>
        <Controller
          name="problemType"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value} dir="rtl">
              <SelectTrigger className="text-right">
                <SelectValue placeholder="نوع مشکل" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cannot-send">نمی‌توانم ایمیل ارسال کنم</SelectItem>
                <SelectItem value="cannot-receive">ایمیل دریافت نمی‌کنم</SelectItem>
                <SelectItem value="login-issue">مشکل ورود</SelectItem>
                <SelectItem value="sync-issue">مشکل همگام‌سازی</SelectItem>
                <SelectItem value="attachment-issue">مشکل پیوست</SelectItem>
                <SelectItem value="spam-issue">مشکل اسپم</SelectItem>
                <SelectItem value="storage-full">فضای ذخیره‌سازی پر</SelectItem>
                <SelectItem value="other">سایر</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.problemType && <p className="text-sm text-red-500 text-right">{errors.problemType.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="lastSuccessfulAccess" className="text-right">
            آخرین دسترسی موفق
          </Label>
          <Controller
            name="lastSuccessfulAccess"
            control={control}
            render={({ field }) => <Input {...field} type="datetime-local" className="text-right" dir="rtl" />}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="emailSize" className="text-right">
            حجم ایمیل‌ها
          </Label>
          <Controller
            name="emailSize"
            control={control}
            render={({ field }) => <Input {...field} placeholder="مثال: 2 GB" className="text-right" dir="rtl" />}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="serverSettings" className="text-right">
          تنظیمات سرور
        </Label>
        <Controller
          name="serverSettings"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder="تنظیمات SMTP/POP3/IMAP (اختیاری)"
              rows={2}
              className="text-right"
              dir="rtl"
            />
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="errorDetails" className="text-right">
          جزئیات خطا
        </Label>
        <Controller
          name="errorDetails"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder="پیام خطا یا جزئیات بیشتر (اختیاری)"
              rows={3}
              className="text-right"
              dir="rtl"
            />
          )}
        />
      </div>
    </div>
  )

  const renderSecurityFields = () => (
    <div className="space-y-4" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="incidentType" className="text-right">
            نوع حادثه امنیتی *
          </Label>
          <Controller
            name="incidentType"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="نوع حادثه" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="malware">بدافزار/ویروس</SelectItem>
                  <SelectItem value="phishing">فیشینگ</SelectItem>
                  <SelectItem value="data-breach">نقض داده</SelectItem>
                  <SelectItem value="unauthorized-access">دسترسی غیرمجاز</SelectItem>
                  <SelectItem value="suspicious-activity">فعالیت مشکوک</SelectItem>
                  <SelectItem value="password-compromise">نقض رمز عبور</SelectItem>
                  <SelectItem value="social-engineering">مهندسی اجتماعی</SelectItem>
                  <SelectItem value="other">سایر</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.incidentType && <p className="text-sm text-red-500 text-right">{errors.incidentType.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="incidentSeverity" className="text-right">
            شدت حادثه *
          </Label>
          <Controller
            name="incidentSeverity"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="شدت حادثه" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">کم - تأثیر محدود</SelectItem>
                  <SelectItem value="medium">متوسط - تأثیر قابل توجه</SelectItem>
                  <SelectItem value="high">بالا - تأثیر شدید</SelectItem>
                  <SelectItem value="critical">بحرانی - تأثیر گسترده</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.incidentSeverity && (
            <p className="text-sm text-red-500 text-right">{errors.incidentSeverity.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="incidentTime" className="text-right">
          زمان حادثه *
        </Label>
        <Controller
          name="incidentTime"
          control={control}
          render={({ field }) => <Input {...field} type="datetime-local" className="text-right" dir="rtl" />}
        />
        {errors.incidentTime && <p className="text-sm text-red-500 text-right">{errors.incidentTime.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="affectedSystems" className="text-right">
          سیستم‌های تحت تأثیر *
        </Label>
        <Controller
          name="affectedSystems"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder="لیست سیستم‌ها، سرورها یا خدماتی که تحت تأثیر قرار گرفته‌اند"
              rows={2}
              className="text-right"
              dir="rtl"
            />
          )}
        />
        {errors.affectedSystems && <p className="text-sm text-red-500 text-right">{errors.affectedSystems.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dataCompromised" className="text-right">
            وضعیت امنیت داده‌ها *
          </Label>
          <Controller
            name="dataCompromised"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="وضعیت داده‌ها" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="no-compromise">بدون نقض</SelectItem>
                  <SelectItem value="possible-compromise">احتمال نقض</SelectItem>
                  <SelectItem value="confirmed-compromise">نقض تأیید شده</SelectItem>
                  <SelectItem value="unknown">نامشخص</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.dataCompromised && (
            <p className="text-sm text-red-500 text-right">{errors.dataCompromised.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="evidenceAvailable" className="text-right">
            وجود مدرک *
          </Label>
          <Controller
            name="evidenceAvailable"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="وجود مدرک" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">بله - مدرک موجود است</SelectItem>
                  <SelectItem value="partial">جزئی - برخی مدارک</SelectItem>
                  <SelectItem value="no">خیر - مدرک موجود نیست</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.evidenceAvailable && (
            <p className="text-sm text-red-500 text-right">{errors.evidenceAvailable.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="immediateActions" className="text-right">
          اقدامات فوری انجام شده *
        </Label>
        <Controller
          name="immediateActions"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder="اقداماتی که تا کنون انجام داده‌اید"
              rows={3}
              className="text-right"
              dir="rtl"
            />
          )}
        />
        {errors.immediateActions && (
          <p className="text-sm text-red-500 text-right">{errors.immediateActions.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="witnessCount" className="text-right">
            تعداد شاهدان
          </Label>
          <Controller
            name="witnessCount"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="تعداد شاهدان" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">هیچ شاهدی</SelectItem>
                  <SelectItem value="1">۱ شاهد</SelectItem>
                  <SelectItem value="2-5">۲ تا ۵ شاهد</SelectItem>
                  <SelectItem value="5+">بیش از ۵ شاهد</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="suspiciousActivity" className="text-right">
          جزئیات فعالیت مشکوک
        </Label>
        <Controller
          name="suspiciousActivity"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder="توضیح کامل فعالیت مشکوک یا حادثه (اختیاری)"
              rows={3}
              className="text-right"
              dir="rtl"
            />
          )}
        />
      </div>
    </div>
  )

  const renderAccessFields = () => (
    <div className="space-y-4" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="accessType" className="text-right">
            نوع درخواست دسترسی *
          </Label>
          <Controller
            name="accessType"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="نوع درخواست" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new-account">حساب کاربری جدید</SelectItem>
                  <SelectItem value="permission-change">تغییر مجوز</SelectItem>
                  <SelectItem value="system-access">دسترسی سیستم</SelectItem>
                  <SelectItem value="network-access">دسترسی شبکه</SelectItem>
                  <SelectItem value="application-access">دسترسی اپلیکیشن</SelectItem>
                  <SelectItem value="database-access">دسترسی پایگاه داده</SelectItem>
                  <SelectItem value="file-access">دسترسی فایل</SelectItem>
                  <SelectItem value="other">سایر</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.accessType && <p className="text-sm text-red-500 text-right">{errors.accessType.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="targetSystem" className="text-right">
            سیستم مقصد *
          </Label>
          <Controller
            name="targetSystem"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="نام سیستم یا اپلیکیشن" className="text-right" dir="rtl" />
            )}
          />
          {errors.targetSystem && <p className="text-sm text-red-500 text-right">{errors.targetSystem.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="requestedPermissions" className="text-right">
          مجوزهای درخواستی *
        </Label>
        <Controller
          name="requestedPermissions"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder="لیست دقیق مجوزها و دسترسی‌های مورد نیاز"
              rows={3}
              className="text-right"
              dir="rtl"
            />
          )}
        />
        {errors.requestedPermissions && (
          <p className="text-sm text-red-500 text-right">{errors.requestedPermissions.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="businessJustification" className="text-right">
          توجیه کسب‌وکار *
        </Label>
        <Controller
          name="businessJustification"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder="دلیل نیاز به این دسترسی و تأثیر آن بر کار"
              rows={3}
              className="text-right"
              dir="rtl"
            />
          )}
        />
        {errors.businessJustification && (
          <p className="text-sm text-red-500 text-right">{errors.businessJustification.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="managerName" className="text-right">
            نام مدیر مستقیم *
          </Label>
          <Controller
            name="managerName"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="نام و نام خانوادگی مدیر" className="text-right" dir="rtl" />
            )}
          />
          {errors.managerName && <p className="text-sm text-red-500 text-right">{errors.managerName.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="managerEmail" className="text-right">
            ایمیل مدیر *
          </Label>
          <Controller
            name="managerEmail"
            control={control}
            render={({ field }) => (
              <Input {...field} type="email" placeholder="manager@company.com" className="text-right" dir="rtl" />
            )}
          />
          {errors.managerEmail && <p className="text-sm text-red-500 text-right">{errors.managerEmail.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="accessDuration" className="text-right">
            مدت زمان دسترسی *
          </Label>
          <Controller
            name="accessDuration"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="مدت زمان" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="temporary">موقت (کمتر از ۳ ماه)</SelectItem>
                  <SelectItem value="medium-term">میان‌مدت (۳ تا ۱۲ ماه)</SelectItem>
                  <SelectItem value="permanent">دائمی</SelectItem>
                  <SelectItem value="project-based">بر اساس پروژه</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.accessDuration && <p className="text-sm text-red-500 text-right">{errors.accessDuration.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="urgencyReason" className="text-right">
            دلیل فوریت
          </Label>
          <Controller
            name="urgencyReason"
            control={control}
            render={({ field }) => (
              <Input {...field} placeholder="در صورت فوری بودن، دلیل را بنویسید" className="text-right" dir="rtl" />
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="alternativeAccess" className="text-right">
          دسترسی جایگزین
        </Label>
        <Controller
          name="alternativeAccess"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              placeholder="آیا دسترسی جایگزین یا موقتی وجود دارد؟ (اختیاری)"
              rows={2}
              className="text-right"
              dir="rtl"
            />
          )}
        />
      </div>
    </div>
  )

  const renderCategorySpecificFields = () => {
    switch (category) {
      case "hardware":
        return renderHardwareFields()
      case "software":
        return renderSoftwareFields()
      case "network":
        return renderNetworkFields()
      case "email":
        return renderEmailFields()
      case "security":
        return renderSecurityFields()
      case "access":
        return renderAccessFields()
      default:
        return null
    }
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Title and Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right">
            <FileText className="w-5 h-5" />
            عنوان و شرح مشکل
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-right">
              عنوان تیکت *
            </Label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="عنوان کوتاه و واضح از مشکل" className="text-right" dir="rtl" />
              )}
            />
            {errors.title && <p className="text-sm text-red-500 text-right">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-right">
              شرح کامل مشکل *
            </Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="لطفاً مشکل خود را به تفصیل شرح دهید..."
                  rows={5}
                  className="text-right"
                  dir="rtl"
                />
              )}
            />
            {errors.description && <p className="text-sm text-red-500 text-right">{errors.description.message}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Category Specific Fields */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right">
            {getCategoryIcon(category)}
            {getCategoryTitle(category)}
          </CardTitle>
        </CardHeader>
        <CardContent>{renderCategorySpecificFields()}</CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right">
            <Paperclip className="w-5 h-5" />
            پیوست فایل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload onFilesChange={onFilesChange} maxFiles={5} />
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800 text-right">
              <strong>توصیه:</strong> برای تسریع در حل مشکل، تصاویر، فایل‌های لاگ، یا اسکرین‌شات مربوط به مشکل را پیوست
              کنید.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
