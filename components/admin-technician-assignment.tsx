"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { AssignmentCriteriaDialog } from "./assignment-criteria-dialog"
import { Clock, User, AlertCircle, CheckCircle, Settings } from "lucide-react"

interface AdminTechnicianAssignmentProps {
  tickets: any[]
  onTicketUpdate: (ticketId: string, updates: any) => void
}

// Helper functions for safe string operations
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

// Mock technicians data
const technicians = [
  {
    id: "tech-001",
    name: "علی احمدی",
    email: "ali@company.com",
    specialties: ["hardware", "network"],
    currentTickets: 3,
    maxTickets: 10,
    status: "available",
  },
  {
    id: "tech-002",
    name: "سارا محمدی",
    email: "sara@company.com",
    specialties: ["software", "email"],
    currentTickets: 5,
    maxTickets: 8,
    status: "busy",
  },
  {
    id: "tech-003",
    name: "محمد رضایی",
    email: "mohammad@company.com",
    specialties: ["security", "access"],
    currentTickets: 2,
    maxTickets: 12,
    status: "available",
  },
]

export function AdminTechnicianAssignment({ tickets = [], onTicketUpdate }: AdminTechnicianAssignmentProps) {
  const [criteriaDialogOpen, setCriteriaDialogOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<any>(null)

  // Safe array access
  const safeTickets = Array.isArray(tickets) ? tickets : []

  const handleAssignTicket = (ticketId: string, technicianId: string) => {
    const technician = technicians.find((t) => t.id === technicianId)
    if (!technician) return

    onTicketUpdate(ticketId, {
      assignedTo: technicianId,
      assignedTechnicianName: technician.name,
      status: "in-progress",
    })

    toast({
      title: "تیکت واگذار شد",
      description: `تیکت به ${technician.name} واگذار شد`,
    })
  }

  const handleUnassignTicket = (ticketId: string) => {
    onTicketUpdate(ticketId, {
      assignedTo: null,
      assignedTechnicianName: null,
      status: "open",
    })

    toast({
      title: "واگذاری لغو شد",
      description: "تیکت از تکنسین لغو واگذاری شد",
    })
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
      case "open":
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case "in-progress":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const unassignedTickets = safeTickets.filter((ticket) => !ticket.assignedTo)
  const assignedTickets = safeTickets.filter((ticket) => ticket.assignedTo)

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">واگذاری تکنسین</h2>
          <p className="text-muted-foreground">مدیریت واگذاری تیکت‌ها به تکنسین‌ها</p>
        </div>
        <Button onClick={() => setCriteriaDialogOpen(true)} className="gap-2">
          <Settings className="w-4 h-4" />
          تنظیمات واگذاری خودکار
        </Button>
      </div>

      {/* Technicians Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            وضعیت تکنسین‌ها
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {technicians.map((technician) => (
              <Card key={technician.id} className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar>
                    <AvatarFallback>{getAvatarFallback(technician.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium">{getDisplayName(technician.name)}</h4>
                    <p className="text-sm text-muted-foreground">{safeString(technician.email)}</p>
                  </div>
                  <Badge variant={technician.status === "available" ? "default" : "secondary"}>
                    {technician.status === "available" ? "آزاد" : "مشغول"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>تیکت‌های فعال:</span>
                    <span>
                      {technician.currentTickets}/{technician.maxTickets}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(technician.currentTickets / technician.maxTickets) * 100}%` }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(technician.specialties || []).map((specialty) => (
                      <Badge key={specialty} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Unassigned Tickets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            تیکت‌های واگذار نشده ({unassignedTickets.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {unassignedTickets.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <p className="text-muted-foreground">همه تیکت‌ها واگذار شده‌اند</p>
            </div>
          ) : (
            <div className="space-y-4">
              {unassignedTickets.map((ticket) => (
                <Card key={ticket.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(ticket.status)}
                        <h4 className="font-medium">{safeString(ticket.title) || "عنوان نامشخص"}</h4>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority === "urgent"
                            ? "فوری"
                            : ticket.priority === "high"
                              ? "بالا"
                              : ticket.priority === "medium"
                                ? "متوسط"
                                : "پایین"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {safeString(ticket.description) || "توضیحات موجود نیست"}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>ارسال‌کننده: {getDisplayName(ticket.clientName)}</span>
                        <span>دسته‌بندی: {safeString(ticket.category) || "نامشخص"}</span>
                        <span>شناسه: {safeString(ticket.id)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select onValueChange={(value) => handleAssignTicket(ticket.id, value)}>
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="انتخاب تکنسین" />
                        </SelectTrigger>
                        <SelectContent>
                          {technicians.map((technician) => (
                            <SelectItem key={technician.id} value={technician.id}>
                              <div className="flex items-center gap-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarFallback className="text-xs">
                                    {getAvatarFallback(technician.name)}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{getDisplayName(technician.name)}</span>
                                <Badge
                                  variant={technician.status === "available" ? "default" : "secondary"}
                                  className="text-xs"
                                >
                                  {technician.currentTickets}/{technician.maxTickets}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assigned Tickets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-500" />
            تیکت‌های واگذار شده ({assignedTickets.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {assignedTickets.length === 0 ? (
            <div className="text-center py-8">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-muted-foreground">هیچ تیکت واگذار شده‌ای وجود ندارد</p>
            </div>
          ) : (
            <div className="space-y-4">
              {assignedTickets.map((ticket) => (
                <Card key={ticket.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(ticket.status)}
                        <h4 className="font-medium">{safeString(ticket.title) || "عنوان نامشخص"}</h4>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority === "urgent"
                            ? "فوری"
                            : ticket.priority === "high"
                              ? "بالا"
                              : ticket.priority === "medium"
                                ? "متوسط"
                                : "پایین"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {safeString(ticket.description) || "توضیحات موجود نیست"}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>ارسال‌کننده: {getDisplayName(ticket.clientName)}</span>
                        <span>واگذار شده به: {getDisplayName(ticket.assignedTechnicianName)}</span>
                        <span>شناسه: {safeString(ticket.id)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-md">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">
                            {getAvatarFallback(ticket.assignedTechnicianName)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">{getDisplayName(ticket.assignedTechnicianName)}</span>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleUnassignTicket(ticket.id)}>
                        لغو واگذاری
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AssignmentCriteriaDialog
        open={criteriaDialogOpen}
        onOpenChange={setCriteriaDialogOpen}
        technicians={technicians}
      />
    </div>
  )
}
