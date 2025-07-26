"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, Send } from "lucide-react"
import { TicketFormStep1 } from "./ticket-form-step1"
import { TicketFormStep2 } from "./ticket-form-step2"
import { contactInfoSchema, ticketFormStep1Schema, ticketDetailsSchema } from "@/lib/validation-schemas"
import { useToast } from "@/hooks/use-toast"

interface Category {
  id: string
  name: string
  label: string
  icon: string
  subcategories: Array<{
    id: string
    name: string
    label: string
  }>
}

interface TwoStepTicketFormProps {
  categories: Category[]
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function TwoStepTicketForm({ categories, onSubmit, onCancel }: TwoStepTicketFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  // Combined validation schema
  const getValidationSchema = () => {
    const baseSchema = contactInfoSchema.concat(ticketFormStep1Schema)
    if (currentStep === 2) {
      return baseSchema.concat(ticketDetailsSchema)
    }
    return baseSchema
  }

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(getValidationSchema()),
    mode: "onChange",
    defaultValues: {
      // Contact info
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      // Step 1
      priority: "",
      mainIssue: "",
      subIssue: "",
      // Step 2
      title: "",
      description: "",
      // Dynamic fields will be added as needed
    },
  })

  const watchedMainIssue = watch("mainIssue")
  const watchedSubIssue = watch("subIssue")

  const handleNext = async () => {
    const fieldsToValidate = ["clientName", "clientEmail", "clientPhone", "priority", "mainIssue", "subIssue"]
    const isValid = await trigger(fieldsToValidate)

    if (isValid) {
      setCurrentStep(2)
    } else {
      toast({
        title: "خطا در اعتبارسنجی",
        description: "لطفاً تمام فیلدهای الزامی را تکمیل کنید.",
        variant: "destructive",
      })
    }
  }

  const handlePrevious = () => {
    setCurrentStep(1)
  }

  const handleFormSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      await onSubmit(data)
      toast({
        title: "تیکت ایجاد شد",
        description: "تیکت شما با موفقیت ثبت شد و به زودی بررسی خواهد شد.",
      })
    } catch (error) {
      toast({
        title: "خطا در ایجاد تیکت",
        description: "مشکلی در ثبت تیکت رخ داد. لطفاً دوباره تلاش کنید.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const progressValue = (currentStep / 2) * 100

  return (
    <div className="max-w-4xl mx-auto p-6" dir="rtl">
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">ایجاد تیکت جدید</CardTitle>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>مرحله {currentStep} از 2</span>
              <span>{currentStep === 1 ? "اطلاعات اولیه" : "جزئیات تیکت"}</span>
            </div>
            <Progress value={progressValue} className="w-full" />
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {currentStep === 1 && (
              <>
                {/* Contact Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-right">اطلاعات تماس</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="clientName" className="text-sm font-medium text-right block">
                          نام و نام خانوادگی *
                        </label>
                        <input
                          {...control.register?.("clientName")}
                          type="text"
                          id="clientName"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
                          placeholder="نام کامل خود را وارد کنید"
                        />
                        {errors.clientName && (
                          <p className="text-sm text-red-500 text-right">{errors.clientName.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="clientEmail" className="text-sm font-medium text-right block">
                          ایمیل *
                        </label>
                        <input
                          {...control.register?.("clientEmail")}
                          type="email"
                          id="clientEmail"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
                          placeholder="example@domain.com"
                        />
                        {errors.clientEmail && (
                          <p className="text-sm text-red-500 text-right">{errors.clientEmail.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="clientPhone" className="text-sm font-medium text-right block">
                        شماره تماس *
                      </label>
                      <input
                        {...control.register?.("clientPhone")}
                        type="tel"
                        id="clientPhone"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-right"
                        placeholder="09123456789"
                      />
                      {errors.clientPhone && (
                        <p className="text-sm text-red-500 text-right">{errors.clientPhone.message}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <TicketFormStep1 control={control} errors={errors} categories={categories} />
              </>
            )}

            {currentStep === 2 && (
              <TicketFormStep2
                control={control}
                errors={errors}
                mainIssue={watchedMainIssue}
                subIssue={watchedSubIssue}
                setValue={setValue}
                getValues={getValues}
              />
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
              <div className="flex gap-2">
                {currentStep === 2 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    className="flex items-center gap-2 bg-transparent"
                  >
                    <ArrowRight className="w-4 h-4" />
                    مرحله قبل
                  </Button>
                )}
                <Button type="button" variant="outline" onClick={onCancel}>
                  انصراف
                </Button>
              </div>

              <div>
                {currentStep === 1 ? (
                  <Button type="button" onClick={handleNext} className="flex items-center gap-2">
                    مرحله بعد
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        در حال ارسال...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        ایجاد تیکت
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
