"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "@/hooks/use-toast"
import {
  Plus,
  Edit,
  Trash2,
  FolderPlus,
  Settings,
  HardDrive,
  ComputerIcon as Software,
  Network,
  Mail,
  Shield,
  Key,
  BookOpen,
  Wrench,
} from "lucide-react"

// Validation schemas
const categorySchema = yup.object({
  id: yup.string().required("شناسه دسته الزامی است"),
  label: yup.string().required("نام دسته الزامی است"),
  description: yup.string().optional(),
  icon: yup.string().required("انتخاب آیکون الزامی است"),
})

const subCategorySchema = yup.object({
  id: yup.string().required("شناسه زیردسته الزامی است"),
  label: yup.string().required("نام زیردسته الزامی است"),
  description: yup.string().optional(),
})

// Available icons
const availableIcons = [
  { id: "hardware", label: "سخت‌افزار", icon: HardDrive },
  { id: "software", label: "نرم‌افزار", icon: Software },
  { id: "network", label: "شبکه", icon: Network },
  { id: "email", label: "ایمیل", icon: Mail },
  { id: "security", label: "امنیت", icon: Shield },
  { id: "access", label: "دسترسی", icon: Key },
  { id: "training", label: "آموزش", icon: BookOpen },
  { id: "maintenance", label: "نگهداری", icon: Wrench },
]

interface CategoryManagementProps {
  categories: any
  onCategoryUpdate: (categories: any) => void
}

export function CategoryManagement({ categories, onCategoryUpdate }: CategoryManagementProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [editingSubCategory, setEditingSubCategory] = useState<any>(null)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [subCategoryDialogOpen, setSubCategoryDialogOpen] = useState(false)

  // Category form
  const {
    control: categoryControl,
    handleSubmit: handleCategorySubmit,
    reset: resetCategoryForm,
    formState: { errors: categoryErrors },
  } = useForm({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      id: "",
      label: "",
      description: "",
      icon: "",
    },
  })

  // Sub-category form
  const {
    control: subCategoryControl,
    handleSubmit: handleSubCategorySubmit,
    reset: resetSubCategoryForm,
    formState: { errors: subCategoryErrors },
  } = useForm({
    resolver: yupResolver(subCategorySchema),
    defaultValues: {
      id: "",
      label: "",
      description: "",
    },
  })

  // Handle category save
  const onCategorySubmit = (data: any) => {
    const updatedCategories = { ...categories }

    if (editingCategory) {
      // Update existing category
      updatedCategories[data.id] = {
        ...updatedCategories[data.id],
        ...data,
      }
      toast({
        title: "دسته‌بندی به‌روزرسانی شد",
        description: `دسته‌بندی "${data.label}" با موفقیت به‌روزرسانی شد`,
      })
    } else {
      // Add new category
      updatedCategories[data.id] = {
        ...data,
        subIssues: {},
      }
      toast({
        title: "دسته‌بندی جدید اضافه شد",
        description: `دسته‌بندی "${data.label}" با موفقیت اضافه شد`,
      })
    }

    // Sync to parent component and all dashboards
    onCategoryUpdate(updatedCategories)

    setCategoryDialogOpen(false)
    setEditingCategory(null)
    resetCategoryForm()
  }

  // Handle sub-category save
  const onSubCategorySubmit = (data: any) => {
    if (!selectedCategory) return

    const updatedCategories = { ...categories }

    if (editingSubCategory) {
      // Update existing sub-category
      updatedCategories[selectedCategory] = {
        ...updatedCategories[selectedCategory],
        subIssues: {
          ...updatedCategories[selectedCategory].subIssues,
          [data.id]: data,
        },
      }
      toast({
        title: "زیردسته به‌روزرسانی شد",
        description: `زیردسته "${data.label}" با موفقیت به‌روزرسانی شد`,
      })
    } else {
      // Add new sub-category
      updatedCategories[selectedCategory] = {
        ...updatedCategories[selectedCategory],
        subIssues: {
          ...updatedCategories[selectedCategory].subIssues,
          [data.id]: data,
        },
      }
      toast({
        title: "زیردسته جدید اضافه شد",
        description: `زیردسته "${data.label}" با موفقیت اضافه شد`,
      })
    }

    // Sync to parent component and all dashboards
    onCategoryUpdate(updatedCategories)

    setSubCategoryDialogOpen(false)
    setEditingSubCategory(null)
    resetSubCategoryForm()
  }

  // Handle category delete
  const handleDeleteCategory = (categoryId: string) => {
    const updatedCategories = { ...categories }
    delete updatedCategories[categoryId]

    // Sync to parent component and all dashboards
    onCategoryUpdate(updatedCategories)

    toast({
      title: "دسته‌بندی حذف شد",
      description: "دسته‌بندی با موفقیت حذف شد",
    })

    if (selectedCategory === categoryId) {
      setSelectedCategory(null)
    }
  }

  // Handle sub-category delete
  const handleDeleteSubCategory = (categoryId: string, subCategoryId: string) => {
    const updatedCategories = { ...categories }
    updatedCategories[categoryId] = {
      ...updatedCategories[categoryId],
      subIssues: Object.fromEntries(
        Object.entries(updatedCategories[categoryId].subIssues).filter(([key]) => key !== subCategoryId),
      ),
    }

    // Sync to parent component and all dashboards
    onCategoryUpdate(updatedCategories)

    toast({
      title: "زیردسته حذف شد",
      description: "زیردسته با موفقیت حذف شد",
    })
  }

  // Handle edit category
  const handleEditCategory = (category: any) => {
    setEditingCategory(category)
    resetCategoryForm({
      id: category.id,
      label: category.label,
      description: category.description || "",
      icon: category.icon,
    })
    setCategoryDialogOpen(true)
  }

  // Handle edit sub-category
  const handleEditSubCategory = (subCategory: any) => {
    setEditingSubCategory(subCategory)
    resetSubCategoryForm({
      id: subCategory.id,
      label: subCategory.label,
      description: subCategory.description || "",
    })
    setSubCategoryDialogOpen(true)
  }

  return (
    <div className="space-y-6 font-iran" dir="rtl">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-right font-iran">مدیریت دسته‌بندی‌ها</CardTitle>
            <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="gap-2 font-iran"
                  onClick={() => {
                    setEditingCategory(null)
                    resetCategoryForm()
                  }}
                >
                  <Plus className="w-4 h-4" />
                  دسته‌بندی جدید
                </Button>
              </DialogTrigger>
              <DialogContent dir="rtl" className="font-iran">
                <DialogHeader>
                  <DialogTitle className="text-right font-iran">
                    {editingCategory ? "ویرایش دسته‌بندی" : "دسته‌بندی جدید"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCategorySubmit(onCategorySubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="id" className="text-right font-iran">
                      شناسه دسته *
                    </Label>
                    <Controller
                      name="id"
                      control={categoryControl}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="مثال: new-category"
                          className="text-right font-iran"
                          dir="rtl"
                          disabled={!!editingCategory}
                        />
                      )}
                    />
                    {categoryErrors.id && (
                      <p className="text-sm text-red-500 text-right font-iran">{categoryErrors.id.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="label" className="text-right font-iran">
                      نام دسته *
                    </Label>
                    <Controller
                      name="label"
                      control={categoryControl}
                      render={({ field }) => (
                        <Input {...field} placeholder="نام دسته‌بندی" className="text-right font-iran" dir="rtl" />
                      )}
                    />
                    {categoryErrors.label && (
                      <p className="text-sm text-red-500 text-right font-iran">{categoryErrors.label.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-right font-iran">
                      توضیحات
                    </Label>
                    <Controller
                      name="description"
                      control={categoryControl}
                      render={({ field }) => (
                        <Textarea
                          {...field}
                          placeholder="توضیحات دسته‌بندی"
                          className="text-right font-iran"
                          dir="rtl"
                        />
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="icon" className="text-right font-iran">
                      آیکون *
                    </Label>
                    <Controller
                      name="icon"
                      control={categoryControl}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                          <SelectTrigger className="text-right font-iran">
                            <SelectValue placeholder="انتخاب آیکون" />
                          </SelectTrigger>
                          <SelectContent className="font-iran">
                            {availableIcons.map((icon) => {
                              const IconComponent = icon.icon
                              return (
                                <SelectItem key={icon.id} value={icon.id}>
                                  <div className="flex items-center gap-2">
                                    <IconComponent className="w-4 h-4" />
                                    <span className="font-iran">{icon.label}</span>
                                  </div>
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {categoryErrors.icon && (
                      <p className="text-sm text-red-500 text-right font-iran">{categoryErrors.icon.message}</p>
                    )}
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setCategoryDialogOpen(false)
                        setEditingCategory(null)
                        resetCategoryForm()
                      }}
                      className="font-iran"
                    >
                      انصراف
                    </Button>
                    <Button type="submit" className="font-iran">
                      {editingCategory ? "به‌روزرسانی" : "ایجاد"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Categories List */}
            <div className="space-y-4">
              <h3 className="font-semibold text-right font-iran">دسته‌بندی‌ها</h3>
              <div className="space-y-2">
                {Object.values(categories).map((category: any) => {
                  const IconComponent = availableIcons.find((icon) => icon.id === category.icon)?.icon || Settings
                  return (
                    <div
                      key={category.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedCategory === category.id ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4" />
                          <span className="font-medium font-iran">{category.label}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditCategory(category)
                            }}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => e.stopPropagation()}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent dir="rtl" className="font-iran">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-right font-iran">حذف دسته‌بندی</AlertDialogTitle>
                                <AlertDialogDescription className="text-right font-iran">
                                  آیا از حذف دسته‌بندی "{category.label}" اطمینان دارید؟ این عمل قابل بازگشت نیست.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="font-iran">انصراف</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteCategory(category.id)}
                                  className="bg-red-600 hover:bg-red-700 font-iran"
                                >
                                  حذف
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      {category.description && (
                        <p className="text-sm text-muted-foreground mt-1 text-right font-iran">
                          {category.description}
                        </p>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <Badge variant="outline" className="text-xs font-iran">
                          {Object.keys(category.subIssues).length} زیردسته
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Sub-categories */}
            <div className="lg:col-span-2">
              {selectedCategory ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-right font-iran">
                      زیردسته‌های {categories[selectedCategory]?.label}
                    </h3>
                    <Dialog open={subCategoryDialogOpen} onOpenChange={setSubCategoryDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 bg-transparent font-iran"
                          onClick={() => {
                            setEditingSubCategory(null)
                            resetSubCategoryForm()
                          }}
                        >
                          <FolderPlus className="w-4 h-4" />
                          زیردسته جدید
                        </Button>
                      </DialogTrigger>
                      <DialogContent dir="rtl" className="font-iran">
                        <DialogHeader>
                          <DialogTitle className="text-right font-iran">
                            {editingSubCategory ? "ویرایش زیردسته" : "زیردسته جدید"}
                          </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubCategorySubmit(onSubCategorySubmit)} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="id" className="text-right font-iran">
                              شناسه زیردسته *
                            </Label>
                            <Controller
                              name="id"
                              control={subCategoryControl}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  placeholder="مثال: new-sub-category"
                                  className="text-right font-iran"
                                  dir="rtl"
                                  disabled={!!editingSubCategory}
                                />
                              )}
                            />
                            {subCategoryErrors.id && (
                              <p className="text-sm text-red-500 text-right font-iran">
                                {subCategoryErrors.id.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="label" className="text-right font-iran">
                              نام زیردسته *
                            </Label>
                            <Controller
                              name="label"
                              control={subCategoryControl}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  placeholder="نام زیردسته"
                                  className="text-right font-iran"
                                  dir="rtl"
                                />
                              )}
                            />
                            {subCategoryErrors.label && (
                              <p className="text-sm text-red-500 text-right font-iran">
                                {subCategoryErrors.label.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="description" className="text-right font-iran">
                              توضیحات
                            </Label>
                            <Controller
                              name="description"
                              control={subCategoryControl}
                              render={({ field }) => (
                                <Textarea
                                  {...field}
                                  placeholder="توضیحات زیردسته"
                                  className="text-right font-iran"
                                  dir="rtl"
                                />
                              )}
                            />
                          </div>

                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setSubCategoryDialogOpen(false)
                                setEditingSubCategory(null)
                                resetSubCategoryForm()
                              }}
                              className="font-iran"
                            >
                              انصراف
                            </Button>
                            <Button type="submit" className="font-iran">
                              {editingSubCategory ? "به‌روزرسانی" : "ایجاد"}
                            </Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="space-y-2">
                    {Object.values(categories[selectedCategory]?.subIssues || {}).map((subCategory: any) => (
                      <div key={subCategory.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-right font-iran">{subCategory.label}</h4>
                            {subCategory.description && (
                              <p className="text-sm text-muted-foreground mt-1 text-right font-iran">
                                {subCategory.description}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleEditSubCategory(subCategory)}>
                              <Edit className="w-3 h-3" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent dir="rtl" className="font-iran">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-right font-iran">حذف زیردسته</AlertDialogTitle>
                                  <AlertDialogDescription className="text-right font-iran">
                                    آیا از حذف زیردسته "{subCategory.label}" اطمینان دارید؟ این عمل قابل بازگشت نیست.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="font-iran">انصراف</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteSubCategory(selectedCategory, subCategory.id)}
                                    className="bg-red-600 hover:bg-red-700 font-iran"
                                  >
                                    حذف
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    ))}

                    {Object.keys(categories[selectedCategory]?.subIssues || {}).length === 0 && (
                      <div className="text-center py-8">
                        <FolderPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-muted-foreground font-iran">زیردسته‌ای وجود ندارد</h3>
                        <p className="text-sm text-muted-foreground mt-1 font-iran">
                          برای شروع، زیردسته جدیدی اضافه کنید
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground font-iran">دسته‌بندی انتخاب کنید</h3>
                  <p className="text-sm text-muted-foreground mt-1 font-iran">
                    برای مشاهده و مدیریت زیردسته‌ها، یک دسته‌بندی از فهرست سمت راست انتخاب کنید
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
