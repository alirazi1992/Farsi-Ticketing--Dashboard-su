"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import {
  Plus,
  Trash2,
  Edit,
  FolderTree,
  Tag,
  Save,
  X,
  CheckCircle,
  HardDrive,
  ComputerIcon as Software,
  Network,
  Mail,
  Shield,
  Key,
} from "lucide-react"

const categoryIcons = {
  hardware: HardDrive,
  software: Software,
  network: Network,
  email: Mail,
  security: Shield,
  access: Key,
}

const categoryLabels = {
  hardware: "سخت‌افزار",
  software: "نرم‌افزار",
  network: "شبکه",
  email: "ایمیل",
  security: "امنیت",
  access: "دسترسی",
}

interface CategoryManagementProps {
  categories?: any
  onCategoryUpdate?: (categories: any) => void
}

export function CategoryManagement({ categories: propCategories, onCategoryUpdate }: CategoryManagementProps) {
  // Initialize with default categories if none provided
  const [categories, setCategories] = useState({
    hardware: ["کامپیوتر", "پرینتر", "شبکه", "تجهیزات جانبی"],
    software: ["نرم‌افزار اداری", "سیستم عامل", "آنتی‌ویروس", "نرم‌افزار تخصصی"],
    network: ["اینترنت", "شبکه داخلی", "ایمیل", "VPN"],
    email: ["مشکل دسترسی", "تنظیمات", "اسپم", "پشتیبان‌گیری"],
    security: ["آنتی‌ویروس", "فایروال", "دسترسی‌ها", "رمز عبور"],
    access: ["دسترسی سیستم", "مجوزها", "کارت شناسایی", "VPN"],
  })

  const [newCategoryName, setNewCategoryName] = useState("")
  const [newSubcategoryName, setNewSubcategoryName] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [editingCategory, setEditingCategory] = useState("")
  const [editingSubcategory, setEditingSubcategory] = useState("")
  const [editCategoryName, setEditCategoryName] = useState("")
  const [editSubcategoryName, setEditSubcategoryName] = useState("")
  const [addCategoryDialogOpen, setAddCategoryDialogOpen] = useState(false)
  const [addSubcategoryDialogOpen, setAddSubcategoryDialogOpen] = useState(false)

  // Sync with prop categories if provided
  useEffect(() => {
    if (propCategories && Object.keys(propCategories).length > 0) {
      setCategories(propCategories)
    }
  }, [propCategories])

  // Sync changes back to parent
  const syncCategories = (updatedCategories: any) => {
    setCategories(updatedCategories)
    if (onCategoryUpdate) {
      onCategoryUpdate(updatedCategories)
    }
  }

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "خطا",
        description: "نام دسته‌بندی نمی‌تواند خالی باشد",
        variant: "destructive",
      })
      return
    }

    const categoryKey = newCategoryName.toLowerCase().replace(/\s+/g, "_")

    if (categories[categoryKey]) {
      toast({
        title: "خطا",
        description: "این دسته‌بندی قبلاً وجود دارد",
        variant: "destructive",
      })
      return
    }

    const updatedCategories = {
      ...categories,
      [categoryKey]: [],
    }

    syncCategories(updatedCategories)
    setNewCategoryName("")
    setAddCategoryDialogOpen(false)

    toast({
      title: "موفقیت",
      description: "دسته‌بندی جدید اضافه شد",
    })
  }

  const handleAddSubcategory = () => {
    if (!selectedCategory || !newSubcategoryName.trim()) {
      toast({
        title: "خطا",
        description: "لطفاً دسته‌بندی و نام زیردسته را انتخاب کنید",
        variant: "destructive",
      })
      return
    }

    if (categories[selectedCategory].includes(newSubcategoryName.trim())) {
      toast({
        title: "خطا",
        description: "این زیردسته قبلاً وجود دارد",
        variant: "destructive",
      })
      return
    }

    const updatedCategories = {
      ...categories,
      [selectedCategory]: [...categories[selectedCategory], newSubcategoryName.trim()],
    }

    syncCategories(updatedCategories)
    setNewSubcategoryName("")
    setSelectedCategory("")
    setAddSubcategoryDialogOpen(false)

    toast({
      title: "موفقیت",
      description: "زیردسته جدید اضافه شد",
    })
  }

  const handleDeleteCategory = (categoryKey: string) => {
    const updatedCategories = { ...categories }
    delete updatedCategories[categoryKey]

    syncCategories(updatedCategories)

    toast({
      title: "موفقیت",
      description: "دسته‌بندی حذف شد",
    })
  }

  const handleDeleteSubcategory = (categoryKey: string, subcategory: string) => {
    const updatedCategories = {
      ...categories,
      [categoryKey]: categories[categoryKey].filter((sub: string) => sub !== subcategory),
    }

    syncCategories(updatedCategories)

    toast({
      title: "موفقیت",
      description: "زیردسته حذف شد",
    })
  }

  const handleEditCategory = (categoryKey: string) => {
    if (!editCategoryName.trim()) {
      toast({
        title: "خطا",
        description: "نام دسته‌بندی نمی‌تواند خالی باشد",
        variant: "destructive",
      })
      return
    }

    const newCategoryKey = editCategoryName.toLowerCase().replace(/\s+/g, "_")

    if (newCategoryKey !== categoryKey && categories[newCategoryKey]) {
      toast({
        title: "خطا",
        description: "این نام دسته‌بندی قبلاً وجود دارد",
        variant: "destructive",
      })
      return
    }

    const updatedCategories = { ...categories }

    if (newCategoryKey !== categoryKey) {
      updatedCategories[newCategoryKey] = updatedCategories[categoryKey]
      delete updatedCategories[categoryKey]
    }

    syncCategories(updatedCategories)
    setEditingCategory("")
    setEditCategoryName("")

    toast({
      title: "موفقیت",
      description: "دسته‌بندی ویرایش شد",
    })
  }

  const handleEditSubcategory = (categoryKey: string, oldSubcategory: string) => {
    if (!editSubcategoryName.trim()) {
      toast({
        title: "خطا",
        description: "نام زیردسته نمی‌تواند خالی باشد",
        variant: "destructive",
      })
      return
    }

    if (editSubcategoryName.trim() !== oldSubcategory && categories[categoryKey].includes(editSubcategoryName.trim())) {
      toast({
        title: "خطا",
        description: "این نام زیردسته قبلاً وجود دارد",
        variant: "destructive",
      })
      return
    }

    const updatedCategories = {
      ...categories,
      [categoryKey]: categories[categoryKey].map((sub: string) =>
        sub === oldSubcategory ? editSubcategoryName.trim() : sub,
      ),
    }

    syncCategories(updatedCategories)
    setEditingSubcategory("")
    setEditSubcategoryName("")

    toast({
      title: "موفقیت",
      description: "زیردسته ویرایش شد",
    })
  }

  return (
    <div className="space-y-6 font-iran" dir="rtl">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-right font-iran flex items-center gap-2">
              <FolderTree className="w-5 h-5 text-blue-600" />
              مدیریت دسته‌بندی‌ها
            </CardTitle>
            <div className="flex gap-2">
              <Dialog open={addCategoryDialogOpen} onOpenChange={setAddCategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2 font-iran">
                    <Plus className="w-4 h-4" />
                    دسته‌بندی جدید
                  </Button>
                </DialogTrigger>
                <DialogContent className="font-iran" dir="rtl">
                  <DialogHeader>
                    <DialogTitle className="text-right font-iran">افزودن دسته‌بندی جدید</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="categoryName" className="text-right font-iran">
                        نام دسته‌بندی
                      </Label>
                      <Input
                        id="categoryName"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="مثال: تجهیزات جدید"
                        className="text-right font-iran"
                        dir="rtl"
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setAddCategoryDialogOpen(false)} className="font-iran">
                        انصراف
                      </Button>
                      <Button onClick={handleAddCategory} className="font-iran">
                        افزودن
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={addSubcategoryDialogOpen} onOpenChange={setAddSubcategoryDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2 font-iran bg-transparent">
                    <Tag className="w-4 h-4" />
                    زیردسته جدید
                  </Button>
                </DialogTrigger>
                <DialogContent className="font-iran" dir="rtl">
                  <DialogHeader>
                    <DialogTitle className="text-right font-iran">افزودن زیردسته جدید</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="parentCategory" className="text-right font-iran">
                        دسته‌بندی والد
                      </Label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory} dir="rtl">
                        <SelectTrigger className="text-right font-iran">
                          <SelectValue placeholder="انتخاب دسته‌بندی" />
                        </SelectTrigger>
                        <SelectContent className="font-iran">
                          {Object.keys(categories).map((categoryKey) => {
                            const CategoryIcon = categoryIcons[categoryKey] || FolderTree
                            return (
                              <SelectItem key={categoryKey} value={categoryKey}>
                                <div className="flex items-center gap-2">
                                  <CategoryIcon className="w-4 h-4" />
                                  <span>{categoryLabels[categoryKey] || categoryKey}</span>
                                </div>
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="subcategoryName" className="text-right font-iran">
                        نام زیردسته
                      </Label>
                      <Input
                        id="subcategoryName"
                        value={newSubcategoryName}
                        onChange={(e) => setNewSubcategoryName(e.target.value)}
                        placeholder="مثال: مانیتور"
                        className="text-right font-iran"
                        dir="rtl"
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        onClick={() => setAddSubcategoryDialogOpen(false)}
                        className="font-iran"
                      >
                        انصراف
                      </Button>
                      <Button onClick={handleAddSubcategory} className="font-iran">
                        افزودن
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.keys(categories).length === 0 ? (
              <div className="text-center py-8">
                <FolderTree className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground font-iran">هیچ دسته‌بندی‌ای وجود ندارد</p>
                <p className="text-sm text-muted-foreground font-iran mt-2">برای شروع، یک دسته‌بندی جدید اضافه کنید</p>
              </div>
            ) : (
              Object.entries(categories).map(([categoryKey, subcategories]) => {
                const CategoryIcon = categoryIcons[categoryKey] || FolderTree
                const categoryLabel = categoryLabels[categoryKey] || categoryKey

                return (
                  <Card key={categoryKey} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <CategoryIcon className="w-6 h-6 text-blue-600" />
                          {editingCategory === categoryKey ? (
                            <div className="flex items-center gap-2">
                              <Input
                                value={editCategoryName}
                                onChange={(e) => setEditCategoryName(e.target.value)}
                                className="text-right font-iran w-48"
                                dir="rtl"
                                autoFocus
                              />
                              <Button
                                size="sm"
                                onClick={() => handleEditCategory(categoryKey)}
                                className="gap-1 font-iran"
                              >
                                <Save className="w-3 h-3" />
                                ذخیره
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setEditingCategory("")
                                  setEditCategoryName("")
                                }}
                                className="gap-1 font-iran"
                              >
                                <X className="w-3 h-3" />
                                انصراف
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold font-iran">{categoryLabel}</h3>
                              <Badge variant="secondary" className="font-iran">
                                {(subcategories as string[]).length} زیردسته
                              </Badge>
                            </div>
                          )}
                        </div>
                        {editingCategory !== categoryKey && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setEditingCategory(categoryKey)
                                setEditCategoryName(categoryLabel)
                              }}
                              className="gap-1 font-iran hover:bg-blue-50 hover:text-blue-600"
                            >
                              <Edit className="w-3 h-3" />
                              ویرایش
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteCategory(categoryKey)}
                              className="gap-1 font-iran hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="w-3 h-3" />
                              حذف
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      {(subcategories as string[]).length === 0 ? (
                        <div className="text-center py-4 bg-muted/30 rounded-lg">
                          <Tag className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground font-iran">هیچ زیردسته‌ای وجود ندارد</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {(subcategories as string[]).map((subcategory) => (
                            <div
                              key={subcategory}
                              className="flex items-center justify-between p-2 bg-muted/50 rounded-lg group hover:bg-muted"
                            >
                              {editingSubcategory === `${categoryKey}-${subcategory}` ? (
                                <div className="flex items-center gap-2 w-full">
                                  <Input
                                    value={editSubcategoryName}
                                    onChange={(e) => setEditSubcategoryName(e.target.value)}
                                    className="text-right font-iran flex-1"
                                    dir="rtl"
                                    autoFocus
                                  />
                                  <Button
                                    size="sm"
                                    onClick={() => handleEditSubcategory(categoryKey, subcategory)}
                                    className="gap-1 font-iran"
                                  >
                                    <Save className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setEditingSubcategory("")
                                      setEditSubcategoryName("")
                                    }}
                                    className="gap-1 font-iran"
                                  >
                                    <X className="w-3 h-3" />
                                  </Button>
                                </div>
                              ) : (
                                <>
                                  <span className="text-sm font-iran flex-1 text-right">{subcategory}</span>
                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => {
                                        setEditingSubcategory(`${categoryKey}-${subcategory}`)
                                        setEditSubcategoryName(subcategory)
                                      }}
                                      className="h-6 w-6 p-0 hover:bg-blue-100 hover:text-blue-600"
                                    >
                                      <Edit className="w-3 h-3" />
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => handleDeleteSubcategory(categoryKey, subcategory)}
                                      className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })
            )}
          </div>

          <Separator className="my-6" />

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-right">
                <h4 className="font-medium text-blue-900 font-iran mb-2">نکات مهم:</h4>
                <ul className="text-sm text-blue-800 space-y-1 font-iran">
                  <li>• تغییرات در دسته‌بندی‌ها بلافاصله در فرم ایجاد تیکت اعمال می‌شود</li>
                  <li>• حذف دسته‌بندی باعث حذف تمام زیردسته‌های آن می‌شود</li>
                  <li>• نام دسته‌بندی‌ها باید منحصر به فرد باشند</li>
                  <li>• زیردسته‌ها در هر دسته‌بندی باید منحصر به فرد باشند</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
