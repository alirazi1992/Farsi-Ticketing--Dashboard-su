"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
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
import {
  ChevronLeft,
  ChevronRight,
  User,
  FileText,
  CheckCircle,
  HardDrive,
  ComputerIcon as Software,
  Network,
  Mail,
  Shield,
  Key,
  BookOpen,
  Wrench,
} from "lucide-react"

// Available icons mapping
const availableIcons = {
  hardware: HardDrive,
  software: Software,
  network: Network,
  email: Mail,
  security: Shield,
  access: Key,
  training: BookOpen,
  maintenance: Wrench,
}

// Validation schemas
const step1Schema = yup.object({
  clientName: yup.string().required("نام الزامی است"),
  clientEmail: yup.string().email("ایمیل معتبر وارد کنید").required("ایمیل الزامی است"),
  clientPhone: yup.string().required("شماره تلفن الزامی است"),
  department: yup.string().required("انتخاب بخش الزامی است"),
})

const step2Schema = yup.object({
  title: yup.string().required("عنوان الزامی است"),
  category: yup.string().required("انتخاب دسته‌بندی الزامی است"),
  subcategory: yup.string().required("انتخاب زیردسته الزامی است"),
  priority: yup.string().required("انتخاب اولویت الزامی است"),
  description: yup.string().required("شرح مشکل الزامی است"),
})

const departments = [
  "مدیریت",
  "حسابداری",
  "مالی",
  "منابع انسانی",
  "فروش",
  "بازاریابی",
  "تولید",
  "انبار",
  "IT",
  "اداری",
  "حقوقی",
  "خدمات",
]

const priorities = [
  { value: "low", label: "کم", color: "bg-blue-100 text-blue-800" },
  { value: "medium", label: "متوسط", color: "bg-orange-100 text-orange-800" },
  { value: "high", label: "بالا", color: "bg-red-100 text-red-800" },
  { value: "urgent", label: "فوری", color: "bg-purple-100 text-purple-800" },
]

interface TwoStepTicketFormProps {
  onSubmit: (data: any) => void
  categories?: any
}

export function TwoStepTicketForm({ onSubmit, categories }: TwoStepTicketFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [step1Data, setStep1Data] = useState<any>(null)
  const [selectedCategory, setSelectedCategory] = useState("")
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  // Use provided categories or fallback to empty object
  const categoriesData = categories || {}

  // Step 1 form
  const {
    control: step1Control,
    handleSubmit: handleStep1Submit,
    formState: { errors: step1Errors },
  } = useForm({
    resolver: yupResolver(step1Schema),
    defaultValues: {
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      department: "",
    },
  })

  // Step 2 form
  const {
    control: step2Control,
    handleSubmit: handleStep2Submit,
    formState: { errors: step2Errors },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(step2Schema),
    defaultValues: {
      title: "",
      category: "",
      subcategory: "",
      priority: "",
      description: "",
    },
  })

  const watchedCategory = watch("category")

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
      attachments: uploadedFiles,
    }
    onSubmit(finalData)
  }

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setValue("category", categoryId)
    setValue("subcategory", "") // Reset subcategory when category changes
  }

  // Get subcategories for selected category
  const getSubcategories = () => {
    if (!watchedCategory || !categoriesData[watchedCategory]) return []
    return Object.values(categoriesData[watchedCategory].subIssues || {})
  }

  // Get category icon
  const getCategoryIcon = (iconName: string) => {
    return availableIcons[iconName] || HardDrive
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Progress Indicator */}
      <div className="flex items-center justify-center space-x-4 space-x-reverse">
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {currentStep > 1 ? <CheckCircle className="w-4 h-4" /> : <User className="w-4 h-4" />}
          </div>
          <span className="mr-2 text-sm font-medium">اطلاعات شخصی</span>
        </div>
        <div className="w-12 h-px bg-muted"></div>
        <div className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            <FileText className="w-4 h-4" />
          </div>
          <span className="mr-2 text-sm font-medium">جزئیات درخواست</span>
        </div>
      </div>

      {/* Step 1: Personal Information */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-2">
              <User className="w-5 h-5" />
              اطلاعات شخصی
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStep1Submit(onStep1Submit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName" className="text-right">
                    نام و نام خانوادگی *
                  </Label>
                  <Controller
                    name="clientName"
                    control={step1Control}
                    render={({ field }) => (
                      <Input {...field} placeholder="نام کامل خود را وارد کنید" className="text-right" dir="rtl" />
                    )}
                  />
                  {step1Errors.clientName && (
                    <p className="text-sm text-red-500 text-right">{step1Errors.clientName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientEmail" className="text-right">
                    ایمیل *
                  </Label>
                  <Controller
                    name="clientEmail"
                    control={step1Control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="email"
                        placeholder="example@company.com"
                        className="text-right"
                        dir="rtl"
                      />
                    )}
                  />
                  {step1Errors.clientEmail && (
                    <p className="text-sm text-red-500 text-right">{step1Errors.clientEmail.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientPhone" className="text-right">
                    شماره تلفن *
                  </Label>
                  <Controller
                    name="clientPhone"
                    control={step1Control}
                    render={({ field }) => (
                      <Input {...field} placeholder="09123456789" className="text-right" dir="rtl" />
                    )}
                  />
                  {step1Errors.clientPhone && (
                    <p className="text-sm text-red-500 text-right">{step1Errors.clientPhone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department" className="text-right">
                    بخش *
                  </Label>
                  <Controller
                    name="department"
                    control={step1Control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="بخش خود را انتخاب کنید" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {step1Errors.department && (
                    <p className="text-sm text-red-500 text-right">{step1Errors.department.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" className="gap-2">
                  مرحله بعد
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Ticket Details */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-2">
              <FileText className="w-5 h-5" />
              جزئیات درخواست
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleStep2Submit(onStep2Submit)} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-right">
                    عنوان درخواست *
                  </Label>
                  <Controller
                    name="title"
                    control={step2Control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="عنوان کوتاه و واضح برای مشکل خود وارد کنید"
                        className="text-right"
                        dir="rtl"
                      />
                    )}
                  />
                  {step2Errors.title && <p className="text-sm text-red-500 text-right">{step2Errors.title.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-right">
                      دسته‌بندی *
                    </Label>
                    <Controller
                      name="category"
                      control={step2Control}
                      render={({ field }) => (
                        <Select onValueChange={handleCategoryChange} value={field.value} dir="rtl">
                          <SelectTrigger className="text-right">
                            <SelectValue placeholder="دسته‌بندی مشکل را انتخاب کنید" />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(categoriesData).map((category: any) => {
                              const IconComponent = getCategoryIcon(category.icon)
                              return (
                                <SelectItem key={category.id} value={category.id}>
                                  <div className="flex items-center gap-2">
                                    <IconComponent className="w-4 h-4" />
                                    <span>{category.label}</span>
                                  </div>
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {step2Errors.category && (
                      <p className="text-sm text-red-500 text-right">{step2Errors.category.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subcategory" className="text-right">
                      زیردسته *
                    </Label>
                    <Controller
                      name="subcategory"
                      control={step2Control}
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={!watchedCategory}
                          dir="rtl"
                        >
                          <SelectTrigger className="text-right">
                            <SelectValue placeholder="ابتدا دسته‌بندی را انتخاب کنید" />
                          </SelectTrigger>
                          <SelectContent>
                            {getSubcategories().map((subcat: any) => (
                              <SelectItem key={subcat.id} value={subcat.label}>
                                {subcat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {step2Errors.subcategory && (
                      <p className="text-sm text-red-500 text-right">{step2Errors.subcategory.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority" className="text-right">
                    اولویت *
                  </Label>
                  <Controller
                    name="priority"
                    control={step2Control}
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="اولویت درخواست را انتخاب کنید" />
                        </SelectTrigger>
                        <SelectContent>
                          {priorities.map((priority) => (
                            <SelectItem key={priority.value} value={priority.value}>
                              <div className="flex items-center gap-2">
                                <Badge className={priority.color}>{priority.label}</Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {step2Errors.priority && (
                    <p className="text-sm text-red-500 text-right">{step2Errors.priority.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-right">
                    شرح کامل مشکل *
                  </Label>
                  <Controller
                    name="description"
                    control={step2Control}
                    render={({ field }) => (
                      <Textarea
                        {...field}
                        placeholder="لطفاً مشکل خود را به طور کامل و دقیق شرح دهید..."
                        className="min-h-[120px] text-right"
                        dir="rtl"
                      />
                    )}
                  />
                  {step2Errors.description && (
                    <p className="text-sm text-red-500 text-right">{step2Errors.description.message}</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Dynamic Fields */}
              <DynamicFormFields category={watchedCategory} />

              <Separator />

              {/* File Upload */}
              <div className="space-y-2">
                <Label className="text-right">پیوست فایل (اختیاری)</Label>
                <FileUpload
                  onFilesChange={setUploadedFiles}
                  maxFiles={5}
                  maxSize={10 * 1024 * 1024} // 10MB
                  acceptedTypes={["image/*", ".pdf", ".doc", ".docx", ".txt"]}
                />
                <p className="text-xs text-muted-foreground text-right">
                  حداکثر 5 فایل با حجم کل 10 مگابایت (تصاویر، PDF، Word، متن)
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-4">
                <Button type="button" variant="outline" onClick={() => setCurrentStep(1)} className="gap-2">
                  <ChevronRight className="w-4 h-4" />
                  مرحله قبل
                </Button>
                <Button type="submit" className="gap-2">
                  <CheckCircle className="w-4 h-4" />
                  ثبت درخواست
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Summary Card for Step 1 Data */}
      {currentStep === 2 && step1Data && (
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-right text-sm">خلاصه اطلاعات شخصی</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">نام:</span>
                <span className="mr-2">{step1Data.clientName}</span>
              </div>
              <div>
                <span className="text-muted-foreground">ایمیل:</span>
                <span className="mr-2">{step1Data.clientEmail}</span>
              </div>
              <div>
                <span className="text-muted-foreground">تلفن:</span>
                <span className="mr-2">{step1Data.clientPhone}</span>
              </div>
              <div>
                <span className="text-muted-foreground">بخش:</span>
                <span className="mr-2">{step1Data.department}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
