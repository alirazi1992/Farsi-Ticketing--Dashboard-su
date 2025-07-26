"use client"

import { useState } from "react"

import { TicketFormStep1 } from "@/components/ticket-form-step1"
import { TicketFormStep2 } from "@/components/ticket-form-step2"
import { useAuth } from "@/lib/auth-context"
import type { UploadedFile } from "@/lib/file-upload"

const priorityLabels = {
  low: "کم",
  medium: "متوسط",
  high: "بالا",
  urgent: "فوری",
}

interface TwoStepTicketFormProps {
  onSubmit: (data: any) => void
  categoriesData: any
}

export function TwoStepTicketForm({ onSubmit, categoriesData }: TwoStepTicketFormProps) {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<any>({})
  const [attachedFiles, setAttachedFiles] = useState<UploadedFile[]>([])

  const handleStep1Complete = (data: any) => {
    setFormData({ ...formData, ...data })
    setCurrentStep(2)
  }

  const handleStep2Complete = (data: any) => {
    const finalData = { ...formData, ...data }
    onSubmit(finalData)
  }

  const handleBack = () => {
    setCurrentStep(1)
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Step Indicator */}
      <div className="flex items-center justify-center space-x-4 space-x-reverse">
        <div className={`flex items-center ${currentStep >= 1 ? "text-primary" : "text-muted-foreground"}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            1
          </div>
          <span className="mr-2 text-sm">انتخاب دسته‌بندی</span>
        </div>
        <div className="w-8 h-px bg-border"></div>
        <div className={`flex items-center ${currentStep >= 2 ? "text-primary" : "text-muted-foreground"}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            2
          </div>
          <span className="mr-2 text-sm">جزئیات تیکت</span>
        </div>
      </div>

      {/* Form Steps */}
      {currentStep === 1 && (
        <TicketFormStep1 onNext={handleStep1Complete} initialData={formData} categoriesData={categoriesData} />
      )}

      {currentStep === 2 && (
        <div className="space-y-4">
          <TicketFormStep2
            onSubmit={handleStep2Complete}
            onBack={handleBack}
            initialData={formData}
            attachedFiles={attachedFiles}
            onFilesChange={setAttachedFiles}
          />
        </div>
      )}
    </div>
  )
}
