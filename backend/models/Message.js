const mongoose = require("mongoose")

const MessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Please provide message content"],
    trim: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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

// A message must have either a receiver or a project
MessageSchema.pre("save", function (next) {
  if (!this.receiver && !this.project) {
    next(new Error("Message must have either a receiver or a project"))
  } else {
    next()
  }
})

module.exports = mongoose.model("Message", MessageSchema)
