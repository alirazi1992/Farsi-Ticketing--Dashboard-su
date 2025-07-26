"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Target, Star, Clock, TrendingUp, Users, Zap, CheckCircle, AlertTriangle, Brain } from "lucide-react"

interface AssignmentCriteriaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ticket?: any
  technicians?: any[]
  onAssign?: (technicianId: string) => void
}

export function AssignmentCriteriaDialog({
  open,
  onOpenChange,
  ticket,
  technicians = [],
  onAssign,
}: AssignmentCriteriaDialogProps) {
  const [selectedTechnician, setSelectedTechnician] = useState<string | null>(null)

  // Helper functions for safe operations
  const safeString = (value: any): string => {
    return value && typeof value === "string" ? value : ""
  }

  const getDisplayName = (name: any): string => {
    const safeName = safeString(name)
    return safeName || "نام نامشخص"
  }

  const getAvatarFallback = (name: any): string => {
    const safeName = safeString(name)
    return safeName && safeName.length > 0 ? safeName.charAt(0) : "N"
  }

  // Calculate comprehensive score for each technician
  const calculateDetailedScore = (technician: any, ticket: any) => {
    if (!ticket || !technician) return { total: 0, breakdown: {} }

    const breakdown = {
      specialty: 0,
      availability: 0,
      experience: 0,
      rating: 0,
      workload: 0,
      priority: 0,
    }

    // Specialty match (30%)
    if (technician.specialties && technician.specialties.includes(ticket.category)) {
      breakdown.specialty = 30
    } else {
      breakdown.specialty = 5
    }

    // Availability (25%)
    if (technician.status === "available") {
      breakdown.availability = 25
    } else if (technician.status === "busy") {
      breakdown.availability = 10
    } else {
      breakdown.availability = 0
    }

    // Experience (20%)
    const completedTickets = technician.completedTickets || 0
    if (completedTickets >= 50) {
      breakdown.experience = 20
    } else if (completedTickets >= 20) {
      breakdown.experience = 15
    } else if (completedTickets >= 10) {
      breakdown.experience = 10
    } else {
      breakdown.experience = 5
    }

    // Rating (15%)
    const rating = technician.rating || 0
    breakdown.rating = (rating / 5) * 15

    // Workload (10%)
    const currentTickets = technician.activeTickets || technician.currentTickets || 0
    const maxTickets = technician.maxTickets || 10
    const workloadPercentage = currentTickets / maxTickets
    breakdown.workload = Math.max(0, (1 - workloadPercentage) * 10)

    // Priority handling capability (bonus)
    if (ticket.priority === "urgent" && rating >= 4.5) {
      breakdown.priority = 5
    } else if (ticket.priority === "high" && rating >= 4.0) {
      breakdown.priority = 3
    } else {
      breakdown.priority = 0
    }

    const total = Object.values(breakdown).reduce((sum, score) => sum + score, 0)

    return { total: Math.round(total), breakdown }
  }

  // Get scored and sorted technicians
  const scoredTechnicians = technicians
    .map((tech) => {
      const scoreData = calculateDetailedScore(tech, ticket)
      return {
        ...tech,
        scoreData,
      }
    })
    .sort((a, b) => b.scoreData.total - a.scoreData.total)

  const handleAssign = () => {
    if (selectedTechnician && onAssign) {
      onAssign(selectedTechnician)
      onOpenChange(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "busy":
        return <Clock className="w-4 h-4 text-yellow-500" />
      default:
        return <AlertTriangle className="w-4 h-4 text-red-500" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            تحلیل معیارهای واگذاری
          </DialogTitle>
          <DialogDescription>تحلیل جامع و انتخاب بهترین تکنسین بر اساس معیارهای مختلف</DialogDescription>
        </DialogHeader>

        {ticket && (
          <div className="space-y-6">
            {/* Ticket Information */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">اطلاعات تیکت</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium mb-2">{safeString(ticket.title) || "عنوان نامشخص"}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {safeString(ticket.description) || "توضیحات موجود نیست"}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge className={getPriorityColor(ticket.priority)}>
                        {ticket.priority === "urgent"
                          ? "فوری"
                          : ticket.priority === "high"
                            ? "بالا"
                            : ticket.priority === "medium"
                              ? "متوسط"
                              : "پایین"}
                      </Badge>
                      <Badge variant="outline">{safeString(ticket.category) || "نامشخص"}</Badge>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">درخواست‌کننده</p>
                    <p className="font-medium">{getDisplayName(ticket.clientName)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Technician Analysis */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-semibold">تحلیل تکنسین‌ها</h3>
              </div>

              <div className="grid gap-4">
                {scoredTechnicians.map((technician, index) => (
                  <Card
                    key={technician.id}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedTechnician === technician.id ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedTechnician(technician.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarFallback className="text-lg">{getAvatarFallback(technician.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{getDisplayName(technician.name)}</h4>
                            {index === 0 && (
                              <Badge className="bg-yellow-100 text-yellow-800">
                                <Star className="w-3 h-3 ml-1" />
                                پیشنهاد اول
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{safeString(technician.email)}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {getStatusIcon(technician.status)}
                            <span className="text-sm">
                              {technician.status === "available"
                                ? "آزاد"
                                : technician.status === "busy"
                                  ? "مشغول"
                                  : "غیرفعال"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-left">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="w-5 h-5 text-purple-600" />
                          <span className="text-2xl font-bold text-purple-600">{technician.scoreData.total}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">امتیاز کل</p>
                      </div>
                    </div>

                    {/* Score Breakdown */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-muted-foreground">تخصص</span>
                          <span className="text-xs font-medium">{technician.scoreData.breakdown.specialty}/30</span>
                        </div>
                        <Progress value={(technician.scoreData.breakdown.specialty / 30) * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-muted-foreground">در دسترس بودن</span>
                          <span className="text-xs font-medium">{technician.scoreData.breakdown.availability}/25</span>
                        </div>
                        <Progress value={(technician.scoreData.breakdown.availability / 25) * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-muted-foreground">تجربه</span>
                          <span className="text-xs font-medium">{technician.scoreData.breakdown.experience}/20</span>
                        </div>
                        <Progress value={(technician.scoreData.breakdown.experience / 20) * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-muted-foreground">امتیاز</span>
                          <span className="text-xs font-medium">
                            {Math.round(technician.scoreData.breakdown.rating)}/15
                          </span>
                        </div>
                        <Progress value={(technician.scoreData.breakdown.rating / 15) * 100} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-muted-foreground">بار کاری</span>
                          <span className="text-xs font-medium">
                            {Math.round(technician.scoreData.breakdown.workload)}/10
                          </span>
                        </div>
                        <Progress value={(technician.scoreData.breakdown.workload / 10) * 100} className="h-2" />
                      </div>
                      {technician.scoreData.breakdown.priority > 0 && (
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs text-muted-foreground">اولویت</span>
                            <span className="text-xs font-medium">{technician.scoreData.breakdown.priority}/5</span>
                          </div>
                          <Progress value={(technician.scoreData.breakdown.priority / 5) * 100} className="h-2" />
                        </div>
                      )}
                    </div>

                    <Separator className="my-3" />

                    {/* Technician Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>امتیاز: {technician.rating || 0}/5</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span>فعال: {technician.activeTickets || technician.currentTickets || 0}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span>تکمیل: {technician.completedTickets || 0}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-500" />
                        <span>ظرفیت: {technician.maxTickets || 10}</span>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground mb-2">تخصص‌ها:</p>
                      <div className="flex gap-1 flex-wrap">
                        {(technician.specialties || []).map((specialty: string) => (
                          <Badge
                            key={specialty}
                            variant={specialty === ticket.category ? "default" : "outline"}
                            className="text-xs"
                          >
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recommendation Summary */}
            {scoredTechnicians.length > 0 && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                    <h4 className="font-medium text-blue-900">توصیه سیستم</h4>
                  </div>
                  <p className="text-sm text-blue-700">
                    بر اساس تحلیل معیارهای مختلف، <strong>{getDisplayName(scoredTechnicians[0].name)}</strong> با امتیاز{" "}
                    <strong>{scoredTechnicians[0].scoreData.total}</strong> بهترین گزینه برای این تیکت است.
                  </p>
                  {scoredTechnicians[0].scoreData.breakdown.specialty === 30 && (
                    <p className="text-xs text-blue-600 mt-1">✓ تطبیق کامل تخصص با دسته‌بندی تیکت</p>
                  )}
                  {scoredTechnicians[0].scoreData.breakdown.availability === 25 && (
                    <p className="text-xs text-blue-600 mt-1">✓ در حال حاضر آزاد و قابل دسترس</p>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            انصراف
          </Button>
          <Button onClick={handleAssign} disabled={!selectedTechnician} className="gap-2">
            <Users className="w-4 h-4" />
            واگذاری به تکنسین انتخابی
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
