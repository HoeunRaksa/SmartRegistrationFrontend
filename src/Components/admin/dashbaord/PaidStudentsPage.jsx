import { PaidStudentsTable } from "../Components/PaidStudentsTable"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/Card"

// Mock data for paid students
const paidStudents = [
  {
    id: "1",
    name: "Sarah Johnson",
    studentId: "STU-2024-001",
    grade: "10th Grade",
    amount: 1500,
    paymentDate: "2024-01-15",
    paymentMethod: "Bank Transfer",
    term: "Spring 2024",
    status: "Paid",
  },
  {
    id: "2",
    name: "Michael Chen",
    studentId: "STU-2024-002",
    grade: "11th Grade",
    amount: 1500,
    paymentDate: "2024-01-18",
    paymentMethod: "Credit Card",
    term: "Spring 2024",
    status: "Paid",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    studentId: "STU-2024-003",
    grade: "9th Grade",
    amount: 1500,
    paymentDate: "2024-01-20",
    paymentMethod: "Cash",
    term: "Spring 2024",
    status: "Paid",
  },
  {
    id: "4",
    name: "James Williams",
    studentId: "STU-2024-004",
    grade: "12th Grade",
    amount: 1500,
    paymentDate: "2024-01-22",
    paymentMethod: "Bank Transfer",
    term: "Spring 2024",
    status: "Paid",
  },
  {
    id: "5",
    name: "Olivia Brown",
    studentId: "STU-2024-005",
    grade: "10th Grade",
    amount: 1500,
    paymentDate: "2024-01-25",
    paymentMethod: "Credit Card",
    term: "Spring 2024",
    status: "Paid",
  },
  {
    id: "6",
    name: "David Martinez",
    studentId: "STU-2024-006",
    grade: "11th Grade",
    amount: 1500,
    paymentDate: "2024-01-28",
    paymentMethod: "Bank Transfer",
    term: "Spring 2024",
    status: "Paid",
  },
  {
    id: "7",
    name: "Sophia Anderson",
    studentId: "STU-2024-007",
    grade: "9th Grade",
    amount: 1500,
    paymentDate: "2024-02-01",
    paymentMethod: "Cash",
    term: "Spring 2024",
    status: "Paid",
  },
  {
    id: "8",
    name: "Daniel Taylor",
    studentId: "STU-2024-008",
    grade: "12th Grade",
    amount: 1500,
    paymentDate: "2024-02-03",
    paymentMethod: "Credit Card",
    term: "Spring 2024",
    status: "Paid",
  },
]

export default function PaidStudentsPage() {
  const totalRevenue = paidStudents.reduce((sum, student) => sum + student.amount, 0)
  const totalStudents = paidStudents.length

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Paid Students</h1>
          <p className="text-muted-foreground text-lg">View and manage all students who have paid their school fees</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Students Paid</CardDescription>
              <CardTitle className="text-4xl">{totalStudents}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Spring 2024 term</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Revenue</CardDescription>
              <CardTitle className="text-4xl">${totalRevenue.toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Collected this term</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Average Payment</CardDescription>
              <CardTitle className="text-4xl">${(totalRevenue / totalStudents).toLocaleString()}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Per student</p>
            </CardContent>
          </Card>
        </div>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Records</CardTitle>
            <CardDescription>Complete list of students who have paid their school fees</CardDescription>
          </CardHeader>
          <CardContent>
            <PaidStudentsTable students={paidStudents} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
