"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Edit2, Save, X } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface CategoryManagementProps {
  categories: any[]
  onCategoryUpdate: (categories: any[]) => void
}

export function CategoryManagement({ categories, onCategoryUpdate }: CategoryManagementProps) {
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editingSubcategory, setEditingSubcategory] = useState<string | null>(null)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newSubcategoryName, setNewSubcategoryName] = useState("")
  const [editCategoryName, setEditCategoryName] = useState("")
  const [editSubcategoryName, setEditSubcategoryName] = useState("")

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) return

    const newCategory = {
      id: `category-${Date.now()}`,
      name: newCategoryName,
      subcategories: [],
    }

    const updatedCategories = [...categories, newCategory]
    onCategoryUpdate(updatedCategories)
    setNewCategoryName("")

    toast({
      title: "دسته‌بندی اضافه شد",
      description: `دسته‌بندی "${newCategoryName}" با موفقیت اضافه شد`,
    })
  }

  const handleDeleteCategory = (categoryId: string) => {
    const updatedCategories = categories.filter((cat) => cat.id !== categoryId)
    onCategoryUpdate(updatedCategories)

    toast({
      title: "دسته‌بندی حذف شد",
      description: "دسته‌بندی با موفقیت حذف شد",
    })
  }

  const handleEditCategory = (categoryId: string, newName: string) => {
    const updatedCategories = categories.map((cat) => (cat.id === categoryId ? { ...cat, name: newName } : cat))
    onCategoryUpdate(updatedCategories)
    setEditingCategory(null)
    setEditCategoryName("")

    toast({
      title: "دسته‌بندی ویرایش شد",
      description: "نام دسته‌بندی با موفقیت تغییر کرد",
    })
  }

  const handleAddSubcategory = (categoryId: string) => {
    if (!newSubcategoryName.trim()) return

    const newSubcategory = {
      id: `subcategory-${Date.now()}`,
      name: newSubcategoryName,
    }

    const updatedCategories = categories.map((cat) =>
      cat.id === categoryId ? { ...cat, subcategories: [...cat.subcategories, newSubcategory] } : cat,
    )

    onCategoryUpdate(updatedCategories)
    setNewSubcategoryName("")

    toast({
      title: "زیردسته اضافه شد",
      description: `زیردسته "${newSubcategoryName}" با موفقیت اضافه شد`,
    })
  }

  const handleDeleteSubcategory = (categoryId: string, subcategoryId: string) => {
    const updatedCategories = categories.map((cat) =>
      cat.id === categoryId
        ? {
            ...cat,
            subcategories: cat.subcategories.filter((sub: any) => sub.id !== subcategoryId),
          }
        : cat,
    )
    onCategoryUpdate(updatedCategories)

    toast({
      title: "زیردسته حذف شد",
      description: "زیردسته با موفقیت حذف شد",
    })
  }

  const handleEditSubcategory = (categoryId: string, subcategoryId: string, newName: string) => {
    const updatedCategories = categories.map((cat) =>
      cat.id === categoryId
        ? {
            ...cat,
            subcategories: cat.subcategories.map((sub: any) =>
              sub.id === subcategoryId ? { ...sub, name: newName } : sub,
            ),
          }
        : cat,
    )
    onCategoryUpdate(updatedCategories)
    setEditingSubcategory(null)
    setEditSubcategoryName("")

    toast({
      title: "زیردسته ویرایش شد",
      description: "نام زیردسته با موفقیت تغییر کرد",
    })
  }

  return (
    <div className="space-y-6" dir="rtl">
      <Card>
        <CardHeader>
          <CardTitle className="text-right">مدیریت دسته‌بندی‌ها</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add new category */}
          <div className="flex gap-2">
            <Input
              placeholder="نام دسته‌بندی جدید"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="text-right"
            />
            <Button onClick={handleAddCategory} className="gap-2">
              <Plus className="w-4 h-4" />
              افزودن دسته‌بندی
            </Button>
          </div>

          {/* Categories list */}
          <div className="space-y-4">
            {categories.map((category) => (
              <Card key={category.id} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  {editingCategory === category.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={editCategoryName}
                        onChange={(e) => setEditCategoryName(e.target.value)}
                        className="text-right"
                      />
                      <Button
                        size="sm"
                        onClick={() => handleEditCategory(category.id, editCategoryName)}
                        className="gap-1"
                      >
                        <Save className="w-3 h-3" />
                        ذخیره
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingCategory(null)
                          setEditCategoryName("")
                        }}
                        className="gap-1"
                      >
                        <X className="w-3 h-3" />
                        لغو
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-lg font-semibold text-right">{category.name}</h3>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingCategory(category.id)
                            setEditCategoryName(category.name)
                          }}
                          className="gap-1"
                        >
                          <Edit2 className="w-3 h-3" />
                          ویرایش
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteCategory(category.id)}
                          className="gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          حذف
                        </Button>
                      </div>
                    </>
                  )}
                </div>

                {/* Add subcategory */}
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="نام زیردسته جدید"
                    value={newSubcategoryName}
                    onChange={(e) => setNewSubcategoryName(e.target.value)}
                    className="text-right"
                  />
                  <Button size="sm" onClick={() => handleAddSubcategory(category.id)} className="gap-1">
                    <Plus className="w-3 h-3" />
                    افزودن زیردسته
                  </Button>
                </div>

                {/* Subcategories */}
                <div className="flex flex-wrap gap-2">
                  {category.subcategories.map((subcategory: any) => (
                    <div key={subcategory.id} className="flex items-center gap-1">
                      {editingSubcategory === subcategory.id ? (
                        <div className="flex items-center gap-1">
                          <Input
                            size="sm"
                            value={editSubcategoryName}
                            onChange={(e) => setEditSubcategoryName(e.target.value)}
                            className="text-right w-32"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleEditSubcategory(category.id, subcategory.id, editSubcategoryName)}
                          >
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
                        <Badge variant="secondary" className="gap-1">
                          {subcategory.name}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => {
                              setEditingSubcategory(subcategory.id)
                              setEditSubcategoryName(subcategory.name)
                            }}
                          >
                            <Edit2 className="w-2 h-2" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-4 w-4 p-0 hover:bg-transparent"
                            onClick={() => handleDeleteSubcategory(category.id, subcategory.id)}
                          >
                            <X className="w-2 h-2" />
                          </Button>
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
