// controllers/course.controller.js
import { createCourse } from "../usecases/course/createcourse.course.js";
import { getCourses, getMyCourses, getCourseById, getAllCourses } from "../usecases/course/getcourses.course.js";
import { updateCourse } from "../usecases/course/updatecourse.course.js";
import { deleteCourse } from "../usecases/course/delete.course.js";
import { enrollCourse } from "../usecases/course/enroll.course.js";
import { updateProgress } from "../usecases/course/updateprogress.course.js";
import { uploadToCloudinary } from "../services/upload.service.js";
// controllers/course.controller.js
// controllers/course.controller.js
// controllers/course.controller.js

export const courseController = {
  create: async (req, res) => {
    try {
      // Procesar la imagen si viene en el request
      let imageData = null;
      if (req.file) {
        imageData = await uploadToCloudinary(req.file.buffer, 'courses');
      }

      // Combinar datos del curso con la imagen
      const courseData = {
        ...req.body,
        ...(imageData && {
          image: imageData.secure_url,
          imagePublicId: imageData.public_id
        })
      };

      // Parsear lessons si viene como string
      if (courseData.lessons && typeof courseData.lessons === 'string') {
        courseData.lessons = JSON.parse(courseData.lessons);
      }

      const result = await createCourse(courseData, req.user);
      
      res.status(201).json({
        success: true,
        message: "Curso creado correctamente",
        course: result.course
      });
    } catch (error) {
      console.error("Error en create course:", error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  update: async (req, res) => {
    try {
      const { courseId } = req.params;
      
      // Procesar nueva imagen si viene
      let imageData = null;
      if (req.file) {
        imageData = await uploadToCloudinary(req.file.buffer, 'courses');
      }

      // Combinar datos con nueva imagen
      const updateData = {
        ...req.body,
        ...(imageData && {
          image: imageData.secure_url,
          imagePublicId: imageData.public_id
        })
      };

      // Parsear lessons si viene como string
      if (updateData.lessons && typeof updateData.lessons === 'string') {
        updateData.lessons = JSON.parse(updateData.lessons);
      }

      const result = await updateCourse(courseId, updateData, req.user);
      
      res.json({
        success: true,
        message: "Curso actualizado correctamente",
        course: result.course
      });
    } catch (error) {
      console.error("Error en update course:", error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // Los otros métodos permanecen igual...
  delete: async (req, res) => {
    try {
      const { courseId } = req.params;
      const result = await deleteCourse(courseId, req.user);
      
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      console.error("Error en delete course:", error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  getAllCourses: async (req, res) => {
    try {
      const result = await getAllCourses(req.user);
      
      res.json({
        success: true,
        courses: result.courses
      });
    } catch (error) {
      console.error("Error en get all courses:", error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  getCourses: async (req, res) => {
    try {
      const result = await getCourses(req.query);
      
      res.json({
        success: true,
        courses: result.courses
      });
    } catch (error) {
      console.error("Error en get courses:", error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  getCourse: async (req, res) => {
    try {
      const { courseId } = req.params;
      const result = await getCourseById(courseId);
      
      res.json({
        success: true,
        course: result.course
      });
    } catch (error) {
      console.error("Error en get course:", error);
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  },

  getMyCourses: async (req, res) => {
    try {
      console.log("🌐 GET /course/getcourses - Query params:", req.query);

      const result = await getMyCourses(req.user._id);
      console.log("📤 Respuesta enviada - Cantidad de cursos:", result.courses.length);
      console.log("📤 Estructura de respuesta:", {
        success: result.success,
        coursesCount: result.courses.length
      });
      
      res.json({
        success: true,
        courses: result.courses
      });
    } catch (error) {
      console.error("Error en get my courses:", error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  },

  enroll: async (req, res) => {
    try {
      const { courseId } = req.params;
      const result = await enrollCourse(courseId, req.user._id);
      
      res.json({
        success: true,
        message: result.message,
        enrollment: result.enrollment
      });
    } catch (error) {
      console.error("Error en enroll course:", error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  updateProgress: async (req, res) => {
    try {
      const { enrollmentId } = req.params;
      const { progress } = req.body;
      
      const result = await updateProgress(enrollmentId, progress, req.user._id);
      
      res.json({
        success: true,
        message: result.message,
        enrollment: result.enrollment
      });
    } catch (error) {
      console.error("Error en update progress:", error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
};