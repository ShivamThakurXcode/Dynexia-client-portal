const mongoose = require("mongoose")

const InvoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: [true, "Please provide an invoice number"],
    unique: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, "Please provide an invoice amount"],
    min: [0, "Amount cannot be negative"],
  },
  status: {
    type: String,
    enum: ["Paid", "Unpaid", "Overdue", "Pending"],
    default: "Pending",
  },
  dueDate: {
    type: Date,
    required: [true, "Please provide a due date"],
  },
  items: [
    {
      description: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      rate: {
        type: Number,
        required: true,
        min: 0,
      },
      amount: {
        type: Number,
        required: true,
        min: 0,
      },
    },
  ],
  notes: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Generate invoice number before saving
InvoiceSchema.pre("save", async function (next) {
  if (!this.invoiceNumber) {
    const count = await this.constructor.countDocuments()
    this.invoiceNumber = `INV-${String(count + 1).padStart(3, "0")}`
  }
  next()
})

module.exports = mongoose.model("Invoice", InvoiceSchema)
