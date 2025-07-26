"use client"

import { Label } from "@/components/ui/label"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { Bot, Settings, Users, Clock, AlertCircle, CheckCircle, Zap, Target, BarChart3, Activity } from "lucide-react"

interface EnhancedAutoAssignmentProps {
  tickets: any[]
  technicians: any[]
  onTicketUpdate: (ticketId: string, updates: any) => void
  onSettingsUpdate: (settings: any) => void
}

const defaultSettings = {
  enabled: true,
  assignmentCriteria: {
    prioritizeSpecialty: true,
    considerWorkload: true,
    considerRating: true,
    considerResponseTime: true,
    maxTicketsPerTechnician: 5,
  },
  priorityWeights: {
    urgent: 1.0,
    high: 0.8,
    medium: 0.6,
    low: 0.4,
  },
  autoAssignmentRules: {
    immediateAssignment: true,
    businessHoursOnly: false,
    skipWeekends: false,
  },
}

export function EnhancedAutoAssignment({
  tickets = [],
  technicians = [],
  onTicketUpdate,
  onSettingsUpdate,
}: EnhancedAutoAssignmentProps) {
  const [settings, setSettings] = useState(defaultSettings)
  const [isProcessing, setIsProcessing] = useState(false)
  const [assignmentStats, setAssignmentStats] = useState({
    totalAssigned: 0,
    successRate: 0,
    avgAssignmentTime: 0,
    pendingTickets: 0,
  })

  // Calculate assignment statistics
  useEffect(() => {
    const assignedTickets = tickets.filter((ticket) => ticket?.assignedTo)
    const pendingTickets = tickets.filter((ticket) => !ticket?.assignedTo && ticket?.status === "open")

    setAssignmentStats({
      totalAssigned: assignedTickets.length,
      successRate: tickets.length > 0 ? Math.round((assignedTickets.length / tickets.length) * 100) : 0,
      avgAssignmentTime: 2.3, // Mock data - in real app, calculate from actual assignment times
      pendingTickets: pendingTickets.length,
    })
  }, [tickets])

  // Enhanced assignment algorithm
  const calculateTechnicianScore = (technician: any, ticket: any) => {
    let score = 0

    // Base availability score
    if (technician.status === "available") {
      score += 100
    } else if (
      technician.status === "busy" &&
      technician.activeTickets < settings.assignmentCriteria.maxTicketsPerTechnician
    ) {
      score += 50
    } else {
      return 0 // Technician is not available
    }

    // Specialty match bonus
    if (settings.assignmentCriteria.prioritizeSpecialty && technician.specialties?.includes(ticket.category)) {
      score += 50
    }

    // Rating bonus
    if (settings.assignmentCriteria.considerRating) {
      score += (technician.rating || 0) * 10
    }

    // Workload penalty
    if (settings.assignmentCriteria.considerWorkload) {
      score -= (technician.activeTickets || 0) * 5
    }

    // Response time bonus (lower is better)
    if (settings.assignmentCriteria.considerResponseTime && technician.avgResponseTime) {
      const responseHours = Number.parseFloat(technician.avgResponseTime.split(" ")[0]) || 3
      score += Math.max(0, 20 - responseHours * 2)
    }

    // Priority weight
    const priorityWeight = settings.priorityWeights[ticket.priority] || 0.5
    score *= priorityWeight

    return Math.max(0, score)
  }

  // Find best technician for a ticket
  const findBestTechnician = (ticket: any) => {
    if (!ticket || !technicians.length) return null

    const scoredTechnicians = technicians
      .map((tech) => ({
        ...tech,
        score: calculateTechnicianScore(tech, ticket),
      }))
      .filter((tech) => tech.score > 0)
      .sort((a, b) => b.score - a.score)

    return scoredTechnicians.length > 0 ? scoredTechnicians[0] : null
  }

  // Auto-assign single ticket
  const autoAssignTicket = async (ticket: any) => {
    if (!settings.enabled) return false

    const bestTechnician = findBestTechnician(ticket)

    if (bestTechnician) {
      onTicketUpdate(ticket.id, {
        assignedTo: bestTechnician.id,
        assignedTechnicianName: bestTechnician.name,
        status: "in-progress",
        assignedAt: new Date().toISOString(),
        assignmentMethod: "auto",
      })

      toast({
        title: "تیکت به صورت خودکار تعیین شد",
        description: `تیکت ${ticket.id} به ${bestTechnician.name} واگذار شد`,
      })

      return true
    }

    return false
  }

  // Bulk auto-assignment
  const handleBulkAutoAssignment = async () => {
    if (!settings.enabled) {
      toast({
        title: "تعیین خودکار غیرفعال است",
        description: "لطفاً ابتدا تعیین خودکار را فعال کنید",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    const unassignedTickets = tickets.filter((ticket) => !ticket?.assignedTo && ticket?.status === "open")

    if (unassignedTickets.length === 0) {
      toast({
        title: "تیکت بدون تعیین وجود ندارد",
        description: "همه تیکت‌ها قبلاً تعیین شده‌اند",
      })
      setIsProcessing(false)
      return
    }

    let assignedCount = 0

    for (const ticket of unassignedTickets) {
      const success = await autoAssignTicket(ticket)
      if (success) assignedCount++

      // Add small delay to prevent overwhelming the system
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    setIsProcessing(false)

    toast({
      title: "تعیین خودکار انجام شد",
      description: `${assignedCount} از ${unassignedTickets.length} تیکت با موفقیت تعیین شد`,
    })
  }

  // Update settings
  const updateSettings = (newSettings: any) => {
    setSettings(newSettings)
    onSettingsUpdate(newSettings)
  }

  // Get technician workload distribution
  const getWorkloadDistribution = () => {
    return technicians.map((tech) => ({
      name: tech.name || "نامشخص",
      activeTickets: tech.activeTickets || 0,
      maxCapacity: settings.assignmentCriteria.maxTicketsPerTechnician,
      utilization: Math.round(((tech.activeTickets || 0) / settings.assignmentCriteria.maxTicketsPerTechnician) * 100),
      status: tech.status || "unknown",
    }))
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Main Control Panel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <CardTitle>تعیین خودکار پیشرفته</CardTitle>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings.enabled}
                  onCheckedChange={(enabled) => updateSettings({ ...settings, enabled })}
                />
                <Label>{settings.enabled ? "فعال" : "غیرفعال"}</Label>
              </div>
              <Button onClick={handleBulkAutoAssignment} disabled={!settings.enabled || isProcessing} className="gap-2">
                {isProcessing ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" />
                    در حال پردازش...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    تعیین خودکار همه
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">تعیین شده</span>
              </div>
              <div className="text-2xl font-bold text-blue-600">{assignmentStats.totalAssigned}</div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900">نرخ موفقیت</span>
              </div>
              <div className="text-2xl font-bold text-green-600">{assignmentStats.successRate}%</div>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-orange-600" />
                <span className="font-medium text-orange-900">میانگین زمان</span>
              </div>
              <div className="text-2xl font-bold text-orange-600">{assignmentStats.avgAssignmentTime}s</div>
            </div>

            <div className="bg-red-50 p-4 rounded-lg text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-900">در انتظار</span>
              </div>
              <div className="text-2xl font-bold text-red-600">{assignmentStats.pendingTickets}</div>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Assignment Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <Settings className="w-4 h-4" />
                معیارهای تعیین
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>اولویت تخصص</Label>
                  <Switch
                    checked={settings.assignmentCriteria.prioritizeSpecialty}
                    onCheckedChange={(checked) =>
                      updateSettings({
                        ...settings,
                        assignmentCriteria: { ...settings.assignmentCriteria, prioritizeSpecialty: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>در نظر گیری بار کاری</Label>
                  <Switch
                    checked={settings.assignmentCriteria.considerWorkload}
                    onCheckedChange={(checked) =>
                      updateSettings({
                        ...settings,
                        assignmentCriteria: { ...settings.assignmentCriteria, considerWorkload: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>در نظر گیری امتیاز</Label>
                  <Switch
                    checked={settings.assignmentCriteria.considerRating}
                    onCheckedChange={(checked) =>
                      updateSettings({
                        ...settings,
                        assignmentCriteria: { ...settings.assignmentCriteria, considerRating: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>در نظر گیری زمان پاسخ</Label>
                  <Switch
                    checked={settings.assignmentCriteria.considerResponseTime}
                    onCheckedChange={(checked) =>
                      updateSettings({
                        ...settings,
                        assignmentCriteria: { ...settings.assignmentCriteria, considerResponseTime: checked },
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>حداکثر تیکت به ازای هر تکنسین</Label>
                  <Select
                    value={settings.assignmentCriteria.maxTicketsPerTechnician.toString()}
                    onValueChange={(value) =>
                      updateSettings({
                        ...settings,
                        assignmentCriteria: {
                          ...settings.assignmentCriteria,
                          maxTicketsPerTechnician: Number.parseInt(value),
                        },
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 تیکت</SelectItem>
                      <SelectItem value="5">5 تیکت</SelectItem>
                      <SelectItem value="7">7 تیکت</SelectItem>
                      <SelectItem value="10">10 تیکت</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                وزن اولویت‌ها
              </h3>

              <div className="space-y-3">
                {Object.entries(settings.priorityWeights).map(([priority, weight]) => (
                  <div key={priority} className="flex items-center justify-between">
                    <Label>
                      {priority === "urgent"
                        ? "فوری"
                        : priority === "high"
                          ? "بالا"
                          : priority === "medium"
                            ? "متوسط"
                            : "کم"}
                    </Label>
                    <Select
                      value={weight.toString()}
                      onValueChange={(value) =>
                        updateSettings({
                          ...settings,
                          priorityWeights: { ...settings.priorityWeights, [priority]: Number.parseFloat(value) },
                        })
                      }
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1.0">1.0</SelectItem>
                        <SelectItem value="0.8">0.8</SelectItem>
                        <SelectItem value="0.6">0.6</SelectItem>
                        <SelectItem value="0.4">0.4</SelectItem>
                        <SelectItem value="0.2">0.2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technician Workload Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            توزیع بار کاری تکنسین‌ها
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {getWorkloadDistribution().map((tech, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium">{tech.name}</div>
                  <Badge variant={tech.status === "available" ? "default" : "secondary"}>
                    {tech.status === "available" ? "آزاد" : "مشغول"}
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-muted-foreground">
                    {tech.activeTickets} / {tech.maxCapacity} تیکت
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        tech.utilization > 80 ? "bg-red-500" : tech.utilization > 60 ? "bg-yellow-500" : "bg-green-500"
                      }`}
                      style={{ width: `${Math.min(tech.utilization, 100)}%` }}
                    />
                  </div>
                  <div className="text-sm font-medium w-12 text-left">{tech.utilization}%</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Assignment Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            قوانین تعیین خودکار
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">تعیین فوری</Label>
                <p className="text-sm text-muted-foreground">تیکت‌ها بلافاصله پس از ایجاد تعیین شوند</p>
              </div>
              <Switch
                checked={settings.autoAssignmentRules.immediateAssignment}
                onCheckedChange={(checked) =>
                  updateSettings({
                    ...settings,
                    autoAssignmentRules: { ...settings.autoAssignmentRules, immediateAssignment: checked },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">فقط در ساعات کاری</Label>
                <p className="text-sm text-muted-foreground">تعیین خودکار فقط در ساعات اداری انجام شود</p>
              </div>
              <Switch
                checked={settings.autoAssignmentRules.businessHoursOnly}
                onCheckedChange={(checked) =>
                  updateSettings({
                    ...settings,
                    autoAssignmentRules: { ...settings.autoAssignmentRules, businessHoursOnly: checked },
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="font-medium">عدم تعیین در آخر هفته</Label>
                <p className="text-sm text-muted-foreground">تیکت‌ها در روزهای تعطیل تعیین نشوند</p>
              </div>
              <Switch
                checked={settings.autoAssignmentRules.skipWeekends}
                onCheckedChange={(checked) =>
                  updateSettings({
                    ...settings,
                    autoAssignmentRules: { ...settings.autoAssignmentRules, skipWeekends: checked },
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
