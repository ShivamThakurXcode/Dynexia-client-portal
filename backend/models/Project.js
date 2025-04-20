const mongoose = require("mongoose")

const ProjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a project name"],
    trim: true,
    maxlength: [100, "Project name cannot be more than 100 characters"],
  },
  description: {
    type: String,
    required: [true, "Please provide a project description"],
  },
  status: {
    type: String,
    enum: ["Planning", "In Progress", "Review", "On Hold", "Completed"],
    default: "Planning",
  },
  startDate: {
    type: Date,
    required: [true, "Please provide a start date"],
  },
  dueDate: {
    type: Date,
    required: [true, "Please provide a due date"],
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  team: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      role: {
        type: String,
        required: true,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Cascade delete milestones, documents, and messages when a project is deleted
ProjectSchema.pre("remove", async function (next) {
  await this.model("Milestone").deleteMany({ project: this._id })
  await this.model("Document").deleteMany({ project: this._id })
  await this.model("Message").deleteMany({ project: this._id })
  next()
})

module.exports = mongoose.model("Project", ProjectSchema)
