"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { Settings, Zap, Brain, Target, Users, BarChart3 } from "lucide-react"

interface AutoAssignmentSettingsProps {
  categories: any[]
  technicians: any[]
}

export function AutoAssignmentSettings({ categories = [], technicians = [] }: AutoAssignmentSettingsProps) {
  const [autoAssignmentEnabled, setAutoAssignmentEnabled] = useState(true)
  const [aiAssignmentEnabled, setAiAssignmentEnabled] = useState(false)
  const [workloadBalancing, setWorkloadBalancing] = useState(true)
  const [priorityWeighting, setPriorityWeighting] = useState([70])
  const [skillMatchWeighting, setSkillMatchWeighting] = useState([80])
  const [workloadWeighting, setWorkloadWeighting] = useState([60])
  const [maxTicketsPerTechnician, setMaxTicketsPerTechnician] = useState(5)
  const [assignmentDelay, setAssignmentDelay] = useState(0)

  // Safe array access
  const safeCategories = Array.isArray(categories) ? categories : []
  const safeTechnicians = Array.isArray(technicians) ? technicians : []

  const handleSaveSettings = () => {
    const settings = {
      autoAssignmentEnabled,
      aiAssignmentEnabled,
      workloadBalancing,
      priorityWeighting: priorityWeighting[0],
      skillMatchWeighting: skillMatchWeighting[0],
      workloadWeighting: workloadWeighting[0],
      maxTicketsPerTechnician,
      assignmentDelay,
    }

    // Here you would typically save to backend
    console.log("Saving auto-assignment settings:", settings)

    toast({
      title: "تنظیمات ذخیره شد",
      description: "تنظیمات تخصیص خودکار با موفقیت ذخیره شد",
    })
  }

  const handleTestAssignment = () => {
    toast({
      title: "تست تخصیص خودکار",
      description: "سیستم تخصیص خودکار در حال تست است...",
    })

    // Simulate test
    setTimeout(() => {
      toast({
        title: "تست موفق",
        description: "سیستم تخصیص خودکار به درستی کار می‌کند",
      })
    }, 2000)
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Main Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <Settings className="w-5 h-5" />
            تنظیمات کلی تخصیص خودکار
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">فعال‌سازی تخصیص خودکار</Label>
              <p className="text-sm text-muted-foreground">تیکت‌های جدید به صورت خودکار به تکنسین‌ها تخصیص یابند</p>
            </div>
            <Switch checked={autoAssignmentEnabled} onCheckedChange={setAutoAssignmentEnabled} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium flex items-center gap-2">
                <Brain className="w-4 h-4" />
                تخصیص هوشمند با AI
              </Label>
              <p className="text-sm text-muted-foreground">استفاده از هوش مصنوعی برای تخصیص بهتر تیکت‌ها</p>
            </div>
            <Switch checked={aiAssignmentEnabled} onCheckedChange={setAiAssignmentEnabled} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-base font-medium">تعادل بار کاری</Label>
              <p className="text-sm text-muted-foreground">توزیع متعادل تیکت‌ها بین تکنسین‌ها</p>
            </div>
            <Switch checked={workloadBalancing} onCheckedChange={setWorkloadBalancing} />
          </div>
        </CardContent>
      </Card>

      {/* Assignment Criteria */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <Target className="w-5 h-5" />
            معیارهای تخصیص
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">وزن اولویت تیکت</Label>
              <Badge variant="outline">{priorityWeighting[0]}%</Badge>
            </div>
            <Slider
              value={priorityWeighting}
              onValueChange={setPriorityWeighting}
              max={100}
              step={5}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">میزان تأثیر اولویت تیکت در انتخاب تکنسین</p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">وزن تطبیق مهارت</Label>
              <Badge variant="outline">{skillMatchWeighting[0]}%</Badge>
            </div>
            <Slider
              value={skillMatchWeighting}
              onValueChange={setSkillMatchWeighting}
              max={100}
              step={5}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">میزان تأثیر تطبیق مهارت‌های تکنسین با نوع تیکت</p>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">وزن بار کاری</Label>
              <Badge variant="outline">{workloadWeighting[0]}%</Badge>
            </div>
            <Slider
              value={workloadWeighting}
              onValueChange={setWorkloadWeighting}
              max={100}
              step={5}
              className="w-full"
            />
            <p className="text-sm text-muted-foreground">میزان تأثیر بار کاری فعلی تکنسین در تخصیص</p>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <Zap className="w-5 h-5" />
            تنظیمات پیشرفته
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="max-tickets">حداکثر تیکت به ازای هر تکنسین</Label>
              <Input
                id="max-tickets"
                type="number"
                value={maxTicketsPerTechnician}
                onChange={(e) => setMaxTicketsPerTechnician(Number.parseInt(e.target.value) || 0)}
                min={1}
                max={20}
              />
              <p className="text-sm text-muted-foreground">حداکثر تعداد تیکت‌هایی که می‌تواند به یک تکنسین تخصیص یابد</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignment-delay">تأخیر تخصیص (دقیقه)</Label>
              <Select
                value={assignmentDelay.toString()}
                onValueChange={(value) => setAssignmentDelay(Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">فوری</SelectItem>
                  <SelectItem value="5">5 دقیقه</SelectItem>
                  <SelectItem value="15">15 دقیقه</SelectItem>
                  <SelectItem value="30">30 دقیقه</SelectItem>
                  <SelectItem value="60">1 ساعت</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground">زمان انتظار قبل از تخصیص خودکار تیکت</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            آمار تخصیص خودکار
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-green-600">85%</div>
              <div className="text-sm text-muted-foreground">نرخ موفقیت تخصیص</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-blue-600">2.3</div>
              <div className="text-sm text-muted-foreground">میانگین زمان تخصیص (دقیقه)</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {safeTechnicians.filter((t) => t.isActive).length}
              </div>
              <div className="text-sm text-muted-foreground">تکنسین‌های فعال</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category-Technician Mapping */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <Users className="w-5 h-5" />
            نقشه‌برداری دسته‌بندی - تکنسین
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {safeCategories.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">هیچ دسته‌بندی تعریف نشده است</p>
            ) : (
              safeCategories.map((category) => (
                <div key={category.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold">{category.name || "نام نامشخص"}</h3>
                    <Badge variant="outline">
                      {safeTechnicians.filter((t) => t.specialties && t.specialties.includes(category.id)).length}{" "}
                      تکنسین
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {safeTechnicians
                      .filter((t) => t.specialties && t.specialties.includes(category.id) && t.isActive)
                      .map((technician) => (
                        <Badge key={technician.id} variant="secondary">
                          {technician.name || "نامشخص"}
                        </Badge>
                      ))}
                    {safeTechnicians.filter((t) => t.specialties && t.specialties.includes(category.id) && t.isActive)
                      .length === 0 && (
                      <span className="text-sm text-muted-foreground">
                        هیچ تکنسین فعالی برای این دسته‌بندی وجود ندارد
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button onClick={handleSaveSettings} className="flex-1">
          <Settings className="w-4 h-4 mr-2" />
          ذخیره تنظیمات
        </Button>
        <Button variant="outline" onClick={handleTestAssignment} className="flex-1 bg-transparent">
          <Zap className="w-4 h-4 mr-2" />
          تست سیستم تخصیص
        </Button>
      </div>
    </div>
  )
}
