import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { Button } from "../ui/Button"
import { Input } from "../ui/Input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/Table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/Select"
import { Badge } from "../ui/Badge"
import { DollarSign, TrendingUp, Calendar, Plus, Search, Download, Edit, Trash2 } from "lucide-react"
import { AddPaymentDialog } from "./add-payment-dialog"
import { PaymentChart } from "./payment-chart"

// Mock data
const initialPayments = [
  {
    id: "1",
    studentId: "STU001",
    name: "John Doe",
    amount: 5000,
    date: "2025-01-15",
    method: "Credit Card",
    status: "paid",
  },
  {
    id: "2",
    studentId: "STU002",
    name: "Jane Smith",
    amount: 4500,
    date: "2025-01-20",
    method: "Bank Transfer",
    status: "paid",
  },
  {
    id: "3",
    studentId: "STU003",
    name: "Mike Johnson",
    amount: 5000,
    date: "2025-02-01",
    method: "Cash",
    status: "unpaid",
  },
  {
    id: "4",
    studentId: "STU004",
    name: "Sarah Williams",
    amount: 4800,
    date: "2025-02-10",
    method: "Credit Card",
    status: "paid",
  },
  {
    id: "5",
    studentId: "STU005",
    name: "David Brown",
    amount: 5200,
    date: "2025-02-15",
    method: "Bank Transfer",
    status: "unpaid",
  },
]

export default function PaymentsContent() {
  const [payments, setPayments] = useState(initialPayments)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [methodFilter, setMethodFilter] = useState("all")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Summary calculations
  const stats = useMemo(() => {
    const totalPaid = payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0)
    const totalUnpaid = payments.filter((p) => p.status === "unpaid").reduce((sum, p) => sum + p.amount, 0)
    const totalCollected = totalPaid
    const latestPayment = payments
      .filter((p) => p.status === "paid")
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0]

    return {
      totalPaid,
      totalUnpaid,
      totalCollected,
      latestPaymentDate: latestPayment ? latestPayment.date : "N/A",
    }
  }, [payments])

  // ✅ Fixed filter logic (case-insensitive)
  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const matchesSearch =
        payment.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.studentId.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus =
        statusFilter === "all" ||
        payment.status.toLowerCase() === statusFilter.toLowerCase()

      const matchesMethod =
        methodFilter === "all" ||
        payment.method.toLowerCase() === methodFilter.toLowerCase()

      return matchesSearch && matchesStatus && matchesMethod
    })
  }, [payments, searchQuery, statusFilter, methodFilter])

  const handleAddPayment = (payment) => {
    const newPayment = {
      ...payment,
      id: `${Date.now()}`,
    }
    setPayments([newPayment, ...payments])
  }

  const handleDeletePayment = (id) => {
    setPayments(payments.filter((p) => p.id !== id))
  }

  const handleExportCSV = () => {
    const headers = ["Student ID", "Name", "Amount", "Date", "Method", "Status"]
    const rows = filteredPayments.map((p) => [p.studentId, p.name, p.amount, p.date, p.method, p.status])
    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `payments-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">Manage student payments and transactions</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="mr-2 size-4" />
          Add Payment
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Paid */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <DollarSign className="size-4 text-green-600 dark:text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalPaid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {payments.filter((p) => p.status === "paid").length} transactions
            </p>
          </CardContent>
        </Card>

        {/* Total Unpaid */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Unpaid</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20">
              <DollarSign className="size-4 text-red-600 dark:text-red-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalUnpaid.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {payments.filter((p) => p.status === "unpaid").length} pending
            </p>
          </CardContent>
        </Card>

        {/* Total Collected */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Collected</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
              <TrendingUp className="size-4 text-blue-600 dark:text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalCollected.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">From all paid transactions</p>
          </CardContent>
        </Card>

        {/* Latest Payment */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latest Payment</CardTitle>
            <div className="flex size-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
              <Calendar className="size-4 text-purple-600 dark:text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.latestPaymentDate !== "N/A"
                ? new Date(stats.latestPaymentDate).toLocaleDateString()
                : "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">Most recent payment</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <PaymentChart payments={payments} />

      {/* Filters and Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or student ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                </SelectContent>
              </Select>

              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="credit card">Credit Card</SelectItem>
                  <SelectItem value="bank transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="mr-2 size-4" />
              Export CSV
            </Button>
          </div>

          {/* Table */}
          <div className="rounded-md ">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24">
                      No payments found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">{payment.studentId}</TableCell>
                      <TableCell>{payment.name}</TableCell>
                      <TableCell>${payment.amount.toLocaleString()}</TableCell>
                      <TableCell>{new Date(payment.date).toLocaleDateString()}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>
                        <Badge
                          variant={payment.status === "paid" ? "default" : "secondary"}
                          className={
                            payment.status === "paid"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                              : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                          }
                        >
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon">
                            <Edit className="size-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeletePayment(payment.id)}>
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddPaymentDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onAddPayment={handleAddPayment}
      />
    </div>
  )
}
