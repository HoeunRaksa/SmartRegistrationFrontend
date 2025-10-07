import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/Card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/Chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

export function PaymentChart({ payments }) {
  const chartData = useMemo(() => {
    const monthlyData = {}

    payments.forEach((payment) => {
      const month = new Date(payment.date).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })

      if (!monthlyData[month]) {
        monthlyData[month] = { paid: 0, unpaid: 0 }
      }

      if (payment.status === "paid") {
        monthlyData[month].paid += payment.amount
      } else {
        monthlyData[month].unpaid += payment.amount
      }
    })

    return Object.entries(monthlyData)
      .map(([month, data]) => ({
        month,
        paid: data.paid,
        unpaid: data.unpaid,
      }))
      .sort((a, b) => {
        const dateA = new Date(a.month)
        const dateB = new Date(b.month)
        return dateA.getTime() - dateB.getTime()
      })
  }, [payments])

  const chartConfig = {
    paid: {
      label: "Paid",
      color: "hsl(var(--chart-1))",
    },
    unpaid: {
      label: "Unpaid",
      color: "hsl(var(--chart-2))",
    },
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} tickMargin={10} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="paid" fill="var(--color-paid)" radius={4} />
            <Bar dataKey="unpaid" fill="var(--color-unpaid)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
