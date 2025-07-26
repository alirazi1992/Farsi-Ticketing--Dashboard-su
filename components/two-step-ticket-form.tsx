"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { TicketFormStep1 } from "./ticket-form-step1"
import { TicketFormStep2 } from "./ticket-form-step2"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ticketSchema } from "@/lib/validation-schemas"
import type { UploadedFile } from "@/lib/file-upload"

interface TwoStepTicketFormProps {
  onSubmit: (data: any) => void
  currentUser: any
  categoriesData: any
}

export function TwoStepTicketForm({ onSubmit, currentUser, categoriesData }: TwoStepTicketFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [step1Data, setStep1Data] = useState<any>(null)
  const [attachedFiles, setAttachedFiles] = useState<UploadedFile[]>([])

  const form = useForm({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      subcategory: "",
      priority: "medium",
      // Dynamic fields
      deviceBrand: "",
      deviceModel: "",
      powerStatus: "",
      lastWorking: "",
      printerBrand: "",
      printerType: "",
      printerProblem: "",
      monitorSize: "",
      connectionType: "",
      displayIssue: "",
      operatingSystem: "",
      osVersion: "",
      osIssueType: "",
      softwareName: "",
      softwareVersion: "",
      applicationIssue: "",
      internetProvider: "",
      connectionIssue: "",
      wifiNetwork: "",
      deviceType: "",
      wifiIssue: "",
      networkLocation: "",
      emailProvider: "",
      emailClient: "",
      errorMessage: "",
      incidentTime: "",
      securitySeverity: "",
      affectedData: "",
      requestedSystem: "",
      accessLevel: "",
      accessReason: "",
      trainingTopic: "",
      currentLevel: "",
      preferredMethod: "",
      equipmentType: "",
      maintenanceType: "",
      preferredTime: "",
    },
  })

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = form

  const selectedCategory = watch("category")
  const selectedSubcategory = watch("subcategory")

  const handleStep1Complete = (data: any) => {
    setStep1Data(data)
    // Update form values with step 1 data
    Object.keys(data).forEach((key) => {
      form.setValue(key, data[key])
    })
    setCurrentStep(2)
  }

  const handleStep2Submit = handleSubmit((data) => {
    const completeData = {
      ...step1Data,
      ...data,
      clientName: currentUser.name,
      clientEmail: currentUser.email,
      clientPhone: currentUser.phone || "",
      department: currentUser.department || "",
      attachedFiles,
    }
    onSubmit(completeData)
  })

  const handleBack = () => {
    setCurrentStep(1)
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Progress indicator */}
      <div className="flex items-center justify-center space-x-4 space-x-reverse">
        <div className={`flex items-center ${currentStep >= 1 ? "text-primary" : "text-muted-foreground"}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            1
          </div>
          <span className="mr-2 text-sm">اطلاعات مشکل</span>
        </div>
        <ChevronLeft className="w-4 h-4 text-muted-foreground" />
        <div className={`flex items-center ${currentStep >= 2 ? "text-primary" : "text-muted-foreground"}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            2
          </div>
          <span className="mr-2 text-sm">جزئیات تکمیلی</span>
        </div>
      </div>

      {/* Step content */}
      <div className="min-h-[400px]">
        {currentStep === 1 && (
          <TicketFormStep1 onNext={handleStep1Complete} categoriesData={categoriesData} initialData={step1Data} />
        )}
        {currentStep === 2 && (
          <form onSubmit={handleStep2Submit} className="space-y-4">
            <div className="flex justify-between items-center">
              <Button type="button" variant="outline" onClick={handleBack} className="gap-2 bg-transparent">
                <ChevronRight className="w-4 h-4" />
                بازگشت
              </Button>
            </div>
            <TicketFormStep2
              control={control}
              errors={errors}
              selectedIssue={selectedCategory}
              selectedSubIssue={selectedSubcategory}
              attachedFiles={attachedFiles}
              onFilesChange={setAttachedFiles}
            />
            <div className="flex justify-end pt-4">
              <Button type="submit" className="gap-2">
                ثبت تیکت
                <ChevronLeft className="w-4 h-4" />
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
