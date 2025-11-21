// usecases/courses/enrollCourse.user.js
import Course from "../../models/course.model.js";
import Enrollment from "../../models/enrollment.model.js";

export const enrollCourse = async (courseId, userId) => {
  try {
    const course = await Course.findById(courseId);
    
    if (!course) {
      throw new Error("Curso no encontrado");
    }

    if (!course.isPublished) {
      throw new Error("Este curso no está disponible");
    }

    // Verificar si ya está inscrito
    const existingEnrollment = await Enrollment.findOne({
      user: userId,
      course: courseId
    });

    if (existingEnrollment) {
      throw new Error("Ya estás inscrito en este curso");
    }

    // Crear nueva inscripción
    const enrollment = new Enrollment({
      user: userId,
      course: courseId,
      progress: 0,
      completed: false
    });

    await enrollment.save();

    // Populate para devolver datos completos
    await enrollment.populate({
      path: 'course',
      populate: {
        path: 'createdBy',
        select: 'name username'
      }
    });

    return {
      success: true,
      enrollment,
      message: "Inscrito al curso correctamente"
    };
  } catch (error) {
    console.error("Error enrolling in course:", error);
    throw error;
  }
};