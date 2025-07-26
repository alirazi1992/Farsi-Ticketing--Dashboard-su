"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft } from "lucide-react"

interface FormData {
  clientName: string
  clientEmail: string
  clientPhone: string
}

interface TicketFormStep1Props {
  initialData: FormData
  onSubmit: (data: FormData) => void
}

export function TicketFormStep1({ initialData, onSubmit }: TicketFormStep1Props) {
  const [formData, setFormData] = useState<FormData>(initialData)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-iran" dir="rtl">
      <div className="space-y-4">
        <h3 className="text-lg font-medium font-iran">اطلاعات تماس</h3>
        <p className="text-sm text-muted-foreground font-iran">
          اطلاعات زیر از پروفایل شما تکمیل شده است. در صورت نیاز می‌توانید آن‌ها را ویرایش کنید.
        </p>

        <div className="space-y-2">
          <Label htmlFor="clientName" className="text-right block font-iran">
            نام و نام خانوادگی *
          </Label>
          <Input
            id="clientName"
            type="text"
            value={formData.clientName}
            onChange={(e) => handleChange("clientName", e.target.value)}
            required
            className="text-right font-iran"
            dir="rtl"
            placeholder="نام کامل خود را وارد کنید"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientEmail" className="text-right block font-iran">
            ایمیل *
          </Label>
          <Input
            id="clientEmail"
            type="email"
            value={formData.clientEmail}
            onChange={(e) => handleChange("clientEmail", e.target.value)}
            required
            className="text-right font-iran"
            dir="rtl"
            placeholder="example@company.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clientPhone" className="text-right block font-iran">
            شماره تماس *
          </Label>
          <Input
            id="clientPhone"
            type="tel"
            value={formData.clientPhone}
            onChange={(e) => handleChange("clientPhone", e.target.value)}
            required
            className="text-right font-iran"
            dir="rtl"
            placeholder="09123456789"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="font-iran">
          مرحله بعد
          <ChevronLeft className="mr-2 h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}
