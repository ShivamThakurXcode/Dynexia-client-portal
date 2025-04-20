const express = require("express")
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  addTeamMember,
  removeTeamMember,
} = require("../controllers/projects")

const router = express.Router()

const { protect, authorize } = require("../middleware/auth")

router.route("/").get(protect, getProjects).post(protect, createProject)

router.route("/:id").get(protect, getProject).put(protect, updateProject).delete(protect, deleteProject)

router.route("/:id/team").post(protect, addTeamMember)

router.route("/:id/team/:userId").delete(protect, removeTeamMember)

module.exports = router
