"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, FolderTree, Save, X } from "lucide-react"

interface CategoryManagementProps {
  categoriesData: any
  onCategoryUpdate: (categories: any) => void
}

export function CategoryManagement({ categoriesData, onCategoryUpdate }: CategoryManagementProps) {
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [editingSubcategory, setEditingSubcategory] = useState<any>(null)
  const [newCategoryDialog, setNewCategoryDialog] = useState(false)
  const [newSubcategoryDialog, setNewSubcategoryDialog] = useState(false)
  const [selectedCategoryForSub, setSelectedCategoryForSub] = useState<string>("")

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
  })

  // Handle category creation
  const handleCreateCategory = () => {
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
    setNewCategoryDialog(false)
    setCategoryForm({ id: "", label: "", description: "" })

    toast({
      title: "دسته‌بندی ایجاد شد",
      description: `دسته‌بندی "${categoryForm.label}" با موفقیت ایجاد شد`,
    })
  }

  // Handle category editing
  const handleEditCategory = (categoryId: string) => {
    const category = categoriesData[categoryId]
    setEditingCategory(categoryId)
    setCategoryForm({
      id: category.id,
      label: category.label,
      description: category.description,
    })
  }

  // Handle category update
  const handleUpdateCategory = () => {
    if (!categoryForm.label) {
      toast({
        title: "خطا",
        description: "نام دسته‌بندی الزامی است",
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
    setEditingCategory(null)
    setCategoryForm({ id: "", label: "", description: "" })

    toast({
      title: "دسته‌بندی به‌روزرسانی شد",
      description: "تغییرات با موفقیت ذخیره شد",
    })
  }

  // Handle category deletion
  const handleDeleteCategory = (categoryId: string) => {
    const updatedCategories = { ...categoriesData }
    delete updatedCategories[categoryId]

    onCategoryUpdate(updatedCategories)

    toast({
      title: "دسته‌بندی حذف شد",
      description: `دسته‌بندی "${categoriesData[categoryId].label}" حذف شد`,
    })
  }

  // Handle subcategory creation
  const handleCreateSubcategory = () => {
    if (!subcategoryForm.id || !subcategoryForm.label || !selectedCategoryForSub) {
      toast({
        title: "خطا",
        description: "لطفاً تمام فیلدهای الزامی را پر کنید",
        variant: "destructive",
      })
      return
    }

    if (categoriesData[selectedCategoryForSub].subIssues[subcategoryForm.id]) {
      toast({
        title: "خطا",
        description: "زیر دسته با این شناسه قبلاً وجود دارد",
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
      [selectedCategoryForSub]: {
        ...categoriesData[selectedCategoryForSub],
        subIssues: {
          ...categoriesData[selectedCategoryForSub].subIssues,
          [subcategoryForm.id]: newSubcategory,
        },
      },
    }

    onCategoryUpdate(updatedCategories)
    setNewSubcategoryDialog(false)
    setSubcategoryForm({ id: "", label: "", description: "" })
    setSelectedCategoryForSub("")

    toast({
      title: "زیر دسته ایجاد شد",
      description: `زیر دسته "${subcategoryForm.label}" با موفقیت ایجاد شد`,
    })
  }

  // Handle subcategory editing
  const handleEditSubcategory = (categoryId: string, subcategoryId: string) => {
    const subcategory = categoriesData[categoryId].subIssues[subcategoryId]
    setEditingSubcategory(`${categoryId}-${subcategoryId}`)
    setSubcategoryForm({
      id: subcategory.id,
      label: subcategory.label,
      description: subcategory.description,
    })
    setSelectedCategoryForSub(categoryId)
  }

  // Handle subcategory update
  const handleUpdateSubcategory = () => {
    if (!subcategoryForm.label) {
      toast({
        title: "خطا",
        description: "نام زیر دسته الزامی است",
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
    setEditingSubcategory(null)
    setSubcategoryForm({ id: "", label: "", description: "" })
    setSelectedCategoryForSub("")

    toast({
      title: "زیر دسته به‌روزرسانی شد",
      description: "تغییرات با موفقیت ذخیره شد",
    })
  }

  // Handle subcategory deletion
  const handleDeleteSubcategory = (categoryId: string, subcategoryId: string) => {
    const updatedCategories = {
      ...categoriesData,
      [categoryId]: {
        ...categoriesData[categoryId],
        subIssues: { ...categoriesData[categoryId].subIssues },
      },
    }

    delete updatedCategories[categoryId].subIssues[subcategoryId]

    onCategoryUpdate(updatedCategories)

    toast({
      title: "زیر دسته حذف شد",
      description: `زیر دسته "${categoriesData[categoryId].subIssues[subcategoryId].label}" حذف شد`,
    })
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div className="text-right">
          <h2 className="text-2xl font-bold">مدیریت دسته‌بندی‌ها</h2>
          <p className="text-muted-foreground">مدیریت دسته‌بندی‌ها و زیر دسته‌های تیکت‌ها</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={newCategoryDialog} onOpenChange={setNewCategoryDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                دسته‌بندی جدید
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md" dir="rtl">
              <DialogHeader>
                <DialogTitle className="text-right">ایجاد دسته‌بندی جدید</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category-id">شناسه دسته‌بندی *</Label>
                  <Input
                    id="category-id"
                    placeholder="مثال: hardware"
                    value={categoryForm.id}
                    onChange={(e) => setCategoryForm({ ...categoryForm, id: e.target.value })}
                    className="text-right"
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category-label">نام دسته‌بندی *</Label>
                  <Input
                    id="category-label"
                    placeholder="مثال: مشکلات سخت‌افزاری"
                    value={categoryForm.label}
                    onChange={(e) => setCategoryForm({ ...categoryForm, label: e.target.value })}
                    className="text-right"
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category-description">توضیحات</Label>
                  <Textarea
                    id="category-description"
                    placeholder="توضیحات دسته‌بندی..."
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    className="text-right"
                    dir="rtl"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setNewCategoryDialog(false)}>
                    انصراف
                  </Button>
                  <Button onClick={handleCreateCategory} className="gap-2">
                    <Save className="w-4 h-4" />
                    ایجاد
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={newSubcategoryDialog} onOpenChange={setNewSubcategoryDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Plus className="w-4 h-4" />
                زیر دسته جدید
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md" dir="rtl">
              <DialogHeader>
                <DialogTitle className="text-right">ایجاد زیر دسته جدید</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="parent-category">دسته‌بندی والد *</Label>
                  <select
                    id="parent-category"
                    value={selectedCategoryForSub}
                    onChange={(e) => setSelectedCategoryForSub(e.target.value)}
                    className="w-full p-2 border rounded-md text-right"
                    dir="rtl"
                  >
                    <option value="">انتخاب دسته‌بندی...</option>
                    {Object.values(categoriesData).map((category: any) => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subcategory-id">شناسه زیر دسته *</Label>
                  <Input
                    id="subcategory-id"
                    placeholder="مثال: printer-issues"
                    value={subcategoryForm.id}
                    onChange={(e) => setSubcategoryForm({ ...subcategoryForm, id: e.target.value })}
                    className="text-right"
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subcategory-label">نام زیر دسته *</Label>
                  <Input
                    id="subcategory-label"
                    placeholder="مثال: مشکلات چاپگر"
                    value={subcategoryForm.label}
                    onChange={(e) => setSubcategoryForm({ ...subcategoryForm, label: e.target.value })}
                    className="text-right"
                    dir="rtl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subcategory-description">توضیحات</Label>
                  <Textarea
                    id="subcategory-description"
                    placeholder="توضیحات زیر دسته..."
                    value={subcategoryForm.description}
                    onChange={(e) => setSubcategoryForm({ ...subcategoryForm, description: e.target.value })}
                    className="text-right"
                    dir="rtl"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setNewSubcategoryDialog(false)}>
                    انصراف
                  </Button>
                  <Button onClick={handleCreateSubcategory} className="gap-2">
                    <Save className="w-4 h-4" />
                    ایجاد
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        {Object.values(categoriesData).map((category: any) => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="text-right">
                  {editingCategory === category.id ? (
                    <div className="space-y-2">
                      <Input
                        value={categoryForm.label}
                        onChange={(e) => setCategoryForm({ ...categoryForm, label: e.target.value })}
                        className="text-right font-semibold"
                        dir="rtl"
                      />
                      <Textarea
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                        className="text-right text-sm"
                        dir="rtl"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={handleUpdateCategory} className="gap-1">
                          <Save className="w-3 h-3" />
                          ذخیره
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingCategory(null)
                            setCategoryForm({ id: "", label: "", description: "" })
                          }}
                          className="gap-1"
                        >
                          <X className="w-3 h-3" />
                          انصراف
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <CardTitle className="flex items-center gap-2">
                        <FolderTree className="w-5 h-5" />
                        {category.label}
                        <Badge variant="secondary">{category.id}</Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                    </>
                  )}
                </div>
                {editingCategory !== category.id && (
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => handleEditCategory(category.id)} className="gap-1">
                      <Edit className="w-3 h-3" />
                      ویرایش
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteCategory(category.id)}
                      className="gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-3 h-3" />
                      حذف
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h4 className="font-medium text-sm">زیر دسته‌ها:</h4>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">شناسه</TableHead>
                        <TableHead className="text-right">نام</TableHead>
                        <TableHead className="text-right">توضیحات</TableHead>
                        <TableHead className="text-right">عملیات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.values(category.subIssues).length > 0 ? (
                        Object.values(category.subIssues).map((subcategory: any) => (
                          <TableRow key={subcategory.id}>
                            <TableCell className="font-mono text-xs">{subcategory.id}</TableCell>
                            <TableCell>
                              {editingSubcategory === `${category.id}-${subcategory.id}` ? (
                                <Input
                                  value={subcategoryForm.label}
                                  onChange={(e) => setSubcategoryForm({ ...subcategoryForm, label: e.target.value })}
                                  className="text-right"
                                  dir="rtl"
                                />
                              ) : (
                                subcategory.label
                              )}
                            </TableCell>
                            <TableCell>
                              {editingSubcategory === `${category.id}-${subcategory.id}` ? (
                                <Textarea
                                  value={subcategoryForm.description}
                                  onChange={(e) =>
                                    setSubcategoryForm({ ...subcategoryForm, description: e.target.value })
                                  }
                                  className="text-right text-sm"
                                  dir="rtl"
                                />
                              ) : (
                                <span className="text-sm text-muted-foreground">{subcategory.description}</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {editingSubcategory === `${category.id}-${subcategory.id}` ? (
                                <div className="flex gap-1">
                                  <Button size="sm" onClick={handleUpdateSubcategory} className="gap-1">
                                    <Save className="w-3 h-3" />
                                    ذخیره
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setEditingSubcategory(null)
                                      setSubcategoryForm({ id: "", label: "", description: "" })
                                      setSelectedCategoryForSub("")
                                    }}
                                    className="gap-1"
                                  >
                                    <X className="w-3 h-3" />
                                    انصراف
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex gap-1">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleEditSubcategory(category.id, subcategory.id)}
                                    className="gap-1"
                                  >
                                    <Edit className="w-3 h-3" />
                                    ویرایش
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => handleDeleteSubcategory(category.id, subcategory.id)}
                                    className="gap-1 text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                    حذف
                                  </Button>
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4">
                            <p className="text-muted-foreground text-sm">زیر دسته‌ای تعریف نشده است</p>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
