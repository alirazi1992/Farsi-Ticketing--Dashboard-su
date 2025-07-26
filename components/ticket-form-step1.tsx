"use client"

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft } from "lucide-react"

const schema = yup.object({
  title: yup.string().required("عنوان تیکت الزامی است").min(5, "عنوان باید حداقل 5 کاراکتر باشد"),
  description: yup.string().required("توضیحات الزامی است").min(10, "توضیحات باید حداقل 10 کاراکتر باشد"),
  category: yup.string().required("انتخاب دسته‌بندی الزامی است"),
  subcategory: yup.string().required("انتخاب زیردسته الزامی است"),
  priority: yup.string().required("انتخاب اولویت الزامی است"),
})

interface TicketFormStep1Props {
  onNext: (data: any) => void
  categoriesData: any
  initialData?: any
}

export function TicketFormStep1({ onNext, categoriesData, initialData }: TicketFormStep1Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [availableSubcategories, setAvailableSubcategories] = useState<any[]>([])

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      category: initialData?.category || "",
      subcategory: initialData?.subcategory || "",
      priority: initialData?.priority || "",
    },
  })

  const watchedCategory = watch("category")

  useEffect(() => {
    if (watchedCategory && categoriesData[watchedCategory]) {
      setSelectedCategory(watchedCategory)
      const subcategories = Object.values(categoriesData[watchedCategory].subIssues || {})
      setAvailableSubcategories(subcategories)
      // Reset subcategory when category changes
      if (watchedCategory !== initialData?.category) {
        setValue("subcategory", "")
      }
    } else {
      setAvailableSubcategories([])
      setValue("subcategory", "")
    }
  }, [watchedCategory, categoriesData, setValue, initialData?.category])

  // Set initial category and subcategories if initialData exists
  useEffect(() => {
    if (initialData?.category && categoriesData[initialData.category]) {
      setSelectedCategory(initialData.category)
      const subcategories = Object.values(categoriesData[initialData.category].subIssues || {})
      setAvailableSubcategories(subcategories)
    }
  }, [initialData, categoriesData])

  const onSubmit = (data: any) => {
    onNext(data)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-right">مرحله ۱: اطلاعات مشکل</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-right">
              عنوان مشکل *
            </Label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="عنوان کوتاه و واضح از مشکل خود بنویسید"
                  className="text-right"
                  dir="rtl"
                />
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
                  placeholder="لطفاً مشکل خود را به طور کامل و دقیق شرح دهید..."
                  className="min-h-[120px] text-right"
                  dir="rtl"
                />
              )}
            />
            {errors.description && <p className="text-sm text-red-500 text-right">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category" className="text-right">
                دسته‌بندی مشکل *
              </Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                    <SelectTrigger className="text-right">
                      <SelectValue placeholder="انتخاب دسته‌بندی" />
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

            <div className="space-y-2">
              <Label htmlFor="subcategory" className="text-right">
                زیردسته *
              </Label>
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
                      <SelectValue placeholder="انتخاب زیردسته" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSubcategories.map((subcategory: any) => (
                        <SelectItem key={subcategory.id} value={subcategory.label}>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority" className="text-right">
              اولویت *
            </Label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="انتخاب اولویت" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urgent">
                      <div className="text-right">
                        <div className="font-medium text-red-600">فوری</div>
                        <div className="text-xs text-muted-foreground">نیاز به رسیدگی فوری</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="text-right">
                        <div className="font-medium text-orange-600">بالا</div>
                        <div className="text-xs text-muted-foreground">مهم و نیاز به رسیدگی سریع</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="text-right">
                        <div className="font-medium text-yellow-600">متوسط</div>
                        <div className="text-xs text-muted-foreground">اولویت معمولی</div>
                      </div>
                    </SelectItem>
                    <SelectItem value="low">
                      <div className="text-right">
                        <div className="font-medium text-green-600">پایین</div>
                        <div className="text-xs text-muted-foreground">غیر ضروری، زمان مناسب</div>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.priority && <p className="text-sm text-red-500 text-right">{errors.priority.message}</p>}
          </div>

          <div className="flex justify-end">
            <Button type="submit" className="gap-2">
              مرحله بعد
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
