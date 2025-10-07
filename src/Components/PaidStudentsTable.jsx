import { useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../Components/ui/Table"
import { Input } from "../Components/ui/Input"
import { Badge } from "../Components/ui/Badge"
import { Button } from "../Components/ui/Button"
import { Search, Download } from "lucide-react"

export default function PaidStudentsTable() {
  // 🧾 Static student dataset
  const [students] = useState([
    {
      id: 1,
      studentId: "STU001",
      name: "Makara Lang",
      grade: "Year 3 - IT",
      amount: 150.0,
      paymentDate: "2025-10-01",
      paymentMethod: "ABA Pay",
      status: "Paid",
    },
    {
      id: 2,
      studentId: "STU002",
      name: "Sokha Chan",
      grade: "Year 2 - CS",
      amount: 145.5,
      paymentDate: "2025-09-29",
      paymentMethod: "Cash",
      status: "Paid",
    },
    {
      id: 3,
      studentId: "STU003",
      name: "Rina Chea",
      grade: "Year 1 - Business",
      amount: 120.0,
      paymentDate: "2025-09-25",
      paymentMethod: "Wing",
      status: "Paid",
    },
    {
      id: 4,
      studentId: "STU004",
      name: "Dara Kim",
      grade: "Year 3 - Networking",
      amount: 155.75,
      paymentDate: "2025-10-03",
      paymentMethod: "ABA Pay",
      status: "Paid",
    },
    {
      id: 5,
      studentId: "STU005",
      name: "Dara You",
      grade: "Year 4 - Networking",
      amount: 300,
      paymentDate: "2025-10-03",
      paymentMethod: "Null",
      status: "Unpaid",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")

  // 🔍 Filter students by search
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.grade.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleExport = () => {
    console.log("[v0] Exporting student data...")
    alert("Export functionality would download a CSV file with all student payment records")
  }

  return (
    <div className="space-y-4 my-10">
      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, student ID, or grade..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button onClick={handleExport} variant="outline" className="w-full sm:w-auto bg-transparent">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-lg border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Date</TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No students found matching your search
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-mono text-sm">{student.studentId}</TableCell>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.grade}</TableCell>
                  <TableCell className="font-semibold">${student.amount.toLocaleString()}</TableCell>
                  <TableCell>
                    {new Date(student.paymentDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>{student.paymentMethod}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        student.status === "Paid"
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-red-600 text-white hover:bg-red-700"
                      }
                    >
                      {student.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results Count */}
      <p className="text-sm text-muted-foreground text-right">
        Showing {filteredStudents.length} of {students.length} paid students
      </p>
    </div>
  )
}
