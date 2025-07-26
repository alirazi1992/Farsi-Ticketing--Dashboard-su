"use client"

import { Controller } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, Clock, Zap, Flag } from "lucide-react"

// Available icons mapping
const iconComponents = {
  hardware: "💻",
  software: "🖥️",
  network: "🌐",
  email: "📧",
  security: "🔒",
  access: "🔑",
  training: "📚",
  maintenance: "🔧",
}

interface TicketFormStep1Props {
  control: any
  errors: any
  categories: any
}

export function TicketFormStep1({ control, errors, categories }: TicketFormStep1Props) {
  return (
    <div className="space-y-6">
      {/* Priority Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">اولویت درخواست</CardTitle>
        </CardHeader>
        <CardContent>
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="low" id="low" />
                  <Label htmlFor="low" className="flex items-center gap-2 cursor-pointer">
                    <Flag className="w-4 h-4 text-blue-500" />
                    <span>کم</span>
                    <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      غیرفوری
                    </Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium" className="flex items-center gap-2 cursor-pointer">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span>متوسط</span>
                    <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200">
                      عادی
                    </Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="high" id="high" />
                  <Label htmlFor="high" className="flex items-center gap-2 cursor-pointer">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span>بالا</span>
                    <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">
                      مهم
                    </Badge>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="urgent" id="urgent" />
                  <Label htmlFor="urgent" className="flex items-center gap-2 cursor-pointer">
                    <Zap className="w-4 h-4 text-purple-500" />
                    <span>فوری</span>
                    <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                      اورژانس
                    </Badge>
                  </Label>
                </div>
              </RadioGroup>
            )}
          />
          {errors.priority && <p className="text-sm text-red-500 text-right mt-2">{errors.priority.message}</p>}
        </CardContent>
      </Card>

      {/* Issue Category Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">نوع مشکل</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mainIssue" className="text-right">
              دسته‌بندی اصلی *
            </Label>
            <Controller
              name="mainIssue"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value} dir="rtl">
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder="انتخاب دسته‌بندی مشکل" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(categories).map((category: any) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <span>{iconComponents[category.icon] || "📁"}</span>
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

          <Controller
            name="mainIssue"
            control={control}
            render={({ field: mainIssueField }) => (
              <Controller
                name="subIssue"
                control={control}
                render={({ field: subIssueField }) => (
                  <div className="space-y-2">
                    <Label htmlFor="subIssue" className="text-right">
                      زیر دسته *
                    </Label>
                    <Select
                      onValueChange={subIssueField.onChange}
                      value={subIssueField.value}
                      disabled={!mainIssueField.value}
                      dir="rtl"
                    >
                      <SelectTrigger className="text-right">
                        <SelectValue placeholder="انتخاب زیر دسته" />
                      </SelectTrigger>
                      <SelectContent>
                        {mainIssueField.value &&
                          categories[mainIssueField.value] &&
                          Object.values(categories[mainIssueField.value].subIssues || {}).map((subIssue: any) => (
                            <SelectItem key={subIssue.id} value={subIssue.id}>
                              <div className="text-right">
                                <div className="font-medium">{subIssue.label}</div>
                                {subIssue.description && (
                                  <div className="text-xs text-muted-foreground">{subIssue.description}</div>
                                )}
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    {errors.subIssue && <p className="text-sm text-red-500 text-right">{errors.subIssue.message}</p>}
                  </div>
                )}
              />
            )}
          />

          {/* Category Description */}
          <Controller
            name="mainIssue"
            control={control}
            render={({ field }) => {
              if (!field.value || !categories[field.value]) return null

              return (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-800 text-right">
                    <strong>{categories[field.value].label}:</strong> {categories[field.value].description}
                  </p>
                </div>
              )
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
