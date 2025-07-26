"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { TicketFormStep2 } from "@/components/ticket-form-step2"
import { getCombinedSchema } from "@/lib/validation-schemas"
import type { UploadedFile } from "@/lib/file-upload"

interface TwoStepTicketFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function TwoStepTicketForm({ onSubmit, onCancel }: TwoStepTicketFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [attachedFiles, setAttachedFiles] = useState<UploadedFile[]>([])
  const [step1Data, setStep1Data] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    priority: "medium",
    mainIssue: "",
    subIssue: "",
  })

  // Form for step 1
  const step1Form = useForm({
    resolver: yupResolver(getCombinedSchema(1)),
    defaultValues: step1Data,
  })

  // Form for step 2
  const step2Form = useForm({
    resolver: yupResolver(getCombinedSchema(2)),
    defaultValues: {
      title: "",
      description: "",
      ...step1Data,
    },
  })

  const handleStep1Submit = (data: any) => {
    setStep1Data(data)
    setCurrentStep(2)
    // Update step 2 form with step 1 data
    step2Form.reset({
      title: "",
      description: "",
      ...data,
    })
  }

  const handleStep2Submit = (data: any) => {
    const finalData = {
      ...step1Data,
      ...data,
      attachments: attachedFiles,
      status: "open",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    onSubmit(finalData)
  }

  const handleBack = () => {
    setCurrentStep(1)
  }

  const priorityLabels = {
    low: { label: "کم", color: "bg-green-100 text-green-800" },
    medium: { label: "متوسط", color: "bg-yellow-100 text-yellow-800" },
    high: { label: "بالا", color: "bg-orange-100 text-orange-800" },
    urgent: { label: "فوری", color: "bg-red-100 text-red-800" },
  }

  const issueLabels = {
    hardware: "سخت‌افزار",
    software: "نرم‌افزار",
    network: "شبکه",
    email: "ایمیل",
    security: "امنیت",
    access: "دسترسی",
    training: "آموزش",
    maintenance: "نگهداری",
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4 space-x-reverse">
        <div className={`flex items-center ${currentStep >= 1 ? "text-primary" : "text-muted-foreground"}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            1
          </div>
          <span className="mr-2 text-sm">اطلاعات اولیه</span>
        </div>
        <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        <div className={`flex items-center ${currentStep >= 2 ? "text-primary" : "text-muted-foreground"}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            2
          </div>
          <span className="mr-2 text-sm">جزئیات و ارسال</span>
        </div>
      </div>

      {/* Step 1: Basic Information */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-right">مرحله اول: اطلاعات اولیه</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={step1Form.handleSubmit(handleStep1Submit)} className="space-y-6">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-right">اطلاعات تماس</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-right">نام و نام خانوادگی *</label>
                    <input
                      {...step1Form.register("clientName")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
                      placeholder="نام کامل خود را وارد کنید"
                      dir="rtl"
                    />
                    {step1Form.formState.errors.clientName && (
                      <p className="text-sm text-red-500 text-right">{step1Form.formState.errors.clientName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-right">ایمیل *</label>
                    <input
                      {...step1Form.register("clientEmail")}
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
                      placeholder="example@company.com"
                      dir="rtl"
                    />
                    {step1Form.formState.errors.clientEmail && (
                      <p className="text-sm text-red-500 text-right">
                        {step1Form.formState.errors.clientEmail.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-right">شماره تماس *</label>
                  <input
                    {...step1Form.register("clientPhone")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
                    placeholder="09123456789"
                    dir="rtl"
                  />
                  {step1Form.formState.errors.clientPhone && (
                    <p className="text-sm text-red-500 text-right">{step1Form.formState.errors.clientPhone.message}</p>
                  )}
                </div>
              </div>

              {/* Issue Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-right">انتخاب مشکل</h3>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-right">اولویت *</label>
                  <select
                    {...step1Form.register("priority")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
                    dir="rtl"
                  >
                    <option value="low">کم</option>
                    <option value="medium">متوسط</option>
                    <option value="high">بالا</option>
                    <option value="urgent">فوری</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-right">دسته اصلی مشکل *</label>
                  <select
                    {...step1Form.register("mainIssue")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
                    dir="rtl"
                  >
                    <option value="">انتخاب کنید</option>
                    <option value="hardware">سخت‌افزار</option>
                    <option value="software">نرم‌افزار</option>
                    <option value="network">شبکه</option>
                    <option value="email">ایمیل</option>
                    <option value="security">امنیت</option>
                    <option value="access">دسترسی</option>
                    <option value="training">آموزش</option>
                    <option value="maintenance">نگهداری</option>
                  </select>
                  {step1Form.formState.errors.mainIssue && (
                    <p className="text-sm text-red-500 text-right">{step1Form.formState.errors.mainIssue.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-right">مشکل دقیق *</label>
                  <select
                    {...step1Form.register("subIssue")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
                    dir="rtl"
                  >
                    <option value="">انتخاب کنید</option>
                    <option value="computer-not-working">رایانه کار نمی‌کند</option>
                    <option value="printer-issues">مشکل چاپگر</option>
                    <option value="monitor-problems">مشکل مانیتور</option>
                    <option value="software-crash">نرم‌افزار خراب می‌شود</option>
                    <option value="slow-performance">عملکرد کند</option>
                    <option value="internet-connection">مشکل اتصال اینترنت</option>
                    <option value="wifi-problems">مشکل Wi-Fi</option>
                  </select>
                  {step1Form.formState.errors.subIssue && (
                    <p className="text-sm text-red-500 text-right">{step1Form.formState.errors.subIssue.message}</p>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                  انصراف
                </Button>
                <Button type="submit" className="gap-2">
                  مرحله بعد
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Details */}
      {currentStep === 2 && (
        <div className="space-y-6">
          {/* Summary of Step 1 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-right">خلاصه اطلاعات انتخاب شده</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-right">
                <div>
                  <span className="text-sm text-muted-foreground">اولویت:</span>
                  <Badge className={`mr-2 ${priorityLabels[step1Data.priority as keyof typeof priorityLabels]?.color}`}>
                    {priorityLabels[step1Data.priority as keyof typeof priorityLabels]?.label}
                  </Badge>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">دسته:</span>
                  <span className="mr-2 font-medium">
                    {issueLabels[step1Data.mainIssue as keyof typeof issueLabels]}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">کاربر:</span>
                  <span className="mr-2 font-medium">{step1Data.clientName}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 2 Form */}
          <form onSubmit={step2Form.handleSubmit(handleStep2Submit)}>
            <TicketFormStep2
              control={step2Form.control}
              errors={step2Form.formState.errors}
              selectedIssue={step1Data.mainIssue}
              selectedSubIssue={step1Data.subIssue}
              attachedFiles={attachedFiles}
              onFilesChange={setAttachedFiles}
            />

            {/* Form Actions */}
            <div className="flex justify-between pt-6">
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onCancel}>
                  انصراف
                </Button>
                <Button type="button" variant="outline" onClick={handleBack}>
                  <ChevronRight className="w-4 h-4" />
                  مرحله قبل
                </Button>
              </div>
              <Button type="submit">ارسال تیکت</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
