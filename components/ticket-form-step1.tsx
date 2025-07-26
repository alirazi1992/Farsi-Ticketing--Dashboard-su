"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight, AlertTriangle, Clock, ArrowUp, ArrowDown } from "lucide-react"

interface TicketFormStep1Props {
  initialData: any
  onSubmit: (data: any) => void
  categories: any[]
}

export function TicketFormStep1({ initialData, onSubmit, categories }: TicketFormStep1Props) {
  const [formData, setFormData] = useState({
    category: initialData.category || "",
    subcategory: initialData.subcategory || "",
    priority: initialData.priority || "",
    title: initialData.title || "",
    description: initialData.description || "",
  })

  const [availableSubcategories, setAvailableSubcategories] = useState<any[]>([])

  // Update subcategories when category changes
  useEffect(() => {
    if (formData.category) {
      const selectedCategory = categories.find((cat) => cat.id === formData.category)
      setAvailableSubcategories(selectedCategory?.subcategories || [])

      // Reset subcategory if it's not available in the new category
      if (formData.subcategory) {
        const isSubcategoryAvailable = selectedCategory?.subcategories?.some(
          (sub: any) => sub.id === formData.subcategory,
        )
        if (!isSubcategoryAvailable) {
          setFormData((prev) => ({ ...prev, subcategory: "" }))
        }
      }
    } else {
      setAvailableSubcategories([])
      setFormData((prev) => ({ ...prev, subcategory: "" }))
    }
  }, [formData.category, categories])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const isFormValid =
    formData.category && formData.subcategory && formData.priority && formData.title && formData.description

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case "high":
        return <ArrowUp className="w-4 h-4 text-orange-500" />
      case "medium":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "low":
        return <ArrowDown className="w-4 h-4 text-green-500" />
      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Selection */}
        <div className="space-y-2">
          <Label htmlFor="category" className="text-right">
            دسته‌بندی *
          </Label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
          >
            <SelectTrigger className="text-right">
              <SelectValue placeholder="انتخاب دسته‌بندی" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Subcategory Selection */}
        <div className="space-y-2">
          <Label htmlFor="subcategory" className="text-right">
            زیردسته *
          </Label>
          <Select
            value={formData.subcategory}
            onValueChange={(value) => setFormData((prev) => ({ ...prev, subcategory: value }))}
            disabled={!formData.category}
          >
            <SelectTrigger className="text-right">
              <SelectValue placeholder="انتخاب زیردسته" />
            </SelectTrigger>
            <SelectContent>
              {availableSubcategories.map((subcategory) => (
                <SelectItem key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Priority Selection */}
      <div className="space-y-2">
        <Label htmlFor="priority" className="text-right">
          اولویت *
        </Label>
        <Select
          value={formData.priority}
          onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))}
        >
          <SelectTrigger className="text-right">
            <SelectValue placeholder="انتخاب اولویت" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="urgent">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <span>فوری</span>
              </div>
            </SelectItem>
            <SelectItem value="high">
              <div className="flex items-center gap-2">
                <ArrowUp className="w-4 h-4 text-orange-500" />
                <span>بالا</span>
              </div>
            </SelectItem>
            <SelectItem value="medium">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-500" />
                <span>متوسط</span>
              </div>
            </SelectItem>
            <SelectItem value="low">
              <div className="flex items-center gap-2">
                <ArrowDown className="w-4 h-4 text-green-500" />
                <span>پایین</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-right">
          عنوان تیکت *
        </Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="عنوان مختصر و واضح برای مشکل خود وارد کنید"
          className="text-right"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-right">
          توضیحات *
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="توضیح کاملی از مشکل، مراحل انجام شده، و اطلاعات مفید دیگر ارائه دهید"
          className="text-right min-h-[120px]"
        />
      </div>

      {/* Preview Card */}
      {isFormValid && (
        <Card className="bg-muted/50">
          <CardContent className="p-4">
            <h4 className="font-medium mb-2 text-right">پیش‌نمایش تیکت:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">دسته‌بندی:</span>
                <span>{categories.find((cat) => cat.id === formData.category)?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">زیردسته:</span>
                <span>{availableSubcategories.find((sub) => sub.id === formData.subcategory)?.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">اولویت:</span>
                <div className="flex items-center gap-1">
                  {getPriorityIcon(formData.priority)}
                  <span>
                    {formData.priority === "urgent" && "فوری"}
                    {formData.priority === "high" && "بالا"}
                    {formData.priority === "medium" && "متوسط"}
                    {formData.priority === "low" && "پایین"}
                  </span>
                </div>
              </div>
              <div className="pt-2 border-t">
                <p className="font-medium text-right">{formData.title}</p>
                <p className="text-muted-foreground text-right mt-1 line-clamp-2">{formData.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={!isFormValid} className="gap-2">
          مرحله بعد
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  )
}
