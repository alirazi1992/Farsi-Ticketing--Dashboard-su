"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { ArrowRight, ArrowLeft, Send, X } from "lucide-react"

interface TwoStepTicketFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function TwoStepTicketForm({ onSubmit, onCancel }: TwoStepTicketFormProps) {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Basic Info
    title: "",
    category: "",
    priority: "",
    description: "",

    // Step 2: Contact Info (pre-filled from user)
    clientName: user?.name || "",
    clientEmail: user?.email || "",
    clientPhone: user?.phone || "",
    clientDepartment: user?.department || "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNextStep = () => {
    if (currentStep === 1) {
      // Validate step 1
      if (!formData.title || !formData.category || !formData.priority || !formData.description) {
        return
      }
      setCurrentStep(2)
    }
  }

  const handlePrevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1)
    }
  }

  const handleSubmit = () => {
    if (!formData.clientName || !formData.clientEmail) {
      return
    }
    onSubmit(formData)
  }

  const categories = [
    { value: "hardware", label: "سخت‌افزار" },
    { value: "software", label: "نرم‌افزار" },
    { value: "network", label: "شبکه" },
    { value: "email", label: "ایمیل" },
    { value: "security", label: "امنیت" },
    { value: "access", label: "دسترسی" },
  ]

  const priorities = [
    { value: "low", label: "کم" },
    { value: "medium", label: "متوسط" },
    { value: "high", label: "بالا" },
    { value: "urgent", label: "فوری" },
  ]

  return (
    <div className="space-y-6 font-iran" dir="rtl">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4 space-x-reverse">
        <div className={`flex items-center ${currentStep >= 1 ? "text-blue-600" : "text-gray-400"}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            1
          </div>
          <span className="mr-2 font-iran">اطلاعات تیکت</span>
        </div>
        <div className={`w-16 h-0.5 ${currentStep >= 2 ? "bg-blue-600" : "bg-gray-200"}`} />
        <div className={`flex items-center ${currentStep >= 2 ? "text-blue-600" : "text-gray-400"}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            2
          </div>
          <span className="mr-2 font-iran">اطلاعات تماس</span>
        </div>
      </div>

      {/* Step 1: Ticket Information */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-right font-iran">اطلاعات تیکت</CardTitle>
            <CardDescription className="text-right font-iran">
              لطفاً اطلاعات مربوط به مشکل خود را وارد کنید
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-right font-iran">
                عنوان تیکت *
              </Label>
              <Input
                id="title"
                placeholder="عنوان مشکل خود را وارد کنید"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="text-right font-iran"
                dir="rtl"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category" className="text-right font-iran">
                  دسته‌بندی *
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange("category", value)}
                  dir="rtl"
                >
                  <SelectTrigger className="text-right font-iran" dir="rtl">
                    <SelectValue placeholder="انتخاب دسته‌بندی" />
                  </SelectTrigger>
                  <SelectContent dir="rtl" className="font-iran">
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value} className="text-right font-iran">
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="text-right font-iran">
                  اولویت *
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleInputChange("priority", value)}
                  dir="rtl"
                >
                  <SelectTrigger className="text-right font-iran" dir="rtl">
                    <SelectValue placeholder="انتخاب اولویت" />
                  </SelectTrigger>
                  <SelectContent dir="rtl" className="font-iran">
                    {priorities.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value} className="text-right font-iran">
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-right font-iran">
                توضیحات *
              </Label>
              <Textarea
                id="description"
                placeholder="توضیح کاملی از مشکل خود ارائه دهید..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="text-right font-iran min-h-[120px]"
                dir="rtl"
                required
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Contact Information */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-right font-iran">اطلاعات تماس</CardTitle>
            <CardDescription className="text-right font-iran">
              اطلاعات تماس شما (از پروفایل کاربری تکمیل شده)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientName" className="text-right font-iran">
                  نام و نام خانوادگی *
                </Label>
                <Input
                  id="clientName"
                  value={formData.clientName}
                  onChange={(e) => handleInputChange("clientName", e.target.value)}
                  className="text-right font-iran"
                  dir="rtl"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientPhone" className="text-right font-iran">
                  شماره تماس
                </Label>
                <Input
                  id="clientPhone"
                  placeholder="09123456789"
                  value={formData.clientPhone}
                  onChange={(e) => handleInputChange("clientPhone", e.target.value)}
                  className="text-right font-iran"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientEmail" className="text-right font-iran">
                ایمیل *
              </Label>
              <Input
                id="clientEmail"
                type="email"
                value={formData.clientEmail}
                onChange={(e) => handleInputChange("clientEmail", e.target.value)}
                className="text-right font-iran"
                dir="rtl"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientDepartment" className="text-right font-iran">
                بخش
              </Label>
              <Input
                id="clientDepartment"
                value={formData.clientDepartment}
                onChange={(e) => handleInputChange("clientDepartment", e.target.value)}
                className="text-right font-iran"
                dir="rtl"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <div className="flex gap-2">
          {currentStep === 2 && (
            <Button variant="outline" onClick={handlePrevStep} className="font-iran bg-transparent">
              <ArrowRight className="ml-2 h-4 w-4" />
              قبلی
            </Button>
          )}

          <Button variant="outline" onClick={onCancel} className="font-iran bg-transparent">
            <X className="ml-2 h-4 w-4" />
            انصراف
          </Button>
        </div>

        <div>
          {currentStep === 1 ? (
            <Button
              onClick={handleNextStep}
              disabled={!formData.title || !formData.category || !formData.priority || !formData.description}
              className="font-iran"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              بعدی
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={!formData.clientName || !formData.clientEmail}
              className="bg-green-600 hover:bg-green-700 font-iran"
            >
              <Send className="mr-2 h-4 w-4" />
              ارسال تیکت
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
