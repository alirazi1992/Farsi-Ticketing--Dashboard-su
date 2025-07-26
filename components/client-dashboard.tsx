"use client"

import type React from "react"
import { useState } from "react"
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Tab,
  Tabs,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import PriorityHighIcon from "@mui/icons-material/PriorityHigh"
import PriorityLowIcon from "@mui/icons-material/PriorityLow"
import CheckCircleIcon from "@mui/icons-material/CheckCircle"
import CancelIcon from "@mui/icons-material/Cancel"
import PauseCircleFilledIcon from "@mui/icons-material/PauseCircleFilled"
import { styled } from "@mui/material/styles"

interface Ticket {
  id: number
  title: string
  status: "Open" | "In Progress" | "Resolved" | "Closed"
  priority: "High" | "Medium" | "Low"
  dateCreated: string
}

const initialTickets: Ticket[] = [
  { id: 1, title: "Website down", status: "Open", priority: "High", dateCreated: "2024-01-01" },
  { id: 2, title: "Email not working", status: "In Progress", priority: "Medium", dateCreated: "2024-01-05" },
  { id: 3, title: "Password reset issue", status: "Resolved", priority: "Low", dateCreated: "2024-01-10" },
  { id: 4, title: "New feature request", status: "Closed", priority: "High", dateCreated: "2024-01-15" },
  { id: 5, title: "Login problems", status: "Open", priority: "Medium", dateCreated: "2024-01-20" },
  { id: 6, title: "Database connection error", status: "In Progress", priority: "High", dateCreated: "2024-01-25" },
  { id: 7, title: "Report generation failing", status: "Resolved", priority: "Low", dateCreated: "2024-01-30" },
  { id: 8, title: "UI bug", status: "Closed", priority: "Medium", dateCreated: "2024-02-01" },
  { id: 9, title: "Payment gateway issue", status: "Open", priority: "High", dateCreated: "2024-02-05" },
  { id: 10, title: "API endpoint not responding", status: "In Progress", priority: "Low", dateCreated: "2024-02-10" },
  { id: 11, title: "Slow loading times", status: "Resolved", priority: "Medium", dateCreated: "2024-02-15" },
  { id: 12, title: "Mobile app crashing", status: "Closed", priority: "High", dateCreated: "2024-02-20" },
]

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.MuiTableCell-head`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.MuiTableCell-body`]: {
    fontSize: 14,
  },
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}))

const ClientDashboard = () => {
  const [tabValue, setTabValue] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("")
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleChangePage = (event: React.SyntheticEvent<HTMLButtonElement | HTMLAnchorElement>, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const filteredTickets = initialTickets.filter((ticket) => {
    const searchMatch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase())
    const statusMatch = statusFilter === "" || ticket.status === statusFilter
    const priorityMatch = priorityFilter === "" || ticket.priority === priorityFilter
    return searchMatch && statusMatch && priorityMatch
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Open":
        return <CancelIcon color="error" />
      case "In Progress":
        return <PauseCircleFilledIcon color="warning" />
      case "Resolved":
        return <CheckCircleIcon color="success" />
      case "Closed":
        return <CheckCircleIcon color="success" />
      default:
        return null
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "High":
        return <PriorityHighIcon color="error" />
      case "Medium":
        return null
      case "Low":
        return <PriorityLowIcon color="success" />
      default:
        return null
    }
  }

  return (
    <Box sx={{ width: "100%", typography: "body1", p: 3 }}>
      <Tabs value={tabValue} onChange={handleChangeTab} aria-label="client dashboard tabs">
        <Tab label="My Tickets" />
        <Tab label="Knowledge Base" />
        <Tab label="Account Settings" />
      </Tabs>

      {tabValue === 0 && (
        <Box mt={3}>
          <Typography variant="h5" gutterBottom>
            My Tickets
          </Typography>

          <Grid container spacing={2} alignItems="center" mb={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Search Tickets"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon />,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  id="status-filter"
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="In Progress">In Progress</MenuItem>
                  <MenuItem value="Resolved">Resolved</MenuItem>
                  <MenuItem value="Closed">Closed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="priority-filter-label">Priority</InputLabel>
                <Select
                  labelId="priority-filter-label"
                  id="priority-filter"
                  value={priorityFilter}
                  label="Priority"
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="High">High</MenuItem>
                  <MenuItem value="Medium">Medium</MenuItem>
                  <MenuItem value="Low">Low</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {/* Removing the "تیکت جدید" button */}
          </Grid>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>ID</StyledTableCell>
                  <StyledTableCell>Title</StyledTableCell>
                  <StyledTableCell align="left">Status</StyledTableCell>
                  <StyledTableCell align="left">Priority</StyledTableCell>
                  <StyledTableCell align="left">Date Created</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTickets.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((ticket) => (
                  <StyledTableRow key={ticket.id}>
                    <StyledTableCell component="th" scope="row">
                      {ticket.id}
                    </StyledTableCell>
                    <StyledTableCell>{ticket.title}</StyledTableCell>
                    <StyledTableCell align="left">
                      {getStatusIcon(ticket.status)} {ticket.status}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {getPriorityIcon(ticket.priority)} {ticket.priority}
                    </StyledTableCell>
                    <StyledTableCell align="left">{ticket.dateCreated}</StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredTickets.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      )}

      {tabValue === 1 && (
        <Box mt={3}>
          <Typography variant="h5" gutterBottom>
            Knowledge Base
          </Typography>
          <Typography>Content for the Knowledge Base tab.</Typography>
        </Box>
      )}

      {tabValue === 2 && (
        <Box mt={3}>
          <Typography variant="h5" gutterBottom>
            Account Settings
          </Typography>
          <Typography>Content for the Account Settings tab.</Typography>
        </Box>
      )}
    </Box>
  )
}

export default ClientDashboard
