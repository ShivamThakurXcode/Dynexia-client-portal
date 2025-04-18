import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DashboardHeader } from "@/components/dashboard-header"
import { Download, FileText, Search } from "lucide-react"

export default function InvoicesPage() {
  // Sample data
  const invoices = [
    {
      id: "INV-001",
      date: "2023-11-01",
      dueDate: "2023-11-15",
      amount: 2500.0,
      status: "Paid",
      project: "Website Redesign",
    },
    {
      id: "INV-002",
      date: "2023-11-10",
      dueDate: "2023-11-24",
      amount: 1800.0,
      status: "Unpaid",
      project: "Mobile App Development",
    },
    {
      id: "INV-003",
      date: "2023-10-15",
      dueDate: "2023-10-29",
      amount: 3200.0,
      status: "Overdue",
      project: "Brand Identity",
    },
    {
      id: "INV-004",
      date: "2023-09-28",
      dueDate: "2023-10-12",
      amount: 950.0,
      status: "Paid",
      project: "Marketing Campaign",
    },
    {
      id: "INV-005",
      date: "2023-11-18",
      dueDate: "2023-12-02",
      amount: 1250.0,
      status: "Pending",
      project: "E-commerce Integration",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-green-500"
      case "Unpaid":
        return "bg-amber-500"
      case "Overdue":
        return "bg-red-500"
      case "Pending":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader heading="Invoices" text="Manage and track your invoices and payments." />
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Invoice Overview</CardTitle>
            <CardDescription>Track the status of your invoices and payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search invoices..." className="pl-8" />
              </div>
              <Button variant="outline">Filter</Button>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                Upload Invoice
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Project</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{formatDate(invoice.date)}</TableCell>
                      <TableCell>{formatDate(invoice.dueDate)}</TableCell>
                      <TableCell>{invoice.project}</TableCell>
                      <TableCell>{formatCurrency(invoice.amount)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          <span className={`mr-1.5 h-2 w-2 rounded-full ${getStatusColor(invoice.status)}`} />
                          {invoice.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Total Outstanding</CardTitle>
              <CardDescription>Unpaid and overdue invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$5,250.00</div>
              <p className="text-xs text-muted-foreground mt-1">3 invoices pending payment</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Paid This Month</CardTitle>
              <CardDescription>Invoices paid in November</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$3,450.00</div>
              <p className="text-xs text-muted-foreground mt-1">2 invoices paid this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Upcoming Payments</CardTitle>
              <CardDescription>Due in the next 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$3,050.00</div>
              <p className="text-xs text-muted-foreground mt-1">2 invoices due soon</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
