"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TicketFormStep1 } from "./ticket-form-step1"
import { TicketFormStep2 } from "./ticket-form-step2"

interface TwoStepTicketFormProps {
  onSubmit: (ticket: any) => void
  categories: any[]
}

export function TwoStepTicketForm({ onSubmit, categories }: TwoStepTicketFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1 data
    category: "",
    subcategory: "",
    priority: "",
    title: "",
    description: "",

    // Step 2 data
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    department: "",
    attachments: [],
  })

  const handleStep1Submit = (step1Data: any) => {
    setFormData((prev) => ({ ...prev, ...step1Data }))
    setCurrentStep(2)
  }

  const handleStep2Submit = (step2Data: any) => {
    const finalData = { ...formData, ...step2Data }
    onSubmit(finalData)

    // Reset form
    setFormData({
      category: "",
      subcategory: "",
      priority: "",
      title: "",
      description: "",
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      department: "",
      attachments: [],
    })
    setCurrentStep(1)
  }

  const handleBack = () => {
    setCurrentStep(1)
  }

  return (
    <Card className="w-full max-w-4xl mx-auto" dir="rtl">
      <CardHeader>
        <CardTitle className="text-right flex items-center justify-between">
          <span>ایجاد تیکت جدید</span>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>مرحله {currentStep} از 2</span>
          </div>
        </CardTitle>

        {/* Progress indicator */}
        <div className="flex items-center gap-2 mt-4">
          <div className={`flex-1 h-2 rounded-full ${currentStep >= 1 ? "bg-primary" : "bg-muted"}`} />
          <div className={`flex-1 h-2 rounded-full ${currentStep >= 2 ? "bg-primary" : "bg-muted"}`} />
        </div>

        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>اطلاعات تیکت</span>
          <span>اطلاعات تماس</span>
        </div>
      </CardHeader>

      <CardContent>
        {currentStep === 1 ? (
          <TicketFormStep1 initialData={formData} onSubmit={handleStep1Submit} categories={categories} />
        ) : (
          <TicketFormStep2 initialData={formData} onSubmit={handleStep2Submit} onBack={handleBack} />
        )}
      </CardContent>
    </Card>
  )
}
