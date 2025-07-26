"use client"

import { useState, useEffect } from "react"
import { Controller } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, FolderOpen } from "lucide-react"

interface TicketFormStep1Props {
  control: any
  errors: any
  categoriesData: any
}

export function TicketFormStep1({ control, errors, categoriesData }: TicketFormStep1Props) {
  const [selectedMainIssue, setSelectedMainIssue] = useState("")
  const [availableSubIssues, setAvailableSubIssues] = useState<Record<string, any>>({})

  // 🔄 SYNC: Update sub-issues when main issue changes - uses synced categoriesData
  useEffect(() => {
    if (selectedMainIssue && categoriesData[selectedMainIssue]) {
      setAvailableSubIssues(categoriesData[selectedMainIssue].subIssues || {})
    } else {
      setAvailableSubIssues({})
    }
  }, [selectedMainIssue, categoriesData])

  return (
    <div className="space-y-6" dir="rtl">
      {/* Priority Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right">
            <AlertTriangle className="w-5 h-5" />
            اولویت مشکل
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="priority" className="text-right">
              میزان فوریت مشکل شما چقدر است؟ *
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
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>کم - می‌توانم صبر کنم</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="medium">
                      <div className="flex items-center gap-2 text-right">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                        <span>متوسط - در چند روز آینده</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="high">
                      <div className="flex items-center gap-2 text-right">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>بالا - امروز یا فردا</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="urgent">
                      <div className="flex items-center gap-2 text-right">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span>فوری - الان نیاز دارم</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.priority && <p className="text-sm text-red-500 text-right">{errors.priority.message}</p>}
          </div>
        </CardContent>
      </Card>

      {/* Issue Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right">
            <FolderOpen className="w-5 h-5" />
            انتخاب نوع مشکل
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Issue Selection */}
          <div className="space-y-2">
            <Label htmlFor="mainIssue" className="text-right">
              مشکل شما در کدام دسته قرار می‌گیرد؟ *
            </Label>
            <Controller
              name="mainIssue"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    field.onChange(value)
                    setSelectedMainIssue(value)
                  }}
                  value={field.value}
                  dir="rtl"
                >
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="انتخاب دسته اصلی مشکل" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* 🔄 SYNC: Uses synced categoriesData from Admin */}
                    {Object.entries(categoriesData).map(([key, category]: [string, any]) => (
                      <SelectItem key={key} value={key}>
                        <div className="flex items-center gap-2 text-right">
                          <span className="text-lg">{category.icon || "📁"}</span>
                          <span>{category.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.mainIssue && <p className="text-sm text-red-500 text-right">{errors.mainIssue.message}</p>}
          </div>

          {/* Sub Issue Selection */}
          {selectedMainIssue && Object.keys(availableSubIssues).length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="subIssue" className="text-right">
                مشکل دقیق شما چیست؟ *
              </Label>
              <Controller
                name="subIssue"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                    <SelectTrigger className="text-right">
                      <SelectValue placeholder="انتخاب مشکل دقیق" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* 🔄 SYNC: Uses synced subcategories from Admin */}
                      {Object.entries(availableSubIssues).map(([key, subIssue]: [string, any]) => (
                        <SelectItem key={key} value={key}>
                          <span className="text-right">{subIssue.label || subIssue}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.subIssue && <p className="text-sm text-red-500 text-right">{errors.subIssue.message}</p>}
            </div>
          )}

          {/* Help Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800 text-right">
              <strong>راهنما:</strong> ابتدا دسته اصلی مشکل خود را انتخاب کنید، سپس از فهرست دوم مشکل دقیق خود را مشخص
              کنید. این کار به ما کمک می‌کند تا بهترین راه‌حل را برای شما پیدا کنیم.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
