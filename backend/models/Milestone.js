const mongoose = require("mongoose")

const MilestoneSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a milestone name"],
    trim: true,
    maxlength: [100, "Milestone name cannot be more than 100 characters"],
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Completed", "In Progress", "Not Started"],
    default: "Not Started",
  },
  date: {
    type: Date,
    required: [true, "Please provide a milestone date"],
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
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

module.exports = mongoose.model("Milestone", MilestoneSchema)
