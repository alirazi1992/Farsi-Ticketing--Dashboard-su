"use client"

import { DialogTrigger } from "@/components/ui/dialog"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/hooks/use-toast"
import {
  Printer,
  UserPlus,
  Search,
  Filter,
  Download,
  Eye,
  HardDrive,
  ComputerIcon as Software,
  Network,
  Mail,
  Shield,
  Key,
  Clock,
  Star,
  TrendingUp,
  MessageSquare,
  Edit,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  FileText,
} from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

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

const statusColors = {
  open: "bg-red-100 text-red-800 border-red-200",
  "in-progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
  resolved: "bg-green-100 text-green-800 border-green-200",
  closed: "bg-gray-100 text-gray-800 border-gray-200",
}

const statusLabels = {
  open: "باز",
  "in-progress": "در حال انجام",
  resolved: "حل شده",
  closed: "بسته",
}

const priorityColors = {
  low: "bg-blue-100 text-blue-800 border-blue-200",
  medium: "bg-orange-100 text-orange-800 border-orange-200",
  high: "bg-red-100 text-red-800 border-red-200",
  urgent: "bg-purple-100 text-purple-800 border-purple-200",
}

const priorityLabels = {
  low: "کم",
  medium: "متوسط",
  high: "بالا",
  urgent: "فوری",
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

// Enhanced technicians data with more details
const initialTechnicians = [
  {
    id: "tech-001",
    name: "علی احمدی",
    email: "ali@company.com",
    specialties: ["network", "hardware"],
    activeTickets: 3,
    status: "available",
    rating: 4.8,
    completedTickets: 45,
    avgResponseTime: "2.1 ساعت",
    expertise: ["تعمیر سخت‌افزار", "پیکربندی شبکه", "نصب تجهیزات"],
  },
  {
    id: "tech-002",
    name: "سارا محمدی",
    email: "sara@company.com",
    specialties: ["software", "email"],
    activeTickets: 2,
    status: "available",
    rating: 4.9,
    completedTickets: 62,
    avgResponseTime: "1.8 ساعت",
    expertise: ["نصب نرم‌افزار", "پیکربندی ایمیل", "رفع مشکلات نرم‌افزاری"],
  },
  {
    id: "tech-003",
    name: "حسن رضایی",
    email: "hassan@company.com",
    specialties: ["security", "access"],
    activeTickets: 1,
    status: "available",
    rating: 4.7,
    completedTickets: 38,
    avgResponseTime: "3.2 ساعت",
    expertise: ["امنیت سایبری", "مدیریت دسترسی", "پیکربندی فایروال"],
  },
  {
    id: "tech-004",
    name: "فاطمه کریمی",
    email: "fateme@company.com",
    specialties: ["hardware", "software"],
    activeTickets: 5,
    status: "busy",
    rating: 4.6,
    completedTickets: 51,
    avgResponseTime: "2.5 ساعت",
    expertise: ["تعمیر رایانه", "نصب سیستم عامل", "بهینه‌سازی عملکرد"],
  },
  {
    id: "tech-005",
    name: "محمد نوری",
    email: "mohammad@company.com",
    specialties: ["network", "email", "security"],
    activeTickets: 2,
    status: "available",
    rating: 4.9,
    completedTickets: 73,
    avgResponseTime: "1.5 ساعت",
    expertise: ["مدیریت شبکه", "امنیت ایمیل", "پیکربندی سرور"],
  },
]

interface AdminTicketManagementProps {
  tickets: any[]
  onTicketUpdate: (ticketId: string, updates: any) => void
}

const safeDate = (dateValue: any): string => {
  if (!dateValue) return "نامشخص"
  try {
    return new Date(dateValue).toLocaleDateString("fa-IR")
  } catch {
    return "نامشخص"
  }
}

export function AdminTicketManagement({ tickets, onTicketUpdate }: AdminTicketManagementProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [responseDialogOpen, setResponseDialogOpen] = useState(false)
  const [responseText, setResponseText] = useState("")
  const [technicians, setTechnicians] = useState(initialTechnicians)
  const [filterTechnician, setFilterTechnician] = useState("all")
  const [selectedTickets, setSelectedTickets] = useState<string[]>([])
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [bulkAssignDialogOpen, setBulkAssignDialogOpen] = useState(false)
  const [selectedTicketForAssign, setSelectedTicketForAssign] = useState<any>(null)
  const [technicianFilter, setTechnicianFilter] = useState("all")
  const [viewDialogOpen, setViewDialogOpen] = useState(false)

  // Filter tickets
  const filteredTickets = tickets.filter((ticket) => {
    if (!ticket) return false

    const safeTitle = safeString(ticket.title)
    const safeDescription = safeString(ticket.description)
    const safeId = safeString(ticket.id)
    const safeClientName = safeString(ticket.clientName)
    const searchableText = [
      safeString(ticket.title),
      safeString(ticket.description),
      safeString(ticket.id),
      safeString(ticket.clientName),
      safeString(ticket.submittedBy),
    ]
      .join(" ")
      .toLowerCase()

    const matchesSearch =
      safeTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      safeDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      safeId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      safeClientName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus
    const matchesPriority = filterPriority === "all" || ticket.priority === filterPriority
    const matchesCategory = filterCategory === "all" || ticket.category === filterCategory
    const matchesTechnician =
      filterTechnician === "all" ||
      (filterTechnician === "unassigned" && !ticket.assignedTo) ||
      ticket.assignedTo === filterTechnician

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesTechnician
  })

  useEffect(() => {
    const updatedTechnicians = technicians.map((tech) => {
      const assignedTickets = tickets.filter(
        (ticket) => ticket?.assignedTo === tech.id && (ticket?.status === "open" || ticket?.status === "in-progress"),
      )

      return {
        ...tech,
        activeTickets: assignedTickets.length,
        status: assignedTickets.length >= 5 ? "busy" : "available",
      }
    })

    setTechnicians(updatedTechnicians)
  }, [tickets])

  const getRecommendedTechnicians = (ticket: any) => {
    if (!ticket?.category) return technicians

    return technicians
      .filter((tech) => tech.specialties.includes(ticket.category))
      .sort((a, b) => {
        if (a.status !== b.status) {
          return a.status === "available" ? -1 : 1
        }
        if (a.rating !== b.rating) {
          return b.rating - a.rating
        }
        return a.activeTickets - b.activeTickets
      })
  }

  // Filter technicians for assignment dialog
  const getFilteredTechnicians = (ticket?: any) => {
    let filteredTechs = technicians

    if (ticket && technicianFilter === "recommended") {
      filteredTechs = getRecommendedTechnicians(ticket)
    } else if (technicianFilter === "available") {
      filteredTechs = technicians.filter((tech) => tech.status === "available")
    } else if (technicianFilter === "busy") {
      filteredTechs = technicians.filter((tech) => tech.status === "busy")
    } else if (technicianFilter !== "all") {
      filteredTechs = technicians.filter((tech) => tech.specialties.includes(technicianFilter))
    }

    return filteredTechs.sort((a, b) => {
      if (a.status !== b.status) {
        return a.status === "available" ? -1 : 1
      }
      if (a.rating !== b.rating) {
        return b.rating - a.rating
      }
      return a.activeTickets - b.activeTickets
    })
  }

  // Handle ticket selection for bulk operations
  const handleTicketSelect = (ticketId: string, checked: boolean) => {
    setSelectedTickets((prev) => (checked ? [...prev, ticketId] : prev.filter((id) => id !== ticketId)))
  }

  // Handle select all tickets
  const handleSelectAll = () => {
    if (selectedTickets.length === filteredTickets.length) {
      setSelectedTickets([])
    } else {
      setSelectedTickets(filteredTickets.map((ticket) => ticket.id).filter(Boolean))
    }
  }

  // Handle individual technician assignment
  const handleAssignTechnician = (ticketId: string, technicianId: string) => {
    const technician = technicians.find((tech) => tech.id === technicianId)
    if (technician) {
      onTicketUpdate(ticketId, {
        assignedTo: technicianId,
        assignedTechnicianName: technician.name,
        status: "in-progress",
      })

      toast({
        title: "تکنسین تعیین شد",
        description: `تیکت ${ticketId} به ${technician.name} واگذار شد`,
      })
    }
    setAssignDialogOpen(false)
    setSelectedTicketForAssign(null)
  }

  // Handle bulk assignment
  const handleBulkAssign = (technicianId: string) => {
    const technician = technicians.find((tech) => tech.id === technicianId)
    if (technician) {
      selectedTickets.forEach((ticketId) => {
        onTicketUpdate(ticketId, {
          assignedTo: technicianId,
          assignedTechnicianName: technician.name,
          status: "in-progress",
        })
      })

      toast({
        title: "تکنسین تعیین شد",
        description: `${selectedTickets.length} تیکت به ${technician.name} واگذار شد`,
      })

      setSelectedTickets([])
      setBulkAssignDialogOpen(false)
    }
  }

  // Handle bulk status update
  const handleBulkStatusUpdate = (newStatus: string) => {
    selectedTickets.forEach((ticketId) => {
      onTicketUpdate(ticketId, { status: newStatus })
    })

    toast({
      title: "وضعیت تیکت‌ها به‌روزرسانی شد",
      description: `${selectedTickets.length} تیکت به وضعیت ${statusLabels[newStatus]} تغییر یافت`,
    })

    setSelectedTickets([])
  }

  // Handle print functionality
  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      const ticketsToPrint =
        selectedTickets.length > 0
          ? filteredTickets.filter((ticket) => selectedTickets.includes(ticket.id))
          : filteredTickets

      printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
          <title>گزارش تیکت‌ها</title>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Tahoma', Arial, sans-serif; direction: rtl; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: right; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .header { text-align: center; margin-bottom: 30px; }
            .status-open { background-color: #fee2e2; color: #991b1b; }
            .status-in-progress { background-color: #fef3c7; color: #92400e; }
            .status-resolved { background-color: #d1fae5; color: #065f46; }
            .status-closed { background-color: #f3f4f6; color: #374151; }
            .priority-low { background-color: #dbeafe; color: #1e40af; }
            .priority-medium { background-color: #fed7aa; color: #c2410c; }
            .priority-high { background-color: #fecaca; color: #dc2626; }
            .priority-urgent { background-color: #e9d5ff; color: #7c3aed; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>گزارش تیکت‌های سیستم مدیریت خدمات IT</h1>
            <p>تاریخ تولید گزارش: ${new Date().toLocaleDateString("fa-IR")}</p>
            <p>تعداد تیکت‌ها: ${ticketsToPrint.length}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>شماره تیکت</th>
                <th>عنوان</th>
                <th>وضعیت</th>
                <th>اولویت</th>
                <th>دسته‌بندی</th>
                <th>درخواست‌کننده</th>
                <th>تکنسین</th>
                <th>تاریخ ایجاد</th>
                <th>آخرین به‌روزرسانی</th>
              </tr>
            </thead>
            <tbody>
              ${ticketsToPrint
                .map(
                  (ticket) => `
                <tr>
                  <td>${safeString(ticket.id) || "نامشخص"}</td>
                  <td>${safeString(ticket.title) || "بدون عنوان"}</td>
                  <td class="status-${ticket.status || "open"}">${statusLabels[ticket.status] || "نامشخص"}</td>
                  <td class="priority-${ticket.priority || "medium"}">${priorityLabels[ticket.priority] || "نامشخص"}</td>
                  <td>${categoryLabels[ticket.category] || safeString(ticket.category) || "نامشخص"}</td>
                  <td>${getDisplayName(ticket.clientName || ticket.submittedBy)}</td>
                  <td>${getDisplayName(ticket.assignedTechnicianName, "تعیین نشده")}</td>
                  <td>${safeDate(ticket.createdAt || ticket.submittedAt)}</td>
                  <td>${safeDate(ticket.updatedAt || ticket.submittedAt)}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>
          
          <div style="margin-top: 30px; font-size: 12px; color: #666;">
            <p>این گزارش توسط سیستم مدیریت خدمات IT تولید شده است.</p>
          </div>
        </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  const handleExportCSV = () => {
    const headers = [
      "شماره تیکت",
      "عنوان",
      "وضعیت",
      "اولویت",
      "دسته‌بندی",
      "درخواست‌کننده",
      "ایمیل",
      "تکنسین",
      "تاریخ ایجاد",
      "آخرین به‌روزرسانی",
    ]

    const csvContent = [
      headers.join(","),
      ...filteredTickets.map((ticket) =>
        [
          safeString(ticket.id) || "نامشخص",
          `"${safeString(ticket.title) || "بدون عنوان"}"`,
          statusLabels[ticket.status] || "نامشخص",
          priorityLabels[ticket.priority] || "نامشخص",
          categoryLabels[ticket.category] || safeString(ticket.category) || "نامشخص",
          `"${getDisplayName(ticket.clientName || ticket.submittedBy)}"`,
          safeString(ticket.clientEmail || ticket.email) || "نامشخص",
          `"${getDisplayName(ticket.assignedTechnicianName, "تعیین نشده")}"`,
          safeDate(ticket.createdAt || ticket.submittedAt),
          safeDate(ticket.updatedAt || ticket.submittedAt),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `tickets-report-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "فایل CSV ایجاد شد",
      description: "گزارش تیکت‌ها با موفقیت دانلود شد",
    })
  }

  // Automatic assignment logic
  const getAutomaticAssignment = (ticket: any, technicians: any[]) => {
    const availableTechnicians = technicians.filter((tech) => tech.status === "available")

    if (availableTechnicians.length === 0) {
      return null
    }

    const specialtyMatches = availableTechnicians.filter((tech) => tech.specialties.includes(ticket?.category))

    const candidateTechnicians = specialtyMatches.length > 0 ? specialtyMatches : availableTechnicians

    return candidateTechnicians.sort((a, b) => {
      if (a.rating !== b.rating) return b.rating - a.rating
      if (a.activeTickets !== b.activeTickets) return a.activeTickets - b.activeTickets
      return b.completedTickets - a.completedTickets
    })[0]
  }

  // Handle automatic assignment for single ticket
  const handleAutoAssign = (ticket: any) => {
    const recommendedTech = getAutomaticAssignment(ticket, technicians)

    if (recommendedTech) {
      onTicketUpdate(ticket.id, {
        assignedTo: recommendedTech.id,
        assignedTechnicianName: recommendedTech.name,
        status: ticket.status === "open" ? "in-progress" : ticket.status,
      })

      toast({
        title: "تکنسین به صورت خودکار تعیین شد",
        description: `تیکت ${ticket.id} به ${recommendedTech.name} واگذار شد`,
      })
    } else {
      toast({
        title: "خطا در تعیین خودکار",
        description: "تکنسین مناسبی برای این تیکت یافت نشد",
        variant: "destructive",
      })
    }
  }

  // Technician Card Component
  const TechnicianCard = ({ technician, ticket, onAssign, showRecommended = false }: any) => (
    <div
      className={`p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-all ${
        showRecommended ? "border-primary bg-primary/5" : ""
      }`}
      onClick={() => onAssign(technician.id)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="text-sm font-medium">{getAvatarFallback(technician.name)}</AvatarFallback>
          </Avatar>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <p className="font-medium">{getDisplayName(technician.name)}</p>
              {showRecommended && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
            </div>
            <p className="text-sm text-muted-foreground">{safeString(technician.email) || "ایمیل نامشخص"}</p>
          </div>
        </div>
        <div className="text-left">
          <Badge variant={technician.status === "available" ? "default" : "secondary"} className="mb-1">
            {technician.status === "available" ? "آزاد" : "مشغول"}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="w-3 h-3 fill-current text-yellow-500" />
            <span>{technician.rating || 0}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex gap-1 flex-wrap">
          {(technician.specialties || []).map((specialty) => (
            <Badge key={specialty} variant="outline" className="text-xs">
              {categoryLabels[specialty] || specialty}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{technician.activeTickets || 0} تیکت فعال</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>{technician.completedTickets || 0} تکمیل شده</span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          <span>میانگین پاسخ: {safeString(technician.avgResponseTime) || "نامشخص"}</span>
        </div>

        {technician.expertise && technician.expertise.length > 0 && (
          <div className="text-xs">
            <p className="text-muted-foreground mb-1">تخصص‌ها:</p>
            <p className="text-right">{technician.expertise.join("، ")}</p>
          </div>
        )}
      </div>
    </div>
  )

  const handlePreviewTicket = (ticket: any) => {
    setSelectedTicket(ticket)
    setPreviewDialogOpen(true)
  }

  const handleEditTicket = (ticket: any) => {
    setSelectedTicket(ticket)
    setEditDialogOpen(true)
  }

  const handleRespondToTicket = (ticket: any) => {
    setSelectedTicket(ticket)
    setResponseText("")
    setResponseDialogOpen(true)
  }

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    onTicketUpdate(ticketId, { status: newStatus })
    toast({
      title: "وضعیت تیکت تغییر کرد",
      description: `وضعیت تیکت ${ticketId} به ${statusLabels[newStatus]} تغییر یافت`,
    })
  }

  const handlePriorityChange = (ticketId: string, newPriority: string) => {
    onTicketUpdate(ticketId, { priority: newPriority })
    toast({
      title: "اولویت تیکت تغییر کرد",
      description: `اولویت تیکت ${ticketId} به ${priorityLabels[newPriority]} تغییر یافت`,
    })
  }

  const handleSendResponse = () => {
    if (selectedTicket && responseText.trim()) {
      // Add response to ticket
      const updatedTicket = {
        ...selectedTicket,
        responses: [
          ...(selectedTicket.responses || []),
          {
            id: Date.now().toString(),
            text: responseText,
            author: "مدیر سیستم",
            timestamp: new Date().toISOString(),
            type: "admin",
          },
        ],
      }

      onTicketUpdate(selectedTicket.id, updatedTicket)

      toast({
        title: "پاسخ ارسال شد",
        description: `پاسخ شما به تیکت ${selectedTicket.id} ارسال شد`,
      })

      setResponseDialogOpen(false)
      setResponseText("")
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      case "in-progress":
        return <Clock className="w-4 h-4 text-yellow-500" />
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "closed":
        return <XCircle className="w-4 h-4 text-gray-500" />
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-500" />
    }
  }

  const handleViewTicket = (ticket: any) => {
    setSelectedTicket(ticket)
    setViewDialogOpen(true)
  }

  return (
    <div className="space-y-6" dir="rtl">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-right">مدیریت کامل تیکت‌ها</CardTitle>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
                className="gap-2 bg-transparent"
                disabled={filteredTickets.length === 0}
              >
                <Printer className="w-4 h-4" />
                چاپ {selectedTickets.length > 0 && `(${selectedTickets.length})`}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExportCSV}
                className="gap-2 bg-transparent"
                disabled={filteredTickets.length === 0}
              >
                <Download className="w-4 h-4" />
                خروجی CSV
              </Button>
              {selectedTickets.length > 0 && (
                <Dialog open={bulkAssignDialogOpen} onOpenChange={setBulkAssignDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <UserPlus className="w-4 h-4" />
                      تعیین تکنسین ({selectedTickets.length})
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" dir="rtl">
                    <DialogHeader>
                      <DialogTitle className="text-right">
                        تعیین تکنسین برای {selectedTickets.length} تیکت انتخابی
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <Select value={technicianFilter} onValueChange={setTechnicianFilter} dir="rtl">
                          <SelectTrigger className="w-48 text-right">
                            <SelectValue placeholder="فیلتر تکنسین‌ها" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">همه تکنسین‌ها</SelectItem>
                            <SelectItem value="available">آزاد</SelectItem>
                            <SelectItem value="busy">مشغول</SelectItem>
                            <SelectItem value="hardware">متخصص سخت‌افزار</SelectItem>
                            <SelectItem value="software">متخصص نرم‌افزار</SelectItem>
                            <SelectItem value="network">متخصص شبکه</SelectItem>
                            <SelectItem value="email">متخصص ایمیل</SelectItem>
                            <SelectItem value="security">متخصص امنیت</SelectItem>
                            <SelectItem value="access">متخصص دسترسی</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {getFilteredTechnicians().map((technician) => (
                          <TechnicianCard key={technician.id} technician={technician} onAssign={handleBulkAssign} />
                        ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="جستجو در تیکت‌ها..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10 text-right"
                dir="rtl"
              />
            </div>

            <Select value={filterStatus} onValueChange={setFilterStatus} dir="rtl">
              <SelectTrigger className="text-right">
                <SelectValue placeholder="وضعیت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                <SelectItem value="open">باز</SelectItem>
                <SelectItem value="in-progress">در حال انجام</SelectItem>
                <SelectItem value="resolved">حل شده</SelectItem>
                <SelectItem value="closed">بسته</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={setFilterPriority} dir="rtl">
              <SelectTrigger className="text-right">
                <SelectValue placeholder="اولویت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه اولویت‌ها</SelectItem>
                <SelectItem value="urgent">فوری</SelectItem>
                <SelectItem value="high">بالا</SelectItem>
                <SelectItem value="medium">متوسط</SelectItem>
                <SelectItem value="low">کم</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory} dir="rtl">
              <SelectTrigger className="text-right">
                <SelectValue placeholder="دسته‌بندی" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه دسته‌ها</SelectItem>
                <SelectItem value="hardware">سخت‌افزار</SelectItem>
                <SelectItem value="software">نرم‌افزار</SelectItem>
                <SelectItem value="network">شبکه</SelectItem>
                <SelectItem value="email">ایمیل</SelectItem>
                <SelectItem value="security">امنیت</SelectItem>
                <SelectItem value="access">دسترسی</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setFilterStatus("all")
                setFilterPriority("all")
                setFilterCategory("all")
              }}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              پاک کردن فیلترها
            </Button>
          </div>

          {/* Bulk Actions */}
          {selectedTickets.length > 0 && (
            <div className="flex items-center gap-4 mb-4 p-3 bg-muted rounded-lg">
              <span className="text-sm font-medium">{selectedTickets.length} تیکت انتخاب شده</span>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleBulkStatusUpdate("in-progress")} variant="outline">
                  در حال انجام
                </Button>
                <Button size="sm" onClick={() => handleBulkStatusUpdate("resolved")} variant="outline">
                  حل شده
                </Button>
                <Button size="sm" onClick={() => handleBulkStatusUpdate("closed")} variant="outline">
                  بسته
                </Button>
              </div>
            </div>
          )}

          {/* Tickets Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedTickets.length === filteredTickets.length && filteredTickets.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="text-right">شماره تیکت</TableHead>
                  <TableHead className="text-right">عنوان</TableHead>
                  <TableHead className="text-right">وضعیت</TableHead>
                  <TableHead className="text-right">اولویت</TableHead>
                  <TableHead className="text-right">دسته‌بندی</TableHead>
                  <TableHead className="text-right">درخواست‌کننده</TableHead>
                  <TableHead className="text-right">تکنسین</TableHead>
                  <TableHead className="text-right">تاریخ ایجاد</TableHead>
                  <TableHead className="text-right">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.length > 0 ? (
                  filteredTickets.map((ticket) => {
                    if (!ticket) return null

                    const CategoryIcon = categoryIcons[ticket.category] || HardDrive
                    const isSelected = selectedTickets.includes(ticket.id)

                    return (
                      <TableRow key={ticket.id} className={isSelected ? "bg-muted/50" : ""}>
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => handleTicketSelect(ticket.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell className="font-mono text-sm">{safeString(ticket.id) || "نامشخص"}</TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={safeString(ticket.title) || "بدون عنوان"}>
                            {safeString(ticket.title) || "بدون عنوان"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(ticket.status)}
                            <Badge className={statusColors[ticket.status] || statusColors.open}>
                              {statusLabels[ticket.status] || ticket.status}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={priorityColors[ticket.priority] || priorityColors.medium}>
                            {priorityLabels[ticket.priority] || ticket.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CategoryIcon className="w-4 h-4" />
                            <span className="text-sm">{categoryLabels[ticket.category] || ticket.category}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">
                                {getAvatarFallback(ticket.clientName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm font-medium">{getDisplayName(ticket.clientName)}</div>
                              <div className="text-xs text-muted-foreground">{safeString(ticket.clientEmail)}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {ticket.assignedTechnicianName ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-xs">
                                  {getAvatarFallback(ticket.assignedTechnicianName)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm">{getDisplayName(ticket.assignedTechnicianName)}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground">تعیین نشده</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString("fa-IR") : "نامشخص"}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handlePreviewTicket(ticket)}
                              className="gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              مشاهده
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditTicket(ticket)}
                              className="gap-1"
                            >
                              <Edit className="w-3 h-3" />
                              ویرایش
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRespondToTicket(ticket)}
                              className="gap-1"
                            >
                              <MessageSquare className="w-3 h-3" />
                              پاسخ
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Search className="w-8 h-8 text-muted-foreground" />
                        <p className="text-muted-foreground">تیکتی یافت نشد</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">جزئیات تیکت {selectedTicket?.id}</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-6">
              {/* Ticket Header */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      اطلاعات تیکت
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-xs text-muted-foreground">عنوان</Label>
                      <p className="font-medium">{getDisplayName(selectedTicket.title)}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">توضیحات</Label>
                      <p className="text-sm">{safeString(selectedTicket.description) || "توضیحی ارائه نشده"}</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(selectedTicket.status)}
                        <Badge className={statusColors[selectedTicket.status] || statusColors.open}>
                          {statusLabels[selectedTicket.status] || selectedTicket.status}
                        </Badge>
                      </div>
                      <Badge className={priorityColors[selectedTicket.priority] || priorityColors.medium}>
                        {priorityLabels[selectedTicket.priority] || selectedTicket.priority}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <User className="w-4 h-4" />
                      اطلاعات درخواست‌کننده
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback>{getAvatarFallback(selectedTicket.clientName)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{getDisplayName(selectedTicket.clientName)}</p>
                        <p className="text-sm text-muted-foreground">{safeString(selectedTicket.clientEmail)}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">تاریخ ایجاد</Label>
                      <p className="text-sm">
                        {selectedTicket.createdAt
                          ? new Date(selectedTicket.createdAt).toLocaleDateString("fa-IR")
                          : "نامشخص"}
                      </p>
                    </div>
                    {selectedTicket.assignedTechnicianName && (
                      <div>
                        <Label className="text-xs text-muted-foreground">تکنسین مسئول</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-xs">
                              {getAvatarFallback(selectedTicket.assignedTechnicianName)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{getDisplayName(selectedTicket.assignedTechnicianName)}</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm">عملیات سریع</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 flex-wrap">
                    <Select
                      value={selectedTicket.status}
                      onValueChange={(value) => handleStatusChange(selectedTicket.id, value)}
                      dir="rtl"
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">باز</SelectItem>
                        <SelectItem value="in-progress">در حال انجام</SelectItem>
                        <SelectItem value="resolved">حل شده</SelectItem>
                        <SelectItem value="closed">بسته</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={selectedTicket.priority}
                      onValueChange={(value) => handlePriorityChange(selectedTicket.id, value)}
                      dir="rtl"
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">کم</SelectItem>
                        <SelectItem value="medium">متوسط</SelectItem>
                        <SelectItem value="high">بالا</SelectItem>
                        <SelectItem value="urgent">فوری</SelectItem>
                      </SelectContent>
                    </Select>

                    <Button
                      onClick={() => {
                        setPreviewDialogOpen(false)
                        handleRespondToTicket(selectedTicket)
                      }}
                      className="gap-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      ارسال پاسخ
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Responses */}
              {selectedTicket.responses && selectedTicket.responses.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      پاسخ‌ها و تعاملات
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedTicket.responses.map((response, index) => (
                        <div
                          key={response.id || index}
                          className={`p-3 rounded-lg ${
                            response.type === "admin" ? "bg-blue-50 border-r-4 border-blue-500" : "bg-gray-50"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-xs">
                                  {getAvatarFallback(response.author)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm font-medium">{getDisplayName(response.author)}</span>
                              {response.type === "admin" && (
                                <Badge variant="secondary" className="text-xs">
                                  مدیر
                                </Badge>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {response.timestamp ? new Date(response.timestamp).toLocaleDateString("fa-IR") : "نامشخص"}
                            </span>
                          </div>
                          <p className="text-sm">{safeString(response.text)}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Response Dialog */}
      <Dialog open={responseDialogOpen} onOpenChange={setResponseDialogOpen}>
        <DialogContent className="max-w-2xl" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">ارسال پاسخ به تیکت {selectedTicket?.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="response">متن پاسخ</Label>
              <Textarea
                id="response"
                placeholder="پاسخ خود را اینجا بنویسید..."
                value={responseText}
                onChange={(e) => setResponseText(e.target.value)}
                className="min-h-32 text-right"
                dir="rtl"
              />
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setResponseDialogOpen(false)}>
                انصراف
              </Button>
              <Button onClick={handleSendResponse} disabled={!responseText.trim()} className="gap-2">
                <MessageSquare className="w-4 h-4" />
                ارسال پاسخ
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
