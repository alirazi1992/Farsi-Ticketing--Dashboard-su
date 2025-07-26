"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
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
import { Plus, Edit, Trash2, FolderTree, Folder, FileText, Save, X } from "lucide-react"

interface CategoryManagementProps {
  categories: any
  onCategoryUpdate: (categories: any) => void
}

export function CategoryManagement({ categories, onCategoryUpdate }: CategoryManagementProps) {
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editingSubcategory, setEditingSubcategory] = useState<{ categoryId: string; index: number } | null>(null)
  const [newCategoryDialog, setNewCategoryDialog] = useState(false)
  const [newSubcategoryDialog, setNewSubcategoryDialog] = useState<string | null>(null)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategoryLabel, setNewCategoryLabel] = useState("")
  const [newSubcategoryName, setNewSubcategoryName] = useState("")
  const [editCategoryLabel, setEditCategoryLabel] = useState("")
  const [editSubcategoryName, setEditSubcategoryName] = useState("")

  // Add new category
  const handleAddCategory = () => {
    if (!newCategoryName.trim() || !newCategoryLabel.trim()) {
      toast({
        title: "خطا",
        description: "لطفاً نام و برچسب دسته‌بندی را وارد کنید",
        variant: "destructive",
      })
      return
    }

    const categoryId = newCategoryName.toLowerCase().replace(/\s+/g, '-')
    
    if (categories[categoryId]) {
      toast({
        title: "خطا",
        description: "این دسته‌بندی قبلاً وجود دارد",
        variant: "destructive",
      })
      return
    }

    const updatedCategories = {
      ...categories,
      [categoryId]: {
        label: newCategoryLabel,
        subcategories: [],
      },
    }

    onCategoryUpdate(updatedCategories)
    setNewCategoryDialog(false)
    setNewCategoryName("")
    setNewCategoryLabel("")
    
    toast({
      title: "دسته‌بندی اضافه شد",
      description: `دسته‌بندی "${newCategoryLabel}" با موفقیت ایجاد شد`,
    })
  }

  // Edit category label
  const handleEditCategory = (categoryId: string) => {
    if (!editCategoryLabel.trim()) {
      toast({
        title: "خطا",
        description: "لطفاً برچسب جدید را وارد کنید",
        variant: "destructive",
      })
      return
    }

    const updatedCategories = {
      ...categories,
      [categoryId]: {
        ...categories[categoryId],
        label: editCategoryLabel,
      },
    }

    onCategoryUpdate(updatedCategories)
    setEditingCategory(null)
    setEditCategoryLabel("")
    
    toast({
      title: "دسته‌بندی ویرایش شد",
      description: "تغییرات با موفقیت اعمال شد",
    })
  }

  // Delete category
  const handleDeleteCategory = (categoryId: string) => {
    const updatedCategories = { ...categories }
    delete updatedCategories[categoryId]
    
    onCategoryUpdate(updatedCategories)
    
    toast({
      title: "دسته‌بندی حذف شد",
      description: `دسته‌بندی "${categories[categoryId].label}" حذف شد`,
    })
  }

  // Add subcategory
  const handleAddSubcategory = (categoryId: string) => {
    if (!newSubcategoryName.trim()) {
      toast({
        title: "خطا",
        description: "لطفاً نام زیردسته را وارد کنید",
        variant: "destructive",
      })
      return
    }

    const updatedCategories = {
      ...categories,
      [categoryId]: {
        ...categories[categoryId],
        subcategories: [...categories[categoryId].subcategories, newSubcategoryName],
      },
    }

    onCategoryUpdate(updatedCategories)
    setNewSubcategoryDialog(null)
    setNewSubcategoryName("")
    
    toast({
      title: "زیردسته اضافه شد",
      description: `زیردسته "${newSubcategoryName}" اضافه شد`,
    })
  }

  // Edit subcategory
  const handleEditSubcategory = (categoryId: string, index: number) => {
    if (!editSubcategoryName.trim()) {
      toast({
        title: "خطا",
        description: "لطفاً نام جدید زیردسته را وارد کنید",
        variant: "destructive",
      })
      return
    }

    const updatedSubcategories = [...categories[categoryId].subcategories]
    updatedSubcategories[index] = editSubcategoryName

    const updatedCategories = {
      ...categories,
      [categoryId]: {
        ...categories[categoryId],
        subcategories: updatedSubcategories,
      },
    }

    onCategoryUpdate(updatedCategories)
    setEditingSubcategory(null)
    setEditSubcategoryName("")
    
    toast({
      title: "زیردسته ویرایش شد",
      description: "تغییرات با موفقیت اعمال شد",
    })
  }

  // Delete subcategory
  const handleDeleteSubcategory = (categoryId: string, index: number) => {
    const updatedSubcategories = categories[categoryId].subcategories.filter((_: any, i: number) => i !== index)
    
    const updatedCategories = {
      ...categories,
      [categoryId]: {
        ...categories[categoryId],
        subcategories: updatedSubcategories,
      },
    }

    onCategoryUpdate(updatedCategories)
    
    toast({
      title: "زیردسته حذف شد",
      description: "زیردسته با موفقیت حذف شد",
    })
  }

  return (
    <div className="space-y-6" dir="rtl">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-right">
              <FolderTree className="w-5 h-5" />
              مدیریت دسته‌بندی‌ها
            </CardTitle>
            <Dialog open={newCategoryDialog} onOpenChange={setNewCategoryDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  دسته‌بندی جدید
                </Button>
              </DialogTrigger>
              <DialogContent dir="rtl">
                <DialogHeader>
                  <DialogTitle className="text-right">افزودن دسته‌بندی جدید</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="category-name">نام دسته‌بندی (انگلیسی)</Label>
                    <Input
                      id="category-name"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      placeholder="مثال: hardware"
                      className="text-right"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category-label">برچسب دسته‌بندی (فارسی)</Label>
                    <Input
                      id="category-label"
                      value={newCategoryLabel}
                      onChange={(e) => setNewCategoryLabel(e.target.value)}
                      placeholder="مثال: سخت‌افزار"
                      className="text-right"
                      dir="rtl"
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setNewCategoryDialog(false)}>
                      انصراف
                    </Button>
                    <Button onClick={handleAddCategory}>
                      <Save className="w-4 h-4 ml-2" />
                      ذخیره
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(categories).map(([categoryId, category]: [string, any]) => (
              <Card key={categoryId} className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <Folder className="w-5 h-5 text-primary" />
                      {editingCategory === categoryId ? (
                        <div className="flex items-center gap-2">
                          <Input
                            value={editCategoryLabel}
                            onChange={(e) => setEditCategoryLabel(e.target.value)}
                            className="w-48 text-right"
                            dir="rtl"
                          />
                          <Button size="sm" onClick={() => handleEditCategory(categoryId)}>
                            <Save className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingCategory(null)
                              setEditCategoryLabel("")
                            }}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <div>
                          <h3 className="text-lg font-semibold">{category.label}</h3>
                          <p className="text-sm text-muted-foreground">شناسه: {categoryId}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {category.subcategories.length} زیردسته
                      </Badge>
                      {editingCategory !== categoryId && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setEditingCategory(categoryId)
                              setEditCategoryLabel(category.label)
                            }}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent dir="rtl">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-right">حذف دسته‌بندی</AlertDialogTitle>
                                <AlertDialogDescription className="text-right">
                                  آیا مطمئن هستید که می‌خواهید دسته‌بندی "{category.label}" و تمام زیردسته‌های آن را حذف کنید؟
                                  این عمل قابل بازگشت نیست.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>انصراف</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteCategory(categoryId)}>
                                  حذف
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-sm">زیردسته‌ها</h4>
                      <Dialog
                        open={newSubcategoryDialog === categoryId}
                        onOpenChange={(open) => setNewSubcategoryDialog(open ? categoryId : null)}
                      >
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                            <Plus className="w-3 h-3" />
                            افزودن زیردسته
                          </Button>
                        </DialogTrigger>
                        <DialogContent dir="rtl">
                          <DialogHeader>
                            <DialogTitle className="text-right">
                              افزودن زیردسته به "{category.label}"
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="subcategory-name">نام زیردسته</Label>
                              <Input
                                id="subcategory-name"
                                value={newSubcategoryName}
                                onChange={(e) => setNewSubcategoryName(e.target.value)}
                                placeholder="مثال: تعمیر رایانه"
                                className="text-right"
                                dir="rtl"
                              />
                            </div>
                            <div className="flex gap-2 justify-end">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setNewSubcategoryDialog(null)
                                  setNewSubcategoryName("")
                                }}
                              >
                                انصراف
                              </Button>
                              <Button onClick={() => handleAddSubcategory(categoryId)}>
                                <Save className="w-4 h-4 ml-2" />
                                ذخیره
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="grid gap-2">
                      {category.subcategories.map((subcategory: string, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-muted-foreground" />
                            {editingSubcategory?.categoryId === categoryId && editingSubcategory?.index === index ? (
                              <div className="flex items-center gap-2">
                                <Input
                                  value={editSubcategoryName}
                                  onChange={(e) => setEditSubcategoryName(e.target.value)}
                                  className="w-48 text-right"
                                  dir="rtl"
                                />
                                <Button size="sm" onClick={() => handleEditSubcategory(categoryId, index)}>
                                  <Save className="w-3 h-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setEditingSubcategory(null)
                                    setEditSubcategoryName("")
                                  }}
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            ) : (
                              <span className="text-sm">{subcategory}</span>
                            )}
                          </div>
                          {(!editingSubcategory || editingSubcategory.categoryId !== categoryId || editingSubcategory.index !== index) && (
                            <div className="flex items-center gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setEditingSubcategory({ categoryId, index })
                                  setEditSubcategoryName(subcategory)
                                }}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button size="sm" variant="ghost">
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent dir="rtl">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-right">حذف زیردسته</AlertDialogTitle\
