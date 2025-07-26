"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUpload } from "@/components/file-upload"

interface FormData {
  title: string
  description: string
  category: string
  subcategory: string
  priority: "low" | "medium" | "high" | "urgent"
  attachments: string[]
}

interface TicketFormStep2Props {
  initialData: FormData
  onSubmit: (data: FormData) => void
}

const categories = {
  سخت‌افزار: ["کامپیوتر", "پرینتر", "تجهیزات شبکه", "سایر"],
  نرم‌افزار: ["نصب", "به‌روزرسانی", "خطا", "آموزش"],
  شبکه: ["اتصال اینترنت", "شبکه داخلی", "VPN", "ایمیل"],
  امنیت: ["ویروس", "دسترسی", "رمز عبور", "فایروال"],
  سایر: ["درخواست جدید", "مشاوره", "سایر موارد"],
}

export function TicketFormStep2({ initialData, onSubmit }: TicketFormStep2Props) {
  const [formData, setFormData] = useState<FormData>(initialData)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCategoryChange = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      category,
      subcategory: "", // Reset subcategory when category changes
    }))
  }

  const subcategoryOptions = formData.category ? categories[formData.category as keyof typeof categories] || [] : []

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-iran" dir="rtl">
      <div className="space-y-4">
        <h3 className="text-lg font-medium font-iran">جزئیات تیکت</h3>

        <div className="space-y-2">
          <Label htmlFor="title" className="text-right block font-iran">
            عنوان تیکت *
          </Label>
          <Input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
            className="text-right font-iran"
            dir="rtl"
            placeholder="عنوان مختصری از مشکل خود وارد کنید"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-right block font-iran">
            توضیحات *
          </Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            required
            className="text-right font-iran min-h-[100px]"
            dir="rtl"
            placeholder="توضیح کاملی از مشکل، خطا یا درخواست خود ارائه دهید..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-right block font-iran">دسته‌بندی *</Label>
            <Select value={formData.category} onValueChange={handleCategoryChange} dir="rtl">
              <SelectTrigger className="text-right font-iran">
                <SelectValue placeholder="دسته‌بندی را انتخاب کنید" />
              </SelectTrigger>
              <SelectContent dir="rtl">
                {Object.keys(categories).map((category) => (
                  <SelectItem key={category} value={category} className="text-right font-iran">
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-right block font-iran">زیر دسته</Label>
            <Select
              value={formData.subcategory}
              onValueChange={(value) => handleChange("subcategory", value)}
              disabled={!formData.category}
              dir="rtl"
            >
              <SelectTrigger className="text-right font-iran">
                <SelectValue placeholder="زیر دسته را انتخاب کنید" />
              </SelectTrigger>
              <SelectContent dir="rtl">
                {subcategoryOptions.map((subcategory) => (
                  <SelectItem key={subcategory} value={subcategory} className="text-right font-iran">
                    {subcategory}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-right block font-iran">اولویت *</Label>
          <Select value={formData.priority} onValueChange={(value: any) => handleChange("priority", value)} dir="rtl">
            <SelectTrigger className="text-right font-iran">
              <SelectValue placeholder="اولویت را انتخاب کنید" />
            </SelectTrigger>
            <SelectContent dir="rtl">
              <SelectItem value="low" className="text-right font-iran">
                کم
              </SelectItem>
              <SelectItem value="medium" className="text-right font-iran">
                متوسط
              </SelectItem>
              <SelectItem value="high" className="text-right font-iran">
                بالا
              </SelectItem>
              <SelectItem value="urgent" className="text-right font-iran">
                فوری
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-right block font-iran">فایل‌های پیوست</Label>
          <FileUpload
            onFilesChange={(files) => handleChange("attachments", files)}
            maxFiles={5}
            maxSize={10 * 1024 * 1024} // 10MB
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="font-iran">
          ایجاد تیکت
        </Button>
      </div>
    </form>
  )
}
