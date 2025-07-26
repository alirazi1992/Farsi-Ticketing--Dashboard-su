"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import { Users, UserCheck, UserX, Edit, Trash2, Award } from "lucide-react"

interface AdminTechnicianAssignmentProps {
  technicians: any[]
  tickets: any[]
  onTechnicianUpdate: (technicianId: string, updates: any) => void
  onTechnicianDelete: (technicianId: string) => void
  onTicketUpdate: (ticketId: string, updates: any) => void
}

export function AdminTechnicianAssignment({
  technicians = [],
  tickets = [],
  onTechnicianUpdate,
  onTechnicianDelete,
  onTicketUpdate,
}: AdminTechnicianAssignmentProps) {
  const [editingTechnician, setEditingTechnician] = useState<any>(null)
  const [assignmentDialog, setAssignmentDialog] = useState<any>(null)

  // Safe array access
  const safeTechnicians = Array.isArray(technicians) ? technicians : []
  const safeTickets = Array.isArray(tickets) ? tickets : []

  // Get unassigned tickets
  const unassignedTickets = safeTickets.filter((ticket) => !ticket.assignedTo || ticket.assignedTo === "")

  const handleTechnicianStatusToggle = (technicianId: string, isActive: boolean) => {
    onTechnicianUpdate(technicianId, { isActive })
    toast({
      title: isActive ? "تکنسین فعال شد" : "تکنسین غیرفعال شد",
      description: `وضعیت تکنسین با موفقیت تغییر یافت`,
    })
  }

  const handleEditTechnician = (formData: FormData) => {
    if (!editingTechnician) return

    const updates = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      specialties: (formData.get("specialties") as string).split(",").map((s) => s.trim()),
      skills: (formData.get("skills") as string).split(",").map((s) => s.trim()),
      experience: formData.get("experience") as string,
    }

    onTechnicianUpdate(editingTechnician.id, updates)
    setEditingTechnician(null)

    toast({
      title: "تکنسین ویرایش شد",
      description: "اطلاعات تکنسین با موفقیت به‌روزرسانی شد",
    })
  }

  const handleAssignTicket = (formData: FormData) => {
    if (!assignmentDialog) return

    const technicianId = formData.get("technician") as string
    const selectedTechnician = safeTechnicians.find((t) => t.id === technicianId)

    if (!selectedTechnician) return

    // Update ticket
    onTicketUpdate(assignmentDialog.id, {
      assignedTo: technicianId,
      assignedTechnicianName: selectedTechnician.name || "نامشخص",
      status: "in-progress",
    })

    // Update technician workload
    onTechnicianUpdate(technicianId, {
      workload: (selectedTechnician.workload || 0) + 1,
    })

    setAssignmentDialog(null)

    toast({
      title: "تیکت تخصیص یافت",
      description: `تیکت به ${selectedTechnician.name || "تکنسین"} تخصیص یافت`,
    })
  }

  const getWorkloadBadge = (workload: number) => {
    if (workload === 0) return <Badge variant="outline">آزاد</Badge>
    if (workload <= 2) return <Badge variant="default">عادی</Badge>
    if (workload <= 4) return <Badge variant="secondary">پرکار</Badge>
    return <Badge variant="destructive">بسیار پرکار</Badge>
  }

  return (
    <div className="space-y-6" dir="rtl">
      {/* Technicians List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {safeTechnicians.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">هیچ تکنسینی تعریف نشده است</p>
          </div>
        ) : (
          safeTechnicians.map((technician) => (
            <Card key={technician.id} className={`${!technician.isActive ? "opacity-60" : ""}`}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{technician.name || "نام نامشخص"}</CardTitle>
                    <p className="text-sm text-muted-foreground">{technician.email || "ایمیل نامشخص"}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {technician.isActive ? (
                      <UserCheck className="w-5 h-5 text-green-500" />
                    ) : (
                      <UserX className="w-5 h-5 text-red-500" />
                    )}
                    {getWorkloadBadge(technician.workload || 0)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">تخصص‌ها</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(technician.specialties || []).map((specialty: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">مهارت‌ها</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(technician.skills || []).map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span>سابقه کار:</span>
                  <span className="font-medium">{technician.experience || "نامشخص"}</span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span>تعداد تیکت‌ها:</span>
                  <span className="font-medium">{technician.workload || 0}</span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={technician.isActive}
                      onCheckedChange={(checked) => handleTechnicianStatusToggle(technician.id, checked)}
                    />
                    <Label className="text-sm">{technician.isActive ? "فعال" : "غیرفعال"}</Label>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Dialog
                    open={editingTechnician?.id === technician.id}
                    onOpenChange={(open) => setEditingTechnician(open ? technician : null)}
                  >
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Edit className="w-3 h-3 mr-1" />
                        ویرایش
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]" dir="rtl">
                      <form action={handleEditTechnician}>
                        <DialogHeader>
                          <DialogTitle className="text-right">ویرایش تکنسین</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="edit-name">نام و نام خانوادگی</Label>
                            <Input id="edit-name" name="name" defaultValue={technician.name || ""} required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-email">ایمیل</Label>
                            <Input
                              id="edit-email"
                              name="email"
                              type="email"
                              defaultValue={technician.email || ""}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-specialties">تخصص‌ها (با کاما جدا کنید)</Label>
                            <Input
                              id="edit-specialties"
                              name="specialties"
                              defaultValue={(technician.specialties || []).join(", ")}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-skills">مهارت‌ها (با کاما جدا کنید)</Label>
                            <Input
                              id="edit-skills"
                              name="skills"
                              defaultValue={(technician.skills || []).join(", ")}
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="edit-experience">سابقه کار</Label>
                            <Input
                              id="edit-experience"
                              name="experience"
                              defaultValue={technician.experience || ""}
                              required
                            />
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setEditingTechnician(null)}>
                            انصراف
                          </Button>
                          <Button type="submit">ذخیره</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTechnicianDelete(technician.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Unassigned Tickets */}
      {unassignedTickets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-right flex items-center gap-2">
              <Award className="w-5 h-5" />
              تیکت‌های تخصیص نیافته ({unassignedTickets.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {unassignedTickets.map((ticket) => (
                <div key={ticket.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{ticket.id}</span>
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
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{ticket.title || "بدون عنوان"}</p>
                    <p className="text-xs text-muted-foreground">درخواست‌کننده: {ticket.clientName || "نامشخص"}</p>
                  </div>
                  <Dialog
                    open={assignmentDialog?.id === ticket.id}
                    onOpenChange={(open) => setAssignmentDialog(open ? ticket : null)}
                  >
                    <DialogTrigger asChild>
                      <Button size="sm">تخصیص</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[400px]" dir="rtl">
                      <form action={handleAssignTicket}>
                        <DialogHeader>
                          <DialogTitle className="text-right">تخصیص تیکت</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2">
                            <Label>تیکت: {ticket.title}</Label>
                            <Label htmlFor="technician">انتخاب تکنسین</Label>
                            <Select name="technician" required>
                              <SelectTrigger>
                                <SelectValue placeholder="تکنسین را انتخاب کنید" />
                              </SelectTrigger>
                              <SelectContent>
                                {safeTechnicians
                                  .filter((t) => t.isActive)
                                  .map((technician) => (
                                    <SelectItem key={technician.id} value={technician.id}>
                                      <div className="flex items-center justify-between w-full">
                                        <span>{technician.name || "نامشخص"}</span>
                                        <Badge variant="outline" className="ml-2">
                                          {technician.workload || 0} تیکت
                                        </Badge>
                                      </div>
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setAssignmentDialog(null)}>
                            انصراف
                          </Button>
                          <Button type="submit">تخصیص</Button>
                        </div>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
