import { TicketTable } from "./ticket-table"
import { CategoryManagement } from "./category-management"

interface AdminDashboardProps {
  tickets: any[]
  onTicketUpdate: (ticketId: string, updates: any) => void
  categories: any
  onCategoryUpdate: (categories: any) => void
}

export function AdminDashboard({ tickets, onTicketUpdate, categories, onCategoryUpdate }: AdminDashboardProps) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">Ticket Management</h2>
          <TicketTable tickets={tickets} onTicketUpdate={onTicketUpdate} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-2">Category Management</h2>
          <CategoryManagement categories={categories} onCategoryUpdate={onCategoryUpdate} />
        </div>
      </div>
    </div>
  )
}
