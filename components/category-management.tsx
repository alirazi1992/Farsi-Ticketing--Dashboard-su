"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
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
import { Plus, Edit, Trash2, Folder, FolderOpen, Tag } from "lucide-react"

interface CategoryManagementProps {
  categories: any[]
  onCategoriesUpdate: (categories: any[]) => void
}

export function CategoryManagement({ categories = [], onCategoriesUpdate }: CategoryManagementProps) {
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [editingSubcategory, setEditingSubcategory] = useState<any>(null)
  const [newCategoryDialog, setNewCategoryDialog] = useState(false)
  const [newSubcategoryDialog, setNewSubcategoryDialog] = useState(false)
  const [selectedCategoryForSub, setSelectedCategoryForSub] = useState<string>("")

  // Safe array access
  const safeCategories = Array.isArray(categories) ? categories : []

  const handleAddCategory = (formData: FormData) => {
    const newCategory = {
      id: `cat-${Date.now()}`,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      subcategories: [],
    }

    const updatedCategories = [...safeCategories, newCategory]
    onCategoriesUpdate(updatedCategories)
    setNewCategoryDialog(false)

    toast({
      title: "دسته‌بندی اضافه شد",
      description: `دسته‌بندی "${newCategory.name}" با موفقیت اضافه شد`,
    })
  }

  const handleEditCategory = (formData: FormData) => {
    if (!editingCategory) return

    const updatedCategories = safeCategories.map((cat) =>
      cat.id === editingCategory.id
        ? {
            ...cat,
            name: formData.get("name") as string,
            description: formData.get("description") as string,
          }
        : cat,
    )

    onCategoriesUpdate(updatedCategories)
    setEditingCategory(null)

    toast({
      title: "دسته‌بندی ویرایش شد",
      description: "تغییرات با موفقیت ذخیره شد",
    })
  }

  const handleDeleteCategory = (categoryId: string) => {
    const updatedCategories = safeCategories.filter((cat) => cat.id !== categoryId)
    onCategoriesUpdate(updatedCategories)

    toast({
      title: "دسته‌بندی حذف شد",
      description: "دسته‌بندی با موفقیت حذف شد",
    })
  }

  const handleAddSubcategory = (formData: FormData) => {
    const newSubcategory = {
      id: `sub-${Date.now()}`,
      name: formData.get("name") as string,
    }

    const updatedCategories = safeCategories.map((cat) =>
      cat.id === selectedCategoryForSub
        ? {
            ...cat,
            subcategories: [...(cat.subcategories || []), newSubcategory],
          }
        : cat,
    )

    onCategoriesUpdate(updatedCategories)
    setNewSubcategoryDialog(false)
    setSelectedCategoryForSub("")

    toast({
      title: "زیردسته اضافه شد",
      description: `زیردسته "${newSubcategory.name}" با موفقیت اضافه شد`,
    })
  }

  const handleEditSubcategory = (formData: FormData) => {
    if (!editingSubcategory) return

    const updatedCategories = safeCategories.map((cat) => ({
      ...cat,
      subcategories: (cat.subcategories || []).map((sub: any) =>
        sub.id === editingSubcategory.id ? { ...sub, name: formData.get("name") as string } : sub,
      ),
    }))

    onCategoriesUpdate(updatedCategories)
    setEditingSubcategory(null)

    toast({
      title: "زیردسته ویرایش شد",
      description: "تغییرات با موفقیت ذخیره شد",
    })
  }

  const handleDeleteSubcategory = (categoryId: string, subcategoryId: string) => {
    const updatedCategories = safeCategories.map((cat) =>
      cat.id === categoryId
        ? {
            ...cat,
            subcategories: (cat.subcategories || []).filter((sub: any) => sub.id !== subcategoryId),
          }
        : cat,
    )

    onCategoriesUpdate(updatedCategories)

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
            <CardTitle className="text-right flex items-center gap-2">
              <Folder className="w-5 h-5" />
              مدیریت دسته‌بندی‌ها
            </CardTitle>
            <Dialog open={newCategoryDialog} onOpenChange={setNewCategoryDialog}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  دسته‌بندی جدید
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]" dir="rtl">
                <form action={handleAddCategory}>
                  <DialogHeader>
                    <DialogTitle className="text-right">افزودن دسته‌بندی جدید</DialogTitle>
                    <DialogDescription className="text-right">اطلاعات دسته‌بندی جدید را وارد کنید</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-right">
                        نام دسته‌بندی
                      </Label>
                      <Input id="name" name="name" placeholder="نام دسته‌بندی را وارد کنید" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-right">
                        توضیحات
                      </Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="توضیحات دسته‌بندی را وارد کنید"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">افزودن</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {safeCategories.length === 0 ? (
              <div className="text-center py-8">
                <Folder className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">هیچ دسته‌بندی تعریف نشده است</p>
                <p className="text-sm text-gray-400">برای شروع، دسته‌بندی جدید اضافه کنید</p>
              </div>
            ) : (
              safeCategories.map((category) => {
                const subcategories = category.subcategories || []
                return (
                  <Card key={category.id} className="p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-right flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FolderOpen className="w-5 h-5 text-blue-500" />
                          <h3 className="text-lg font-semibold">{category.name || "نام نامشخص"}</h3>
                          <Badge variant="outline">{subcategories.length} زیردسته</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{category.description || "توضیحات موجود نیست"}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Dialog
                          open={editingCategory?.id === category.id}
                          onOpenChange={(open) => setEditingCategory(open ? category : null)}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Edit className="w-3 h-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]" dir="rtl">
                            <form action={handleEditCategory}>
                              <DialogHeader>
                                <DialogTitle className="text-right">ویرایش دسته‌بندی</DialogTitle>
                              </DialogHeader>
                              <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-name" className="text-right">
                                    نام دسته‌بندی
                                  </Label>
                                  <Input id="edit-name" name="name" defaultValue={category.name || ""} required />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-description" className="text-right">
                                    توضیحات
                                  </Label>
                                  <Textarea
                                    id="edit-description"
                                    name="description"
                                    defaultValue={category.description || ""}
                                    required
                                  />
                                </div>
                              </div>
                              <DialogFooter>
                                <Button type="submit">ذخیره تغییرات</Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent dir="rtl">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-right">حذف دسته‌بندی</AlertDialogTitle>
                              <AlertDialogDescription className="text-right">
                                آیا مطمئن هستید که می‌خواهید این دسته‌بندی را حذف کنید؟ این عمل قابل بازگشت نیست.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>انصراف</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteCategory(category.id)}>
                                حذف
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCategoryForSub(category.id)
                            setNewSubcategoryDialog(true)
                          }}
                          className="gap-1"
                        >
                          <Plus className="w-3 h-3" />
                          زیردسته
                        </Button>
                      </div>
                    </div>

                    <Separator className="my-3" />

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-right flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        زیردسته‌ها
                      </h4>
                      {subcategories.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {subcategories.map((subcategory: any) => (
                            <div
                              key={subcategory.id}
                              className="flex items-center justify-between p-2 bg-muted rounded-md"
                            >
                              <span className="text-sm">{subcategory.name || "نام نامشخص"}</span>
                              <div className="flex items-center gap-1">
                                <Dialog
                                  open={editingSubcategory?.id === subcategory.id}
                                  onOpenChange={(open) => setEditingSubcategory(open ? subcategory : null)}
                                >
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <Edit className="w-3 h-3" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="sm:max-w-[425px]" dir="rtl">
                                    <form action={handleEditSubcategory}>
                                      <DialogHeader>
                                        <DialogTitle className="text-right">ویرایش زیردسته</DialogTitle>
                                      </DialogHeader>
                                      <div className="grid gap-4 py-4">
                                        <div className="space-y-2">
                                          <Label htmlFor="edit-sub-name" className="text-right">
                                            نام زیردسته
                                          </Label>
                                          <Input
                                            id="edit-sub-name"
                                            name="name"
                                            defaultValue={subcategory.name || ""}
                                            required
                                          />
                                        </div>
                                      </div>
                                      <DialogFooter>
                                        <Button type="submit">ذخیره تغییرات</Button>
                                      </DialogFooter>
                                    </form>
                                  </DialogContent>
                                </Dialog>

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent dir="rtl">
                                    <AlertDialogHeader>
                                      <AlertDialogTitle className="text-right">حذف زیردسته</AlertDialogTitle>
                                      <AlertDialogDescription className="text-right">
                                        آیا مطمئن هستید که می‌خواهید این زیردسته را حذف کنید؟
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>انصراف</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteSubcategory(category.id, subcategory.id)}
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
                      ) : (
                        <p className="text-sm text-muted-foreground text-right">هیچ زیردسته‌ای تعریف نشده است</p>
                      )}
                    </div>
                  </Card>
                )
              })
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Subcategory Dialog */}
      <Dialog open={newSubcategoryDialog} onOpenChange={setNewSubcategoryDialog}>
        <DialogContent className="sm:max-w-[425px]" dir="rtl">
          <form action={handleAddSubcategory}>
            <DialogHeader>
              <DialogTitle className="text-right">افزودن زیردسته جدید</DialogTitle>
              <DialogDescription className="text-right">
                زیردسته جدید را به دسته‌بندی انتخاب شده اضافه کنید
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="sub-name" className="text-right">
                  نام زیردسته
                </Label>
                <Input id="sub-name" name="name" placeholder="نام زیردسته را وارد کنید" required />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">افزودن</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
