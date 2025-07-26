"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileUpload } from "@/components/file-upload"
import { useAuth } from "@/lib/auth-context"
import { useTickets, ticketCategories } from "@/lib/ticket-context"
import { toast } from "@/hooks/use-toast"
import { User, Mail, Phone, Building, Send, X } from "lucide-react"

interface SimpleTicketFormProps {
  onCancel?: () => void
}

export function SimpleTicketForm({ onCancel }: SimpleTicketFormProps) {
  const { user } = useAuth()
  const { addTicket } = useTickets()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subcategory: "",
    priority: "medium" as "low" | "medium" | "high" | "urgent",
  })
  const [attachments, setAttachments] = useState<File[]>([])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
      // Reset subcategory when category changes
      ...(field === "category" ? { subcategory: "" } : {}),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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
      await new Promise((resolve) => setTimeout(resolve, 1000))

      addTicket({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        subcategory: formData.subcategory,
        priority: formData.priority,
        status: "open",
        clientId: user?.id || "unknown",
        clientName: user?.name || "کاربر ناشناس",
        clientEmail: user?.email || "",
        clientPhone: user?.phone || "",
        clientDepartment: user?.department || "",
        attachments: attachments.map((file) => file.name),
      })

      toast({
        title: "تیکت ثبت شد",
        description: "تیکت شما با موفقیت ثبت شد و به زودی بررسی خواهد شد",
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

      // Go back to tickets list
      if (onCancel) {
        onCancel()
      }
    } catch (error) {
      toast({
        title: "خطا در ارسال",
        description: "مشکلی در ثبت تیکت پیش آمد. لطفاً دوباره تلاش کنید",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const availableSubcategories = formData.category ? ticketCategories[formData.category] || [] : []

  return (
    <div className="space-y-6 font-iran" dir="rtl">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-right font-iran">ثبت تیکت جدید</CardTitle>
            {onCancel && (
              <Button variant="ghost" size="sm" onClick={onCancel} className="gap-2 font-iran">
                <X className="w-4 h-4" />
                انصراف
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Information - RTL Layout */}
            <div className="bg-blue-50 rounded-lg p-4 border-r-4 border-r-blue-500" dir="rtl">
              <h3 className="font-semibold mb-4 text-right font-iran">اطلاعات درخواست‌کننده</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4" dir="rtl">
                <div className="flex items-center gap-3 justify-end" dir="rtl">
                  <div className="text-right">
                    <p className="font-medium font-iran">{user?.name}</p>
                    <p className="text-sm text-muted-foreground font-iran">نام کامل</p>
                  </div>
                  <User className="w-5 h-5 text-blue-600" />
                </div>

                <div className="flex items-center gap-3 justify-end" dir="rtl">
                  <div className="text-right">
                    <p className="font-medium font-iran">{user?.email}</p>
                    <p className="text-sm text-muted-foreground font-iran">ایمیل</p>
                  </div>
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>

                <div className="flex items-center gap-3 justify-end" dir="rtl">
                  <div className="text-right">
                    <p className="font-medium font-iran">{user?.phone}</p>
                    <p className="text-sm text-muted-foreground font-iran">تلفن</p>
                  </div>
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>

                <div className="flex items-center gap-3 justify-end" dir="rtl">
                  <div className="text-right">
                    <p className="font-medium font-iran">{user?.department}</p>
                    <p className="text-sm text-muted-foreground font-iran">بخش</p>
                  </div>
                  <Building className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Ticket Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-right font-iran">
                  عنوان تیکت *
                </Label>
                <Input
                  id="title"
                  placeholder="عنوان مشکل یا درخواست خود را وارد کنید..."
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="text-right font-iran"
                  dir="rtl"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      {Object.keys(ticketCategories).map((category) => (
                        <SelectItem key={category} value={category} className="text-right font-iran">
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subcategory" className="text-right font-iran">
                    زیر دسته
                  </Label>
                  <Select
                    value={formData.subcategory}
                    onValueChange={(value) => handleInputChange("subcategory", value)}
                    disabled={!formData.category}
                    dir="rtl"
                  >
                    <SelectTrigger className="text-right font-iran" dir="rtl">
                      <SelectValue placeholder="انتخاب زیر دسته" />
                    </SelectTrigger>
                    <SelectContent dir="rtl" className="font-iran">
                      {availableSubcategories.map((subcategory) => (
                        <SelectItem key={subcategory} value={subcategory} className="text-right font-iran">
                          {subcategory}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="text-right font-iran">
                  اولویت
                </Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleInputChange("priority", value)}
                  dir="rtl"
                >
                  <SelectTrigger className="text-right font-iran" dir="rtl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent dir="rtl" className="font-iran">
                    <SelectItem value="low" className="text-right font-iran">
                      پایین
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
                <Label htmlFor="description" className="text-right font-iran">
                  شرح مشکل *
                </Label>
                <Textarea
                  id="description"
                  placeholder="لطفاً مشکل یا درخواست خود را به تفصیل شرح دهید..."
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="text-right font-iran min-h-[120px]"
                  dir="rtl"
                  required
                />
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label className="text-right font-iran">پیوست فایل (اختیاری)</Label>
                <FileUpload
                  onFilesChange={setAttachments}
                  maxFiles={5}
                  maxSize={10 * 1024 * 1024} // 10MB
                  acceptedTypes={[".jpg", ".jpeg", ".png", ".pdf", ".doc", ".docx", ".txt", ".zip"]}
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 justify-end">
              {onCancel && (
                <Button type="button" variant="outline" onClick={onCancel} className="font-iran bg-transparent">
                  انصراف
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting} className="gap-2 font-iran">
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    در حال ارسال...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    ثبت تیکت
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
