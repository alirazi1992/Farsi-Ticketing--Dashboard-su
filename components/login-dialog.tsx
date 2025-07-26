"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth-context"
import { toast } from "@/hooks/use-toast"
import { Eye, EyeOff, LogIn, UserPlus, User, Wrench, Shield } from "lucide-react"

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const { login, register, isLoading } = useAuth()
  const [activeTab, setActiveTab] = useState("login")
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    role: "",
  })

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    role: "",
    password: "",
    confirmPassword: "",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!loginForm.email || !loginForm.password) {
      toast({
        title: "خطا",
        description: "لطفاً تمام فیلدها را پر کنید",
        variant: "destructive",
      })
      return
    }

    const success = await login(loginForm.email, loginForm.password, loginForm.role)

    if (success) {
      toast({
        title: "ورود موفق",
        description: "با موفقیت وارد سیستم شدید",
      })
      onOpenChange(false)
      setLoginForm({ email: "", password: "", role: "" })
    } else {
      toast({
        title: "خطا در ورود",
        description: "ایمیل، رمز عبور یا نقش کاربری اشتباه است",
        variant: "destructive",
      })
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!registerForm.name || !registerForm.email || !registerForm.password || !registerForm.role) {
      toast({
        title: "خطا",
        description: "لطفاً تمام فیلدهای ضروری را پر کنید",
        variant: "destructive",
      })
      return
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      toast({
        title: "خطا",
        description: "رمز عبور و تکرار آن یکسان نیستند",
        variant: "destructive",
      })
      return
    }

    const success = await register({
      name: registerForm.name,
      email: registerForm.email,
      phone: registerForm.phone,
      department: registerForm.department,
      role: registerForm.role,
      password: registerForm.password,
    })

    if (success) {
      toast({
        title: "ثبت‌نام موفق",
        description: "حساب کاربری شما با موفقیت ایجاد شد",
      })
      onOpenChange(false)
      setRegisterForm({
        name: "",
        email: "",
        phone: "",
        department: "",
        role: "",
        password: "",
        confirmPassword: "",
      })
    } else {
      toast({
        title: "خطا در ثبت‌نام",
        description: "کاربری با این ایمیل قبلاً ثبت‌نام کرده است",
        variant: "destructive",
      })
    }
  }

  const quickLoginOptions = [
    {
      role: "client",
      email: "ahmad@company.com",
      password: "123456",
      name: "احمد محمدی (کاربر)",
      icon: User,
      color: "bg-gray-500",
    },
    {
      role: "technician",
      email: "ali@company.com",
      password: "123456",
      name: "علی تکنسین (تکنسین)",
      icon: Wrench,
      color: "bg-green-500",
    },
    {
      role: "admin",
      email: "admin@company.com",
      password: "123456",
      name: "مدیر سیستم (مدیر)",
      icon: Shield,
      color: "bg-blue-500",
    },
  ]

  const handleQuickLogin = async (email: string, password: string, role: string) => {
    const success = await login(email, password, role)
    if (success) {
      toast({
        title: "ورود موفق",
        description: "با موفقیت وارد سیستم شدید",
      })
      onOpenChange(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    login(username, password)
    onOpenChange(false)
    setUsername("")
    setPassword("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button size="lg" className="font-iran">
          <LogIn className="ml-2 h-4 w-4" />
          ورود به سیستم
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle className="text-right">ورود به سیستم</DialogTitle>
          <DialogDescription className="text-right">
            برای دسترسی به سیستم مدیریت تیکت، وارد حساب کاربری خود شوید
          </DialogDescription>
        </DialogHeader>

        <div dir="rtl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
            <TabsList className="grid w-full grid-cols-3" dir="rtl">
              <TabsTrigger value="login" className="text-right">
                ورود
              </TabsTrigger>
              <TabsTrigger value="register" className="text-right">
                ثبت‌نام
              </TabsTrigger>
              <TabsTrigger value="demo" className="text-right">
                ورود سریع
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4" dir="rtl">
              <form onSubmit={handleLogin} className="space-y-4" dir="rtl">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-right block">
                    ایمیل
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@company.com"
                    className="text-right"
                    dir="rtl"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-right block">
                    رمز عبور
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="رمز عبور خود را وارد کنید"
                      className="text-right pl-10"
                      dir="rtl"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute left-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-right block">
                    نقش کاربری
                  </Label>
                  <Select
                    value={loginForm.role}
                    onValueChange={(value) => setLoginForm({ ...loginForm, role: value })}
                    dir="rtl"
                  >
                    <SelectTrigger className="text-right" dir="rtl">
                      <SelectValue placeholder="نقش خود را انتخاب کنید" className="text-right" />
                    </SelectTrigger>
                    <SelectContent dir="rtl">
                      <SelectItem value="client" className="text-right">
                        کاربر
                      </SelectItem>
                      <SelectItem value="technician" className="text-right">
                        تکنسین
                      </SelectItem>
                      <SelectItem value="admin" className="text-right">
                        مدیر
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      در حال ورود...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <LogIn className="w-4 h-4" />
                      ورود
                    </div>
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="register" className="space-y-4" dir="rtl">
              <form onSubmit={handleRegister} className="space-y-4" dir="rtl">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-right block">
                      نام و نام خانوادگی
                    </Label>
                    <Input
                      id="name"
                      placeholder="نام کامل"
                      className="text-right"
                      dir="rtl"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-right block">
                      شماره تماس
                    </Label>
                    <Input
                      id="phone"
                      placeholder="09123456789"
                      className="text-right"
                      dir="rtl"
                      value={registerForm.phone}
                      onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reg-email" className="text-right block">
                    ایمیل
                  </Label>
                  <Input
                    id="reg-email"
                    type="email"
                    placeholder="example@company.com"
                    className="text-right"
                    dir="rtl"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-right block">
                      بخش
                    </Label>
                    <Select
                      value={registerForm.department}
                      onValueChange={(value) => setRegisterForm({ ...registerForm, department: value })}
                      dir="rtl"
                    >
                      <SelectTrigger className="text-right" dir="rtl">
                        <SelectValue placeholder="بخش" className="text-right" />
                      </SelectTrigger>
                      <SelectContent dir="rtl">
                        <SelectItem value="IT" className="text-right">
                          فناوری اطلاعات
                        </SelectItem>
                        <SelectItem value="HR" className="text-right">
                          منابع انسانی
                        </SelectItem>
                        <SelectItem value="Finance" className="text-right">
                          مالی
                        </SelectItem>
                        <SelectItem value="Operations" className="text-right">
                          عملیات
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-role" className="text-right block">
                      نقش
                    </Label>
                    <Select
                      value={registerForm.role}
                      onValueChange={(value) => setRegisterForm({ ...registerForm, role: value })}
                      dir="rtl"
                    >
                      <SelectTrigger className="text-right" dir="rtl">
                        <SelectValue placeholder="نقش" className="text-right" />
                      </SelectTrigger>
                      <SelectContent dir="rtl">
                        <SelectItem value="client" className="text-right">
                          کاربر
                        </SelectItem>
                        <SelectItem value="technician" className="text-right">
                          تکنسین
                        </SelectItem>
                        <SelectItem value="admin" className="text-right">
                          مدیر
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg-password" className="text-right block">
                      رمز عبور
                    </Label>
                    <Input
                      id="reg-password"
                      type="password"
                      placeholder="رمز عبور"
                      className="text-right"
                      dir="rtl"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-right block">
                      تکرار رمز عبور
                    </Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="تکرار رمز عبور"
                      className="text-right"
                      dir="rtl"
                      value={registerForm.confirmPassword}
                      onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      در حال ثبت‌نام...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      ثبت‌نام
                    </div>
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="demo" className="space-y-4" dir="rtl">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold mb-2">ورود سریع برای تست</h3>
                <p className="text-sm text-muted-foreground">برای تست سیستم، از حساب‌های آماده استفاده کنید</p>
              </div>

              <div className="space-y-3">
                {quickLoginOptions.map((option) => (
                  <Button
                    key={option.role}
                    variant="outline"
                    className="w-full justify-between h-auto p-4 bg-transparent text-right"
                    onClick={() => handleQuickLogin(option.email, option.password, option.role)}
                    disabled={isLoading}
                    dir="rtl"
                  >
                    <LogIn className="w-4 h-4" />
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="font-medium">{option.name}</div>
                        <div className="text-sm text-muted-foreground">{option.email}</div>
                      </div>
                      <div className={`w-8 h-8 rounded-full ${option.color} flex items-center justify-center`}>
                        <option.icon className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
              <div className="text-sm text-gray-500 mt-4 text-right font-iran">
                <p>حساب‌های نمونه:</p>
                <p>مدیر: admin / admin123</p>
                <p>تکنسین: tech1 / tech123</p>
                <p>کاربر: user1 / user123</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
