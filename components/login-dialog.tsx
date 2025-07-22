"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/auth-context"
import { User, Settings, Eye, EyeOff, UserPlus, LogIn } from "lucide-react"

const loginSchema = yup.object({
  email: yup.string().email("ایمیل معتبر وارد کنید").required("ایمیل الزامی است"),
  password: yup.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد").required("رمز عبور الزامی است"),
})

const signupSchema = yup.object({
  name: yup.string().required("نام و نام خانوادگی الزامی است"),
  email: yup.string().email("ایمیل معتبر وارد کنید").required("ایمیل الزامی است"),
  password: yup.string().min(6, "رمز عبور باید حداقل ۶ کاراکتر باشد").required("رمز عبور الزامی است"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "تکرار رمز عبور مطابقت ندارد")
    .required("تکرار رمز عبور الزامی است"),
  phone: yup.string().required("شماره تماس الزامی است"),
  department: yup.string().optional(),
  role: yup.string().oneOf(["client"], "نقش معتبر انتخاب کنید").required("نقش الزامی است"),
})

interface LoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const [activeTab, setActiveTab] = useState("login")
  const [loginType, setLoginType] = useState("client")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { login, isLoading } = useAuth()

  const loginForm = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const signupForm = useForm({
    resolver: yupResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      department: "",
      role: "client",
    },
  })

  const onLoginSubmit = async (data: { email: string; password: string }) => {
    try {
      const success = await login(data.email, data.password, loginType as "client" | "engineer")

      if (success) {
        toast({
          title: "ورود موفق",
          description: "به سیستم خوش آمدید",
        })
        loginForm.reset()
        onOpenChange(false)
      } else {
        toast({
          title: "خطا در ورود",
          description: "ایمیل یا رمز عبور اشتباه است",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "خطا در ورود",
        description: "لطفاً دوباره تلاش کنید",
        variant: "destructive",
      })
    }
  }

  const onSignupSubmit = async (data: any) => {
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Here you would typically send the data to your backend
      console.log("Signup data:", data)

      toast({
        title: "ثبت‌نام موفق",
        description: "حساب کاربری شما با موفقیت ایجاد شد. لطفاً وارد شوید.",
      })

      signupForm.reset()
      setActiveTab("login")
    } catch (error) {
      toast({
        title: "خطا در ثبت‌نام",
        description: "لطفاً دوباره تلاش کنید",
        variant: "destructive",
      })
    }
  }

  const fillDemoCredentials = (role: "client" | "engineer" | "admin") => {
    const credentials = {
      client: { email: "ahmad@company.com", password: "123456" },
      engineer: { email: "ali@company.com", password: "123456" },
      admin: { email: "admin@company.com", password: "123456" },
    }

    loginForm.reset(credentials[role])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader className="text-right">
          <DialogTitle className="text-right">
            {activeTab === "login" ? "ورود به سیستم" : "ثبت‌نام در سیستم"}
          </DialogTitle>
          <DialogDescription className="text-right">
            {activeTab === "login"
              ? "برای دسترسی به سیستم مدیریت خدمات IT وارد شوید"
              : "برای ایجاد حساب کاربری جدید ثبت‌نام کنید"}
          </DialogDescription>
        </DialogHeader>

        <div dir="rtl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full" dir="rtl">
            <TabsList className="grid w-full grid-cols-2" dir="rtl">
              <TabsTrigger value="login" className="gap-2 flex-row-reverse">
                <LogIn className="w-4 h-4" />
                ورود
              </TabsTrigger>
              <TabsTrigger value="signup" className="gap-2 flex-row-reverse">
                <UserPlus className="w-4 h-4" />
                ثبت‌نام
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="space-y-4" dir="rtl">
              <div className="space-y-4" dir="rtl">
                <Tabs value={loginType} onValueChange={setLoginType} className="w-full" dir="rtl">
                  <TabsList className="grid w-full grid-cols-2" dir="rtl">
                    <TabsTrigger value="client" className="gap-2 flex-row-reverse">
                      <User className="w-4 h-4" />
                      کاربر
                    </TabsTrigger>
                    <TabsTrigger value="engineer" className="gap-2 flex-row-reverse">
                      <Settings className="w-4 h-4" />
                      تکنسین
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="client" className="space-y-4" dir="rtl">
                    <Card dir="rtl">
                      <CardHeader className="pb-3 text-right">
                        <CardTitle className="text-lg text-right">ورود کاربر</CardTitle>
                        <CardDescription className="text-right">
                          برای مشاهده و ایجاد تیکت‌های خود وارد شوید
                        </CardDescription>
                      </CardHeader>
                      <CardContent dir="rtl">
                        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4" dir="rtl">
                          <div className="space-y-2 text-right" dir="rtl">
                            <Label htmlFor="email" className="text-right">
                              ایمیل
                            </Label>
                            <Controller
                              name="email"
                              control={loginForm.control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  type="email"
                                  placeholder="user@company.com"
                                  disabled={isLoading}
                                  className="text-right"
                                  dir="rtl"
                                />
                              )}
                            />
                            {loginForm.formState.errors.email && (
                              <p className="text-sm text-red-500 text-right">
                                {loginForm.formState.errors.email.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2 text-right" dir="rtl">
                            <Label htmlFor="password" className="text-right">
                              رمز عبور
                            </Label>
                            <div className="relative" dir="rtl">
                              <Controller
                                name="password"
                                control={loginForm.control}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="رمز عبور"
                                    disabled={isLoading}
                                    className="text-right pr-10"
                                    dir="rtl"
                                  />
                                )}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                            {loginForm.formState.errors.password && (
                              <p className="text-sm text-red-500 text-right">
                                {loginForm.formState.errors.password.message}
                              </p>
                            )}
                          </div>

                          <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "در حال ورود..." : "ورود"}
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            className="w-full bg-transparent"
                            onClick={() => fillDemoCredentials("client")}
                          >
                            استفاده از حساب نمونه
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="engineer" className="space-y-4" dir="rtl">
                    <Card dir="rtl">
                      <CardHeader className="pb-3 text-right">
                        <CardTitle className="text-lg text-right">ورود تکنسین</CardTitle>
                        <CardDescription className="text-right">
                          برای مدیریت تیکت‌ها و پاسخ‌گویی وارد شوید
                        </CardDescription>
                      </CardHeader>
                      <CardContent dir="rtl">
                        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4" dir="rtl">
                          <div className="space-y-2 text-right" dir="rtl">
                            <Label htmlFor="email" className="text-right">
                              ایمیل
                            </Label>
                            <Controller
                              name="email"
                              control={loginForm.control}
                              render={({ field }) => (
                                <Input
                                  {...field}
                                  type="email"
                                  placeholder="engineer@company.com"
                                  disabled={isLoading}
                                  className="text-right"
                                  dir="rtl"
                                />
                              )}
                            />
                            {loginForm.formState.errors.email && (
                              <p className="text-sm text-red-500 text-right">
                                {loginForm.formState.errors.email.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2 text-right" dir="rtl">
                            <Label htmlFor="password" className="text-right">
                              رمز عبور
                            </Label>
                            <div className="relative" dir="rtl">
                              <Controller
                                name="password"
                                control={loginForm.control}
                                render={({ field }) => (
                                  <Input
                                    {...field}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="رمز عبور"
                                    disabled={isLoading}
                                    className="text-right pr-10"
                                    dir="rtl"
                                  />
                                )}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                            {loginForm.formState.errors.password && (
                              <p className="text-sm text-red-500 text-right">
                                {loginForm.formState.errors.password.message}
                              </p>
                            )}
                          </div>

                          <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "در حال ورود..." : "ورود"}
                          </Button>

                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => fillDemoCredentials("engineer")}
                            >
                              تکنسین نمونه
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => fillDemoCredentials("admin")}
                            >
                              مدیر نمونه
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4" dir="rtl">
              <Card dir="rtl">
                <CardHeader className="pb-3 text-right">
                  <CardTitle className="text-lg text-right">ایجاد حساب کاربری جدید</CardTitle>
                  <CardDescription className="text-right">
                    اطلاعات خود را برای ثبت‌نام در سیستم وارد کنید
                  </CardDescription>
                </CardHeader>
                <CardContent dir="rtl">
                  <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4" dir="rtl">
                    <div className="space-y-2 text-right" dir="rtl">
                      <Label htmlFor="name" className="text-right">
                        نام و نام خانوادگی *
                      </Label>
                      <Controller
                        name="name"
                        control={signupForm.control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            placeholder="نام کامل خود را وارد کنید"
                            disabled={isLoading}
                            className="text-right"
                            dir="rtl"
                          />
                        )}
                      />
                      {signupForm.formState.errors.name && (
                        <p className="text-sm text-red-500 text-right">{signupForm.formState.errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2 text-right" dir="rtl">
                      <Label htmlFor="email" className="text-right">
                        ایمیل *
                      </Label>
                      <Controller
                        name="email"
                        control={signupForm.control}
                        render={({ field }) => (
                          <Input
                            {...field}
                            type="email"
                            placeholder="example@domain.com"
                            disabled={isLoading}
                            className="text-right"
                            dir="rtl"
                          />
                        )}
                      />
                      {signupForm.formState.errors.email && (
                        <p className="text-sm text-red-500 text-right">{signupForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 text-right" dir="rtl">
                        <Label htmlFor="phone" className="text-right">
                          شماره تماس *
                        </Label>
                        <Controller
                          name="phone"
                          control={signupForm.control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder="09123456789"
                              disabled={isLoading}
                              className="text-right"
                              dir="rtl"
                            />
                          )}
                        />
                        {signupForm.formState.errors.phone && (
                          <p className="text-sm text-red-500 text-right">{signupForm.formState.errors.phone.message}</p>
                        )}
                      </div>

                      <div className="space-y-2 text-right" dir="rtl">
                        <Label htmlFor="department" className="text-right">
                          بخش
                        </Label>
                        <Controller
                          name="department"
                          control={signupForm.control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              placeholder="نام بخش"
                              disabled={isLoading}
                              className="text-right"
                              dir="rtl"
                            />
                          )}
                        />
                      </div>
                    </div>

                    <div className="space-y-2 text-right" dir="rtl">
                      <Label htmlFor="role" className="text-right">
                        نقش *
                      </Label>
                      <Controller
                        name="role"
                        control={signupForm.control}
                        render={({ field }) => (
                          <Select value={field.value} onValueChange={field.onChange} dir="rtl">
                            <SelectTrigger className="text-right">
                              <SelectValue placeholder="نقش خود را انتخاب کنید" />
                            </SelectTrigger>
                            <SelectContent dir="rtl">
                              <SelectItem value="client">کاربر</SelectItem>
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {signupForm.formState.errors.role && (
                        <p className="text-sm text-red-500 text-right">{signupForm.formState.errors.role.message}</p>
                      )}
                    </div>

                    <div className="space-y-2 text-right" dir="rtl">
                      <Label htmlFor="password" className="text-right">
                        رمز عبور *
                      </Label>
                      <div className="relative" dir="rtl">
                        <Controller
                          name="password"
                          control={signupForm.control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type={showPassword ? "text" : "password"}
                              placeholder="رمز عبور"
                              disabled={isLoading}
                              className="text-right pr-10"
                              dir="rtl"
                            />
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {signupForm.formState.errors.password && (
                        <p className="text-sm text-red-500 text-right">
                          {signupForm.formState.errors.password.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2 text-right" dir="rtl">
                      <Label htmlFor="confirmPassword" className="text-right">
                        تکرار رمز عبور *
                      </Label>
                      <div className="relative" dir="rtl">
                        <Controller
                          name="confirmPassword"
                          control={signupForm.control}
                          render={({ field }) => (
                            <Input
                              {...field}
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="تکرار رمز عبور"
                              disabled={isLoading}
                              className="text-right pr-10"
                              dir="rtl"
                            />
                          )}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {signupForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-red-500 text-right">
                          {signupForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "در حال ثبت‌نام..." : "ثبت‌نام"}
                    </Button>

                    <div className="text-center pt-2">
                      <p className="text-sm text-muted-foreground">
                        قبلاً حساب کاربری دارید؟{" "}
                        <Button
                          type="button"
                          variant="link"
                          className="p-0 h-auto text-primary"
                          onClick={() => setActiveTab("login")}
                        >
                          وارد شوید
                        </Button>
                      </p>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
