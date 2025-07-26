"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { TwoStepTicketForm } from "./two-step-ticket-form"

const ClientDashboard = () => {
  const [tickets, setTickets] = useState([])
  const [isTicketDialogOpen, setIsTicketDialogOpen] = useState(false)

  const handleTicketSubmit = (ticketData: any) => {
    // Add ticket to the list
    setTickets((prev) => [ticketData, ...prev])

    // Close the form
    setIsTicketDialogOpen(false)

    // Show success toast
    toast({
      title: "تیکت با موفقیت ثبت شد",
      description: `شماره تیکت: ${ticketData.id}`,
    })
  }

  const onTicketCreate = (ticket: any) => {
    setTickets((prev) => [ticket, ...prev])
    toast({
      title: "تیکت با موفقیت ثبت شد",
      description: `شماره تیکت: ${ticket.id}`,
    })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 font-iran">داشبورد مشتری</h1>

      <Dialog open={isTicketDialogOpen} onOpenChange={setIsTicketDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-700 font-iran">
            <Plus className="ml-2 h-4 w-4" />
            ایجاد تیکت جدید
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-right font-iran">ایجاد درخواست جدید</DialogTitle>
          </DialogHeader>
          <TwoStepTicketForm
            onSubmit={(ticket) => {
              onTicketCreate(ticket)
              setIsTicketDialogOpen(false)
            }}
            onClose={() => setIsTicketDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Display Tickets */}
      <div className="mt-4">
        {tickets.length === 0 ? (
          <p className="font-iran">هیچ تیکتی وجود ندارد.</p>
        ) : (
          <ul>
            {tickets.map((ticket, index) => (
              <li key={index} className="font-iran">
                {ticket.title} - {ticket.description}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default ClientDashboard
