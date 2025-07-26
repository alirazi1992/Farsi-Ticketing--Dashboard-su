"use client"

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronRight } from "lucide-react"

// Validation schema
const step1Schema = yup.object({
  category: yup.string().required("انتخاب دسته‌بندی الزامی است"),
  subcategory: yup.string().required("انتخاب زیردسته الزامی است"),
  priority: yup.string().required("انتخاب اولویت الزامی است"),
})

interface TicketFormStep1Props {
  onNext: (data: any) => void
  initialData?: any
  categoriesData: any
}

export function TicketFormStep1({ onNext, initialData = {}, categoriesData }: TicketFormStep1Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [availableSubcategories, setAvailableSubcategories] = useState<any[]>([])

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(step1Schema),
    defaultValues: {
      category: initialData.category || "",
      subcategory: initialData.subcategory || "",
      priority: initialData.priority || "",
    },
  })

  const watchedCategory = watch("category")

  // Update subcategories when category changes
  useEffect(() => {
    if (watchedCategory && categoriesData[watchedCategory]) {
      const subcategories = Object.values(categoriesData[watchedCategory].subIssues || {})
      setAvailableSubcategories(subcategories)
      setSelectedCategory(watchedCategory)

      // Reset subcategory if it doesn't exist in new category
      const currentSubcategory = watch("subcategory")
      const subcategoryExists = subcategories.some((sub: any) => sub.id === currentSubcategory)
      if (!subcategoryExists) {
        setValue("subcategory", "")
      }
    } else {
      setAvailableSubcategories([])
      setValue("subcategory", "")
    }
  }, [watchedCategory, categoriesData, setValue, watch])

  const onSubmit = (data: any) => {
    // Get category and subcategory labels for display
    const categoryData = categoriesData[data.category]
    const subcategoryData = categoryData?.subIssues[data.subcategory]

    onNext({
      ...data,
      categoryLabel: categoryData?.label || data.category,
      subcategoryLabel: subcategoryData?.label || data.subcategory,
    })
  }

  const priorityOptions = [
    { value: "low", label: "پایین", color: "text-green-600" },
    { value: "medium", label: "متوسط", color: "text-yellow-600" },
    { value: "high", label: "بالا", color: "text-orange-600" },
    { value: "urgent", label: "فوری", color: "text-red-600" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">مرحله ۱: انتخاب دسته‌بندی و اولویت</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Category Selection */}
          <div className="space-y-2">
            <Label className="text-right">دسته‌بندی مشکل *</Label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="دسته‌بندی مشکل را انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(categoriesData).map((category: any) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="text-right">
                          <div className="font-medium">{category.label}</div>
                          {category.description && (
                            <div className="text-xs text-muted-foreground">{category.description}</div>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && <p className="text-sm text-red-500 text-right">{errors.category.message}</p>}
          </div>

          {/* Subcategory Selection */}
          <div className="space-y-2">
            <Label className="text-right">نوع مشکل *</Label>
            <Controller
              name="subcategory"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!selectedCategory || availableSubcategories.length === 0}
                  dir="rtl"
                >
                  <SelectTrigger className="text-right">
                    <SelectValue
                      placeholder={
                        !selectedCategory
                          ? "ابتدا دسته‌بندی را انتخاب کنید"
                          : availableSubcategories.length === 0
                            ? "زیردسته‌ای موجود نیست"
                            : "نوع مشکل را انتخاب کنید"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubcategories.map((subcategory: any) => (
                      <SelectItem key={subcategory.id} value={subcategory.id}>
                        <div className="text-right">
                          <div className="font-medium">{subcategory.label}</div>
                          {subcategory.description && (
                            <div className="text-xs text-muted-foreground">{subcategory.description}</div>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.subcategory && <p className="text-sm text-red-500 text-right">{errors.subcategory.message}</p>}
          </div>

          {/* Priority Selection */}
          <div className="space-y-2">
            <Label className="text-right">اولویت *</Label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="اولویت مشکل را انتخاب کنید" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityOptions.map((priority) => (
                      <SelectItem key={priority.value} value={priority.value}>
                        <div className={`text-right font-medium ${priority.color}`}>{priority.label}</div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.priority && <p className="text-sm text-red-500 text-right">{errors.priority.message}</p>}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button type="submit" className="gap-2">
              مرحله بعد
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
