import { Router } from "express"
import { getAllCourses, getCourseById, getCoursesByLevel } from "../controllers/courseController"

const router = Router()

router.get("/", getAllCourses)
router.get("/:id", getCourseById)
router.get("/level/:level", getCoursesByLevel)

export { router as courseRoutes }
