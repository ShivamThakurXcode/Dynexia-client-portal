const mongoose = require("mongoose")

const OnboardingSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: [true, "Please provide a company name"],
    trim: true,
  },
  website: {
    type: String,
    trim: true,
  },
  industry: {
    type: String,
    required: [true, "Please provide an industry"],
  },
  projectType: {
    type: String,
    required: [true, "Please provide a project type"],
  },
  projectGoals: {
    type: String,
    required: [true, "Please provide project goals"],
  },
  inspirationWebsites: {
    type: String,
  },
  brandColors: {
    type: String,
  },
  timeline: {
    type: String,
  },
  budget: {
    type: String,
  },
  additionalInfo: {
    type: String,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
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

module.exports = mongoose.model("Onboarding", OnboardingSchema)
