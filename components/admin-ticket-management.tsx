"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Search, Eye, Edit, MessageSquare, Tag } from "lucide-react"

interface AdminTicketManagementProps {
  tickets: any[]
  onTicketUpdate: (ticketId: string, updates: any) => void
  onTicketPreview: (ticket: any) => void
}

export function AdminTicketManagement({ tickets = [], onTicketUpdate, onTicketPreview }: AdminTicketManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [editingTicket, setEditingTicket] = useState<any>(null)
  const [responseDialog, setResponseDialog] = useState<any>(null)

  // Safe array access
  const safeTickets = Array.isArray(tickets) ? tickets : []

  // Filter tickets
  const filteredTickets = safeTickets.filter((ticket) => {
    const matchesSearch =
      (ticket.title && ticket.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ticket.id && ticket.id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (ticket.clientName && ticket.clientName.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || ticket.status === statusFilter
    const matchesPriority = priorityFilter === "all" || ticket.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesPriority
  })

  const handleStatusChange = (ticketId: string, newStatus: string) => {
    onTicketUpdate(ticketId, { status: newStatus })
    toast({
      title: "وضعیت تیکت تغییر کرد",
      description: `وضعیت تیکت به "${newStatus === "open" ? "باز" : newStatus === "in-progress" ? "در حال انجام" : "حل شده"}" تغییر یافت`,
    })
  }

  const handlePriorityChange = (ticketId: string, newPriority: string) => {
    onTicketUpdate(ticketId, { priority: newPriority })
    toast({
      title: "اولویت تیکت تغییر کرد",
      description: `اولویت تیکت به "${newPriority === "urgent" ? "فوری" : newPriority === "high" ? "بالا" : newPriority === "medium" ? "متوسط" : "پایین"}" تغییر یافت`,
    })
  }

  const handleEditTicket = (formData: FormData) => {
    if (!editingTicket) return

    const updates = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
    }

    onTicketUpdate(editingTicket.id, updates)
    setEditingTicket(null)

    toast({
      title: "تیکت ویرایش شد",
      description: "تغییرات با موفقیت ذخیره شد",
    })
  }

  const handleAddResponse = (formData: FormData) => {
    if (!responseDialog) return

    const newResponse = {
      id: `resp-${Date.now()}`,
      text: formData.get("response") as string,
      author: "مدیر سیستم",
      timestamp: new Date().toISOString(),
      type: "admin",
    }

    const updatedResponses = [...(responseDialog.responses || []), newResponse]
    onTicketUpdate(responseDialog.id, { responses: updatedResponses })
    setResponseDialog(null)

    toast({
      title: "پاسخ اضافه شد",
      description: "پاسخ شما با موفقیت ثبت شد",
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
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="destructive">فوری</Badge>
      case "high":
        return <Badge className="bg-orange-500 hover:bg-orange-600">بالا</Badge>
      case "medium":
        return <Badge variant="secondary">متوسط</Badge>
      case "low":
        return <Badge variant="outline">پایین</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  return (
    <div className="space-y-6" dir="rtl">
      <Card>
        <CardHeader>
          <CardTitle className="text-right flex items-center gap-2">
            <Tag className="w-5 h-5" />
            مدیریت تیکت‌ها
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="جستجو در تیکت‌ها..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="وضعیت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه وضعیت‌ها</SelectItem>
                <SelectItem value="open">باز</SelectItem>
                <SelectItem value="in-progress">در حال انجام</SelectItem>
                <SelectItem value="resolved">حل شده</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="اولویت" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">همه اولویت‌ها</SelectItem>
                <SelectItem value="urgent">فوری</SelectItem>
                <SelectItem value="high">بالا</SelectItem>
                <SelectItem value="medium">متوسط</SelectItem>
                <SelectItem value="low">پایین</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tickets Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">شماره</TableHead>
                  <TableHead className="text-right">عنوان</TableHead>
                  <TableHead className="text-right">درخواست‌کننده</TableHead>
                  <TableHead className="text-right">وضعیت</TableHead>
                  <TableHead className="text-right">اولویت</TableHead>
                  <TableHead className="text-right">تکنسین</TableHead>
                  <TableHead className="text-right">تاریخ</TableHead>
                  <TableHead className="text-right">عملیات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="text-muted-foreground">
                        {safeTickets.length === 0 ? "هیچ تیکتی موجود نیست" : "هیچ تیکتی با فیلترهای انتخابی یافت نشد"}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell className="font-medium">{ticket.id || "نامشخص"}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{ticket.title || "بدون عنوان"}</TableCell>
                      <TableCell>{ticket.clientName || "نامشخص"}</TableCell>
                      <TableCell>
                        <Select
                          value={ticket.status || "open"}
                          onValueChange={(value) => handleStatusChange(ticket.id, value)}
                        >
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">باز</SelectItem>
                            <SelectItem value="in-progress">در حال انجام</SelectItem>
                            <SelectItem value="resolved">حل شده</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={ticket.priority || "medium"}
                          onValueChange={(value) => handlePriorityChange(ticket.id, value)}
                        >
                          <SelectTrigger className="w-[100px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="urgent">فوری</SelectItem>
                            <SelectItem value="high">بالا</SelectItem>
                            <SelectItem value="medium">متوسط</SelectItem>
                            <SelectItem value="low">پایین</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{ticket.assignedTechnicianName || "تخصیص نیافته"}</TableCell>
                      <TableCell>
                        {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString("fa-IR") : "نامشخص"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" onClick={() => onTicketPreview(ticket)}>
                            <Eye className="w-3 h-3" />
                          </Button>
                          <Dialog
                            open={editingTicket?.id === ticket.id}
                            onOpenChange={(open) => setEditingTicket(open ? ticket : null)}
                          >
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Edit className="w-3 h-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]" dir="rtl">
                              <form action={handleEditTicket}>
                                <DialogHeader>
                                  <DialogTitle className="text-right">ویرایش تیکت</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-title">عنوان</Label>
                                    <Input id="edit-title" name="title" defaultValue={ticket.title || ""} required />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-description">توضیحات</Label>
                                    <Textarea
                                      id="edit-description"
                                      name="description"
                                      defaultValue={ticket.description || ""}
                                      required
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-category">دسته‌بندی</Label>
                                    <Input
                                      id="edit-category"
                                      name="category"
                                      defaultValue={ticket.category || ""}
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button type="button" variant="outline" onClick={() => setEditingTicket(null)}>
                                    انصراف
                                  </Button>
                                  <Button type="submit">ذخیره</Button>
                                </div>
                              </form>
                            </DialogContent>
                          </Dialog>
                          <Dialog
                            open={responseDialog?.id === ticket.id}
                            onOpenChange={(open) => setResponseDialog(open ? ticket : null)}
                          >
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MessageSquare className="w-3 h-3" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]" dir="rtl">
                              <form action={handleAddResponse}>
                                <DialogHeader>
                                  <DialogTitle className="text-right">افزودن پاسخ</DialogTitle>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="response">پاسخ</Label>
                                    <Textarea
                                      id="response"
                                      name="response"
                                      placeholder="پاسخ خود را وارد کنید..."
                                      required
                                    />
                                  </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button type="button" variant="outline" onClick={() => setResponseDialog(null)}>
                                    انصراف
                                  </Button>
                                  <Button type="submit">ارسال پاسخ</Button>
                                </div>
                              </form>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
