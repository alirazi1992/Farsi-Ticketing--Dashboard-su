"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
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
import { Plus, Edit, Trash2, FolderOpen, Tag } from "lucide-react"

interface CategoryManagementProps {
  categoriesData: any
  onCategoryUpdate: (updatedCategories: any) => void
}

export function CategoryManagement({ categoriesData, onCategoryUpdate }: CategoryManagementProps) {
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [editingSubcategory, setEditingSubcategory] = useState<any>(null)
  const [newCategoryDialog, setNewCategoryDialog] = useState(false)
  const [newSubcategoryDialog, setNewSubcategoryDialog] = useState(false)
  const [selectedParentCategory, setSelectedParentCategory] = useState("")

  // Form states
  const [categoryForm, setCategoryForm] = useState({
    id: "",
    label: "",
    description: "",
  })

  const [subcategoryForm, setSubcategoryForm] = useState({
    id: "",
    label: "",
    description: "",
    parentCategory: "",
  })

  const resetCategoryForm = () => {
    setCategoryForm({
      id: "",
      label: "",
      description: "",
    })
  }

  const resetSubcategoryForm = () => {
    setSubcategoryForm({
      id: "",
      label: "",
      description: "",
      parentCategory: "",
    })
  }

  const handleAddCategory = () => {
    if (!categoryForm.id || !categoryForm.label) {
      toast({
        title: "خطا",
        description: "لطفاً تمام فیلدهای الزامی را پر کنید",
        variant: "destructive",
      })
      return
    }

    if (categoriesData[categoryForm.id]) {
      toast({
        title: "خطا",
        description: "دسته‌بندی با این شناسه قبلاً وجود دارد",
        variant: "destructive",
      })
      return
    }

    const newCategory = {
      id: categoryForm.id,
      label: categoryForm.label,
      description: categoryForm.description,
      subIssues: {},
    }

    const updatedCategories = {
      ...categoriesData,
      [categoryForm.id]: newCategory,
    }

    onCategoryUpdate(updatedCategories)
    resetCategoryForm()
    setNewCategoryDialog(false)

    toast({
      title: "موفق",
      description: "دسته‌بندی جدید اضافه شد",
    })
  }

  const handleEditCategory = (categoryId: string) => {
    const category = categoriesData[categoryId]
    setCategoryForm({
      id: category.id,
      label: category.label,
      description: category.description,
    })
    setEditingCategory(categoryId)
  }

  const handleUpdateCategory = () => {
    if (!categoryForm.label) {
      toast({
        title: "خطا",
        description: "لطفاً تمام فیلدهای الزامی را پر کنید",
        variant: "destructive",
      })
      return
    }

    const updatedCategories = {
      ...categoriesData,
      [editingCategory]: {
        ...categoriesData[editingCategory],
        label: categoryForm.label,
        description: categoryForm.description,
      },
    }

    onCategoryUpdate(updatedCategories)
    resetCategoryForm()
    setEditingCategory(null)

    toast({
      title: "موفق",
      description: "دسته‌بندی به‌روزرسانی شد",
    })
  }

  const handleDeleteCategory = (categoryId: string) => {
    const updatedCategories = { ...categoriesData }
    delete updatedCategories[categoryId]

    onCategoryUpdate(updatedCategories)

    toast({
      title: "موفق",
      description: "دسته‌بندی حذف شد",
    })
  }

  const handleAddSubcategory = () => {
    if (!subcategoryForm.id || !subcategoryForm.label || !subcategoryForm.parentCategory) {
      toast({
        title: "خطا",
        description: "لطفاً تمام فیلدهای الزامی را پر کنید",
        variant: "destructive",
      })
      return
    }

    const parentCategory = categoriesData[subcategoryForm.parentCategory]
    if (parentCategory.subIssues[subcategoryForm.id]) {
      toast({
        title: "خطا",
        description: "زیردسته با این شناسه قبلاً وجود دارد",
        variant: "destructive",
      })
      return
    }

    const newSubcategory = {
      id: subcategoryForm.id,
      label: subcategoryForm.label,
      description: subcategoryForm.description,
    }

    const updatedCategories = {
      ...categoriesData,
      [subcategoryForm.parentCategory]: {
        ...parentCategory,
        subIssues: {
          ...parentCategory.subIssues,
          [subcategoryForm.id]: newSubcategory,
        },
      },
    }

    onCategoryUpdate(updatedCategories)
    resetSubcategoryForm()
    setNewSubcategoryDialog(false)

    toast({
      title: "موفق",
      description: "زیردسته جدید اضافه شد",
    })
  }

  const handleEditSubcategory = (categoryId: string, subcategoryId: string) => {
    const subcategory = categoriesData[categoryId].subIssues[subcategoryId]
    setSubcategoryForm({
      id: subcategory.id,
      label: subcategory.label,
      description: subcategory.description,
      parentCategory: categoryId,
    })
    setEditingSubcategory(`${categoryId}-${subcategoryId}`)
  }

  const handleUpdateSubcategory = () => {
    if (!subcategoryForm.label) {
      toast({
        title: "خطا",
        description: "لطفاً تمام فیلدهای الزامی را پر کنید",
        variant: "destructive",
      })
      return
    }

    const [categoryId, subcategoryId] = editingSubcategory.split("-")

    const updatedCategories = {
      ...categoriesData,
      [categoryId]: {
        ...categoriesData[categoryId],
        subIssues: {
          ...categoriesData[categoryId].subIssues,
          [subcategoryId]: {
            ...categoriesData[categoryId].subIssues[subcategoryId],
            label: subcategoryForm.label,
            description: subcategoryForm.description,
          },
        },
      },
    }

    onCategoryUpdate(updatedCategories)
    resetSubcategoryForm()
    setEditingSubcategory(null)

    toast({
      title: "موفق",
      description: "زیردسته به‌روزرسانی شد",
    })
  }

  const handleDeleteSubcategory = (categoryId: string, subcategoryId: string) => {
    const updatedCategories = {
      ...categoriesData,
      [categoryId]: {
        ...categoriesData[categoryId],
        subIssues: Object.fromEntries(
          Object.entries(categoriesData[categoryId].subIssues).filter(([key]) => key !== subcategoryId),
        ),
      },
    }

    onCategoryUpdate(updatedCategories)

    toast({
      title: "موفق",
      description: "زیردسته حذف شد",
    })
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-right">مدیریت دسته‌بندی‌ها</h2>
          <p className="text-muted-foreground text-right">مدیریت دسته‌بندی‌ها و زیردسته‌های تیکت‌ها</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={newCategoryDialog} onOpenChange={setNewCategoryDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                دسته‌بندی جدید
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md" dir="rtl">
              <DialogHeader>
                <DialogTitle className="text-right">افزودن دسته‌بندی جدید</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category-id" className="text-right">
                    شناسه دسته‌بندی *
                  </Label>
                  <Input
                    id="category-id"
                    value={categoryForm.id}
                    onChange={(e) => setCategoryForm({ ...categoryForm, id: e.target.value })}
                    placeholder="مثال: hardware"
                    className="text-right"
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category-label" className="text-right">
                    نام دسته‌بندی *
                  </Label>
                  <Input
                    id="category-label"
                    value={categoryForm.label}
                    onChange={(e) => setCategoryForm({ ...categoryForm, label: e.target.value })}
                    placeholder="مثال: مشکلات سخت‌افزاری"
                    className="text-right"
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category-description" className="text-right">
                    توضیحات
                  </Label>
                  <Textarea
                    id="category-description"
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    placeholder="توضیح کوتاه از دسته‌بندی"
                    className="text-right"
                    dir="rtl"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setNewCategoryDialog(false)}>
                    انصراف
                  </Button>
                  <Button onClick={handleAddCategory}>افزودن</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={newSubcategoryDialog} onOpenChange={setNewSubcategoryDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Plus className="w-4 h-4" />
                زیردسته جدید
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md" dir="rtl">
              <DialogHeader>
                <DialogTitle className="text-right">افزودن زیردسته جدید</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="parent-category" className="text-right">
                    دسته‌بندی والد *
                  </Label>
                  <Select
                    value={subcategoryForm.parentCategory}
                    onValueChange={(value) => setSubcategoryForm({ ...subcategoryForm, parentCategory: value })}
                    dir="rtl"
                  >
                    <SelectTrigger className="text-right">
                      <SelectValue placeholder="انتخاب دسته‌بندی" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(categoriesData).map((category: any) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subcategory-id" className="text-right">
                    شناسه زیردسته *
                  </Label>
                  <Input
                    id="subcategory-id"
                    value={subcategoryForm.id}
                    onChange={(e) => setSubcategoryForm({ ...subcategoryForm, id: e.target.value })}
                    placeholder="مثال: computer-not-working"
                    className="text-right"
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subcategory-label" className="text-right">
                    نام زیردسته *
                  </Label>
                  <Input
                    id="subcategory-label"
                    value={subcategoryForm.label}
                    onChange={(e) => setSubcategoryForm({ ...subcategoryForm, label: e.target.value })}
                    placeholder="مثال: رایانه کار نمی‌کند"
                    className="text-right"
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subcategory-description" className="text-right">
                    توضیحات
                  </Label>
                  <Textarea
                    id="subcategory-description"
                    value={subcategoryForm.description}
                    onChange={(e) => setSubcategoryForm({ ...subcategoryForm, description: e.target.value })}
                    placeholder="توضیح کوتاه از زیردسته"
                    className="text-right"
                    dir="rtl"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setNewSubcategoryDialog(false)}>
                    انصراف
                  </Button>
                  <Button onClick={handleAddSubcategory}>افزودن</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Categories List */}
      <div className="grid gap-6">
        {Object.values(categoriesData).map((category: any) => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="text-right">
                  <CardTitle className="flex items-center gap-2 text-right">
                    <FolderOpen className="w-5 h-5" />
                    {category.label}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                  <Badge variant="secondary" className="mt-2">
                    {Object.keys(category.subIssues).length} زیردسته
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Dialog
                    open={editingCategory === category.id}
                    onOpenChange={(open) => !open && setEditingCategory(null)}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => handleEditCategory(category.id)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md" dir="rtl">
                      <DialogHeader>
                        <DialogTitle className="text-right">ویرایش دسته‌بندی</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="edit-category-label" className="text-right">
                            نام دسته‌بندی *
                          </Label>
                          <Input
                            id="edit-category-label"
                            value={categoryForm.label}
                            onChange={(e) => setCategoryForm({ ...categoryForm, label: e.target.value })}
                            className="text-right"
                            dir="rtl"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="edit-category-description" className="text-right">
                            توضیحات
                          </Label>
                          <Textarea
                            id="edit-category-description"
                            value={categoryForm.description}
                            onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                            className="text-right"
                            dir="rtl"
                          />
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" onClick={() => setEditingCategory(null)}>
                            انصراف
                          </Button>
                          <Button onClick={handleUpdateCategory}>به‌روزرسانی</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent dir="rtl">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-right">حذف دسته‌بندی</AlertDialogTitle>
                        <AlertDialogDescription className="text-right">
                          آیا مطمئن هستید که می‌خواهید دسته‌بندی "{category.label}" و تمام زیردسته‌های آن را حذف کنید؟ این
                          عمل قابل بازگشت نیست.
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
            </CardHeader>
            <CardContent>
              <Separator className="mb-4" />
              <div className="space-y-3">
                <h4 className="font-medium text-right flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  زیردسته‌ها
                </h4>
                {Object.keys(category.subIssues).length === 0 ? (
                  <p className="text-sm text-muted-foreground text-right">هیچ زیردسته‌ای تعریف نشده است</p>
                ) : (
                  <div className="grid gap-2">
                    {Object.values(category.subIssues).map((subcategory: any) => (
                      <div
                        key={subcategory.id}
                        className="flex justify-between items-center p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="text-right">
                          <p className="font-medium">{subcategory.label}</p>
                          <p className="text-sm text-muted-foreground">{subcategory.description}</p>
                        </div>
                        <div className="flex gap-2">
                          <Dialog
                            open={editingSubcategory === `${category.id}-${subcategory.id}`}
                            onOpenChange={(open) => !open && setEditingSubcategory(null)}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditSubcategory(category.id, subcategory.id)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md" dir="rtl">
                              <DialogHeader>
                                <DialogTitle className="text-right">ویرایش زیردسته</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-subcategory-label" className="text-right">
                                    نام زیردسته *
                                  </Label>
                                  <Input
                                    id="edit-subcategory-label"
                                    value={subcategoryForm.label}
                                    onChange={(e) => setSubcategoryForm({ ...subcategoryForm, label: e.target.value })}
                                    className="text-right"
                                    dir="rtl"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-subcategory-description" className="text-right">
                                    توضیحات
                                  </Label>
                                  <Textarea
                                    id="edit-subcategory-description"
                                    value={subcategoryForm.description}
                                    onChange={(e) =>
                                      setSubcategoryForm({ ...subcategoryForm, description: e.target.value })
                                    }
                                    className="text-right"
                                    dir="rtl"
                                  />
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline" onClick={() => setEditingSubcategory(null)}>
                                    انصراف
                                  </Button>
                                  <Button onClick={handleUpdateSubcategory}>به‌روزرسانی</Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 bg-transparent"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent dir="rtl">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-right">حذف زیردسته</AlertDialogTitle>
                                <AlertDialogDescription className="text-right">
                                  آیا مطمئن هستید که می‌خواهید زیردسته "{subcategory.label}" را حذف کنید؟ این عمل قابل
                                  بازگشت نیست.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>انصراف</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteSubcategory(category.id, subcategory.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  حذف
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
