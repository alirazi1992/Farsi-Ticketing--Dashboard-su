"use client"

import { useState, useMemo } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { ArrowRight, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"

import { TicketFormStep1 } from "@/components/ticket-form-step1"
import { TicketFormStep2 } from "@/components/ticket-form-step2"
import { generalInfoSchema, getCombinedSchema } from "@/lib/validation-schemas"
import type { UploadedFile } from "@/lib/file-upload"

interface TwoStepTicketFormProps {
  onClose: () => void
  onSubmit?: (data: any) => void
}

export function TwoStepTicketForm({ onClose, onSubmit }: TwoStepTicketFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [step1Data, setStep1Data] = useState<any>(null)
  const [attachedFiles, setAttachedFiles] = useState<UploadedFile[]>([])

  const currentValidationSchema = useMemo(() => {
    if (currentStep === 2 && step1Data) {
      return getCombinedSchema(step1Data.mainCategory, step1Data.subCategory)
    }
    return generalInfoSchema
  }, [currentStep, step1Data])

  // Step 1 form
  const step1Form = useForm({
    resolver: yupResolver(generalInfoSchema),
    defaultValues: {
      clientName: "",
      clientPhone: "",
      clientEmail: "",
      clientAddress: "",
      nationalCode: "",
      priority: "",
      mainCategory: "",
      subCategory: "",
    },
  })

  // Step 2 form
  const step2Form = useForm({
    resolver: yupResolver(currentValidationSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  })

  // Generate unique ticket ID
  const generateTicketId = () => {
    const year = new Date().getFullYear()
    const number = Math.floor(Math.random() * 999) + 1
    return `TK-${year}-${number.toString().padStart(3, "0")}`
  }

  const handleStep1Submit = (data: any) => {
    setStep1Data(data)
    setCurrentStep(2)
    step2Form.reset({ ...data, title: "", description: "" })
    toast({
      title: "مرحله اول تکمیل شد",
      description: "لطفاً جزئیات مشکل خود را در مرحله دوم وارد کنید",
    })
  }

  const handleStep2Submit = async (data: any) => {
    try {
      const completeData = {
        ...step1Data,
        ...data,
        id: generateTicketId(),
        attachments: attachedFiles,
        createdAt: new Date().toISOString(),
        status: "open",
      }
      console.log("Complete Ticket Data:", completeData)
      if (onSubmit) {
        onSubmit(completeData)
      }
      toast({
        title: "تیکت با موفقیت ایجاد شد",
        description: `تیکت شما با شماره ${completeData.id} ثبت شد و به زودی بررسی خواهد شد`,
      })
      onClose()
    } catch (error) {
      toast({
        title: "خطا در ایجاد تیکت",
        description: "لطفاً دوباره تلاش کنید",
        variant: "destructive",
      })
    }
  }

  const handleBackToStep1 = () => {
    setCurrentStep(1)
  }

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1:
        return "اطلاعات عمومی"
      case 2:
        return "جزئیات مشکل"
      default:
        return ""
    }
  }

  const getStepDescription = (step: number) => {
    switch (step) {
      case 1:
        return "لطفاً اطلاعات شخصی و اولویت مشکل خود را وارد کنید"
      case 2:
        return "جزئیات تخصصی مربوط به مشکل خود را شرح دهید"
      default:
        return ""
    }
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Progress Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="text-right">
              <CardTitle className="flex items-center gap-2 text-right">
                {currentStep === 1 ? (
                  <AlertCircle className="w-5 h-5 text-blue-500" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                )}
                مرحله {currentStep} از ۲: {getStepTitle(currentStep)}
              </CardTitle>
              <p className="text-muted-foreground mt-1 text-right">{getStepDescription(currentStep)}</p>
            </div>
            <Badge variant="outline" className="text-sm">
              {Math.round((currentStep / 2) * 100)}% تکمیل شده
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>پیشرفت</span>
              <span>{currentStep}/2</span>
            </div>
            <Progress value={(currentStep / 2) * 100} className="h-2" />
          </div>

          <div className="flex justify-between mt-4">
            <div className={`flex items-center gap-2 ${currentStep >= 1 ? "text-green-600" : "text-muted-foreground"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 1 ? "bg-green-100 text-green-600" : "bg-muted text-muted-foreground"
                }`}
              >
                {currentStep > 1 ? <CheckCircle className="w-4 h-4" /> : "1"}
              </div>
              <span className="text-sm">اطلاعات عمومی</span>
            </div>

            <div className={`flex items-center gap-2 ${currentStep >= 2 ? "text-blue-600" : "text-muted-foreground"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 2 ? "bg-blue-100 text-blue-600" : "bg-muted text-muted-foreground"
                }`}
              >
                2
              </div>
              <span className="text-sm">جزئیات مشکل</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Step Content */}
      {currentStep === 1 && (
        <form onSubmit={step1Form.handleSubmit(handleStep1Submit)} className="space-y-6">
          <TicketFormStep1 control={step1Form.control} errors={step1Form.formState.errors} />

          <div className="flex justify-end gap-2 pt-4" dir="rtl">
            <Button type="button" variant="outline" onClick={onClose}>
              انصراف
            </Button>
            <Button type="submit" className="gap-2">
              مرحله بعد
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </div>
        </form>
      )}

      {currentStep === 2 && (
        <form onSubmit={step2Form.handleSubmit(handleStep2Submit)} className="space-y-6">
          <TicketFormStep2
            control={step2Form.control}
            errors={step2Form.formState.errors}
            mainCategory={step1Data?.mainCategory || ""}
            subCategory={step1Data?.subCategory || ""}
            attachedFiles={attachedFiles}
            onFilesChange={setAttachedFiles}
          />

          <div className="flex justify-between gap-2 pt-4" dir="rtl">
            <Button type="button" variant="outline" onClick={handleBackToStep1} className="gap-2 bg-transparent">
              <ArrowRight className="w-4 h-4" />
              مرحله قبل
            </Button>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={onClose}>
                انصراف
              </Button>
              <Button type="submit" disabled={step2Form.formState.isSubmitting} className="gap-2">
                {step2Form.formState.isSubmitting ? "در حال ایجاد..." : "ایجاد تیکت"}
                <CheckCircle className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Summary Card for Step 2 */}
      {currentStep === 2 && step1Data && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-sm text-right">خلاصه اطلاعات وارد شده</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm" dir="rtl">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-right">
                <span className="font-medium">نام:</span> {step1Data.clientName}
              </div>
              <div className="text-right">
                <span className="font-medium">تلفن:</span> {step1Data.clientPhone}
              </div>
              <div className="text-right">
                <span className="font-medium">ایمیل:</span> {step1Data.clientEmail}
              </div>
              <div className="text-right">
                <span className="font-medium">اولویت:</span>
                <Badge className="mr-2" variant="outline">
                  {step1Data.priority === "low" && "کم"}
                  {step1Data.priority === "medium" && "متوسط"}
                  {step1Data.priority === "high" && "بالا"}
                  {step1Data.priority === "urgent" && "فوری"}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <span className="font-medium">دسته‌بندی اصلی:</span>
              <Badge className="mr-2" variant="outline">
                {step1Data.mainCategory}
              </Badge>
            </div>
            <div className="text-right">
              <span className="font-medium">دسته‌بندی فرعی:</span>
              <Badge className="mr-2" variant="outline">
                {step1Data.subCategory}
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
