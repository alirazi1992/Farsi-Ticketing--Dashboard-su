"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { useTickets, ticketCategories } from "@/lib/ticket-context"
import { Send, X, Upload, File, Trash2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface SimpleTicketFormProps {
  onCancel: () => void
}

interface AttachedFile {
  id: string
  name: string
  size: number
  type: string
  url: string
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
  const [attachedFiles, setAttachedFiles] = useState<AttachedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)

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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files) return

    setIsUploading(true)

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          toast({
            title: "خطا",
            description: `فایل ${file.name} بیش از 10 مگابایت است`,
            variant: "destructive",
          })
          continue
        }

        // Simulate file upload
        await new Promise((resolve) => setTimeout(resolve, 1000))

        const newFile: AttachedFile = {
          id: Date.now().toString() + i,
          name: file.name,
          size: file.size,
          type: file.type,
          url: URL.createObjectURL(file),
        }

        setAttachedFiles((prev) => [...prev, newFile])
      }

      toast({
        title: "فایل‌ها آپلود شدند",
        description: "فایل‌های انتخابی با موفقیت آپلود شدند",
      })
    } catch (error) {
      toast({
        title: "خطا در آپلود",
        description: "خطا در آپلود فایل‌ها",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      // Reset input
      event.target.value = ""
    }
  }

  const removeFile = (fileId: string) => {
    setAttachedFiles((prev) => prev.filter((file) => file.id !== fileId))
    toast({
      title: "فایل حذف شد",
      description: "فایل از لیست پیوست‌ها حذف شد",
    })
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
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
      attachments: attachedFiles.map((file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
        url: file.url,
      })),
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

          {/* File Upload Section */}
          <div className="space-y-2">
            <Label className="text-right font-iran">پیوست فایل (اختیاری)</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
              <div className="text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <div className="text-sm text-gray-600 mb-2 font-iran">فایل‌های خود را اینجا بکشید یا کلیک کنید</div>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.txt,.zip,.rar"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("file-upload")?.click()}
                  disabled={isUploading}
                  className="font-iran bg-transparent"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin ml-2" />
                      در حال آپلود...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 ml-2" />
                      انتخاب فایل
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-500 mt-2 font-iran">
                  حداکثر حجم: 10 مگابایت | فرمت‌های مجاز: JPG, PNG, PDF, DOC, TXT, ZIP
                </p>
              </div>
            </div>

            {/* Attached Files List */}
            {attachedFiles.length > 0 && (
              <div className="space-y-2">
                <Label className="text-right font-iran">فایل‌های پیوست شده:</Label>
                <div className="space-y-2">
                  {attachedFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <div className="flex items-center gap-2 flex-1 justify-end">
                        <div className="text-right">
                          <p className="text-sm font-medium font-iran">{file.name}</p>
                          <p className="text-xs text-gray-500 font-iran">{formatFileSize(file.size)}</p>
                        </div>
                        <File className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
