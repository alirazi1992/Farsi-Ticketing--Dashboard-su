"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { toast } from "@/hooks/use-toast"
import {
  Play,
  RotateCcw,
  TrendingUp,
  Clock,
  Star,
  Users,
  Brain,
  Target,
  CheckCircle,
  Info,
  Plus,
  Trash2,
  Edit,
  BarChart3,
  PieChart,
  Activity,
  Award,
  UserCheck,
  Gauge,
} from "lucide-react"

// Enhanced technician data with comprehensive profiles
const enhancedTechnicians = [
  {
    id: "tech-001",
    name: "علی احمدی",
    email: "ali@company.com",
    specialties: ["hardware", "network"],
    certifications: ["CompTIA A+", "CCNA", "Microsoft Certified"],
    languages: ["فارسی", "انگلیسی"],
    activeTickets: 3,
    maxCapacity: 8,
    status: "available",
    rating: 4.8,
    completedTickets: 145,
    avgResponseTime: 2.1, // hours
    avgResolutionTime: 8.5, // hours
    successRate: 94.2, // percentage
    escalationRate: 3.1, // percentage
    customerSatisfaction: 4.7,
    workingHours: { start: "08:00", end: "17:00" },
    timezone: "Asia/Tehran",
    expertise: {
      hardware: 95,
      network: 88,
      software: 65,
      email: 45,
      security: 55,
      access: 70,
    },
    priorityHandling: {
      urgent: 98,
      high: 92,
      medium: 89,
      low: 85,
    },
    performanceScore: 92.5,
    efficiency: 87.3,
    lastActive: new Date().toISOString(),
  },
  {
    id: "tech-002",
    name: "سارا محمدی",
    email: "sara@company.com",
    specialties: ["software", "email"],
    certifications: ["Microsoft Office Specialist", "Google Workspace Admin"],
    languages: ["فارسی", "انگلیسی", "آلمانی"],
    activeTickets: 2,
    maxCapacity: 10,
    status: "available",
    rating: 4.9,
    completedTickets: 162,
    avgResponseTime: 1.8,
    avgResolutionTime: 6.2,
    successRate: 96.8,
    escalationRate: 2.1,
    customerSatisfaction: 4.9,
    workingHours: { start: "09:00", end: "18:00" },
    timezone: "Asia/Tehran",
    expertise: {
      hardware: 45,
      network: 55,
      software: 98,
      email: 95,
      security: 70,
      access: 80,
    },
    priorityHandling: {
      urgent: 95,
      high: 97,
      medium: 94,
      low: 91,
    },
    performanceScore: 96.2,
    efficiency: 93.1,
    lastActive: new Date().toISOString(),
  },
  {
    id: "tech-003",
    name: "حسن رضایی",
    email: "hassan@company.com",
    specialties: ["security", "access"],
    certifications: ["CISSP", "CEH", "Security+"],
    languages: ["فارسی", "انگلیسی"],
    activeTickets: 1,
    maxCapacity: 6,
    status: "available",
    rating: 4.7,
    completedTickets: 98,
    avgResponseTime: 3.2,
    avgResolutionTime: 12.1,
    successRate: 91.5,
    escalationRate: 4.2,
    customerSatisfaction: 4.6,
    workingHours: { start: "08:30", end: "17:30" },
    timezone: "Asia/Tehran",
    expertise: {
      hardware: 60,
      network: 75,
      software: 70,
      email: 65,
      security: 98,
      access: 95,
    },
    priorityHandling: {
      urgent: 99,
      high: 95,
      medium: 88,
      low: 82,
    },
    performanceScore: 89.7,
    efficiency: 84.2,
    lastActive: new Date().toISOString(),
  },
  {
    id: "tech-004",
    name: "فاطمه کریمی",
    email: "fateme@company.com",
    specialties: ["hardware", "software"],
    certifications: ["CompTIA A+", "Microsoft Certified Professional"],
    languages: ["فارسی"],
    activeTickets: 5,
    maxCapacity: 8,
    status: "busy",
    rating: 4.6,
    completedTickets: 121,
    avgResponseTime: 2.5,
    avgResolutionTime: 9.8,
    successRate: 88.9,
    escalationRate: 5.8,
    customerSatisfaction: 4.4,
    workingHours: { start: "07:00", end: "16:00" },
    timezone: "Asia/Tehran",
    expertise: {
      hardware: 92,
      network: 65,
      software: 89,
      email: 55,
      security: 45,
      access: 60,
    },
    priorityHandling: {
      urgent: 85,
      high: 89,
      medium: 92,
      low: 94,
    },
    performanceScore: 86.3,
    efficiency: 81.7,
    lastActive: new Date().toISOString(),
  },
  {
    id: "tech-005",
    name: "محمد نوری",
    email: "mohammad@company.com",
    specialties: ["network", "email", "security"],
    certifications: ["CCNP", "CISSP", "Microsoft Exchange Expert"],
    languages: ["فارسی", "انگلیسی", "عربی"],
    activeTickets: 2,
    maxCapacity: 12,
    status: "available",
    rating: 4.9,
    completedTickets: 203,
    avgResponseTime: 1.5,
    avgResolutionTime: 5.8,
    successRate: 97.1,
    escalationRate: 1.8,
    customerSatisfaction: 4.8,
    workingHours: { start: "08:00", end: "20:00" },
    timezone: "Asia/Tehran",
    expertise: {
      hardware: 70,
      network: 97,
      software: 80,
      email: 96,
      security: 93,
      access: 85,
    },
    priorityHandling: {
      urgent: 98,
      high: 96,
      medium: 94,
      low: 90,
    },
    performanceScore: 95.8,
    efficiency: 91.4,
    lastActive: new Date().toISOString(),
  },
]

// Assignment criteria weights
const defaultCriteriaWeights = {
  expertise: 40,
  availability: 25,
  workload: 20,
  performance: 15,
}

// Assignment rules
const defaultAssignmentRules = [
  {
    id: "urgent-expert",
    name: "متخصص فوری",
    description: "برای تیکت‌های فوری، بهترین متخصص انتخاب شود",
    enabled: true,
    priority: 1,
    conditions: {
      ticketPriority: "urgent",
      minExpertise: 90,
      maxResponseTime: 1,
    },
    weight: 100,
  },
  {
    id: "balanced-assignment",
    name: "تعادل بار کاری",
    description: "توزیع متعادل تیکت‌ها بین تکنسین‌ها",
    enabled: true,
    priority: 2,
    conditions: {
      maxWorkloadDifference: 30,
    },
    weight: 80,
  },
  {
    id: "specialty-match",
    name: "تطبیق تخصص",
    description: "انتخاب تکنسین با تخصص مرتبط",
    enabled: true,
    priority: 3,
    conditions: {
      minSpecialtyMatch: 70,
    },
    weight: 90,
  },
]

interface EnhancedAutoAssignmentProps {
  tickets: any[]
  onTicketUpdate: (ticketId: string, updates: any) => void
}

const categoryLabels = {
  hardware: "سخت‌افزار",
  network: "شبکه",
  software: "نرم‌افزار",
  email: "پست الکترونیک",
  security: "امنیت",
  access: "دسترسی",
}

const priorityLabels = {
  urgent: "فوری",
  high: "بالا",
  medium: "متوسط",
  low: "کم",
}

export function EnhancedAutoAssignment({ tickets, onTicketUpdate }: EnhancedAutoAssignmentProps) {
  const [technicians, setTechnicians] = useState(enhancedTechnicians)
  const [criteriaWeights, setCriteriaWeights] = useState(defaultCriteriaWeights)
  const [assignmentRules, setAssignmentRules] = useState(defaultAssignmentRules)
  const [autoAssignEnabled, setAutoAssignEnabled] = useState(false)
  const [simulationMode, setSimulationMode] = useState(true)
  const [simulationResults, setSimulationResults] = useState<any[]>([])
  const [analytics, setAnalytics] = useState({
    totalAssignments: 0,
    successRate: 0,
    avgAssignmentTime: 0,
    customerSatisfaction: 0,
  })

  // Calculate technician score for a specific ticket
  const calculateTechnicianScore = (technician: any, ticket: any) => {
    const weights = criteriaWeights

    // Expertise Score (0-100)
    const expertiseScore = technician.expertise[ticket.category] || 0

    // Availability Score (0-100)
    const workloadPercentage = (technician.activeTickets / technician.maxCapacity) * 100
    const availabilityScore = Math.max(0, 100 - workloadPercentage)

    // Workload Score (0-100) - inverse of current load
    const workloadScore = Math.max(0, 100 - workloadPercentage)

    // Performance Score (0-100)
    const performanceScore = technician.performanceScore

    // Priority Handling Score
    const priorityScore = technician.priorityHandling[ticket.priority] || 0

    // Response Time Score (inverse - lower is better)
    const responseTimeScore = Math.max(0, 100 - technician.avgResponseTime * 10)

    // Calculate weighted total
    const totalScore =
      (expertiseScore * weights.expertise) / 100 +
      (availabilityScore * weights.availability) / 100 +
      (workloadScore * weights.workload) / 100 +
      (performanceScore * weights.performance) / 100

    return {
      totalScore,
      breakdown: {
        expertise: expertiseScore,
        availability: availabilityScore,
        workload: workloadScore,
        performance: performanceScore,
        priority: priorityScore,
        responseTime: responseTimeScore,
      },
      confidence: Math.min(100, totalScore + priorityScore / 2),
      reasoning: generateAssignmentReasoning(technician, ticket, {
        expertiseScore,
        availabilityScore,
        workloadScore,
        performanceScore,
      }),
    }
  }

  // Generate human-readable reasoning for assignment
  const generateAssignmentReasoning = (technician: any, ticket: any, scores: any) => {
    const reasons = []

    if (scores.expertiseScore >= 90) {
      reasons.push(`متخصص برتر در ${categoryLabels[ticket.category]}`)
    } else if (scores.expertiseScore >= 70) {
      reasons.push(`تخصص مناسب در ${categoryLabels[ticket.category]}`)
    }

    if (scores.availabilityScore >= 80) {
      reasons.push("بار کاری مناسب")
    } else if (scores.availabilityScore >= 60) {
      reasons.push("بار کاری متوسط")
    }

    if (technician.avgResponseTime <= 2) {
      reasons.push("زمان پاسخ سریع")
    }

    if (technician.customerSatisfaction >= 4.5) {
      reasons.push("رضایت بالای مشتریان")
    }

    if (technician.successRate >= 95) {
      reasons.push("نرخ موفقیت بالا")
    }

    return reasons.join("، ")
  }

  // Find best technician for a ticket
  const findBestTechnician = (ticket: any) => {
    const availableTechnicians = technicians.filter(
      (tech) => tech.status === "available" || tech.activeTickets < tech.maxCapacity,
    )

    if (availableTechnicians.length === 0) {
      return null
    }

    const scoredTechnicians = availableTechnicians.map((tech) => ({
      ...tech,
      score: calculateTechnicianScore(tech, ticket),
    }))

    // Apply assignment rules
    const filteredTechnicians = applyAssignmentRules(scoredTechnicians, ticket)

    // Sort by total score
    filteredTechnicians.sort((a, b) => b.score.totalScore - a.score.totalScore)

    return filteredTechnicians[0] || null
  }

  // Apply assignment rules to filter technicians
  const applyAssignmentRules = (technicians: any[], ticket: any) => {
    let filteredTechnicians = [...technicians]

    assignmentRules
      .filter((rule) => rule.enabled)
      .sort((a, b) => a.priority - b.priority)
      .forEach((rule) => {
        switch (rule.id) {
          case "urgent-expert":
            if (ticket.priority === "urgent") {
              filteredTechnicians = filteredTechnicians.filter(
                (tech) => tech.expertise[ticket.category] >= (rule.conditions.minExpertise || 90),
              )
            }
            break
          case "specialty-match":
            filteredTechnicians = filteredTechnicians.filter(
              (tech) => tech.expertise[ticket.category] >= (rule.conditions.minSpecialtyMatch || 70),
            )
            break
          case "balanced-assignment":
            // Prefer technicians with lower workload
            const avgWorkload =
              filteredTechnicians.reduce((sum, tech) => sum + tech.activeTickets, 0) / filteredTechnicians.length
            filteredTechnicians = filteredTechnicians.filter(
              (tech) => tech.activeTickets <= avgWorkload + (rule.conditions.maxWorkloadDifference || 30) / 100,
            )
            break
        }
      })

    return filteredTechnicians
  }

  // Run simulation for unassigned tickets
  const runSimulation = () => {
    const unassignedTickets = tickets.filter((ticket) => !ticket.assignedTo)
    const results = []

    for (const ticket of unassignedTickets) {
      const bestTechnician = findBestTechnician(ticket)
      if (bestTechnician) {
        results.push({
          ticket,
          assignedTechnician: bestTechnician,
          score: bestTechnician.score,
          confidence: bestTechnician.score.confidence,
          reasoning: bestTechnician.score.reasoning,
        })
      }
    }

    setSimulationResults(results)
    toast({
      title: "شبیه‌سازی کامل شد",
      description: `${results.length} تیکت برای تعیین تکنسین شبیه‌سازی شد`,
    })
  }

  // Apply simulation results
  const applySimulationResults = () => {
    simulationResults.forEach((result) => {
      onTicketUpdate(result.ticket.id, {
        assignedTo: result.assignedTechnician.id,
        assignedTechnicianName: result.assignedTechnician.name,
        status: result.ticket.status === "open" ? "in-progress" : result.ticket.status,
      })
    })

    setSimulationResults([])
    toast({
      title: "تعیین تکنسین انجام شد",
      description: `${simulationResults.length} تیکت به تکنسین‌ها واگذار شد`,
    })
  }

  // Auto-assign single ticket
  const autoAssignTicket = (ticket: any) => {
    const bestTechnician = findBestTechnician(ticket)
    if (bestTechnician) {
      if (!simulationMode) {
        onTicketUpdate(ticket.id, {
          assignedTo: bestTechnician.id,
          assignedTechnicianName: bestTechnician.name,
          status: ticket.status === "open" ? "in-progress" : ticket.status,
        })
      }

      toast({
        title: simulationMode ? "شبیه‌سازی تعیین تکنسین" : "تکنسین تعیین شد",
        description: `تیکت ${ticket.id} به ${bestTechnician.name} واگذار ${simulationMode ? "خواهد شد" : "شد"}`,
      })

      return bestTechnician
    }
    return null
  }

  // Update analytics
  useEffect(() => {
    const assignedTickets = tickets.filter((ticket) => ticket.assignedTo)
    const totalAssignments = assignedTickets.length
    const avgSatisfaction =
      assignedTickets.reduce((sum, ticket) => {
        const tech = technicians.find((t) => t.id === ticket.assignedTo)
        return sum + (tech?.customerSatisfaction || 0)
      }, 0) / totalAssignments || 0

    setAnalytics({
      totalAssignments,
      successRate: 94.2, // This would be calculated from historical data
      avgAssignmentTime: 1.8, // Average time to assign in hours
      customerSatisfaction: avgSatisfaction,
    })
  }, [tickets, technicians])

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-right flex items-center gap-2">
                <Brain className="w-5 h-5" />
                سیستم هوشمند تعیین تکنسین
              </CardTitle>
              <p className="text-sm text-muted-foreground text-right mt-1">
                تعیین خودکار تکنسین بر اساس معیارهای چندگانه و هوش مصنوعی
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Label htmlFor="simulation-mode" className="text-sm">
                  حالت شبیه‌سازی
                </Label>
                <Switch id="simulation-mode" checked={simulationMode} onCheckedChange={setSimulationMode} />
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="auto-assign" className="text-sm">
                  تعیین خودکار
                </Label>
                <Switch id="auto-assign" checked={autoAssignEnabled} onCheckedChange={setAutoAssignEnabled} />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">کل تعیین‌ها</p>
                <p className="text-2xl font-bold">{analytics.totalAssignments}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">نرخ موفقیت</p>
                <p className="text-2xl font-bold">{analytics.successRate}%</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">زمان تعیین</p>
                <p className="text-2xl font-bold">{analytics.avgAssignmentTime}س</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">رضایت مشتری</p>
                <p className="text-2xl font-bold">{analytics.customerSatisfaction.toFixed(1)}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="criteria" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="criteria">معیارهای تعیین</TabsTrigger>
          <TabsTrigger value="rules">قوانین تعیین</TabsTrigger>
          <TabsTrigger value="simulation">شبیه‌سازی</TabsTrigger>
          <TabsTrigger value="analytics">تحلیل عملکرد</TabsTrigger>
        </TabsList>

        {/* Criteria Tab */}
        <TabsContent value="criteria" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">وزن معیارهای تعیین تکنسین</CardTitle>
              <p className="text-sm text-muted-foreground text-right">
                اهمیت هر معیار در انتخاب تکنسین مناسب را تنظیم کنید
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label className="text-right">تخصص و مهارت ({criteriaWeights.expertise}%)</Label>
                      <Award className="w-4 h-4 text-blue-500" />
                    </div>
                    <Slider
                      value={[criteriaWeights.expertise]}
                      onValueChange={(value) => setCriteriaWeights({ ...criteriaWeights, expertise: value[0] })}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground text-right mt-1">
                      میزان تخصص تکنسین در دسته‌بندی مربوطه
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label className="text-right">در دسترس بودن ({criteriaWeights.availability}%)</Label>
                      <UserCheck className="w-4 h-4 text-green-500" />
                    </div>
                    <Slider
                      value={[criteriaWeights.availability]}
                      onValueChange={(value) => setCriteriaWeights({ ...criteriaWeights, availability: value[0] })}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground text-right mt-1">وضعیت فعلی و ساعات کاری تکنسین</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label className="text-right">بار کاری ({criteriaWeights.workload}%)</Label>
                      <Gauge className="w-4 h-4 text-orange-500" />
                    </div>
                    <Slider
                      value={[criteriaWeights.workload]}
                      onValueChange={(value) => setCriteriaWeights({ ...criteriaWeights, workload: value[0] })}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground text-right mt-1">تعداد تیکت‌های فعلی نسبت به ظرفیت</p>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <Label className="text-right">عملکرد تاریخی ({criteriaWeights.performance}%)</Label>
                      <TrendingUp className="w-4 h-4 text-purple-500" />
                    </div>
                    <Slider
                      value={[criteriaWeights.performance]}
                      onValueChange={(value) => setCriteriaWeights({ ...criteriaWeights, performance: value[0] })}
                      max={100}
                      step={5}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground text-right mt-1">
                      نرخ موفقیت، رضایت مشتری و زمان حل مسئله
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  مجموع وزن‌ها: {Object.values(criteriaWeights).reduce((a, b) => a + b, 0)}%
                </p>
                <Button variant="outline" onClick={() => setCriteriaWeights(defaultCriteriaWeights)} className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  بازگردانی پیش‌فرض
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Technician Profiles */}
          <Card>
            <CardHeader>
              <CardTitle className="text-right">پروفایل تکنسین‌ها</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {technicians.map((tech) => (
                  <Card key={tech.id} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback>{tech.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="text-right">
                          <p className="font-medium">{tech.name}</p>
                          <p className="text-xs text-muted-foreground">{tech.email}</p>
                        </div>
                      </div>
                      <Badge variant={tech.status === "available" ? "default" : "secondary"}>
                        {tech.status === "available" ? "آزاد" : "مشغول"}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>بار کاری:</span>
                        <span>
                          {tech.activeTickets}/{tech.maxCapacity}
                        </span>
                      </div>
                      <Progress value={(tech.activeTickets / tech.maxCapacity) * 100} className="h-2" />

                      <div className="flex justify-between text-sm">
                        <span>امتیاز عملکرد:</span>
                        <span>{tech.performanceScore}</span>
                      </div>
                      <Progress value={tech.performanceScore} className="h-2" />

                      <div className="flex justify-between text-sm">
                        <span>رضایت مشتری:</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-current text-yellow-500" />
                          <span>{tech.customerSatisfaction}</span>
                        </div>
                      </div>

                      <div className="text-xs text-muted-foreground">
                        <p>تخصص‌ها: {tech.specialties.map((s) => categoryLabels[s]).join("، ")}</p>
                        <p>گواهینامه‌ها: {tech.certifications.join("، ")}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rules Tab */}
        <TabsContent value="rules" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-right">قوانین تعیین تکنسین</CardTitle>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  افزودن قانون جدید
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {assignmentRules.map((rule) => (
                  <Card key={rule.id} className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={(enabled) =>
                            setAssignmentRules(assignmentRules.map((r) => (r.id === rule.id ? { ...r, enabled } : r)))
                          }
                        />
                        <div className="text-right">
                          <h4 className="font-medium">{rule.name}</h4>
                          <p className="text-sm text-muted-foreground">{rule.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">اولویت {rule.priority}</Badge>
                        <Badge variant="secondary">وزن {rule.weight}%</Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Simulation Tab */}
        <TabsContent value="simulation" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-right">شبیه‌سازی تعیین تکنسین</CardTitle>
                <div className="flex gap-2">
                  <Button onClick={runSimulation} className="gap-2">
                    <Play className="w-4 h-4" />
                    اجرای شبیه‌سازی
                  </Button>
                  {simulationResults.length > 0 && (
                    <Button onClick={applySimulationResults} variant="outline" className="gap-2 bg-transparent">
                      <CheckCircle className="w-4 h-4" />
                      اعمال نتایج
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {simulationResults.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Info className="w-4 h-4" />
                    <span>{simulationResults.length} تیکت برای تعیین تکنسین شبیه‌سازی شده</span>
                  </div>

                  {simulationResults.map((result, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="text-right">
                          <h4 className="font-medium">{result.ticket.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {categoryLabels[result.ticket.category]} | {priorityLabels[result.ticket.priority]}
                          </p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">اطمینان {Math.round(result.confidence)}%</Badge>
                      </div>

                      <div className="flex items-center gap-4 mb-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>{result.assignedTechnician.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="text-right">
                          <p className="font-medium">{result.assignedTechnician.name}</p>
                          <p className="text-sm text-muted-foreground">امتیاز: {Math.round(result.score.totalScore)}</p>
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground text-right">
                        <p>دلیل انتخاب: {result.reasoning}</p>
                      </div>

                      <div className="grid grid-cols-4 gap-2 mt-3">
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">تخصص</p>
                          <p className="font-medium">{Math.round(result.score.breakdown.expertise)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">دسترسی</p>
                          <p className="font-medium">{Math.round(result.score.breakdown.availability)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">بار کاری</p>
                          <p className="font-medium">{Math.round(result.score.breakdown.workload)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-muted-foreground">عملکرد</p>
                          <p className="font-medium">{Math.round(result.score.breakdown.performance)}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-muted-foreground">آماده شبیه‌سازی</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    برای مشاهده پیش‌نمایش تعیین تکنسین، شبیه‌سازی را اجرا کنید
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-right flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  توزیع تیکت‌ها بر اساس تکنسین
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {technicians.map((tech) => (
                    <div key={tech.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">{tech.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{tech.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={(tech.activeTickets / tech.maxCapacity) * 100} className="w-20 h-2" />
                        <span className="text-sm text-muted-foreground">
                          {tech.activeTickets}/{tech.maxCapacity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-right flex items-center gap-2">
                  <PieChart className="w-5 h-5" />
                  عملکرد تکنسین‌ها
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {technicians
                    .sort((a, b) => b.performanceScore - a.performanceScore)
                    .map((tech) => (
                      <div key={tech.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">{tech.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{tech.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={tech.performanceScore} className="w-20 h-2" />
                          <span className="text-sm font-medium">{tech.performanceScore}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-right flex items-center gap-2">
                <Activity className="w-5 h-5" />
                آمار کلی سیستم
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{tickets.length}</p>
                  <p className="text-sm text-muted-foreground">کل تیکت‌ها</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{tickets.filter((t) => t.assignedTo).length}</p>
                  <p className="text-sm text-muted-foreground">تعیین شده</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{tickets.filter((t) => !t.assignedTo).length}</p>
                  <p className="text-sm text-muted-foreground">در انتظار</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.round((tickets.filter((t) => t.assignedTo).length / tickets.length) * 100)}%
                  </p>
                  <p className="text-sm text-muted-foreground">نرخ تعیین</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
