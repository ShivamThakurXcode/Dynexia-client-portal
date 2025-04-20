const express = require("express")
const { getDocuments, getDocument, uploadDocument, deleteDocument } = require("../controllers/documents")

const router = express.Router()

const { protect } = require("../middleware/auth")

router.route("/").get(protect, getDocuments).post(protect, uploadDocument)

router.route("/:id").get(protect, getDocument).delete(protect, deleteDocument)

module.exports = router
