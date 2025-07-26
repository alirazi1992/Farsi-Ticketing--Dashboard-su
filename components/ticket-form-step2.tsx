"use client"

import { Controller } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUpload } from "@/components/file-upload"
import { FileText, Paperclip, AlertCircle, Settings, HardDrive, Printer } from "lucide-react"
import type { UploadedFile } from "@/lib/file-upload"

interface TicketFormStep2Props {
  control: any
  errors: any
  selectedIssue?: string
  selectedSubIssue?: string
  attachedFiles?: UploadedFile[]
  onFilesChange: (files: UploadedFile[]) => void
}

export function TicketFormStep2({
  control,
  errors = {},
  selectedIssue = "",
  selectedSubIssue = "",
  attachedFiles = [],
  onFilesChange,
}: TicketFormStep2Props) {
  // Dynamic fields based on selected issue and sub-issue
  const renderDynamicFields = () => {
    if (selectedIssue === "hardware") {
      if (selectedSubIssue === "computer-not-working") {
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-right flex items-center gap-2">
                <HardDrive className="w-4 h-4" />
                اطلاعات تکمیلی رایانه (اختیاری)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="deviceBrand" className="text-right">
                    برند رایانه
                  </Label>
                  <Controller
                    name="deviceBrand"
                    control={control}
                    defaultValue=""
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
                          <SelectItem value="other">سایر</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deviceModel" className="text-right">
                    مدل رایانه
                  </Label>
                  <Controller
                    name="deviceModel"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Input {...field} placeholder="مثال: OptiPlex 7090" className="text-right" dir="rtl" />
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="powerStatus" className="text-right">
                    وضعیت روشن شدن
                  </Label>
                  <Controller
                    name="powerStatus"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="انتخاب وضعیت" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="no-power">هیچ چراغی روشن نمی‌شود</SelectItem>
                          <SelectItem value="power-but-no-display">چراغ روشن می‌شود اما صفحه سیاه است</SelectItem>
                          <SelectItem value="starts-then-shuts">روشن می‌شود اما خاموش می‌شود</SelectItem>
                          <SelectItem value="strange-sounds">صدای عجیب می‌دهد</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastWorking" className="text-right">
                    آخرین بار کی کار می‌کرد؟
                  </Label>
                  <Controller
                    name="lastWorking"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="انتخاب زمان" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="today">امروز صبح</SelectItem>
                          <SelectItem value="yesterday">دیروز</SelectItem>
                          <SelectItem value="few-days">چند روز پیش</SelectItem>
                          <SelectItem value="week">یک هفته پیش</SelectItem>
                          <SelectItem value="longer">بیشتر از یک هفته</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      }

      if (selectedSubIssue === "printer-issues") {
        return (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-right flex items-center gap-2">
                <Printer className="w-4 h-4" />
                اطلاعات تکمیلی چاپگر (اختیاری)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="printerBrand" className="text-right">
                    برند چاپگر
                  </Label>
                  <Controller
                    name="printerBrand"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="انتخاب برند" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hp">HP</SelectItem>
                          <SelectItem value="canon">Canon</SelectItem>
                          <SelectItem value="epson">Epson</SelectItem>
                          <SelectItem value="brother">Brother</SelectItem>
                          <SelectItem value="samsung">Samsung</SelectItem>
                          <SelectItem value="other">سایر</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="printerType" className="text-right">
                    نوع چاپگر
                  </Label>
                  <Controller
                    name="printerType"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="نوع چاپگر" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inkjet">جوهرافشان</SelectItem>
                          <SelectItem value="laser">لیزری</SelectItem>
                          <SelectItem value="multifunction">چندکاره</SelectItem>
                          <SelectItem value="dot-matrix">سوزنی</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="printerProblem" className="text-right">
                  مشکل دقیق چاپگر
                </Label>
                <Controller
                  name="printerProblem"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                      <SelectTrigger className="text-right">
                        <SelectValue placeholder="انتخاب مشکل" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="no-print">اصلاً چاپ نمی‌کند</SelectItem>
                        <SelectItem value="poor-quality">کیفیت چاپ ضعیف</SelectItem>
                        <SelectItem value="paper-jam">کاغذ گیر می‌کند</SelectItem>
                        <SelectItem value="ink-problem">مشکل جوهر یا تونر</SelectItem>
                        <SelectItem value="connection-issue">مشکل اتصال</SelectItem>
                        <SelectItem value="error-message">پیام خطا می‌دهد</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        )
      }

      // Default hardware fields for other sub-issues
      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm text-right flex items-center gap-2">
              <Settings className="w-4 h-4" />
              اطلاعات تکمیلی سخت‌افزار (اختیاری)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="deviceBrand" className="text-right">
                  برند دستگاه
                </Label>
                <Controller
                  name="deviceBrand"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input {...field} placeholder="مثال: HP, Dell, ..." className="text-right" dir="rtl" />
                  )}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deviceModel" className="text-right">
                  مدل دستگاه
                </Label>
                <Controller
                  name="deviceModel"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <Input {...field} placeholder="مدل دقیق دستگاه" className="text-right" dir="rtl" />
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }

    // Return null for other categories to avoid rendering empty cards
    return null
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
              defaultValue=""
              render={({ field }) => (
                <Input {...field} placeholder="عنوان کوتاه و واضح از مشکل" className="text-right" dir="rtl" />
              )}
            />
            {errors?.title && <p className="text-sm text-red-500 text-right">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-right">
              شرح کامل مشکل *
            </Label>
            <Controller
              name="description"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="لطفاً مشکل خود را به تفصیل شرح دهید. چه اتفاقی افتاده؟ چه زمانی شروع شده؟ چه کاری انجام داده‌اید؟"
                  rows={6}
                  className="text-right"
                  dir="rtl"
                />
              )}
            />
            {errors?.description && <p className="text-sm text-red-500 text-right">{errors.description.message}</p>}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-amber-800 text-right">
                <p className="font-medium mb-1">نکات مهم برای شرح مشکل:</p>
                <ul className="list-disc list-inside space-y-1 text-right">
                  <li>زمان دقیق بروز مشکل را ذکر کنید</li>
                  <li>پیام‌های خطا را دقیقاً بنویسید</li>
                  <li>اقداماتی که انجام داده‌اید را شرح دهید</li>
                  <li>تأثیر مشکل بر کار شما را بیان کنید</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Fields Based on Issue Type */}
      {renderDynamicFields()}

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right">
            <Paperclip className="w-5 h-5" />
            پیوست فایل (اختیاری)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload onFilesChange={onFilesChange} maxFiles={5} />
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800 text-right">
              <strong>توصیه:</strong> برای تسریع در حل مشکل، فایل‌های زیر را پیوست کنید:
            </p>
            <ul className="list-disc list-inside mt-2 text-sm text-green-700 text-right space-y-1">
              <li>تصاویر از صفحه خطا یا مشکل</li>
              <li>فایل‌های لاگ مربوطه</li>
              <li>اسکرین‌شات از تنظیمات</li>
              <li>مستندات مرتبط</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
