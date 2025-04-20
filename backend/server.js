const express = require("express")
const dotenv = require("dotenv")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const morgan = require("morgan")
const path = require("path")
const fileUpload = require("express-fileupload")
const connectDB = require("./config/db")
const errorHandler = require("./middleware/error")
const rateLimit = require("express-rate-limit")
const helmet = require("helmet")
const xss = require("xss-clean")
const mongoSanitize = require("express-mongo-sanitize")
const hpp = require("hpp")

// Load env vars
dotenv.config()

// Connect to database
connectDB()

// Route files
const auth = require("./routes/auth")
const users = require("./routes/users")
const projects = require("./routes/projects")
const documents = require("./routes/documents")
const messages = require("./routes/messages")
const invoices = require("./routes/invoices")
const onboarding = require("./routes/onboarding")
const milestones = require("./routes/milestones")

const app = express()

// Body parser
app.use(express.json())

// Cookie parser
app.use(cookieParser())

// Dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}

// File upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    createParentPath: true,
  }),
)

// Security middleware
// Set security headers
app.use(helmet())

// Prevent XSS attacks
app.use(xss())

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100, // 100 requests per 10 mins
  message: "Too many requests from this IP, please try again after 10 minutes",
})
app.use("/api", limiter)

// Prevent NoSQL injection
app.use(mongoSanitize())

// Prevent parameter pollution
app.use(hpp())

// Enable CORS
app.use(cors())

// Set static folder
app.use(express.static(path.join(__dirname, "public")))

// Mount routers
app.use("/api/auth", auth)
app.use("/api/users", users)
app.use("/api/projects", projects)
app.use("/api/documents", documents)
app.use("/api/messages", messages)
app.use("/api/invoices", invoices)
app.use("/api/onboarding", onboarding)
app.use("/api/milestones", milestones)

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")))

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend", "build", "index.html"))
  })
}

// Error handler
app.use(errorHandler)

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`)
  // Close server & exit process
  server.close(() => process.exit(1))
})
