"use client"

import React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Star,
  Clock,
  CheckCircle,
  AlertTriangle,
  Target,
  TrendingUp,
  Users,
  Award,
  Zap,
  HardDrive,
  ComputerIcon as Software,
  Network,
  Mail,
  Shield,
  Key,
} from "lucide-react"

// Helper functions for safe string operations
const safeString = (value: any): string => {
  return value && typeof value === "string" ? value : ""
}

const getAvatarFallback = (name: any): string => {
  const safeName = safeString(name)
  return safeName.length > 0 ? safeName.charAt(0).toUpperCase() : "?"
}

const getDisplayName = (name: any): string => {
  const safeName = safeString(name)
  return safeName || "نامشخص"
}

const categoryIcons = {
  hardware: HardDrive,
  software: Software,
  network: Network,
  email: Mail,
  security: Shield,
  access: Key,
}

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

const priorityColors = {
  low: "bg-blue-100 text-blue-800 border-blue-200",
  medium: "bg-orange-100 text-orange-800 border-orange-200",
  high: "bg-red-100 text-red-800 border-red-200",
  urgent: "bg-purple-100 text-purple-800 border-purple-200",
}

interface AssignmentCriteriaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ticket: any
  technicians: any[]
  onAssign: (technicianId: string) => void
}

export function AssignmentCriteriaDialog({
  open,
  onOpenChange,
  ticket,
  technicians,
  onAssign,
}: AssignmentCriteriaDialogProps) {
  const [selectedTechnician, setSelectedTechnician] = useState<string | null>(null)

  if (!ticket) return null

  // Calculate detailed scores for each technician
  const calculateDetailedScore = (technician: any) => {
    const scores = {
      specialty: 0,
      availability: 0,
      experience: 0,
      rating: 0,
      workload: 0,
    }

    // Specialty match (0-100)
    if (technician.specialties && technician.specialties.includes(ticket.category)) {
      scores.specialty = technician.specialties[0] === ticket.category ? 100 : 80
    } else {
      scores.specialty = 20
    }

    // Availability (0-100)
    scores.availability = technician.status === "available" ? 100 : technician.status === "busy" ? 50 : 0

    // Experience (0-100)
    scores.experience = Math.min(100, (technician.completedTickets / 50) * 100)

    // Rating (0-100)
    scores.rating = (technician.rating / 5) * 100

    // Workload (0-100) - inverse relationship
    scores.workload = Math.max(0, ((8 - technician.activeTickets) / 8) * 100)

    const totalScore =
      scores.specialty * 0.3 +
      scores.availability * 0.25 +
      scores.experience * 0.2 +
      scores.rating * 0.15 +
      scores.workload * 0.1

    return {
      ...scores,
      total: Math.round(totalScore),
    }
  }

  const rankedTechnicians = technicians
    .map((tech) => ({
      ...tech,
      scores: calculateDetailedScore(tech),
    }))
    .sort((a, b) => b.scores.total - a.scores.total)

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-4 h-4 text-green-600" />
    if (score >= 60) return <Clock className="w-4 h-4 text-yellow-600" />
    return <AlertTriangle className="w-4 h-4 text-red-600" />
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <CheckCircle className="w-3 h-3 text-green-500" />
      case "busy":
        return <Clock className="w-3 h-3 text-yellow-500" />
      default:
        return <AlertTriangle className="w-3 h-3 text-red-500" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "available":
        return "آماده"
      case "busy":
        return "مشغول"
      default:
        return "غیرفعال"
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-right flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            تحلیل معیارهای واگذاری - تیکت {safeString(ticket.id)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Ticket Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">خلاصه تیکت</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">عنوان</p>
                  <p className="font-medium">{getDisplayName(ticket.title)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">اولویت</p>
                  <Badge className={priorityColors[ticket.priority] || priorityColors.medium}>
                    {priorityLabels[ticket.priority] || ticket.priority}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">دسته‌بندی</p>
                  <div className="flex items-center gap-1">
                    {categoryIcons[ticket.category] &&
                      React.createElement(categoryIcons[ticket.category], { className: "w-4 h-4" })}
                    <span>{categoryLabels[ticket.category] || ticket.category}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">درخواست‌کننده</p>
                  <p className="font-medium">{getDisplayName(ticket.clientName)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assignment Criteria Explanation */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                معیارهای ارزیابی
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-sm">
                <div className="text-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Target className="w-4 h-4 text-blue-600" />
                  </div>
                  <p className="font-medium">تخصص</p>
                  <p className="text-xs text-muted-foreground">30%</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <p className="font-medium">در دسترس بودن</p>
                  <p className="text-xs text-muted-foreground">25%</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Award className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="font-medium">تجربه</p>
                  <p className="text-xs text-muted-foreground">20%</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Star className="w-4 h-4 text-yellow-600" />
                  </div>
                  <p className="font-medium">امتیاز</p>
                  <p className="text-xs text-muted-foreground">15%</p>
                </div>
                <div className="text-center">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="w-4 h-4 text-orange-600" />
                  </div>
                  <p className="font-medium">بار کاری</p>
                  <p className="text-xs text-muted-foreground">10%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technicians Ranking */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="w-4 h-4" />
                رتبه‌بندی تکنسین‌ها
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rankedTechnicians.map((technician, index) => (
                  <div
                    key={technician.id}
                    className={`p-4 border rounded-lg transition-all ${
                      selectedTechnician === technician.id
                        ? "border-blue-500 bg-blue-50"
                        : "hover:bg-muted/50 cursor-pointer"
                    }`}
                    onClick={() => setSelectedTechnician(technician.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-muted-foreground">#{index + 1}</span>
                          <Avatar className="w-10 h-10">
                            <AvatarFallback>{getAvatarFallback(technician.name)}</AvatarFallback>
                          </Avatar>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{getDisplayName(technician.name)}</h4>
                            {getStatusIcon(technician.status)}
                            <span className="text-xs text-muted-foreground">{getStatusLabel(technician.status)}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <span>{technician.rating || 0}</span>
                            </div>
                            <span>فعال: {technician.activeTickets || 0}</span>
                            <span>تکمیل: {technician.completedTickets || 0}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2 mb-1">
                          {getScoreIcon(technician.scores.total)}
                          <span className={`text-lg font-bold ${getScoreColor(technician.scores.total)}`}>
                            {technician.scores.total}%
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">امتیاز کل</p>
                      </div>
                    </div>

                    {/* Detailed Scores */}
                    <div className="grid grid-cols-5 gap-3 mb-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs">تخصص</span>
                          <span className="text-xs font-medium">{technician.scores.specialty}%</span>
                        </div>
                        <Progress value={technician.scores.specialty} className="h-1" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs">در دسترس</span>
                          <span className="text-xs font-medium">{technician.scores.availability}%</span>
                        </div>
                        <Progress value={technician.scores.availability} className="h-1" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs">تجربه</span>
                          <span className="text-xs font-medium">{technician.scores.experience}%</span>
                        </div>
                        <Progress value={technician.scores.experience} className="h-1" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs">امتیاز</span>
                          <span className="text-xs font-medium">{technician.scores.rating}%</span>
                        </div>
                        <Progress value={technician.scores.rating} className="h-1" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs">بار کاری</span>
                          <span className="text-xs font-medium">{technician.scores.workload}%</span>
                        </div>
                        <Progress value={technician.scores.workload} className="h-1" />
                      </div>
                    </div>

                    {/* Specialties */}
                    <div className="flex gap-1">
                      {(technician.specialties || []).map((specialty) => {
                        const SpecialtyIcon = categoryIcons[specialty] || HardDrive
                        const isMatch = specialty === ticket.category
                        return (
                          <div
                            key={specialty}
                            className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                              isMatch
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <SpecialtyIcon className="w-3 h-3" />
                            <span>{categoryLabels[specialty] || specialty}</span>
                            {isMatch && <CheckCircle className="w-3 h-3" />}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              {selectedTechnician ? "تکنسین انتخاب شده" : "تکنسین مورد نظر را انتخاب کنید"}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                انصراف
              </Button>
              <Button
                onClick={() => {
                  if (selectedTechnician) {
                    onAssign(selectedTechnician)
                    onOpenChange(false)
                  }
                }}
                disabled={!selectedTechnician}
                className="gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                واگذاری تیکت
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
