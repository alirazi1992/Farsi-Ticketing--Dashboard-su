"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TwoStepTicketForm } from "@/components/two-step-ticket-form"
import { useAuth } from "@/lib/auth-context"
import { toast } from "@/hooks/use-toast"
import {
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Search,
  UserCheck,
  XCircle,
  SpaceIcon as Room,
  SpaceIcon as Room,
  BracketsIcon as Bridge,
  TrainFrontTunnelIcon as Tunnel,
  WallpaperIcon as Wall,
  CombineIcon as Comb,
  GlassWaterIcon as Glass,
  BoxIcon as Can,
  GlassWaterIcon as Glass,
  SquircleIcon as Sponge,
  BoxIcon as Can,
  HardDriveIcon as Hard,
  HeaterIcon as Hot,
  TreesIcon as Wood,
  BoxIcon as Can,
  PenIcon as Pan,
  MilkIcon as Butter,
  BeakerIcon as Bee,
  AntennaIcon as Ant,
  BeakerIcon as Bee,
  DotIcon as Tick,
  FlameIcon as Fire,
  CrownIcon as Crow,
  BoxIcon as Can,
  TreesIcon as Wood,
  PiggyBankIcon as Pig,
  UtensilsIcon as Spoon,
  TreesIcon as Wood,
  RadarIcon as Razor,
  DotIcon as Dove,
  BirdIcon as Albatross,
  PawPrintIcon as Petrel,
  FlameIcon as Flamingo,
  ItalicIcon as Ibis,
  UtensilsIcon as Spoon,
  StickerIcon as Stork,
  BirdIcon as Heron,
  BirdIcon as Egret,
  BirdIcon as Bittern,
  ConeIcon as Crane,
  RailSymbolIcon as Rail,
  CogIcon as Coot,
  BirdIcon as Moorhen,
  BirdIcon as Gallinule,
  XIcon as Jacana,
  BirdIcon as Plover,
  BirdIcon as Sandpiper,
  SignpostIcon as Turnstone,
  BirdIcon as Curlew,
  BirdIcon as Godwit,
  SnailIcon as Snipe,
  TreesIcon as Wood,
  BirdIcon as Phalarope,
  BirdIcon as Skua,
  GaugeIcon as Jaeger,
  GavelIcon as Gull,
  TerminalIcon as Tern,
  ScanIcon as Skimmer,
  AwardIcon as Auk,
  BirdIcon as Puffin,
  MouseIcon as Murre,
  BirdIcon as Guillemot,
  RadarIcon as Razor,
  DotIcon as Dove,
  BirdIcon as Cormorant,
  ShuffleIcon as Shag,
  BirdIcon as Gannet,
  BabyIcon as Booby,
  BirdIcon as Frigatebird,
  BirdIcon as Tropicbird,
  PawPrintIcon as Petrel,
  BirdIcon as Shearwater,
  FigmaIcon as Fulmar,
  BirdIcon as Albatross,
  TornadoIcon as Storm,
  PawPrintIcon as Petrel,
  MoonIcon as Loon,
  BirdIcon as Grebe,
} from "lucide-react"

interface ClientDashboardProps {
  onLogout: () => void
}

export function ClientDashboard({ onLogout }: ClientDashboardProps) {
  const { user } = useAuth()
  const [showTicketForm, setShowTicketForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Mock tickets data
  const [tickets, setTickets] = useState([
    {
      id: "1",
      title: "مشکل در اتصال به ایمیل",
      category: "email",
      priority: "high",
      status: "open",
      createdAt: "2024-01-15T10:30:00Z",
      description: "نمی‌توانم به ایمیل خود دسترسی پیدا کنم",
      response: null,
      assignedTechnician: null,
    },
    {
      id: "2",
      title: "درخواست نصب نرم‌افزار",
      category: "software",
      priority: "medium",
      status: "in-progress",
      createdAt: "2024-01-14T14:20:00Z",
      description: "نیاز به نصب Adobe Photoshop دارم",
      response: "در حال بررسی درخواست شما هستیم",
      assignedTechnician: "علی احمدی",
    },
    {
      id: "3",
      title: "مشکل در پرینتر",
      category: "hardware",
      priority: "low",
      status: "resolved",
      createdAt: "2024-01-13T09:15:00Z",
      description: "پرینتر کاغذ گیر می‌کند",
      response: "مشکل حل شد. پرینتر تمیز و تنظیم گردید",
      assignedTechnician: "محمد حسینی",
    },
  ])

  const handleTicketSubmit = (ticketData: any) => {
    const newTicket = {
      id: Date.now().toString(),
      ...ticketData,
      status: "open",
      createdAt: new Date().toISOString(),
      response: null,
      assignedTechnician: null,
    }
    setTickets([newTicket, ...tickets])
    setShowTicketForm(false)
    toast({
      title: "تیکت ثبت شد",
      description: "درخواست شما با موفقیت ثبت گردید",
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge variant="destructive">باز</Badge>
      case "in-progress":
        return <Badge variant="secondary">در حال انجام</Badge>
      case "resolved":
        return <Badge variant="default">حل شده</Badge>
      default:
        return <Badge variant="outline">نامشخص</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="destructive">فوری</Badge>
      case "high":
        return <Badge variant="destructive">بالا</Badge>
      case "medium":
        return <Badge variant="secondary">متوسط</Badge>
      case "low":
        return <Badge variant="outline">پایین</Badge>
      default:
        return <Badge variant="outline">نامشخص</Badge>
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "hardware":
        return "سخت‌افزار"
      case "software":
        return "نرم‌افزار"
      case "network":
        return "شبکه"
      case "email":
        return "ایمیل"
      case "access":
        return "دسترسی"
      case "security":
        return "امنیت"
      default:
        return "سایر"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in-progress").length,
    resolved: tickets.filter((t) => t.status === "resolved").length,
  }

  return (
    <div className="container mx-auto p-6 space-y-6" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-right">پنل کاربری</h1>
          <p className="text-muted-foreground text-right">مدیریت درخواست‌های پشتیبانی</p>
        </div>
        <Button onClick={() => setShowTicketForm(true)} className="gap-2">
          <Plus className="w-4 h-4" />
          ثبت تیکت جدید
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">کل تیکت‌ها</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">{stats.total}</div>
            <p className="text-xs text-muted-foreground text-right">تعداد کل درخواست‌ها</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">باز</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">{stats.open}</div>
            <p className="text-xs text-muted-foreground text-right">در انتظار بررسی</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">در حال انجام</CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground text-right">در حال پردازش</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-right">حل شده</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-right">{stats.resolved}</div>
            <p className="text-xs text-muted-foreground text-right">با موفقیت حل شده</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">جستجو و فیلتر</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="جستجو در تیکت‌ها..."
                className="w-full pr-10 pl-4 py-2 border rounded-md text-right"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                dir="rtl"
              />
            </div>
            <select
              className="px-4 py-2 border rounded-md text-right"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              dir="rtl"
            >
              <option value="all">همه وضعیت‌ها</option>
              <option value="open">باز</option>
              <option value="in-progress">در حال انجام</option>
              <option value="resolved">حل شده</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-right">تیکت‌های من</CardTitle>
          <CardDescription className="text-right">لیست درخواست‌های پشتیبانی شما</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTickets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Ticket className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>هیچ تیکتی یافت نشد</p>
                <p className="text-sm">برای ثبت تیکت جدید روی دکمه "ثبت تیکت جدید" کلیک کنید</p>
              </div>
            ) : (
              filteredTickets.map((ticket) => (
                <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-right mb-1">{ticket.title}</h3>
                        <p className="text-sm text-muted-foreground text-right mb-2">{ticket.description}</p>
                        <div className="flex gap-2 justify-end">
                          <Badge variant="outline">{getCategoryLabel(ticket.category)}</Badge>
                          {getPriorityBadge(ticket.priority)}
                          {getStatusBadge(ticket.status)}
                        </div>
                      </div>
                      <div className="text-left mr-4">
                        <p className="text-xs text-muted-foreground mb-1">تاریخ ثبت: {formatDate(ticket.createdAt)}</p>
                        <p className="text-xs text-muted-foreground">شماره تیکت: #{ticket.id}</p>
                      </div>
                    </div>

                    {ticket.assignedTechnician && (
                      <div className="bg-blue-50 p-3 rounded-md mb-3">
                        <div className="flex items-center gap-2 justify-end">
                          <span className="text-sm">تکنسین تعیین شده:</span>
                          <UserCheck className="w-4 h-4 text-blue-600" />
                        </div>
                        <p className="text-sm font-medium text-blue-800 text-right">{ticket.assignedTechnician}</p>
                      </div>
                    )}

                    {ticket.response && (
                      <div className="bg-green-50 p-3 rounded-md">
                        <div className="flex items-center gap-2 justify-end mb-2">
                          <span className="text-sm font-medium">پاسخ تکنسین:</span>
                          <MessageSquare className="w-4 h-4 text-green-600" />
                        </div>
                        <p className="text-sm text-green-800 text-right">{ticket.response}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Ticket Form Dialog */}
      {showTicketForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-right">ثبت تیکت جدید</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowTicketForm(false)}>
                <XCircle className="w-4 h-4" />
              </Button>
            </div>
            <TwoStepTicketForm onSubmit={handleTicketSubmit} onCancel={() => setShowTicketForm(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
