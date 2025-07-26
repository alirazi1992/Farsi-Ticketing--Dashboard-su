"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileUpload } from "@/components/file-upload"
import { DynamicFormFields } from "@/components/dynamic-form-fields"
import { ticketFormStep1Schema, ticketFormStep2Schema } from "@/lib/validation-schemas"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import {
  ChevronRight,
  ChevronLeft,
  Send,
  X,
  HardDrive,
  ComputerIcon as Software,
  Network,
  Mail,
  Shield,
  Key,
  AlertCircle,
  Clock,
  Zap,
} from "lucide-react"

const priorityOptions = [
  { value: "low", label: "کم", color: "bg-blue-100 text-blue-800", icon: Clock },
  { value: "medium", label: "متوسط", color: "bg-orange-100 text-orange-800", icon: AlertCircle },
  { value: "high", label: "بالا", color: "bg-red-100 text-red-800", icon: AlertCircle },
  { value: "urgent", label: "فوری", color: "bg-purple-100 text-purple-800", icon: Zap },
]

const categoryIcons = {
  hardware: HardDrive,
  software: Software,
  network: Network,
  email: Mail,
  security: Shield,
  access: Key,
}

interface TwoStepTicketFormProps {
  onSubmit: (data: any) => void
  onClose: () => void
  categories: any
}

export function TwoStepTicketForm({ onSubmit, onClose, categories }: TwoStepTicketFormProps) {
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [step1Data, setStep1Data] = useState<any>(null)
  const [attachments, setAttachments] = useState<File[]>([])
  const [dynamicFields, setDynamicFields] = useState<Record<string, any>>({})

  // Step 1 form
  const {
    control: step1Control,
    handleSubmit: handleStep1Submit,
    watch: watchStep1,
    formState: { errors: step1Errors },
  } = useForm({
    resolver: yupResolver(ticketFormStep1Schema),
    defaultValues: {
      category: "",
      subcategory: "",
      priority: "",
    },
  })

  // Step 2 form
  const {
    control: step2Control,
    handleSubmit: handleStep2Submit,
    formState: { errors: step2Errors },
  } = useForm({
    resolver: yupResolver(ticketFormStep2Schema),
    defaultValues: {
      title: "",
      description: "",
    },
  })

  const selectedCategory = watchStep1("category")
  const selectedSubcategory = watchStep1("subcategory")

  // Get subcategories for selected category
  const getSubcategories = () => {
    if (!selectedCategory || !categories[selectedCategory]) return []
    return Object.values(categories[selectedCategory].subIssues || {})
  }

  // Handle step 1 submission
  const onStep1Submit = (data: any) => {
    setStep1Data(data)
    setCurrentStep(2)
  }

  // Handle step 2 submission
  const onStep2Submit = (data: any) => {
    const finalData = {
      ...step1Data,
      ...data,
      clientName: user?.name || "",
      clientEmail: user?.email || "",
      clientPhone: user?.phone || "",
      department: user?.department || "",
      attachments,
      dynamicFields,
    }

    onSubmit(finalData)
    toast({
      title: "تیکت ایجاد شد",
      description: "درخواست شما با موفقیت ثبت شد و به تیم پشتیبانی ارسال شد",
    })
  }

  // Handle file upload
  const handleFileUpload = (files: File[]) => {
    setAttachments(files)
  }

  // Handle dynamic fields change
  const handleDynamicFieldsChange = (fields: Record<string, any>) => {
    setDynamicFields(fields)
  }

  // Get category label
  const getCategoryLabel = (categoryId: string) => {
    const categoryLabels = {
      hardware: "سخت‌افزار",
      software: "نرم‌افزار",
      network: "شبکه",
      email: "ایمیل",
      security: "امنیت",
      access: "دسترسی",
    }
    return categoryLabels[categoryId] || categoryId
  }

  return (
    <div className="space-y-6 font-iran" dir="rtl">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4 space-x-reverse">
        <div className={`flex items-center ${currentStep >= 1 ? "text-primary" : "text-muted-foreground"}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            1
          </div>
          <span className="mr-2 text-sm font-iran">انتخاب دسته‌بندی</span>
        </div>
        <div className={`w-8 h-0.5 ${currentStep >= 2 ? "bg-primary" : "bg-muted"}`} />
        <div className={`flex items-center ${currentStep >= 2 ? "text-primary" : "text-muted-foreground"}`}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            2
          </div>
          <span className="mr-2 text-sm font-iran">جزئیات درخواست</span>
        </div>
      </div>

      {/* Step 1: Category Selection */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-right font-iran">مرحله ۱: انتخاب دسته‌بندی و اولویت</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStep1Submit(onStep1Submit)} className="space-y-6">
              {/* Category Selection */}
              <div className="space-y-2">
                <Label className="text-right font-iran">دسته‌بندی مشکل *</Label>
                <Controller
                  name="category"
                  control={step1Control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                      <SelectTrigger className="text-right font-iran">
                        <SelectValue placeholder="انتخاب دسته‌بندی" />
                      </SelectTrigger>
                      <SelectContent className="font-iran">
                        {Object.values(categories).map((category: any) => {
                          const IconComponent = categoryIcons[category.icon] || HardDrive
                          return (
                            <SelectItem key={category.id} value={category.id}>
                              <div className="flex items-center gap-2">
                                <IconComponent className="w-4 h-4" />
                                <span className="font-iran">{category.label}</span>
                              </div>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  )}
                />
                {step1Errors.category && (
                  <p className="text-sm text-red-500 text-right font-iran">{step1Errors.category.message}</p>
                )}
              </div>

              {/* Subcategory Selection */}
              {selectedCategory && (
                <div className="space-y-2">
                  <Label className="text-right font-iran">نوع مشکل *</Label>
                  <Controller
                    name="subcategory"
                    control={step1Control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                        <SelectTrigger className="text-right font-iran">
                          <SelectValue placeholder="انتخاب نوع مشکل" />
                        </SelectTrigger>
                        <SelectContent className="font-iran">
                          {getSubcategories().map((subcategory: any) => (
                            <SelectItem key={subcategory.id} value={subcategory.label}>
                              <div className="text-right">
                                <div className="font-medium font-iran">{subcategory.label}</div>
                                {subcategory.description && (
                                  <div className="text-xs text-muted-foreground font-iran">
                                    {subcategory.description}
                                  </div>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {step1Errors.subcategory && (
                    <p className="text-sm text-red-500 text-right font-iran">{step1Errors.subcategory.message}</p>
                  )}
                </div>
              )}

              {/* Priority Selection */}
              <div className="space-y-2">
                <Label className="text-right font-iran">اولویت درخواست *</Label>
                <Controller
                  name="priority"
                  control={step1Control}
                  render={({ field }) => (
                    <div className="grid grid-cols-2 gap-3">
                      {priorityOptions.map((option) => {
                        const IconComponent = option.icon
                        return (
                          <div
                            key={option.value}
                            className={`p-3 border rounded-lg cursor-pointer transition-all ${
                              field.value === option.value
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                            onClick={() => field.onChange(option.value)}
                          >
                            <div className="flex items-center gap-2">
                              <IconComponent className="w-4 h-4" />
                              <span className="font-medium font-iran">{option.label}</span>
                            </div>
                            <Badge className={`${option.color} mt-2 font-iran`} variant="outline">
                              {option.label}
                            </Badge>
                          </div>
                        )
                      })}
                    </div>
                  )}
                />
                {step1Errors.priority && (
                  <p className="text-sm text-red-500 text-right font-iran">{step1Errors.priority.message}</p>
                )}
              </div>

              {/* Dynamic Fields */}
              {selectedCategory && selectedSubcategory && (
                <div className="space-y-4">
                  <Separator />
                  <DynamicFormFields
                    category={selectedCategory}
                    subcategory={selectedSubcategory}
                    onChange={handleDynamicFieldsChange}
                  />
                </div>
              )}

              {/* Navigation */}
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={onClose} className="gap-2 font-iran bg-transparent">
                  <X className="w-4 h-4" />
                  انصراف
                </Button>
                <Button type="submit" className="gap-2 font-iran">
                  مرحله بعد
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Details */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-right font-iran">مرحله ۲: جزئیات درخواست</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Summary of Step 1 */}
            <div className="bg-muted p-4 rounded-lg mb-6">
              <h4 className="font-medium mb-2 font-iran">خلاصه انتخاب‌های شما:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground font-iran">دسته‌بندی: </span>
                  <span className="font-medium font-iran">{getCategoryLabel(step1Data?.category)}</span>
                </div>
                <div>
                  <span className="text-muted-foreground font-iran">نوع مشکل: </span>
                  <span className="font-medium font-iran">{step1Data?.subcategory}</span>
                </div>
                <div>
                  <span className="text-muted-foreground font-iran">اولویت: </span>
                  <Badge
                    className={`${priorityOptions.find((p) => p.value === step1Data?.priority)?.color} font-iran`}
                    variant="outline"
                  >
                    {priorityOptions.find((p) => p.value === step1Data?.priority)?.label}
                  </Badge>
                </div>
              </div>
            </div>

            <form onSubmit={handleStep2Submit(onStep2Submit)} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label className="text-right font-iran">عنوان درخواست *</Label>
                <Controller
                  name="title"
                  control={step2Control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      placeholder="عنوان کوتاه و واضح برای درخواست خود وارد کنید"
                      className="text-right font-iran"
                      dir="rtl"
                    />
                  )}
                />
                {step2Errors.title && (
                  <p className="text-sm text-red-500 text-right font-iran">{step2Errors.title.message}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-right font-iran">شرح کامل مشکل *</Label>
                <Controller
                  name="description"
                  control={step2Control}
                  render={({ field }) => (
                    <Textarea
                      {...field}
                      placeholder="لطفاً مشکل خود را به طور کامل و دقیق شرح دهید..."
                      className="min-h-[120px] text-right font-iran"
                      dir="rtl"
                    />
                  )}
                />
                {step2Errors.description && (
                  <p className="text-sm text-red-500 text-right font-iran">{step2Errors.description.message}</p>
                )}
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label className="text-right font-iran">فایل‌های پیوست (اختیاری)</Label>
                <FileUpload onFilesChange={handleFileUpload} />
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setCurrentStep(1)} className="gap-2 font-iran">
                  <ChevronRight className="w-4 h-4" />
                  مرحله قبل
                </Button>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={onClose} className="gap-2 font-iran bg-transparent">
                    <X className="w-4 h-4" />
                    انصراف
                  </Button>
                  <Button type="submit" className="gap-2 font-iran">
                    <Send className="w-4 h-4" />
                    ارسال درخواست
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
