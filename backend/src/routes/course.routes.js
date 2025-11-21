// routes/course.routes.js
import { Router } from "express";
import { courseController } from "../controllers/course.controller.js";
import { auth, adminAuth } from "../services/auth.js";
import { upload } from "../services/upload.service.js";

const router = Router();

// Rutas públicas
// routes/course.routes.js

// Rutas públicas
router.get("/getcourses", courseController.getCourses);
router.get("/:courseId", courseController.getCourse);

// Rutas protegidas para usuarios normales
router.get("/my-courses", auth, courseController.getMyCourses);
router.post("/enroll/:courseId", auth, courseController.enroll);
router.put("/progress/:enrollmentId", auth, courseController.updateProgress);

// Rutas para administradores y profesores - CON SUBIDA DE IMÁGENES
router.post("/create", adminAuth, upload.single('image'), courseController.create);
router.put("/update/:courseId", adminAuth, upload.single('image'), courseController.update);

// Rutas solo para administradores
router.delete("/:courseId", adminAuth, courseController.delete);
router.get("/admin/all-courses", adminAuth, courseController.getAllCourses);

export default router;