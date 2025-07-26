"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
  categories: any
  onCategoryUpdate: (categories: any) => void
}

export function CategoryManagement({ categories, onCategoryUpdate }: CategoryManagementProps) {
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newSubcategoryName, setNewSubcategoryName] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editingSubcategory, setEditingSubcategory] = useState<{ category: string; subcategory: string } | null>(null)
  const [editCategoryName, setEditCategoryName] = useState("")
  const [editSubcategoryName, setEditSubcategoryName] = useState("")
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [isAddSubcategoryOpen, setIsAddSubcategoryOpen] = useState(false)

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "خطا",
        description: "نام دسته‌بندی نمی‌تواند خالی باشد",
        variant: "destructive",
      })
      return
    }

    if (categories[newCategoryName]) {
      toast({
        title: "خطا",
        description: "این دسته‌بندی قبلاً وجود دارد",
        variant: "destructive",
      })
      return
    }

    const updatedCategories = {
      ...categories,
      [newCategoryName]: [],
    }

    onCategoryUpdate(updatedCategories)
    setNewCategoryName("")
    setIsAddCategoryOpen(false)

    toast({
      title: "موفق",
      description: "دسته‌بندی جدید اضافه شد",
    })
  }

  const handleAddSubcategory = () => {
    if (!newSubcategoryName.trim() || !selectedCategory) {
      toast({
        title: "خطا",
        description: "نام زیردسته و دسته‌بندی اصلی الزامی است",
        variant: "destructive",
      })
      return
    }

    if (categories[selectedCategory]?.includes(newSubcategoryName)) {
      toast({
        title: "خطا",
        description: "این زیردسته قبلاً وجود دارد",
        variant: "destructive",
      })
      return
    }

    const updatedCategories = {
      ...categories,
      [selectedCategory]: [...(categories[selectedCategory] || []), newSubcategoryName],
    }

    onCategoryUpdate(updatedCategories)
    setNewSubcategoryName("")
    setSelectedCategory("")
    setIsAddSubcategoryOpen(false)

    toast({
      title: "موفق",
      description: "زیردسته جدید اضافه شد",
    })
  }

  const handleEditCategory = (oldName: string) => {
    if (!editCategoryName.trim()) {
      toast({
        title: "خطا",
        description: "نام دسته‌بندی نمی‌تواند خالی باشد",
        variant: "destructive",
      })
      return
    }

    if (editCategoryName !== oldName && categories[editCategoryName]) {
      toast({
        title: "خطا",
        description: "این نام دسته‌بندی قبلاً وجود دارد",
        variant: "destructive",
      })
      return
    }

    const updatedCategories = { ...categories }
    if (editCategoryName !== oldName) {
      updatedCategories[editCategoryName] = updatedCategories[oldName]
      delete updatedCategories[oldName]
    }

    onCategoryUpdate(updatedCategories)
    setEditingCategory(null)
    setEditCategoryName("")

    toast({
      title: "موفق",
      description: "دسته‌بندی ویرایش شد",
    })
  }

  const handleEditSubcategory = (category: string, oldSubcategory: string) => {
    if (!editSubcategoryName.trim()) {
      toast({
        title: "خطا",
        description: "نام زیردسته نمی‌تواند خالی باشد",
        variant: "destructive",
      })
      return
    }

    if (editSubcategoryName !== oldSubcategory && categories[category]?.includes(editSubcategoryName)) {
      toast({
        title: "خطا",
        description: "این نام زیردسته قبلاً وجود دارد",
        variant: "destructive",
      })
      return
    }

    const updatedCategories = {
      ...categories,
      [category]: categories[category].map((sub: string) => (sub === oldSubcategory ? editSubcategoryName : sub)),
    }

    onCategoryUpdate(updatedCategories)
    setEditingSubcategory(null)
    setEditSubcategoryName("")

    toast({
      title: "موفق",
      description: "زیردسته ویرایش شد",
    })
  }

  const handleDeleteCategory = (categoryName: string) => {
    const updatedCategories = { ...categories }
    delete updatedCategories[categoryName]

    onCategoryUpdate(updatedCategories)

    toast({
      title: "موفق",
      description: "دسته‌بندی حذف شد",
    })
  }

  const handleDeleteSubcategory = (category: string, subcategory: string) => {
    const updatedCategories = {
      ...categories,
      [category]: categories[category].filter((sub: string) => sub !== subcategory),
    }

    onCategoryUpdate(updatedCategories)

    toast({
      title: "موفق",
      description: "زیردسته حذف شد",
    })
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-right">مدیریت دسته‌بندی‌ها</h2>
          <p className="text-muted-foreground text-right">مدیریت دسته‌بندی‌ها و زیردسته‌های تیکت‌ها</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                دسته‌بندی جدید
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-right">افزودن دسته‌بندی جدید</DialogTitle>
                <DialogDescription className="text-right">نام دسته‌بندی جدید را وارد کنید</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="categoryName" className="text-right">
                    نام دسته‌بندی
                  </Label>
                  <Input
                    id="categoryName"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="مثال: سخت‌افزار"
                    className="text-right"
                    dir="rtl"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
                  انصراف
                </Button>
                <Button onClick={handleAddCategory}>افزودن</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddSubcategoryOpen} onOpenChange={setIsAddSubcategoryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Tag className="w-4 h-4" />
                زیردسته جدید
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-right">افزودن زیردسته جدید</DialogTitle>
                <DialogDescription className="text-right">دسته‌بندی اصلی و نام زیردسته را انتخاب کنید</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="parentCategory" className="text-right">
                    دسته‌بندی اصلی
                  </Label>
                  <select
                    id="parentCategory"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border rounded-md text-right"
                    dir="rtl"
                  >
                    <option value="">انتخاب دسته‌بندی</option>
                    {Object.keys(categories).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subcategoryName" className="text-right">
                    نام زیردسته
                  </Label>
                  <Input
                    id="subcategoryName"
                    value={newSubcategoryName}
                    onChange={(e) => setNewSubcategoryName(e.target.value)}
                    placeholder="مثال: مشکلات چاپگر"
                    className="text-right"
                    dir="rtl"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddSubcategoryOpen(false)}>
                  انصراف
                </Button>
                <Button onClick={handleAddSubcategory}>افزودن</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6">
        {Object.entries(categories).map(([categoryName, subcategories]) => (
          <Card key={categoryName}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5" />
                  <CardTitle className="text-right">{categoryName}</CardTitle>
                  <Badge variant="secondary">{(subcategories as string[]).length} زیردسته</Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingCategory(categoryName)
                      setEditCategoryName(categoryName)
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-right">حذف دسته‌بندی</AlertDialogTitle>
                        <AlertDialogDescription className="text-right">
                          آیا مطمئن هستید که می‌خواهید دسته‌بندی "{categoryName}" و تمام زیردسته‌های آن را حذف کنید؟ این
                          عمل قابل بازگشت نیست.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>انصراف</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteCategory(categoryName)}>حذف</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              {editingCategory === categoryName && (
                <div className="flex gap-2 mt-2">
                  <Input
                    value={editCategoryName}
                    onChange={(e) => setEditCategoryName(e.target.value)}
                    className="text-right"
                    dir="rtl"
                  />
                  <Button size="sm" onClick={() => handleEditCategory(categoryName)}>
                    ذخیره
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingCategory(null)
                      setEditCategoryName("")
                    }}
                  >
                    انصراف
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(subcategories as string[]).map((subcategory) => (
                  <div key={subcategory} className="flex items-center justify-between p-2 border rounded">
                    {editingSubcategory?.category === categoryName &&
                    editingSubcategory?.subcategory === subcategory ? (
                      <div className="flex gap-2 flex-1">
                        <Input
                          value={editSubcategoryName}
                          onChange={(e) => setEditSubcategoryName(e.target.value)}
                          className="text-right"
                          dir="rtl"
                        />
                        <Button size="sm" onClick={() => handleEditSubcategory(categoryName, subcategory)}>
                          ذخیره
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditingSubcategory(null)
                            setEditSubcategoryName("")
                          }}
                        >
                          انصراف
                        </Button>
                      </div>
                    ) : (
                      <>
                        <span className="text-right">{subcategory}</span>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingSubcategory({ category: categoryName, subcategory })
                              setEditSubcategoryName(subcategory)
                            }}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-right">حذف زیردسته</AlertDialogTitle>
                                <AlertDialogDescription className="text-right">
                                  آیا مطمئن هستید که می‌خواهید زیردسته "{subcategory}" را حذف کنید؟
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>انصراف</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteSubcategory(categoryName, subcategory)}>
                                  حذف
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {(subcategories as string[]).length === 0 && (
                  <p className="text-muted-foreground text-center py-4">هیچ زیردسته‌ای وجود ندارد</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {Object.keys(categories).length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FolderOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">هیچ دسته‌بندی‌ای وجود ندارد</h3>
            <p className="text-muted-foreground mb-4">برای شروع، اولین دسته‌بندی خود را ایجاد کنید</p>
            <Button onClick={() => setIsAddCategoryOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              افزودن دسته‌بندی
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
