const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")
const Project = require("../models/Project")
const Milestone = require("../models/Milestone")
const Document = require("../models/Document")
const Message = require("../models/Message")
const User = require("../models/User") // Add this line to import the User model

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
exports.getProjects = asyncHandler(async (req, res, next) => {
  let query

  // Copy req.query
  const reqQuery = { ...req.query }

  // Fields to exclude
  const removeFields = ["select", "sort", "page", "limit"]

  // Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param])

  // Create query string
  let queryStr = JSON.stringify(reqQuery)

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)

  // Finding resource
  // Find projects where user is owner or team member
  query = Project.find({
    $or: [{ user: req.user.id }, { "team.user": req.user.id }],
  })

  // Select Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ")
    query = query.select(fields)
  }

  // Sort
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ")
    query = query.sort(sortBy)
  } else {
    query = query.sort("-createdAt")
  }

  // Pagination
  const page = Number.parseInt(req.query.page, 10) || 1
  const limit = Number.parseInt(req.query.limit, 10) || 25
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await Project.countDocuments({
    $or: [{ user: req.user.id }, { "team.user": req.user.id }],
  })

  query = query.skip(startIndex).limit(limit)

  // Populate
  query = query.populate([
    {
      path: "user",
      select: "name email image",
    },
    {
      path: "team.user",
      select: "name email image",
    },
  ])

  // Executing query
  const projects = await query

  // Pagination result
  const pagination = {}

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    }
  }

  res.status(200).json({
    success: true,
    count: projects.length,
    pagination,
    data: projects,
  })
})

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id)
    .populate({
      path: "user",
      select: "name email image",
    })
    .populate({
      path: "team.user",
      select: "name email image",
    })

  if (!project) {
    return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404))
  }

  // Make sure user is project owner or team member
  if (
    project.user._id.toString() !== req.user.id &&
    !project.team.some((member) => member.user._id.toString() === req.user.id)
  ) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to access this project`, 401))
  }

  // Get milestones, documents, and messages for this project
  const milestones = await Milestone.find({ project: project._id })
  const documents = await Document.find({ project: project._id }).populate({
    path: "user",
    select: "name email image",
  })
  const messages = await Message.find({ project: project._id }).populate({
    path: "sender",
    select: "name email image role",
  })

  res.status(200).json({
    success: true,
    data: {
      ...project._doc,
      milestones,
      documents,
      messages,
    },
  })
})

// @desc    Create new project
// @route   POST /api/projects
// @access  Private
exports.createProject = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id

  const project = await Project.create(req.body)

  res.status(201).json({
    success: true,
    data: project,
  })
})

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
exports.updateProject = asyncHandler(async (req, res, next) => {
  let project = await Project.findById(req.params.id)

  if (!project) {
    return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404))
  }

  // Make sure user is project owner or team member
  if (
    project.user.toString() !== req.user.id &&
    !project.team.some((member) => member.user.toString() === req.user.id)
  ) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to update this project`, 401))
  }

  // Update the updatedAt field
  req.body.updatedAt = Date.now()

  project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    success: true,
    data: project,
  })
})

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
exports.deleteProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id)

  if (!project) {
    return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404))
  }

  // Make sure user is project owner
  if (project.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this project`, 401))
  }

  await project.remove()

  res.status(200).json({
    success: true,
    data: {},
  })
})

// @desc    Add team member to project
// @route   POST /api/projects/:id/team
// @access  Private
exports.addTeamMember = asyncHandler(async (req, res, next) => {
  const { userId, role } = req.body

  // Check if project exists
  const project = await Project.findById(req.params.id)

  if (!project) {
    return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404))
  }

  // Make sure user is project owner
  if (project.user.toString() !== req.user.id) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to add team members to this project`, 401))
  }

  // Check if user exists
  const user = await User.findById(userId)

  if (!user) {
    return next(new ErrorResponse(`User not found with id of ${userId}`, 404))
  }

  // Check if user is already a team member
  if (project.team.some((member) => member.user.toString() === userId)) {
    return next(new ErrorResponse(`User ${userId} is already a team member`, 400))
  }

  // Add team member
  project.team.push({ user: userId, role })
  await project.save()

  res.status(200).json({
    success: true,
    data: project,
  })
})

// @desc    Remove team member from project
// @route   DELETE /api/projects/:id/team/:userId
// @access  Private
exports.removeTeamMember = asyncHandler(async (req, res, next) => {
  // Check if project exists
  const project = await Project.findById(req.params.id)

  if (!project) {
    return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404))
  }

  // Make sure user is project owner
  if (project.user.toString() !== req.user.id) {
    return next(
      new ErrorResponse(`User ${req.user.id} is not authorized to remove team members from this project`, 401),
    )
  }

  // Check if user is a team member
  const teamMemberIndex = project.team.findIndex((member) => member.user.toString() === req.params.userId)

  if (teamMemberIndex === -1) {
    return next(new ErrorResponse(`User ${req.params.userId} is not a team member`, 400))
  }

  // Remove team member
  project.team.splice(teamMemberIndex, 1)
  await project.save()

  res.status(200).json({
    success: true,
    data: project,
  })
})
