"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { useTickets, ticketCategories } from "@/lib/ticket-context"
import { Send, X } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface SimpleTicketFormProps {
  onCancel: () => void
}

export function SimpleTicketForm({ onCancel }: SimpleTicketFormProps) {
  const { user } = useAuth()
  const { addTicket } = useTickets()
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subcategory: "",
    priority: "",
    description: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCategoryChange = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      category,
      subcategory: "", // Reset subcategory when category changes
    }))
  }

  const handleSubmit = () => {
    if (!formData.title || !formData.category || !formData.priority || !formData.description) {
      toast({
        title: "خطا",
        description: "لطفاً تمام فیلدهای ضروری را تکمیل کنید",
        variant: "destructive",
      })
      return
    }

    // Create ticket with user's information from auth context
    addTicket({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      subcategory: formData.subcategory || "سایر",
      priority: formData.priority as "low" | "medium" | "high" | "urgent",
      status: "open",
      clientId: user?.id || "",
      clientName: user?.name || "",
      clientEmail: user?.email || "",
      clientPhone: user?.phone || "",
      clientDepartment: user?.department || "",
    })

    toast({
      title: "تیکت ایجاد شد",
      description: "تیکت شما با موفقیت ثبت شد و به زودی بررسی خواهد شد",
    })

    onCancel() // Close the form
  }

  const priorities = [
    { value: "low", label: "کم" },
    { value: "medium", label: "متوسط" },
    { value: "high", label: "بالا" },
    { value: "urgent", label: "فوری" },
  ]

  const subcategoryOptions = formData.category
    ? ticketCategories[formData.category as keyof typeof ticketCategories] || []
    : []

  return (
    <div className="space-y-6 font-iran" dir="rtl">
      <Card>
        <CardHeader>
          <CardTitle className="text-right font-iran">ایجاد تیکت جدید</CardTitle>
          <CardDescription className="text-right font-iran">اطلاعات مربوط به مشکل خود را وارد کنید</CardDescription>
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-right font-iran">
                دسته‌بندی *
              </Label>
              <Select value={formData.category} onValueChange={handleCategoryChange} dir="rtl">
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
                  {subcategoryOptions.map((subcategory) => (
                    <SelectItem key={subcategory} value={subcategory} className="text-right font-iran">
                      {subcategory}
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

          {/* User Info Display (Read-only) */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-right font-iran">اطلاعات درخواست‌کننده:</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-right font-iran">
                <span className="font-medium">نام:</span> {user?.name}
              </div>
              <div className="text-right font-iran">
                <span className="font-medium">ایمیل:</span> {user?.email}
              </div>
              <div className="text-right font-iran">
                <span className="font-medium">تلفن:</span> {user?.phone}
              </div>
              <div className="text-right font-iran">
                <span className="font-medium">بخش:</span> {user?.department}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel} className="font-iran bg-transparent">
          <X className="ml-2 h-4 w-4" />
          انصراف
        </Button>

        <Button
          onClick={handleSubmit}
          disabled={!formData.title || !formData.category || !formData.priority || !formData.description}
          className="bg-green-600 hover:bg-green-700 font-iran"
        >
          <Send className="mr-2 h-4 w-4" />
          ارسال تیکت
        </Button>
      </div>
    </div>
  )
}
