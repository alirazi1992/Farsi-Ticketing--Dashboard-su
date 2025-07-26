"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/hooks/use-toast"
import { Settings, Target, Users, Clock, Zap, AlertCircle } from "lucide-react"

interface AutoAssignmentSettingsProps {
  tickets: any[]
  onTicketUpdate: (ticketId: string, updates: any) => void
}

export function AutoAssignmentSettings({ tickets = [], onTicketUpdate }: AutoAssignmentSettingsProps) {
  const [autoAssignEnabled, setAutoAssignEnabled] = useState(true)
  const [assignmentCriteria, setAssignmentCriteria] = useState({
    workloadBalance: true,
    skillMatching: true,
    priorityBased: true,
    responseTime: true,
  })
  const [maxTicketsPerTechnician, setMaxTicketsPerTechnician] = useState([8])
  const [assignmentDelay, setAssignmentDelay] = useState([5])

  // Mock technicians data
  const technicians = [
    {
      id: "tech-001",
      name: "علی احمدی",
      specialties: ["hardware", "network"],
      currentTickets: 3,
      maxTickets: 8,
      avgResponseTime: 2.4,
      isActive: true,
    },
    {
      id: "tech-002",
      name: "سارا محمدی",
      specialties: ["software", "email"],
      currentTickets: 5,
      maxTickets: 8,
      avgResponseTime: 1.9,
      isActive: true,
    },
    {
      id: "tech-003",
      name: "محمد رضایی",
      specialties: ["security", "access"],
      currentTickets: 2,
      maxTickets: 8,
      avgResponseTime: 3.1,
      isActive: false,
    },
  ]

  const safeTickets = Array.isArray(tickets) ? tickets : []
  const unassignedTickets = safeTickets.filter((ticket) => !ticket.assignedTo)

  const handleAutoAssign = () => {
    let assignedCount = 0
    const availableTechnicians = technicians.filter((tech) => tech.isActive && tech.currentTickets < tech.maxTickets)

    unassignedTickets.forEach((ticket) => {
      if (availableTechnicians.length === 0) return

      // Simple assignment logic - assign to technician with least workload
      const bestTechnician = availableTechnicians.sort((a, b) => a.currentTickets - b.currentTickets)[0]

      if (bestTechnician) {
        onTicketUpdate(ticket.id, {
          assignedTo: bestTechnician.id,
          assignedTechnicianName: bestTechnician.name,
          status: "in-progress",
        })
        bestTechnician.currentTickets++
        assignedCount++
      }
    })

    toast({
      title: "تخصیص خودکار انجام شد",
      description: `${assignedCount} تیکت به صورت خودکار تخصیص یافت`,
    })
  }

  const handleSettingChange = (setting: string, value: boolean) => {
    setAssignmentCriteria((prev) => ({
      ...prev,
      [setting]: value,
    }))

    toast({
      title: "تنظیمات به‌روزرسانی شد",
      description: "تغییرات در تخصیص خودکار اعمال شد",
    })
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="text-right">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-600" />
            تنظیمات تخصیص خودکار
          </h2>
          <p className="text-muted-foreground">پیکربندی سیستم تخصیص خودکار تیکت‌ها</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAutoAssign} disabled={!autoAssignEnabled || unassignedTickets.length === 0}>
            <Zap className="w-4 h-4 ml-2" />
            اجرای تخصیص خودکار
          </Button>
        </div>
      </div>

      {/* Main Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-2">
              <Settings className="w-5 h-5" />
              تنظیمات کلی
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="text-right space-y-0.5">
                <Label className="text-base">فعال‌سازی تخصیص خودکار</Label>
                <p className="text-sm text-muted-foreground">تخصیص خودکار تیکت‌های جدید</p>
              </div>
              <Switch checked={autoAssignEnabled} onCheckedChange={setAutoAssignEnabled} />
            </div>

            <div className="space-y-3">
              <Label>حداکثر تیکت برای هر تکنسین: {maxTicketsPerTechnician[0]}</Label>
              <Slider
                value={maxTicketsPerTechnician}
                onValueChange={setMaxTicketsPerTechnician}
                max={15}
                min={3}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <Label>تأخیر تخصیص (دقیقه): {assignmentDelay[0]}</Label>
              <Slider
                value={assignmentDelay}
                onValueChange={setAssignmentDelay}
                max={60}
                min={0}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">زمان انتظار قبل از تخصیص خودکار (برای امکان تخصیص دستی)</p>
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
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-right space-y-0.5">
                <Label className="text-base">توازن بار کاری</Label>
                <p className="text-sm text-muted-foreground">توزیع متعادل تیکت‌ها بین تکنسین‌ها</p>
              </div>
              <Switch
                checked={assignmentCriteria.workloadBalance}
                onCheckedChange={(value) => handleSettingChange("workloadBalance", value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-right space-y-0.5">
                <Label className="text-base">تطبیق مهارت</Label>
                <p className="text-sm text-muted-foreground">تخصیص بر اساس تخصص تکنسین</p>
              </div>
              <Switch
                checked={assignmentCriteria.skillMatching}
                onCheckedChange={(value) => handleSettingChange("skillMatching", value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-right space-y-0.5">
                <Label className="text-base">اولویت‌بندی</Label>
                <p className="text-sm text-muted-foreground">تخصیص اولویت‌دار برای تیکت‌های فوری</p>
              </div>
              <Switch
                checked={assignmentCriteria.priorityBased}
                onCheckedChange={(value) => handleSettingChange("priorityBased", value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-right space-y-0.5">
                <Label className="text-base">زمان پاسخ</Label>
                <p className="text-sm text-muted-foreground">در نظر گیری سرعت پاسخ‌گویی</p>
              </div>
              <Switch
                checked={assignmentCriteria.responseTime}
                onCheckedChange={(value) => handleSettingChange("responseTime", value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technician Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <Users className="w-5 h-5" />
            وضعیت تکنسین‌ها
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {technicians.map((technician) => (
              <Card key={technician.id} className={`p-4 ${!technician.isActive ? "opacity-60" : ""}`}>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="text-right">
                      <h4 className="font-medium">{technician.name}</h4>
                      <div className="flex gap-1 mt-1">
                        {technician.specialties.map((specialty) => (
                          <Badge key={specialty} variant="outline" className="text-xs">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Badge variant={technician.isActive ? "default" : "secondary"}>
                      {technician.isActive ? "فعال" : "غیرفعال"}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>تیکت‌های فعال:</span>
                      <span className="font-medium">
                        {technician.currentTickets}/{technician.maxTickets}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          technician.currentTickets / technician.maxTickets > 0.8
                            ? "bg-red-500"
                            : technician.currentTickets / technician.maxTickets > 0.6
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                        style={{ width: `${(technician.currentTickets / technician.maxTickets) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between">
                      <span>زمان پاسخ:</span>
                      <span className="font-medium">{technician.avgResponseTime}h</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Unassigned Tickets */}
      {unassignedTickets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              تیکت‌های تخصیص نیافته ({unassignedTickets.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {unassignedTickets.slice(0, 5).map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant={
                          ticket.priority === "urgent"
                            ? "destructive"
                            : ticket.priority === "high"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {ticket.priority === "urgent"
                          ? "فوری"
                          : ticket.priority === "high"
                            ? "بالا"
                            : ticket.priority === "medium"
                              ? "متوسط"
                              : "پایین"}
                      </Badge>
                      <span className="font-medium">{ticket.id}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{ticket.title}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(ticket.createdAt).toLocaleDateString("fa-IR")}</span>
                  </div>
                </div>
              ))}
              {unassignedTickets.length > 5 && (
                <p className="text-sm text-muted-foreground text-center">
                  و {unassignedTickets.length - 5} تیکت دیگر...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
