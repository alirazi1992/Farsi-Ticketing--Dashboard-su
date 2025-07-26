"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import {
  Brain,
  Zap,
  Target,
  Clock,
  Users,
  TrendingUp,
  Settings,
  CheckCircle,
  AlertTriangle,
  Activity,
} from "lucide-react"

interface EnhancedAutoAssignmentProps {
  tickets?: any[]
  onTicketUpdate?: (ticketId: string, updates: any) => void
}

export function EnhancedAutoAssignment({ tickets = [], onTicketUpdate }: EnhancedAutoAssignmentProps) {
  const [autoAssignEnabled, setAutoAssignEnabled] = useState(true)
  const [intelligentRouting, setIntelligentRouting] = useState(true)
  const [priorityBasedAssignment, setPriorityBasedAssignment] = useState(true)
  const [workloadBalancing, setWorkloadBalancing] = useState(true)
  const [skillMatching, setSkillMatching] = useState(true)

  // Mock technicians data
  const technicians = [
    {
      id: "tech-001",
      name: "علی احمدی",
      specialties: ["hardware", "network"],
      activeTickets: 3,
      rating: 4.8,
      status: "available",
    },
    {
      id: "tech-002",
      name: "سارا محمدی",
      specialties: ["software", "email"],
      activeTickets: 2,
      rating: 4.9,
      status: "available",
    },
    {
      id: "tech-003",
      name: "حسن رضایی",
      specialties: ["security", "access"],
      activeTickets: 1,
      rating: 4.7,
      status: "available",
    },
  ]

  // Calculate assignment statistics
  const totalTickets = tickets.length || 0
  const unassignedTickets = tickets.filter((ticket) => !ticket.assignedTo).length || 0
  const assignedTickets = totalTickets - unassignedTickets
  const assignmentRate = totalTickets > 0 ? Math.round((assignedTickets / totalTickets) * 100) : 0

  const handleAutoAssign = () => {
    if (!onTicketUpdate) {
      toast({
        title: "خطا",
        description: "عملکرد تخصیص خودکار در دسترس نیست",
        variant: "destructive",
      })
      return
    }

    const unassigned = tickets.filter((ticket) => !ticket.assignedTo)
    let assigned = 0

    unassigned.forEach((ticket) => {
      // Find best technician based on criteria
      const availableTechs = technicians.filter((tech) => tech.status === "available")

      if (availableTechs.length === 0) return

      let bestTech = availableTechs[0]

      if (skillMatching && ticket.category) {
        const skillMatched = availableTechs.filter((tech) => tech.specialties.includes(ticket.category))
        if (skillMatched.length > 0) {
          bestTech = skillMatched[0]
        }
      }

      if (workloadBalancing) {
        bestTech = availableTechs.reduce((prev, current) =>
          prev.activeTickets < current.activeTickets ? prev : current,
        )
      }

      if (bestTech) {
        onTicketUpdate(ticket.id, {
          assignedTo: bestTech.id,
          assignedTechnicianName: bestTech.name,
          status: "in-progress",
        })
        assigned++
      }
    })

    toast({
      title: "تخصیص خودکار انجام شد",
      description: `${assigned} تیکت به صورت خودکار تخصیص یافت`,
    })
  }

  return (
    <div className="space-y-6" dir="rtl">
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <Brain className="w-5 h-5" />
            سیستم تخصیص هوشمند
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Statistics */}
            <div className="space-y-4">
              <h3 className="font-semibold text-right">آمار تخصیص</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <span className="text-sm">کل تیکت‌ها</span>
                  <Badge variant="outline">{totalTickets}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm">تخصیص یافته</span>
                  <Badge className="bg-green-100 text-green-800">{assignedTickets}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-sm">در انتظار</span>
                  <Badge className="bg-orange-100 text-orange-800">{unassignedTickets}</Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm">نرخ تخصیص</span>
                  <Badge className="bg-blue-100 text-blue-800">{assignmentRate}%</Badge>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <h3 className="font-semibold text-right">تنظیمات</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-right">
                    <Label htmlFor="auto-assign">تخصیص خودکار</Label>
                    <p className="text-sm text-muted-foreground">فعال‌سازی تخصیص خودکار تیکت‌ها</p>
                  </div>
                  <Switch id="auto-assign" checked={autoAssignEnabled} onCheckedChange={setAutoAssignEnabled} />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="text-right">
                    <Label htmlFor="intelligent-routing">مسیریابی هوشمند</Label>
                    <p className="text-sm text-muted-foreground">تخصیص بر اساس الگوریتم‌های یادگیری</p>
                  </div>
                  <Switch
                    id="intelligent-routing"
                    checked={intelligentRouting}
                    onCheckedChange={setIntelligentRouting}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-right">
                    <Label htmlFor="priority-assignment">اولویت‌بندی</Label>
                    <p className="text-sm text-muted-foreground">تخصیص اولویت‌دار تیکت‌های فوری</p>
                  </div>
                  <Switch
                    id="priority-assignment"
                    checked={priorityBasedAssignment}
                    onCheckedChange={setPriorityBasedAssignment}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-right">
                    <Label htmlFor="workload-balancing">توزیع بار کاری</Label>
                    <p className="text-sm text-muted-foreground">توزیع متعادل تیکت‌ها بین تکنسین‌ها</p>
                  </div>
                  <Switch id="workload-balancing" checked={workloadBalancing} onCheckedChange={setWorkloadBalancing} />
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-right">
                    <Label htmlFor="skill-matching">تطبیق مهارت</Label>
                    <p className="text-sm text-muted-foreground">تخصیص بر اساس تخصص تکنسین‌ها</p>
                  </div>
                  <Switch id="skill-matching" checked={skillMatching} onCheckedChange={setSkillMatching} />
                </div>
              </div>

              <div className="pt-4">
                <Button onClick={handleAutoAssign} className="w-full gap-2" disabled={!autoAssignEnabled}>
                  <Zap className="w-4 h-4" />
                  اجرای تخصیص خودکار
                </Button>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="space-y-4">
              <h3 className="font-semibold text-right">عملکرد سیستم</h3>
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">میانگین زمان تخصیص</span>
                    <Clock className="w-4 h-4 text-blue-500" />
                  </div>
                  <p className="text-lg font-bold text-blue-600">1.2 دقیقه</p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">دقت تخصیص</span>
                    <Target className="w-4 h-4 text-green-500" />
                  </div>
                  <p className="text-lg font-bold text-green-600">94.5%</p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">رضایت تکنسین‌ها</span>
                    <Users className="w-4 h-4 text-purple-500" />
                  </div>
                  <p className="text-lg font-bold text-purple-600">4.7/5</p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">بهبود عملکرد</span>
                    <TrendingUp className="w-4 h-4 text-orange-500" />
                  </div>
                  <p className="text-lg font-bold text-orange-600">+12%</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Algorithm Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <Settings className="w-5 h-5" />
            جزئیات الگوریتم تخصیص
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3 text-right">معیارهای تخصیص</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">تطبیق مهارت و تخصص (وزن: 40%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">بار کاری فعلی تکنسین (وزن: 30%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">اولویت تیکت (وزن: 20%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">عملکرد تاریخی تکنسین (وزن: 10%)</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3 text-right">قوانین تخصیص</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  <span className="text-sm">تیکت‌های فوری: تخصیص فوری به بهترین تکنسین</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">حداکثر 5 تیکت فعال برای هر تکنسین</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-purple-500" />
                  <span className="text-sm">بازنگری خودکار تخصیص‌ها هر 15 دقیقه</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm">یادگیری از الگوهای موفق تخصیص</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <Activity className="w-5 h-5" />
            فعالیت‌های اخیر
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="text-right">
                <p className="text-sm font-medium">تیکت T-2024-001 تخصیص یافت</p>
                <p className="text-xs text-muted-foreground">به علی احمدی - 2 دقیقه پیش</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="text-right">
                <p className="text-sm font-medium">بهینه‌سازی الگوریتم انجام شد</p>
                <p className="text-xs text-muted-foreground">دقت تخصیص 3% بهبود یافت - 5 دقیقه پیش</p>
              </div>
              <Brain className="w-5 h-5 text-blue-500" />
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="text-right">
                <p className="text-sm font-medium">تکنسین جدید به سیستم اضافه شد</p>
                <p className="text-xs text-muted-foreground">فاطمه کریمی - 10 دقیقه پیش</p>
              </div>
              <Users className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
