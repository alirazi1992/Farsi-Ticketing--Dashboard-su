"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-react"

interface TicketFormStep1Props {
  categories: any[]
  initialData: any
  onSubmit: (data: any) => void
  onCancel: () => void
}

export function TicketFormStep1({ categories, initialData, onSubmit, onCancel }: TicketFormStep1Props) {
  const [formData, setFormData] = useState({
    title: initialData.title || "",
    category: initialData.category || "",
    subcategory: initialData.subcategory || "",
    priority: initialData.priority || "medium",
  })

  const [selectedCategory, setSelectedCategory] = useState<any>(null)
  const [availableSubcategories, setAvailableSubcategories] = useState<any[]>([])

  useEffect(() => {
    if (formData.category) {
      const category = categories.find((cat) => cat.id === formData.category)
      setSelectedCategory(category)
      setAvailableSubcategories(category?.subcategories || [])
    } else {
      setSelectedCategory(null)
      setAvailableSubcategories([])
    }
  }, [formData.category, categories])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleCategoryChange = (categoryId: string) => {
    setFormData({
      ...formData,
      category: categoryId,
      subcategory: "", // Reset subcategory when category changes
    })
  }

  const priorityOptions = [
    { value: "low", label: "کم", color: "bg-green-100 text-green-800" },
    { value: "medium", label: "متوسط", color: "bg-yellow-100 text-yellow-800" },
    { value: "high", label: "بالا", color: "bg-orange-100 text-orange-800" },
    { value: "urgent", label: "فوری", color: "bg-red-100 text-red-800" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">مرحله اول: اطلاعات اولیه تیکت</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-right">
              عنوان تیکت *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="عنوان مشکل خود را وارد کنید"
              required
              className="text-right"
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label className="text-right">دسته‌بندی *</Label>
            <Select value={formData.category} onValueChange={handleCategoryChange} required>
              <SelectTrigger className="text-right">
                <SelectValue placeholder="دسته‌بندی مشکل را انتخاب کنید" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="text-right">
                      <div className="font-medium">{category.name}</div>
                      <div className="text-sm text-muted-foreground">{category.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subcategory */}
          {selectedCategory && availableSubcategories.length > 0 && (
            <div className="space-y-2">
              <Label className="text-right">زیردسته *</Label>
              <Select
                value={formData.subcategory}
                onValueChange={(value) => setFormData({ ...formData, subcategory: value })}
                required
              >
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="زیردسته مشکل را انتخاب کنید" />
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
          )}

          {/* Priority */}
          <div className="space-y-2">
            <Label className="text-right">اولویت *</Label>
            <Select
              value={formData.priority}
              onValueChange={(value) => setFormData({ ...formData, priority: value })}
              required
            >
              <SelectTrigger className="text-right">
                <SelectValue placeholder="اولویت مشکل را انتخاب کنید" />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <Badge className={option.color}>{option.label}</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Selected Category Info */}
          {selectedCategory && (
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium text-right mb-2">دسته‌بندی انتخاب شده:</h4>
              <p className="text-sm text-right">
                <strong>{selectedCategory.name}</strong> - {selectedCategory.description}
              </p>
              {formData.subcategory && (
                <p className="text-sm text-right mt-1">
                  زیردسته:{" "}
                  <strong>{availableSubcategories.find((sub) => sub.id === formData.subcategory)?.name}</strong>
                </p>
              )}
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              انصراف
            </Button>
            <Button
              type="submit"
              disabled={
                !formData.title || !formData.category || (availableSubcategories.length > 0 && !formData.subcategory)
              }
              className="gap-2"
            >
              مرحله بعد
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
