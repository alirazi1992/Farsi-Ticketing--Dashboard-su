"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TicketFormStep1 } from "@/components/ticket-form-step1"
import { TicketFormStep2 } from "@/components/ticket-form-step2"
import { useAuth } from "@/lib/auth-context"
import { useTickets } from "@/lib/ticket-context"
import { ChevronRight } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface FormData {
  // Step 1 - Contact Info (pre-filled)
  clientName: string
  clientEmail: string
  clientPhone: string

  // Step 2 - Ticket Details
  title: string
  description: string
  category: string
  subcategory: string
  priority: "low" | "medium" | "high" | "urgent"
  attachments: string[]
}

interface TwoStepTicketFormProps {
  onClose: () => void
}

export function TwoStepTicketForm({ onClose }: TwoStepTicketFormProps) {
  const { user } = useAuth()
  const { addTicket } = useTickets()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    // Pre-fill with user's information
    clientName: user?.name || "",
    clientEmail: user?.email || "",
    clientPhone: user?.phone || "",
    title: "",
    description: "",
    category: "",
    subcategory: "",
    priority: "medium",
    attachments: [],
  })

  const handleStep1Submit = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }))
    setCurrentStep(2)
  }

  const handleStep2Submit = (data: Partial<FormData>) => {
    const finalData = { ...formData, ...data }

    addTicket({
      title: finalData.title,
      description: finalData.description,
      category: finalData.category,
      subcategory: finalData.subcategory,
      priority: finalData.priority,
      status: "open",
      clientId: user?.id || "",
      clientName: finalData.clientName,
      clientEmail: finalData.clientEmail,
      clientPhone: finalData.clientPhone,
      attachments: finalData.attachments,
    })

    toast({
      title: "تیکت با موفقیت ایجاد شد",
      description: "تیکت شما ثبت شده و به زودی بررسی خواهد شد.",
    })

    onClose()
  }

  const handleBack = () => {
    setCurrentStep(1)
  }

  const progress = (currentStep / 2) * 100

  return (
    <div className="w-full max-w-2xl mx-auto font-iran" dir="rtl">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-iran">ایجاد تیکت جدید</CardTitle>
              <CardDescription className="font-iran">مرحله {currentStep} از 2</CardDescription>
            </div>
            <div className="text-sm text-muted-foreground font-iran">
              {currentStep === 1 ? "اطلاعات تماس" : "جزئیات تیکت"}
            </div>
          </div>
          <Progress value={progress} className="w-full" />
        </CardHeader>
        <CardContent>
          {currentStep === 1 && <TicketFormStep1 initialData={formData} onSubmit={handleStep1Submit} />}
          {currentStep === 2 && (
            <div className="space-y-6">
              <TicketFormStep2 initialData={formData} onSubmit={handleStep2Submit} />
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={handleBack} className="font-iran bg-transparent">
                  <ChevronRight className="ml-2 h-4 w-4" />
                  مرحله قبل
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
