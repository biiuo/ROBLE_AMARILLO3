// usecases/courses/getCourses.user.js
import Course from "../../models/course.model.js";
import Enrollment from "../../models/enrollment.model.js";

export const getCourses = async (filters = {}) => {
  try {
    console.log("🔍 Filtros recibidos:", filters);
    const query = { isPublished: true };
    
    if (filters.category) query.category = filters.category;
    if (filters.level) query.level = filters.level;
    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: 'i' } },
        { description: { $regex: filters.search, $options: 'i' } }
      ];
    }
    
    console.log("📋 Query construido:", query);

    const courses = await Course.find(query)
      .select('title description category level image duration price isPublished createdBy lessons createdAt') // Selecciona explícitamente los campos
      .populate('createdBy', 'name username')
      .sort({ createdAt: -1 });
      
    console.log("✅ Cursos encontrados:", courses.length);
    console.log("📦 Primer curso:", courses[0] ? {
      _id: courses[0]._id,
      title: courses[0].title,
      category: courses[0].category,
      level: courses[0].level,
      image: courses[0].image, // ← Ahora debería aparecer
      isPublished: courses[0].isPublished
    } : "No hay cursos");
    
    return ({
      success: true,
      courses
    });

  } catch (error) {
    console.error("Error getting courses:", error);
    throw error;
  }
};

export const getCourseById = async (courseId) => {
  try {
    const course = await Course.findById(courseId)
      .select('title description category level image duration price isPublished createdBy lessons') // Incluye image
      .populate('createdBy', 'name username email');

    if (!course) {
      throw new Error("Curso no encontrado");
    }

    return {
      success: true,
      course
    };
  } catch (error) {
    console.error("Error getting course by ID:", error);
    throw error;
  }
};

// usecases/courses/getCourses.user.js (ejemplo de otros use cases)
export const getAllCourses = async (user) => {
  try {
    // Solo administradores pueden ver todos los cursos
    if (user.role !== 'admin') {
      throw new Error("Se requieren permisos de administrador");
    }

    const courses = await Course.find()
      .populate('createdBy', 'name username')
      .sort({ createdAt: -1 });

    return {
      success: true,
      courses
    };
  } catch (error) {
    console.error("Error getting all courses:", error);
    throw error;
  }
};

export const getMyCourses = async (userId) => {
  try {
    const enrollments = await Enrollment.find({ user: userId })
      .populate({
        path: 'course',
        populate: {
          path: 'createdBy',
          select: 'name username email'
        }
      })
      .sort({ updatedAt: -1 });

    const courses = enrollments.map(enrollment => ({
      ...enrollment.course.toObject(),
      progress: enrollment.progress,
      completed: enrollment.completed,
      currentLesson: enrollment.currentLesson,
      enrollmentId: enrollment._id,
      enrolledAt: enrollment.enrolledAt
    }));

    return {
      success: true,
      courses
    };
  } catch (error) {
    console.error("Error en getMyCourses:", error);
    throw new Error('Error al obtener los cursos del usuario');
  }
};