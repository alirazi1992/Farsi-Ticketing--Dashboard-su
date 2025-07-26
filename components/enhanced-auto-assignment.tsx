"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { Bot, Settings, Clock, AlertTriangle, CheckCircle, Activity, BarChart3, Zap, Target } from "lucide-react"

const categoryLabels = {
  hardware: "سخت‌افزار",
  software: "نرم‌افزار",
  network: "شبکه",
  email: "ایمیل",
  security: "امنیت",
  access: "دسترسی",
}

const priorityLabels = {
  low: "کم",
  medium: "متوسط",
  high: "بالا",
  urgent: "فوری",
}

interface EnhancedAutoAssignmentProps {
  tickets?: any[]
  technicians?: any[]
  onTicketUpdate?: (ticketId: string, updates: any) => void
}

export function EnhancedAutoAssignment({
  tickets = [],
  technicians = [],
  onTicketUpdate = () => {},
}: EnhancedAutoAssignmentProps) {
  const [autoAssignEnabled, setAutoAssignEnabled] = useState(true)
  const [assignmentStrategy, setAssignmentStrategy] = useState("balanced")
  const [priorityWeighting, setPriorityWeighting] = useState("medium")
  const [workloadThreshold, setWorkloadThreshold] = useState("5")
  const [specialtyMatching, setSpecialtyMatching] = useState(true)
  const [stats, setStats] = useState({
    totalAssignments: 0,
    successfulAssignments: 0,
    averageAssignmentTime: 0,
    technicianUtilization: 0,
  })

  // Calculate assignment statistics
  useEffect(() => {
    if (!tickets || tickets.length === 0) return

    const assignedTickets = tickets.filter((ticket) => ticket.assignedTo)
    const totalAssignments = assignedTickets.length
    const successfulAssignments = assignedTickets.filter(
      (ticket) => ticket.status === "resolved" || ticket.status === "closed",
    ).length

    // Calculate average assignment time (mock calculation)
    const averageAssignmentTime = 2.3 // hours

    // Calculate technician utilization
    const totalCapacity = technicians.length * 5 // assuming 5 tickets per technician max
    const currentLoad = technicians.reduce((sum, tech) => sum + (tech.activeTickets || 0), 0)
    const technicianUtilization = totalCapacity > 0 ? (currentLoad / totalCapacity) * 100 : 0

    setStats({
      totalAssignments,
      successfulAssignments,
      averageAssignmentTime,
      technicianUtilization,
    })
  }, [tickets, technicians])

  // Auto-assignment algorithm
  const getOptimalTechnician = (ticket: any) => {
    if (!technicians || technicians.length === 0) return null

    let availableTechnicians = technicians.filter(
      (tech) => tech.status === "available" && (tech.activeTickets || 0) < Number.parseInt(workloadThreshold),
    )

    if (availableTechnicians.length === 0) {
      // If no available technicians, consider all technicians
      availableTechnicians = technicians
    }

    // Apply specialty matching if enabled
    if (specialtyMatching && ticket.category) {
      const specialtyMatches = availableTechnicians.filter(
        (tech) => tech.specialties && tech.specialties.includes(ticket.category),
      )
      if (specialtyMatches.length > 0) {
        availableTechnicians = specialtyMatches
      }
    }

    // Apply assignment strategy
    switch (assignmentStrategy) {
      case "balanced":
        return availableTechnicians.sort((a, b) => {
          // Balance workload, rating, and response time
          const aScore =
            (a.activeTickets || 0) * 0.4 +
            (5 - (a.rating || 4)) * 0.3 +
            Number.parseFloat(a.avgResponseTime || "2") * 0.3
          const bScore =
            (b.activeTickets || 0) * 0.4 +
            (5 - (b.rating || 4)) * 0.3 +
            Number.parseFloat(b.avgResponseTime || "2") * 0.3
          return aScore - bScore
        })[0]

      case "performance":
        return availableTechnicians.sort((a, b) => {
          if ((b.rating || 4) !== (a.rating || 4)) {
            return (b.rating || 4) - (a.rating || 4)
          }
          return (a.activeTickets || 0) - (b.activeTickets || 0)
        })[0]

      case "workload":
        return availableTechnicians.sort((a, b) => (a.activeTickets || 0) - (b.activeTickets || 0))[0]

      case "round-robin":
        // Simple round-robin based on last assignment (mock implementation)
        return availableTechnicians[Math.floor(Math.random() * availableTechnicians.length)]

      default:
        return availableTechnicians[0]
    }
  }

  // Handle automatic assignment for unassigned tickets
  const handleAutoAssignUnassigned = () => {
    if (!tickets || tickets.length === 0) return

    const unassignedTickets = tickets.filter((ticket) => !ticket.assignedTo)
    let assignedCount = 0

    unassignedTickets.forEach((ticket) => {
      const optimalTechnician = getOptimalTechnician(ticket)
      if (optimalTechnician) {
        onTicketUpdate(ticket.id, {
          assignedTo: optimalTechnician.id,
          assignedTechnicianName: optimalTechnician.name,
          status: ticket.status === "open" ? "in-progress" : ticket.status,
        })
        assignedCount++
      }
    })

    toast({
      title: "تعیین خودکار تکنسین",
      description: `${assignedCount} تیکت به صورت خودکار تعیین شد`,
    })
  }

  // Handle rebalancing workload
  const handleRebalanceWorkload = () => {
    if (!tickets || tickets.length === 0 || !technicians || technicians.length === 0) return

    const activeTickets = tickets.filter(
      (ticket) => ticket.assignedTo && (ticket.status === "open" || ticket.status === "in-progress"),
    )

    // Find overloaded technicians
    const overloadedTechnicians = technicians.filter(
      (tech) => (tech.activeTickets || 0) > Number.parseInt(workloadThreshold),
    )

    let rebalancedCount = 0

    overloadedTechnicians.forEach((overloadedTech) => {
      const techTickets = activeTickets.filter((ticket) => ticket.assignedTo === overloadedTech.id)
      const excessTickets = techTickets.slice(Number.parseInt(workloadThreshold))

      excessTickets.forEach((ticket) => {
        const newTechnician = getOptimalTechnician(ticket)
        if (newTechnician && newTechnician.id !== overloadedTech.id) {
          onTicketUpdate(ticket.id, {
            assignedTo: newTechnician.id,
            assignedTechnicianName: newTechnician.name,
          })
          rebalancedCount++
        }
      })
    })

    toast({
      title: "تعادل بار کاری",
      description: `${rebalancedCount} تیکت مجدداً تعیین شد`,
    })
  }

  return (
    <div className="space-y-6" dir="rtl">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-right">
            <Bot className="w-5 h-5" />
            تعیین خودکار تکنسین پیشرفته
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Switch checked={autoAssignEnabled} onCheckedChange={setAutoAssignEnabled} id="auto-assign" />
              <label htmlFor="auto-assign" className="text-sm font-medium">
                فعال‌سازی تعیین خودکار
              </label>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAutoAssignUnassigned} disabled={!autoAssignEnabled} className="gap-2" size="sm">
                <Zap className="w-4 h-4" />
                تعیین تیکت‌های بدون تکنسین
              </Button>
              <Button onClick={handleRebalanceWorkload} variant="outline" className="gap-2 bg-transparent" size="sm">
                <Target className="w-4 h-4" />
                تعادل بار کاری
              </Button>
            </div>
          </div>

          <Separator />

          {/* Assignment Strategy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Settings className="w-5 h-5" />
                تنظیمات تعیین
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">استراتژی تعیین</label>
                  <Select value={assignmentStrategy} onValueChange={setAssignmentStrategy} dir="rtl">
                    <SelectTrigger className="text-right">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="balanced">متعادل (توصیه شده)</SelectItem>
                      <SelectItem value="performance">بر اساس عملکرد</SelectItem>
                      <SelectItem value="workload">بر اساس بار کاری</SelectItem>
                      <SelectItem value="round-robin">چرخشی</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">وزن اولویت</label>
                  <Select value={priorityWeighting} onValueChange={setPriorityWeighting} dir="rtl">
                    <SelectTrigger className="text-right">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">کم</SelectItem>
                      <SelectItem value="medium">متوسط</SelectItem>
                      <SelectItem value="high">بالا</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">حد آستانه بار کاری</label>
                  <Select value={workloadThreshold} onValueChange={setWorkloadThreshold} dir="rtl">
                    <SelectTrigger className="text-right">
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

                <div className="flex items-center gap-3">
                  <Switch checked={specialtyMatching} onCheckedChange={setSpecialtyMatching} id="specialty-matching" />
                  <label htmlFor="specialty-matching" className="text-sm font-medium">
                    تطبیق تخصص
                  </label>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                آمار عملکرد
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-primary">{stats.totalAssignments}</div>
                  <div className="text-sm text-muted-foreground">کل تعیین‌ها</div>
                </div>

                <div className="bg-muted p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">{stats.successfulAssignments}</div>
                  <div className="text-sm text-muted-foreground">تعیین‌های موفق</div>
                </div>

                <div className="bg-muted p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">{stats.averageAssignmentTime}h</div>
                  <div className="text-sm text-muted-foreground">میانگین زمان تعیین</div>
                </div>

                <div className="bg-muted p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">{stats.technicianUtilization.toFixed(1)}%</div>
                  <div className="text-sm text-muted-foreground">بهره‌وری تکنسین‌ها</div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Current Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="w-5 h-5" />
              وضعیت فعلی سیستم
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium">تکنسین‌های آزاد</div>
                  <div className="text-sm text-muted-foreground">
                    {technicians.filter((tech) => tech.status === "available").length} نفر
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <div className="font-medium">تیکت‌های بدون تکنسین</div>
                  <div className="text-sm text-muted-foreground">
                    {tickets.filter((ticket) => !ticket.assignedTo).length} تیکت
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 border rounded-lg">
                <div className="p-2 bg-red-100 rounded-full">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="font-medium">تکنسین‌های پربار</div>
                  <div className="text-sm text-muted-foreground">
                    {
                      technicians.filter((tech) => (tech.activeTickets || 0) >= Number.parseInt(workloadThreshold))
                        .length
                    }{" "}
                    نفر
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
