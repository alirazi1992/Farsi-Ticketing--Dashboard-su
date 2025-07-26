"use client"

import { useState } from "react"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { TwoStepTicketForm } from "./two-step-ticket-form"

const ClientDashboard = () => {
  const [tickets, setTickets] = useState([])
  const [showTicketForm, setShowTicketForm] = useState(false)

  const handleTicketSubmit = (ticketData: any) => {
    // Add ticket to the list
    setTickets((prev) => [ticketData, ...prev])

    // Close the form
    setShowTicketForm(false)

    // Show success toast
    toast({
      title: "تیکت با موفقیت ثبت شد",
      description: `شماره تیکت: ${ticketData.id}`,
    })
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 font-iran">داشبورد مشتری</h1>

      <Button onClick={() => setShowTicketForm(true)} className="bg-blue-600 hover:bg-blue-700 font-iran">
        <Plus className="ml-2 h-4 w-4" />
        ایجاد تیکت جدید
      </Button>

      {showTicketForm && (
        <Dialog open={showTicketForm} onOpenChange={setShowTicketForm}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-right font-iran">ایجاد تیکت جدید</DialogTitle>
            </DialogHeader>
            <TwoStepTicketForm onClose={() => setShowTicketForm(false)} onSubmit={handleTicketSubmit} />
          </DialogContent>
        </Dialog>
      )}

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
