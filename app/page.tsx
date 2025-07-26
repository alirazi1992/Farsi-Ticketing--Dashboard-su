"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import TicketList from "@/components/TicketList"
import AdminDashboard from "@/components/AdminDashboard"
import TwoStepTicketForm from "@/components/TwoStepTicketForm"

export default function Home() {
  const { data: session, status } = useSession()
  const [tickets, setTickets] = useState([])

  useEffect(() => {
    const getTickets = async () => {
      const res = await fetch("/api/Tickets")
      const data = await res.json()
      setTickets(data)
    }

    getTickets()
  }, [])

  if (status === "loading") {
    return <p>Loading...</p>
  }

  if (status === "unauthenticated") {
    redirect("/api/auth/signin?callbackUrl=http://localhost:3000")
  }

  const handleTicketSubmit = async (newTicket) => {
    setTickets([...tickets, newTicket])
  }

  const handleTicketUpdate = async (updatedTicket) => {
    setTickets(tickets.map((ticket) => (ticket._id === updatedTicket._id ? updatedTicket : ticket)))
  }

  // Add this state for categories
  const [categories, setCategories] = useState({
    hardware: ["کامپیوتر", "پرینتر", "شبکه"],
    software: ["نرم‌افزار اداری", "سیستم عامل", "آنتی‌ویروس"],
    network: ["اینترنت", "شبکه داخلی", "ایمیل"],
  })

  // Add category update handler
  const handleCategoryUpdate = (newCategories: any) => {
    setCategories(newCategories)
  }

  const currentUser = session?.user as { email?: string; role?: string } | undefined

  return (
    <main className="container">
      <div>
        {currentUser?.role === "admin" && (
          <AdminDashboard
            tickets={tickets}
            onTicketUpdate={handleTicketUpdate}
            categories={categories}
            onCategoryUpdate={handleCategoryUpdate}
          />
        )}
        <h1>Open a New Ticket</h1>
        <TwoStepTicketForm onSubmit={handleTicketSubmit} categories={categories} />
        <TicketList tickets={tickets} onTicketUpdate={handleTicketUpdate} />
      </div>
    </main>
  )
}
