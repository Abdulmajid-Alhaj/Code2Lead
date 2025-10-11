import express from "express";
import {
  getCourses,
  getCourseById,
  getLessonById
} from "../../controllers/trainee/courseController.js";

const router = express.Router();

// 1️⃣ كل الكورسات
router.get("/", getCourses);

// 2️⃣ تفاصيل كورس محدد
router.get("/:courseId", getCourseById);

// 3️⃣ تفاصيل درس محدد ضمن كورس وشابتر
router.get("/:courseId/:chapterId/lessons/:lessonId", getLessonById);

export default router;
