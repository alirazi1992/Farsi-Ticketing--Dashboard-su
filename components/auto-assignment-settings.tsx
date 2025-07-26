"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Settings, Zap, Target, Users, AlertTriangle, CheckCircle, Save } from "lucide-react"

interface AutoAssignmentSettingsProps {
  tickets: any[]
  onTicketUpdate: (ticketId: string, updates: any) => void
}

export function AutoAssignmentSettings({ tickets = [], onTicketUpdate }: AutoAssignmentSettingsProps) {
  const [autoAssignEnabled, setAutoAssignEnabled] = useState(true)
  const [assignmentCriteria, setAssignmentCriteria] = useState({
    priorityWeight: [40],
    specialtyWeight: [30],
    workloadWeight: [20],
    ratingWeight: [10],
  })
  const [maxTicketsPerTechnician, setMaxTicketsPerTechnician] = useState(8)
  const [priorityThresholds, setPriorityThresholds] = useState({
    urgent: 5, // minutes
    high: 15,
    medium: 60,
    low: 240,
  })
  const [testDialogOpen, setTestDialogOpen] = useState(false)
  const [testResults, setTestResults] = useState<any[]>([])

  // Mock technicians data
  const technicians = [
    {
      id: "tech-001",
      name: "علی احمدی",
      specialties: ["hardware", "network"],
      currentTickets: 3,
      rating: 4.8,
      status: "available",
    },
    {
      id: "tech-002",
      name: "سارا محمدی",
      specialties: ["software", "email"],
      currentTickets: 5,
      rating: 4.9,
      status: "busy",
    },
    {
      id: "tech-003",
      name: "محمد رضایی",
      specialties: ["security", "access"],
      currentTickets: 2,
      rating: 4.7,
      status: "available",
    },
  ]

  const safeTickets = Array.isArray(tickets) ? tickets : []

  const calculateAssignmentScore = (technician: any, ticket: any) => {
    let score = 0

    // Priority handling capability
    const priorityScore = technician.rating >= 4.5 ? 100 : (technician.rating / 4.5) * 100
    score += (priorityScore * assignmentCriteria.priorityWeight[0]) / 100

    // Specialty match
    const specialtyScore = technician.specialties?.includes(ticket.category) ? 100 : 20
    score += (specialtyScore * assignmentCriteria.specialtyWeight[0]) / 100

    // Workload consideration
    const workloadScore = Math.max(
      0,
      ((maxTicketsPerTechnician - technician.currentTickets) / maxTicketsPerTechnician) * 100,
    )
    score += (workloadScore * assignmentCriteria.workloadWeight[0]) / 100

    // Rating
    const ratingScore = (technician.rating / 5) * 100
    score += (ratingScore * assignmentCriteria.ratingWeight[0]) / 100

    return Math.round(score)
  }

  const getRecommendedTechnician = (ticket: any) => {
    const availableTechnicians = technicians.filter(
      (tech) => tech.status === "available" && tech.currentTickets < maxTicketsPerTechnician,
    )

    if (availableTechnicians.length === 0) return null

    const scoredTechnicians = availableTechnicians.map((tech) => ({
      ...tech,
      score: calculateAssignmentScore(tech, ticket),
    }))

    return scoredTechnicians.sort((a, b) => b.score - a.score)[0]
  }

  const handleSaveSettings = () => {
    toast({
      title: "تنظیمات ذخیره شد",
      description: "تنظیمات تعیین خودکار با موفقیت به‌روزرسانی شد",
    })
  }

  const handleTestAssignment = () => {
    const unassignedTickets = safeTickets.filter((ticket) => !ticket.assignedTo).slice(0, 5)

    const results = unassignedTickets.map((ticket) => {
      const recommendedTech = getRecommendedTechnician(ticket)
      return {
        ticket,
        recommendedTechnician: recommendedTech,
        score: recommendedTech ? calculateAssignmentScore(recommendedTech, ticket) : 0,
      }
    })

    setTestResults(results)
    setTestDialogOpen(true)
  }

  const handleBulkAutoAssign = () => {
    const unassignedTickets = safeTickets.filter((ticket) => !ticket.assignedTo)
    let assignedCount = 0

    unassignedTickets.forEach((ticket) => {
      const recommendedTech = getRecommendedTechnician(ticket)
      if (recommendedTech) {
        onTicketUpdate(ticket.id, {
          assignedTo: recommendedTech.id,
          assignedTechnicianName: recommendedTech.name,
          status: "in-progress",
        })
        assignedCount++
      }
    })

    toast({
      title: "تعیین خودکار انجام شد",
      description: `${assignedCount} تیکت به صورت خودکار واگذار شد`,
    })
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">تنظیمات تعیین خودکار</h2>
          <p className="text-muted-foreground">پیکربندی سیستم تعیین خودکار تکنسین</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleTestAssignment}>
            <Target className="w-4 h-4 ml-2" />
            تست تعیین خودکار
          </Button>
          <Button onClick={handleSaveSettings}>
            <Save className="w-4 h-4 ml-2" />
            ذخیره تنظیمات
          </Button>
        </div>
      </div>

      {/* Main Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              تنظیمات کلی
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">فعال‌سازی تعیین خودکار</Label>
                <p className="text-sm text-muted-foreground">تیکت‌های جدید به صورت خودکار واگذار شوند</p>
              </div>
              <Switch checked={autoAssignEnabled} onCheckedChange={setAutoAssignEnabled} />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>حداکثر تیکت برای هر تکنسین</Label>
              <Select
                value={maxTicketsPerTechnician.toString()}
                onValueChange={(value) => setMaxTicketsPerTechnician(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 تیکت</SelectItem>
                  <SelectItem value="8">8 تیکت</SelectItem>
                  <SelectItem value="10">10 تیکت</SelectItem>
                  <SelectItem value="12">12 تیکت</SelectItem>
                  <SelectItem value="15">15 تیکت</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label>آستانه زمانی اولویت‌ها (دقیقه)</Label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">فوری</Label>
                  <Select
                    value={priorityThresholds.urgent.toString()}
                    onValueChange={(value) => setPriorityThresholds((prev) => ({ ...prev, urgent: Number(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 دقیقه</SelectItem>
                      <SelectItem value="5">5 دقیقه</SelectItem>
                      <SelectItem value="10">10 دقیقه</SelectItem>
                      <SelectItem value="15">15 دقیقه</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm">بالا</Label>
                  <Select
                    value={priorityThresholds.high.toString()}
                    onValueChange={(value) => setPriorityThresholds((prev) => ({ ...prev, high: Number(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 دقیقه</SelectItem>
                      <SelectItem value="30">30 دقیقه</SelectItem>
                      <SelectItem value="60">1 ساعت</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm">متوسط</Label>
                  <Select
                    value={priorityThresholds.medium.toString()}
                    onValueChange={(value) => setPriorityThresholds((prev) => ({ ...prev, medium: Number(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="60">1 ساعت</SelectItem>
                      <SelectItem value="120">2 ساعت</SelectItem>
                      <SelectItem value="240">4 ساعت</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm">پایین</Label>
                  <Select
                    value={priorityThresholds.low.toString()}
                    onValueChange={(value) => setPriorityThresholds((prev) => ({ ...prev, low: Number(value) }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="240">4 ساعت</SelectItem>
                      <SelectItem value="480">8 ساعت</SelectItem>
                      <SelectItem value="1440">24 ساعت</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assignment Criteria */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              معیارهای تعیین
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>اولویت و فوریت</Label>
                  <Badge variant="outline">{assignmentCriteria.priorityWeight[0]}%</Badge>
                </div>
                <Slider
                  value={assignmentCriteria.priorityWeight}
                  onValueChange={(value) => setAssignmentCriteria((prev) => ({ ...prev, priorityWeight: value }))}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>تطبیق تخصص</Label>
                  <Badge variant="outline">{assignmentCriteria.specialtyWeight[0]}%</Badge>
                </div>
                <Slider
                  value={assignmentCriteria.specialtyWeight}
                  onValueChange={(value) => setAssignmentCriteria((prev) => ({ ...prev, specialtyWeight: value }))}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>بار کاری</Label>
                  <Badge variant="outline">{assignmentCriteria.workloadWeight[0]}%</Badge>
                </div>
                <Slider
                  value={assignmentCriteria.workloadWeight}
                  onValueChange={(value) => setAssignmentCriteria((prev) => ({ ...prev, workloadWeight: value }))}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>امتیاز تکنسین</Label>
                  <Badge variant="outline">{assignmentCriteria.ratingWeight[0]}%</Badge>
                </div>
                <Slider
                  value={assignmentCriteria.ratingWeight}
                  onValueChange={(value) => setAssignmentCriteria((prev) => ({ ...prev, ratingWeight: value }))}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>

              <div className="text-sm text-muted-foreground">
                مجموع وزن‌ها:{" "}
                {assignmentCriteria.priorityWeight[0] +
                  assignmentCriteria.specialtyWeight[0] +
                  assignmentCriteria.workloadWeight[0] +
                  assignmentCriteria.ratingWeight[0]}
                %
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            وضعیت فعلی سیستم
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{safeTickets.filter((t) => !t.assignedTo).length}</div>
              <div className="text-sm text-blue-600">تیکت‌های واگذار نشده</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {technicians.filter((t) => t.status === "available").length}
              </div>
              <div className="text-sm text-green-600">تکنسین‌های آزاد</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {technicians.filter((t) => t.status === "busy").length}
              </div>
              <div className="text-sm text-orange-600">تکنسین‌های مشغول</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((technicians.reduce((acc, t) => acc + t.rating, 0) / technicians.length) * 10) / 10}
              </div>
              <div className="text-sm text-purple-600">میانگین امتیاز</div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <Button onClick={handleBulkAutoAssign} className="gap-2" disabled={!autoAssignEnabled}>
              <Zap className="w-4 h-4" />
              اجرای تعیین خودکار برای همه تیکت‌ها
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Results Dialog */}
      <Dialog open={testDialogOpen} onOpenChange={setTestDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              نتایج تست تعیین خودکار
            </DialogTitle>
            <DialogDescription>پیش‌نمایش نحوه عملکرد سیستم تعیین خودکار با تنظیمات فعلی</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {testResults.map((result, index) => (
              <Card key={index} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium mb-2">{result.ticket.title || "عنوان نامشخص"}</h4>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{result.ticket.category || "نامشخص"}</Badge>
                      <Badge variant={result.ticket.priority === "urgent" ? "destructive" : "secondary"}>
                        {result.ticket.priority === "urgent"
                          ? "فوری"
                          : result.ticket.priority === "high"
                            ? "بالا"
                            : result.ticket.priority === "medium"
                              ? "متوسط"
                              : "پایین"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">ارسال‌کننده: {result.ticket.clientName || "نامشخص"}</p>
                  </div>

                  <div className="text-left">
                    {result.recommendedTechnician ? (
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="font-medium">{result.recommendedTechnician.name}</p>
                          <p className="text-sm text-muted-foreground">امتیاز: {result.score}</p>
                          <div className="flex gap-1 mt-1">
                            {result.recommendedTechnician.specialties?.map((spec: string) => (
                              <Badge key={spec} variant="outline" className="text-xs">
                                {spec}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="w-5 h-5" />
                        <span>تکنسین مناسب یافت نشد</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setTestDialogOpen(false)}>
              بستن
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
