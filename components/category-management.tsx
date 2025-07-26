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
  onCategoriesUpdate: (categories: any) => void
}

export function CategoryManagement({ categories, onCategoriesUpdate }: CategoryManagementProps) {
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

    onCategoriesUpdate(updatedCategories)
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

    onCategoriesUpdate(updatedCategories)
    setSubCategoryDialogOpen(false)
    setEditingSubCategory(null)
    resetSubCategoryForm()
  }

  // Handle category delete
  const handleDeleteCategory = (categoryId: string) => {
    const updatedCategories = { ...categories }
    delete updatedCategories[categoryId]

    onCategoriesUpdate(updatedCategories)
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
    const updatedSubIssues = { ...updatedCategories[categoryId].subIssues }
    delete updatedSubIssues[subCategoryId]

    updatedCategories[categoryId] = {
      ...updatedCategories[categoryId],
      subIssues: updatedSubIssues,
    }

    onCategoriesUpdate(updatedCategories)
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
    <div className="space-y-6" dir="rtl">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-right">مدیریت دسته‌بندی‌ها</CardTitle>
            <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="gap-2"
                  onClick={() => {
                    setEditingCategory(null)
                    resetCategoryForm()
                  }}
                >
                  <Plus className="w-4 h-4" />
                  دسته‌بندی جدید
                </Button>
              </DialogTrigger>
              <DialogContent dir="rtl">
                <DialogHeader>
                  <DialogTitle className="text-right">
                    {editingCategory ? "ویرایش دسته‌بندی" : "دسته‌بندی جدید"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCategorySubmit(onCategorySubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="id" className="text-right">
                      شناسه دسته *
                    </Label>
                    <Controller
                      name="id"
                      control={categoryControl}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="مثال: new-category"
                          className="text-right"
                          dir="rtl"
                          disabled={!!editingCategory}
                        />
                      )}
                    />
                    {categoryErrors.id && (
                      <p className="text-sm text-red-500 text-right">{categoryErrors.id.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="label" className="text-right">
                      نام دسته *
                    </Label>
                    <Controller
                      name="label"
                      control={categoryControl}
                      render={({ field }) => (
                        <Input {...field} placeholder="نام دسته‌بندی" className="text-right" dir="rtl" />
                      )}
                    />
                    {categoryErrors.label && (
                      <p className="text-sm text-red-500 text-right">{categoryErrors.label.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-right">
                      توضیحات
                    </Label>
                    <Controller
                      name="description"
                      control={categoryControl}
                      render={({ field }) => (
                        <Textarea {...field} placeholder="توضیحات دسته‌بندی" className="text-right" dir="rtl" />
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="icon" className="text-right">
                      آیکون *
                    </Label>
                    <Controller
                      name="icon"
                      control={categoryControl}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                          <SelectTrigger className="text-right">
                            <SelectValue placeholder="انتخاب آیکون" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableIcons.map((icon) => {
                              const IconComponent = icon.icon
                              return (
                                <SelectItem key={icon.id} value={icon.id}>
                                  <div className="flex items-center gap-2">
                                    <IconComponent className="w-4 h-4" />
                                    <span>{icon.label}</span>
                                  </div>
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {categoryErrors.icon && (
                      <p className="text-sm text-red-500 text-right">{categoryErrors.icon.message}</p>
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
                    >
                      انصراف
                    </Button>
                    <Button type="submit">{editingCategory ? "به‌روزرسانی" : "ایجاد"}</Button>
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
              <h3 className="font-semibold text-right">دسته‌بندی‌ها</h3>
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
                          <span className="font-medium">{category.label}</span>
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
                            <AlertDialogContent dir="rtl">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-right">حذف دسته‌بندی</AlertDialogTitle>
                                <AlertDialogDescription className="text-right">
                                  آیا از حذف دسته‌بندی "{category.label}" اطمینان دارید؟ این عمل قابل بازگشت نیست.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>انصراف</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteCategory(category.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  حذف
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      {category.description && (
                        <p className="text-sm text-muted-foreground mt-1 text-right">{category.description}</p>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <Badge variant="outline" className="text-xs">
                          {Object.keys(category.subIssues || {}).length} زیردسته
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
                    <h3 className="font-semibold text-right">زیردسته‌های {categories[selectedCategory]?.label}</h3>
                    <Dialog open={subCategoryDialogOpen} onOpenChange={setSubCategoryDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 bg-transparent"
                          onClick={() => {
                            setEditingSubCategory(null)
                            resetSubCategoryForm()
                          }}
                        >
                          <FolderPlus className="w-4 h-4" />
                          زیردسته جدید
                        </Button>
                      </DialogTrigger>
                      <DialogContent dir="rtl">
                        <DialogHeader>
                          <DialogTitle className="text-right">
                            {editingSubCategory ? "ویرایش زیردسته" : "زیردسته جدید"}
                          </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubCategorySubmit(onSubCategorySubmit)} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="id" className="text-right">
                              شناسه زیردسته *
                            </Label>
                            <Controller
                              name="id"
                              control={subCategoryControl}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  placeholder="مثال: new-sub-category"
                                  className="text-right"
                                  dir="rtl"
                                  disabled={!!editingSubCategory}
                                />
                              )}
                            />
                            {subCategoryErrors.id && (
                              <p className="text-sm text-red-500 text-right">{subCategoryErrors.id.message}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="label" className="text-right">
                              نام زیردسته *
                            </Label>
                            <Controller
                              name="label"
                              control={subCategoryControl}
                              render={({ field }) => (
                                <Input {...field} placeholder="نام زیردسته" className="text-right" dir="rtl" />
                              )}
                            />
                            {subCategoryErrors.label && (
                              <p className="text-sm text-red-500 text-right">{subCategoryErrors.label.message}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="description" className="text-right">
                              توضیحات
                            </Label>
                            <Controller
                              name="description"
                              control={subCategoryControl}
                              render={({ field }) => (
                                <Textarea {...field} placeholder="توضیحات زیردسته" className="text-right" dir="rtl" />
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
                            >
                              انصراف
                            </Button>
                            <Button type="submit">{editingSubCategory ? "به‌روزرسانی" : "ایجاد"}</Button>
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
                            <h4 className="font-medium text-right">{subCategory.label}</h4>
                            {subCategory.description && (
                              <p className="text-sm text-muted-foreground mt-1 text-right">{subCategory.description}</p>
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
                              <AlertDialogContent dir="rtl">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-right">حذف زیردسته</AlertDialogTitle>
                                  <AlertDialogDescription className="text-right">
                                    آیا از حذف زیردسته "{subCategory.label}" اطمینان دارید؟ این عمل قابل بازگشت نیست.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>انصراف</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteSubCategory(selectedCategory, subCategory.id)}
                                    className="bg-red-600 hover:bg-red-700"
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
                        <h3 className="text-lg font-medium text-muted-foreground">زیردسته‌ای وجود ندارد</h3>
                        <p className="text-sm text-muted-foreground mt-1">برای شروع، زیردسته جدیدی اضافه کنید</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground">دسته‌بندی انتخاب کنید</h3>
                  <p className="text-sm text-muted-foreground mt-1">
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
