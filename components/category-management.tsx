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
import { Plus, Edit, Trash2, FolderPlus, Settings } from "lucide-react"

// Validation schemas (removed icon field)
const categorySchema = yup.object({
  id: yup.string().required("شناسه دسته الزامی است"),
  label: yup.string().required("نام دسته الزامی است"),
  description: yup.string().optional(),
})

const subCategorySchema = yup.object({
  id: yup.string().required("شناسه زیردسته الزامی است"),
  label: yup.string().required("نام زیردسته الزامی است"),
  description: yup.string().optional(),
})

interface CategoryManagementProps {
  categoriesData: any
  onCategoryUpdate: (categories: any) => void
}

export function CategoryManagement({ categoriesData, onCategoryUpdate }: CategoryManagementProps) {
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

  // 🔄 SYNC: Handle category save - updates centralized state
  const onCategorySubmit = (data: any) => {
    const updatedCategories = { ...categoriesData }

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

    // 🔄 SYNC: Update centralized state - this will sync to Client Dashboard
    onCategoryUpdate(updatedCategories)

    setCategoryDialogOpen(false)
    setEditingCategory(null)
    resetCategoryForm()
  }

  // 🔄 SYNC: Handle sub-category save - updates centralized state
  const onSubCategorySubmit = (data: any) => {
    if (!selectedCategory) return

    const updatedCategories = { ...categoriesData }

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

    // 🔄 SYNC: Update centralized state - this will sync to Client Dashboard
    onCategoryUpdate(updatedCategories)

    setSubCategoryDialogOpen(false)
    setEditingSubCategory(null)
    resetSubCategoryForm()
  }

  // 🔄 SYNC: Handle category delete - updates centralized state
  const handleDeleteCategory = (categoryId: string) => {
    const updatedCategories = { ...categoriesData }
    delete updatedCategories[categoryId]

    // 🔄 SYNC: Update centralized state - this will sync to Client Dashboard
    onCategoryUpdate(updatedCategories)

    toast({
      title: "دسته‌بندی حذف شد",
      description: "دسته‌بندی با موفقیت حذف شد",
    })

    if (selectedCategory === categoryId) {
      setSelectedCategory(null)
    }
  }

  // 🔄 SYNC: Handle sub-category delete - updates centralized state
  const handleDeleteSubCategory = (categoryId: string, subCategoryId: string) => {
    const updatedCategories = {
      ...categoriesData,
      [categoryId]: {
        ...categoriesData[categoryId],
        subIssues: Object.fromEntries(
          Object.entries(categoriesData[categoryId].subIssues).filter(([key]) => key !== subCategoryId),
        ),
      },
    }

    // 🔄 SYNC: Update centralized state - this will sync to Client Dashboard
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
                {Object.values(categoriesData).map((category: any) => {
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
                    <h3 className="font-semibold text-right">زیردسته‌های {categoriesData[selectedCategory]?.label}</h3>
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
                    {Object.values(categoriesData[selectedCategory]?.subIssues || {}).map((subCategory: any) => (
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

                    {Object.keys(categoriesData[selectedCategory]?.subIssues || {}).length === 0 && (
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
