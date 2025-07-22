"use client"

import { Controller } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Phone, Mail, CreditCard, AlertTriangle, FolderOpen } from "lucide-react"

interface TicketFormStep1Props {
  control: any
  errors: any
}

export function TicketFormStep1({ control, errors }: TicketFormStep1Props) {
  return (
    <div className="space-y-6" dir="rtl">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right">
            <User className="w-5 h-5" />
            اطلاعات شخصی
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientName" className="text-right">
                نام و نام خانوادگی *
              </Label>
              <Controller
                name="clientName"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="نام کامل خود را وارد کنید" className="text-right" dir="rtl" />
                )}
              />
              {errors.clientName && <p className="text-sm text-red-500 text-right">{errors.clientName.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationalCode" className="text-right">
                کد ملی *
              </Label>
              <Controller
                name="nationalCode"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="کد ملی ۱۰ رقمی" maxLength={10} className="text-right" dir="rtl" />
                )}
              />
              {errors.nationalCode && <p className="text-sm text-red-500 text-right">{errors.nationalCode.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="clientPhone" className="text-right">
                شماره تماس *
              </Label>
              <Controller
                name="clientPhone"
                control={control}
                render={({ field }) => <Input {...field} placeholder="09xxxxxxxxx" className="text-right" dir="rtl" />}
              />
              {errors.clientPhone && <p className="text-sm text-red-500 text-right">{errors.clientPhone.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientEmail" className="text-right">
                ایمیل *
              </Label>
              <Controller
                name="clientEmail"
                control={control}
                render={({ field }) => (
                  <Input {...field} type="email" placeholder="example@domain.com" className="text-right" dir="rtl" />
                )}
              />
              {errors.clientEmail && <p className="text-sm text-red-500 text-right">{errors.clientEmail.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clientAddress" className="text-right">
              آدرس *
            </Label>
            <Controller
              name="clientAddress"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  placeholder="آدرس کامل محل کار یا سکونت"
                  rows={3}
                  className="text-right"
                  dir="rtl"
                />
              )}
            />
            {errors.clientAddress && <p className="text-sm text-red-500 text-right">{errors.clientAddress.message}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Ticket Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right">
            <FolderOpen className="w-5 h-5" />
            اطلاعات تیکت
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-right">
                اولویت مشکل *
              </Label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                    <SelectTrigger className="text-right">
                      <SelectValue placeholder="انتخاب اولویت" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">
                        <div className="flex items-center gap-2 text-right">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          کم - غیرفوری
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center gap-2 text-right">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          متوسط - نیاز به بررسی
                        </div>
                      </SelectItem>
                      <SelectItem value="high">
                        <div className="flex items-center gap-2 text-right">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          بالا - مهم
                        </div>
                      </SelectItem>
                      <SelectItem value="urgent">
                        <div className="flex items-center gap-2 text-right">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          فوری - بحرانی
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.priority && <p className="text-sm text-red-500 text-right">{errors.priority.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-right">
                دسته‌بندی مشکل *
              </Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                    <SelectTrigger className="text-right">
                      <SelectValue placeholder="انتخاب دسته‌بندی" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hardware">
                        <div className="flex items-center gap-2 text-right">
                          <CreditCard className="w-4 h-4" />
                          سخت‌افزار - مشکلات فیزیکی دستگاه
                        </div>
                      </SelectItem>
                      <SelectItem value="software">
                        <div className="flex items-center gap-2 text-right">
                          <FolderOpen className="w-4 h-4" />
                          نرم‌افزار - برنامه‌ها و سیستم عامل
                        </div>
                      </SelectItem>
                      <SelectItem value="network">
                        <div className="flex items-center gap-2 text-right">
                          <Phone className="w-4 h-4" />
                          شبکه - اتصال اینترنت و شبکه
                        </div>
                      </SelectItem>
                      <SelectItem value="email">
                        <div className="flex items-center gap-2 text-right">
                          <Mail className="w-4 h-4" />
                          ایمیل - مشکلات پست الکترونیک
                        </div>
                      </SelectItem>
                      <SelectItem value="security">
                        <div className="flex items-center gap-2 text-right">
                          <AlertTriangle className="w-4 h-4" />
                          امنیت - حوادث امنیتی
                        </div>
                      </SelectItem>
                      <SelectItem value="access">
                        <div className="flex items-center gap-2 text-right">
                          <User className="w-4 h-4" />
                          دسترسی - درخواست مجوزها
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && <p className="text-sm text-red-500 text-right">{errors.category.message}</p>}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 text-right">
              <strong>راهنما:</strong> انتخاب دقیق دسته‌بندی و اولویت به ما کمک می‌کند تا مشکل شما را سریع‌تر حل کنیم. در
              مرحله بعد، سوالات تخصصی مربوط به دسته‌بندی انتخابی نمایش داده خواهد شد.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
