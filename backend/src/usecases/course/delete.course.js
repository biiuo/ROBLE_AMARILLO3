import Course from "../../models/course.model.js";
import Enrollment from "../../models/enrollment.model.js";
export const deleteCourse = async (courseId, user) => {
  try {
    // Solo administradores pueden eliminar cursos
    if (user.role !== 'admin') {
      throw new Error("Solo los administradores pueden eliminar cursos");
    }

    const course = await Course.findById(courseId);
    
    if (!course) {
      throw new Error("Curso no encontrado");
    }

    // Eliminar todas las inscripciones relacionadas
    await Enrollment.deleteMany({ course: courseId });

    // Eliminar el curso
    await Course.findByIdAndDelete(courseId);

    return {
      success: true,
      message: "Curso y todas sus inscripciones eliminadas correctamente"
    };
  } catch (error) {
    console.error("Error deleting course:", error);
    throw error;
  }
};