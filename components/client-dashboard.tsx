"use client"

import { useState } from "react"
import { Button, Modal } from "flowbite-react"
import { TwoStepTicketForm } from "./two-step-ticket-form"

interface ClientDashboardProps {
  tickets: any[]
  onTicketCreate: (ticket: any) => void
  currentUser: any
  categories: any
}

export function ClientDashboard({ tickets, onTicketCreate, currentUser, categories }: ClientDashboardProps) {
  const [showTicketForm, setShowTicketForm] = useState(false)

  return (
    <div>
      <h1>Client Dashboard</h1>
      <p>Welcome, {currentUser?.email}!</p>
      <Button onClick={() => setShowTicketForm(true)}>Create Ticket</Button>

      <Modal show={showTicketForm} size="md" onClose={() => setShowTicketForm(false)} dismissible>
        <Modal.Header>Create a New Ticket</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <TwoStepTicketForm
              onClose={() => setShowTicketForm(false)}
              onSubmit={onTicketCreate}
              categories={categories}
            />
          </div>
        </Modal.Body>
      </Modal>

      <h2>Your Tickets</h2>
      {tickets.length > 0 ? (
        <ul>
          {tickets.map((ticket) => (
            <li key={ticket.id}>{ticket.title}</li>
          ))}
        </ul>
      ) : (
        <p>No tickets yet.</p>
      )}
    </div>
  )
}
