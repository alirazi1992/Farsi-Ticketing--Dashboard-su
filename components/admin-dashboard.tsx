import type React from "react"
import { CategoryManagement } from "./category-management"
import type { Ticket } from "./ticket" // Assuming Ticket is defined in a separate file

interface AdminDashboardProps {
  tickets: Ticket[]
  onTicketUpdate: (ticketId: string, updates: Partial<Ticket>) => void
  categories: any
  onCategoryUpdate: (categories: any) => void
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  tickets,
  onTicketUpdate,
  categories,
  onCategoryUpdate,
}) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Ticket Management</h2>
          {/* <TicketTable tickets={tickets} onTicketUpdate={onTicketUpdate} /> */}
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Category Management</h2>
          <CategoryManagement categories={categories} onCategoryUpdate={onCategoryUpdate} />
        </div>
      </div>
    </div>
  )
}
