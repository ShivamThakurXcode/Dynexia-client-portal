const path = require("path")
const ErrorResponse = require("../utils/errorResponse")
const asyncHandler = require("../middleware/async")
const Document = require("../models/Document")
const Project = require("../models/Project")
const cloudinary = require("../utils/cloudinary")

// @desc    Get all documents
// @route   GET /api/documents
// @access  Private
exports.getDocuments = asyncHandler(async (req, res, next) => {
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

  // Finding resource - documents where user is owner or project team member
  query = Document.find({
    $or: [
      { user: req.user.id },
      {
        project: {
          $in: await Project.find({
            $or: [{ user: req.user.id }, { "team.user": req.user.id }],
          }).distinct("_id"),
        },
      },
    ],
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
  const total = await Document.countDocuments({
    $or: [
      { user: req.user.id },
      {
        project: {
          $in: await Project.find({
            $or: [{ user: req.user.id }, { "team.user": req.user.id }],
          }).distinct("_id"),
        },
      },
    ],
  })

  query = query.skip(startIndex).limit(limit)

  // Populate
  query = query.populate([
    {
      path: "user",
      select: "name email",
    },
    {
      path: "project",
      select: "name",
    },
  ])

  // Executing query
  const documents = await query

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
    count: documents.length,
    pagination,
    data: documents,
  })
})

// @desc    Get single document
// @route   GET /api/documents/:id
// @access  Private
exports.getDocument = asyncHandler(async (req, res, next) => {
  const document = await Document.findById(req.params.id)
    .populate({
      path: "user",
      select: "name email",
    })
    .populate({
      path: "project",
      select: "name user team",
      populate: {
        path: "user team.user",
        select: "name email",
      },
    })

  if (!document) {
    return next(new ErrorResponse(`Document not found with id of ${req.params.id}`, 404))
  }

  // Make sure user is document owner or project owner/team member
  if (
    document.user._id.toString() !== req.user.id &&
    document.project &&
    document.project.user._id.toString() !== req.user.id &&
    !document.project.team.some((member) => member.user._id.toString() === req.user.id)
  ) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to access this document`, 401))
  }

  res.status(200).json({
    success: true,
    data: document,
  })
})

// @desc    Upload document
// @route   POST /api/documents
// @access  Private
exports.uploadDocument = asyncHandler(async (req, res, next) => {
  // Check if project exists and user has access
  if (req.body.project) {
    const project = await Project.findById(req.body.project)

    if (!project) {
      return next(new ErrorResponse(`Project not found with id of ${req.body.project}`, 404))
    }

    // Make sure user is project owner or team member
    if (
      project.user.toString() !== req.user.id &&
      !project.team.some((member) => member.user.toString() === req.user.id)
    ) {
      return next(new ErrorResponse(`User ${req.user.id} is not authorized to upload to this project`, 401))
    }
  }

  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400))
  }

  const file = req.files.file

  // Make sure the file is a document
  if (
    !file.mimetype.startsWith("image") &&
    !file.mimetype.startsWith("application") &&
    !file.mimetype.startsWith("text")
  ) {
    return next(new ErrorResponse(`Please upload a valid document file`, 400))
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(new ErrorResponse(`Please upload a file less than ${process.env.MAX_FILE_UPLOAD / 1000000}MB`, 400))
  }

  // Upload file to Cloudinary
  const result = await cloudinary.uploader.upload(file.tempFilePath, {
    folder: "dynexia/documents",
    resource_type: "auto",
  })

  // Create document in database
  const document = await Document.create({
    name: file.name,
    url: result.secure_url,
    size: file.size,
    type: file.mimetype,
    description: req.body.description || "",
    documentType: req.body.documentType || "",
    user: req.user.id,
    project: req.body.project || null,
  })

  res.status(201).json({
    success: true,
    data: document,
  })
})

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private
exports.deleteDocument = asyncHandler(async (req, res, next) => {
  const document = await Document.findById(req.params.id).populate({
    path: "project",
    select: "user team",
  })

  if (!document) {
    return next(new ErrorResponse(`Document not found with id of ${req.params.id}`, 404))
  }

  // Make sure user is document owner or project owner
  if (
    document.user.toString() !== req.user.id &&
    document.project &&
    document.project.user.toString() !== req.user.id
  ) {
    return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete this document`, 401))
  }

  // Delete file from Cloudinary
  if (document.url) {
    const publicId = document.url.split("/").pop().split(".")[0]
    await cloudinary.uploader.destroy(`dynexia/documents/${publicId}`)
  }

  await document.remove()

  res.status(200).json({
    success: true,
    data: {},
  })
})
