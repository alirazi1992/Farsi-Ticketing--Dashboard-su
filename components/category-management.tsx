"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import {
  Plus,
  Edit,
  Trash2,
  FolderPlus,
  Settings,
  HardDrive,
  ComputerIcon as Software,
  Network,
  Mail,
  Shield,
  Key,
  BookOpen,
  Wrench,
} from "lucide-react"

// Validation schemas
const categorySchema = yup.object({
  id: yup.string().required("شناسه دسته الزامی است"),
  label: yup.string().required("نام دسته الزامی است"),
  description: yup.string().optional(),
  icon: yup.string().required("انتخاب آیکون الزامی است"),
})

const subCategorySchema = yup.object({
  id: yup.string().required("شناسه زیردسته الزامی است"),
  label: yup.string().required("نام زیردسته الزامی است"),
  description: yup.string().optional(),
})

// Available icons
const availableIcons = [
  { id: "hardware", label: "سخت‌افزار", icon: HardDrive },
  { id: "software", label: "نرم‌افزار", icon: Software },
  { id: "network", label: "شبکه", icon: Network },
  { id: "email", label: "ایمیل", icon: Mail },
  { id: "security", label: "امنیت", icon: Shield },
  { id: "access", label: "دسترسی", icon: Key },
  { id: "training", label: "آموزش", icon: BookOpen },
  { id: "maintenance", label: "نگهداری", icon: Wrench },
]

// Initial categories data
const initialCategoriesData = {
  hardware: {
    id: "hardware",
    label: "مشکلات سخت‌افزاری",
    description: "مشکلات مربوط به تجهیزات سخت‌افزاری",
    icon: "hardware",
    subIssues: {
      "computer-not-working": {
        id: "computer-not-working",
        label: "رایانه کار نمی‌کند",
        description: "مشکلات روشن نشدن یا خاموش شدن رایانه",
      },
      "printer-issues": { id: "printer-issues", label: "مشکلات چاپگر", description: "مشکلات چاپ، کاغذ گیر کردن و..." },
      "monitor-problems": {
        id: "monitor-problems",
        label: "مشکلات مانیتور",
        description: "مشکلات نمایش، رنگ و روشنایی",
      },
      "keyboard-mouse": { id: "keyboard-mouse", label: "مشکلات کیبورد و ماوس", description: "مشکلات ورودی" },
      "network-hardware": {
        id: "network-hardware",
        label: "مشکلات سخت‌افزار شبکه",
        description: "مشکلات سوئیچ، روتر و کابل",
      },
      "ups-power": { id: "ups-power", label: "مشکلات برق و UPS", description: "مشکلات تغذیه و پایداری برق" },
      "other-hardware": { id: "other-hardware", label: "سایر مشکلات سخت‌افزاری", description: "سایر مشکلات سخت‌افزاری" },
    },
  },
  software: {
    id: "software",
    label: "مشکلات نرم‌افزاری",
    description: "مشکلات مربوط به نرم‌افزارها و سیستم عامل",
    icon: "software",
    subIssues: {
      "os-issues": { id: "os-issues", label: "مشکلات سیستم عامل", description: "مشکلات ویندوز، لینوکس و..." },
      "application-problems": {
        id: "application-problems",
        label: "مشکلات نرم‌افزارهای کاربردی",
        description: "مشکلات اپلیکیشن‌ها",
      },
      "software-installation": {
        id: "software-installation",
        label: "نصب و حذف نرم‌افزار",
        description: "درخواست نصب یا حذف نرم‌افزار",
      },
      "license-activation": {
        id: "license-activation",
        label: "مشکلات لایسنس و فعال‌سازی",
        description: "مشکلات مجوز استفاده",
      },
      "updates-patches": { id: "updates-patches", label: "به‌روزرسانی‌ها و وصله‌ها", description: "مشکلات آپدیت" },
      "performance-issues": {
        id: "performance-issues",
        label: "مشکلات عملکرد نرم‌افزار",
        description: "کندی و مشکلات عملکرد",
      },
      "other-software": { id: "other-software", label: "سایر مشکلات نرم‌افزاری", description: "سایر مشکلات نرم‌افزاری" },
    },
  },
  network: {
    id: "network",
    label: "مشکلات شبکه و اینترنت",
    description: "مشکلات مربوط به اتصال شبکه و اینترنت",
    icon: "network",
    subIssues: {
      "internet-connection": {
        id: "internet-connection",
        label: "مشکل اتصال اینترنت",
        description: "عدم دسترسی به اینترنت",
      },
      "wifi-problems": { id: "wifi-problems", label: "مشکلات Wi-Fi", description: "مشکلات اتصال بی‌سیم" },
      "network-speed": { id: "network-speed", label: "کندی شبکه", description: "سرعت پایین اینترنت" },
      "vpn-issues": { id: "vpn-issues", label: "مشکلات VPN", description: "مشکلات اتصال VPN" },
      "network-sharing": {
        id: "network-sharing",
        label: "مشکلات اشتراک‌گذاری شبکه",
        description: "مشکلات دسترسی به منابع مشترک",
      },
      "firewall-security": {
        id: "firewall-security",
        label: "مشکلات فایروال و امنیت",
        description: "مشکلات امنیت شبکه",
      },
      "other-network": { id: "other-network", label: "سایر مشکلات شبکه", description: "سایر مشکلات شبکه" },
    },
  },
  email: {
    id: "email",
    label: "مشکلات ایمیل",
    description: "مشکلات مربوط به سیستم ایمیل",
    icon: "email",
    subIssues: {
      "cannot-send": { id: "cannot-send", label: "نمی‌توانم ایمیل ارسال کنم", description: "مشکل در ارسال ایمیل" },
      "cannot-receive": { id: "cannot-receive", label: "ایمیل دریافت نمی‌کنم", description: "مشکل در دریافت ایمیل" },
      "login-problems": { id: "login-problems", label: "مشکل ورود به ایمیل", description: "مشکل احراز هویت" },
      "sync-issues": { id: "sync-issues", label: "مشکلات همگام‌سازی", description: "مشکل همگام‌سازی ایمیل‌ها" },
      "attachment-problems": {
        id: "attachment-problems",
        label: "مشکلات پیوست",
        description: "مشکل در ارسال یا دریافت پیوست",
      },
      "spam-issues": { id: "spam-issues", label: "مشکلات اسپم", description: "مشکلات فیلتر اسپم" },
      "other-email": { id: "other-email", label: "سایر مشکلات ایمیل", description: "سایر مشکلات ایمیل" },
    },
  },
  security: {
    id: "security",
    label: "مشکلات امنیتی",
    description: "مشکلات مربوط به امنیت سیستم",
    icon: "security",
    subIssues: {
      "virus-malware": { id: "virus-malware", label: "ویروس و بدافزار", description: "آلودگی به ویروس یا بدافزار" },
      "suspicious-activity": { id: "suspicious-activity", label: "فعالیت مشکوک", description: "مشاهده فعالیت غیرعادی" },
      "data-breach": { id: "data-breach", label: "نقض امنیت داده‌ها", description: "نشت یا سرقت اطلاعات" },
      "phishing-attempt": { id: "phishing-attempt", label: "تلاش فیشینگ", description: "دریافت ایمیل یا پیام مشکوک" },
      "unauthorized-access": {
        id: "unauthorized-access",
        label: "دسترسی غیرمجاز",
        description: "دسترسی غیرمجاز به سیستم",
      },
      "password-issues": { id: "password-issues", label: "مشکلات رمز عبور", description: "فراموشی یا تغییر رمز عبور" },
      "other-security": { id: "other-security", label: "سایر مشکلات امنیتی", description: "سایر مشکلات امنیتی" },
    },
  },
  access: {
    id: "access",
    label: "درخواست‌های دسترسی",
    description: "درخواست‌های دسترسی به سیستم‌ها و منابع",
    icon: "access",
    subIssues: {
      "new-account": { id: "new-account", label: "ایجاد حساب کاربری جدید", description: "درخواست حساب کاربری جدید" },
      "permission-change": { id: "permission-change", label: "تغییر مجوزهای دسترسی", description: "تغییر سطح دسترسی" },
      "system-access": { id: "system-access", label: "دسترسی به سیستم‌ها", description: "درخواست دسترسی به سیستم خاص" },
      "application-access": {
        id: "application-access",
        label: "دسترسی به نرم‌افزارها",
        description: "درخواست دسترسی به اپلیکیشن",
      },
      "network-access": { id: "network-access", label: "دسترسی شبکه", description: "درخواست دسترسی شبکه" },
      "file-access": { id: "file-access", label: "دسترسی به فایل‌ها", description: "درخواست دسترسی به فایل یا پوشه" },
      "other-access": { id: "other-access", label: "سایر درخواست‌های دسترسی", description: "سایر درخواست‌های دسترسی" },
    },
  },
}

interface CategoryManagementProps {
  categories: any
  onCategoryUpdate: (categories: any) => void
}

export function CategoryManagement({ categories, onCategoryUpdate }: CategoryManagementProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [editingSubCategory, setEditingSubCategory] = useState<any>(null)
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [subCategoryDialogOpen, setSubCategoryDialogOpen] = useState(false)

  // Category form
  const {
    control: categoryControl,
    handleSubmit: handleCategorySubmit,
    reset: resetCategoryForm,
    formState: { errors: categoryErrors },
  } = useForm({
    resolver: yupResolver(categorySchema),
    defaultValues: {
      id: "",
      label: "",
      description: "",
      icon: "",
    },
  })

  // Sub-category form
  const {
    control: subCategoryControl,
    handleSubmit: handleSubCategorySubmit,
    reset: resetSubCategoryForm,
    formState: { errors: subCategoryErrors },
  } = useForm({
    resolver: yupResolver(subCategorySchema),
    defaultValues: {
      id: "",
      label: "",
      description: "",
    },
  })

  // Handle category save
  const onCategorySubmit = (data: any) => {
    if (editingCategory) {
      // Update existing category
      onCategoryUpdate({
        ...categories,
        [data.id]: {
          ...categories[data.id],
          ...data,
        },
      })
      toast({
        title: "دسته‌بندی به‌روزرسانی شد",
        description: `دسته‌بندی "${data.label}" با موفقیت به‌روزرسانی شد`,
      })
    } else {
      // Add new category
      onCategoryUpdate({
        ...categories,
        [data.id]: {
          ...data,
          subIssues: {},
        },
      })
      toast({
        title: "دسته‌بندی جدید اضافه شد",
        description: `دسته‌بندی "${data.label}" با موفقیت اضافه شد`,
      })
    }

    setCategoryDialogOpen(false)
    setEditingCategory(null)
    resetCategoryForm()
  }

  // Handle sub-category save
  const onSubCategorySubmit = (data: any) => {
    if (!selectedCategory) return

    if (editingSubCategory) {
      // Update existing sub-category
      onCategoryUpdate({
        ...categories,
        [selectedCategory]: {
          ...categories[selectedCategory],
          subIssues: {
            ...categories[selectedCategory].subIssues,
            [data.id]: data,
          },
        },
      })
      toast({
        title: "زیردسته به‌روزرسانی شد",
        description: `زیردسته "${data.label}" با موفقیت به‌روزرسانی شد`,
      })
    } else {
      // Add new sub-category
      onCategoryUpdate({
        ...categories,
        [selectedCategory]: {
          ...categories[selectedCategory],
          subIssues: {
            ...categories[selectedCategory].subIssues,
            [data.id]: data,
          },
        },
      })
      toast({
        title: "زیردسته جدید اضافه شد",
        description: `زیردسته "${data.label}" با موفقیت اضافه شد`,
      })
    }

    setSubCategoryDialogOpen(false)
    setEditingSubCategory(null)
    resetSubCategoryForm()
  }

  // Handle category delete
  const handleDeleteCategory = (categoryId: string) => {
    const newCategories = { ...categories }
    delete newCategories[categoryId]
    onCategoryUpdate(newCategories)

    toast({
      title: "دسته‌بندی حذف شد",
      description: "دسته‌بندی با موفقیت حذف شد",
    })

    if (selectedCategory === categoryId) {
      setSelectedCategory(null)
    }
  }

  // Handle sub-category delete
  const handleDeleteSubCategory = (categoryId: string, subCategoryId: string) => {
    onCategoryUpdate({
      ...categories,
      [categoryId]: {
        ...categories[categoryId],
        subIssues: Object.fromEntries(
          Object.entries(categories[categoryId].subIssues).filter(([key]) => key !== subCategoryId),
        ),
      },
    })

    toast({
      title: "زیردسته حذف شد",
      description: "زیردسته با موفقیت حذف شد",
    })
  }

  // Handle edit category
  const handleEditCategory = (category: any) => {
    setEditingCategory(category)
    resetCategoryForm({
      id: category.id,
      label: category.label,
      description: category.description || "",
      icon: category.icon,
    })
    setCategoryDialogOpen(true)
  }

  // Handle edit sub-category
  const handleEditSubCategory = (subCategory: any) => {
    setEditingSubCategory(subCategory)
    resetSubCategoryForm({
      id: subCategory.id,
      label: subCategory.label,
      description: subCategory.description || "",
    })
    setSubCategoryDialogOpen(true)
  }

  return (
    <div className="space-y-6" dir="rtl">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-right">مدیریت دسته‌بندی‌ها</CardTitle>
            <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="gap-2"
                  onClick={() => {
                    setEditingCategory(null)
                    resetCategoryForm()
                  }}
                >
                  <Plus className="w-4 h-4" />
                  دسته‌بندی جدید
                </Button>
              </DialogTrigger>
              <DialogContent dir="rtl">
                <DialogHeader>
                  <DialogTitle className="text-right">
                    {editingCategory ? "ویرایش دسته‌بندی" : "دسته‌بندی جدید"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCategorySubmit(onCategorySubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="id" className="text-right">
                      شناسه دسته *
                    </Label>
                    <Controller
                      name="id"
                      control={categoryControl}
                      render={({ field }) => (
                        <Input
                          {...field}
                          placeholder="مثال: new-category"
                          className="text-right"
                          dir="rtl"
                          disabled={!!editingCategory}
                        />
                      )}
                    />
                    {categoryErrors.id && (
                      <p className="text-sm text-red-500 text-right">{categoryErrors.id.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="label" className="text-right">
                      نام دسته *
                    </Label>
                    <Controller
                      name="label"
                      control={categoryControl}
                      render={({ field }) => (
                        <Input {...field} placeholder="نام دسته‌بندی" className="text-right" dir="rtl" />
                      )}
                    />
                    {categoryErrors.label && (
                      <p className="text-sm text-red-500 text-right">{categoryErrors.label.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-right">
                      توضیحات
                    </Label>
                    <Controller
                      name="description"
                      control={categoryControl}
                      render={({ field }) => (
                        <Textarea {...field} placeholder="توضیحات دسته‌بندی" className="text-right" dir="rtl" />
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="icon" className="text-right">
                      آیکون *
                    </Label>
                    <Controller
                      name="icon"
                      control={categoryControl}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                          <SelectTrigger className="text-right">
                            <SelectValue placeholder="انتخاب آیکون" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableIcons.map((icon) => {
                              const IconComponent = icon.icon
                              return (
                                <SelectItem key={icon.id} value={icon.id}>
                                  <div className="flex items-center gap-2">
                                    <IconComponent className="w-4 h-4" />
                                    <span>{icon.label}</span>
                                  </div>
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {categoryErrors.icon && (
                      <p className="text-sm text-red-500 text-right">{categoryErrors.icon.message}</p>
                    )}
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setCategoryDialogOpen(false)
                        setEditingCategory(null)
                        resetCategoryForm()
                      }}
                    >
                      انصراف
                    </Button>
                    <Button type="submit">{editingCategory ? "به‌روزرسانی" : "ایجاد"}</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Categories List */}
            <div className="space-y-4">
              <h3 className="font-semibold text-right">دسته‌بندی‌ها</h3>
              <div className="space-y-2">
                {Object.values(categories).map((category: any) => {
                  const IconComponent = availableIcons.find((icon) => icon.id === category.icon)?.icon || Settings
                  return (
                    <div
                      key={category.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedCategory === category.id ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4" />
                          <span className="font-medium">{category.label}</span>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEditCategory(category)
                            }}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => e.stopPropagation()}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent dir="rtl">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-right">حذف دسته‌بندی</AlertDialogTitle>
                                <AlertDialogDescription className="text-right">
                                  آیا از حذف دسته‌بندی "{category.label}" اطمینان دارید؟ این عمل قابل بازگشت نیست.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>انصراف</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteCategory(category.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  حذف
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      {category.description && (
                        <p className="text-sm text-muted-foreground mt-1 text-right">{category.description}</p>
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <Badge variant="outline" className="text-xs">
                          {Object.keys(category.subIssues).length} زیردسته
                        </Badge>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Sub-categories */}
            <div className="lg:col-span-2">
              {selectedCategory ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-right">زیردسته‌های {categories[selectedCategory]?.label}</h3>
                    <Dialog open={subCategoryDialogOpen} onOpenChange={setSubCategoryDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 bg-transparent"
                          onClick={() => {
                            setEditingSubCategory(null)
                            resetSubCategoryForm()
                          }}
                        >
                          <FolderPlus className="w-4 h-4" />
                          زیردسته جدید
                        </Button>
                      </DialogTrigger>
                      <DialogContent dir="rtl">
                        <DialogHeader>
                          <DialogTitle className="text-right">
                            {editingSubCategory ? "ویرایش زیردسته" : "زیردسته جدید"}
                          </DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubCategorySubmit(onSubCategorySubmit)} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="id" className="text-right">
                              شناسه زیردسته *
                            </Label>
                            <Controller
                              name="id"
                              control={subCategoryControl}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  placeholder="مثال: new-sub-category"
                                  className="text-right"
                                  dir="rtl"
                                  disabled={!!editingSubCategory}
                                />
                              )}
                            />
                            {subCategoryErrors.id && (
                              <p className="text-sm text-red-500 text-right">{subCategoryErrors.id.message}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="label" className="text-right">
                              نام زیردسته *
                            </Label>
                            <Controller
                              name="label"
                              control={subCategoryControl}
                              render={({ field }) => (
                                <Input {...field} placeholder="نام زیردسته" className="text-right" dir="rtl" />
                              )}
                            />
                            {subCategoryErrors.label && (
                              <p className="text-sm text-red-500 text-right">{subCategoryErrors.label.message}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="description" className="text-right">
                              توضیحات
                            </Label>
                            <Controller
                              name="description"
                              control={subCategoryControl}
                              render={({ field }) => (
                                <Textarea {...field} placeholder="توضیحات زیردسته" className="text-right" dir="rtl" />
                              )}
                            />
                          </div>

                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                setSubCategoryDialogOpen(false)
                                setEditingSubCategory(null)
                                resetSubCategoryForm()
                              }}
                            >
                              انصراف
                            </Button>
                            <Button type="submit">{editingSubCategory ? "به‌روزرسانی" : "ایجاد"}</Button>
                          </div>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <div className="space-y-2">
                    {Object.values(categories[selectedCategory]?.subIssues || {}).map((subCategory: any) => (
                      <div key={subCategory.id} className="p-3 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-right">{subCategory.label}</h4>
                            {subCategory.description && (
                              <p className="text-sm text-muted-foreground mt-1 text-right">{subCategory.description}</p>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleEditSubCategory(subCategory)}>
                              <Edit className="w-3 h-3" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent dir="rtl">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-right">حذف زیردسته</AlertDialogTitle>
                                  <AlertDialogDescription className="text-right">
                                    آیا از حذف زیردسته "{subCategory.label}" اطمینان دارید؟ این عمل قابل بازگشت نیست.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>انصراف</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteSubCategory(selectedCategory, subCategory.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    حذف
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </div>
                    ))}

                    {Object.keys(categories[selectedCategory]?.subIssues || {}).length === 0 && (
                      <div className="text-center py-8">
                        <FolderPlus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-muted-foreground">زیردسته‌ای وجود ندارد</h3>
                        <p className="text-sm text-muted-foreground mt-1">برای شروع، زیردسته جدیدی اضافه کنید</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground">دسته‌بندی انتخاب کنید</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    برای مشاهده و مدیریت زیردسته‌ها، یک دسته‌بندی از فهرست سمت راست انتخاب کنید
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
