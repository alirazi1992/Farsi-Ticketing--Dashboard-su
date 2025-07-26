"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import { ticketFormStep1Schema } from "@/lib/validation-schemas"

interface TicketFormStep1Props {
  onNext: (data: any) => void
  initialData?: any
  categories: any
}

export function TicketFormStep1({ onNext, initialData, categories }: TicketFormStep1Props) {
  const [selectedCategory, setSelectedCategory] = useState(initialData?.category || "")
  const [selectedSubcategory, setSelectedSubcategory] = useState(initialData?.subcategory || "")

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(ticketFormStep1Schema),
    defaultValues: initialData || {},
  })

  const watchedCategory = watch("category")

  useEffect(() => {
    if (watchedCategory && watchedCategory !== selectedCategory) {
      setSelectedCategory(watchedCategory)
      setSelectedSubcategory("")
      setValue("subcategory", "")
    }
  }, [watchedCategory, selectedCategory, setValue])

  const onSubmit = (data: any) => {
    onNext({
      ...data,
      category: selectedCategory,
      subcategory: selectedSubcategory,
    })
  }

  const availableSubcategories = selectedCategory ? categories[selectedCategory] || [] : []

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="requesterName">نام درخواست‌کننده *</Label>
          <Input id="requesterName" {...register("requesterName")} placeholder="نام و نام خانوادگی" />
          {errors.requesterName && <p className="text-sm text-red-500">{errors.requesterName.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">ایمیل *</Label>
          <Input id="email" type="email" {...register("email")} placeholder="example@company.com" />
          {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">شماره تماس</Label>
          <Input id="phone" {...register("phone")} placeholder="09123456789" />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">واحد/بخش *</Label>
          <Input id="department" {...register("department")} placeholder="نام واحد یا بخش" />
          {errors.department && <p className="text-sm text-red-500">{errors.department.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">دسته‌بندی *</Label>
          <Select
            value={selectedCategory}
            onValueChange={(value) => {
              setSelectedCategory(value)
              setValue("category", value)
              setSelectedSubcategory("")
              setValue("subcategory", "")
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="انتخاب دسته‌بندی" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(categories).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.category && <p className="text-sm text-red-500">{errors.category.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="subcategory">زیردسته *</Label>
          <Select
            value={selectedSubcategory}
            onValueChange={(value) => {
              setSelectedSubcategory(value)
              setValue("subcategory", value)
            }}
            disabled={!selectedCategory || availableSubcategories.length === 0}
          >
            <SelectTrigger>
              <SelectValue placeholder="انتخاب زیردسته" />
            </SelectTrigger>
            <SelectContent>
              {availableSubcategories.map((subcategory: string) => (
                <SelectItem key={subcategory} value={subcategory}>
                  {subcategory}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.subcategory && <p className="text-sm text-red-500">{errors.subcategory.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="priority">اولویت *</Label>
        <Select onValueChange={(value) => setValue("priority", value)}>
          <SelectTrigger>
            <SelectValue placeholder="انتخاب اولویت" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">کم</SelectItem>
            <SelectItem value="medium">متوسط</SelectItem>
            <SelectItem value="high">بالا</SelectItem>
            <SelectItem value="urgent">فوری</SelectItem>
          </SelectContent>
        </Select>
        {errors.priority && <p className="text-sm text-red-500">{errors.priority.message}</p>}
      </div>

      <div className="flex justify-end">
        <Button type="submit" className="gap-2">
          مرحله بعد
          <ArrowLeft className="w-4 h-4" />
        </Button>
      </div>
    </form>
  )
}
