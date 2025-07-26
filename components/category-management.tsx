"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Edit2, Save, X } from "lucide-react"
import { toast } from "sonner"

interface CategoryManagementProps {
  categories: any
  onCategoryUpdate: (categories: any) => void
}

export function CategoryManagement({ categories, onCategoryUpdate }: CategoryManagementProps) {
  const [newCategory, setNewCategory] = useState("")
  const [newSubcategory, setNewSubcategory] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [editingCategory, setEditingCategory] = useState<string | null>(null)
  const [editingSubcategory, setEditingSubcategory] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")

  const addCategory = () => {
    if (!newCategory.trim()) return

    const updatedCategories = {
      ...categories,
      [newCategory]: [],
    }

    onCategoryUpdate(updatedCategories)
    setNewCategory("")
    toast.success("دسته‌بندی جدید اضافه شد")
  }

  const addSubcategory = () => {
    if (!newSubcategory.trim() || !selectedCategory) return

    const updatedCategories = {
      ...categories,
      [selectedCategory]: [...(categories[selectedCategory] || []), newSubcategory],
    }

    onCategoryUpdate(updatedCategories)
    setNewSubcategory("")
    toast.success("زیردسته جدید اضافه شد")
  }

  const deleteCategory = (categoryName: string) => {
    const updatedCategories = { ...categories }
    delete updatedCategories[categoryName]
    onCategoryUpdate(updatedCategories)
    toast.success("دسته‌بندی حذف شد")
  }

  const deleteSubcategory = (categoryName: string, subcategoryName: string) => {
    const updatedCategories = {
      ...categories,
      [categoryName]: categories[categoryName].filter((sub: string) => sub !== subcategoryName),
    }
    onCategoryUpdate(updatedCategories)
    toast.success("زیردسته حذف شد")
  }

  const startEditCategory = (categoryName: string) => {
    setEditingCategory(categoryName)
    setEditValue(categoryName)
  }

  const startEditSubcategory = (subcategoryName: string) => {
    setEditingSubcategory(subcategoryName)
    setEditValue(subcategoryName)
  }

  const saveEditCategory = (oldName: string) => {
    if (!editValue.trim()) return

    const updatedCategories = { ...categories }
    updatedCategories[editValue] = updatedCategories[oldName]
    delete updatedCategories[oldName]

    onCategoryUpdate(updatedCategories)
    setEditingCategory(null)
    setEditValue("")
    toast.success("دسته‌بندی ویرایش شد")
  }

  const saveEditSubcategory = (categoryName: string, oldSubName: string) => {
    if (!editValue.trim()) return

    const updatedCategories = {
      ...categories,
      [categoryName]: categories[categoryName].map((sub: string) => (sub === oldSubName ? editValue : sub)),
    }

    onCategoryUpdate(updatedCategories)
    setEditingSubcategory(null)
    setEditValue("")
    toast.success("زیردسته ویرایش شد")
  }

  const cancelEdit = () => {
    setEditingCategory(null)
    setEditingSubcategory(null)
    setEditValue("")
  }

  return (
    <div className="space-y-6" dir="rtl">
      <Card>
        <CardHeader>
          <CardTitle>مدیریت دسته‌بندی‌ها</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add new category */}
          <div className="flex gap-2">
            <Input
              placeholder="نام دسته‌بندی جدید"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addCategory()}
            />
            <Button onClick={addCategory}>
              <Plus className="w-4 h-4 ml-1" />
              افزودن دسته
            </Button>
          </div>

          {/* Add new subcategory */}
          <div className="flex gap-2">
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">انتخاب دسته‌بندی</option>
              {Object.keys(categories).map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
            <Input
              placeholder="نام زیردسته جدید"
              value={newSubcategory}
              onChange={(e) => setNewSubcategory(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addSubcategory()}
            />
            <Button onClick={addSubcategory} disabled={!selectedCategory}>
              <Plus className="w-4 h-4 ml-1" />
              افزودن زیردسته
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Display categories and subcategories */}
      <div className="space-y-4">
        {Object.entries(categories).map(([categoryName, subcategories]: [string, any]) => (
          <Card key={categoryName}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                {editingCategory === categoryName ? (
                  <div className="flex items-center gap-2 flex-1">
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && saveEditCategory(categoryName)}
                      className="flex-1"
                    />
                    <Button size="sm" onClick={() => saveEditCategory(categoryName)}>
                      <Save className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={cancelEdit}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <CardTitle className="text-lg">{categoryName}</CardTitle>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEditCategory(categoryName)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteCategory(categoryName)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {subcategories.map((subcategory: string) => (
                  <div key={subcategory} className="flex items-center gap-1">
                    {editingSubcategory === subcategory ? (
                      <div className="flex items-center gap-1">
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyPress={(e) => e.key === "Enter" && saveEditSubcategory(categoryName, subcategory)}
                          className="w-32 h-8"
                        />
                        <Button size="sm" onClick={() => saveEditSubcategory(categoryName, subcategory)}>
                          <Save className="w-3 h-3" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {subcategory}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => startEditSubcategory(subcategory)}
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-4 w-4 p-0 hover:bg-transparent text-destructive"
                          onClick={() => deleteSubcategory(categoryName, subcategory)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
