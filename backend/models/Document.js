const mongoose = require("mongoose")

const DocumentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a document name"],
    trim: true,
    maxlength: [200, "Document name cannot be more than 200 characters"],
  },
  url: {
    type: String,
    required: [true, "Please provide a document URL"],
  },
  size: {
    type: Number,
    required: [true, "Please provide a document size"],
  },
  type: {
    type: String,
    required: [true, "Please provide a document type"],
  },
  description: {
    type: String,
  },
  documentType: {
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

module.exports = mongoose.model("Document", DocumentSchema)
