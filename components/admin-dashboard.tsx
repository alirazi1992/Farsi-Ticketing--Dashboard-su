import { TicketTable } from "./ticket-table"
import { CategoryManagement } from "./category-management"

interface AdminDashboardProps {
  tickets: any[]
  onTicketUpdate: (ticketId: string, updates: any) => void
  categories?: any
  onCategoryUpdate?: (categories: any) => void
}

export function AdminDashboard({ tickets, onTicketUpdate, categories, onCategoryUpdate }: AdminDashboardProps) {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <TicketTable tickets={tickets} onTicketUpdate={onTicketUpdate} />
      <CategoryManagement categories={categories} onCategoryUpdate={onCategoryUpdate} />
    </div>
  )
}
