// usecases/course/createcourse.course.js
import Course from "../../models/course.model.js";

export const createCourse = async (courseData, user) => {
  try {
    // Validar que el usuario tenga permisos
    if (user.role !== 'admin' && user.role !== 'profesor') {
      throw new Error('No tienes permisos para crear cursos');
    }

    // Validar campos requeridos
    const requiredFields = ['title', 'description', 'category', 'level', 'duration'];
    for (const field of requiredFields) {
      if (!courseData[field]) {
        throw new Error(`El campo ${field} es requerido`);
      }
    }

    // Crear el curso con el usuario que lo crea
    const course = new Course({
      ...courseData,
      createdBy: user._id
    });

    await course.save();
    
    // Poblar la información del creador
    await course.populate('createdBy', 'name username email');

    return {
      success: true,
      course
    };
  } catch (error) {
    throw error;
  }
};