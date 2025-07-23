"use client"

import { Controller } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUpload } from "@/components/file-upload"
import { DynamicFormFields } from "@/components/dynamic-form-fields"
import { FileText, Paperclip, HardDrive, Monitor, Wifi, Mail, Shield, Key } from "lucide-react"
import type { UploadedFile } from "@/lib/file-upload"

interface TicketFormStep2Props {
  control: any
  errors: any
  mainCategory: string
  subCategory: string
  attachedFiles: UploadedFile[]
  onFilesChange: (files: UploadedFile[]) => void
}

export function TicketFormStep2({
  control,
  errors,
  mainCategory,
  subCategory,
  attachedFiles,
  onFilesChange,
}: TicketFormStep2Props) {
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "hardware":
        return <HardDrive className="w-5 h-5" />
      case "software":
        return <Monitor className="w-5 h-5" />
      case "network":
        return <Wifi className="w-5 h-5" />
      case "email":
        return <Mail className="w-5 h-5" />
      case "security":
        return <Shield className="w-5 h-5" />
      case "access":
        return <Key className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  const getCategoryTitle = (cat: string) => {
    switch (cat) {
      case "hardware":
        return "مشکلات سخت‌افزاری"
      case "software":
        return "مشکلات نرم‌افزاری"
      case "network":
        return "مشکلات شبکه"
      case "email":
        return "مشکلات ایمیل"
      case "security":
        return "حوادث امنیتی"
      case "access":
        return "درخواست دسترسی"
      default:
        return "جزئیات تیکت"
    }
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Title and Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right">
            <FileText className="w-5 h-5" />
            عنوان و شرح مشکل
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-right">
              عنوان تیکت *
            </Label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input {...field} placeholder="عنوان کوتاه و واضح از مشکل" className="text-right" dir="rtl" />
              )}
            />
            {errors.title && <p className="text-sm text-red-500 text-right">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-right">
              شرح کامل مشکل *
            </Label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="لطفاً مشکل خود را به تفصیل شرح دهید..."
                  rows={5}
                  className="text-right"
                  dir="rtl"
                />
              )}
            />
            {errors.description && <p className="text-sm text-red-500 text-right">{errors.description.message}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Category Specific Fields */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right">
            {getCategoryIcon(mainCategory)}
            {getCategoryTitle(mainCategory)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DynamicFormFields control={control} errors={errors} subCategory={subCategory} />
        </CardContent>
      </Card>

      {/* File Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right">
            <Paperclip className="w-5 h-5" />
            پیوست فایل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FileUpload onFilesChange={onFilesChange} maxFiles={5} />
          <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800 text-right">
              <strong>توصیه:</strong> برای تسریع در حل مشکل، تصاویر، فایل‌های لاگ، یا اسکرین‌شات مربوط به مشکل را پیوست
              کنید.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
