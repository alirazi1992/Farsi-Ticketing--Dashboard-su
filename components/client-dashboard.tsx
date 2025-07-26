"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TwoStepTicketForm } from "./two-step-ticket-form"
import { Plus, Clock, CheckCircle, AlertCircle, XCircle, Eye } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"

interface ClientDashboardProps {
  tickets: any[]
  onTicketCreate: (ticket: any) => void
  currentUser: any
  categoriesData: any
}

export function ClientDashboard({ tickets, onTicketCreate, currentUser, categoriesData }: ClientDashboardProps) {
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [ticketDialogOpen, setTicketDialogOpen] = useState(false)
  const [createTicketDialogOpen, setCreateTicketDialogOpen] = useState(false)

  // Filter tickets for current user
  const userTickets = tickets.filter((ticket) => ticket.clientEmail === currentUser.email)

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { label: "باز", variant: "destructive" as const, icon: AlertCircle },
      "in-progress": { label: "در حال بررسی", variant: "default" as const, icon: Clock },
      resolved: { label: "حل شده", variant: "secondary" as const, icon: CheckCircle },
      closed: { label: "بسته شده", variant: "outline" as const, icon: XCircle },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.open
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const priorityConfig = {
      urgent: { label: "فوری", className: "bg-red-100 text-red-800 border-red-200" },
      high: { label: "بالا", className: "bg-orange-100 text-orange-800 border-orange-200" },
      medium: { label: "متوسط", className: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      low: { label: "پایین", className: "bg-green-100 text-green-800 border-green-200" },
    }

    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium

    return <Badge className={config.className}>{config.label}</Badge>
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

  const handleTicketCreate = (ticketData: any) => {
    onTicketCreate(ticketData)
    setCreateTicketDialogOpen(false)
  }

  return (
    <div className="space-y-6" dir="rtl">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-right">داشبورد کاربر</CardTitle>
              <p className="text-muted-foreground text-right mt-1">مدیریت تیکت‌های شما</p>
            </div>
            <Dialog open={createTicketDialogOpen} onOpenChange={setCreateTicketDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  تیکت جدید
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
                <DialogHeader>
                  <DialogTitle className="text-right">ایجاد تیکت جدید</DialogTitle>
                </DialogHeader>
                <TwoStepTicketForm
                  onSubmit={handleTicketCreate}
                  currentUser={currentUser}
                  categoriesData={categoriesData}
                />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{userTickets.length}</div>
                  <div className="text-sm text-muted-foreground">کل تیکت‌ها</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {userTickets.filter((t) => t.status === "open" || t.status === "in-progress").length}
                  </div>
                  <div className="text-sm text-muted-foreground">در حال بررسی</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {userTickets.filter((t) => t.status === "resolved").length}
                  </div>
                  <div className="text-sm text-muted-foreground">حل شده</div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {userTickets.filter((t) => t.status === "closed").length}
                  </div>
                  <div className="text-sm text-muted-foreground">بسته شده</div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">همه تیکت‌ها</TabsTrigger>
              <TabsTrigger value="open">باز</TabsTrigger>
              <TabsTrigger value="in-progress">در حال بررسی</TabsTrigger>
              <TabsTrigger value="resolved">حل شده</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {userTickets.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground">هنوز تیکتی ایجاد نکرده‌اید</div>
                  <Button className="mt-4 gap-2" onClick={() => setCreateTicketDialogOpen(true)}>
                    <Plus className="w-4 h-4" />
                    اولین تیکت خود را ایجاد کنید
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {userTickets.map((ticket) => (
                    <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-right">{ticket.title}</h3>
                              <Badge variant="outline" className="text-xs">
                                {ticket.id}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground text-right mb-3 line-clamp-2">
                              {ticket.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {getStatusBadge(ticket.status)}
                              {getPriorityBadge(ticket.priority)}
                              <Badge variant="outline">
                                {categoriesData[ticket.category]?.label || ticket.category}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center text-xs text-muted-foreground">
                              <span>ایجاد شده: {formatDate(ticket.createdAt)}</span>
                              {ticket.assignedTechnicianName && <span>تکنسین: {ticket.assignedTechnicianName}</span>}
                            </div>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 bg-transparent"
                                onClick={() => setSelectedTicket(ticket)}
                              >
                                <Eye className="w-4 h-4" />
                                مشاهده
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
                              <DialogHeader>
                                <DialogTitle className="text-right">جزئیات تیکت {ticket.id}</DialogTitle>
                              </DialogHeader>
                              {selectedTicket && (
                                <div className="space-y-4">
                                  <div>
                                    <h3 className="font-semibold text-right mb-2">{selectedTicket.title}</h3>
                                    <p className="text-sm text-muted-foreground text-right">
                                      {selectedTicket.description}
                                    </p>
                                  </div>

                                  <Separator />

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-xs font-medium text-muted-foreground">وضعیت</label>
                                      <div className="mt-1">{getStatusBadge(selectedTicket.status)}</div>
                                    </div>
                                    <div>
                                      <label className="text-xs font-medium text-muted-foreground">اولویت</label>
                                      <div className="mt-1">{getPriorityBadge(selectedTicket.priority)}</div>
                                    </div>
                                    <div>
                                      <label className="text-xs font-medium text-muted-foreground">دسته‌بندی</label>
                                      <div className="mt-1">
                                        <Badge variant="outline">
                                          {categoriesData[selectedTicket.category]?.label || selectedTicket.category}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-xs font-medium text-muted-foreground">زیردسته</label>
                                      <div className="mt-1">
                                        <Badge variant="outline">{selectedTicket.subcategory}</Badge>
                                      </div>
                                    </div>
                                  </div>

                                  <Separator />

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-xs font-medium text-muted-foreground">تاریخ ایجاد</label>
                                      <div className="text-sm mt-1">{formatDate(selectedTicket.createdAt)}</div>
                                    </div>
                                    <div>
                                      <label className="text-xs font-medium text-muted-foreground">
                                        آخرین بروزرسانی
                                      </label>
                                      <div className="text-sm mt-1">{formatDate(selectedTicket.updatedAt)}</div>
                                    </div>
                                    <div>
                                      <label className="text-xs font-medium text-muted-foreground">بخش</label>
                                      <div className="text-sm mt-1">{selectedTicket.department}</div>
                                    </div>
                                    {selectedTicket.assignedTechnicianName && (
                                      <div>
                                        <label className="text-xs font-medium text-muted-foreground">
                                          تکنسین مسئول
                                        </label>
                                        <div className="text-sm mt-1">{selectedTicket.assignedTechnicianName}</div>
                                      </div>
                                    )}
                                  </div>

                                  {selectedTicket.responses && selectedTicket.responses.length > 0 && (
                                    <>
                                      <Separator />
                                      <div>
                                        <h4 className="font-medium text-right mb-3">پاسخ‌های تکنسین</h4>
                                        <div className="space-y-3">
                                          {selectedTicket.responses.map((response: any, index: number) => (
                                            <div key={index} className="bg-muted/50 p-3 rounded-lg">
                                              <div className="flex justify-between items-start mb-2">
                                                <span className="text-sm font-medium">{response.technicianName}</span>
                                                <span className="text-xs text-muted-foreground">
                                                  {formatDate(response.timestamp)}
                                                </span>
                                              </div>
                                              <p className="text-sm text-right">{response.message}</p>
                                              {response.status && (
                                                <div className="mt-2">{getStatusBadge(response.status)}</div>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="open" className="space-y-4">
              <div className="space-y-4">
                {userTickets
                  .filter((ticket) => ticket.status === "open")
                  .map((ticket) => (
                    <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-right">{ticket.title}</h3>
                              <Badge variant="outline" className="text-xs">
                                {ticket.id}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground text-right mb-3 line-clamp-2">
                              {ticket.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {getStatusBadge(ticket.status)}
                              {getPriorityBadge(ticket.priority)}
                              <Badge variant="outline">
                                {categoriesData[ticket.category]?.label || ticket.category}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center text-xs text-muted-foreground">
                              <span>ایجاد شده: {formatDate(ticket.createdAt)}</span>
                              {ticket.assignedTechnicianName && <span>تکنسین: {ticket.assignedTechnicianName}</span>}
                            </div>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 bg-transparent"
                                onClick={() => setSelectedTicket(ticket)}
                              >
                                <Eye className="w-4 h-4" />
                                مشاهده
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
                              <DialogHeader>
                                <DialogTitle className="text-right">جزئیات تیکت {ticket.id}</DialogTitle>
                              </DialogHeader>
                              {selectedTicket && (
                                <div className="space-y-4">
                                  <div>
                                    <h3 className="font-semibold text-right mb-2">{selectedTicket.title}</h3>
                                    <p className="text-sm text-muted-foreground text-right">
                                      {selectedTicket.description}
                                    </p>
                                  </div>

                                  <Separator />

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-xs font-medium text-muted-foreground">وضعیت</label>
                                      <div className="mt-1">{getStatusBadge(selectedTicket.status)}</div>
                                    </div>
                                    <div>
                                      <label className="text-xs font-medium text-muted-foreground">اولویت</label>
                                      <div className="mt-1">{getPriorityBadge(selectedTicket.priority)}</div>
                                    </div>
                                    <div>
                                      <label className="text-xs font-medium text-muted-foreground">دسته‌بندی</label>
                                      <div className="mt-1">
                                        <Badge variant="outline">
                                          {categoriesData[selectedTicket.category]?.label || selectedTicket.category}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-xs font-medium text-muted-foreground">زیردسته</label>
                                      <div className="mt-1">
                                        <Badge variant="outline">{selectedTicket.subcategory}</Badge>
                                      </div>
                                    </div>
                                  </div>

                                  <Separator />

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-xs font-medium text-muted-foreground">تاریخ ایجاد</label>
                                      <div className="text-sm mt-1">{formatDate(selectedTicket.createdAt)}</div>
                                    </div>
                                    <div>
                                      <label className="text-xs font-medium text-muted-foreground">
                                        آخرین بروزرسانی
                                      </label>
                                      <div className="text-sm mt-1">{formatDate(selectedTicket.updatedAt)}</div>
                                    </div>
                                    <div>
                                      <label className="text-xs font-medium text-muted-foreground">بخش</label>
                                      <div className="text-sm mt-1">{selectedTicket.department}</div>
                                    </div>
                                    {selectedTicket.assignedTechnicianName && (
                                      <div>
                                        <label className="text-xs font-medium text-muted-foreground">
                                          تکنسین مسئول
                                        </label>
                                        <div className="text-sm mt-1">{selectedTicket.assignedTechnicianName}</div>
                                      </div>
                                    )}
                                  </div>

                                  {selectedTicket.responses && selectedTicket.responses.length > 0 && (
                                    <>
                                      <Separator />
                                      <div>
                                        <h4 className="font-medium text-right mb-3">پاسخ‌های تکنسین</h4>
                                        <div className="space-y-3">
                                          {selectedTicket.responses.map((response: any, index: number) => (
                                            <div key={index} className="bg-muted/50 p-3 rounded-lg">
                                              <div className="flex justify-between items-start mb-2">
                                                <span className="text-sm font-medium">{response.technicianName}</span>
                                                <span className="text-xs text-muted-foreground">
                                                  {formatDate(response.timestamp)}
                                                </span>
                                              </div>
                                              <p className="text-sm text-right">{response.message}</p>
                                              {response.status && (
                                                <div className="mt-2">{getStatusBadge(response.status)}</div>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                {userTickets.filter((ticket) => ticket.status === "open").length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-muted-foreground">تیکت باز وجود ندارد</div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="in-progress" className="space-y-4">
              <div className="space-y-4">
                {userTickets
                  .filter((ticket) => ticket.status === "in-progress")
                  .map((ticket) => (
                    <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-right">{ticket.title}</h3>
                              <Badge variant="outline" className="text-xs">
                                {ticket.id}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground text-right mb-3 line-clamp-2">
                              {ticket.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {getStatusBadge(ticket.status)}
                              {getPriorityBadge(ticket.priority)}
                              <Badge variant="outline">
                                {categoriesData[ticket.category]?.label || ticket.category}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center text-xs text-muted-foreground">
                              <span>ایجاد شده: {formatDate(ticket.createdAt)}</span>
                              {ticket.assignedTechnicianName && <span>تکنسین: {ticket.assignedTechnicianName}</span>}
                            </div>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 bg-transparent"
                                onClick={() => setSelectedTicket(ticket)}
                              >
                                <Eye className="w-4 h-4" />
                                مشاهده
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
                              <DialogHeader>
                                <DialogTitle className="text-right">جزئیات تیکت {ticket.id}</DialogTitle>
                              </DialogHeader>
                              {selectedTicket && (
                                <div className="space-y-4">
                                  <div>
                                    <h3 className="font-semibold text-right mb-2">{selectedTicket.title}</h3>
                                    <p className="text-sm text-muted-foreground text-right">
                                      {selectedTicket.description}
                                    </p>
                                  </div>

                                  <Separator />

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-xs font-medium text-muted-foreground">وضعیت</label>
                                      <div className="mt-1">{getStatusBadge(selectedTicket.status)}</div>
                                    </div>
                                    <div>
                                      <label className="text-xs font-medium text-muted-foreground">اولویت</label>
                                      <div className="mt-1">{getPriorityBadge(selectedTicket.priority)}</div>
                                    </div>
                                    <div>
                                      <label className="text-xs font-medium text-muted-foreground">دسته‌بندی</label>
                                      <div className="mt-1">
                                        <Badge variant="outline">
                                          {categoriesData[selectedTicket.category]?.label || selectedTicket.category}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-xs font-medium text-muted-foreground">زیردسته</label>
                                      <div className="mt-1">
                                        <Badge variant="outline">{selectedTicket.subcategory}</Badge>
                                      </div>
                                    </div>
                                  </div>

                                  <Separator />

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-xs font-medium text-muted-foreground">تاریخ ایجاد</label>
                                      <div className="text-sm mt-1">{formatDate(selectedTicket.createdAt)}</div>
                                    </div>
                                    <div>
                                      <label className="text-xs font-medium text-muted-foreground">
                                        آخرین بروزرسانی
                                      </label>
                                      <div className="text-sm mt-1">{formatDate(selectedTicket.updatedAt)}</div>
                                    </div>
                                    <div>
                                      <label className="text-xs font-medium text-muted-foreground">بخش</label>
                                      <div className="text-sm mt-1">{selectedTicket.department}</div>
                                    </div>
                                    {selectedTicket.assignedTechnicianName && (
                                      <div>
                                        <label className="text-xs font-medium text-muted-foreground">
                                          تکنسین مسئول
                                        </label>
                                        <div className="text-sm mt-1">{selectedTicket.assignedTechnicianName}</div>
                                      </div>
                                    )}
                                  </div>

                                  {selectedTicket.responses && selectedTicket.responses.length > 0 && (
                                    <>
                                      <Separator />
                                      <div>
                                        <h4 className="font-medium text-right mb-3">پاسخ‌های تکنسین</h4>
                                        <div className="space-y-3">
                                          {selectedTicket.responses.map((response: any, index: number) => (
                                            <div key={index} className="bg-muted/50 p-3 rounded-lg">
                                              <div className="flex justify-between items-start mb-2">
                                                <span className="text-sm font-medium">{response.technicianName}</span>
                                                <span className="text-xs text-muted-foreground">
                                                  {formatDate(response.timestamp)}
                                                </span>
                                              </div>
                                              <p className="text-sm text-right">{response.message}</p>
                                              {response.status && (
                                                <div className="mt-2">{getStatusBadge(response.status)}</div>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                {userTickets.filter((ticket) => ticket.status === "in-progress").length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-muted-foreground">تیکت در حال بررسی وجود ندارد</div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="resolved" className="space-y-4">
              <div className="space-y-4">
                {userTickets
                  .filter((ticket) => ticket.status === "resolved")
                  .map((ticket) => (
                    <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-right">{ticket.title}</h3>
                              <Badge variant="outline" className="text-xs">
                                {ticket.id}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground text-right mb-3 line-clamp-2">
                              {ticket.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-3">
                              {getStatusBadge(ticket.status)}
                              {getPriorityBadge(ticket.priority)}
                              <Badge variant="outline">
                                {categoriesData[ticket.category]?.label || ticket.category}
                              </Badge>
                            </div>
                            <div className="flex justify-between items-center text-xs text-muted-foreground">
                              <span>ایجاد شده: {formatDate(ticket.createdAt)}</span>
                              {ticket.assignedTechnicianName && <span>تکنسین: {ticket.assignedTechnicianName}</span>}
                            </div>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 bg-transparent"
                                onClick={() => setSelectedTicket(ticket)}
                              >
                                <Eye className="w-4 h-4" />
                                مشاهده
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" dir="rtl">
                              <DialogHeader>
                                <DialogTitle className="text-right">جزئیات تیکت {ticket.id}</DialogTitle>
                              </DialogHeader>
                              {selectedTicket && (
                                <div className="space-y-4">
                                  <div>
                                    <h3 className="font-semibold text-right mb-2">{selectedTicket.title}</h3>
                                    <p className="text-sm text-muted-foreground text-right">
                                      {selectedTicket.description}
                                    </p>
                                  </div>

                                  <Separator />

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-xs font-medium text-muted-foreground">وضعیت</label>
                                      <div className="mt-1">{getStatusBadge(selectedTicket.status)}</div>
                                    </div>
                                    <div>
                                      <label className="text-xs font-medium text-muted-foreground">اولویت</label>
                                      <div className="mt-1">{getPriorityBadge(selectedTicket.priority)}</div>
                                    </div>
                                    <div>
                                      <label className="text-xs font-medium text-muted-foreground">دسته‌بندی</label>
                                      <div className="mt-1">
                                        <Badge variant="outline">
                                          {categoriesData[selectedTicket.category]?.label || selectedTicket.category}
                                        </Badge>
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-xs font-medium text-muted-foreground">زیردسته</label>
                                      <div className="mt-1">
                                        <Badge variant="outline">{selectedTicket.subcategory}</Badge>
                                      </div>
                                    </div>
                                  </div>

                                  <Separator />

                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-xs font-medium text-muted-foreground">تاریخ ایجاد</label>
                                      <div className="text-sm mt-1">{formatDate(selectedTicket.createdAt)}</div>
                                    </div>
                                    <div>
                                      <label className="text-xs font-medium text-muted-foreground">
                                        آخرین بروزرسانی
                                      </label>
                                      <div className="text-sm mt-1">{formatDate(selectedTicket.updatedAt)}</div>
                                    </div>
                                    <div>
                                      <label className="text-xs font-medium text-muted-foreground">بخش</label>
                                      <div className="text-sm mt-1">{selectedTicket.department}</div>
                                    </div>
                                    {selectedTicket.assignedTechnicianName && (
                                      <div>
                                        <label className="text-xs font-medium text-muted-foreground">
                                          تکنسین مسئول
                                        </label>
                                        <div className="text-sm mt-1">{selectedTicket.assignedTechnicianName}</div>
                                      </div>
                                    )}
                                  </div>

                                  {selectedTicket.responses && selectedTicket.responses.length > 0 && (
                                    <>
                                      <Separator />
                                      <div>
                                        <h4 className="font-medium text-right mb-3">پاسخ‌های تکنسین</h4>
                                        <div className="space-y-3">
                                          {selectedTicket.responses.map((response: any, index: number) => (
                                            <div key={index} className="bg-muted/50 p-3 rounded-lg">
                                              <div className="flex justify-between items-start mb-2">
                                                <span className="text-sm font-medium">{response.technicianName}</span>
                                                <span className="text-xs text-muted-foreground">
                                                  {formatDate(response.timestamp)}
                                                </span>
                                              </div>
                                              <p className="text-sm text-right">{response.message}</p>
                                              {response.status && (
                                                <div className="mt-2">{getStatusBadge(response.status)}</div>
                                              )}
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                {userTickets.filter((ticket) => ticket.status === "resolved").length === 0 && (
                  <div className="text-center py-8">
                    <div className="text-muted-foreground">تیکت حل شده وجود ندارد</div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
