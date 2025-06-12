import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { authRoutes } from "./routes/auth"
import { courseRoutes } from "./routes/courses"
import { userRoutes } from "./routes/users"
import { lessonRoutes } from "./routes/lessons"
import { errorHandler } from "./middleware/errorHandler"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/courses", courseRoutes)
app.use("/api/users", userRoutes)
app.use("/api/lessons", lessonRoutes)

// Error handling
app.use(errorHandler)

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Freenglish API is running" })
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`)
})
