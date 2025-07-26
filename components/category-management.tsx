"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, FolderOpen, FileText } from "lucide-react"
import { toast } from "sonner"

interface Category {
  id: string
  label: string
  description?: string
  subcategories?: Subcategory[]
}

interface Subcategory {
  id: string
  label: string
  description?: string
  parentId: string
}

interface CategoryManagementProps {
  categoriesData: Category[]
  onCategoriesUpdate: (categories: Category[]) => void
}

export function CategoryManagement({ categoriesData, onCategoriesUpdate }: CategoryManagementProps) {
  const [categories, setCategories] = useState<Category[]>(categoriesData)
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false)
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false)
  const [isAddSubcategoryOpen, setIsAddSubcategoryOpen] = useState(false)
  const [isEditSubcategoryOpen, setIsEditSubcategoryOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null)
  const [selectedParentId, setSelectedParentId] = useState<string>("")

  // Form states
  const [newCategoryForm, setNewCategoryForm] = useState({
    id: "",
    label: "",
    description: "",
  })

  const [newSubcategoryForm, setNewSubcategoryForm] = useState({
    id: "",
    label: "",
    description: "",
    parentId: "",
  })

  useEffect(() => {
    setCategories(categoriesData)
  }, [categoriesData])

  const generateId = (label: string) => {
    return label
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "")
  }

  const handleAddCategory = () => {
    if (!newCategoryForm.label.trim()) {
      toast.error("نام دسته‌بندی الزامی است")
      return
    }

    const id = newCategoryForm.id || generateId(newCategoryForm.label)

    if (categories.some((cat) => cat.id === id)) {
      toast.error("دسته‌بندی با این شناسه قبلاً وجود دارد")
      return
    }

    const newCategory: Category = {
      id,
      label: newCategoryForm.label,
      description: newCategoryForm.description,
      subcategories: [],
    }

    const updatedCategories = [...categories, newCategory]
    setCategories(updatedCategories)
    onCategoriesUpdate(updatedCategories)

    setNewCategoryForm({ id: "", label: "", description: "" })
    setIsAddCategoryOpen(false)
    toast.success("دسته‌بندی جدید اضافه شد")
  }

  const handleEditCategory = () => {
    if (!editingCategory || !newCategoryForm.label.trim()) {
      toast.error("نام دسته‌بندی الزامی است")
      return
    }

    const updatedCategories = categories.map((cat) =>
      cat.id === editingCategory.id
        ? {
            ...cat,
            label: newCategoryForm.label,
            description: newCategoryForm.description,
          }
        : cat,
    )

    setCategories(updatedCategories)
    onCategoriesUpdate(updatedCategories)

    setEditingCategory(null)
    setNewCategoryForm({ id: "", label: "", description: "" })
    setIsEditCategoryOpen(false)
    toast.success("دسته‌بندی ویرایش شد")
  }

  const handleDeleteCategory = (categoryId: string) => {
    const updatedCategories = categories.filter((cat) => cat.id !== categoryId)
    setCategories(updatedCategories)
    onCategoriesUpdate(updatedCategories)
    toast.success("دسته‌بندی حذف شد")
  }

  const handleAddSubcategory = () => {
    if (!newSubcategoryForm.label.trim() || !newSubcategoryForm.parentId) {
      toast.error("نام زیردسته و دسته والد الزامی است")
      return
    }

    const id = newSubcategoryForm.id || generateId(newSubcategoryForm.label)

    // Check if subcategory ID already exists in any category
    const subcategoryExists = categories.some((cat) => cat.subcategories?.some((sub) => sub.id === id))

    if (subcategoryExists) {
      toast.error("زیردسته با این شناسه قبلاً وجود دارد")
      return
    }

    const newSubcategory: Subcategory = {
      id,
      label: newSubcategoryForm.label,
      description: newSubcategoryForm.description,
      parentId: newSubcategoryForm.parentId,
    }

    const updatedCategories = categories.map((cat) =>
      cat.id === newSubcategoryForm.parentId
        ? {
            ...cat,
            subcategories: [...(cat.subcategories || []), newSubcategory],
          }
        : cat,
    )

    setCategories(updatedCategories)
    onCategoriesUpdate(updatedCategories)

    setNewSubcategoryForm({ id: "", label: "", description: "", parentId: "" })
    setIsAddSubcategoryOpen(false)
    toast.success("زیردسته جدید اضافه شد")
  }

  const handleEditSubcategory = () => {
    if (!editingSubcategory || !newSubcategoryForm.label.trim()) {
      toast.error("نام زیردسته الزامی است")
      return
    }

    const updatedCategories = categories.map((cat) => ({
      ...cat,
      subcategories: cat.subcategories?.map((sub) =>
        sub.id === editingSubcategory.id
          ? {
              ...sub,
              label: newSubcategoryForm.label,
              description: newSubcategoryForm.description,
            }
          : sub,
      ),
    }))

    setCategories(updatedCategories)
    onCategoriesUpdate(updatedCategories)

    setEditingSubcategory(null)
    setNewSubcategoryForm({ id: "", label: "", description: "", parentId: "" })
    setIsEditSubcategoryOpen(false)
    toast.success("زیردسته ویرایش شد")
  }

  const handleDeleteSubcategory = (subcategoryId: string, parentId: string) => {
    const updatedCategories = categories.map((cat) =>
      cat.id === parentId
        ? {
            ...cat,
            subcategories: cat.subcategories?.filter((sub) => sub.id !== subcategoryId),
          }
        : cat,
    )

    setCategories(updatedCategories)
    onCategoriesUpdate(updatedCategories)
    toast.success("زیردسته حذف شد")
  }

  const openEditCategory = (category: Category) => {
    setEditingCategory(category)
    setNewCategoryForm({
      id: category.id,
      label: category.label,
      description: category.description || "",
    })
    setIsEditCategoryOpen(true)
  }

  const openEditSubcategory = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory)
    setNewSubcategoryForm({
      id: subcategory.id,
      label: subcategory.label,
      description: subcategory.description || "",
      parentId: subcategory.parentId,
    })
    setIsEditSubcategoryOpen(true)
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">مدیریت دسته‌بندی‌ها</h2>
          <p className="text-muted-foreground">مدیریت دسته‌بندی‌ها و زیردسته‌های تیکت‌ها</p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddSubcategoryOpen} onOpenChange={setIsAddSubcategoryOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Plus className="w-4 h-4" />
                افزودن زیردسته
              </Button>
            </DialogTrigger>
            <DialogContent dir="rtl">
              <DialogHeader>
                <DialogTitle>افزودن زیردسته جدید</DialogTitle>
                <DialogDescription>زیردسته جدید برای دسته‌بندی موجود اضافه کنید</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="parent-select">دسته والد</Label>
                  <Select
                    value={newSubcategoryForm.parentId}
                    onValueChange={(value) => setNewSubcategoryForm({ ...newSubcategoryForm, parentId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="انتخاب دسته والد" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="subcategory-id">شناسه زیردسته (اختیاری)</Label>
                  <Input
                    id="subcategory-id"
                    value={newSubcategoryForm.id}
                    onChange={(e) => setNewSubcategoryForm({ ...newSubcategoryForm, id: e.target.value })}
                    placeholder="در صورت خالی بودن، خودکار تولید می‌شود"
                  />
                </div>
                <div>
                  <Label htmlFor="subcategory-name">نام زیردسته</Label>
                  <Input
                    id="subcategory-name"
                    value={newSubcategoryForm.label}
                    onChange={(e) => setNewSubcategoryForm({ ...newSubcategoryForm, label: e.target.value })}
                    placeholder="نام زیردسته را وارد کنید"
                  />
                </div>
                <div>
                  <Label htmlFor="subcategory-description">توضیحات (اختیاری)</Label>
                  <Textarea
                    id="subcategory-description"
                    value={newSubcategoryForm.description}
                    onChange={(e) => setNewSubcategoryForm({ ...newSubcategoryForm, description: e.target.value })}
                    placeholder="توضیحات زیردسته"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddSubcategoryOpen(false)}>
                  انصراف
                </Button>
                <Button onClick={handleAddSubcategory}>افزودن زیردسته</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                افزودن دسته‌بندی
              </Button>
            </DialogTrigger>
            <DialogContent dir="rtl">
              <DialogHeader>
                <DialogTitle>افزودن دسته‌بندی جدید</DialogTitle>
                <DialogDescription>دسته‌بندی جدید برای تیکت‌ها اضافه کنید</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="category-id">شناسه دسته‌بندی (اختیاری)</Label>
                  <Input
                    id="category-id"
                    value={newCategoryForm.id}
                    onChange={(e) => setNewCategoryForm({ ...newCategoryForm, id: e.target.value })}
                    placeholder="در صورت خالی بودن، خودکار تولید می‌شود"
                  />
                </div>
                <div>
                  <Label htmlFor="category-name">نام دسته‌بندی</Label>
                  <Input
                    id="category-name"
                    value={newCategoryForm.label}
                    onChange={(e) => setNewCategoryForm({ ...newCategoryForm, label: e.target.value })}
                    placeholder="نام دسته‌بندی را وارد کنید"
                  />
                </div>
                <div>
                  <Label htmlFor="category-description">توضیحات (اختیاری)</Label>
                  <Textarea
                    id="category-description"
                    value={newCategoryForm.description}
                    onChange={(e) => setNewCategoryForm({ ...newCategoryForm, description: e.target.value })}
                    placeholder="توضیحات دسته‌بندی"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
                  انصراف
                </Button>
                <Button onClick={handleAddCategory}>افزودن دسته‌بندی</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Categories List */}
      <div className="grid gap-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FolderOpen className="w-5 h-5 text-primary" />
                  <div>
                    <CardTitle className="text-lg">{category.label}</CardTitle>
                    {category.description && <CardDescription className="mt-1">{category.description}</CardDescription>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{category.subcategories?.length || 0} زیردسته</Badge>
                  <Button variant="ghost" size="sm" onClick={() => openEditCategory(category)} className="gap-1">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id)}
                    className="gap-1 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            {category.subcategories && category.subcategories.length > 0 && (
              <CardContent>
                <div className="space-y-2">
                  {category.subcategories.map((subcategory) => (
                    <div key={subcategory.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{subcategory.label}</div>
                          {subcategory.description && (
                            <div className="text-sm text-muted-foreground">{subcategory.description}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditSubcategory(subcategory)}
                          className="gap-1"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSubcategory(subcategory.id, category.id)}
                          className="gap-1 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Edit Category Dialog */}
      <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>ویرایش دسته‌بندی</DialogTitle>
            <DialogDescription>اطلاعات دسته‌بندی را ویرایش کنید</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-category-name">نام دسته‌بندی</Label>
              <Input
                id="edit-category-name"
                value={newCategoryForm.label}
                onChange={(e) => setNewCategoryForm({ ...newCategoryForm, label: e.target.value })}
                placeholder="نام دسته‌بندی را وارد کنید"
              />
            </div>
            <div>
              <Label htmlFor="edit-category-description">توضیحات (اختیاری)</Label>
              <Textarea
                id="edit-category-description"
                value={newCategoryForm.description}
                onChange={(e) => setNewCategoryForm({ ...newCategoryForm, description: e.target.value })}
                placeholder="توضیحات دسته‌بندی"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCategoryOpen(false)}>
              انصراف
            </Button>
            <Button onClick={handleEditCategory}>ذخیره تغییرات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Subcategory Dialog */}
      <Dialog open={isEditSubcategoryOpen} onOpenChange={setIsEditSubcategoryOpen}>
        <DialogContent dir="rtl">
          <DialogHeader>
            <DialogTitle>ویرایش زیردسته</DialogTitle>
            <DialogDescription>اطلاعات زیردسته را ویرایش کنید</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-subcategory-name">نام زیردسته</Label>
              <Input
                id="edit-subcategory-name"
                value={newSubcategoryForm.label}
                onChange={(e) => setNewSubcategoryForm({ ...newSubcategoryForm, label: e.target.value })}
                placeholder="نام زیردسته را وارد کنید"
              />
            </div>
            <div>
              <Label htmlFor="edit-subcategory-description">توضیحات (اختیاری)</Label>
              <Textarea
                id="edit-subcategory-description"
                value={newSubcategoryForm.description}
                onChange={(e) => setNewSubcategoryForm({ ...newSubcategoryForm, description: e.target.value })}
                placeholder="توضیحات زیردسته"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditSubcategoryOpen(false)}>
              انصراف
            </Button>
            <Button onClick={handleEditSubcategory}>ذخیره تغییرات</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
