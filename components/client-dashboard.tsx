"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TwoStepTicketForm } from "./two-step-ticket-form"
import { Eye, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { faIR } from "date-fns/locale"

interface ClientDashboardProps {
  tickets: any[]
  onTicketCreate: (ticket: any) => void
  currentUser: any
  categories: any[]
}

export function ClientDashboard({ tickets, onTicketCreate, currentUser, categories }: ClientDashboardProps) {
  const [activeTab, setActiveTab] = useState("create")

  // Filter tickets for current user
  const userTickets = tickets.filter((ticket) => ticket.clientEmail === currentUser.email)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <Clock className="w-4 h-4 text-orange-500" />
      case "in-progress":
        return <AlertCircle className="w-4 h-4 text-blue-500" />
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "closed":
        return <XCircle className="w-4 h-4 text-gray-500" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open":
        return "باز"
      case "in-progress":
        return "در حال بررسی"
      case "resolved":
        return "حل شده"
      case "closed":
        return "بسته شده"
      default:
        return status
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "فوری"
      case "high":
        return "بالا"
      case "medium":
        return "متوسط"
      case "low":
        return "پایین"
      default:
        return priority
    }
  }

  return (
    <div className="space-y-6" dir="rtl">
      <div className="text-right">
        <h1 className="text-3xl font-bold">داشبورد کاربر</h1>
        <p className="text-muted-foreground mt-2">مدیریت درخواست‌های خود و ایجاد تیکت جدید</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create" className="gap-2">
            ایجاد تیکت جدید
          </TabsTrigger>
          <TabsTrigger value="tickets" className="gap-2">
            تیکت‌های من ({userTickets.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-right">ایجاد درخواست جدید</CardTitle>
            </CardHeader>
            <CardContent>
              <TwoStepTicketForm onSubmit={onTicketCreate} categories={categories} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tickets" className="space-y-4">
          {userTickets.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-muted-foreground">هنوز تیکتی ایجاد نکرده‌اید</p>
                <Button onClick={() => setActiveTab("create")} className="mt-4">
                  ایجاد اولین تیکت
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {userTickets.map((ticket) => (
                <Card key={ticket.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-right flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{ticket.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {ticket.id}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{ticket.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>
                            ایجاد شده:{" "}
                            {formatDistanceToNow(new Date(ticket.createdAt), {
                              addSuffix: true,
                              locale: faIR,
                            })}
                          </span>
                          {ticket.assignedTechnicianName && <span>تکنسین: {ticket.assignedTechnicianName}</span>}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(ticket.status)}
                          <span className="text-sm font-medium">{getStatusLabel(ticket.status)}</span>
                        </div>
                        <Badge className={getPriorityColor(ticket.priority)}>{getPriorityLabel(ticket.priority)}</Badge>
                      </div>
                    </div>

                    {ticket.responses && ticket.responses.length > 0 && (
                      <div className="border-t pt-4">
                        <h4 className="text-sm font-medium mb-2 text-right">آخرین پاسخ:</h4>
                        <div className="bg-muted/50 rounded-lg p-3">
                          <p className="text-sm text-right mb-2">
                            {ticket.responses[ticket.responses.length - 1].message}
                          </p>
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>{ticket.responses[ticket.responses.length - 1].technicianName}</span>
                            <span>
                              {formatDistanceToNow(new Date(ticket.responses[ticket.responses.length - 1].timestamp), {
                                addSuffix: true,
                                locale: faIR,
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end mt-4">
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <Eye className="w-4 h-4" />
                        مشاهده جزئیات
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
