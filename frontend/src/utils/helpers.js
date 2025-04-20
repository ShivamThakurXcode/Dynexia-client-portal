export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount)
}

export function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}

export function getStatusColor(status) {
  const statusColors = {
    Completed: "bg-green-500",
    "In Progress": "bg-blue-500",
    Planning: "bg-amber-500",
    Review: "bg-purple-500",
    "On Hold": "bg-gray-500",
    "Not Started": "bg-gray-400",
    Paid: "bg-green-500",
    Unpaid: "bg-amber-500",
    Overdue: "bg-red-500",
    Pending: "bg-blue-500",
  }

  return statusColors[status] || "bg-gray-500"
}
