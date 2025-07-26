"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { TicketFormStep1 } from "./ticket-form-step1"
import { TicketFormStep2 } from "./ticket-form-step2"
import { toast } from "@/hooks/use-toast"
import { ChevronRight, Check, FileText, Settings } from "lucide-react"

interface TwoStepTicketFormProps {
  onSubmit: (ticket: any) => void
  categories: any
}

export function TwoStepTicketForm({ onSubmit, categories }: TwoStepTicketFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [step1Data, setStep1Data] = useState<any>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleStep1Complete = (data: any) => {
    setStep1Data(data)
    setCurrentStep(2)
  }

  const handleStep2Complete = async (step2Data: any) => {
    if (!step1Data) {
      toast({
        title: "خطا",
        description: "اطلاعات مرحله اول یافت نشد",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const completeTicket = {
        ...step1Data,
        ...step2Data,
      }

      await onSubmit(completeTicket)

      toast({
        title: "موفقیت",
        description: "تیکت شما با موفقیت ایجاد شد",
      })

      // Reset form
      setCurrentStep(1)
      setStep1Data(null)
    } catch (error) {
      toast({
        title: "خطا",
        description: "خطا در ایجاد تیکت. لطفاً دوباره تلاش کنید",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBackToStep1 = () => {
    setCurrentStep(1)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-iran" dir="rtl">
      {/* Progress Indicator */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= 1 ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300 text-gray-400"
                }`}
              >
                {currentStep > 1 ? <Check className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
              </div>
              <div className="text-right">
                <p className={`font-medium font-iran ${currentStep >= 1 ? "text-blue-600" : "text-gray-400"}`}>
                  مرحله ۱
                </p>
                <p className="text-sm text-muted-foreground font-iran">اطلاعات اصلی</p>
              </div>
            </div>

            <div className="flex-1 mx-4">
              <div className={`h-1 rounded-full ${currentStep > 1 ? "bg-blue-600" : "bg-gray-200"}`} />
            </div>

            <div className="flex items-center gap-4">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= 2 ? "bg-blue-600 border-blue-600 text-white" : "border-gray-300 text-gray-400"
                }`}
              >
                <Settings className="w-5 h-5" />
              </div>
              <div className="text-right">
                <p className={`font-medium font-iran ${currentStep >= 2 ? "text-blue-600" : "text-gray-400"}`}>
                  مرحله ۲
                </p>
                <p className="text-sm text-muted-foreground font-iran">جزئیات تکمیلی</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-right font-iran flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              مرحله ۱: اطلاعات اصلی تیکت
            </CardTitle>
            <p className="text-muted-foreground text-right font-iran">لطفاً اطلاعات اصلی مشکل خود را وارد کنید</p>
          </CardHeader>
          <CardContent>
            <TicketFormStep1 onNext={handleStep1Complete} categories={categories} />
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-right font-iran flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-600" />
                  مرحله ۲: جزئیات تکمیلی
                </CardTitle>
                <p className="text-muted-foreground text-right font-iran mt-2">
                  اطلاعات تکمیلی و فایل‌های مرتبط را اضافه کنید
                </p>
              </div>
              <Button variant="outline" onClick={handleBackToStep1} className="gap-2 font-iran bg-transparent">
                <ChevronRight className="w-4 h-4" />
                بازگشت به مرحله ۱
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* Summary of Step 1 */}
            {step1Data && (
              <div className="mb-6">
                <h3 className="font-medium font-iran mb-3">خلاصه اطلاعات مرحله ۱:</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-iran">عنوان:</span>
                    <span className="font-medium font-iran">{step1Data.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-iran">دسته‌بندی:</span>
                    <Badge variant="secondary" className="font-iran">
                      {step1Data.category}
                    </Badge>
                  </div>
                  {step1Data.subcategory && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground font-iran">زیر دسته:</span>
                      <Badge variant="outline" className="font-iran">
                        {step1Data.subcategory}
                      </Badge>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-iran">اولویت:</span>
                    <Badge
                      className={`font-iran ${
                        step1Data.priority === "urgent"
                          ? "bg-red-100 text-red-800"
                          : step1Data.priority === "high"
                            ? "bg-orange-100 text-orange-800"
                            : step1Data.priority === "medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {step1Data.priority === "urgent"
                        ? "فوری"
                        : step1Data.priority === "high"
                          ? "بالا"
                          : step1Data.priority === "medium"
                            ? "متوسط"
                            : "کم"}
                    </Badge>
                  </div>
                </div>
                <Separator className="my-4" />
              </div>
            )}

            <TicketFormStep2
              onSubmit={handleStep2Complete}
              onBack={handleBackToStep1}
              isSubmitting={isSubmitting}
              step1Data={step1Data}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
