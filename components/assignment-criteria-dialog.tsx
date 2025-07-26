"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Settings, Plus, Trash2 } from "lucide-react"

interface AssignmentCriteriaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  technicians: any[]
}

export function AssignmentCriteriaDialog({ open, onOpenChange, technicians = [] }: AssignmentCriteriaDialogProps) {
  const [autoAssignEnabled, setAutoAssignEnabled] = useState(true)
  const [workingHours, setWorkingHours] = useState({ start: "08:00", end: "17:00" })
  const [maxTicketsPerTechnician, setMaxTicketsPerTechnician] = useState(10)
  const [priorityWeights, setPriorityWeights] = useState({
    urgent: 4,
    high: 3,
    medium: 2,
    low: 1,
  })
  const [assignmentRules, setAssignmentRules] = useState([
    {
      id: "rule-1",
      name: "واگذاری بر اساس تخصص",
      condition: "category_match",
      action: "assign_specialist",
      enabled: true,
    },
    {
      id: "rule-2",
      name: "توزیع متعادل بار کاری",
      condition: "workload_balance",
      action: "assign_least_busy",
      enabled: true,
    },
    {
      id: "rule-3",
      name: "اولویت‌بندی فوری",
      condition: "priority_urgent",
      action: "assign_immediately",
      enabled: true,
    },
  ])

  const handleSaveSettings = () => {
    // Here you would typically save the settings to your backend
    toast({
      title: "تنظیمات ذخیره شد",
      description: "تنظیمات واگذاری خودکار با موفقیت ذخیره شد",
    })
    onOpenChange(false)
  }

  const handleAddRule = () => {
    const newRule = {
      id: `rule-${Date.now()}`,
      name: "قانون جدید",
      condition: "custom",
      action: "assign_available",
      enabled: true,
    }
    setAssignmentRules([...assignmentRules, newRule])
  }

  const handleDeleteRule = (ruleId: string) => {
    setAssignmentRules(assignmentRules.filter((rule) => rule.id !== ruleId))
  }

  const handleToggleRule = (ruleId: string) => {
    setAssignmentRules(assignmentRules.map((rule) => (rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule)))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-right">
            <Settings className="w-5 h-5" />
            تنظیمات واگذاری خودکار
          </DialogTitle>
          <DialogDescription className="text-right">
            قوانین و معیارهای واگذاری خودکار تیکت‌ها را تنظیم کنید
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">تنظیمات کلی</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base">واگذاری خودکار</Label>
                  <p className="text-sm text-muted-foreground">
                    فعال‌سازی واگذاری خودکار تیکت‌ها بر اساس قوانین تعریف شده
                  </p>
                </div>
                <Switch checked={autoAssignEnabled} onCheckedChange={setAutoAssignEnabled} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-time">ساعت شروع کار</Label>
                  <Input
                    id="start-time"
                    type="time"
                    value={workingHours.start}
                    onChange={(e) => setWorkingHours({ ...workingHours, start: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time">ساعت پایان کار</Label>
                  <Input
                    id="end-time"
                    type="time"
                    value={workingHours.end}
                    onChange={(e) => setWorkingHours({ ...workingHours, end: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-tickets">حداکثر تیکت به ازای هر تکنسین</Label>
                <Input
                  id="max-tickets"
                  type="number"
                  min="1"
                  max="50"
                  value={maxTicketsPerTechnician}
                  onChange={(e) => setMaxTicketsPerTechnician(Number.parseInt(e.target.value))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Priority Weights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">وزن اولویت‌ها</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="urgent-weight">فوری</Label>
                  <Input
                    id="urgent-weight"
                    type="number"
                    min="1"
                    max="10"
                    value={priorityWeights.urgent}
                    onChange={(e) =>
                      setPriorityWeights({ ...priorityWeights, urgent: Number.parseInt(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="high-weight">بالا</Label>
                  <Input
                    id="high-weight"
                    type="number"
                    min="1"
                    max="10"
                    value={priorityWeights.high}
                    onChange={(e) => setPriorityWeights({ ...priorityWeights, high: Number.parseInt(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medium-weight">متوسط</Label>
                  <Input
                    id="medium-weight"
                    type="number"
                    min="1"
                    max="10"
                    value={priorityWeights.medium}
                    onChange={(e) =>
                      setPriorityWeights({ ...priorityWeights, medium: Number.parseInt(e.target.value) })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="low-weight">پایین</Label>
                  <Input
                    id="low-weight"
                    type="number"
                    min="1"
                    max="10"
                    value={priorityWeights.low}
                    onChange={(e) => setPriorityWeights({ ...priorityWeights, low: Number.parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assignment Rules */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">قوانین واگذاری</CardTitle>
                <Button onClick={handleAddRule} size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  افزودن قانون
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignmentRules.map((rule) => (
                  <Card key={rule.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Switch checked={rule.enabled} onCheckedChange={() => handleToggleRule(rule.id)} />
                        <div>
                          <h4 className="font-medium">{rule.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {rule.condition === "category_match"
                                ? "تطبیق دسته‌بندی"
                                : rule.condition === "workload_balance"
                                  ? "توازن بار کاری"
                                  : rule.condition === "priority_urgent"
                                    ? "اولویت فوری"
                                    : "سفارشی"}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {rule.action === "assign_specialist"
                                ? "واگذاری به متخصص"
                                : rule.action === "assign_least_busy"
                                  ? "واگذاری به کم‌کارترین"
                                  : rule.action === "assign_immediately"
                                    ? "واگذاری فوری"
                                    : "واگذاری به دردسترس"}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteRule(rule.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Technician Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">وضعیت تکنسین‌ها</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {technicians.map((technician) => (
                  <div key={technician.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{technician.name || "نام نامشخص"}</h4>
                      <p className="text-sm text-muted-foreground">
                        {technician.currentTickets || 0}/{technician.maxTickets || 0} تیکت فعال
                      </p>
                    </div>
                    <Badge variant={technician.status === "available" ? "default" : "secondary"}>
                      {technician.status === "available" ? "آزاد" : "مشغول"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            انصراف
          </Button>
          <Button onClick={handleSaveSettings}>ذخیره تنظیمات</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
