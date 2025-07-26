"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, FolderPlus, Settings, AlertTriangle } from "lucide-react"

interface CategoryManagementProps {
  categoriesData: any
  onCategoryUpdate: (updatedCategories: any) => void
}

export function CategoryManagement({ categoriesData, onCategoryUpdate }: CategoryManagementProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [editingSubCategory, setEditingSubCategory] = useState<any>(null)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [subCategoryDialogOpen, setSubCategoryDialogOpen] = useState(false)
  const [newCategoryData, setNewCategoryData] = useState({
    id: "",
    label: "",
    description: "",
  })
  const [newSubCategoryData, setNewSubCategoryData] = useState({
    id: "",
    label: "",
    description: "",
  })

  const handleCreateCategory = () => {
    if (!newCategoryData.id || !newCategoryData.label) {
      toast({
        title: "خطا",
        description: "لطفاً تمام فیلدهای ضروری را پر کنید",
        variant: "destructive",
      })
      return
    }

    if (categoriesData[newCategoryData.id]) {
      toast({
        title: "خطا",
        description: "دسته‌بندی با این شناسه قبلاً وجود دارد",
        variant: "destructive",
      })
      return
    }

    const updatedCategories = {
      ...categoriesData,
      [newCategoryData.id]: {
        ...newCategoryData,
        subIssues: {},
      },
    }

    onCategoryUpdate(updatedCategories)
    setCategoryDialogOpen(false)
    setNewCategoryData({ id: "", label: "", description: "" })
    toast({
      title: "موفق",
      description: "دسته‌بندی جدید ایجاد شد",
    })
  }

  const handleUpdateCategory = () => {
    if (!editingCategory || !editingCategory.label) {
      toast({
        title: "خطا",
        description: "لطفاً تمام فیلدهای ضروری را پر کنید",
        variant: "destructive",
      })
      return
    }

    const updatedCategories = {
      ...categoriesData,
      [editingCategory.id]: {
        ...categoriesData[editingCategory.id],
        label: editingCategory.label,
        description: editingCategory.description,
      },
    }

    onCategoryUpdate(updatedCategories)
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
    if (selectedCategory === categoryId) {
      setSelectedCategory(null)
    }
    toast({
      title: "موفق",
      description: "دسته‌بندی حذف شد",
    })
  }

  const handleCreateSubCategory = () => {
    if (!selectedCategory || !newSubCategoryData.id || !newSubCategoryData.label) {
      toast({
        title: "خطا",
        description: "لطفاً تمام فیلدهای ضروری را پر کنید",
        variant: "destructive",
      })
      return
    }

    if (categoriesData[selectedCategory].subIssues[newSubCategoryData.id]) {
      toast({
        title: "خطا",
        description: "زیر دسته با این شناسه قبلاً وجود دارد",
        variant: "destructive",
      })
      return
    }

    const updatedCategories = {
      ...categoriesData,
      [selectedCategory]: {
        ...categoriesData[selectedCategory],
        subIssues: {
          ...categoriesData[selectedCategory].subIssues,
          [newSubCategoryData.id]: newSubCategoryData,
        },
      },
    }

    onCategoryUpdate(updatedCategories)
    setSubCategoryDialogOpen(false)
    setNewSubCategoryData({ id: "", label: "", description: "" })
    toast({
      title: "موفق",
      description: "زیر دسته جدید ایجاد شد",
    })
  }

  const handleUpdateSubCategory = () => {
    if (!selectedCategory || !editingSubCategory || !editingSubCategory.label) {
      toast({
        title: "خطا",
        description: "لطفاً تمام فیلدهای ضروری را پر کنید",
        variant: "destructive",
      })
      return
    }

    const updatedCategories = {
      ...categoriesData,
      [selectedCategory]: {
        ...categoriesData[selectedCategory],
        subIssues: {
          ...categoriesData[selectedCategory].subIssues,
          [editingSubCategory.id]: {
            ...editingSubCategory,
          },
        },
      },
    }

    onCategoryUpdate(updatedCategories)
    setEditingSubCategory(null)
    toast({
      title: "موفق",
      description: "زیر دسته به‌روزرسانی شد",
    })
  }

  const handleDeleteSubCategory = (subCategoryId: string) => {
    if (!selectedCategory) return

    const updatedCategories = {
      ...categoriesData,
      [selectedCategory]: {
        ...categoriesData[selectedCategory],
        subIssues: {
          ...categoriesData[selectedCategory].subIssues,
        },
      },
    }

    delete updatedCategories[selectedCategory].subIssues[subCategoryId]

    onCategoryUpdate(updatedCategories)
    toast({
      title: "موفق",
      description: "زیر دسته حذف شد",
    })
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="flex justify-between items-center">
        <div className="text-right">
          <h3 className="text-xl font-bold font-iran">مدیریت دسته‌بندی‌ها</h3>
          <p className="text-muted-foreground font-iran">مدیریت دسته‌بندی‌ها و زیر دسته‌های تیکت‌ها</p>
        </div>
        <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 font-iran">
              <Plus className="w-4 h-4" />
              دسته‌بندی جدید
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md font-iran" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-right font-iran">ایجاد دسته‌بندی جدید</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="categoryId" className="text-right font-iran">
                  شناسه دسته‌بندی *
                </Label>
                <Input
                  id="categoryId"
                  placeholder="مثال: hardware"
                  value={newCategoryData.id}
                  onChange={(e) => setNewCategoryData({ ...newCategoryData, id: e.target.value })}
                  className="text-right font-iran"
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryLabel" className="text-right font-iran">
                  نام دسته‌بندی *
                </Label>
                <Input
                  id="categoryLabel"
                  placeholder="مثال: مشکلات سخت‌افزاری"
                  value={newCategoryData.label}
                  onChange={(e) => setNewCategoryData({ ...newCategoryData, label: e.target.value })}
                  className="text-right font-iran"
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoryDescription" className="text-right font-iran">
                  توضیحات
                </Label>
                <Textarea
                  id="categoryDescription"
                  placeholder="توضیحات دسته‌بندی..."
                  value={newCategoryData.description}
                  onChange={(e) => setNewCategoryData({ ...newCategoryData, description: e.target.value })}
                  className="text-right font-iran"
                  dir="rtl"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setCategoryDialogOpen(false)} className="font-iran">
                  انصراف
                </Button>
                <Button onClick={handleCreateCategory} className="font-iran">
                  ایجاد
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categories List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right font-iran">دسته‌بندی‌های اصلی</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(categoriesData).map(([key, category]: [string, any]) => (
                <div
                  key={key}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedCategory === key ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                  }`}
                  onClick={() => setSelectedCategory(key)}
                >
                  <div className="flex justify-between items-start">
                    <div className="text-right flex-1">
                      <h4 className="font-medium font-iran">{category.label}</h4>
                      {category.description && (
                        <p className="text-sm text-muted-foreground mt-1 font-iran">{category.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs font-iran">
                          {Object.keys(category.subIssues || {}).length} زیر دسته
                        </Badge>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditingCategory({ ...category, id: key })
                        }}
                        className="font-iran"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (confirm("آیا از حذف این دسته‌بندی اطمینان دارید؟")) {
                            handleDeleteCategory(key)
                          }
                        }}
                        className="text-red-600 hover:text-red-700 font-iran"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Sub Categories */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-right font-iran">
                {selectedCategory ? `زیر دسته‌های ${categoriesData[selectedCategory]?.label}` : "زیر دسته‌ها"}
              </CardTitle>
              {selectedCategory && (
                <Dialog open={subCategoryDialogOpen} onOpenChange={setSubCategoryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2 font-iran">
                      <FolderPlus className="w-4 h-4" />
                      زیر دسته جدید
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md font-iran" dir="rtl">
                    <DialogHeader>
                      <DialogTitle className="text-right font-iran">ایجاد زیر دسته جدید</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="subCategoryId" className="text-right font-iran">
                          شناسه زیر دسته *
                        </Label>
                        <Input
                          id="subCategoryId"
                          placeholder="مثال: computer-not-working"
                          value={newSubCategoryData.id}
                          onChange={(e) => setNewSubCategoryData({ ...newSubCategoryData, id: e.target.value })}
                          className="text-right font-iran"
                          dir="rtl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subCategoryLabel" className="text-right font-iran">
                          نام زیر دسته *
                        </Label>
                        <Input
                          id="subCategoryLabel"
                          placeholder="مثال: رایانه کار نمی‌کند"
                          value={newSubCategoryData.label}
                          onChange={(e) => setNewSubCategoryData({ ...newSubCategoryData, label: e.target.value })}
                          className="text-right font-iran"
                          dir="rtl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subCategoryDescription" className="text-right font-iran">
                          توضیحات
                        </Label>
                        <Textarea
                          id="subCategoryDescription"
                          placeholder="توضیحات زیر دسته..."
                          value={newSubCategoryData.description}
                          onChange={(e) =>
                            setNewSubCategoryData({ ...newSubCategoryData, description: e.target.value })
                          }
                          className="text-right font-iran"
                          dir="rtl"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setSubCategoryDialogOpen(false)} className="font-iran">
                          انصراف
                        </Button>
                        <Button onClick={handleCreateSubCategory} className="font-iran">
                          ایجاد
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {selectedCategory ? (
              <div className="space-y-2">
                {Object.entries(categoriesData[selectedCategory]?.subIssues || {}).map(
                  ([key, subCategory]: [string, any]) => (
                    <div key={key} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div className="text-right flex-1">
                          <h5 className="font-medium font-iran">{subCategory.label}</h5>
                          {subCategory.description && (
                            <p className="text-sm text-muted-foreground mt-1 font-iran">{subCategory.description}</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingSubCategory({ ...subCategory, id: key })}
                            className="font-iran"
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              if (confirm("آیا از حذف این زیر دسته اطمینان دارید؟")) {
                                handleDeleteSubCategory(key)
                              }
                            }}
                            className="text-red-600 hover:text-red-700 font-iran"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ),
                )}
                {Object.keys(categoriesData[selectedCategory]?.subIssues || {}).length === 0 && (
                  <div className="text-center py-8">
                    <FolderPlus className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                    <p className="text-muted-foreground font-iran">هیچ زیر دسته‌ای وجود ندارد</p>
                    <p className="text-sm text-muted-foreground font-iran">برای شروع یک زیر دسته جدید ایجاد کنید</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground font-iran">دسته‌بندی انتخاب کنید</p>
                <p className="text-sm text-muted-foreground font-iran">
                  برای مشاهده زیر دسته‌ها، یک دسته‌بندی انتخاب کنید
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Category Dialog */}
      {editingCategory && (
        <Dialog open={!!editingCategory} onOpenChange={() => setEditingCategory(null)}>
          <DialogContent className="max-w-md font-iran" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-right font-iran">ویرایش دسته‌بندی</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-right font-iran">شناسه دسته‌بندی</Label>
                <Input value={editingCategory.id} disabled className="text-right font-iran bg-muted" dir="rtl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editCategoryLabel" className="text-right font-iran">
                  نام دسته‌بندی *
                </Label>
                <Input
                  id="editCategoryLabel"
                  value={editingCategory.label}
                  onChange={(e) => setEditingCategory({ ...editingCategory, label: e.target.value })}
                  className="text-right font-iran"
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editCategoryDescription" className="text-right font-iran">
                  توضیحات
                </Label>
                <Textarea
                  id="editCategoryDescription"
                  value={editingCategory.description}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="text-right font-iran"
                  dir="rtl"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingCategory(null)} className="font-iran">
                  انصراف
                </Button>
                <Button onClick={handleUpdateCategory} className="font-iran">
                  به‌روزرسانی
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Edit Sub Category Dialog */}
      {editingSubCategory && (
        <Dialog open={!!editingSubCategory} onOpenChange={() => setEditingSubCategory(null)}>
          <DialogContent className="max-w-md font-iran" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-right font-iran">ویرایش زیر دسته</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-right font-iran">شناسه زیر دسته</Label>
                <Input value={editingSubCategory.id} disabled className="text-right font-iran bg-muted" dir="rtl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editSubCategoryLabel" className="text-right font-iran">
                  نام زیر دسته *
                </Label>
                <Input
                  id="editSubCategoryLabel"
                  value={editingSubCategory.label}
                  onChange={(e) => setEditingSubCategory({ ...editingSubCategory, label: e.target.value })}
                  className="text-right font-iran"
                  dir="rtl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="editSubCategoryDescription" className="text-right font-iran">
                  توضیحات
                </Label>
                <Textarea
                  id="editSubCategoryDescription"
                  value={editingSubCategory.description}
                  onChange={(e) => setEditingSubCategory({ ...editingSubCategory, description: e.target.value })}
                  className="text-right font-iran"
                  dir="rtl"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingSubCategory(null)} className="font-iran">
                  انصراف
                </Button>
                <Button onClick={handleUpdateSubCategory} className="font-iran">
                  به‌روزرسانی
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Warning Message */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
            <div className="text-right">
              <h4 className="font-medium text-orange-800 font-iran">نکته مهم</h4>
              <p className="text-sm text-orange-700 mt-1 font-iran">
                تغییرات در دسته‌بندی‌ها بلافاصله در فرم ایجاد تیکت کاربران اعمال می‌شود. حذف دسته‌بندی‌ها ممکن است بر تیکت‌های
                موجود تأثیر بگذارد.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
