"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/lib/auth-context"
import { useTickets, ticketCategories } from "@/lib/ticket-context"
import { FileUpload } from "@/components/file-upload"
import { toast } from "@/hooks/use-toast"
import { Send, User, Mail, Phone, Building, FileText, Flag, Upload, X } from "lucide-react"

interface SimpleTicketFormProps {
  onCancel?: () => void
}

export function SimpleTicketForm({ onCancel }: SimpleTicketFormProps) {
  const { user } = useAuth()
  const { addTicket } = useTickets()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subcategory: "",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
  })
  const [attachments, setAttachments] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      // Reset subcategory when category changes
      ...(field === "category" ? { subcategory: "" } : {}),
    }))
  }

  const handleFileUpload = (files: File[]) => {
    setAttachments((prev) => [...prev, ...files])
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (!formData.title.trim() || !formData.description.trim() || !formData.category) {
      toast({
        title: "خطا در ارسال",
        description: "لطفاً تمام فیلدهای ضروری را پر کنید",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate file upload delay
      if (attachments.length > 0) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }

      const newTicket = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        subcategory: formData.subcategory,
        priority: formData.priority,
        status: "open" as const,
        clientId: user.id,
        clientName: user.name,
        clientEmail: user.email,
        clientPhone: user.phone || "",
        clientDepartment: user.department || "",
      }

      addTicket(newTicket)

      toast({
        title: "تیکت با موفقیت ایجاد شد",
        description: "تیکت شما ثبت شد و به زودی بررسی خواهد شد",
      })

      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "",
        subcategory: "",
        priority: "medium",
      })
      setAttachments([])

      if (onCancel) {
        onCancel()
      }
    } catch (error) {
      toast({
        title: "خطا در ارسال",
        description: "مشکلی در ارسال تیکت پیش آمد. لطفاً دوباره تلاش کنید",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="max-w-4xl mx-auto font-iran" dir="rtl">
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2 font-iran">
            <FileText className="w-6 h-6 text-blue-600" />
            ایجاد تیکت جدید
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Information Display */}
            <div className="bg-blue-50 rounded-lg p-4 border-r-4 border-r-blue-500" dir="rtl">
              <h3 className="font-semibold mb-3 text-right font-iran">اطلاعات کاربر</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 justify-end">
                  <span className="font-medium font-iran">{user?.name}</span>
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <span className="font-iran">{user?.email}</span>
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <span className="font-iran">{user?.phone}</span>
                  <Phone className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex items-center gap-2 justify-end">
                  <span className="font-iran">{user?.department}</span>
                  <Building className="w-4 h-4 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Ticket Details */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-right block mb-2 font-iran">
                  عنوان تیکت *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="عنوان مشکل یا درخواست خود را بنویسید..."
                  className="text-right font-iran"
                  dir="rtl"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-right block mb-2 font-iran">
                  توضیحات *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="توضیح کاملی از مشکل یا درخواست خود ارائه دهید..."
                  className="text-right font-iran min-h-[120px]"
                  dir="rtl"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category" className="text-right block mb-2 font-iran">
                    دسته‌بندی *
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className="text-right font-iran" dir="rtl">
                      <SelectValue placeholder="انتخاب دسته‌بندی" />
                    </SelectTrigger>
                    <SelectContent dir="rtl" className="font-iran">
                      {Object.keys(ticketCategories).map((category) => (
                        <SelectItem key={category} value={category} className="text-right font-iran">
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="subcategory" className="text-right block mb-2 font-iran">
                    زیر دسته‌بندی
                  </Label>
                  <Select
                    value={formData.subcategory}
                    onValueChange={(value) => handleInputChange("subcategory", value)}
                    disabled={!formData.category}
                  >
                    <SelectTrigger className="text-right font-iran" dir="rtl">
                      <SelectValue placeholder="انتخاب زیر دسته‌بندی" />
                    </SelectTrigger>
                    <SelectContent dir="rtl" className="font-iran">
                      {formData.category &&
                        ticketCategories[formData.category as keyof typeof ticketCategories]?.map((subcategory) => (
                          <SelectItem key={subcategory} value={subcategory} className="text-right font-iran">
                            {subcategory}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="priority" className="text-right block mb-2 font-iran">
                    اولویت
                  </Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                    <SelectTrigger className="text-right font-iran" dir="rtl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent dir="rtl" className="font-iran">
                      <SelectItem value="low" className="text-right font-iran">
                        <div className="flex items-center gap-2">
                          <Flag className="w-3 h-3 text-green-600" />
                          پایین
                        </div>
                      </SelectItem>
                      <SelectItem value="medium" className="text-right font-iran">
                        <div className="flex items-center gap-2">
                          <Flag className="w-3 h-3 text-yellow-600" />
                          متوسط
                        </div>
                      </SelectItem>
                      <SelectItem value="high" className="text-right font-iran">
                        <div className="flex items-center gap-2">
                          <Flag className="w-3 h-3 text-orange-600" />
                          بالا
                        </div>
                      </SelectItem>
                      <SelectItem value="urgent" className="text-right font-iran">
                        <div className="flex items-center gap-2">
                          <Flag className="w-3 h-3 text-red-600" />
                          فوری
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* File Upload Section */}
            <div>
              <Label className="text-right block mb-2 font-iran">
                <Upload className="w-4 h-4 inline ml-1" />
                پیوست فایل (اختیاری)
              </Label>
              <FileUpload onFileUpload={handleFileUpload} />

              {/* Uploaded Files Display */}
              {attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium text-right font-iran">فایل‌های پیوست شده:</h4>
                  {attachments.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <div className="text-right">
                        <p className="text-sm font-medium font-iran">{file.name}</p>
                        <p className="text-xs text-muted-foreground font-iran">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel} className="font-iran bg-transparent">
                  انصراف
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting} className="gap-2 bg-blue-600 hover:bg-blue-700 font-iran">
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    در حال ارسال...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    ارسال تیکت
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
