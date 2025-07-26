"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import {
  Printer,
  UserPlus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  HardDrive,
  ComputerIcon as Software,
  Network,
  Mail,
  Shield,
  Key,
  Users,
  Clock,
  Star,
  TrendingUp,
  Zap,
  Calendar,
} from "lucide-react"

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
    specialties: ["hardware", "network"],
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

export function AdminTicketManagement({ tickets, onTicketUpdate }: AdminTicketManagementProps) {
  const [technicians, setTechnicians] = useState(initialTechnicians)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterTechnician, setFilterTechnician] = useState("all")
  const [selectedTickets, setSelectedTickets] = useState<string[]>([])
  const [assignDialogOpen, setAssignDialogOpen] = useState(false)
  const [bulkAssignDialogOpen, setBulkAssignDialogOpen] = useState(false)
  const [selectedTicketForAssign, setSelectedTicketForAssign] = useState<any>(null)
  const [technicianFilter, setTechnicianFilter] = useState("all") // For filtering technicians in assignment dialog
  const [viewDialogOpen, setViewDialogOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<any>(null)

  // Update technician workload when tickets change
  useEffect(() => {
    const updatedTechnicians = technicians.map((tech) => {
      const assignedTickets = tickets.filter(
        (ticket) => ticket.assignedTo === tech.id && (ticket.status === "open" || ticket.status === "in-progress"),
      )

      return {
        ...tech,
        activeTickets: assignedTickets.length,
        status: assignedTickets.length >= 5 ? "busy" : "available",
      }
    })

    setTechnicians(updatedTechnicians)
  }, [tickets])

  // Filter tickets based on search and filters
  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.clientName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = filterStatus === "all" || ticket.status === filterStatus
    const matchesPriority = filterPriority === "all" || ticket.priority === filterPriority
    const matchesCategory = filterCategory === "all" || ticket.category === filterCategory
    const matchesTechnician =
      filterTechnician === "all" ||
      (filterTechnician === "unassigned" && !ticket.assignedTo) ||
      ticket.assignedTo === filterTechnician

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesTechnician
  })

  // Get recommended technicians for a specific ticket
  const getRecommendedTechnicians = (ticket: any) => {
    return technicians
      .filter((tech) => tech.specialties.includes(ticket.category))
      .sort((a, b) => {
        // Sort by: 1. Availability, 2. Rating, 3. Workload (ascending)
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

    // Filter by specialty if we have a specific ticket
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
      // Always prioritize available technicians
      if (a.status !== b.status) {
        return a.status === "available" ? -1 : 1
      }
      // Then by rating
      if (a.rating !== b.rating) {
        return b.rating - a.rating
      }
      // Finally by workload
      return a.activeTickets - b.activeTickets
    })
  }

  // Handle ticket selection for bulk operations
  const handleTicketSelect = (ticketId: string) => {
    setSelectedTickets((prev) => (prev.includes(ticketId) ? prev.filter((id) => id !== ticketId) : [...prev, ticketId]))
  }

  // Handle select all tickets
  const handleSelectAll = () => {
    if (selectedTickets.length === filteredTickets.length) {
      setSelectedTickets([])
    } else {
      setSelectedTickets(filteredTickets.map((ticket) => ticket.id))
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
                  <td>${ticket.id}</td>
                  <td>${ticket.title}</td>
                  <td class="status-${ticket.status}">${statusLabels[ticket.status]}</td>
                  <td class="priority-${ticket.priority}">${priorityLabels[ticket.priority]}</td>
                  <td>${categoryLabels[ticket.category]}</td>
                  <td>${ticket.clientName}</td>
                  <td>${ticket.assignedTechnicianName || "تعیین نشده"}</td>
                  <td>${new Date(ticket.createdAt).toLocaleDateString("fa-IR")}</td>
                  <td>${new Date(ticket.updatedAt).toLocaleDateString("fa-IR")}</td>
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

  // Handle export to CSV
  const handleExportCSV = () => {
    const ticketsToExport =
      selectedTickets.length > 0
        ? filteredTickets.filter((ticket) => selectedTickets.includes(ticket.id))
        : filteredTickets

    const csvContent = [
      [
        "شماره تیکت",
        "عنوان",
        "وضعیت",
        "اولویت",
        "دسته‌بندی",
        "درخواست‌کننده",
        "تکنسین",
        "تاریخ ایجاد",
        "آخرین به‌روزرسانی",
      ],
      ...ticketsToExport.map((ticket) => [
        ticket.id,
        ticket.title,
        statusLabels[ticket.status],
        priorityLabels[ticket.priority],
        categoryLabels[ticket.category],
        ticket.clientName,
        ticket.assignedTechnicianName || "تعیین نشده",
        new Date(ticket.createdAt).toLocaleDateString("fa-IR"),
        new Date(ticket.updatedAt).toLocaleDateString("fa-IR"),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `tickets-report-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Automatic assignment logic
  const getAutomaticAssignment = (ticket: any, technicians: any[]) => {
    const availableTechnicians = technicians.filter((tech) => tech.status === "available")

    if (availableTechnicians.length === 0) {
      return null
    }

    const specialtyMatches = availableTechnicians.filter((tech) => tech.specialties.includes(ticket.category))

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
            <AvatarFallback className="text-sm font-medium">{technician.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <p className="font-medium">{technician.name}</p>
              {showRecommended && <Star className="w-4 h-4 text-yellow-500 fill-current" />}
            </div>
            <p className="text-sm text-muted-foreground">{technician.email}</p>
          </div>
        </div>
        <div className="text-left">
          <Badge variant={technician.status === "available" ? "default" : "secondary"} className="mb-1">
            {technician.status === "available" ? "آزاد" : "مشغول"}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="w-3 h-3 fill-current text-yellow-500" />
            <span>{technician.rating}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex gap-1 flex-wrap">
          {technician.specialties.map((specialty) => (
            <Badge key={specialty} variant="outline" className="text-xs">
              {categoryLabels[specialty]}
            </Badge>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{technician.activeTickets} تیکت فعال</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>{technician.completedTickets} تکمیل شده</span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          <span>میانگین پاسخ: {technician.avgResponseTime}</span>
        </div>

        {technician.expertise && (
          <div className="text-xs">
            <p className="text-muted-foreground mb-1">تخصص‌ها:</p>
            <p className="text-right">{technician.expertise.join("، ")}</p>
          </div>
        )}
      </div>
    </div>
  )

  // Add this after the existing handleViewTicket function (around line 300)
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
                      {/* Technician Filter */}
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
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
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
                <SelectItem value="low">کم</SelectItem>
                <SelectItem value="medium">متوسط</SelectItem>
                <SelectItem value="high">بالا</SelectItem>
                <SelectItem value="urgent">فوری</SelectItem>
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

            <Select value={filterTechnician} onValueChange={setFilterTechnician} dir="rtl">
              <SelectTrigger className="text-right">
                <SelectValue placeholder="تکنسین" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه تکنسین‌ها</SelectItem>
                <SelectItem value="unassigned">تعیین نشده</SelectItem>
                {technicians.map((tech) => (
                  <SelectItem key={tech.id} value={tech.id}>
                    {tech.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setFilterStatus("all")
                setFilterPriority("all")
                setFilterCategory("all")
                setFilterTechnician("all")
              }}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              پاک کردن فیلترها
            </Button>
          </div>

          {/* Results Summary */}
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground text-right">
              نمایش {filteredTickets.length} از {tickets.length} تیکت
              {selectedTickets.length > 0 && ` - ${selectedTickets.length} انتخاب شده`}
            </p>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedTickets.length === filteredTickets.length && filteredTickets.length > 0}
                onChange={handleSelectAll}
                className="rounded"
              />
              <Label className="text-sm">انتخاب همه</Label>
            </div>
          </div>

          {/* Tickets Table */}
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12 text-center">انتخاب</TableHead>
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
                    const CategoryIcon = categoryIcons[ticket.category]
                    const assignedTech = technicians.find((tech) => tech.id === ticket.assignedTo)

                    return (
                      <TableRow key={ticket.id}>
                        <TableCell className="text-center">
                          <input
                            type="checkbox"
                            checked={selectedTickets.includes(ticket.id)}
                            onChange={() => handleTicketSelect(ticket.id)}
                            className="rounded"
                          />
                        </TableCell>
                        <TableCell className="font-mono text-sm">{ticket.id}</TableCell>
                        <TableCell className="max-w-xs">
                          <div className="truncate" title={ticket.title}>
                            {ticket.title}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={statusColors[ticket.status]}>{statusLabels[ticket.status]}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={priorityColors[ticket.priority]}>{priorityLabels[ticket.priority]}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <CategoryIcon className="w-4 h-4" />
                            <span className="text-sm">{categoryLabels[ticket.category]}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">{ticket.clientName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{ticket.clientName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {ticket.assignedTechnicianName ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-xs">
                                  {ticket.assignedTechnicianName.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <span className="text-sm">{ticket.assignedTechnicianName}</span>
                                {assignedTech && (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Badge
                                      variant={assignedTech.status === "available" ? "default" : "secondary"}
                                      className="text-xs"
                                    >
                                      {assignedTech.status === "available" ? "آزاد" : "مشغول"}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedTicketForAssign(ticket)
                                  setTechnicianFilter("recommended")
                                  setAssignDialogOpen(true)
                                }}
                                className="gap-1"
                              >
                                <UserPlus className="w-3 h-3" />
                                دستی
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleAutoAssign(ticket)}
                                className="gap-1 text-blue-600 hover:text-blue-700 border-blue-200 hover:border-blue-300"
                              >
                                <Zap className="w-3 h-3" />
                                خودکار
                              </Button>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(ticket.createdAt).toLocaleDateString("fa-IR")}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewTicket(ticket)}
                              className="gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              مشاهده
                            </Button>
                            {ticket.assignedTechnicianName && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1"
                                onClick={() => {
                                  setSelectedTicketForAssign(ticket)
                                  setTechnicianFilter("all")
                                  setAssignDialogOpen(true)
                                }}
                              >
                                <Edit className="w-3 h-3" />
                                تغییر
                              </Button>
                            )}
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

      {/* Individual Assign Technician Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">تعیین تکنسین برای تیکت {selectedTicketForAssign?.id}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Ticket Info */}
            <div className="bg-muted p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="text-right">
                  <h4 className="font-medium">{selectedTicketForAssign?.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    دسته‌بندی: {selectedTicketForAssign && categoryLabels[selectedTicketForAssign.category]} | اولویت:{" "}
                    {selectedTicketForAssign && priorityLabels[selectedTicketForAssign.priority]}
                  </p>
                </div>
                <Badge className={selectedTicketForAssign && priorityColors[selectedTicketForAssign.priority]}>
                  {selectedTicketForAssign && priorityLabels[selectedTicketForAssign.priority]}
                </Badge>
              </div>
            </div>

            {/* Technician Filter */}
            <div className="flex gap-2 items-center">
              <Label className="text-sm font-medium">فیلتر تکنسین‌ها:</Label>
              <Select value={technicianFilter} onValueChange={setTechnicianFilter} dir="rtl">
                <SelectTrigger className="w-48 text-right">
                  <SelectValue placeholder="فیلتر تکنسین‌ها" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">پیشنهادی</SelectItem>
                  <SelectItem value="all">همه تکنسین‌ها</SelectItem>
                  <SelectItem value="available">آزاد</SelectItem>
                  <SelectItem value="busy">مشغول</SelectItem>
                  <Separator />
                  <SelectItem value="hardware">متخصص سخت‌افزار</SelectItem>
                  <SelectItem value="software">متخصص نرم‌افزار</SelectItem>
                  <SelectItem value="network">متخصص شبکه</SelectItem>
                  <SelectItem value="email">متخصص ایمیل</SelectItem>
                  <SelectItem value="security">متخصص امنیت</SelectItem>
                  <SelectItem value="access">متخصص دسترسی</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Recommended Technicians */}
            {technicianFilter === "recommended" && selectedTicketForAssign && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <h4 className="font-medium text-right">تکنسین‌های پیشنهادی برای این تیکت</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getRecommendedTechnicians(selectedTicketForAssign).map((technician, index) => (
                    <TechnicianCard
                      key={technician.id}
                      technician={technician}
                      ticket={selectedTicketForAssign}
                      onAssign={(techId) => handleAssignTechnician(selectedTicketForAssign.id, techId)}
                      showRecommended={index < 2} // Show star for top 2 recommendations
                    />
                  ))}
                </div>
              </div>
            )}

            {/* All Technicians */}
            {technicianFilter !== "recommended" && (
              <div className="space-y-3">
                <h4 className="font-medium text-right">
                  {technicianFilter === "all"
                    ? "همه تکنسین‌ها"
                    : technicianFilter === "available"
                      ? "تکنسین‌های آزاد"
                      : technicianFilter === "busy"
                        ? "تکنسین‌های مشغول"
                        : `متخصصان ${categoryLabels[technicianFilter] || technicianFilter}`}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getFilteredTechnicians(selectedTicketForAssign).map((technician) => (
                    <TechnicianCard
                      key={technician.id}
                      technician={technician}
                      ticket={selectedTicketForAssign}
                      onAssign={(techId) => handleAssignTechnician(selectedTicketForAssign.id, techId)}
                    />
                  ))}
                </div>
              </div>
            )}

            {getFilteredTechnicians(selectedTicketForAssign).length === 0 && (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground">تکنسینی یافت نشد</h3>
                <p className="text-sm text-muted-foreground mt-1">فیلتر خود را تغییر دهید یا تکنسین جدیدی اضافه کنید</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* View Ticket Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right">جزئیات تیکت {selectedTicket?.id}</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-6">
              {/* Ticket Header */}
              <div className="flex justify-between items-start">
                <div className="text-right space-y-2">
                  <h3 className="text-xl font-semibold">{selectedTicket.title}</h3>
                  <div className="flex gap-2">
                    <Badge className={statusColors[selectedTicket.status]}>{statusLabels[selectedTicket.status]}</Badge>
                    <Badge className={priorityColors[selectedTicket.priority]}>
                      {priorityLabels[selectedTicket.priority]}
                    </Badge>
                  </div>
                </div>
                <div className="text-left space-y-1">
                  <p className="text-sm text-muted-foreground">شماره تیکت</p>
                  <p className="font-mono text-lg">{selectedTicket.id}</p>
                </div>
              </div>

              <Separator />

              {/* Ticket Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">اطلاعات کلی</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">دسته‌بندی:</span>
                        <span>{categoryLabels[selectedTicket.category]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">زیر دسته:</span>
                        <span>{selectedTicket.subcategory}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">تاریخ ایجاد:</span>
                        <span>{new Date(selectedTicket.createdAt).toLocaleDateString("fa-IR")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">آخرین به‌روزرسانی:</span>
                        <span>{new Date(selectedTicket.updatedAt).toLocaleDateString("fa-IR")}</span>
                      </div>
                    </div>
                  </div>

                  {selectedTicket.assignedTechnicianName && (
                    <div>
                      <h4 className="font-medium mb-2">تکنسین مسئول</h4>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback>{selectedTicket.assignedTechnicianName.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span>{selectedTicket.assignedTechnicianName}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">اطلاعات تماس</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">نام:</span>
                        <span>{selectedTicket.clientName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">ایمیل:</span>
                        <span>{selectedTicket.clientEmail}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">تلفن:</span>
                        <span>{selectedTicket.clientPhone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">بخش:</span>
                        <span>{selectedTicket.department}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h4 className="font-medium mb-2">شرح مشکل</h4>
                <div className="bg-muted p-4 rounded-lg text-right">
                  <p className="whitespace-pre-wrap">{selectedTicket.description}</p>
                </div>
              </div>

              {/* Responses */}
              {selectedTicket.responses && selectedTicket.responses.length > 0 && (
                <div>
                  <h4 className="font-medium mb-4">پاسخ‌ها و به‌روزرسانی‌ها</h4>
                  <div className="space-y-4">
                    {selectedTicket.responses.map((response: any, index: number) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="text-xs">
                                {response.technicianName?.charAt(0) || "T"}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm">{response.technicianName}</span>
                          </div>
                          <div className="text-left">
                            <Badge className={statusColors[response.status]}>{statusLabels[response.status]}</Badge>
                            <p className="text-xs text-muted-foreground flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(response.timestamp).toLocaleDateString("fa-IR")} -
                              {new Date(response.timestamp).toLocaleTimeString("fa-IR")}
                            </p>
                          </div>
                        </div>
                        <div className="bg-muted/50 p-3 rounded text-right">
                          <p className="whitespace-pre-wrap">{response.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
