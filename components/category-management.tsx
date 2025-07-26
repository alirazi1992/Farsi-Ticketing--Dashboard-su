"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Category {
  id: string
  name: string
  label: string
  icon: string
  subcategories: Array<{
    id: string
    name: string
    label: string
  }>
}

interface CategoryManagementProps {
  categories: Category[]
  onCategoryCreate: (category: Omit<Category, "id">) => void
  onCategoryUpdate: (categoryId: string, updates: Partial<Category>) => void
  onCategoryDelete: (categoryId: string) => void
}

export function CategoryManagement({
  categories,
  onCategoryCreate,
  onCategoryUpdate,
  onCategoryDelete,
}: CategoryManagementProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    label: "",
    icon: "",
    subcategories: [] as Array<{ id: string; name: string; label: string }>,
  })
  const [newSubcategory, setNewSubcategory] = useState({ name: "", label: "" })
  const { toast } = useToast()

  const resetForm = () => {
    setFormData({
      name: "",
      label: "",
      icon: "",
      subcategories: [],
    })
    setNewSubcategory({ name: "", label: "" })
  }

  const handleCreateCategory = () => {
    if (!formData.name || !formData.label) {
      toast({
        title: "خطا",
        description: "لطفاً تمام فیلدهای الزامی را پر کنید.",
        variant: "destructive",
      })
      return
    }

    onCategoryCreate({
      name: formData.name,
      label: formData.label,
      icon: formData.icon || "📁",
      subcategories: formData.subcategories,
    })

    resetForm()
    setShowCreateDialog(false)
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      label: category.label,
      icon: category.icon,
      subcategories: [...category.subcategories],
    })
    setShowEditDialog(true)
  }

  const handleUpdateCategory = () => {
    if (!editingCategory || !formData.name || !formData.label) {
      toast({
        title: "خطا",
        description: "لطفاً تمام فیلدهای الزامی را پر کنید.",
        variant: "destructive",
      })
      return
    }

    onCategoryUpdate(editingCategory.id, {
      name: formData.name,
      label: formData.label,
      icon: formData.icon,
      subcategories: formData.subcategories,
    })

    resetForm()
    setEditingCategory(null)
    setShowEditDialog(false)
  }

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm("آیا از حذف این دسته‌بندی اطمینان دارید؟")) {
      onCategoryDelete(categoryId)
    }
  }

  const addSubcategory = () => {
    if (!newSubcategory.name || !newSubcategory.label) {
      toast({
        title: "خطا",
        description: "لطفاً نام و برچسب زیردسته را وارد کنید.",
        variant: "destructive",
      })
      return
    }

    const subcategory = {
      id: Date.now().toString(),
      name: newSubcategory.name,
      label: newSubcategory.label,
    }

    setFormData((prev) => ({
      ...prev,
      subcategories: [...prev.subcategories, subcategory],
    }))

    setNewSubcategory({ name: "", label: "" })
  }

  const removeSubcategory = (subcategoryId: string) => {
    setFormData((prev) => ({
      ...prev,
      subcategories: prev.subcategories.filter((sub) => sub.id !== subcategoryId),
    }))
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">مدیریت دسته‌بندی‌ها</h2>
          <p className="text-gray-600">ایجاد و مدیریت دسته‌بندی‌های تیکت</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          دسته‌بندی جدید
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card key={category.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{category.icon}</span>
                  <span className="text-lg">{category.label}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" onClick={() => handleEditCategory(category)} className="p-2">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id)}
                    className="p-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-700">نام سیستمی:</span>
                  <p className="text-sm text-gray-600 font-mono">{category.name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">زیردسته‌ها:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {category.subcategories.map((sub) => (
                      <Badge key={sub.id} variant="secondary" className="text-xs">
                        {sub.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Category Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-right">ایجاد دسته‌بندی جدید</DialogTitle>
          </DialogHeader>
          <div className="space-y-6" dir="rtl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">نام سیستمی *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="hardware"
                  className="text-right"
                />
                <p className="text-xs text-gray-500">نام انگلیسی بدون فاصله</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="label">برچسب نمایشی *</Label>
                <Input
                  id="label"
                  value={formData.label}
                  onChange={(e) => setFormData((prev) => ({ ...prev, label: e.target.value }))}
                  placeholder="مشکلات سخت‌افزاری"
                  className="text-right"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">آیکون</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
                placeholder="💻"
                className="text-right"
              />
              <p className="text-xs text-gray-500">یک ایموجی برای نمایش دسته‌بندی</p>
            </div>

            {/* Subcategories */}
            <div className="space-y-4">
              <Label>زیردسته‌ها</Label>

              {/* Add Subcategory */}
              <div className="flex gap-2">
                <Input
                  value={newSubcategory.name}
                  onChange={(e) => setNewSubcategory((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="نام سیستمی"
                  className="text-right"
                />
                <Input
                  value={newSubcategory.label}
                  onChange={(e) => setNewSubcategory((prev) => ({ ...prev, label: e.target.value }))}
                  placeholder="برچسب نمایشی"
                  className="text-right"
                />
                <Button onClick={addSubcategory} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Subcategories List */}
              {formData.subcategories.length > 0 && (
                <div className="space-y-2">
                  {formData.subcategories.map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="font-medium">{sub.label}</span>
                        <span className="text-sm text-gray-500 mr-2">({sub.name})</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeSubcategory(sub.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                انصراف
              </Button>
              <Button onClick={handleCreateCategory}>ایجاد دسته‌بندی</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-right">ویرایش دسته‌بندی</DialogTitle>
          </DialogHeader>
          <div className="space-y-6" dir="rtl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">نام سیستمی *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="hardware"
                  className="text-right"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-label">برچسب نمایشی *</Label>
                <Input
                  id="edit-label"
                  value={formData.label}
                  onChange={(e) => setFormData((prev) => ({ ...prev, label: e.target.value }))}
                  placeholder="مشکلات سخت‌افزاری"
                  className="text-right"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-icon">آیکون</Label>
              <Input
                id="edit-icon"
                value={formData.icon}
                onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
                placeholder="💻"
                className="text-right"
              />
            </div>

            {/* Subcategories */}
            <div className="space-y-4">
              <Label>زیردسته‌ها</Label>

              {/* Add Subcategory */}
              <div className="flex gap-2">
                <Input
                  value={newSubcategory.name}
                  onChange={(e) => setNewSubcategory((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="نام سیستمی"
                  className="text-right"
                />
                <Input
                  value={newSubcategory.label}
                  onChange={(e) => setNewSubcategory((prev) => ({ ...prev, label: e.target.value }))}
                  placeholder="برچسب نمایشی"
                  className="text-right"
                />
                <Button onClick={addSubcategory} size="sm">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {/* Subcategories List */}
              {formData.subcategories.length > 0 && (
                <div className="space-y-2">
                  {formData.subcategories.map((sub) => (
                    <div key={sub.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="font-medium">{sub.label}</span>
                        <span className="text-sm text-gray-500 mr-2">({sub.name})</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeSubcategory(sub.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                انصراف
              </Button>
              <Button onClick={handleUpdateCategory}>ذخیره تغییرات</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
