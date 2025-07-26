"use client"

import { useState } from "react"
import { TicketFormStep1 } from "@/components/ticket-form-step1"
import { TicketFormStep2 } from "@/components/ticket-form-step2"
import { ChevronLeft } from "lucide-react"

interface TwoStepTicketFormProps {
  categories: any[]
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function TwoStepTicketForm({ categories, onSubmit, onCancel }: TwoStepTicketFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subcategory: "",
    priority: "medium",
    description: "",
    submittedBy: "کاربر فعلی", // This would come from auth context
    attachments: [],
  })

  const handleStep1Submit = (data: any) => {
    setFormData({ ...formData, ...data })
    setCurrentStep(2)
  }

  const handleStep2Submit = (data: any) => {
    const finalData = { ...formData, ...data }
    onSubmit(finalData)
  }

  const handleBack = () => {
    setCurrentStep(1)
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

      {/* Form Steps */}
      {currentStep === 1 && (
        <TicketFormStep1
          categories={categories}
          initialData={formData}
          onSubmit={handleStep1Submit}
          onCancel={onCancel}
        />
      )}

      {currentStep === 2 && (
        <TicketFormStep2
          categories={categories}
          initialData={formData}
          onSubmit={handleStep2Submit}
          onBack={handleBack}
          onCancel={onCancel}
        />
      )}
    </div>
  )
}
