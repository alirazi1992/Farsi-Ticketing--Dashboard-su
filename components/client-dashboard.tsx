"use client"

import { useState } from "react"
import { TwoStepTicketForm } from "./two-step-ticket-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Eye, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"

interface ClientDashboardProps {
  tickets: any[]
  onTicketCreate: (ticketData: any) => void
  categories: any
}

export function ClientDashboard({ tickets, onTicketCreate, categories }: ClientDashboardProps) {
  const [activeTab, setActiveTab] = useState("tickets")

  const handleTicketSubmit = (ticketData: any) => {
    onTicketCreate(ticketData)
    toast.success("تیکت شما با موفقیت ثبت شد")
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      open: { label: "باز", variant: "default" as const, icon: Clock },
      "in-progress": { label: "در حال بررسی", variant: "secondary" as const, icon: AlertCircle },
      resolved: { label: "حل شده", variant: "default" as const, icon: CheckCircle },
      closed: { label: "بسته", variant: "outline" as const, icon: CheckCircle },
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
      low: { label: "کم", className: "bg-green-100 text-green-800" },
      medium: { label: "متوسط", className: "bg-yellow-100 text-yellow-800" },
      high: { label: "بالا", className: "bg-orange-100 text-orange-800" },
      urgent: { label: "فوری", className: "bg-red-100 text-red-800" },
    }

    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.medium

    return <Badge className={config.className}>{config.label}</Badge>
  }

  return (
    <div className="space-y-6" dir="rtl">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tickets" className="gap-2">
            <Eye className="w-4 h-4" />
            تیکت‌های من
          </TabsTrigger>
          <TabsTrigger value="new-ticket" className="gap-2">
            <Plus className="w-4 h-4" />
            تیکت جدید
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tickets" className="space-y-4">
          <div className="grid gap-4">
            {tickets.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <Clock className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center">هنوز تیکتی ثبت نکرده‌اید</p>
                  <Button className="mt-4" onClick={() => setActiveTab("new-ticket")}>
                    ثبت اولین تیکت
                  </Button>
                </CardContent>
              </Card>
            ) : (
              tickets.map((ticket) => (
                <Card key={ticket.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">تیکت #{ticket.id}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {ticket.category} - {ticket.subcategory}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {getStatusBadge(ticket.status)}
                        {getPriorityBadge(ticket.priority)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium mb-1">موضوع:</h4>
                        <p className="text-sm">{ticket.subject}</p>
                      </div>

                      <div>
                        <h4 className="font-medium mb-1">توضیحات:</h4>
                        <p className="text-sm text-muted-foreground">{ticket.description}</p>
                      </div>

                      {ticket.assignedTo && (
                        <div>
                          <h4 className="font-medium mb-1">تکنسین مسئول:</h4>
                          <p className="text-sm">{ticket.assignedTo}</p>
                        </div>
                      )}

                      {ticket.responses && ticket.responses.length > 0 && (
                        <div>
                          <h4 className="font-medium mb-2">آخرین پاسخ:</h4>
                          <div className="bg-muted p-3 rounded-md">
                            <p className="text-sm">{ticket.responses[ticket.responses.length - 1].message}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(ticket.responses[ticket.responses.length - 1].timestamp).toLocaleDateString(
                                "fa-IR",
                              )}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-xs text-muted-foreground pt-2 border-t">
                        <span>ایجاد شده: {new Date(ticket.createdAt).toLocaleDateString("fa-IR")}</span>
                        {ticket.updatedAt && (
                          <span>آخرین بروزرسانی: {new Date(ticket.updatedAt).toLocaleDateString("fa-IR")}</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="new-ticket">
          <TwoStepTicketForm onTicketSubmit={handleTicketSubmit} categories={categories} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
